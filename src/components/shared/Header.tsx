import React from 'react';
import { Difficulty } from '../../types';
import { StarIcon } from './StarIcon';
import { DifficultyBadge } from './DifficultyBadge';

interface HeaderProps {
  timer: number;
  streak: number;
  stars: number;
  onBack: () => void;
  formatTime: (s: number) => string;
  difficulty: Difficulty;
}

export const Header: React.FC<HeaderProps> = ({ timer, streak, stars, onBack, formatTime, difficulty }) => (
  <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20">
    <div className="flex items-center gap-4">
      <button onClick={onBack} className="w-10 h-10 rounded-full bg-gray-900/80 flex items-center justify-center text-white hover:bg-gray-700 transition-colors cursor-pointer">←</button>
      <div className="flex items-center bg-gray-900/80 rounded-lg p-2 backdrop-blur">
        <div>
          <div className="text-xl font-bold text-white">{formatTime(timer)}</div>
          <div className="text-xs text-blue-300">TIMER</div>
        </div>
        <div className="ml-3 border-l border-gray-600 pl-3">
          <div className="text-xl font-bold text-orange-400">{streak}</div>
          <div className="text-xs text-orange-300">STREAK</div>
        </div>
        {difficulty && <div className="ml-3 border-l border-gray-600 pl-3"><DifficultyBadge difficulty={difficulty} /></div>}
      </div>
    </div>
    <div className="flex items-center gap-2">
      <div className="bg-yellow-500 text-white px-3 py-1 rounded-l-full font-bold flex items-center gap-1"><StarIcon className="w-4 h-4" /></div>
      <div className="bg-gray-200 text-gray-800 px-4 py-1 rounded-r-full font-bold min-w-16 text-center">{stars}</div>
    </div>
  </div>
);
