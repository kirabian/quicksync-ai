"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Github, Twitter, Mail, Send, Loader2, User, AtSign, Key } from "lucide-react";
import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  
  const supabase = createClient();
  const router = useRouter();

  const handleSocialLogin = async (provider: 'google' | 'github' | 'twitter' | 'telegram') => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider as any,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isRegister) {
        if (!email || !username || !fullName || !password) {
          toast.error("Please fill all fields");
          setIsLoading(false);
          return;
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username,
              full_name: fullName,
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) throw error;
        toast.success("Check your email for the OTP code!");
        setShowOtpInput(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        toast.success("Welcome back!");
        onClose();
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'signup',
      });

      if (error) throw error;
      toast.success("Account verified! You can now log in.");
      setShowOtpInput(false);
      setIsRegister(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

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
            <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
            
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold uppercase tracking-tight mb-4">
                {isRegister ? (showOtpInput ? "Verifikasi Email" : "Daftar Akun") : "Limit Tercapai"}
              </h2>
              <p className="text-foreground/40 text-sm font-medium">
                {isRegister 
                  ? (showOtpInput ? "Masukkan kode OTP yang dikirim ke email kamu." : "Buat akun untuk menyimpan dokumen dan chat history.") 
                  : "Kamu telah menggunakan jatah gratis. Silakan login untuk akses premium."}
              </p>
            </div>

            {showOtpInput ? (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="flex items-center gap-4 bg-white/5 p-1 border border-white/10 focus-within:border-primary transition-colors">
                  <input 
                    type="text" 
                    placeholder="Masukkan Kode OTP"
                    className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-xs font-medium"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-primary text-black font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-white transition-colors"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verifikasi"}
                </button>
              </form>
            ) : (
              <div className="space-y-3">
                {!isRegister && (
                  <>
                    <button 
                      onClick={() => handleSocialLogin('google')}
                      disabled={isLoading}
                      className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-primary transition-colors group"
                    >
                      Login with Google
                    </button>
                    
                    <button 
                      onClick={() => handleSocialLogin('github')}
                      disabled={isLoading}
                      className="w-full py-4 bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-white/10 transition-colors"
                    >
                      Login with GitHub
                    </button>
                    
                    <button 
                      onClick={() => handleSocialLogin('telegram')}
                      disabled={isLoading}
                      className="w-full py-4 bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-white/10 transition-colors"
                    >
                      <Send className="w-4 h-4 text-[#229ED9]" />
                      Login with Telegram
                    </button>
                  </>
                )}

                <form onSubmit={handleEmailAuth} className="mt-8 space-y-4 pt-8 border-t border-white/5">
                  {isRegister && (
                    <>
                      <div className="flex items-center gap-4 bg-white/5 p-1 border border-white/10 focus-within:border-primary transition-colors">
                        <User className="w-4 h-4 ml-4 text-white/40" />
                        <input 
                          type="text" 
                          placeholder="Nama Lengkap"
                          className="flex-1 bg-transparent border-none outline-none px-2 py-3 text-xs font-medium"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="flex items-center gap-4 bg-white/5 p-1 border border-white/10 focus-within:border-primary transition-colors">
                        <AtSign className="w-4 h-4 ml-4 text-white/40" />
                        <input 
                          type="text" 
                          placeholder="Username"
                          className="flex-1 bg-transparent border-none outline-none px-2 py-3 text-xs font-medium"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                        />
                      </div>
                    </>
                  )}
                  <div className="flex items-center gap-4 bg-white/5 p-1 border border-white/10 focus-within:border-primary transition-colors">
                    <Mail className="w-4 h-4 ml-4 text-white/40" />
                    <input 
                      type="email" 
                      placeholder="Email"
                      className="flex-1 bg-transparent border-none outline-none px-2 py-3 text-xs font-medium"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex items-center gap-4 bg-white/5 p-1 border border-white/10 focus-within:border-primary transition-colors">
                    <Key className="w-4 h-4 ml-4 text-white/40" />
                    <input 
                      type="password" 
                      placeholder="Password"
                      className="flex-1 bg-transparent border-none outline-none px-2 py-3 text-xs font-medium"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-primary text-black font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-white transition-colors"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isRegister ? "DAFTAR SEKARANG" : "MASUK")}
                  </button>
                </form>

                <p className="mt-4 text-[9px] font-bold uppercase tracking-widest text-white/20 text-center cursor-pointer hover:text-primary transition-colors"
                   onClick={() => setIsRegister(!isRegister)}>
                  {isRegister ? "Sudah punya akun? Masuk" : "Belum punya akun? Daftar gratis"}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

