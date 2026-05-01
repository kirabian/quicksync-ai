import { createClient } from "@/utils/supabase/server";
import { generateResilientContent } from "@/lib/gemini";
import { NextResponse } from "next/server";

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

    if (!profile?.is_premium && (profile?.chat_count || 0) >= 1000) {
      return NextResponse.json({ error: "Limit chat tercapai." }, { status: 403 });
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

    const prompt = `
      You are "QuickSync AI", a helpful and professional assistant. You have been provided with a document to help you answer the user's questions.
      
      DOCUMENT CONTENT:
      ---
      ${document.content || "EMPTY_DOCUMENT_CONTENT"}
      ---
      
      USER MESSAGE:
      "${message}"
      
      INSTRUCTIONS:
      1. If the user is greeting you (e.g., "Hi", "Hello", "guy", "hey"), respond politely and ask how you can help them with the document.
      2. If the user asks a question about the document, answer it specifically using the content provided.
      3. If the answer is not in the document and it's not a greeting, say "I couldn't find that specific information in the document. Is there anything else you'd like to know about it?"
      4. If the DOCUMENT CONTENT is "EMPTY_DOCUMENT_CONTENT", inform the user that this document seems to be empty or couldn't be read correctly.
      5. Keep your response concise and helpful.
      
      ANSWER:
    `;

    const result = await generateResilientContent(prompt);
    const responseText = result.response.text();

    // Save chat history (Non-blocking)
    try {
      await supabase.from("chat_history").insert([
        { user_id: user.id, document_id: documentId, message: message, role: "user" },
        { user_id: user.id, document_id: documentId, message: responseText, role: "assistant" },
      ]);
    } catch (dbError) {
      console.error("Failed to save chat history:", dbError);
    }
    
    // Update chat count (Non-blocking)
    try {
      await supabase.from("profiles").update({ 
        chat_count: (profile?.chat_count || 0) + 1 
      }).eq("id", user.id);
    } catch (dbError) {
      console.error("Failed to update chat count:", dbError);
    }
    
    return NextResponse.json({ result: responseText });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    
    if (error.message === "GEMINI_QUOTA_EXCEEDED") {
      return NextResponse.json(
        { error: "Quota Gemini habis atau limit tercapai. Silakan coba lagi nanti atau hubungi admin." },
        { status: 429 }
      );
    }

    // Handle other known Gemini errors if not already caught by lib
    if (error.message?.includes("503") || error.message?.toLowerCase().includes("overloaded")) {
      return NextResponse.json(
        { error: "Server Gemini sedang sibuk. Silakan coba sesaat lagi." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Gagal memproses chat. Silakan coba lagi." }, 
      { status: 500 }
    );
  }
}
