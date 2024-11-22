import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  analyser: AnalyserNode | null;
  isRecording: boolean;
  dbThreshold: number;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ analyser, isRecording, dbThreshold }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!analyser || !isRecording || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const draw = () => {
      if (!isRecording) return;

      requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);

      // Clear canvas
      ctx.fillStyle = 'rgba(0, 0, 0, 0)';
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw threshold line
      const thresholdY = canvas.height - ((dbThreshold / 100) * canvas.height);
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)'; // red-500 with opacity
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.moveTo(0, thresholdY);
      ctx.lineTo(canvas.width, thresholdY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Add threshold label
      ctx.fillStyle = 'rgb(239, 68, 68)';
      ctx.font = '12px sans-serif';
      ctx.fillText(`${dbThreshold}dB threshold`, 8, thresholdY - 5);

      // Draw waveform
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgb(99, 102, 241)';
      ctx.beginPath();

      const sliceWidth = (canvas.width * 1.0) / dataArray.length;
      let x = 0;

      for (let i = 0; i < dataArray.length; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      // Add glow effect for peaks above threshold
      ctx.shadowBlur = 15;
      ctx.shadowColor = 'rgb(99, 102, 241)';
      ctx.stroke();
    };

    draw();
  }, [analyser, isRecording, dbThreshold]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="w-full h-32 rounded-xl bg-gray-50"
        width={800}
        height={128}
      />
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/10 to-indigo-600/10 pointer-events-none" />
    </div>
  );
};

export default AudioVisualizer;