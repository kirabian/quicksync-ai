import { NextResponse } from "next/server";
import { generateResilientContent } from "@/lib/gemini";

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
1. IMPORTANT: On the first line of your output, provide the language code in the format [LANG:XX], where XX is the country code of the translation language (e.g., ID for Indonesia, JA for Japan, EN for English, ES for Spanish).
2. THE SECOND LINE AND BEYOND is the translated text.
3. PRESERVE ALL MARKDOWN FORMATTING. Do not change the structure, bolding (**text**), lists (- or 1.), or headings (##).
4. Do not output anything other than the language tag and the translated markdown text. No conversational filler like "Here is the translation...".
`;

    const prompt = `${systemInstruction}\n\nOriginal Text to Translate:\n${text}`;

    const result = await generateResilientContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    if (!responseText) {
      throw new Error("No translation response received from AI.");
    }

    return NextResponse.json({ result: responseText });
  } catch (error: any) {
    console.error("Gemini API Error in translation:", error);
    return NextResponse.json(
      { error: "Failed to translate content", details: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
