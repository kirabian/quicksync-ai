"use client";

import { useState, useEffect } from "react";
import { WifiOff } from "lucide-react";

export function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    function handleOnline() {
      setIsOffline(false);
    }
    function handleOffline() {
      setIsOffline(true);
    }

    setIsOffline(!navigator.onLine);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[100] bg-zinc-900 border border-zinc-800 text-white rounded-2xl shadow-2xl p-4 flex items-center gap-4 animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-red-500/20 p-2 rounded-full">
        <WifiOff className="w-6 h-6 text-red-500 animate-pulse" />
      </div>
      <div>
        <h4 className="font-bold text-sm">Anda terputus dari WiFi 🦖</h4>
        <p className="text-xs text-zinc-400">Menunggu jaringan kembali...</p>
      </div>
    </div>
  );
}
