import React from 'react';
import { Coffee, Wine, Dumbbell, BedDouble, ArrowRight, ArrowLeft, ArrowDown, Armchair } from 'lucide-react';

interface TimeBlockProps {
  hour: number;
  dayIndex: number;
  state?: {
    isAsleep: boolean;
    activity?: 'coffee' | 'alcohol' | 'exercise';
    position?: 'supine' | 'leftLateral' | 'rightLateral' | 'prone' | 'sitting';
  };
  onSelect: (hour: number, dayIndex: number) => void;
  onRightClick: (hour: number, dayIndex: number, activity: 'coffee' | 'alcohol' | 'exercise') => void;
  onMiddleClick: (hour: number, dayIndex: number, position: 'supine' | 'leftLateral' | 'rightLateral' | 'prone' | 'sitting') => void;
}

const TimeBlock: React.FC<TimeBlockProps> = ({ 
  hour, 
  dayIndex, 
  state,
  onSelect,
  onRightClick,
  onMiddleClick
}) => {
  const getBlockColor = () => {
    if (!state?.isAsleep) {
      switch (state?.activity) {
        case 'coffee':
          return 'bg-amber-200 hover:bg-amber-300';
        case 'alcohol':
          return 'bg-red-200 hover:bg-red-300';
        case 'exercise':
          return 'bg-green-200 hover:bg-green-300';
        default:
          return 'bg-gray-50 hover:bg-gray-100';
      }
    }

    // Color variations for different sleep positions
    switch (state?.position) {
      case 'supine':
        return 'bg-indigo-500 hover:bg-indigo-600';
      case 'leftLateral':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'rightLateral':
        return 'bg-violet-500 hover:bg-violet-600';
      case 'prone':
        return 'bg-purple-500 hover:bg-purple-600';
      case 'sitting':
        return 'bg-pink-500 hover:bg-pink-600';
      default:
        return 'bg-indigo-500 hover:bg-indigo-600';
    }
  };

  const getIcon = () => {
    if (!state?.isAsleep) {
      switch (state?.activity) {
        case 'coffee':
          return <Coffee className="w-3 h-3" />;
        case 'alcohol':
          return <Wine className="w-3 h-3" />;
        case 'exercise':
          return <Dumbbell className="w-3 h-3" />;
        default:
          return null;
      }
    }

    // Position icons when asleep
    switch (state?.position) {
      case 'supine':
        return <BedDouble className="w-3 h-3 text-white" />;
      case 'leftLateral':
        return <ArrowLeft className="w-3 h-3 text-white" />;
      case 'rightLateral':
        return <ArrowRight className="w-3 h-3 text-white" />;
      case 'prone':
        return <ArrowDown className="w-3 h-3 text-white" />;
      case 'sitting':
        return <Armchair className="w-3 h-3 text-white" />;
      default:
        return <BedDouble className="w-3 h-3 text-white" />;
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!state?.isAsleep) {
      const activities: ('coffee' | 'alcohol' | 'exercise')[] = ['coffee', 'alcohol', 'exercise'];
      const currentIndex = activities.indexOf(state?.activity || 'coffee');
      const nextActivity = activities[(currentIndex + 1) % activities.length];
      onRightClick(hour, dayIndex, nextActivity);
    }
  };

  const handleMiddleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (state?.isAsleep) {
      const positions: ('supine' | 'leftLateral' | 'rightLateral' | 'prone' | 'sitting')[] = 
        ['supine', 'leftLateral', 'rightLateral', 'prone', 'sitting'];
      const currentIndex = positions.indexOf(state?.position || 'supine');
      const nextPosition = positions[(currentIndex + 1) % positions.length];
      onMiddleClick(hour, dayIndex, nextPosition);
    }
  };

  return (
    <div
      className={`h-8 ${getBlockColor()} transition-colors cursor-pointer flex items-center justify-center
        ${state?.isAsleep ? 'text-white' : ''}`}
      onClick={() => onSelect(hour, dayIndex)}
      onContextMenu={handleContextMenu}
      onAuxClick={handleMiddleClick}
      title={state?.position ? `Position: ${state.position}` : undefined}
    >
      {getIcon()}
    </div>
  );
};

export default TimeBlock;