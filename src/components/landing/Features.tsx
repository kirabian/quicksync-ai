"use client";

import { motion } from "framer-motion";
import { Zap, Database, MessageSquare, Share2, Speaker } from "lucide-react";

const features = [
  {
    title: "Surgical Summary",
    desc: "Ekstraksi presisi satu paragraf yang menangkap inti dari laporan atau artikel terpanjang sekalipun.",
    icon: Zap,
    span: "md:col-span-2"
  },
  {
    title: "Action Item Engine",
    desc: "Otomatis mendeteksi tugas, tenggat waktu, dan siapa yang bertanggung jawab dari notulen rapat.",
    icon: Database,
    span: "md:col-span-1"
  },
  {
    title: "Key Decisions",
    desc: "Jangan lewatkan keputusan penting dalam transkrip panjang. Kami menemukannya untuk Anda.",
    icon: MessageSquare,
    span: "md:col-span-1"
  },
  {
    title: "Universal Sync",
    desc: "Ekspor satu klik ke Notion, WhatsApp, atau Telegram untuk koordinasi tim instan.",
    icon: Share2,
    span: "md:col-span-2"
  }
];

export default function Features() {
  return (
    <section className="py-32 px-6 md:px-12 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary mb-4 block">Our Capabilities</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Precision <span className="text-primary">Engineering.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div 
              key={idx}
              className={`p-10 rounded-3xl border border-border bg-foreground/[0.02] hover:bg-foreground/[0.04] transition-all group ${feature.span === 'md:col-span-2' ? 'md:col-span-2' : ''}`}
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-foreground mb-4">{feature.title}</h3>
              <p className="text-foreground/70 font-medium leading-relaxed text-lg">
                {feature.desc}
              </p>
            </div>
          ))}
          
          <div className="md:col-span-3 mt-12 p-12 rounded-3xl bg-primary text-white flex flex-col md:flex-row justify-between items-center gap-10 overflow-hidden relative group">
            <div className="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            
            <div className="relative z-10 flex items-center gap-8">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                <Speaker className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-3xl font-bold tracking-tight mb-1">Sonic Playback</h3>
                <p className="font-medium text-white/90">Dengarkan dokumen Anda dengan kualitas suara jernih.</p>
              </div>
            </div>
            
            <button className="relative z-10 bg-white text-primary px-10 py-5 rounded-2xl font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10">
              Coba Demo Gratis
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
