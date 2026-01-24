"use client";

import React from "react";
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
  MessageSquare,
  BrainCircuit,
  ChevronRight,
  Zap,
} from "lucide-react";

// Formatted data for Recharts
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
  evaluation?: any;
}) {
  // Use real data if evaluation exists, else use placeholder
  const scoreText = evaluation?.score || "7.8";
  const feedbackText = evaluation?.feedback || "Great overall performance!";

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-50 pb-12">
      <nav className="sticky top-0 z-50 bg-[#0f172a]/80 backdrop-blur-xl border-b border-slate-800/60 p-4 px-6 flex items-center justify-between">
        <h2 className="text-sm font-bold">Review Dashboard</h2>
        <div className="p-2 rounded-xl bg-slate-800/50 border border-slate-700">
          <Bell size={20} />
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <header>
              <h1 className="text-3xl font-black tracking-tight">
                Interview Report
              </h1>
              <p className="text-slate-400 mt-2">{feedbackText}</p>
            </header>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                label="Final Score"
                value={scoreText}
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
                trend="Goal: 6h"
                icon={<Zap size={16} />}
              />
            </div>

            {/* REALISTIC GRAPH USING RECHARTS */}
            <div className="rounded-3xl border border-slate-800/60 bg-slate-900/40 p-6 h-[350px]">
              <h3 className="font-bold text-lg mb-6">Performance Trajectory</h3>
              <ResponsiveContainer width="100%" height="80%">
                <AreaChart data={CHART_DATA}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
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
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid #1e293b",
                      borderRadius: "12px",
                    }}
                    itemStyle={{ color: "#3b82f6" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorScore)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            {/* Goal Tracker UI remains same as your original */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
              <h3 className="font-bold text-lg mb-6">Current Progress</h3>
              <div className="flex flex-col items-center">
                <div className="relative size-40">
                  <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      strokeWidth="8"
                      stroke="#1e293b"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      strokeWidth="8"
                      stroke="#3b82f6"
                      fill="none"
                      strokeDasharray="283"
                      strokeDashoffset="70"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black">75%</span>
                  </div>
                </div>
                <button className="w-full mt-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 font-bold transition-all text-sm">
                  Download Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Subcomponents (StatCard, etc) stay the same...
function StatCard({ label, value, trend, icon }: any) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="p-1.5 rounded-lg bg-slate-800 text-slate-400">
          {icon}
        </div>
        <span className="text-[10px] font-bold text-emerald-400">{trend}</span>
      </div>
      <p className="text-[10px] uppercase font-bold text-slate-500">{label}</p>
      <p className="text-xl font-black mt-1">{value}</p>
    </div>
  );
}
