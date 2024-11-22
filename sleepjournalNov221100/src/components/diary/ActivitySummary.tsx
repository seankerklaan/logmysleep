import React from 'react';
import { Coffee, Wine, Dumbbell, Moon } from 'lucide-react';
import { SleepState } from './types';

interface ActivitySummaryProps {
  sleepStates: SleepState;
}

const ActivitySummary: React.FC<ActivitySummaryProps> = ({ sleepStates }) => {
  const calculateStats = () => {
    const stats = {
      coffee: 0,
      alcohol: 0,
      exercise: 0,
      totalSleepHours: 0,
    };

    Object.values(sleepStates).forEach((state) => {
      if (state.isAsleep) {
        stats.totalSleepHours++;
      }
      if (state.activity === 'coffee') stats.coffee++;
      if (state.activity === 'alcohol') stats.alcohol++;
      if (state.activity === 'exercise') stats.exercise++;
    });

    return stats;
  };

  const stats = calculateStats();

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Activity Impact</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Coffee className="w-6 h-6 text-amber-600" />}
          title="Caffeine"
          value={stats.coffee}
          label="times"
          color="bg-amber-50"
        />
        <StatCard
          icon={<Wine className="w-6 h-6 text-red-600" />}
          title="Alcohol"
          value={stats.alcohol}
          label="times"
          color="bg-red-50"
        />
        <StatCard
          icon={<Dumbbell className="w-6 h-6 text-green-600" />}
          title="Exercise"
          value={stats.exercise}
          label="times"
          color="bg-green-50"
        />
        <StatCard
          icon={<Moon className="w-6 h-6 text-indigo-600" />}
          title="Sleep"
          value={stats.totalSleepHours}
          label="hours"
          color="bg-indigo-50"
        />
      </div>

      {/* Activity Impact Analysis */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Sleep Quality Impact</h4>
        <div className="space-y-2">
          {stats.coffee > 0 && (
            <p className="text-sm text-gray-600">
              ☕️ {stats.coffee} caffeine intake{stats.coffee > 2 ? ' - Consider reducing afternoon consumption' : ''}
            </p>
          )}
          {stats.alcohol > 0 && (
            <p className="text-sm text-gray-600">
              🍷 {stats.alcohol} alcohol consumption{stats.alcohol > 1 ? ' - May affect sleep quality' : ''}
            </p>
          )}
          {stats.exercise > 0 && (
            <p className="text-sm text-gray-600">
              💪 {stats.exercise} exercise session{stats.exercise > 1 ? 's' : ''} - Great for sleep quality!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: number;
  label: string;
  color: string;
}> = ({ icon, title, value, label, color }) => (
  <div className={`${color} rounded-lg p-4`}>
    <div className="flex items-center space-x-3 mb-2">
      {icon}
      <h4 className="font-medium text-gray-900">{title}</h4>
    </div>
    <div className="text-2xl font-bold text-gray-900">
      {value}
      <span className="text-sm font-normal text-gray-600 ml-1">{label}</span>
    </div>
  </div>
);

export default ActivitySummary;