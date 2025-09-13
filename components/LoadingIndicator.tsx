
import React from 'react';

interface LoadingIndicatorProps {
  message: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ message }) => {
  return (
    <div className="flex items-center space-x-3 p-4 bg-gray-800/50 rounded-lg">
      <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-cyan-400"></div>
      <p className="text-cyan-300 italic">{message}</p>
    </div>
  );
};
