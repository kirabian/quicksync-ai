import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  console.warn("Missing GEMINI_API_KEY in environment variables");
}

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
// Kita kembali menggunakan Gemini 2.5 Flash karena versi 1.5-flash (versi lama) dilaporkan 404 Not Found
export const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
