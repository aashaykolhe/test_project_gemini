
export interface GameState {
  currentScene: string;
  inventory: string[];
  storyHistory: string[];
  gameOver: boolean;
  gameOverMessage: string;
}

export interface StoryEntry {
  id: number;
  type: 'narrative' | 'action' | 'error' | 'system';
  text: string;
}

export interface GeminiResponse {
  sceneDescription: string;
  newItems: string[];
  removedItems: string[];
  gameOver: boolean;
  gameOverMessage: string;
}
