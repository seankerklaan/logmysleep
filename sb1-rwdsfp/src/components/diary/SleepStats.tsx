import React from 'react';
import { Target, Zap, Activity } from 'lucide-react';
import { SleepState } from './types';

interface SleepStatsProps {
  sleepStates: SleepState;
  goal?: { hours: number; bedtime: string };
}

const SleepStats: React.FC<SleepStatsProps> = ({ sleepStates, goal }) => {
  const stats = calculateSleepStats(sleepStates);
  const goalProgress = goal ? (stats.averageSleep / goal.hours) * 100 : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Sleep Analytics</h3>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard 
          icon={<Target className="w-5 h-5 text-indigo-600" />}
          title="Goal Progress" 
          value={`${Math.round(goalProgress)}%`}
          subtitle={`Target: ${goal?.hours || 8} hours`}
        />
        <StatCard 
          icon={<Zap className="w-5 h-5 text-amber-600" />}
          title="Sleep Quality" 
          value={`${Math.round(stats.quality)}%`}
          subtitle="Based on patterns"
        />
        <StatCard 
          icon={<Activity className="w-5 h-5 text-green-600" />}
          title="Consistency" 
          value={`${Math.round(stats.consistency)}%`}
          subtitle="Day-to-day variance"
        />
      </div>
      <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">Sleep pattern visualization coming soon</p>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ 
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
}> = ({
  icon,
  title,
  value,
  subtitle,
}) => (
  <div className="bg-gray-50 rounded-lg p-4">
    <div className="flex items-center space-x-3 mb-2">
      {icon}
      <div>
        <h4 className="text-sm text-gray-600">{title}</h4>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
      </div>
    </div>
    <p className="text-sm text-gray-500">{subtitle}</p>
  </div>
);

const calculateSleepStats = (sleepStates: SleepState) => {
  const days = Object.keys(sleepStates).reduce((acc: { [key: string]: number[] }, key) => {
    const [day, hour] = key.split('-');
    if (!acc[day]) acc[day] = [];
    if (sleepStates[key].isAsleep) {
      acc[day].push(parseInt(hour));
    }
    return acc;
  }, {});

  const stats = Object.entries(days).map(([day, hours]) => {
    const sortedHours = hours.sort((a, b) => a - b);
    const sleepDuration = sortedHours.length;
    return { day, duration: sleepDuration };
  });

  const averageSleep = stats.reduce((sum, stat) => sum + stat.duration, 0) / (stats.length || 1);
  const consistency = calculateConsistency(stats.map(s => s.duration));

  return {
    dailyStats: stats,
    averageSleep,
    consistency,
    quality: calculateQuality(sleepStates)
  };
};

const calculateConsistency = (durations: number[]) => {
  if (durations.length === 0) return 100;
  
  const average = durations.reduce((a, b) => a + b, 0) / durations.length;
  const variance = durations.reduce((sum, duration) => {
    return sum + Math.pow(duration - average, 2);
  }, 0) / durations.length;
  
  return Math.max(0, 100 - (Math.sqrt(variance) * 10));
};

const calculateQuality = (sleepStates: SleepState) => {
  let quality = 85;
  let factors = 0;
  
  Object.values(sleepStates).forEach(state => {
    if (state.activity === 'alcohol') {
      quality -= 2;
      factors++;
    }
    if (state.activity === 'coffee' && state.isAsleep) {
      quality -= 3;
      factors++;
    }
  });
  
  if (factors > 0) {
    quality = quality - (factors * 2);
  }
  
  return Math.max(0, Math.min(100, quality));
};

export default SleepStats;