"use client";

import React from 'react';
import { Sparkles, Star, ChevronRight, Verified, Info, ShieldCheck, Zap } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="min-h-screen w-full bg-[#05080a] text-slate-200 flex items-center justify-center p-0 md:p-8 lg:p-12 overflow-x-hidden relative">
      
      {/* Background Ambient Orbs - More dynamic for desktop */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] size-[600px] bg-blue-600/10 blur-[140px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] size-[500px] bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[800px] bg-blue-500/[0.02] blur-[160px] rounded-full" />
      </div>

      {/* Main Glass Container */}
      <div className="w-full max-w-[1100px] min-h-[600px] bg-[#0a1016]/60 md:border md:border-white/5 backdrop-blur-3xl md:rounded-[3rem] shadow-2xl flex flex-col lg:flex-row relative z-10 overflow-hidden animate-in fade-in zoom-in duration-1000">
        
        {/* LEFT SIDE: Visual/Hero (Hidden on small mobile, shown as a card or sidebar) */}
        <div className="relative w-full lg:w-1/2 h-[350px] lg:h-auto overflow-hidden bg-slate-900/50 border-b lg:border-b-0 lg:border-r border-white/5">
          {/* Hero Image / Dynamic Visual */}
          <div className="absolute inset-0 group">
            <img 
              src="https://images.unsplash.com/photo-1635332392051-873531b40283?q=80&w=2072&auto=format&fit=crop" 
              alt="Interview Dashboard" 
              className="w-full h-full object-cover opacity-40 mix-blend-luminosity group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#05080a] via-[#0a1016]/40 to-transparent" />
          </div>

          {/* Floating Feature Tags (Desktop only decoration) */}
          <div className="absolute top-8 left-8 space-y-3 hidden md:block">
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 backdrop-blur-md px-4 py-2 rounded-2xl animate-in slide-in-from-left-4 duration-700">
              <div className="size-2 bg-emerald-500 rounded-full animate-ping" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Live AI Analysis</span>
            </div>
          </div>

          {/* Bottom Info Overlay */}
          <div className="absolute bottom-8 left-8 right-8">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 backdrop-blur-xl px-4 py-2 rounded-2xl text-[11px] font-black uppercase tracking-widest text-blue-400 mb-4">
              <Verified size={14} />
              Success Rate: 94%
            </div>
            <h3 className="text-2xl font-black text-white leading-tight lg:max-w-xs">
              Built for the next generation of <span className="text-blue-500">Tech Leaders.</span>
            </h3>
          </div>
        </div>

        {/* RIGHT SIDE: Content & Interaction */}
        <div className="w-full lg:w-1/2 flex flex-col p-8 md:p-12 lg:p-16 relative">
          
          {/* Top Bar for Mobile/Tablet within the right side */}
          <header className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/40">
                <Zap size={16} className="text-white fill-white" />
              </div>
              <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white">InterPrep</h2>
            </div>
            <button className="text-slate-500 hover:text-blue-400 transition-colors">
              <Info size={20} />
            </button>
          </header>

          <div className="flex-1 flex flex-col justify-center">
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
              <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] tracking-tighter">
                Master Your Next <br />
                <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Interview</span>
              </h1>
              <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-md">
                The all-in-one platform to practice coding, behaviorals, and track your progress to your dream job with AI-powered feedback.
              </p>
            </div>

            {/* Social Proof */}
            <div className="mt-10 animate-in fade-in duration-700 delay-400">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="size-10 rounded-full border-2 border-[#0a1016] bg-slate-800 flex items-center justify-center overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" />
                    </div>
                  ))}
                  <div className="size-10 rounded-full border-2 border-[#0a1016] bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
                    10k+
                  </div>
                </div>
                <div>
                  <div className="flex gap-0.5 text-yellow-500">
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Trusted by Professionals</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-12 flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-600">
              <button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-black py-4 px-8 rounded-2xl shadow-xl shadow-blue-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group">
                <span>Get Started Now</span>
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="flex-1 bg-white/5 border border-white/5 text-slate-300 font-black py-4 px-8 rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                <ShieldCheck size={18} />
                <span>Learn More</span>
              </button>
            </div>
          </div>

          {/* Footer Link */}
          <footer className="mt-12 pt-8 border-t border-white/5 animate-in fade-in duration-1000 delay-800">
            <p className="text-slate-500 text-sm font-medium">
              Already have an account?{" "}
              <button className="text-blue-500 font-black hover:text-blue-400 ml-1 transition-colors">
                Log In
              </button>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}