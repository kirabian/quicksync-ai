"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-background pt-32 pb-12 px-6 md:px-12 border-t-8 border-primary transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-32 items-start">
          <div>
            <h2 className="text-7xl md:text-8xl font-black uppercase leading-[0.8] tracking-tighter text-foreground mb-12">
              MASA <br />
              <span className="text-primary italic">DEPAN.</span>
            </h2>
            <div className="inline-block border-2 border-border px-6 py-2">
              <span className="text-xs font-black uppercase tracking-[0.4em] text-muted">BUILD_VERSION: 2.0.4-STABLE</span>
            </div>
          </div>

          <div className="space-y-12">
            <p className="text-2xl text-foreground font-semibold leading-tight tracking-tighter uppercase">
              Bergabunglah dengan standar baru kecerdasan dokumen. Ubah informasi menjadi aksi nyata hari ini.
            </p>
            <div className="flex flex-col gap-4">
              <button className="bg-primary text-white px-12 py-8 font-black uppercase tracking-tighter text-2xl hover:bg-foreground transition-all border-4 border-primary shadow-lg shadow-primary/20">
                MULAI SEKARANG →
              </button>
              <div className="grid grid-cols-2 gap-4">
                <button className="bg-foreground/5 text-foreground px-8 py-6 font-black uppercase tracking-widest text-sm border-2 border-border hover:bg-foreground/10 transition-colors">
                  PANDUAN
                </button>
                <button className="bg-foreground/5 text-foreground px-8 py-6 font-black uppercase tracking-widest text-sm border-2 border-border hover:bg-foreground/10 transition-colors">
                  STATUS LAYANAN
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-12 pt-16 border-t-2 border-border">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-primary rounded-lg shadow-sm" />
            <span className="text-3xl font-black uppercase tracking-tighter text-foreground">QuickSync</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
            {["Privacy", "Terms", "Twitter", "GitHub"].map((link) => (
              <a key={link} href="#" className="text-xs font-black uppercase tracking-[0.3em] text-muted hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-1">{link}</a>
            ))}
          </div>
          
          <div className="text-[10px] font-black uppercase tracking-[0.5em] text-muted/40">
            © 2026 QUICK-SYNC LABS // HAK CIPTA DILINDUNGI
          </div>
        </div>
      </div>
    </footer>
  );
}
