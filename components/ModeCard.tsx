
import React from 'react';
import { LearningMode } from '../types';

interface ModeCardProps {
  mode: LearningMode;
  icon: string;
  title: string;
  color: string;
  onClick: (mode: LearningMode) => void;
}

export const ModeCard: React.FC<ModeCardProps> = ({ mode, icon, title, color, onClick }) => {
  return (
    <button
      onClick={() => onClick(mode)}
      className={`group relative flex flex-col items-center justify-center p-6 rounded-3xl transition-all hover:scale-105 active:scale-95 shadow-lg ${color} text-white`}
    >
      <span className="text-4xl mb-3 group-hover:animate-bounce">{icon}</span>
      <span className="font-bold text-lg">{title}</span>
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity"></div>
    </button>
  );
};
