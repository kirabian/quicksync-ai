"use client";

import { motion } from "framer-motion";
import { ArrowRight, Link as LinkIcon, Upload } from "lucide-react";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import pdfToText from "react-pdftotext";
import { toast } from "sonner";

interface HeroProps {
  onAnalyze: (text: string) => Promise<void>;
  isLoading: boolean;
}

export default function Hero({ onAnalyze, isLoading }: HeroProps) {
  const [inputValue, setInputValue] = useState("");
  const [localLoading, setLocalLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!inputValue.trim()) return;
    
    setLocalLoading(true);
    try {
      let textToProcess = inputValue;

      // Check if it's a URL
      if (inputValue.startsWith("http")) {
        const res = await fetch("/api/scrape", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: inputValue }),
        });

        if (!res.ok) throw new Error("Failed to scrape URL");
        const data = await res.json();
        textToProcess = data.text;
      }

      await onAnalyze(textToProcess);
    } catch (error: any) {
      toast.error(error.message || "Failed to process input");
    } finally {
      setLocalLoading(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file || file.type !== "application/pdf") {
      toast.error("Please upload a valid PDF file");
      return;
    }

    setLocalLoading(true);
    try {
      const extractedText = await pdfToText(file);
      await onAnalyze(extractedText);
    } catch (error) {
      toast.error("Failed to extract text from PDF");
    } finally {
      setLocalLoading(false);
    }
  }, [onAnalyze]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
  });

  const isBusy = isLoading || localLoading;

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center py-40 px-6 bg-background overflow-hidden">
      {/* Subtle Ambient Light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto w-full relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 mb-10"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[11px] font-semibold tracking-wider uppercase text-primary/80">Solusi AI Untuk Profesional</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-8xl font-bold tracking-tight text-foreground mb-8"
        >
          Intelligence <br />
          <span className="text-primary">Simplified.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="max-w-2xl mx-auto text-lg md:text-xl text-muted mb-16 leading-relaxed"
        >
          The surgical extraction tool for professionals. Transform messy documents and transcripts into actionable intelligence in seconds.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="w-full max-w-3xl"
        >
          <div className="relative p-1 rounded-2xl bg-foreground/[0.03] border border-foreground/10 shadow-2xl backdrop-blur-sm">
            <div className="flex flex-col md:flex-row items-center gap-2 p-2">
              <div className="flex-1 flex items-center px-4 w-full">
                <input 
                  type="text" 
                  placeholder="Paste URL, text, or drop a PDF..."
                  className="w-full bg-transparent border-none outline-none py-4 text-lg text-foreground placeholder:text-foreground/20"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>
              <button 
                onClick={handleAnalyze}
                disabled={isBusy}
                className="w-full md:w-auto bg-primary text-white px-8 py-4 rounded-xl font-bold transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-primary/20"
              >
                {isBusy ? "Memproses..." : "Ekstrak Sekarang"}
              </button>
            </div>
          </div>
          
          <div className="mt-8 flex flex-wrap items-center justify-center gap-8 text-muted">
            <div {...getRootProps()} className="flex items-center gap-2 text-xs font-semibold cursor-pointer hover:text-foreground transition-colors">
              <input {...getInputProps()} />
              <Upload className="w-4 h-4" /> Upload Dokumen
            </div>
            <div className="w-1 h-1 rounded-full bg-foreground/20" />
            <button className="text-xs font-semibold hover:text-foreground transition-colors">
              Lihat Contoh Analisis
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
