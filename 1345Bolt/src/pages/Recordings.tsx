import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Volume2, Trash2 } from 'lucide-react';
import AudioRecorder from '../components/audio/AudioRecorder';

interface Recording {
  id: string;
  date: string;
  duration: number;
  maxVolume: number;
  events: number;
  audioUrl: string;
}

const Recordings = () => {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null);

  // In a real app, this would fetch from an API
  useEffect(() => {
    const mockRecordings: Recording[] = [
      {
        id: '1',
        date: '2024-03-10',
        duration: 28800, // 8 hours in seconds
        maxVolume: 75,
        events: 12,
        audioUrl: ''
      },
      {
        id: '2',
        date: '2024-03-09',
        duration: 25200, // 7 hours in seconds
        maxVolume: 82,
        events: 8,
        audioUrl: ''
      }
    ];
    setRecordings(mockRecordings);
  }, []);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recording Controls */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sleep Sound Recording</h2>
            <AudioRecorder />
          </div>
        </div>

        {/* Recording History */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recording History</h2>
            <div className="space-y-4">
              {recordings.map((recording) => (
                <div
                  key={recording.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span className="font-medium">
                        {new Date(recording.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        // Handle deletion
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{formatDuration(recording.duration)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Volume2 className="w-4 h-4 text-gray-400" />
                      <span>{recording.maxVolume} dB max</span>
                    </div>
                    <div>
                      <span className="text-indigo-600">{recording.events} events</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recordings;