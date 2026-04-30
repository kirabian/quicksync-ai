"use client";

import { motion } from "framer-motion";

const personas = [
  {
    role: "The Consultant",
    case: "Baca laporan 50 halaman dan temukan action items klien dalam 10 detik."
  },
  {
    role: "The Product Manager",
    case: "Ubah transkrip Zoom/Meet yang berantakan menjadi keputusan & tugas tim."
  },
  {
    role: "The Journalist",
    case: "Masukkan URL artikel panjang untuk ambil intisari fakta tanpa distraksi."
  },
  {
    role: "The Researcher",
    case: "Otomatisasi ekstraksi sitasi dan data dari tumpukan PDF jurnal."
  }
];

export default function WhoItsFor() {
  return (
    <section className="py-32 px-6 md:px-12 bg-background border-y border-border">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary mb-4 block">Target Audience</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Designed for <span className="text-primary">Professionals.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {personas.map((p, idx) => (
            <div 
              key={idx}
              className="group p-10 rounded-3xl border border-border bg-foreground/[0.02] hover:bg-foreground/[0.04] transition-all duration-300 flex flex-col justify-between min-h-[400px]"
            >
              <div className="space-y-8">
                <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-sm">
                  <span className="font-black text-lg">0{idx + 1}</span>
                </div>
                <h3 className="text-3xl font-black tracking-tighter text-foreground uppercase leading-none">{p.role}</h3>
                <p className="text-xl text-foreground/70 font-medium leading-tight">
                  {p.case}
                </p>
              </div>
              
              <div className="pt-8">
                <div className="h-1.5 w-12 bg-primary/30 group-hover:w-full group-hover:bg-primary transition-all duration-500 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
