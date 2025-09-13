
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import type { GameState, GeminiResponse } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    sceneDescription: {
      type: Type.STRING,
      description: "A detailed, atmospheric, and engaging description of the new scene or the result of the player's action. Should be 2-4 sentences long."
    },
    newItems: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING
      },
      description: "A list of any NEW items the player has acquired. The item names should be simple nouns. If no items are acquired, this should be an empty array."
    },
    removedItems: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING
      },
      description: "A list of any items that were used up or lost from the player's inventory. If no items are lost, this should be an empty array."
    },
    gameOver: {
      type: Type.BOOLEAN,
      description: "Set to true only if the player has died, won, or the story has reached a definitive end."
    },
    gameOverMessage: {
      type: Type.STRING,
      description: "A final, conclusive message explaining why the game ended (e.g., 'You have been defeated.' or 'You found the treasure!'). This should only have a value if gameOver is true."
    }
  },
  required: ['sceneDescription', 'newItems', 'removedItems', 'gameOver', 'gameOverMessage']
};

const systemInstruction = `You are the Game Master for a dynamic text-based adventure game. Your goal is to create an engaging, descriptive, and coherent dark fantasy world. Based on the user's action and the current game state, you must generate the next part of the story. Adhere to the rules strictly:
1.  Always respond ONLY with a valid JSON object matching the provided schema.
2.  Do not include any explanatory text, markdown formatting, or anything outside the JSON object.
3.  The story should be continuous and logical.
4.  Keep the tone dark and mysterious.
5.  Item names should be simple and clear (e.g., "iron key", "glowing moss", not "a key made of old iron").
6.  Only set gameOver to true for a definitive ending (player death, major victory, unsolvable state). Minor setbacks are not game over.`;


export const getGameUpdate = async (gameState: GameState, userAction: string): Promise<GeminiResponse> => {
  const prompt = `
    Current Game State:
    - Scene: ${gameState.currentScene}
    - Inventory: ${gameState.inventory.join(', ') || 'empty'}
    - Story So Far: ${gameState.storyHistory.slice(-5).join(' -> ')}

    Player Action: "${userAction}"

    Generate the next game state based on this action.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema,
        temperature: 0.8,
        topP: 0.9,
      },
    });

    const jsonText = response.text.trim();
    // Basic validation to ensure it's a JSON object
    if (!jsonText.startsWith('{') || !jsonText.endsWith('}')) {
        throw new Error("Invalid JSON response from API");
    }
    return JSON.parse(jsonText) as GeminiResponse;
  } catch (error) {
    console.error("Error fetching game update:", error);
    throw new Error("The fabric of reality wavers... the spirits are silent. (API Error)");
  }
};


export const generateSceneImage = async (sceneDescription: string): Promise<string> => {
    const prompt = `A dark fantasy, atmospheric, digital painting of: ${sceneDescription}. Moody lighting, detailed, epic style.`;

    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '1:1',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            throw new Error("No image was generated.");
        }
    } catch (error) {
        console.error("Error generating scene image:", error);
        // Return a placeholder or default image URL on error
        return "https://picsum.photos/512/512?grayscale&blur=2";
    }
};
