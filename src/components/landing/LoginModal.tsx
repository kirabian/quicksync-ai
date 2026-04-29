"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Github, Twitter, Mail, Send } from "lucide-react";
import { signIn } from "next-auth/react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 p-10 overflow-hidden"
          >
            {/* Accent line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
            
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold uppercase tracking-tight mb-4">Limit Tercapai</h2>
              <p className="text-foreground/40 text-sm font-medium">
                Kamu telah menggunakan 2 jatah gratis. Silakan login untuk mendapatkan akses tak terbatas dan fitur premium.
              </p>
            </div>

            <div className="space-y-3">
              {/* Cloudflare Turnstile Widget */}
              <div className="flex justify-center mb-6">
                <div className="cf-turnstile" data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} data-theme="dark"></div>
              </div>

              <button 
                onClick={() => signIn("google")}
                className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-primary transition-colors group"
              >
                <div className="w-4 h-4 bg-black/10 rounded-full flex items-center justify-center group-hover:bg-black/20" />
                Login with Google
              </button>
              
              <button 
                onClick={() => signIn("github")}
                className="w-full py-4 bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-white/10 transition-colors"
              >
                Login with GitHub
              </button>
              
              <button 
                onClick={() => signIn("twitter")}
                className="w-full py-4 bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-white/10 transition-colors"
              >
                Login with X / Twitter
              </button>
              
              <button 
                onClick={() => signIn("telegram")}
                className="w-full py-4 bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-white/10 transition-colors"
              >
                <Send className="w-4 h-4 text-[#229ED9]" />
                Login with Telegram
              </button>
            </div>

            <div className="mt-8 pt-8 border-t border-white/5">
              <div className="flex items-center gap-4 bg-white/5 p-1 border border-white/10 focus-within:border-primary transition-colors">
                <input 
                  type="email" 
                  placeholder="email@example.com"
                  className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-xs font-medium"
                />
                <button className="bg-primary text-black p-3 hover:bg-white transition-colors">
                  <Mail className="w-4 h-4" />
                </button>
              </div>
              <p className="mt-4 text-[9px] font-bold uppercase tracking-widest text-white/20 text-center">
                Atau daftar menggunakan email
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
