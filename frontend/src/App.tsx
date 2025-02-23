import Button from '@mui/material/Button';
import './App.css';
import VideoPlayer from './VideoPlayer';
import Papa from 'papaparse';
import { useEffect, useState } from 'react';
import Marker from './interfaces/marker';
import Range from './interfaces/range';

function App() {
  const [ranges, setRanges] = useState<Range[]>([]);
  const [markers, setMarkers] = useState<Marker[]>([]);

  useEffect(() => {
    fetch('nonsilent_ranges.json')
      .then(response => response.json())
      .then(data => setRanges(data))
      .catch(error => console.error('Error fetching ranges:', error));

    fetch('http://localhost:3001/api/markers')
      .then(response => response.json())
      .then(data => setMarkers(data))
      .catch(error => console.error('Error fetching markers:', error));
  }, []);

  const downloadCSV = () => {
    const rangesData = ranges.map(range => ({
      type: 'range',
      id: range.id,
      start: range.start,
      end: range.end,
      duration: range.duration,
      title: range.event_type,
      event_type: range.event_type
    }));

    const markersData = markers.map(marker => ({
      type: 'marker',
      id: marker.id,
      start: marker.time,
      end: marker.time,
      duration: 0,
      title: marker.title,
      event_type: marker.eventType
    }));
    console.log(markersData);

    const csvData = [...rangesData, ...markersData];
    const csv = Papa.unparse(csvData);

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'ranges_markers.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  

  return (
    <>
      <h1>Videoanalyse</h1>

      <div>
        <VideoPlayer />
      </div>

      <div className="card">
        <p className="Transcript">
          Transscript des Videos
          
        </p>
      </div>
      <p className="read-the-docs">
        Klick auf die Chapters zum abspielen
      </p>
      <Button onClick={downloadCSV}>Download CSV</Button>
    </>
  )
}
export default App
