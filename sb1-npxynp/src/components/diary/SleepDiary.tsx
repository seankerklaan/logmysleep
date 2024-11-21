import React, { useState } from 'react';
import SleepGrid from './SleepGrid';
import SleepStats from './SleepStats';
import ActivitySummary from './ActivitySummary';
import Achievements from './Achievements';
import { useStreakCounter } from '../../hooks/useStreakCounter';
import { SleepState } from './types';
import { Calendar, ChevronDown, Target } from 'lucide-react';

const SleepDiary = () => {
  const { streak, lastEntry } = useStreakCounter();
  const [sleepStates, setSleepStates] = useState<SleepState>({});
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [sleepGoal, setSleepGoal] = useState({ hours: 8, bedtime: '22:00' });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Primary Action Section */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Sleep Journal</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowGoalModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors"
          >
            <Target className="w-5 h-5" />
            <span>Set Sleep Goal</span>
          </button>
        </div>
      </div>

      {/* Date Selection and Sleep Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Calendar className="w-5 h-5 text-indigo-500" />
                <h2 className="text-xl font-bold text-gray-900">Sleep Diary</h2>
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors">
                <span>Last 2 Weeks</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            <SleepGrid sleepStates={sleepStates} setSleepStates={setSleepStates} />
          </div>
          
          <ActivitySummary sleepStates={sleepStates} />
          <SleepStats sleepStates={sleepStates} goal={sleepGoal} />
        </div>

        <div className="lg:col-span-1">
          <Achievements streak={streak} lastEntry={lastEntry} />
        </div>
      </div>

      {/* Goal Setting Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Set Your Sleep Goal</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hours of Sleep
                </label>
                <input
                  type="number"
                  min="4"
                  max="12"
                  value={sleepGoal.hours}
                  onChange={(e) => setSleepGoal({ ...sleepGoal, hours: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Bedtime
                </label>
                <input
                  type="time"
                  value={sleepGoal.bedtime}
                  onChange={(e) => setSleepGoal({ ...sleepGoal, bedtime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowGoalModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowGoalModal(false);
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Save Goal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SleepDiary;