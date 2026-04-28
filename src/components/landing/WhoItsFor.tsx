"use client";

import { motion } from "framer-motion";

const personas = [
  {
    role: "The Executive",
    case: "Turn 50-page industry reports into 5-minute briefings before the board meeting.",
    image: "https://images.unsplash.com/photo-1519085185758-29178f07c00a?auto=format&fit=crop&q=80&w=800"
  },
  {
    role: "The Researcher",
    case: "Extract key citations and datasets from academic papers without the manual slog.",
    image: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&q=80&w=800"
  },
  {
    role: "The Freelancer",
    case: "Draft professional follow-ups and project proposals from raw client transcripts.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800"
  },
  {
    role: "The Team Lead",
    case: "Convert meeting recordings into Notion-ready action items with assigned dates.",
    image: "https://images.unsplash.com/photo-1522071823990-b9978ec20227?auto=format&fit=crop&q=80&w=800"
  }
];

export default function WhoItsFor() {
  return (
    <section className="py-32 px-6 md:px-12 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-24">
          <h2 className="text-6xl md:text-8xl font-display font-extrabold uppercase tracking-tighter leading-[0.8] max-w-2xl">
            Built for <br />
            those who <span className="text-primary italic">do.</span>
          </h2>
          <div className="hidden lg:block w-32 h-32 border-2 border-foreground/5 rotate-12 flex-shrink-0" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-foreground/10 border border-foreground/10">
          {personas.map((p, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: idx * 0.2 }}
              className="group relative h-[400px] bg-background p-12 flex flex-col justify-end overflow-hidden"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 bg-cover bg-center grayscale" style={{ backgroundImage: `url(${p.image})` }} />
              
              <div className="relative z-10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary mb-4 block">Persona 0{idx + 1}</span>
                <h3 className="text-4xl font-display font-bold uppercase tracking-tight mb-4">{p.role}</h3>
                <p className="max-w-xs text-foreground/50 font-medium leading-relaxed">
                  {p.case}
                </p>
              </div>
              
              <div className="absolute top-12 right-12 text-[80px] font-display font-black text-foreground/5 select-none leading-none">
                {idx + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
