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
import LoginModal from "@/components/landing/LoginModal";
import { useSession, signOut } from "next-auth/react";

export default function LandingPage() {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [resultMarkdown, setResultMarkdown] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const checkUsageLimit = () => {
    if (session) return true; // Logged in users have no local limit

    const usage = localStorage.getItem("qs_usage_count");
    const count = usage ? parseInt(usage) : 0;
    
    if (count >= 2) {
      setShowLoginModal(true);
      return false;
    }
    return true;
  };

  const incrementUsage = () => {
    if (session) return; // Don't track local usage for logged in users

    const usage = localStorage.getItem("qs_usage_count");
    const count = usage ? parseInt(usage) : 0;
    localStorage.setItem("qs_usage_count", (count + 1).toString());
  };

  const handleProcessText = async (text: string, role: string = "General") => {
    if (!checkUsageLimit()) return;

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
      incrementUsage();
      toast.success("Analysis complete!");
      
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
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
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
        
        <div className="flex items-center gap-6">
          {session ? (
            <button 
              onClick={() => signOut()}
              className="text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-primary transition-colors"
            >
              Sign Out
            </button>
          ) : null}
          <button 
            onClick={() => session ? toast.success("Dashboard coming soon!") : setShowLoginModal(true)}
            className="bg-white text-black px-8 py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-primary transition-colors"
          >
            {session ? "Open Dashboard" : "Launch App"}
          </button>
        </div>
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
