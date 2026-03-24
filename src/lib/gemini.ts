import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  console.warn("Missing GEMINI_API_KEY in environment variables");
}

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Primary model (Lite/experimental)
export const model31 = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });
// Fallback model (Stable/production)
export const model15 = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Executes a prompt with automatic fallback and retry logic
 */
export async function generateResilientContent(prompt: string, retries = 2) {
  try {
    // Try primary model first
    return await model31.generateContent(prompt);
  } catch (error: any) {
    const isOverloaded = error.message?.includes("503") || error.message?.includes("high demand");
    
    if (isOverloaded) {
      console.warn("Gemini 3.1 overloaded, falling back to Gemini 1.5 Flash...");
      try {
        return await model15.generateContent(prompt);
      } catch (fallbackError: any) {
        if (retries > 0) {
          console.log(`Retrying after error... (${retries} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, 2000));
          return generateResilientContent(prompt, retries - 1);
        }
        throw fallbackError;
      }
    }
    
    // For other errors, still try retry logic
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return generateResilientContent(prompt, retries - 1);
    }
    throw error;
  }
}
