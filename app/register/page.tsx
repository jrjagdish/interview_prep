"use client";

import React, { useState } from 'react';
import { ChevronLeft, Eye, EyeOff, ShieldCheck, Sparkles } from 'lucide-react';

export default function RegisterPage() {
  const [activeTab, setActiveTab] = useState('candidate');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#05080a] text-slate-200 flex items-center justify-center p-0 sm:p-4 overflow-x-hidden relative">
      
      {/* Background Ambient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] size-[400px] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute top-[60%] -right-[5%] size-[300px] bg-indigo-600/10 blur-[100px] rounded-full" />
      </div>

      <div className="w-full max-w-[480px] bg-[#0a1016]/80 sm:border sm:border-white/5 backdrop-blur-2xl sm:rounded-[2.5rem] shadow-2xl flex flex-col relative z-10 animate-in fade-in zoom-in duration-700">
        
        {/* Top Bar */}
        <div className="flex items-center p-6 justify-between">
          <button className="group flex size-10 items-center justify-center rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all active:scale-90">
            <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
            <ShieldCheck size={14} className="text-blue-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Secure Portal</span>
          </div>
          <div className="size-10" /> {/* Spacer */}
        </div>

        {/* Header Section */}
        <div className="pt-4 pb-6 px-8 space-y-2">
          <div className="inline-flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-[0.2em] mb-1">
            <Sparkles size={14} />
            <span>Get Started</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight tracking-tight">
            Create Account
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Join 10k+ professionals practicing with AI-driven interview tools.
          </p>
        </div>

        {/* Animated Tabs */}
        <div className="px-8 pb-8">
          <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5 relative">
            {/* Sliding Background */}
            <div 
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-blue-600 rounded-xl transition-all duration-300 ease-out shadow-lg shadow-blue-600/20 ${activeTab === 'company' ? 'translate-x-[calc(100%+0px)]' : 'translate-x-0'}`}
            />
            
            <button 
              onClick={() => setActiveTab('candidate')}
              className={`flex-1 relative z-10 py-3 text-xs font-black uppercase tracking-widest transition-colors duration-300 ${activeTab === 'candidate' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Candidate
            </button>
            <button 
              onClick={() => setActiveTab('company')}
              className={`flex-1 relative z-10 py-3 text-xs font-black uppercase tracking-widest transition-colors duration-300 ${activeTab === 'company' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Company
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="flex flex-col gap-5 px-8 pb-8 overflow-y-auto max-h-[60vh] sm:max-h-none scrollbar-hide">
          <InputField label="Full Name" placeholder="John Doe" type="text" />
          <InputField label="Email Address" placeholder="name@company.com" type="email" />
          
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Password</label>
            </div>
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="h-14 w-full rounded-2xl bg-white/[0.03] border border-white/5 px-5 text-sm transition-all focus:border-blue-500/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-blue-500/10 outline-none placeholder:text-slate-700"
              />
              <button 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-blue-400 transition-colors"
              >
                {showPassword ? <EyeOff size={18}/> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-[10px] text-slate-600 font-medium ml-1">
              Minimum 8 characters with at least one digit.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-8 pb-10 space-y-6">
          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group">
            <span>Create My Account</span>
            <div className="size-1.5 bg-white rounded-full animate-pulse group-hover:scale-125 transition-transform" />
          </button>

          <div className="space-y-4">
            <p className="text-[11px] text-center text-slate-600 px-4 leading-relaxed">
              By registering, you agree to our <span className="text-slate-400 hover:text-blue-400 cursor-pointer transition-colors underline decoration-white/10">Terms</span> and <span className="text-slate-400 hover:text-blue-400 cursor-pointer transition-colors underline decoration-white/10">Privacy Policy</span>.
            </p>
            
            <div className="pt-4 border-t border-white/5">
              <p className="text-center text-sm font-medium text-slate-500">
                Already part of the team? <a href="#" className="text-blue-500 font-black hover:text-blue-400 ml-1">Log In</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- REUSABLE INPUT COMPONENT --- */
function InputField({ label, placeholder, type }: { label: string, placeholder: string, type: string }) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="h-14 w-full rounded-2xl bg-white/[0.03] border border-white/5 px-5 text-sm transition-all focus:border-blue-500/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-blue-500/10 outline-none placeholder:text-slate-700"
      />
    </div>
  );
}