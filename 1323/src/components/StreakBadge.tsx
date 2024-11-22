import React from 'react';
import { Trophy, Award } from 'lucide-react';

const StreakBadge = () => {
  return (
    <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Trophy className="w-6 h-6" />
          <h3 className="text-lg font-semibold">14-Day Challenge</h3>
        </div>
        <span className="text-2xl font-bold">7/14</span>
      </div>
      <div className="space-y-2">
        <div className="w-full bg-white/20 rounded-full h-2">
          <div className="bg-white h-2 rounded-full" style={{ width: '50%' }} />
        </div>
        <p className="text-sm text-amber-100">Keep going! You're halfway to your first milestone.</p>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center space-x-2">
          <Award className="w-4 h-4" />
          <span>Unlock Gold Badge</span>
        </div>
        <span>7 days to go</span>
      </div>
    </div>
  );
};

export default StreakBadge;