import React, { useState, useEffect, useRef } from 'react';
import { Volume2, CheckCircle } from 'lucide-react';

const NoiseCalibrator = ({ onComplete }: { onComplete: () => void }) => {
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [currentDb, setCurrentDb] = useState(0);
  const [baselineDb, setBaselineDb] = useState(0);
  const [progress, setProgress] = useState(0);
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const dataArray = useRef<Uint8Array | null>(null);

  const startCalibration = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContext.current = new AudioContext();
      analyser.current = audioContext.current.createAnalyser();
      const source = audioContext.current.createMediaStreamSource(stream);
      source.connect(analyser.current);
      analyser.current.fftSize = 2048;
      dataArray.current = new Uint8Array(analyser.current.frequencyBinCount);
      
      setIsCalibrating(true);
      let readings: number[] = [];
      let startTime = Date.now();
      
      const measure = () => {
        if (!analyser.current || !dataArray.current) return;
        
        analyser.current.getByteFrequencyData(dataArray.current);
        const average = Array.from(dataArray.current)
          .reduce((sum, value) => sum + value, 0) / dataArray.current.length;
        
        const db = Math.round((average / 255) * 100);
        setCurrentDb(db);
        readings.push(db);
        
        const elapsed = Date.now() - startTime;
        setProgress(Math.min((elapsed / 5000) * 100, 100));
        
        if (elapsed < 5000) {
          requestAnimationFrame(measure);
        } else {
          const baseline = Math.round(
            readings.reduce((sum, val) => sum + val, 0) / readings.length
          );
          setBaselineDb(baseline);
          setIsCalibrating(false);
          onComplete();
        }
      };
      
      measure();
    } catch (err) {
      console.error('Failed to access microphone:', err);
    }
  };

  return (
    <div className="space-y-6">
      {!isCalibrating && !baselineDb ? (
        <button
          onClick={startCalibration}
          className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Start Calibration
        </button>
      ) : (
        <div className="space-y-4">
          <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute h-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Volume2 className="w-5 h-5 text-gray-600" />
              <span className="text-lg font-medium">
                {currentDb} dB
              </span>
            </div>
            {baselineDb > 0 && (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span>Calibration Complete</span>
              </div>
            )}
          </div>

          {baselineDb > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">
                Your room's ambient noise level is approximately {baselineDb} dB.
                We'll set the recording threshold slightly above this to capture
                significant sounds while filtering out background noise.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NoiseCalibrator;