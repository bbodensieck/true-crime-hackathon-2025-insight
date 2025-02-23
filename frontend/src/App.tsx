import Button from '@mui/material/Button';
import './App.css';
import VideoPlayer from './VideoPlayer';
import Papa from 'papaparse';
import { useEffect, useState } from 'react';
import Marker from './interfaces/marker';
import Range from './interfaces/range';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import CollectionsIcon from '@mui/icons-material/Collections';
import DownloadIcon from '@mui/icons-material/Download';
import { timeStringToSeconds } from './utils';

function App() {
  const [ranges, setRanges] = useState<Range[]>([]);
  const [customMarkers, setCustomMarkers] = useState<Marker[]>([]);
  const [aiMarkers, setAiMarkers] = useState<Marker[]>([]);
  const [conclusion, setConclusion] = useState('');

  useEffect(() => {
    fetch('nonsilent_ranges.json')
      .then(response => response.json())
      .then(data => setRanges(data))
      .catch(error => console.error('Error fetching ranges:', error));

    fetch('http://localhost:3001/api/markers')
      .then(response => response.json())
      .then(data => setCustomMarkers(data))
      .catch(error => console.error('Error fetching markers:', error));

    fetch('/ai_output.json')
      .then(response => response.json())
      .then(data => {
        const chapterMarkers: Marker[] = data.chapters.map((chapter: { time: string; title: string }) => ({
          title: chapter.title,
          time: timeStringToSeconds(chapter.time),
          eventType: 'ai-marker',
          videoClipId: 1
        }));
        setAiMarkers(chapterMarkers);
        setConclusion(data.conclution);
      })
      .catch(error => console.error('Error fetching AI output:', error));
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

    const customMarkersData = customMarkers.map(marker => ({
      type: 'marker',
      id: marker.id,
      start: marker.time,
      end: marker.time,
      duration: 0,
      title: marker.title,
      event_type: 'custom-marker'
    }));

    const aiMarkersData = aiMarkers.map(marker => ({
      type: 'marker',
      id: marker.id,
      start: marker.time,
      end: marker.time,
      duration: 0,
      title: marker.title,
      event_type: 'ai-marker'
    }));

    const csvData = [...rangesData, ...customMarkersData, ...aiMarkersData];
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
      <BottomNavigation
        showLabels
        value={0}
        onChange={(event, newValue) => {
          if (newValue === 2) {
            downloadCSV();
            return;
          }
          alert('not yet implemented');
        }}
      >
        <BottomNavigationAction label="Alle videos" icon={<CollectionsIcon />} />
        <BottomNavigationAction label="Upload video" icon={<UploadIcon />} />
        <BottomNavigationAction label="Download CSV" icon={<DownloadIcon />} />
      </BottomNavigation>
      <div className="card">
        <p className="conclusion">
          {conclusion}
        </p>
      </div>
      <div>
        <VideoPlayer />
      </div>
    </>
  )
}
export default App
