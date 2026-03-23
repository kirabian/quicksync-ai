import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  console.warn("Missing GEMINI_API_KEY in environment variables");
}

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
// Menggunakan Gemini 2.5 Flash karena API Key Anda ternyata mendapat akses ke model terbaru ini!
export const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
