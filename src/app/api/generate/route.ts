import { NextResponse } from "next/server";
import { model } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const { text, role } = await req.json();

    if (!text) {
      return NextResponse.json(
        { error: "Content text is required" },
        { status: 400 }
      );
    }

    const roleInstruction = role && role !== "General" 
      ? `\n\nYOUR ROLE: Act as a professional in the field of ${role.toUpperCase()}. Use terminology, specific jargon, and a point of view that is highly relevant and preferred by a ${role}.` 
      : "";

    const systemInstruction = `You are "QuickSync AI", a high-level productivity assistant specialized in extracting information from PDF documents and raw text.${roleInstruction}

PRIMARY TASKS:
1. Identify the primary language of the input document.
2. Generate output in the SAME LANGUAGE as the input document.
3. Structure the response into 3 main sections using clean Markdown formatting.
4. IMPORTANT: On the FIRST LINE of your output, provide the language code in the format [LANG:XX], where XX is the country code (e.g., ID for Indonesia, JA for Japan, EN for English). THE SECOND LINE AND BEYOND is the markdown content.

## 📝 Summary
- Provide a concise executive summary (maximum 2 paragraphs).
- Focus on "Who, What, and Why".

## ✅ Action Items
- Extract all tasks, instructions, or deadlines.
- Use the checklist format [ ] for each item.
- If there is a deadline (e.g., March 29, 2026), write it in BOLD at the start of the line.

## 📄 Professional Draft
- Create one email draft or formal message based on the document content.
- Use a professional, polite, yet firm tone.

SPECIAL INSTRUCTIONS:
- If the input contains specific names (like Bian or Fabian Solutions), use those names in the draft.
- Do not provide an opening like "Here is the summary...". Provide the content directly (except for the language tag on the first line).
- Ensure the Markdown format is compatible for direct copying into Notion or Trello.`;

    const prompt = `${systemInstruction}\n\nDocument Text:\n${text}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return NextResponse.json({ result: responseText });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate content", details: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}


