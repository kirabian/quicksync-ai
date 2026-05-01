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

    const result = await generateResilientContent(prompt);
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
