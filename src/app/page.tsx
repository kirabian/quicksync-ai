"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Features from "@/components/landing/Features";
import WhoItsFor from "@/components/landing/WhoItsFor";
import Pricing from "@/components/landing/Pricing";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Custom Cursor or other global micro-interactions could go here */}
      
      <nav className="fixed top-0 left-0 w-full z-[100] px-6 md:px-12 py-8 flex justify-between items-center mix-blend-difference">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-8 h-8 bg-primary group-hover:rotate-90 transition-transform duration-500" />
          <span className="text-2xl font-display font-black uppercase tracking-tighter text-white">QuickSync</span>
        </div>
        
        <div className="hidden md:flex gap-12">
          {["Features", "Pricing", "About"].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50 hover:text-primary transition-colors"
            >
              {item}
            </a>
          ))}
        </div>
        
        <button className="bg-white text-black px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-colors">
          Get Started
        </button>
      </nav>

      <main>
        <Hero />
        <div id="features">
          <HowItWorks />
          <Features />
        </div>
        <WhoItsFor />
        <div id="pricing">
          <Pricing />
        </div>
        <Footer />
      </main>
    </div>
  );
}
