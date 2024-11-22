import React from 'react';
import { Moon, Coffee, Dumbbell } from 'lucide-react';

const JournalPreview = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Moon className="w-5 h-5 text-indigo-600" />
          <h3 className="font-medium text-gray-900">Today's Sleep Log</h3>
        </div>
        <span className="text-sm text-gray-500">Wed, Nov 13</span>
      </div>

      <div className="grid grid-cols-12 gap-1 mb-4">
        {Array.from({ length: 12 }).map((_, i) => {
          const hour = (i + 20) % 24; // Start from 8 PM
          const isAsleep = hour >= 23 || hour < 7;
          return (
            <div
              key={hour}
              className={`h-6 rounded ${isAsleep ? 'bg-indigo-500' : 'bg-gray-100'}`}
              title={`${hour}:00`}
            />
          );
        })}
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-gray-600">
            <Coffee className="w-4 h-4" />
            <span>7:00 AM</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-600">
            <Dumbbell className="w-4 h-4" />
            <span>6:00 PM</span>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-gray-600">Quality:</span>
          <span className="font-medium text-indigo-600">85%</span>
        </div>
      </div>
    </div>
  );
};

export default JournalPreview;