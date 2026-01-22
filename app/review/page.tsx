"use client";

import React from 'react';
import { 
  Bell, 
  TrendingUp, 
  Calendar, 
  Target, 
  MessageSquare, 
  BrainCircuit, 
  ChevronRight,
  Zap
} from 'lucide-react';

// --- Data Constants ---
const WEEKLY_ACTIVITY = [70, 50, 30, 90, 60, 15, 40];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const FEEDBACK_DATA = [
  {
    title: "System Design Mock",
    icon: <BrainCircuit size={20} />,
    color: "text-blue-500 bg-blue-500/10",
    text: "Excellent clarity in load balancing. Focus more on database sharding trade-offs.",
    score: "4.8",
    tag: "AI ANALYZED",
  },
  {
    title: "Behavioral Session",
    icon: <MessageSquare size={20} />,
    color: "text-orange-500 bg-orange-500/10",
    text: "STAR stories are impactful, but keep the 'Situation' part more concise.",
    score: "4.2",
    tag: "HUMAN COACH",
  },
];

export default function OptimizedDashboard() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-50 pb-12 selection:bg-blue-500/30">
      
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-[#0f172a]/80 backdrop-blur-xl border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4 px-6">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
                alt="Avatar"
                className="relative size-10 rounded-full border border-slate-700 bg-slate-800"
              />
            </div>
            <div className="hidden sm:block">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Candidate</p>
              <h2 className="text-sm font-bold">Alex Rivera</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl bg-slate-800/50 border border-slate-700 hover:bg-slate-700 transition-all text-slate-300">
              <Bell size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Layout Grid: 3 Columns on Large, 1 on Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN: Stats & Main Charts (8 Units) */}
          <div className="lg:col-span-8 space-y-6">
            
            <header>
              <h1 className="text-3xl font-black tracking-tight">Performance Overview</h1>
              <p className="text-slate-400">Track your interview readiness and skill growth.</p>
            </header>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Success Rate" value="84%" trend="+5%" icon={<Target size={16}/>} />
              <StatCard label="Interviews" value="12" trend="+2" icon={<Calendar size={16}/>} />
              <StatCard label="Avg. Score" value="7.8" trend="+0.4" icon={<TrendingUp size={16}/>} />
              <StatCard label="Practice" value="4.5h" trend="Goal: 6h" icon={<Zap size={16}/>} />
            </div>

            {/* Main Activity Chart */}
            <div className="rounded-3xl border border-slate-800/60 bg-slate-900/40 p-6">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-lg">Weekly Activity</h3>
                <select className="bg-slate-800 border-none text-xs font-bold rounded-lg px-3 py-1.5 focus:ring-2 ring-blue-500">
                  <option>Last 7 Days</option>
                  <option>Last Month</option>
                </select>
              </div>
              
              <div className="grid grid-cols-7 gap-3 sm:gap-6 items-end h-48">
                {WEEKLY_ACTIVITY.map((h, i) => (
                  <div key={i} className="flex flex-col items-center gap-3 h-full justify-end group">
                    <div
                      className={`w-full max-w-[40px] rounded-t-xl transition-all duration-500 ease-out ${
                        i === 3 ? "bg-blue-500 shadow-lg shadow-blue-500/20" : "bg-slate-700/40 group-hover:bg-slate-700"
                      }`}
                      style={{ height: `${h}%` }}
                    />
                    <span className="text-[10px] font-bold text-slate-500">{DAYS[i]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Score Trend SVG */}
            <div className="rounded-3xl border border-slate-800/60 bg-slate-900/40 p-6">
              <h3 className="font-bold text-lg mb-4">Score Trajectory</h3>
              <div className="h-32 w-full">
                <svg viewBox="0 0 400 100" preserveAspectRatio="none" className="w-full h-full stroke-blue-500 drop-shadow-2xl">
                  <defs>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity="0.3"/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 80 Q 50 60, 100 70 T 200 30 T 300 50 T 400 10"
                    fill="none"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M0 80 Q 50 60, 100 70 T 200 30 T 300 50 T 400 10 V 100 H 0 Z"
                    fill="url(#lineGradient)"
                    stroke="none"
                  />
                </svg>
              </div>
              <div className="flex justify-between mt-4 text-[10px] font-black text-slate-600 tracking-widest">
                <span>WEEK 1</span><span>WEEK 2</span><span>WEEK 3</span><span>WEEK 4</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Goals & Feedback (4 Units) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Goal Tracker */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
              <h3 className="font-bold text-lg mb-6">Current Progress</h3>
              <div className="flex flex-col items-center">
                <div className="relative size-40">
                  <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" strokeWidth="8" stroke="currentColor" className="text-slate-800" fill="none" />
                    <circle cx="50" cy="50" r="45" strokeWidth="8" stroke="currentColor" className="text-blue-500" fill="none" 
                            strokeDasharray="283" strokeDashoffset="70" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black">75%</span>
                    <span className="text-[10px] font-bold text-slate-500">OF GOAL</span>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <p className="text-sm font-bold text-slate-200">Practice Goal: 6 Hours</p>
                  <p className="text-xs text-slate-400 mt-1">1.5h remaining this week</p>
                </div>
                <button className="w-full mt-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 font-bold transition-all text-sm">
                  Continue Training
                </button>
              </div>
            </div>

            {/* Feedback List */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Recent Insights</h3>
                <button className="text-blue-400 text-xs font-bold hover:underline">See All</button>
              </div>
              <div className="space-y-3">
                {FEEDBACK_DATA.map((item, idx) => (
                  <FeedbackCard key={idx} {...item} />
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

// --- Responsive Sub-components ---

function StatCard({ label, value, trend, icon }: { label: string, value: string, trend: string, icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 hover:bg-slate-800/40 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="p-1.5 rounded-lg bg-slate-800 text-slate-400">{icon}</div>
        <span className="text-[10px] font-bold text-emerald-400">{trend}</span>
      </div>
      <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">{label}</p>
      <p className="text-xl font-black mt-1">{value}</p>
    </div>
  );
}

function FeedbackCard({ title, icon, color, text, score, tag }: any) {
  return (
    <div className="group flex flex-col sm:flex-row gap-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 hover:border-slate-600 transition-all cursor-pointer">
      <div className={`size-12 shrink-0 flex items-center justify-center rounded-xl transition-transform group-hover:scale-110 ${color}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <p className="text-sm font-bold truncate text-slate-200">{title}</p>
          <span className="text-[11px] font-black text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded shrink-0">{score}</span>
        </div>
        <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">{text}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[9px] font-black tracking-widest text-slate-500">{tag}</span>
          <ChevronRight size={14} className="text-slate-600 group-hover:text-blue-400" />
        </div>
      </div>
    </div>
  );
}