
import React, { useState, useEffect, useCallback } from 'react';
import { StoryLog } from './components/StoryLog';
import { InputBar } from './components/InputBar';
import { StatusBar } from './components/StatusBar';
import { LoadingIndicator } from './components/LoadingIndicator';
import { getGameUpdate, generateSceneImage } from './services/geminiService';
import type { GameState, StoryEntry, GeminiResponse } from './types';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentScene: '',
    inventory: [],
    storyHistory: [],
    gameOver: false,
    gameOverMessage: '',
  });

  const [storyLog, setStoryLog] = useState<StoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState('https://picsum.photos/512/512?grayscale&blur=2');

  const addStoryEntry = useCallback((type: StoryEntry['type'], text: string) => {
    setStoryLog(prev => [...prev, { id: Date.now() + Math.random(), type, text }]);
  }, []);

  const handleApiResponse = useCallback(async (response: GeminiResponse) => {
    addStoryEntry('narrative', response.sceneDescription);

    const updatedInventory = [...gameState.inventory];
    response.newItems.forEach(item => {
      if (!updatedInventory.includes(item)) {
        updatedInventory.push(item);
      }
    });

    const finalInventory = updatedInventory.filter(item => !response.removedItems.includes(item));
    
    setGameState(prev => ({
      ...prev,
      currentScene: response.sceneDescription,
      inventory: finalInventory,
      storyHistory: [...prev.storyHistory, response.sceneDescription],
      gameOver: response.gameOver,
      gameOverMessage: response.gameOverMessage,
    }));

    if (response.gameOver) {
      addStoryEntry('system', response.gameOverMessage);
    }
    
    setIsImageLoading(true);
    const newImageUrl = await generateSceneImage(response.sceneDescription);
    setImageUrl(newImageUrl);
    setIsImageLoading(false);

  }, [addStoryEntry, gameState.inventory]);
  
  const startGame = useCallback(async () => {
    setIsLoading(true);
    addStoryEntry('system', 'A new adventure begins...');
    try {
      const initialGameState: GameState = { currentScene: 'An ancient, moss-covered crypt.', inventory: [], storyHistory: [], gameOver: false, gameOverMessage: '' };
      const response = await getGameUpdate(initialGameState, "I wake up. Where am I?");
      await handleApiResponse(response);
    } catch (e) {
      const err = e as Error;
      addStoryEntry('error', err.message);
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addStoryEntry, handleApiResponse]);

  useEffect(() => {
    startGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUserInput = async (command: string) => {
    if (gameState.gameOver) return;
    
    addStoryEntry('action', command);
    setIsLoading(true);
    
    try {
      const response = await getGameUpdate(gameState, command);
      await handleApiResponse(response);
    } catch (e) {
      const err = e as Error;
      addStoryEntry('error', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col lg:flex-row font-sans">
      <main className="flex-grow flex flex-col p-4 lg:p-8">
        <header className="flex-shrink-0 mb-4">
          <h1 className="text-4xl lg:text-5xl font-bold text-center text-white font-serif tracking-widest">Gemini Adventure</h1>
        </header>
        <div className="flex-grow flex flex-col bg-gray-800/50 rounded-lg shadow-2xl overflow-hidden">
          <StoryLog entries={storyLog} />
          {isLoading && <div className="p-4 bg-gray-800 border-t-2 border-gray-700"><LoadingIndicator message="The mists of fate are swirling..." /></div>}
          <InputBar onSubmit={handleUserInput} isLoading={isLoading} isGameOver={gameState.gameOver} />
        </div>
      </main>
      <StatusBar inventory={gameState.inventory} imageUrl={imageUrl} isImageLoading={isImageLoading} />
    </div>
  );
};

export default App;
