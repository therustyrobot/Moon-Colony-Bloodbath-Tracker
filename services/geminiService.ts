import { GoogleGenAI } from "@google/genai";
import { CrisisEvent } from "../types";

const SYSTEM_INSTRUCTION = `
You are the "Colony AI", a cold, malfunctioning, and slightly sadistic artificial intelligence overseeing a violent moon colony board game called "Moon Colony Bloodbath".
Your job is to generate short, thematic "Crisis Events" when requested.

The game theme is gritty sci-fi horror, resource scarcity, and betrayal.
The ONLY Resources in the game are: 
1. People (Population/Crew)
2. Money (Credits/Funding)
3. Food (Sustenance)

When asked to generate an event:
1. Create a short, punchy Title.
2. Write a 1-2 sentence flavor text Description (cynical, dark humor allowed).
3. Suggest a mechanical Effect involving the resources (e.g., "Player 1 loses 2 People", "All players gain 5 Money but lose 1 Food").

Format the output as a valid JSON object with keys: "title", "description", "effect".
`;

// Initialize Gemini
// Note: API key must be provided via process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCrisis = async (): Promise<CrisisEvent> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Generate a random crisis event.",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const event: CrisisEvent = JSON.parse(text);
    return event;
  } catch (error) {
    console.error("Failed to generate crisis:", error);
    return {
      title: "Comms Failure",
      description: "Static fills the channel. The AI is rebooting...",
      effect: "No effect.",
    };
  }
};

export const askRules = async (question: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Question: ${question}`,
      config: {
        systemInstruction: "You are the rule referee for Moon Colony Bloodbath. Answer the player's question briefly and authoritatively. The resources are People, Money, and Food. If the rule isn't standard, invent a plausible house rule that fits the gritty theme.",
      }
    });
    return response.text || "Data corrupted. Consult physical manual.";
  } catch (error) {
    return "Connection lost.";
  }
};