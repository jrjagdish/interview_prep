"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("candidate"); // 'candidate' or 'company'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.fullName || !formData.password) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const role = activeTab === "candidate" ? "user" : "admin";

      const response = await fetch("http://127.0.0.1:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Registration failed");
      }

      // Success Redirects
      if (role === "admin") {
        navigate("/InterviewerDashboard");
      } else {
        navigate("/login");
      }
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
        <div className="absolute top-[-10%] left-[-10%] size-[500px] bg-purple-600/10 dark:bg-purple-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] size-[400px] bg-fuchsia-600/10 dark:bg-fuchsia-600/5 blur-[100px] rounded-full" />
      </div>

      <div className="w-full max-w-[480px] bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 backdrop-blur-2xl rounded-3xl shadow-2xl flex flex-col relative z-10 animate-in fade-in zoom-in duration-700">
        
        {/* Header Section */}
        <div className="flex items-center p-6 justify-between">
          <button
            onClick={() => navigate(-1)}
            className="group flex size-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all active:scale-90"
          >
            <ChevronLeft size={20} className="text-slate-600 dark:text-slate-300 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full">
            <ShieldCheck size={14} className="text-purple-600 dark:text-purple-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">
              Secure Registration
            </span>
          </div>
          <div className="size-10" />
        </div>

        <div className="pt-2 pb-6 px-8 space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-[0.2em] mb-1">
            <Sparkles size={14} />
            <span>Start your journey</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">
            Create Account
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Join 10k+ engineers mastering technical interviews.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="px-8 pb-8">
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 relative">
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-purple-600 rounded-xl transition-all duration-300 ease-out shadow-lg shadow-purple-500/30 ${
                activeTab === "company" ? "translate-x-[calc(100%+0px)]" : "translate-x-0"
              }`}
            />
            <button
              onClick={() => setActiveTab("candidate")}
              className={`flex-1 relative z-10 py-3 text-[11px] font-bold uppercase tracking-widest transition-colors ${
                activeTab === "candidate" ? "text-white" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              Candidate
            </button>
            <button
              onClick={() => setActiveTab("company")}
              className={`flex-1 relative z-10 py-3 text-[11px] font-bold uppercase tracking-widest transition-colors ${
                activeTab === "company" ? "text-white" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              Company
            </button>
          </div>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleRegister} className="flex flex-col gap-5 px-8 pb-8">
          <InputField
            label="Full Name"
            placeholder="John Doe"
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
          />
          <InputField
            label="Email Address"
            placeholder="name@example.com"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />

          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">
              Password
            </label>
            <div className="relative group">
              <input
                required
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="h-13 w-full rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-5 text-sm transition-all focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 outline-none dark:text-white"
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
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs py-2 px-3 rounded-lg text-center font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full h-14 mt-2 ${
              loading ? "opacity-70 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700 shadow-purple-500/20"
            } text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group active:scale-[0.98]`}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Create My Account"
            )}
            {!loading && (
              <div className="size-1.5 bg-white rounded-full animate-pulse group-hover:scale-125" />
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="px-8 pb-10 text-center">
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Already part of the team?{" "}
              <Link
                to="/login"
                className="text-purple-600 dark:text-purple-400 font-bold hover:underline ml-1 transition-all"
              >
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, placeholder, type, name, value, onChange }) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">
        {label}
      </label>
      <input
        required
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        className="h-13 w-full rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-5 text-sm transition-all focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 outline-none dark:text-white"
      />
    </div>
  );
}