import { createClient } from "@/utils/supabase/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { documentId, message } = await req.json();

    // Check chat limit
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!profile?.is_premium && (profile?.chat_count || 0) >= 20) {
      return NextResponse.json({ error: "Chat limit reached for this month." }, { status: 403 });
    }

    // Fetch document content
    const { data: document, error: docError } = await supabase
      .from("documents")
      .select("*")
      .eq("id", documentId)
      .eq("user_id", user.id)
      .single();

    if (docError || !document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Prepare Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      You are an expert assistant that answers questions based on a provided document.
      
      DOCUMENT CONTENT:
      ---
      ${document.content}
      ---
      
      USER QUESTION:
      "${message}"
      
      INSTRUCTIONS:
      1. Answer the question specifically using the content provided in the document.
      2. If the answer is on a specific page or section mentioned in the text, point it out.
      3. If the answer is not in the document, say "I couldn't find that information in the document."
      4. Keep the answer concise and professional.
      
      ANSWER:
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Save chat history
    await supabase.from("chat_history").insert([
      { user_id: user.id, document_id: documentId, message: message, role: "user" },
      { user_id: user.id, document_id: documentId, message: responseText, role: "assistant" },
    ]);

    // Update chat count
    await supabase.from("profiles").update({ 
      chat_count: (profile?.chat_count || 0) + 1 
    }).eq("id", user.id);

    return NextResponse.json({ result: responseText });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
