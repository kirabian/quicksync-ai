"use client";

import { motion } from "framer-motion";
import { ArrowRight, Link as LinkIcon, FileText, Upload } from "lucide-react";
import { useState } from "react";

export default function Hero() {
  const [inputValue, setInputValue] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (!inputValue) return;
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 3000);
  };

  return (
    <section className="relative min-h-screen flex flex-col pt-32 pb-20 px-6 md:px-12 overflow-hidden">
      {/* Decorative background element - minimalist */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-1/4 z-0" />
      
      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-8">
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-[12vw] md:text-[8vw] lg:text-[7vw] leading-[0.85] font-display font-extrabold uppercase tracking-tighter mb-8"
          >
            Drop a link. <br />
            <span className="text-primary italic">Get the picture.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl text-xl md:text-2xl text-foreground/70 mb-12 leading-relaxed"
          >
            QuickSync AI turns messy articles, long PDFs, and raw transcripts into structured action items and professional drafts in under 10 seconds.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-w-2xl group"
          >
            <div className="absolute -inset-1 bg-primary/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <div className="relative flex flex-col md:flex-row gap-2 bg-background border-2 border-foreground/10 p-2 focus-within:border-primary transition-colors">
              <div className="flex-1 flex items-center px-4 gap-3">
                <LinkIcon className="w-5 h-5 text-foreground/40" />
                <input 
                  type="text" 
                  placeholder="Paste article URL or raw text here..."
                  className="w-full bg-transparent border-none outline-none py-4 text-lg font-medium placeholder:text-foreground/20"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>
              <button 
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="bg-primary text-primary-foreground px-8 py-4 font-display font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 min-w-[180px]"
              >
                {isAnalyzing ? (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                  />
                ) : (
                  <>Analyze <ArrowRight className="w-5 h-5" /></>
                )}
              </button>
            </div>
            <div className="mt-4 flex items-center gap-6">
              <button className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-foreground/40 hover:text-primary transition-colors">
                <Upload className="w-4 h-4" /> Upload PDF
              </button>
              <div className="h-1 w-1 rounded-full bg-foreground/20" />
              <p className="text-xs font-medium text-foreground/30 uppercase tracking-widest">
                No credit card required
              </p>
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-4 hidden lg:block">
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-foreground/5 border border-foreground/10 p-8 aspect-[3/4] flex flex-col"
          >
            <div className="flex items-center gap-2 mb-8">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Live Preview</span>
            </div>
            
            <div className="space-y-6">
              <div className="h-4 w-3/4 bg-foreground/10 rounded-full" />
              <div className="h-4 w-full bg-foreground/10 rounded-full" />
              <div className="h-4 w-2/3 bg-foreground/10 rounded-full" />
              
              <div className="pt-8 space-y-4">
                <div className="p-4 border border-primary/20 bg-primary/5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Summary</span>
                  </div>
                  <p className="text-xs leading-relaxed text-foreground/60 italic">
                    "This document outlines the strategic pivot for Q3, focusing on automated pipeline synchronization..."
                  </p>
                </div>
                
                <div className="p-4 border border-foreground/10 bg-foreground/5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-foreground/20" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Action Items</span>
                  </div>
                  <ul className="text-[10px] space-y-2 text-foreground/60">
                    <li className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-primary" /> Schedule review with stakeholders (May 12)
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-primary" /> Update API documentation
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mt-auto flex justify-between items-center pt-8">
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-foreground/10 border border-foreground/10" />
                <div className="w-8 h-8 rounded-full bg-foreground/10 border border-foreground/10" />
                <div className="w-8 h-8 rounded-full bg-foreground/10 border border-foreground/10" />
              </div>
              <div className="px-4 py-2 bg-foreground text-background text-[10px] font-bold uppercase tracking-widest">
                Share
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
