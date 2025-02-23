import React, { useState, useRef, useEffect } from 'react';
import Timeline from './Timeline'; // Adjust the path as necessary
import ReactPlayer from 'react-player';
import Marker from './interfaces/marker';
import Range from './interfaces/range';
import './VideoPlayer.css'; // Create and import a CSS file for styling
import { Button } from '@mui/material';
import { timeStringToSeconds } from './utils';

interface VideoPlayerProps {
  transcript: { start: number; end: number; text: string }[];
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ transcript }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [aiMarkers, setAiMarkers] = useState<Marker[]>([]);
  const [customMarkers, setCustomMarkers] = useState<Marker[]>([]);
  const playerRef = useRef<ReactPlayer>(null);

  const [nonsilentRanges, setNonsilentRanges] = useState<Range[]>([]);

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
        setCustomMarkers(data);
      })
      .catch(error => console.error('Error fetching markers:', error));

    fetch('/ai_output.json')
      .then(response => response.json())
      .then(data => {
        const chapterMarkers: Marker[] = data.chapters.map((chapter: { time: string; title: string }, index: number) => ({
          id: index + 10000,
          title: chapter.title,
          time: timeStringToSeconds(chapter.time),
          eventType: 'ai-marker',
          videoClipId: 1
        }));
        setAiMarkers(chapterMarkers);
      })
      .catch(error => console.error('Error fetching AI output:', error));
  }, []);

  const handleSeek = (time: number) => {
    playerRef.current?.seekTo(time, 'seconds');
  };

  const handleCreateMarker = async () => {
    const newMarker: Marker = {
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
        setCustomMarkers([...customMarkers, createdMarker]);
      } else {
        console.error('Failed to create marker');
      }
    } catch (error) {
      console.error('Error creating marker:', error);
    }
  };

  const handleDeleteMarker = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3001/api/markers/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setCustomMarkers(customMarkers.filter(marker => marker.id !== id));
      } else {
        console.error('Failed to delete marker');
      }
    } catch (error) {
      console.error('Error deleting marker:', error);
    }
  };

  const handleEditMarker = (updatedMarker: Marker) => {
    fetch(`http://localhost:3001/api/markers/${updatedMarker.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedMarker)
    })
      .then(response => {
        if (response.ok) {
          setCustomMarkers(customMarkers.map(m => (m.id === updatedMarker.id ? updatedMarker : m)));
        } else {
          console.error('Failed to update marker');
        }
      })
      .catch(error => console.error('Error updating marker:', error));
  };

  return (
    <div className="video-player-container">
      <div className="video-transcript-container">
        <div className="video-player">
          <ReactPlayer
            ref={playerRef}
            url="PXL_20250222_123802359.mp4"
            onProgress={({ playedSeconds }) => setCurrentTime(playedSeconds)}
            onDuration={setDuration}
            controls
          />
          <Button onClick={handleCreateMarker}>Create Marker</Button>
        </div>
        <div className="transcript">
          <h2>Transkript</h2>
          {transcript.map((entry: { start: number; end: number; text: string }, index: number) => (
            <p key={index}>
            <strong onClick={() => handleSeek(entry.start)} style={{ cursor: 'pointer' }}>
              {entry.start.toFixed(2)} - {entry.end.toFixed(2)}:
            </strong> {entry.text}
          </p>
          ))}
        </div>
      </div>
      <Timeline
        currentTime={currentTime}
        duration={duration}
        nonsilentRanges={nonsilentRanges}
        customMarkers={customMarkers}
        aiMarkers={aiMarkers}
        onSeek={handleSeek}
        onDeleteMarker={handleDeleteMarker}
        onEditMarker={handleEditMarker}
      />
    </div>
  );
};

export default VideoPlayer;