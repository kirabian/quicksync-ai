import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { 
  User, 
  Settings, 
  FileText, 
  MessageSquare, 
  CreditCard, 
  Crown, 
  Clock, 
  ChevronRight,
  LogOut
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const summarizeLimit = 5;
  const chatLimit = 20;

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Navigation */}
      <nav className="border-b border-white/5 bg-black/50 backdrop-blur-xl px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg" />
          <span className="font-bold tracking-tighter text-xl">QuickSync</span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
            {profile?.is_premium ? (
              <Crown className="w-3.5 h-3.5 text-yellow-500" />
            ) : (
              <User className="w-3.5 h-3.5 text-white/40" />
            )}
            <span className="text-xs font-medium">{profile?.full_name || user.email}</span>
          </div>
          <form action="/auth/signout" method="post">
            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/40 hover:text-white">
              <LogOut className="w-5 h-5" />
            </button>
          </form>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sidebar / Stats */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                {profile?.is_premium ? <Crown className="w-24 h-24" /> : <User className="w-24 h-24" />}
              </div>
              
              <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6">Status Akun</h3>
              <div className="flex items-center gap-4 mb-8">
                <div className={`p-4 rounded-2xl ${profile?.is_premium ? 'bg-yellow-500/10 text-yellow-500' : 'bg-primary/10 text-primary'}`}>
                  {profile?.is_premium ? <Crown className="w-8 h-8" /> : <User className="w-8 h-8" />}
                </div>
                <div>
                  <h4 className="text-xl font-bold">{profile?.is_premium ? 'Premium' : 'Free Plan'}</h4>
                  <p className="text-sm text-white/40">{profile?.is_premium ? 'Unlimited Access' : 'Limited Usage'}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2">
                    <span className="text-white/40">Summarize (Mingguan)</span>
                    <span>{profile?.summarize_count || 0} / {profile?.is_premium ? '∞' : summarizeLimit}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${Math.min(100, ((profile?.summarize_count || 0) / summarizeLimit) * 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2">
                    <span className="text-white/40">Chat Docs (Bulanan)</span>
                    <span>{profile?.chat_count || 0} / {profile?.is_premium ? '∞' : chatLimit}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500" 
                      style={{ width: `${Math.min(100, ((profile?.chat_count || 0) / chatLimit) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {!profile?.is_premium && (
                <button className="w-full mt-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-primary transition-colors">
                  Upgrade to Premium
                </button>
              )}
            </div>

            <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-2xl">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link href="/" className="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors group">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">New Summary</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" />
                </Link>
                <div className="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Settings className="w-4 h-4 text-white/40" />
                    <span className="text-sm font-medium">Settings</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" />
                </div>
              </div>
            </div>
          </div>

          {/* Document History */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Riwayat Dokumen</h2>
              <div className="flex gap-2">
                 <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-white/40">
                  Total: {documents?.length || 0}
                 </div>
              </div>
            </div>

            <div className="space-y-4">
              {documents && documents.length > 0 ? (
                documents.map((doc) => (
                  <div key={doc.id} className="bg-[#0a0a0a] border border-white/10 p-6 rounded-2xl hover:border-white/20 transition-all group">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-white/5 rounded-xl text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{doc.name}</h3>
                          <div className="flex items-center gap-4 text-white/40 text-xs">
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              {new Date(doc.created_at).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <MessageSquare className="w-3.5 h-3.5" />
                              Chat Available
                            </span>
                          </div>
                        </div>
                      </div>
                      <Link 
                        href={`/dashboard/chat/${doc.id}`}
                        className="px-6 py-2.5 bg-white/5 hover:bg-white hover:text-black rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
                      >
                        Chat Now
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-[#0a0a0a] border border-white/5 border-dashed p-20 rounded-2xl text-center">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileText className="w-8 h-8 text-white/20" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Belum ada dokumen</h3>
                  <p className="text-white/40 text-sm max-w-xs mx-auto mb-8">
                    Upload dokumen pertama kamu di halaman utama untuk mulai menganalisis.
                  </p>
                  <Link href="/" className="px-8 py-3 bg-primary text-black font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-white transition-colors">
                    Upload Sekarang
                  </Link>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
