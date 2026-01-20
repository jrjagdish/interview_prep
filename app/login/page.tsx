"use client";

import React, { useState } from 'react';
import { ChevronLeft, Eye, EyeOff, Sparkles, LogIn } from 'lucide-react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#05080a] text-slate-200 flex items-center justify-center p-0 sm:p-6 overflow-x-hidden relative">
      
      {/* Background Glow Effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] size-[500px] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] size-[400px] bg-indigo-600/10 blur-[100px] rounded-full" />
      </div>

      {/* Main Container */}
      <div className="w-full max-w-[460px] bg-[#0a1016]/80 sm:border sm:border-white/5 backdrop-blur-2xl sm:rounded-[2.5rem] shadow-2xl flex flex-col relative z-10 animate-in fade-in zoom-in duration-500">
        
        {/* Top Bar */}
        <div className="flex items-center p-6 justify-between">
          <button className="group flex size-10 items-center justify-center rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all active:scale-90">
            <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">Secure Login</h2>
          <div className="size-10" /> {/* Spacer for centering */}
        </div>

        {/* Header */}
        <div className="px-8 pt-4 pb-8 text-center space-y-2">
          <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-blue-600/10 border border-blue-500/20 mb-4 animate-bounce">
            <LogIn className="text-blue-500" size={28} />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Welcome Back</h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Continue your professional journey with <span className="text-blue-500 font-bold">CORE.AI</span>
          </p>
        </div>

        {/* Form */}
        <div className="px-8 space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              className="h-14 w-full rounded-2xl bg-white/[0.03] border border-white/5 px-5 text-sm transition-all focus:border-blue-500/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-blue-500/10 outline-none placeholder:text-slate-700"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Password</label>
              <button className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-400 transition-colors">
                Forgot?
              </button>
            </div>
            <div className="relative">
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
          </div>

          {/* Submit */}
          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2">
            Login to Dashboard
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center px-8 py-8">
          <div className="flex-grow border-t border-white/5" />
          <span className="px-4 text-[10px] font-black uppercase tracking-widest text-slate-600">
            Social Access
          </span>
          <div className="flex-grow border-t border-white/5" />
        </div>

        {/* Social Login */}
        <div className="px-8">
          <button className="flex items-center justify-center gap-3 w-full h-14 rounded-2xl bg-white/[0.03] border border-white/5 font-bold text-sm hover:bg-white/[0.06] transition-all group">
            <svg className="size-5 transition-transform group-hover:scale-110" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.9z" />
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4c-7.7 0-14.4 4.3-17.7 10.7z" />
              <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.3l-6.3-5.2C29.2 35.3 26.7 36 24 36c-5.3 0-9.8-3.4-11.4-8.1l-6.5 5C9.4 39.7 16.2 44 24 44z" />
              <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-1.1 3-3.4 5.4-6.3 6.9l6.3 5.2C39.6 36.4 44 30.9 44 24c0-1.3-.1-2.7-.4-3.9z" />
            </svg>
            Continue with Google
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 px-8 pb-10 text-center">
          <p className="text-sm font-medium text-slate-500">
            Don&apos;t have an account? 
            <button className="text-blue-500 font-black hover:text-blue-400 ml-2 transition-colors">
              Sign Up Free
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}