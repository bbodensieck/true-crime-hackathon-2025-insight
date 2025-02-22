import React, { useState, useRef, useEffect } from 'react';
import Timeline from './Timeline'; // Adjust the path as necessary
import ReactPlayer from 'react-player';

const VideoPlayer: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
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

  const handleSeek = (time: number) => {
    playerRef.current?.seekTo(time, 'seconds');
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
      <Timeline
        currentTime={currentTime}
        duration={duration}
        nonsilentRanges={nonsilentRanges}
        onSeek={handleSeek}
      />
    </div>
  );
};

export default VideoPlayer;