import React, { useEffect, useRef, useState } from 'react';
import './Timeline.css'; // Create and import a CSS file for styling
import Marker from './interfaces/marker';
import Range from './interfaces/range';
import { TextField, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';


interface TimelineProps {
  currentTime: number;
  duration: number;
  nonsilentRanges: Range[];
  markers: Marker[];
  onSeek: (time: number) => void;
  onDeleteMarker: (id: number) => void;
  onEditMarker: (marker: Marker) => void;
}

const Timeline: React.FC<TimelineProps> = ({ currentTime, duration, nonsilentRanges, markers, onSeek, onDeleteMarker, onEditMarker }) => {
  const [selectedRange, setSelectedRange] = useState<Range | null>(null);
  const [editingMarkerId, setEditingMarkerId] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = (range: Range) => {
    onSeek(range.start);
    setSelectedRange(range);
  };

  const getMarkersInRange = (range: { start: number; end: number }) => {
    return markers.filter(marker => marker.time >= range.start && marker.time <= range.end);
  };

  const handleEditClick = (marker: Marker) => {
    setEditingMarkerId(marker.id!);
    setEditedTitle(marker.title);
  };

  useEffect(() => {
    if (editingMarkerId !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingMarkerId]);

  const handleSaveClick = (marker: Marker) => {
    const updatedMarker = { ...marker, title: editedTitle };
    onEditMarker(updatedMarker);
    setEditingMarkerId(null);
  };

  return (
    <div>
      <div className="timeline">
        {nonsilentRanges.map((range, index) => (
          <div
            key={index}
            className={`range ${range.event_type}`}
            style={{
              left: `${(range.start / duration) * 100}%`,
              width: `${((range.end - range.start) / duration) * 100}%`
            }}
            onClick={() => handleClick(range)}
          />
        ))}
        {markers.map((marker, index) => (
          <div
            key={index}
            className="marker"
            style={{ left: `${(marker.time / duration) * 100}%` }}
            onClick={() => onSeek(marker.time)}
          />
        ))}
        <div
          className="current-time-indicator"
          style={{ left: `${(currentTime / duration) * 100}%` }}
        />
      </div>
      {selectedRange && (
        <div className="range-details-container">
          <div className="range-details">
            <p>Start: {selectedRange.start.toFixed(1)}s</p>
            <p>End: {selectedRange.end.toFixed(1)}s</p>
            <p>Duration: {selectedRange.duration.toFixed(1)}s</p>
            {selectedRange.event_type !== 'silence' && (
              <p>Max Amplitude: {selectedRange.max_amplitude}</p>
            )}
            <p>Event Type: {selectedRange.event_type}</p>
          </div>
          <div className="markers-in-range">
            {getMarkersInRange(selectedRange).length > 0 && <h4>Markers in Range:</h4>}
            {getMarkersInRange(selectedRange).map((marker, index) => (
              <div className="marker-item" key={index}>
                <div className="marker-details">
                  <p>Time: {marker.time.toFixed(1)}s</p>
                  {editingMarkerId === marker.id ? (
                    <TextField
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      variant="outlined"
                      placeholder="Title"
                      size="small"
                      inputRef={inputRef}
                    />
                  ) : (
                    <p>Title: {marker.title}</p>
                  )}
                  <p>Event Type: {marker.eventType}</p>
                </div>
                <div className="marker-actions">
                  {editingMarkerId === marker.id ? (
                    <IconButton onClick={() => handleSaveClick(marker)} color="primary">
                      <SaveIcon />
                    </IconButton>
                  ) : (
                    <IconButton onClick={() => handleEditClick(marker)} color="primary">
                      <EditIcon />
                    </IconButton>
                  )}
                  <IconButton onClick={() => onDeleteMarker(marker.id!)} color="primary">
                    <DeleteIcon />
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Timeline;