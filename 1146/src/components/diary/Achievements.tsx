import React from 'react';
import { Trophy, Star, Target, Award } from 'lucide-react';

interface AchievementsProps {
  streak: number;
  lastEntry: Date;
}

const Achievements: React.FC<AchievementsProps> = ({ streak, lastEntry }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Achievements</h3>
        <div className="flex items-center space-x-1">
          <Star className="w-5 h-5 text-yellow-400 fill-current" />
          <span className="font-medium">2,450 pts</span>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="bg-indigo-100 p-3 rounded-lg">
            <Trophy className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Current Streak</h4>
            <p className="text-2xl font-bold text-indigo-600">{streak} days</p>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Recent Badges</h4>
          <div className="grid grid-cols-2 gap-4">
            <Badge
              icon={<Target className="w-6 h-6" />}
              title="Goal Setter"
              description="Set your first sleep goal"
            />
            <Badge
              icon={<Award className="w-6 h-6" />}
              title="Early Bird"
              description="Wake up before 7 AM for 5 days"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Next Achievement</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <Trophy className="w-6 h-6 text-gray-400" />
              <div>
                <h5 className="font-medium text-gray-900">Sleep Master</h5>
                <p className="text-sm text-gray-600">Complete 30 days of tracking</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '70%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Badge: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <div className="text-indigo-600 mb-2">{icon}</div>
    <h5 className="font-medium text-gray-900">{title}</h5>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

export default Achievements;