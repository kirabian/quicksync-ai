import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  console.warn("Missing GEMINI_API_KEY in environment variables");
}

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Primary model (Stable/Production)
export const modelPrimary = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
// Fallback model 1
export const modelFallback1 = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
// Fallback model 2 (Lite/Experimental)
export const modelFallback2 = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });

/**
 * Executes a prompt with automatic fallback and retry logic
 */
export async function generateResilientContent(prompt: string, retries = 2) {
  const models = [modelPrimary, modelFallback1, modelFallback2];
  let lastError: any = null;

  for (const model of models) {
    try {
      return await model.generateContent(prompt);
    } catch (error: any) {
      lastError = error;
      const errorMsg = error.message?.toLowerCase() || "";
      const isOverloaded = errorMsg.includes("503") || errorMsg.includes("overloaded") || errorMsg.includes("high demand");
      const isQuotaExceeded = errorMsg.includes("429") || errorMsg.includes("quota");

      if (isQuotaExceeded) {
        console.warn(`Model ${model.model} quota exceeded, trying next model...`);
        continue; // Try next model immediately
      }

      if (isOverloaded) {
        console.warn(`Model ${model.model} overloaded, trying next model...`);
        continue; // Try next model
      }

      // For other errors, maybe retry this model if retries left
      if (retries > 0) {
        console.log(`Retrying after error: ${error.message} (${retries} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        return generateResilientContent(prompt, retries - 1);
      }
    }
  }

  // If all models fail
  if (lastError) {
    const lastErrorMsg = lastError.message?.toLowerCase() || "";
    if (lastErrorMsg.includes("429") || lastErrorMsg.includes("quota")) {
      throw new Error("GEMINI_QUOTA_EXCEEDED");
    }
    throw lastError;
  }
  
  throw new Error("Failed to generate content with all available models.");
}
