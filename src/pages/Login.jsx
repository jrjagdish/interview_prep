"use client";

import React, { useState } from "react";
import { ChevronLeft, Eye, EyeOff, LogIn } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useThemeContext } from "../context/ThemeContext";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { theme } = useThemeContext();
  const navigate = useNavigate();

  /* --- BACKEND INTEGRATION --- */
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Login failed");

      navigate("/home");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[url('/assets/light-hero-gradient.svg')] dark:bg-[url('/assets/dark-hero-gradient.svg')] bg-no-repeat bg-cover">
      
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] size-[500px] bg-purple-600/10 dark:bg-purple-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] size-[400px] bg-fuchsia-600/10 dark:bg-fuchsia-600/5 blur-[100px] rounded-full" />
      </div>

      <div className="w-full max-w-[460px] bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 backdrop-blur-2xl rounded-3xl shadow-2xl flex flex-col relative z-10 animate-in fade-in zoom-in duration-500">
        
        {/* Header Navigation */}
        <div className="flex items-center p-6 justify-between">
          <Link to="/">
            <button className="group flex size-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all active:scale-90">
              <ChevronLeft size={20} className="text-slate-600 dark:text-slate-300 group-hover:-translate-x-0.5 transition-transform" />
            </button>
          </Link>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            Secure Member Access
          </h2>
          <div className="size-10" />
        </div>

        {/* Brand/Welcome Header */}
        <div className="px-8 pt-4 pb-8 text-center space-y-2">
          <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-purple-600/10 border border-purple-500/20 mb-4">
            <LogIn className="text-purple-600 dark:text-purple-400" size={28} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Welcome Back
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
            Continue mastering your skills with{" "}
            <span className="bg-gradient-to-r from-[#923FEF] to-[#C35DE8] bg-clip-text text-transparent font-bold">
              PREP ENGINE
            </span>
          </p>
        </div>

        <form onSubmit={handleLogin} className="px-8 space-y-5">
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">
              Email Address
            </label>
            <input
              required
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              type="email"
              placeholder="name@example.com"
              className="h-13 w-full rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-5 text-sm transition-all focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 outline-none dark:text-white dark:placeholder:text-slate-600"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                Password
              </label>
              <button type="button" className="text-[10px] font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 hover:opacity-80 transition-opacity">
                Forgot?
              </button>
            </div>
            <div className="relative">
              <input
                required
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="h-13 w-full rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-5 text-sm transition-all focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 outline-none dark:text-white dark:placeholder:text-slate-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-500 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[12px] py-2 px-3 rounded-lg text-center font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold py-4 rounded-xl shadow-lg shadow-purple-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
          >
            {loading ? "Verifying..." : "Sign In to Dashboard"}
          </button>
        </form>

        <div className="flex items-center px-8 py-8">
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
          <span className="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Social Access
          </span>
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
        </div>

        <div className="px-8">
          <button
            type="button"
            className="flex items-center justify-center gap-3 w-full h-13 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all group dark:text-white"
          >
            <svg className="size-5" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.9z" />
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4c-7.7 0-14.4 4.3-17.7 10.7z" />
              <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.3l-6.3-5.2C29.2 35.3 26.7 36 24 36c-5.3 0-9.8-3.4-11.4-8.1l-6.5 5C9.4 39.7 16.2 44 24 44z" />
              <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-1.1 3-3.4 5.4-6.3 6.9l6.3 5.2C39.6 36.4 44 30.9 44 24c0-1.3-.1-2.7-.4-3.9z" />
            </svg>
            Continue with Google
          </button>
        </div>

        <div className="mt-8 px-8 pb-10 text-center">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Don't have an account?
            <Link to="/register">
              <button className="text-purple-600 dark:text-purple-400 font-bold hover:underline ml-2 transition-all">
                Sign Up Free
              </button>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}