"use client";

import React, { useState } from "react";
import { ChevronLeft, Eye, EyeOff, Router, ShieldCheck, Sparkles } from "lucide-react";
import router from "next/router";
import Link from "next/link";

export default function RegisterPage() {
  const [activeTab, setActiveTab] = useState("candidate");
  const [showPassword, setShowPassword] = useState(false);

  /* --- BACKEND INTEGRATION START --- */
  // 1. Define states to capture input data
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 2. Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Submit function
  const handleRegister = async () => {
    setLoading(true);
    setError("");

    // Determine role: "user" if candidate, "admin" if company
    // const role = activeTab === "candidate" ? "user" : "admin";

    // try {
    //   const response = await fetch("http://127.0.0.1:8000/auth/register", {
    //     // Update with your actual API URL
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       email: formData.email,
    //       password: formData.password,
    //       full_name: formData.fullName, // Ensure this matches your FastAPI UserCreate schema keys
    //       role: role, // Role logic injected here
    //     }),
    //   });

    //   const data = await response.json();

    //   if (!response.ok) {
    //     throw new Error(data.detail || "Registration failed");
    //   }

      // alert("Registration successful!");
      
      // Redirect to login or dashboard here
    // } catch (err: any) {
    //   setError(err.message);
    // } finally {
    //   setLoading(false);
    // }
  };
  /* --- BACKEND INTEGRATION END --- */

  return (
    <div className="min-h-screen w-full bg-[#05080a] text-slate-200 flex items-center justify-center p-0 sm:p-4 overflow-x-hidden relative">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] size-[400px] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute top-[60%] -right-[5%] size-[300px] bg-indigo-600/10 blur-[100px] rounded-full" />
      </div>

      <div className="w-full max-w-[480px] bg-[#0a1016]/80 sm:border sm:border-white/5 backdrop-blur-2xl sm:rounded-[2.5rem] shadow-2xl flex flex-col relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="flex items-center p-6 justify-between">
          <button className="group flex size-10 items-center justify-center rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all active:scale-90">
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
          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight tracking-tight">
            Create Account
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Join 10k+ professionals practicing with AI-driven interview tools.
          </p>
        </div>

        <div className="px-8 pb-8">
          <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5 relative">
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-blue-600 rounded-xl transition-all duration-300 ease-out shadow-lg shadow-blue-600/20 ${activeTab === "company" ? "translate-x-[calc(100%+0px)]" : "translate-x-0"}`}
            />

            <button
              onClick={() => setActiveTab("candidate")}
              className={`flex-1 relative z-10 py-3 text-xs font-black uppercase tracking-widest transition-colors duration-300 ${activeTab === "candidate" ? "text-white" : "text-slate-500 hover:text-slate-300"}`}
            >
              Candidate
            </button>
            <button
              onClick={() => setActiveTab("company")}
              className={`flex-1 relative z-10 py-3 text-xs font-black uppercase tracking-widest transition-colors duration-300 ${activeTab === "company" ? "text-white" : "text-slate-500 hover:text-slate-300"}`}
            >
              Company
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-5 px-8 pb-8">
          {/* Linked inputs to state using name and onChange */}
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
                className="h-14 w-full rounded-2xl bg-white/[0.03] border border-white/5 px-5 text-sm transition-all focus:border-blue-500/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-blue-500/10 outline-none placeholder:text-slate-700"
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

        <div className="px-8 pb-10 space-y-6">
          <Link href="/login">
          <button
            onClick={() => {
              handleRegister();
            }}
            disabled={loading}
            className={`w-full ${loading ? "opacity-50" : "bg-blue-600 hover:bg-blue-500"} text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group`}
          >
            <span>{loading ? "Processing..." : "Create My Account"}</span>
            <div className="size-1.5 bg-white rounded-full animate-pulse group-hover:scale-125 transition-transform" />
          </button></Link>

          <div className="space-y-4">
            <p className="text-[11px] text-center text-slate-600 px-4 leading-relaxed">
              By registering, you agree to our{" "}
              <span className="text-slate-400 hover:text-blue-400 cursor-pointer transition-colors underline decoration-white/10">
                Terms
              </span>{" "}
              and{" "}
              <span className="text-slate-400 hover:text-blue-400 cursor-pointer transition-colors underline decoration-white/10">
                Privacy Policy
              </span>
              .
            </p>

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
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        className="h-14 w-full rounded-2xl bg-white/[0.03] border border-white/5 px-5 text-sm transition-all focus:border-blue-500/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-blue-500/10 outline-none placeholder:text-slate-700"
      />
    </div>
  );
}
