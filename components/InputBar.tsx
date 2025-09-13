
import React, { useState } from 'react';

interface InputBarProps {
  onSubmit: (command: string) => void;
  isLoading: boolean;
  isGameOver: boolean;
}

export const InputBar: React.FC<InputBarProps> = ({ onSubmit, isLoading, isGameOver }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading && !isGameOver) {
      onSubmit(input.trim());
      setInput('');
    }
  };

  const isDisabled = isLoading || isGameOver;

  return (
    <form onSubmit={handleSubmit} className="flex-shrink-0 p-4 bg-gray-800 border-t-2 border-gray-700 rounded-b-lg">
      <div className="flex items-center space-x-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isGameOver ? "The story has ended." : "What do you do?"}
          disabled={isDisabled}
          className="w-full bg-gray-700 text-gray-200 placeholder-gray-500 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-gray-800 disabled:cursor-not-allowed transition-all duration-200"
          aria-label="Game command input"
        />
        <button
          type="submit"
          disabled={isDisabled}
          className="px-6 py-3 bg-cyan-600 text-white font-bold rounded-md hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200"
        >
          Send
        </button>
      </div>
    </form>
  );
};
