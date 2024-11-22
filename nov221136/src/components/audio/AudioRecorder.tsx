import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Volume2, AlertTriangle, Info } from 'lucide-react';
import AudioVisualizer from './AudioVisualizer';

const RECORDING_TIPS = [
  {
    icon: "🎯",
    title: "Position Your Device",
    description: "Place your phone within 3-6 feet of your head, with microphone unobstructed"
  },
  {
    icon: "🔋",
    title: "Check Battery",
    description: "Ensure device is charging overnight - recording uses ~15% battery"
  },
  {
    icon: "🌙",
    title: "Quiet Environment",
    description: "Minimize background noise like fans or TV for better snore detection"
  }
];

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [dbThreshold, setDbThreshold] = useState(60);
  const [audioChunks, setAudioChunks] = useState<Array<{ blob: Blob; timestamp: number; volume: number }>>([]);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showTips, setShowTips] = useState(true);

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const audioElements = useRef<{ [key: number]: HTMLAudioElement }>({});

  useEffect(() => {
    getMicrophonePermission();
    return () => {
      Object.values(audioElements.current).forEach(audio => audio.pause());
      if (audioContext.current?.state === 'running') {
        audioContext.current.close();
      }
    };
  }, []);

  const getMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });

      audioContext.current = new AudioContext();
      analyser.current = audioContext.current.createAnalyser();
      const source = audioContext.current.createMediaStreamSource(stream);
      source.connect(analyser.current);
      analyser.current.fftSize = 2048;

      // Use audio/wav for better compatibility
      const mimeType = MediaRecorder.isTypeSupported('audio/wav') 
        ? 'audio/wav' 
        : MediaRecorder.isTypeSupported('audio/webm') 
          ? 'audio/webm' 
          : 'audio/mp4';

      mediaRecorder.current = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 128000
      });
      
      mediaRecorder.current.ondataavailable = handleDataAvailable;
      setError(null);
    } catch (err) {
      setError('Failed to access microphone. Please check permissions.');
      console.error('Failed to get microphone permission:', err);
    }
  };

  const startRecording = () => {
    if (mediaRecorder.current && !isRecording) {
      mediaRecorder.current.start(5000); // Capture in 5-second chunks
      setIsRecording(true);
      setError(null);
      setShowTips(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const handleDataAvailable = async (event: BlobEvent) => {
    try {
      if (event.data.size > 0) {
        const volume = await detectSnoring(event.data);
        if (volume > dbThreshold) {
          setAudioChunks(prev => [...prev, {
            blob: event.data,
            timestamp: Date.now(),
            volume
          }]);
        }
      }
    } catch (err) {
      console.error('Error processing audio chunk:', err);
    }
  };

  const detectSnoring = async (blob: Blob): Promise<number> => {
    try {
      const ctx = new AudioContext();
      const arrayBuffer = await blob.arrayBuffer();
      
      try {
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
        const data = audioBuffer.getChannelData(0);
        
        let maxAmplitude = 0;
        let rmsSum = 0;
        
        // Calculate RMS and peak amplitude
        for (let i = 0; i < data.length; i++) {
          const amplitude = Math.abs(data[i]);
          rmsSum += amplitude * amplitude;
          maxAmplitude = Math.max(maxAmplitude, amplitude);
        }
        
        const rms = Math.sqrt(rmsSum / data.length);
        
        // Convert to dB, using max of RMS and peak values
        // Reference level: -60dB = minimum audible sound
        const db = 20 * Math.log10(Math.max(rms, maxAmplitude) / 0.00001);
        
        await ctx.close();
        return Math.round(Math.max(0, Math.min(db, 100)));
      } catch (decodeError) {
        console.warn('Failed to decode audio:', decodeError);
        return 0;
      }
    } catch (err) {
      console.error('Error analyzing audio:', err);
      return 0;
    }
  };

  const playAudio = async (index: number) => {
    try {
      if (playingIndex !== null) {
        audioElements.current[playingIndex]?.pause();
      }

      if (playingIndex === index) {
        setPlayingIndex(null);
        return;
      }

      if (!audioElements.current[index]) {
        const audio = new Audio();
        audio.src = URL.createObjectURL(audioChunks[index].blob);
        audio.onended = () => setPlayingIndex(null);
        audioElements.current[index] = audio;
      }

      await audioElements.current[index].play();
      setPlayingIndex(index);
    } catch (err) {
      console.error('Error playing audio:', err);
      setError('Failed to play audio. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-lg flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {showTips && (
        <div className="bg-indigo-50 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-indigo-900">Recording Tips</h3>
            <button 
              onClick={() => setShowTips(false)}
              className="text-indigo-600 hover:text-indigo-700"
            >
              Dismiss
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {RECORDING_TIPS.map((tip, index) => (
              <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl mb-2">{tip.icon}</div>
                <h4 className="font-medium text-gray-900 mb-1">{tip.title}</h4>
                <p className="text-sm text-gray-600">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-4 rounded-full ${
              isRecording 
                ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
            }`}
          >
            {isRecording ? <Square className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>
          <div>
            <h3 className="font-medium text-gray-900">
              {isRecording ? 'Recording Snore Sounds...' : 'Start Recording'}
            </h3>
            <p className="text-sm text-gray-500">
              {isRecording 
                ? 'Only saving sounds above threshold'
                : 'Tap to start snore detection'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Volume2 className="w-5 h-5 text-gray-400" />
          <input
            type="range"
            min="40"
            max="90"
            value={dbThreshold}
            onChange={(e) => setDbThreshold(Number(e.target.value))}
            className="w-24"
          />
          <span className="text-sm text-gray-600">{dbThreshold}dB</span>
        </div>
      </div>

      {isRecording && (
        <AudioVisualizer 
          analyser={analyser.current} 
          isRecording={isRecording}
          dbThreshold={dbThreshold}
        />
      )}

      {audioChunks.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Detected Snoring Events</h4>
          <div className="space-y-2">
            {audioChunks.map((chunk, index) => (
              <div
                key={chunk.timestamp}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => playAudio(index)}
                    className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-50"
                  >
                    {playingIndex === index ? (
                      <Pause className="w-4 h-4 text-gray-600" />
                    ) : (
                      <Play className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Snoring Event {index + 1}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(chunk.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Volume2 className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{chunk.volume}dB</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;