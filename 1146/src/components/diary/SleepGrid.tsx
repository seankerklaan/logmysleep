import React, { useState } from 'react';
import { Clock, Coffee, Wine, Dumbbell, Moon, Sun, BedDouble, ArrowRight, ArrowLeft, ArrowDown, Armchair } from 'lucide-react';
import TimeBlock from './TimeBlock';
import { SleepState } from './types';

interface SleepGridProps {
  sleepStates: SleepState;
  setSleepStates: React.Dispatch<React.SetStateAction<SleepState>>;
}

const SleepGrid: React.FC<SleepGridProps> = ({ sleepStates, setSleepStates }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<{ day: number; hour: number } | null>(null);
  const [selectionType, setSelectionType] = useState<'asleep' | 'awake'>('asleep');

  // Generate 24-hour time blocks (0-23)
  const timeBlocks = Array.from({ length: 24 }, (_, i) => i);

  const handleBlockSelect = (hour: number, dayIndex: number) => {
    if (!isSelecting) {
      setIsSelecting(true);
      setSelectionStart({ day: dayIndex, hour });
    } else {
      setIsSelecting(false);
      if (selectionStart) {
        const newStates = { ...sleepStates };
        const startDay = Math.min(selectionStart.day, dayIndex);
        const endDay = Math.max(selectionStart.day, dayIndex);
        const startHour = Math.min(selectionStart.hour, hour);
        const endHour = Math.max(selectionStart.hour, hour);

        for (let d = startDay; d <= endDay; d++) {
          for (let h = startHour; h <= endHour; h++) {
            const key = `${d}-${h}`;
            newStates[key] = {
              ...newStates[key],
              isAsleep: selectionType === 'asleep',
              position: selectionType === 'asleep' ? 'supine' : undefined,
            };
          }
        }
        setSleepStates(newStates);
      }
      setSelectionStart(null);
    }
  };

  const handlePositionChange = (hour: number, dayIndex: number, position: 'supine' | 'leftLateral' | 'rightLateral' | 'prone' | 'sitting') => {
    const key = `${dayIndex}-${hour}`;
    setSleepStates(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        position,
      },
    }));
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSelectionType('asleep')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-full ${
              selectionType === 'asleep'
                ? 'bg-indigo-100 text-indigo-600'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            <Moon className="w-4 h-4" />
            <span className="text-sm">Asleep</span>
          </button>
          <button
            onClick={() => setSelectionType('awake')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-full ${
              selectionType === 'awake'
                ? 'bg-amber-100 text-amber-600'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            <Sun className="w-4 h-4" />
            <span className="text-sm">Awake</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[auto_repeat(24,_minmax(30px,_1fr))] gap-px bg-gray-200 rounded-lg p-1">
        <div className="font-medium text-sm bg-white p-1">Date</div>
        {timeBlocks.map((hour) => (
          <div key={hour} className="text-xs text-center bg-white p-1">
            {`${hour}:00`}
          </div>
        ))}

        {Array.from({ length: 14 }).map((_, dayIndex) => (
          <React.Fragment key={dayIndex}>
            <div className="font-medium text-sm bg-white p-1">
              {new Date(selectedDate.getTime() + dayIndex * 86400000).toLocaleDateString('en-US', {
                weekday: 'short',
                day: 'numeric',
              })}
            </div>
            {timeBlocks.map((hour) => (
              <TimeBlock
                key={`${dayIndex}-${hour}`}
                hour={hour}
                dayIndex={dayIndex}
                state={sleepStates[`${dayIndex}-${hour}`]}
                onSelect={handleBlockSelect}
                onRightClick={(h, d, activity) => {
                  const key = `${d}-${h}`;
                  setSleepStates(prev => ({
                    ...prev,
                    [key]: {
                      ...prev[key],
                      activity,
                    },
                  }));
                }}
                onMiddleClick={handlePositionChange}
              />
            ))}
          </React.Fragment>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-6 mt-4 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <Coffee className="w-4 h-4" />
          <span>Caffeine (Right-click)</span>
        </div>
        <div className="flex items-center space-x-2">
          <Wine className="w-4 h-4" />
          <span>Alcohol (Right-click)</span>
        </div>
        <div className="flex items-center space-x-2">
          <Dumbbell className="w-4 h-4" />
          <span>Exercise (Right-click)</span>
        </div>
        <div className="flex items-center space-x-2 text-indigo-600">
          <BedDouble className="w-4 h-4" />
          <span>Change Position (Middle-click)</span>
        </div>
      </div>

      {/* Sleep Position Legend */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Sleep Positions</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-indigo-500 rounded-sm flex items-center justify-center">
              <BedDouble className="w-3 h-3 text-white" />
            </div>
            <span>On Back</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-sm flex items-center justify-center">
              <ArrowLeft className="w-3 h-3 text-white" />
            </div>
            <span>Left Side</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-violet-500 rounded-sm flex items-center justify-center">
              <ArrowRight className="w-3 h-3 text-white" />
            </div>
            <span>Right Side</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-purple-500 rounded-sm flex items-center justify-center">
              <ArrowDown className="w-3 h-3 text-white" />
            </div>
            <span>On Front</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-pink-500 rounded-sm flex items-center justify-center">
              <Armchair className="w-3 h-3 text-white" />
            </div>
            <span>Sitting</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SleepGrid;