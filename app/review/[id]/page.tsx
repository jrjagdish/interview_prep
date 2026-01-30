"use client";

import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Bell,
  TrendingUp,
  Calendar,
  Target,
  RotateCcw,
  Sparkles,
  Zap,
} from "lucide-react";

const CHART_DATA = [
  { name: "Mon", score: 65 },
  { name: "Tue", score: 50 },
  { name: "Wed", score: 80 },
  { name: "Thu", score: 90 },
  { name: "Fri", score: 70 },
  { name: "Sat", score: 40 },
  { name: "Sun", score: 75 },
];

export default function OptimizedDashboard({
  evaluation,
}: {
  evaluation?: { score?: string | number; feedback?: string };
}) {
  // 1. FIX: Prevent Hydration Error by waiting for mount
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scoreText = evaluation?.score || "7.8";
  const feedbackText =
    evaluation?.feedback ||
    "Interview session analyzed. Great overall performance!";

  if (!mounted) return <div className="min-h-screen bg-[#0f172a]" />;

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-50 pb-12 font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#0f172a]/80 backdrop-blur-xl border-b border-slate-800/60 p-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="text-blue-500" size={18} />
          <h2 className="text-sm font-bold tracking-tight">Review Dashboard</h2>
        </div>
        <div className="flex gap-3">
          <button className="p-2 rounded-xl bg-slate-800/50 border border-slate-700 hover:bg-slate-700 transition-colors">
            <Bell size={18} />
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">
            <header>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-4">
                <Zap size={12} />
                SESSION COMPLETED
              </div>
              <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                Interview Report
              </h1>
              <p className="text-slate-400 mt-2 text-lg leading-relaxed">
                {feedbackText}
              </p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                label="Final Score"
                value={`${scoreText}/10`}
                trend="+0.4"
                icon={<TrendingUp size={16} />}
              />
              <StatCard
                label="Success Rate"
                value="84%"
                trend="+5%"
                icon={<Target size={16} />}
              />
              <StatCard
                label="Interviews"
                value="12"
                trend="+2"
                icon={<Calendar size={16} />}
              />
              <StatCard
                label="Practice"
                value="4.5h"
                trend="75%"
                icon={<Zap size={16} />}
              />
            </div>

            {/* Chart Area */}
            <div className="rounded-3xl border border-slate-800/60 bg-slate-900/40 p-6 h-[400px] shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-lg">Performance Trajectory</h3>
                <div className="flex gap-2">
                  <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                    <div className="size-2 rounded-full bg-blue-500" /> SCORE
                  </span>
                </div>
              </div>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={CHART_DATA}>
                    <defs>
                      <linearGradient
                        id="colorScore"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3b82f6"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#1e293b"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      stroke="#64748b"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      dy={10}
                    />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "1px solid #1e293b",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorScore)"
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-sm sticky top-24">
              <h3 className="font-bold text-xl mb-8 text-center">
                Current Progress
              </h3>
              <div className="flex flex-col items-center">
                <div className="relative size-48">
                  <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      strokeWidth="10"
                      stroke="#1e293b"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      strokeWidth="10"
                      stroke="#3b82f6"
                      fill="none"
                      strokeDasharray="264"
                      strokeDashoffset={264 - (264 * 75) / 100}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black">75%</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                      Mastery
                    </span>
                  </div>
                </div>

                <div className="w-full space-y-3 mt-10">
                  <button className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]">
                    Download Detailed PDF
                  </button>
                  <button
                    onClick={() => (window.location.href = "/chat")}
                    className="w-full py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <RotateCcw size={18} />
                    Try Another Session
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, trend, icon }: any) {
  return (
    <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-5 hover:border-slate-700 transition-colors group">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 rounded-xl bg-slate-800 group-hover:bg-blue-600/10 group-hover:text-blue-400 transition-colors text-slate-400">
          {icon}
        </div>
        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
          {trend}
        </span>
      </div>
      <p className="text-[11px] uppercase font-bold text-slate-500 tracking-wider">
        {label}
      </p>
      <p className="text-2xl font-black mt-1 text-white">{value}</p>
    </div>
  );
}
