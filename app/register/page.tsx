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
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("candidate");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    // Basic Validation
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

      // Success! Browser automatically handles the HTTP-Only cookie.
      // Redirect based on role
      if (role === "admin") {
        router.push("/InterviewerDashboard");
      } else {
        router.push("/login");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#05080a] text-slate-200 flex items-center justify-center p-0 sm:p-4 overflow-x-hidden relative">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] size-[400px] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute top-[60%] -right-[5%] size-[300px] bg-indigo-600/10 blur-[100px] rounded-full" />
      </div>

      <div className="w-full max-w-[480px] bg-[#0a1016]/80 sm:border sm:border-white/5 backdrop-blur-2xl sm:rounded-[2.5rem] shadow-2xl flex flex-col relative z-10 animate-in fade-in zoom-in duration-700">
        {/* Header Section */}
        <div className="flex items-center p-6 justify-between">
          <button
            onClick={() => router.back()}
            className="group flex size-10 items-center justify-center rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all active:scale-90"
          >
            <ChevronLeft
              size={20}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
          </button>
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
            <ShieldCheck size={14} className="text-blue-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">
              Secure Portal
            </span>
          </div>
          <div className="size-10" />
        </div>

        <div className="pt-4 pb-6 px-8 space-y-2">
          <div className="inline-flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-[0.2em] mb-1">
            <Sparkles size={14} />
            <span>Get Started</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
            Create Account
          </h1>
          <p className="text-slate-500 text-sm">
            Join professionals practicing with AI-driven tools.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="px-8 pb-8">
          <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5 relative">
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-blue-600 rounded-xl transition-all duration-300 ease-out shadow-lg ${activeTab === "company" ? "translate-x-[calc(100%+0px)]" : "translate-x-0"}`}
            />
            <button
              onClick={() => setActiveTab("candidate")}
              className={`flex-1 relative z-10 py-3 text-xs font-black uppercase tracking-widest transition-colors ${activeTab === "candidate" ? "text-white" : "text-slate-500 hover:text-slate-300"}`}
            >
              Candidate
            </button>
            <button
              onClick={() => setActiveTab("company")}
              className={`flex-1 relative z-10 py-3 text-xs font-black uppercase tracking-widest transition-colors ${activeTab === "company" ? "text-white" : "text-slate-500 hover:text-slate-300"}`}
            >
              Company
            </button>
          </div>
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-5 px-8 pb-8">
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
            placeholder="name@company.com"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />

          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">
              Password
            </label>
            <div className="relative group">
              <input
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="h-14 w-full rounded-2xl bg-white/[0.03] border border-white/5 px-5 text-sm transition-all focus:border-blue-500/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-blue-500/10 outline-none"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-blue-400 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error && (
              <p className="text-[10px] text-red-400 font-medium ml-1">
                {error}
              </p>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="px-8 pb-10 space-y-6">
          <button
            onClick={handleRegister}
            disabled={loading}
            className={`w-full h-14 ${loading ? "opacity-70 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500"} text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-2 group`}
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

          <div className="pt-4 border-t border-white/5">
            <p className="text-center text-sm font-medium text-slate-500">
              Already part of the team?{" "}
              <a
                href="/login"
                className="text-blue-500 font-black hover:text-blue-400 ml-1"
              >
                Log In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, placeholder, type, name, value, onChange }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">
        {label}
      </label>
      <input
        required
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        className="h-14 w-full rounded-2xl bg-white/[0.03] border border-white/5 px-5 text-sm transition-all focus:border-blue-500/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-blue-500/10 outline-none"
      />
    </div>
  );
}
