import React from 'react';

const AudioWaveform = () => {
  // Generate random waveform data for visualization
  const generateWaveform = () => {
    const points = [];
    const segments = 50;
    
    for (let i = 0; i < segments; i++) {
      const height = Math.sin(i * 0.2) * Math.random() * 0.5 + 0.5;
      points.push(height);
    }
    return points;
  };

  const waveform = generateWaveform();

  return (
    <div className="flex items-center justify-between w-full h-full space-x-1">
      {waveform.map((height, index) => (
        <div
          key={index}
          className="w-1 bg-indigo-400 rounded-full"
          style={{
            height: `${height * 100}%`,
            opacity: 0.6 + (height * 0.4),
          }}
        />
      ))}
    </div>
  );
};

export default AudioWaveform;