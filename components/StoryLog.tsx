
import React, { useRef, useEffect } from 'react';
import type { StoryEntry } from '../types';

interface StoryLogProps {
  entries: StoryEntry[];
}

const getEntryStyle = (type: StoryEntry['type']): string => {
  switch (type) {
    case 'narrative':
      return 'text-gray-300 leading-relaxed';
    case 'action':
      return 'text-cyan-300 italic';
    case 'error':
      return 'text-red-400 font-semibold';
    case 'system':
      return 'text-yellow-400 text-center py-4 border-y-2 border-yellow-700/50 my-4';
    default:
      return 'text-gray-400';
  }
};

export const StoryLog: React.FC<StoryLogProps> = ({ entries }) => {
  const endOfLogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfLogRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries]);

  return (
    <div className="flex-grow p-6 overflow-y-auto bg-gray-900/80 rounded-t-lg font-serif text-lg">
      {entries.map((entry) => (
        <div key={entry.id} className={`mb-4 ${getEntryStyle(entry.type)}`}>
          {entry.type === 'action' && <span className="font-sans mr-2 text-gray-500">&gt;</span>}
          {entry.text}
        </div>
      ))}
      <div ref={endOfLogRef} />
    </div>
  );
};
