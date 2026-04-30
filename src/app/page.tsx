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
import { Sun, Moon, LogOut, LayoutDashboard } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LandingPage() {
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [resultMarkdown, setResultMarkdown] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    
    // Check session
    const getSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    const savedTheme = localStorage.getItem("qs_theme");
    if (savedTheme) {
      setIsDark(savedTheme === "dark");
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("qs_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("qs_theme", "light");
    }
  }, [isDark]);

  const checkUsageLimit = () => {
    if (user) return true; // Logged in users handled server-side

    const usage = localStorage.getItem("qs_usage_count");
    const count = usage ? parseInt(usage) : 0;
    
    if (count >= 2) {
      setShowLoginModal(true);
      return false;
    }
    return true;
  };

  const incrementUsage = () => {
    if (user) return; // Don't track local usage for logged in users

    const usage = localStorage.getItem("qs_usage_count");
    const count = usage ? parseInt(usage) : 0;
    localStorage.setItem("qs_usage_count", (count + 1).toString());
  };

  const handleProcessText = async (text: string, role: string = "General", fileName?: string) => {
    if (!checkUsageLimit()) return;

    setIsProcessing(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, role, fileName }),
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
    <div className="bg-background text-foreground transition-colors duration-300">
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      <nav className="fixed top-0 left-0 w-full z-[100] px-4 md:px-12 py-6 md:py-8 flex justify-between items-center bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-2 md:gap-3 cursor-pointer group">
          <div className="w-4 h-4 md:w-6 md:h-6 bg-primary rounded-md" />
          <span className="text-xl md:text-2xl font-bold tracking-tighter">QuickSync</span>
        </div>
        
        <div className="hidden lg:flex gap-12">
          {["Features", "Pricing", "About"].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted hover:text-primary transition-colors"
            >
              {item}
            </a>
          ))}
        </div>
        
        <div className="flex items-center gap-4 md:gap-6">
          <button 
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-xl bg-muted/10 hover:bg-muted/20 transition-colors text-muted hover:text-primary"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {user ? (
            <div className="flex items-center gap-4">
              <Link 
                href="/dashboard"
                className="hidden sm:flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-muted hover:text-primary transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <button 
                onClick={() => supabase.auth.signOut()}
                className="hidden sm:block text-[11px] font-bold uppercase tracking-widest text-muted hover:text-red-500 transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : null}
          <button 
            onClick={() => user ? router.push("/dashboard") : setShowLoginModal(true)}
            className="bg-primary text-white px-4 md:px-8 py-2 md:py-3 text-[11px] font-bold uppercase tracking-[0.1em] rounded-xl hover:bg-primary/90 transition-all active:scale-95"
          >
            {user ? "Dashboard" : "Mulai Pakai"}
          </button>
        </div>
      </nav>

      <main>
        {!resultMarkdown ? (
          <>
            <Hero onAnalyze={handleProcessText} isLoading={isProcessing} />
            <WhoItsFor />
            <div id="pricing">
              <Pricing />
            </div>
            <div id="features">
              <HowItWorks />
              <Features />
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
