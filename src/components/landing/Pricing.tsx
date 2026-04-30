"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const tiers = [
  {
    name: "Starter",
    price: "0",
    period: "/mo",
    features: ["5 documents/month", "Core Summaries", "Basic Action Items", "Shared Links"],
    featured: false
  },
  {
    name: "Pro",
    price: "5",
    period: "/mo",
    features: ["Unlimited Docs", "Notion Sync", "TTS Audio Export", "Translation Engine"],
    featured: true
  },
  {
    name: "Lifetime",
    price: "29",
    period: "once",
    features: ["Everything in Pro", "Unlimited Access", "Priority Support", "Early Beta Access"],
    featured: false
  }
];

export default function Pricing() {
  return (
    <section className="py-32 px-6 md:px-12 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary mb-4 block">Simple Pricing</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Choose Your <span className="text-primary">Scale.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {tiers.map((tier, idx) => (
            <div 
              key={idx}
              className={`p-10 rounded-3xl border ${
                tier.featured 
                ? 'border-primary/50 bg-primary/[0.03] shadow-2xl shadow-primary/10' 
                : 'border-border bg-foreground/[0.02]'
              } flex flex-col`}
            >
              <div className="mb-10">
                <span className="text-sm font-bold text-primary tracking-widest uppercase mb-4 block">
                  {tier.name}
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-6xl font-bold tracking-tight text-foreground">${tier.price}</span>
                  <span className="text-muted font-medium">/{tier.period}</span>
                </div>
              </div>

              <div className="flex-1 space-y-5 mb-12">
                {tier.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-sm font-semibold text-foreground/80">
                      {f}
                    </span>
                  </div>
                ))}
              </div>

              <button className={`w-full py-4 rounded-xl font-bold transition-all ${
                tier.featured 
                ? 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20' 
                : 'bg-foreground/5 text-foreground hover:bg-foreground/10 border border-border'
              }`}>
                {tier.name === "Starter" ? "Paket Saat Ini" : "Mulai Sekarang"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
