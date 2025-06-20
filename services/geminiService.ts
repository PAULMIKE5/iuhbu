
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GEMINI_TEXT_MODEL } from "../constants";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. AI features will be limited. Ensure process.env.API_KEY is set.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export const getDailyMiningInsight = async (): Promise<string> => {
  if (!ai) {
    return "AI insights are currently unavailable. Please check API key configuration.";
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: "Provide a very short, futuristic, and encouraging insight about AI or digital mining for a user on a crypto mining platform. Max 2 sentences. Be creative and inspiring.",
      config: {
        temperature: 0.7,
        maxOutputTokens: 100,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching daily mining insight from Gemini:", error);
    if (error instanceof Error && error.message.includes("API key not valid")) {
        return "Failed to get insight: Invalid API Key. Please check your configuration.";
    }
    return "Could not fetch AI insight at this time. The digital winds are fickle today.";
  }
};
    