"use client";

import { motion } from "framer-motion";
import { Link2, Cpu, FileCheck } from "lucide-react";

const steps = [
  {
    icon: Link2,
    title: "Input Data",
    desc: "Paste any URL or upload documents. We support PDF, Markdown, and raw text formats."
  },
  {
    icon: Cpu,
    title: "Process Intent",
    desc: "Our AI engine analyzes the content to extract core themes, deadlines, and action items."
  },
  {
    icon: FileCheck,
    title: "Sync Result",
    desc: "Get a structured brief ready to be pushed to Notion, Slack, or exported as a professional draft."
  }
];

export default function HowItWorks() {
  return (
    <section className="py-32 px-6 md:px-12 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-8">
          <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tight max-w-lg">
            Built for <span className="text-primary italic">Precision.</span>
          </h2>
          <p className="max-w-xs text-foreground/40 text-sm font-bold uppercase tracking-widest leading-loose">
            From raw information to actionable intelligence in three structured steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group"
            >
              <div className="w-16 h-16 bg-primary flex items-center justify-center mb-10 text-primary-foreground">
                <step.icon className="w-8 h-8" />
              </div>
              <div className="space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20">Step 0{idx + 1}</span>
                <h3 className="text-2xl font-bold uppercase tracking-tight">{step.title}</h3>
                <p className="text-foreground/50 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
