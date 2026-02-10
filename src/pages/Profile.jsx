"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  ArrowLeft,
  Briefcase,
  Calendar,
  Trophy,
  LayoutGrid,
  Loader2,
  LogOut,
  TrendingUp,
  Award,
  Clock,
  ChevronRight,
  FastForward
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useThemeContext } from "../context/ThemeContext";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { theme } = useThemeContext();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const response = await fetch("http://localhost:8000/auth/me", {
  //         method: "GET",
  //         credentials: "include",
  //       });

  //       if (!response.ok) throw new Error("Unauthorized");

  //       const data = await response.json();
  //       setUser(data);
  //     } catch (err) {
  //       navigate("/login");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchUserData();
  // }, [navigate]);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8000/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      navigate("/login");
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 font-sans antialiased pb-20">
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 size-[500px] bg-purple-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 size-[400px] bg-fuchsia-600/5 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl px-6 h-20 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <span className="text-xs font-bold tracking-[0.3em] uppercase opacity-60">
            Engineer Profile
          </span>
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-100 transition-all"
          >
            <LogOut size={20} />
          </button>
        </header>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: User Info */}
          <section className="lg:col-span-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500 blur-[40px] opacity-20" />
              <div className="relative w-32 h-32 rounded-3xl bg-gradient-to-tr from-purple-600 to-fuchsia-400 p-[3px]">
                <div
                  className="w-full h-full rounded-[calc(1.5rem-3px)] bg-white dark:bg-slate-900 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.full_name})`,
                  }}
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-purple-600 text-white p-2 rounded-lg shadow-lg">
                <Award size={16} />
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {user?.full_name || "Engineer"}
              </h2>
              <p className="text-purple-600 dark:text-purple-400 font-semibold flex items-center justify-center lg:justify-start gap-2">
                <Briefcase size={16} />
                {user?.role || "Candidate"}
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                {user?.email}
              </p>
            </div>

            <div className="w-full pt-4 space-y-3">
              <button className="w-full py-3 bg-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/20 hover:bg-purple-700 transition-all active:scale-[0.98]">
                Edit Profile
              </button>
              <button className="w-full py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                Settings
              </button>
            </div>
          </section>

          {/* RIGHT COLUMN: Stats & Charts */}
          <section className="lg:col-span-2 space-y-8">
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Sessions", val: user?.profile?.interview_credits || "0", color: "text-purple-500", bg: "bg-purple-500/10" },
                { label: "Avg Score", val: `${user?.stats?.success_rate || "0"}%`, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                { label: "Skills", val: user?.stats?.skills_count || "0", color: "text-amber-500", bg: "bg-amber-500/10" },
              ].map((s, i) => (
                <div key={i} className={`${s.bg} p-4 rounded-2xl border border-white/5`}>
                  <p className="text-2xl font-bold dark:text-white">{s.val}</p>
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${s.color}`}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* Performance Chart Simulation */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="text-purple-500" size={20} />
                  <h3 className="font-bold">Interview Performance</h3>
                </div>
                <select className="bg-slate-100 dark:bg-slate-800 text-xs font-bold p-2 rounded-lg outline-none">
                  <option>Last 7 Sessions</option>
                  <option>Last 30 Days</option>
                </select>
              </div>

              {/* Simple CSS Bar Chart */}
              <div className="flex items-end justify-between h-40 gap-2 px-2">
                {[40, 70, 55, 90, 65, 85, 95].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <div 
                      className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg relative overflow-hidden flex items-end"
                      style={{ height: '100%' }}
                    >
                      <div 
                        className="w-full bg-gradient-to-t from-purple-600 to-fuchsia-400 transition-all duration-1000 ease-out group-hover:brightness-110"
                        style={{ height: `${h}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold opacity-40">S{i+1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity List */}
            <div className="space-y-4">
               <h3 className="font-bold flex items-center gap-2">
                 <Clock size={18} className="text-slate-400" />
                 Recent Activity
               </h3>
               {[
                 { title: "Technical Mock: React & Node", date: "2 days ago", score: "88%" },
                 { title: "Behavioral: System Design", date: "1 week ago", score: "72%" },
               ].map((act, i) => (
                 <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-purple-500/50 transition-colors cursor-pointer group">
                   <div className="flex items-center gap-4">
                     <div className="size-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600">
                        <LayoutGrid size={18} />
                     </div>
                     <div>
                       <p className="text-sm font-bold">{act.title}</p>
                       <p className="text-[11px] text-slate-500">{act.date}</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-3">
                     <span className="text-sm font-black text-purple-600">{act.score}</span>
                     <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                   </div>
                 </div>
               ))}
            </div>

          </section>
        </div>
      </div>
    </div>
  );
}