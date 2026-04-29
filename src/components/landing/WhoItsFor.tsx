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
    <section className="py-32 px-6 md:px-12 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-8">
          <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tight">
            Designed for <span className="text-primary italic">Impact.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border">
          {personas.map((p, idx) => (
            <div 
              key={idx}
              className="bg-black p-10 flex flex-col justify-between aspect-square group hover:bg-primary transition-colors duration-500"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 group-hover:text-black/40">Persona 0{idx + 1}</span>
              <div className="space-y-4">
                <h3 className="text-3xl font-bold uppercase tracking-tight leading-none group-hover:text-black transition-colors">{p.role}</h3>
                <p className="text-foreground/40 font-medium group-hover:text-black/60 transition-colors">
                  {p.case}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
