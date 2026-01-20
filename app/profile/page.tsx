"use client";

import React from 'react';
import { 
  Settings, 
  ArrowLeft, 
  MapPin, 
  Briefcase, 
  Calendar, 
  ChevronRight, 
  Pencil,
  Trophy,
  Play,
  LayoutGrid
} from 'lucide-react';
import BottomNav from '../components/NavBar';// Adjust path based on your file structure

export default function ProfilePage() {
  return (
    <div className="min-h-screen w-full bg-[#0F1113] text-[#E2E2E6] flex justify-center font-sans antialiased selection:bg-indigo-500/30">
      <div className="w-full max-w-md flex flex-col relative pb-32">
        
        {/* 1. ELEGANT HEADER */}
        <header className="sticky top-0 z-30 bg-[#0F1113]/80 backdrop-blur-xl px-6 h-20 flex items-center justify-between">
          <button className="p-2 -ml-2 rounded-full active:bg-white/10 transition-all text-[#C2C6CF]">
            <ArrowLeft size={22} strokeWidth={1.5} />
          </button>
          <span className="text-sm font-bold tracking-[0.3em] uppercase opacity-60">Profile</span>
          <button className="p-2 -mr-2 rounded-full active:bg-white/10 transition-all text-[#C2C6CF]">
            <Settings size={22} strokeWidth={1.5} />
          </button>
        </header>

        {/* 2. HERO SECTION */}
        <section className="px-8 pt-6 pb-12 flex flex-col items-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-indigo-500 blur-[60px] opacity-20" />
            <div className="relative w-32 h-32 rounded-[40px] rotate-3 bg-gradient-to-tr from-indigo-500 to-cyan-400 p-[2px]">
              <div 
                className="w-full h-full rounded-[38px] bg-[#0F1113] bg-cover bg-center -rotate-3 transition-transform hover:rotate-0 duration-500"
                style={{ backgroundImage: 'url("https://api.dicebear.com/7.x/avataaars/svg?seed=Alex")' }}
              />
            </div>
            <button className="absolute -bottom-2 -right-2 p-3 bg-white text-black rounded-2xl shadow-2xl hover:scale-110 active:scale-90 transition-all">
              <Pencil size={18} strokeWidth={2.5} />
            </button>
          </div>

          <h2 className="text-3xl font-black text-white tracking-tight">Alex Rivera</h2>
          <p className="mt-3 text-[#9EA3AE] font-medium flex items-center gap-2">
            <Briefcase size={16} className="text-indigo-400" />
            Senior Product Designer
          </p>
          <p className="mt-1 text-[#6B7280] text-sm flex items-center gap-1.5 font-medium">
            <MapPin size={14} />
            San Francisco, US
          </p>
        </section>

        {/* 3. STATS */}
        <section className="px-6 grid grid-cols-3 gap-4 mb-14">
          {[
            { label: "Interviews", value: "24", icon: <Calendar size={14} />, theme: "bg-indigo-500/10 text-indigo-300" },
            { label: "Success", value: "85%", icon: <Trophy size={14} />, theme: "bg-emerald-500/10 text-emerald-300" },
            { label: "Skills", value: "12", icon: <LayoutGrid size={14} />, theme: "bg-amber-500/10 text-amber-300" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col gap-2">
              <div className={`${stat.theme} rounded-3xl p-5 flex flex-col items-start gap-3 border border-white/5`}>
                {stat.icon}
                <span className="text-2xl font-black tracking-tight">{stat.value}</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-2">{stat.label}</span>
            </div>
          ))}
        </section>

        {/* 4. CONTENT CARDS */}
        <div className="space-y-14">
          {/* About */}
          <section className="px-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-[1px] w-8 bg-indigo-500/50" />
              <h3 className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.2em]">Biography</h3>
            </div>
            <p className="text-lg leading-[1.6] text-[#C2C6CF] font-medium">
              Designer specializing in <span className="text-white underline underline-offset-8 decoration-indigo-500/50">fintech systems</span> and behavioral psychological mapping for Tier-1 companies.
            </p>
          </section>

          {/* Focus Areas */}
          <section className="px-8">
             <h3 className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-6">Expertise</h3>
             <div className="flex flex-wrap gap-2">
              {["System Design", "UX Research", "Behavioral", "Visuals"].map((tag) => (
                <div key={tag} className="px-5 py-3 rounded-2xl bg-[#1C1F22] border border-white/5 text-sm font-bold text-white shadow-sm">
                  {tag}
                </div>
              ))}
             </div>
          </section>

          {/* Sessions */}
          <section className="px-6 pb-20">
            <div className="bg-[#16181A] rounded-[40px] p-2 border border-white/5">
              <div className="px-6 py-6 flex items-center justify-between">
                <h3 className="text-xs font-black text-white uppercase tracking-widest">Sessions</h3>
                <button className="text-[10px] font-bold bg-white/5 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors">VIEW ALL</button>
              </div>
              
              <div className="space-y-1">
                {[
                  { company: "TechCorp Inc.", date: "Oct 24", type: "Design" },
                  { company: "Nova Startups", date: "Oct 28", type: "Lead" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 bg-transparent hover:bg-white/[0.02] active:bg-white/[0.04] rounded-[32px] p-5 transition-all group">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                      <Play size={18} fill="currentColor" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-white">{item.company}</h4>
                      <p className="text-xs text-[#6B7280] font-bold mt-1 uppercase tracking-tighter">{item.type} Role • {item.date}</p>
                    </div>
                    <ChevronRight size={18} className="text-[#43474E] group-hover:text-white transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* 5. NAVIGATION */}
        <BottomNav />

      </div>
    </div>
  );
}