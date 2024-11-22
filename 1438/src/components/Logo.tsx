import React from 'react';
import { Moon, Stars } from 'lucide-react';

const Logo = () => {
  return (
    <div className="flex items-center">
      <div className="relative mr-3">
        <Moon className="w-8 h-8 text-indigo-600" />
        <Stars className="absolute -top-1 -right-1 w-4 h-4 text-amber-400" />
      </div>
      <div className="flex flex-col">
        <div className="flex items-baseline">
          <span className="text-2xl font-serif font-bold text-gray-900">log</span>
          <span className="text-2xl font-serif font-bold text-indigo-600">my</span>
          <span className="text-2xl font-serif font-bold text-gray-900">sleep</span>
          <span className="text-2xl font-serif font-bold text-gray-400">.com</span>
        </div>
        <span className="text-sm text-indigo-600 font-medium italic -mt-1">
          because good nights make great days
        </span>
      </div>
    </div>
  );
};

export default Logo;