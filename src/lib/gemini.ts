import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  console.warn("Missing GEMINI_API_KEY in environment variables");
}

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
// Berdasarkan diagnosa, ID ini valid di akunmu dan punya kuota 500 per hari di Vercel.
export const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });
