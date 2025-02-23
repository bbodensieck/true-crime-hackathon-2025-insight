import React, { useState, useRef, useEffect } from 'react';
import Timeline from './Timeline'; // Adjust the path as necessary
import ReactPlayer from 'react-player';

const VideoPlayer: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [markers, setMarkers] = useState<{ time: number; eventType: string; title: string }[]>([]);
  const playerRef = useRef<ReactPlayer>(null);

  const [nonsilentRanges, setNonsilentRanges] = useState<{ start: number; end: number; event_type: string; max_amplitude: number; duration: number }[]>([]);

  useEffect(() => {
    fetch('nonsilent_ranges.json')
      .then(response => response.json())
      .then(data => {
        const lastRange = data[data.length - 1];
        if (lastRange.end < duration) {
          data.push({
            start: lastRange.end,
            end: duration,
            event_type: 'silence',
            max_amplitude: 0,
            duration: duration - lastRange.end
          });
        }
        setNonsilentRanges(data);
      })
      .catch(error => console.error('Error fetching nonsilent ranges:', error));
  }, [duration]);

  useEffect(() => {
    fetch('http://localhost:3001/api/markers')
      .then(response => response.json())
      .then(data => {
        setMarkers(data);
      })
      .catch(error => console.error('Error fetching markers:', error));
  }, []);

  const handleSeek = (time: number) => {
    playerRef.current?.seekTo(time, 'seconds');
  };

  const handleCreateMarker = async () => {
    const newMarker = {
      time: currentTime,
      eventType: 'marker',
      title: `Marker at ${currentTime.toFixed(1)}s`,
      videoClipId: 1 // Assuming you have a videoClipId, adjust as necessary
    };

    try {
      const response = await fetch('http://localhost:3001/api/markers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newMarker)
      });

      if (response.ok) {
        const createdMarker = await response.json();
        setMarkers([...markers, createdMarker]);
      } else {
        console.error('Failed to create marker');
      }
    } catch (error) {
      console.error('Error creating marker:', error);
    }
  };

  return (
    <div>
      <ReactPlayer
        ref={playerRef}
        url="PXL_20250222_123802359.mp4"
        onProgress={({ playedSeconds }) => setCurrentTime(playedSeconds)}
        onDuration={setDuration}
        controls
      />
      <button onClick={handleCreateMarker}>Create Marker</button>
      <Timeline
        currentTime={currentTime}
        duration={duration}
        nonsilentRanges={nonsilentRanges}
        markers={markers}
        onSeek={handleSeek}
      />
    </div>
  );
};

export default VideoPlayer;