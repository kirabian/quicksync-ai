import Link from "next/link";
import { XCircle, ArrowLeft } from "lucide-react";

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="p-4 bg-red-500/10 rounded-full">
            <XCircle className="w-12 h-12 text-red-500" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Autentikasi Gagal</h1>
          <p className="text-white/40 text-sm">
            Terjadi kesalahan saat memverifikasi akun Anda. Link mungkin sudah kadaluwarsa atau sudah digunakan sebelumnya.
          </p>
        </div>

        <div className="pt-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-black font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
