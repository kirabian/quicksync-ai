import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  console.warn("Missing GEMINI_API_KEY in environment variables");
}

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
// Berdasarkan hasil diagnosa API, ID yang tepat adalah gemini-3.1-flash-lite-preview.
export const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });
