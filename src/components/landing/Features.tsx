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
    <section className="py-32 px-6 md:px-12 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-8">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-6 block">Capabilities</span>
            <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tight">
              Powerful <span className="text-primary italic">Output.</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border">
          {features.map((feature, idx) => (
            <div 
              key={idx}
              className={`${feature.span} bg-black p-12 hover:bg-white/[0.02] transition-colors group`}
            >
              <div className="w-12 h-12 border border-white/10 flex items-center justify-center mb-10 group-hover:border-primary transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-3xl font-bold uppercase tracking-tight mb-4">{feature.title}</h3>
              <p className="text-foreground/40 leading-relaxed max-w-sm">
                {feature.desc}
              </p>
            </div>
          ))}
          
          <div className="md:col-span-3 bg-primary p-12 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-6">
              <Speaker className="w-12 h-12 text-black" />
              <div>
                <h3 className="text-3xl font-bold uppercase text-black">Sonic Playback</h3>
                <p className="text-black/60 font-bold uppercase text-xs tracking-widest">Listen to your documents on the go.</p>
              </div>
            </div>
            <button className="bg-black text-white px-10 py-5 font-bold uppercase tracking-widest hover:scale-105 transition-transform">
              Try It Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
