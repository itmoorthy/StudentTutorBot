
import React from 'react';

export const TeacherAvatar: React.FC<{ isThinking?: boolean }> = ({ isThinking }) => {
  return (
    <div className="relative inline-block">
      <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-yellow-300 overflow-hidden bg-yellow-50 flex items-center justify-center transition-all ${isThinking ? 'animate-pulse scale-105' : ''}`}>
        <span className="text-4xl md:text-5xl" role="img" aria-label="Teacher">👩‍🏫</span>
      </div>
      <div className="absolute -bottom-1 -right-1 bg-green-400 w-5 h-5 rounded-full border-2 border-white"></div>
    </div>
  );
};
