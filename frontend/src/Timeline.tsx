import React, { useState } from 'react';
import './Timeline.css'; // Create and import a CSS file for styling

interface TimelineProps {
  currentTime: number;
  duration: number;
  nonsilentRanges: { start: number; end: number; event_type: string; max_amplitude: number; duration: number }[];
  onSeek: (time: number) => void;
}

const Timeline: React.FC<TimelineProps> = ({ currentTime, duration, nonsilentRanges, onSeek }) => {
  const [selectedRange, setSelectedRange] = useState<{ start: number; end: number; event_type: string; max_amplitude: number; duration: number } | null>(null);

  const handleClick = (range: { start: number; end: number; event_type: string; max_amplitude: number; duration: number }) => {
    onSeek(range.start);
    setSelectedRange(range);
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
        <div
          className="current-time-indicator"
          style={{ left: `${(currentTime / duration) * 100}%` }}
        />
      </div>
      {selectedRange && (
        <div className="range-details">
          <p>Start: {selectedRange.start.toFixed(1)}s</p>
          <p>End: {selectedRange.end.toFixed(1)}s</p>
          <p>Duration: {selectedRange.duration.toFixed(1)}s</p>
          {selectedRange.event_type !== 'silence' && (
            <p>Max Amplitude: {selectedRange.max_amplitude}</p>
          )}
          <p>Event Type: {selectedRange.event_type}</p>
        </div>
      )}
    </div>
  );
};

export default Timeline;