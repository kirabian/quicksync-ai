"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Features from "@/components/landing/Features";
import WhoItsFor from "@/components/landing/WhoItsFor";
import Pricing from "@/components/landing/Pricing";
import Footer from "@/components/landing/Footer";
import { toast } from "sonner";
import ResultView from "@/components/ResultView";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [resultMarkdown, setResultMarkdown] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleProcessText = async (text: string, role: string = "General") => {
    setIsProcessing(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, role }),
      });

      if (!response.ok) {
        throw new Error("Failed to process document");
      }

      const data = await response.json();
      setResultMarkdown(data.result);
      toast.success("Analysis complete!");
      
      // Scroll to result if needed, or just let the Hero handle it
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="bg-background text-foreground">
      <nav className="fixed top-0 left-0 w-full z-[100] px-6 md:px-12 py-8 flex justify-between items-center bg-black/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-6 h-6 bg-primary" />
          <span className="text-2xl font-bold uppercase tracking-tighter">QuickSync</span>
        </div>
        
        <div className="hidden md:flex gap-12">
          {["Features", "Pricing", "About"].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 hover:text-primary transition-colors"
            >
              {item}
            </a>
          ))}
        </div>
        
        <button className="bg-white text-black px-8 py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-primary transition-colors">
          Launch App
        </button>
      </nav>

      <main>
        {!resultMarkdown ? (
          <>
            <Hero onAnalyze={handleProcessText} isLoading={isProcessing} />
            <div id="features">
              <HowItWorks />
              <Features />
            </div>
            <WhoItsFor />
            <div id="pricing">
              <Pricing />
            </div>
          </>
        ) : (
          <div className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
            <button 
              onClick={() => setResultMarkdown(null)}
              className="mb-8 text-xs font-bold uppercase tracking-widest text-primary hover:text-white transition-colors"
            >
              ← Back to Dashboard
            </button>
            <ResultView markdown={resultMarkdown} />
          </div>
        )}
        <Footer />
      </main>
    </div>
  );
}
