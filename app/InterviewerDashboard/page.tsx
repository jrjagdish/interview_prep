"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Timer,
  TrendingUp,
  Plus,
  Settings,
  Eye,
  Trash2,
  AlertTriangle,
  BarChart3,
  LayoutDashboard,
  ShieldCheck,
  Link as LinkIcon,
  Loader2,
} from "lucide-react";
import Link from "next/link";

// --- TYPES & INTERFACES ---
interface Candidate {
  id: string;
  username?: string;
  email?: string;
}

export default function EnhancedAdminPanel() {
  // Fixed "never" type error by providing the Candidate interface
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteLoading, setInviteLoading] = useState(false);

  // --- API LOGIC ---

  // Fetch candidate pool from backend
  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/guest-candidates/");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setCandidates(data);
    } catch (error) {
      console.error("Fetch candidates error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  // Generate Invite Link
  const handleGenerateInvite = async () => {
    try {
      setInviteLoading(true);
      const response = await fetch("/api/admin/invite-link", {
        method: "POST",
      });
      const data = await response.json();

      // Automatic copy to clipboard
      await navigator.clipboard.writeText(data.invite_link);
      alert("Invite link generated and copied to clipboard!");
    } catch (error) {
      alert("Error generating link. Check console for details.");
    } finally {
      setInviteLoading(false);
    }
  };

  // Delete Candidate Logic
  const handleDeleteCandidate = async (candidateId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this user? This action is irreversible.",
      )
    )
      return;

    try {
      const response = await fetch(`/api/admin/guest-users/${candidateId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Update UI state locally after successful deletion
        setCandidates((prev) => prev.filter((c) => c.id !== candidateId));
      } else {
        throw new Error("Delete failed");
      }
    } catch (error) {
      alert("Could not delete user.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0b1219] text-white flex flex-col lg:flex-row">
      {/* SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-white/5 bg-[#0b1219] p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="size-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <ShieldCheck size={20} />
          </div>
          <span className="font-black tracking-tighter text-xl">SHIELD AI</span>
        </div>

        <nav className="space-y-2 flex-1">
          <NavItem
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            active
          />
          <NavItem icon={<Users size={18} />} label="Candidate Pool" />
          <NavItem icon={<BarChart3 size={18} />} label="Analytics" />
          <NavItem icon={<Settings size={18} />} label="Platform Settings" />
        </nav>

        <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            System Health
          </p>
          <div className="mt-2 flex items-center gap-2">
            <div className="size-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium">All systems normal</span>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        {/* Top App Bar */}
        <header className="sticky top-0 z-50 flex items-center justify-between p-4 border-b border-white/5 bg-[#0b1219]/80 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
              alt="Admin"
              className="w-10 h-10 rounded-xl border border-white/10 bg-slate-800 object-cover"
            />
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-slate-500 uppercase">
                Administrator
              </p>
              <p className="text-sm font-bold leading-none mt-1">
                Sarah Jenkins
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-white/5 rounded-lg text-slate-400">
              <Settings size={20} />
            </button>
          </div>
        </header>

        <main className="p-4 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
          {/* Stats Overview */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Users"
              value={candidates.length.toString()}
              delta="+0%"
              icon={<Users size={20} />}
            />
            <StatCard
              title="Avg. Session"
              value="24m 12s"
              delta="+2.1%"
              icon={<Timer size={20} />}
            />
            <StatCard
              title="Active Mocks"
              value="842"
              delta="+12%"
              icon={<TrendingUp size={20} />}
            />
            <StatCard
              title="Flagged"
              value="4"
              delta="Critical"
              icon={<AlertTriangle size={20} />}
              color="text-red-500"
            />
          </section>

          <div className="grid lg:grid-cols-3 gap-8">
            <section className="lg:col-span-2 bg-slate-900/40 border border-white/5 rounded-[2rem] p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold">Platform Growth</h2>
                <select className="bg-transparent border-none text-xs font-bold text-slate-500 focus:ring-0">
                  <option>Last 7 Days</option>
                </select>
              </div>
              <div className="h-48 flex items-end justify-between gap-1 px-2">
                {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-blue-600/20 rounded-t-lg relative group transition-all hover:bg-blue-600/40"
                    style={{ height: `${h}%` }}
                  ></div>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 gap-3">
                <QuickAction
                  icon={
                    inviteLoading ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <LinkIcon size={20} />
                    )
                  }
                  label="Generate Invite Link"
                  onClick={handleGenerateInvite}
                  primary
                />
                <QuickAction icon={<Plus size={20} />} label="Add Question" />
              </div>
            </section>
          </div>

          {/* Moderation Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Candidate Review Queue</h2>
              {loading && (
                <Loader2 size={20} className="animate-spin text-blue-500" />
              )}
            </div>

            <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] overflow-hidden">
              <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                <div className="col-span-4">Candidate</div>
                <div className="col-span-3">Details</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-3 text-right">Actions</div>
              </div>

              <div className="divide-y divide-white/5">
                {candidates.length > 0 ? (
                  candidates.map((user) => (
                    <FlaggedUser
                      key={user.id}
                      id={user.id}
                      name={user.username || "Anonymous Guest"}
                      reason={user.email || "No email provided"}
                      score="--"
                      priority="Medium"
                      onDelete={() => handleDeleteCandidate(user.id)}
                    />
                  ))
                ) : (
                  <div className="p-10 text-center text-slate-500 text-sm italic">
                    {loading
                      ? "Refreshing candidate list..."
                      : "No candidates found in your pool."}
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

/* ---------------- UI Components (Stateless) ---------------- */

function FlaggedUser({ id, name, reason, score, priority, onDelete }: any) {
  const priorityColor =
    priority === "High"
      ? "text-red-500 bg-red-500/10"
      : "text-amber-500 bg-amber-500/10";

  return (
    <div className="lg:grid lg:grid-cols-12 flex flex-col items-start lg:items-center gap-4 p-5 lg:px-6 hover:bg-white/[0.02] transition-colors">
      <div className="lg:col-span-4 flex items-center gap-4 w-full">
        <img
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`}
          alt="User"
          className="size-10 rounded-lg bg-slate-800 border border-white/10"
        />
        <div className="min-w-0">
          <p className="font-bold text-sm truncate">{name}</p>
          <p className="text-[10px] text-slate-500 font-medium">
            ID: #{id.slice(0, 8)}
          </p>
        </div>
        <span
          className={`lg:hidden ml-auto text-[10px] px-2 py-0.5 rounded border font-black uppercase ${priorityColor}`}
        >
          {priority}
        </span>
      </div>

      <div className="lg:col-span-3">
        <p className="text-xs text-slate-400 font-medium">{reason}</p>
      </div>

      <div className="lg:col-span-2 hidden lg:block">
        <span className="text-[10px] font-black text-blue-400 bg-blue-400/10 px-2 py-1 rounded-full uppercase tracking-tighter border border-blue-400/20">
          Active
        </span>
      </div>

      <div className="lg:col-span-3 w-full lg:w-auto flex items-center justify-between lg:justify-end gap-2">
        <div className="flex items-center gap-1">
          <button
            title="View Details"
            className="p-2.5 bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white rounded-xl transition-all"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={onDelete}
            title="Delete"
            className="p-2.5 bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white rounded-xl transition-all"
          >
            <Trash2 size={16} />
          </button>
        </div>
        <Link href={`/review/${id}`}>
          <button className="px-5 py-2.5 bg-white text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-blue-500 hover:text-white transition-all">
            Review
          </button>
        </Link>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active = false }: any) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${active ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}
    >
      {icon} <span className="text-sm font-bold">{label}</span>
    </div>
  );
}

function StatCard({ title, value, delta, icon, color = "text-blue-500" }: any) {
  return (
    <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <div className={`p-2 rounded-lg bg-slate-800 ${color}`}>{icon}</div>
        <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
          {delta}
        </span>
      </div>
      <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
        {title}
      </p>
      <p className="text-2xl font-bold mt-1 tracking-tight">{value}</p>
    </div>
  );
}

function QuickAction({ icon, label, primary, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all font-bold text-sm ${primary ? "bg-blue-600 border-blue-500 text-white shadow-lg" : "bg-slate-900/40 border-white/5 text-slate-300 hover:bg-white/5"}`}
    >
      {icon} {label}
    </button>
  );
}
