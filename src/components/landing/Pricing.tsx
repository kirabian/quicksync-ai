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
    <section className="py-32 px-6 md:px-12 bg-[#F8FAFC] border-b border-border">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-8">
          <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tight text-foreground">
            Harga <span className="text-primary">Transparan.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {tiers.map((tier, idx) => (
            <div 
              key={idx}
              className={`p-12 border-2 ${tier.featured ? 'border-primary bg-primary text-white shadow-lg' : 'border-border bg-white text-foreground'} flex flex-col`}
            >
              <div className="mb-12">
                <span className={`text-[10px] font-bold uppercase tracking-[0.3em] mb-4 block ${tier.featured ? 'text-white/60' : 'text-primary'}`}>
                  {tier.name}
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-7xl font-bold tracking-tighter">${tier.price}</span>
                  <span className={`text-xs font-bold uppercase tracking-widest ${tier.featured ? 'text-white/40' : 'text-muted'}`}>{tier.period}</span>
                </div>
              </div>

              <div className="flex-1 space-y-6 mb-12">
                {tier.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Check className={`w-4 h-4 ${tier.featured ? 'text-white' : 'text-primary'}`} />
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${tier.featured ? 'text-white/90' : 'text-muted'}`}>
                      {f}
                    </span>
                  </div>
                ))}
              </div>

              <button className={`w-full py-6 font-bold uppercase tracking-[0.2em] transition-all border-2 ${
                tier.featured 
                ? 'bg-white text-primary border-white hover:bg-transparent hover:text-white' 
                : 'bg-primary text-white border-primary hover:bg-transparent hover:text-primary'
              }`}>
                {tier.name === "Starter" ? "Paket Saat Ini" : "Pilih Paket"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
