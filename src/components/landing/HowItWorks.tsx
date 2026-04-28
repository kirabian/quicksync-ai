"use client";

import { motion } from "framer-motion";
import { Link2, Cpu, FileCheck } from "lucide-react";

const steps = [
  {
    icon: Link2,
    title: "Input",
    description: "Paste a URL, drop a PDF, or throw in raw text. QuickSync handles the heavy reading.",
    color: "bg-foreground/5",
    align: "start"
  },
  {
    icon: Cpu,
    title: "Process",
    description: "Our document engine extracts core themes, dates, and actionable intent in real-time.",
    color: "bg-primary/10",
    align: "center"
  },
  {
    icon: FileCheck,
    title: "Output",
    description: "Instantly receive a summary, task list, and a professional draft ready to sync.",
    color: "bg-foreground/5",
    align: "end"
  }
];

export default function HowItWorks() {
  return (
    <section className="py-32 px-6 md:px-12 bg-background relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
          <h2 className="text-[10vw] md:text-[6vw] font-display font-extrabold uppercase leading-[0.9] tracking-tighter">
            Zero <br />
            <span className="text-primary italic">Friction.</span>
          </h2>
          <p className="max-w-sm text-lg text-foreground/50 font-medium leading-tight mb-4">
            We've eliminated the gap between reading and doing. Three steps from chaos to clarity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] bg-foreground/5 -translate-y-1/2 z-0" />
          
          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.2 }}
              className={`relative z-10 p-8 md:p-12 border border-foreground/10 ${step.color} backdrop-blur-sm flex flex-col items-${step.align} text-${step.align === 'center' ? 'center' : step.align}`}
            >
              <div className="w-16 h-16 bg-background border-2 border-foreground/10 flex items-center justify-center mb-8 rotate-3 hover:rotate-0 transition-transform duration-500">
                <step.icon className="w-8 h-8 text-primary" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-2">Step 0{idx + 1}</span>
              <h3 className="text-3xl font-display font-bold uppercase tracking-tight mb-4">{step.title}</h3>
              <p className="text-foreground/60 leading-relaxed font-medium">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
