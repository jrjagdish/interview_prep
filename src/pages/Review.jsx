"use client";

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Sparkles,
  Trophy,
  MessageSquare,
  ArrowLeft,
  RotateCcw,
  Star,
  Zap,
  CheckCircle2,
  BarChart3,
} from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";

export default function InterviewReview() {
  const { session_id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const response = await fetch(`http://localhost:8000/score/${session_id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          // credentials: "include", // Uncomment if using get_current_user dependency
        });

        if (!response.ok) throw new Error("Failed to fetch evaluation results.");
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (session_id) fetchScore();
  }, [session_id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#05080a]">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-purple-600 font-bold animate-pulse">Analyzing your performance...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#05080a] text-slate-900 dark:text-slate-200 p-4 md:p-8 lg:p-10 font-sans transition-colors duration-300">
      {/* Background Ambient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] size-[500px] bg-purple-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] size-[400px] bg-blue-600/5 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10 space-y-8">
        {/* HEADER */}
        <header className="flex items-center justify-between">
          <button 
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-slate-500 hover:text-purple-600 transition-colors font-bold text-sm group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>
          <ThemeToggle />
        </header>

        {error ? (
          <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-red-500 text-center">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT: SCORE CARD */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 text-center shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-fuchsia-400" />
                
                <div className="size-24 bg-purple-600/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Trophy size={48} className="text-purple-600" />
                </div>
                
                <h2 className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs mb-2">
                  Overall Score
                </h2>
                <div className="text-7xl font-black text-slate-900 dark:text-white mb-4">
                  {data?.score}<span className="text-2xl text-slate-400">/100</span>
                </div>

                <div className="flex items-center justify-center gap-1 mb-8">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star 
                      key={s} 
                      size={20} 
                      fill={s <= Math.round(data?.score / 20) ? "#9333ea" : "none"} 
                      className={s <= Math.round(data?.score / 20) ? "text-purple-600" : "text-slate-300 dark:text-slate-700"}
                    />
                  ))}
                </div>

                <button 
                  onClick={() => navigate("/interview-prep")}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
                >
                  <RotateCcw size={18} /> Try Again
                </button>
              </div>

              {/* QUICK STATS */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] p-6 space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-emerald-500" />
                    <span className="text-sm font-medium">Status</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-500 uppercase">Completed</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center gap-3">
                    <Zap size={18} className="text-amber-500" />
                    <span className="text-sm font-medium">Session ID</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{session_id.slice(0, 8)}...</span>
                </div>
              </div>
            </div>

            {/* RIGHT: FEEDBACK DETAILS */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 md:p-10 shadow-sm relative">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-blue-500/10 rounded-xl">
                    <MessageSquare size={24} className="text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">AI Detailed Feedback</h3>
                    <p className="text-slate-500 text-sm">Actionable insights to improve your next session</p>
                  </div>
                </div>

                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <div className="bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                    {data?.feedback || "No feedback generated for this session."}
                  </div>
                </div>

                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl border border-purple-500/10 bg-purple-500/5">
                        <h4 className="font-bold flex items-center gap-2 mb-2 text-purple-600">
                            <Sparkles size={16} /> Key Strength
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Your technical explanations were concise and demonstrated a solid understanding of the core concepts.
                        </p>
                    </div>
                    <div className="p-5 rounded-2xl border border-blue-500/10 bg-blue-500/5">
                        <h4 className="font-bold flex items-center gap-2 mb-2 text-blue-600">
                            <BarChart3 size={16} /> Growth Area
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Focus on providing more concrete examples from your past projects to back up theoretical claims.
                        </p>
                    </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}