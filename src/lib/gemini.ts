import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  console.warn("Missing GEMINI_API_KEY in environment variables");
}

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
// Menggunakan gemini-1.5-flash-latest untuk kompatibilitas paling stabil di semua region.
export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
