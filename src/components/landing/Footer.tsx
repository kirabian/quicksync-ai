"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-background pt-32 pb-12 px-6 md:px-12 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-32 items-center">
          <h2 className="text-6xl md:text-9xl font-bold uppercase leading-[0.85] tracking-tight">
            Sync <br />
            Everything.
          </h2>
          <div className="space-y-8">
            <p className="text-xl text-foreground/40 font-medium leading-relaxed">
              Join the new standard of document intelligence. Start converting information into action today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-primary text-black px-12 py-6 font-bold uppercase tracking-[0.2em] hover:bg-white transition-colors flex items-center justify-center gap-4">
                Get Started <ArrowRight className="w-6 h-6" />
              </button>
              <button className="bg-white/5 text-white px-12 py-6 font-bold uppercase tracking-[0.2em] border border-white/10 hover:bg-white/10 transition-colors">
                Roadmap
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-primary" />
            <span className="text-2xl font-bold uppercase tracking-tight">QuickSync AI</span>
          </div>
          
          <div className="flex gap-10">
            {["Privacy", "Terms", "Twitter", "GitHub"].map((link) => (
              <a key={link} href="#" className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 hover:text-primary transition-colors">{link}</a>
            ))}
          </div>
          
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/10">
            © 2026 QUICK-SYNC LABS
          </div>
        </div>
      </div>
    </footer>
  );
}
