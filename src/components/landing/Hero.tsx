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
    <section className="relative min-h-screen flex flex-col justify-center pt-32 pb-20 px-6 md:px-12 border-b border-border">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-8"
          >
            <div className="w-4 h-4 bg-primary" />
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-primary">Intelligence Engine v1.0</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-6xl md:text-8xl font-bold uppercase leading-[0.95] tracking-tight mb-8"
          >
            Smarter Extraction. <br />
            <span className="text-primary italic">Zero Fluff.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-lg text-lg text-foreground/60 mb-12"
          >
            Ubah laporan 50 halaman atau notulen rapat panjang menjadi ringkasan satu paragraf dan butir aksi yang bisa langsung dieksekusi. Didesain untuk Analis, PM, dan Konsultan.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex flex-col md:flex-row gap-0 border-2 border-white focus-within:border-primary transition-colors">
              <div className="flex-1 flex items-center px-6 gap-4 bg-white/5">
                <LinkIcon className="w-5 h-5 text-foreground/40" />
                <input 
                  type="text" 
                  placeholder="Paste article URL or raw text..."
                  className="w-full bg-transparent border-none outline-none py-6 text-lg font-medium placeholder:text-foreground/20"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>
              <button 
                onClick={handleAnalyze}
                disabled={isBusy}
                className="bg-primary text-primary-foreground px-12 py-6 font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-3 disabled:opacity-50 min-w-[200px]"
              >
                {isBusy ? "Processing..." : "Analyze"} <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center gap-6 pt-2">
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <button 
                  disabled={isBusy}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground/40 hover:text-primary transition-colors disabled:opacity-50"
                >
                  <Upload className="w-4 h-4" /> Upload PDF
                </button>
              </div>
              <div className="w-1 h-1 rounded-full bg-white/20" />
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                Free Tier: No Login Required
              </p>
            </div>
          </motion.div>
        </div>

        <div className="relative hidden lg:block">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="bg-[#0a0a0a] border border-white/10 p-10 aspect-square flex flex-col"
          >
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/5">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-primary" />
                <div className="w-2 h-2 bg-white/10" />
                <div className="w-2 h-2 bg-white/10" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">Output Terminal</span>
            </div>

            <div className="space-y-8 flex-1">
              <div className="space-y-3">
                <div className="h-1 w-1/4 bg-primary" />
                <div className="h-4 w-full bg-white/5" />
                <div className="h-4 w-5/6 bg-white/5" />
              </div>

              <div className="space-y-4 pt-4">
                <div className="p-5 border border-white/10 bg-white/[0.02]">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary mb-3 block">Extracted Summary</span>
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-white/10" />
                    <div className="h-2 w-full bg-white/10" />
                    <div className="h-2 w-2/3 bg-white/10" />
                  </div>
                </div>

                <div className="p-5 border border-white/10 bg-white/[0.02]">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3 block">Action Items</span>
                  <div className="space-y-3">
                    <div className="flex gap-3 items-center">
                      <div className="w-1.5 h-1.5 bg-primary" />
                      <div className="h-2 w-1/2 bg-white/5" />
                    </div>
                    <div className="flex gap-3 items-center">
                      <div className="w-1.5 h-1.5 bg-primary" />
                      <div className="h-2 w-2/3 bg-white/5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 flex justify-between">
              <div className="flex gap-3">
                <div className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/20 text-[10px] font-bold">PDF</div>
                <div className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/20 text-[10px] font-bold">MD</div>
              </div>
              <div className="px-6 h-10 bg-white text-black text-[10px] font-bold uppercase tracking-widest flex items-center">
                Sync to Notion
              </div>
            </div>
          </motion.div>
          
          {/* Decorative frame */}
          <div className="absolute -inset-4 border border-white/5 -z-10" />
        </div>
      </div>
    </section>
  );
}
