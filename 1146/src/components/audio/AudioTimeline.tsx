import React, { useRef, useEffect } from 'react';
import { Play, Pause, FastForward, Volume2 } from 'lucide-react';

interface AudioEvent {
  timestamp: number;
  volume: number;
  duration: number;
  blob: Blob;
}

interface AudioTimelineProps {
  events: AudioEvent[];
  currentTime: number;
  isPlaying: boolean;
  onSeek: (time: number) => void;
  onPlayPause: () => void;
}

const AudioTimeline: React.FC<AudioTimelineProps> = ({
  events,
  currentTime,
  isPlaying,
  onSeek,
  onPlayPause,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw time markers
    ctx.fillStyle = '#475569';
    for (let hour = 0; hour < 24; hour++) {
      const x = (hour / 24) * canvas.width;
      ctx.fillRect(x, 0, 1, canvas.height);
      
      // Add hour labels
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px sans-serif';
      ctx.fillText(`${hour}:00`, x + 2, 10);
    }

    // Draw events
    events.forEach(event => {
      const x = (event.timestamp / (24 * 60 * 60 * 1000)) * canvas.width;
      const height = (event.volume / 100) * (canvas.height - 20);
      
      // Create gradient
      const gradient = ctx.createLinearGradient(x, canvas.height - height, x, canvas.height);
      gradient.addColorStop(0, '#60a5fa');
      gradient.addColorStop(1, '#3b82f6');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, canvas.height - height, 2, height);
    });

    // Draw playhead
    const playheadX = (currentTime / (24 * 60 * 60 * 1000)) * canvas.width;
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(playheadX, 0, 2, canvas.height);
  }, [events, currentTime]);

  const handleTimelineClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const time = (x / canvas.width) * 24 * 60 * 60 * 1000;
    onSeek(time);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onPlayPause}
            className="p-2 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <div className="text-sm text-gray-600">
            {new Date(currentTime).toLocaleTimeString()}
          </div>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Volume2 className="w-4 h-4" />
          <span>Loudest event: {Math.max(...events.map(e => e.volume))} dB</span>
        </div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full h-40 rounded-lg cursor-pointer"
          width={800}
          height={160}
          onClick={handleTimelineClick}
        />
        <div className="absolute inset-0 pointer-events-none rounded-lg bg-gradient-radial from-transparent to-white/5" />
      </div>

      <div className="flex justify-between text-sm text-gray-500">
        <span>10 PM</span>
        <span>6 AM</span>
      </div>
    </div>
  );
};

export default AudioTimeline;