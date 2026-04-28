"use client";

import { motion } from "framer-motion";
import { Share2, Zap, Database, MessageSquare, Speaker } from "lucide-react";

const features = [
  {
    title: "Surgical Summary",
    desc: "Not just a recap. A structured breakdown of themes, sentiment, and core arguments.",
    icon: Zap,
    size: "lg:col-span-8",
    color: "bg-foreground/5"
  },
  {
    title: "Action Extraction",
    desc: "Automatically identifies deadlines and owners. Syncs directly to your calendar.",
    icon: Database,
    size: "lg:col-span-4",
    color: "bg-primary/5"
  },
  {
    title: "Pro Drafts",
    desc: "Need a follow-up email or a formal letter? We draft it based on the document context.",
    icon: MessageSquare,
    size: "lg:col-span-4",
    color: "bg-foreground/5"
  },
  {
    title: "Universal Sync",
    desc: "One click to Notion, Telegram, or WhatsApp. Your knowledge, everywhere.",
    icon: Share2,
    size: "lg:col-span-8",
    color: "bg-foreground/5"
  },
  {
    title: "Sonic Playback",
    desc: "High-fidelity text-to-speech. Listen to your reports while you commute.",
    icon: Speaker,
    size: "lg:col-span-12",
    color: "bg-primary/10"
  }
];

export default function Features() {
  return (
    <section className="py-32 px-6 md:px-12 bg-background border-y border-foreground/5">
      <div className="max-w-7xl mx-auto">
        <div className="mb-24">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-6 block">Capabilities</span>
          <h2 className="text-5xl md:text-7xl font-display font-extrabold uppercase tracking-tighter leading-[0.9]">
            Beyond <br />
            Simple <span className="text-primary italic">Summaries.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {features.map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className={`${feature.size} group relative overflow-hidden border border-foreground/10 p-12 flex flex-col justify-between min-h-[400px] ${feature.color} transition-all duration-500 cursor-default`}
            >
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/[0.02] transition-colors duration-500" />
              
              <div className="relative z-10">
                <div className="w-16 h-16 border border-foreground/10 flex items-center justify-center mb-12 bg-background group-hover:border-primary/50 group-hover:rotate-12 transition-all duration-500">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-4xl font-display font-bold uppercase tracking-tight mb-6">{feature.title}</h3>
                <p className="max-w-md text-lg text-foreground/60 leading-relaxed font-medium">
                  {feature.desc}
                </p>
              </div>
              
              {/* Abstract decorative element for each card */}
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/5 -mb-16 -mr-16 rotate-45 group-hover:scale-150 transition-transform duration-700" />
              
              <div className="relative z-10 mt-12 flex items-center gap-2 overflow-hidden">
                <div className="h-[1px] w-full bg-foreground/10" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/20 whitespace-nowrap">Core Engine</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

