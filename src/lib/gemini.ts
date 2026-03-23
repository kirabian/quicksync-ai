import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  console.warn("Missing GEMINI_API_KEY in environment variables");
}

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
// Berdasarkan daftar kuota user, gemini-3.1-flash-lite punya jatah 500 request per hari (RPD).
export const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });
