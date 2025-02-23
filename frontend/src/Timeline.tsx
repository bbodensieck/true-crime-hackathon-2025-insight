import React, { useState } from 'react';
import './Timeline.css'; // Create and import a CSS file for styling
import Marker from './interfaces/marker';
import Range from './interfaces/range';

interface TimelineProps {
  currentTime: number;
  duration: number;
  nonsilentRanges: Range[];
  markers: Marker[];
  onSeek: (time: number) => void;
}

const Timeline: React.FC<TimelineProps> = ({ currentTime, duration, nonsilentRanges, markers, onSeek }) => {
  const [selectedRange, setSelectedRange] = useState<{ start: number; end: number; event_type: string; max_amplitude: number; duration: number } | null>(null);

  const handleClick = (range: { start: number; end: number; event_type: string; max_amplitude: number; duration: number }) => {
    onSeek(range.start);
    setSelectedRange(range);
  };

  const getMarkersInRange = (range: { start: number; end: number }) => {
    return markers.filter(marker => marker.time >= range.start && marker.time <= range.end);
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
                <p>Time: {marker.time.toFixed(1)}s</p>
                <p>Title: {marker.title}</p>
                <p>Event Type: {marker.eventType}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Timeline;