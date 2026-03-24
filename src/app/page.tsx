"use client";

import { useState, useEffect, Suspense } from "react";
import Uploader from "@/components/Uploader";
import ResultView from "@/components/ResultView";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import LZString from "lz-string";

function HomeContent() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [resultMarkdown, setResultMarkdown] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const shareParam = searchParams.get("share");
    if (shareParam) {
      try {
        const decoded = LZString.decompressFromEncodedURIComponent(shareParam);
        if (decoded) {
          setResultMarkdown(decoded);
          toast.success("Loaded shared collaborative document!");
        }
      } catch (e) {
        toast.error("Invalid share link or corrupted data.");
      }
    }
  }, [searchParams]);

  const handleProcessText = async (text: string, role: string = "General") => {
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, role }),
      });

      if (!response.ok) {
        let errStr = "Failed to process document";
        try {
          const errData = await response.json();
          errStr = errData.details ? `${errData.details}` : errData.error;
        } catch (e) { }
        throw new Error(errStr);
      }

      const data = await response.json();
      setResultMarkdown(data.result);
      toast.success("Document processed successfully!");
    } catch (error: any) {
      console.error(error);
      const is503 = error.message?.includes("503") || error.message?.includes("demand") || error.message?.includes("busy");
      toast.error(is503 ? "AI is temporarily busy" : (error.message || "An error occurred"), {
        description: is503 ? "High demand detected. Please wait 10 seconds and try again." : "Please check your document content or connection."
      });
    }
  };

  if (!mounted) {
    return (
      <div className="w-full flex-1 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 flex flex-col items-center py-12 px-4 md:py-24">
      <div className="text-center max-w-3xl mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <h1 className="text-4xl md:text-6xl font-extrabold font-heading tracking-tight mb-6 text-balance leading-tight">
          Turn documents into <span className="text-primary">actionable knowledge</span> in seconds
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 text-balance">
          QuickSync AI uses Gemini Flash to summarize your PDFs and raw text into Notion/Trello ready notes, extracting action items and creating a professional draft instantly.
        </p>
      </div>

      <div className="w-full animate-in fade-in slide-in-from-bottom-12 duration-1000">
        {!resultMarkdown ? (
          <Uploader onProcessText={handleProcessText} />
        ) : (
          <div className="w-full flex flex-col items-center">
            <button
              onClick={() => setResultMarkdown(null)}
              className="mb-6 text-sm font-medium text-muted-foreground hover:text-primary transition-colors hover:underline"
            >
              ← Process another document
            </button>
            <ResultView markdown={resultMarkdown} />
          </div>
        )}
      </div>

      <div className="mt-24 max-w-4xl grid md:grid-cols-3 gap-8 text-center px-4 animate-in fade-in duration-1000 delay-300">
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-100 dark:border-zinc-800 transition-all hover:shadow-md">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary text-xl font-bold">1</div>
          <h3 className="font-semibold mb-2 font-heading">Upload or Paste</h3>
          <p className="text-sm text-muted-foreground">Drop your PDF or paste raw text. QuickSync will extract the context.</p>
        </div>
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-100 dark:border-zinc-800 transition-all hover:shadow-md">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary text-xl font-bold">2</div>
          <h3 className="font-semibold mb-2 font-heading">AI Processing</h3>
          <p className="text-sm text-muted-foreground">Gemini 2.5 Flash reads and builds a structured summary instantly.</p>
        </div>
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-100 dark:border-zinc-800 transition-all hover:shadow-md">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary text-xl font-bold">3</div>
          <h3 className="font-semibold mb-2 font-heading">Sync & Share</h3>
          <p className="text-sm text-muted-foreground">Copy the markdown directly to Notion, Trello, or download it as .md.</p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense 
      fallback={
        <div className="w-full flex-1 flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
