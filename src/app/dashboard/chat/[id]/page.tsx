"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { 
  Send, 
  Loader2, 
  ChevronLeft, 
  FileText, 
  User, 
  Bot,
  Trash2
} from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

export default function ChatPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const supabase = createClient();
  
  const [document, setDocument] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchDocumentAndHistory();
  }, [id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchDocumentAndHistory = async () => {
    try {
      const { data: doc, error: docError } = await supabase
        .from("documents")
        .select("*")
        .eq("id", id)
        .single();

      if (docError) throw docError;
      setDocument(doc);

      const { data: history, error: histError } = await supabase
        .from("chat_history")
        .select("*")
        .eq("document_id", id)
        .order("created_at", { ascending: true });

      if (histError) throw histError;
      setMessages(history || []);
    } catch (error: any) {
      toast.error("Failed to load chat history");
      router.push("/dashboard");
    } finally {
      setIsFetching(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = { role: "user", message: input };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat/document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId: id, message: currentInput }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to get response");
      }

      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", message: data.result }]);
    } catch (error: any) {
      toast.error(error.message);
      setMessages(prev => prev.filter(m => m !== userMsg));
      setInput(currentInput);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteHistory = async () => {
    if (!confirm("Are you sure you want to clear chat history?")) return;
    
    try {
      const { error } = await supabase
        .from("chat_history")
        .delete()
        .eq("document_id", id);
      
      if (error) throw error;
      setMessages([]);
      toast.success("History cleared");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-white">
      {/* Header */}
      <header className="border-b border-white/5 bg-black/50 backdrop-blur-xl px-6 py-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push("/dashboard")}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/40 hover:text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-sm truncate max-w-[200px] md:max-w-md">{document?.name}</h1>
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Document Chat</p>
            </div>
          </div>
        </div>
        
        <button 
          onClick={deleteHistory}
          className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-white/20 hover:text-red-500"
          title="Clear History"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </header>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-8 space-y-8 scrollbar-hide"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
            <Bot className="w-16 h-16 mb-4" />
            <h3 className="text-xl font-bold">Tanyakan apa saja tentang dokumen ini</h3>
            <p className="text-sm mt-2">Contoh: "Apa poin penting di halaman 2?"</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${msg.role === 'user' ? 'bg-primary text-black' : 'bg-white/10 text-white'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-primary/10 text-white rounded-tr-none' : 'bg-white/5 text-white/80 rounded-tl-none border border-white/5'}`}>
                <div className="prose prose-invert prose-xs max-w-none">
                  <ReactMarkdown>
                    {msg.message}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex gap-4">
            <div className="shrink-0 w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-white/5 bg-black/50 backdrop-blur-xl shrink-0">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-4">
          <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl flex items-center px-4 focus-within:border-primary transition-all">
            <input 
              type="text" 
              placeholder="Ask a question about this document..."
              className="flex-1 bg-transparent border-none outline-none py-4 text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-4 bg-primary text-black rounded-2xl hover:bg-white transition-all disabled:opacity-50 disabled:hover:bg-primary active:scale-95"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </form>
        <p className="text-center text-[10px] text-white/20 mt-4 uppercase tracking-[0.2em] font-bold">
          Powered by Gemini 2.0 Flash
        </p>
      </div>
    </div>
  );
}
