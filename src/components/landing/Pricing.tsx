"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const tiers = [
  {
    name: "Starter",
    price: "0",
    desc: "For occasional thinkers.",
    features: ["5 documents/month", "Core Summaries", "Basic Action Items", "Shared Links"],
    cta: "Start Free",
    featured: false
  },
  {
    name: "Pro",
    price: "9",
    desc: "For the information obsessed.",
    features: ["Unlimited Docs", "Professional Drafts", "Notion Sync", "TTS Audio Export", "Translation Engine"],
    cta: "Go Pro",
    featured: true
  },
  {
    name: "Team",
    price: "29",
    desc: "For high-output squads.",
    features: ["Everything in Pro", "API Access", "Shared Workspaces", "Priority Support", "Custom Roles"],
    cta: "Contact Sales",
    featured: false
  }
];

export default function Pricing() {
  return (
    <section className="py-32 px-6 md:px-12 bg-background border-t border-foreground/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-6xl md:text-8xl font-display font-extrabold uppercase tracking-tighter leading-none mb-8">
            Simple <span className="text-primary italic">Math.</span>
          </h2>
          <p className="max-w-lg mx-auto text-foreground/50 text-xl font-medium">
            Transparent pricing for individuals and teams. No hidden fees, no complexity.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-foreground/10 border border-foreground/10">
          {tiers.map((tier, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className={`relative p-12 flex flex-col ${tier.featured ? 'bg-foreground text-background' : 'bg-background text-foreground'}`}
            >
              {tier.featured && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 text-[10px] font-bold uppercase tracking-[0.2em] z-20">
                  Most Popular
                </div>
              )}
              
              <div className="mb-12">
                <span className={`text-[10px] font-bold uppercase tracking-widest ${tier.featured ? 'text-primary' : 'text-primary'} mb-4 block`}>
                  {tier.name}
                </span>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-6xl font-display font-black tracking-tighter">${tier.price}</span>
                  <span className={`text-sm font-bold uppercase tracking-widest ${tier.featured ? 'text-background/50' : 'text-foreground/50'}`}>/mo</span>
                </div>
                <p className={`font-medium ${tier.featured ? 'text-background/60' : 'text-foreground/60'}`}>
                  {tier.desc}
                </p>
              </div>

              <div className="flex-1 space-y-6 mb-12">
                {tier.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check className={`w-4 h-4 ${tier.featured ? 'text-primary' : 'text-primary'}`} />
                    <span className={`text-sm font-bold uppercase tracking-widest ${tier.featured ? 'text-background/80' : 'text-foreground/80'}`}>
                      {f}
                    </span>
                  </div>
                ))}
              </div>

              <button className={`w-full py-6 font-display font-black uppercase tracking-[0.2em] transition-all ${
                tier.featured 
                ? 'bg-primary text-primary-foreground hover:scale-[1.02]' 
                : 'bg-foreground text-background hover:scale-[1.02]'
              }`}>
                {tier.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
