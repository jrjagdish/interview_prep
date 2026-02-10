import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Back to React Router
import {
  Users,
  Timer,
  Trash2,
  BarChart3,
  LayoutDashboard,
  Zap,
  BrainCircuit,
  Link as LinkIcon,
  Loader2,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { useThemeContext } from "../context/ThemeContext";

export default function AdminPanel() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteLoading, setInviteLoading] = useState(false);
  
  // Destructure theme from your context
  const { theme } = useThemeContext();

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/api/admin/guest-candidates/");
      if (!response.ok) throw new Error("Failed");
      const data = await response.json();
      setCandidates(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleGenerateInvite = async () => {
    try {
      setInviteLoading(true);
      const response = await fetch("http://localhost:8000/api/admin/invite-link", { method: "POST" });
      const data = await response.json();
      if (data.invite_link) {
        await navigator.clipboard.writeText(data.invite_link);
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      alert("Error generating link.");
    } finally {
      setInviteLoading(false);
    }
  };

  const handleDeleteCandidate = async (id) => {
    if (!confirm("Delete this candidate?")) return;
    try {
      const response = await fetch(`http://localhost:8000/api/admin/guest-users/${id}`, { method: "DELETE" });
      if (response.ok) {
        setCandidates((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (error) {
      alert("Could not delete.");
    }
  };

  return (
    /* We wrap the whole component in the theme class so tailwind 'dark:' works */
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen w-full bg-slate-50 dark:bg-[#05080a] text-slate-900 dark:text-slate-200 flex flex-col lg:flex-row transition-colors duration-300">
        
        {/* SIDEBAR */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 dark:border-white/5 bg-white dark:bg-[#05080a] p-6 sticky top-0 h-screen">
          <Link to="/" className="flex items-center gap-2.5 mb-10 px-2 group">
            <div className="relative">
              <div className="size-8 bg-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-600/20">
                <Zap size={18} className="text-white fill-white" />
              </div>
              <BrainCircuit size={10} className="absolute -top-1 -right-1 text-purple-500 bg-white dark:bg-[#05080a] rounded-full" />
            </div>
            <span className="font-black tracking-tighter text-lg dark:text-white uppercase">
              Inter<span className="text-purple-600">Pre</span>
            </span>
          </Link>

          <nav className="space-y-1.5 flex-1">
            <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" active />
            <NavItem icon={<Users size={18} />} label="Candidates" />
            <NavItem icon={<BarChart3 size={18} />} label="Analytics" />
          </nav>

          <div className="mt-auto p-4 bg-slate-100 dark:bg-purple-600/5 rounded-2xl border border-slate-200 dark:border-purple-500/10">
            <p className="text-[10px] text-slate-500 dark:text-purple-400/60 font-black uppercase tracking-widest">System Status</p>
            <div className="mt-2 flex items-center gap-2">
              <div className="size-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-500/90">Node Online</span>
            </div>
          </div>
        </aside>

        <div className="flex-1 flex flex-col">
          {/* HEADER */}
          <header className="sticky top-0 z-40 flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-[#05080a]/80 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
                className="size-9 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-white/10"
                alt="Admin"
              />
              <div className="hidden sm:block">
                <p className="text-xs font-black dark:text-white leading-none">Sarah Jenkins</p>
                <p className="text-[9px] font-bold text-purple-600 uppercase tracking-tighter mt-1">Super Admin</p>
              </div>
            </div>
            <button 
              onClick={handleGenerateInvite}
              disabled={inviteLoading}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg transition-all shadow-md shadow-purple-600/20 disabled:opacity-50"
            >
              {inviteLoading ? <Loader2 size={14} className="animate-spin" /> : <LinkIcon size={14} />}
              Generate Invite
            </button>
          </header>

          <main className="p-6 lg:p-8 max-w-6xl w-full mx-auto space-y-8">
            {/* STATS */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Total" value={candidates.length} icon={<Users size={18} />} />
              <StatCard title="Avg Time" value="24m" icon={<Timer size={18} />} />
              <StatCard title="Success" value="98%" icon={<CheckCircle2 size={18} />} />
              <StatCard title="Growth" value="+12%" icon={<TrendingUp size={18} />} color="text-emerald-500" />
            </section>

            {/* TABLE SECTION */}
            <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-white/5">
                <h2 className="font-bold dark:text-white text-sm">Review Queue</h2>
                {loading && <Loader2 size={16} className="animate-spin text-purple-500" />}
              </div>

              <div className="divide-y divide-slate-100 dark:divide-white/5">
                {candidates.length > 0 ? (
                  candidates.map((user) => (
                    <div key={user.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:px-6 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors gap-4">
                      <div className="flex items-center gap-3">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} className="size-10 rounded-xl bg-slate-100 dark:border-white/10 dark:bg-slate-800" alt="Avatar" />
                        <div>
                          <p className="text-sm font-bold dark:text-white">{user.username || "Guest User"}</p>
                          <p className="text-[10px] text-slate-500 font-medium">ID: {user.id?.slice(0, 8)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-auto sm:ml-0">
                        <button 
                          onClick={() => handleDeleteCandidate(user.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                        <Link 
                          to={`/review/${user.id}`} 
                          className="px-4 py-2 bg-slate-100 dark:bg-white dark:text-black text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 transition-all shadow-sm"
                        >
                          Review
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-16 text-center text-slate-400 text-sm italic font-medium">
                    {loading ? "Decrypting database..." : "No candidates pending review."}
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active = false }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer transition-all ${active ? "bg-purple-600 text-white shadow-md shadow-purple-600/20" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 dark:hover:text-white"}`}>
      {icon} <span className="text-sm font-bold">{label}</span>
    </div>
  );
}

function StatCard({ title, value, icon, color = "text-purple-600" }) {
  return (
    <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 p-5 rounded-2xl shadow-sm">
      <div className={`${color} mb-3`}>{icon}</div>
      <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest">{title}</p>
      <p className="text-xl font-bold dark:text-white mt-1">{value}</p>
    </div>
  );
}