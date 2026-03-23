import { NextResponse } from "next/server";
import { model } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const { text, targetLanguage } = await req.json();

    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: "Text and targetLanguage are required" },
        { status: 400 }
      );
    }

    const systemInstruction = `You are a professional translator and Markdown formatter.
Your task is to translate the provided Markdown text into exactly this language: ${targetLanguage}.

CRITICAL RULES:
1. PENTING: Pada baris pertama output, berikan kode bahasa dalam format [LANG:XX], di mana XX adalah kode negara bahasa terjemahan (contoh: ID untuk Indonesia, JA untuk Jepang, EN untuk Inggris, ES untuk Spanyol).
2. BARIS KEDUA DAN SETERUSNYA adalah teks terjemahan.
3. PRESERVE ALL MARKDOWN FORMATTING. Do not change the structure, bolding (**text**), lists (- or 1.), or headings (##).
4. Do not output anything other than the language tag and the translated markdown text. No conversational filler like "Here is the translation...".
`;

    const prompt = `${systemInstruction}\n\nOriginal Text to Translate:\n${text}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return NextResponse.json({ result: responseText });
  } catch (error: any) {
    console.error("Gemini API Error in translation:", error);
    return NextResponse.json(
      { error: "Failed to translate content", details: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
