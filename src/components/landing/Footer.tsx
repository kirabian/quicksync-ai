"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-background pt-32 pb-12 px-6 md:px-12 overflow-hidden border-t border-foreground/5">
      <div className="max-w-7xl mx-auto">
        <div className="relative mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            <h2 className="text-[12vw] md:text-[10vw] font-display font-extrabold uppercase leading-[0.8] tracking-tighter mb-12">
              Sync <br />
              Everything.
            </h2>
            <p className="max-w-md mx-auto text-xl text-foreground/50 mb-12 font-medium">
              Join 10,000+ professionals turning information into action with QuickSync AI.
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <button className="w-full md:w-auto bg-primary text-primary-foreground px-12 py-6 font-display font-black uppercase tracking-[0.2em] hover:scale-105 transition-transform flex items-center justify-center gap-4">
                Start for free <ArrowRight className="w-6 h-6" />
              </button>
              <button className="w-full md:w-auto bg-foreground/5 text-foreground px-12 py-6 font-display font-black uppercase tracking-[0.2em] border border-foreground/10 hover:bg-foreground/10 transition-colors">
                View Roadmap
              </button>
            </div>
            
            <p className="mt-8 text-[10px] font-bold uppercase tracking-widest text-foreground/30">
              No credit card required. Cancel anytime.
            </p>
          </motion.div>
          
          {/* Large background text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30vw] font-display font-black text-foreground/[0.02] select-none pointer-events-none -z-10 uppercase tracking-tighter">
            QUICKSYNC
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-foreground/5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary" />
            <span className="text-xl font-display font-bold uppercase tracking-tight">QuickSync AI</span>
          </div>
          
          <div className="flex gap-8">
            <a href="#" className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40 hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40 hover:text-primary transition-colors">Terms</a>
            <a href="#" className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40 hover:text-primary transition-colors">Twitter</a>
            <a href="#" className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40 hover:text-primary transition-colors">GitHub</a>
          </div>
          
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/20">
            © 2026 QUICK-SYNC LABS
          </div>
        </div>
      </div>
    </footer>
  );
}
