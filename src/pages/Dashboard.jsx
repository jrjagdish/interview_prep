"use client";

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ChevronRight, 
  Zap, 
  Play, 
  BarChart3, 
  BookOpen, 
  History, 
  LayoutDashboard,
  Code,
  Server,
  Palette,
  Database,
  Mic,
  Terminal,
  Check,
  Lock,
  ArrowRight,
  Settings // Added for the Admin Panel
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle'; 
import { useThemeContext } from "../context/ThemeContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { theme } = useThemeContext();
  const [name, setName] = useState('');

  useEffect(() => {
    const savedName = localStorage.getItem("userName");
    if (savedName) setName(savedName);
  }, []);

  const recommendations = [
    { role: 'React Engineer', sessions: '12 Sessions', icon: <Code size={20} className="text-blue-500" /> },
    { role: 'System Architect', sessions: '8 Sessions', icon: <Server size={20} className="text-purple-500" /> },
    { role: 'UI/UX Designer', sessions: '15 Sessions', icon: <Palette size={20} className="text-fuchsia-500" /> },
    { role: 'Backend Specialist', sessions: '10 Sessions', icon: <Database size={20} className="text-emerald-500" /> },
  ];

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#05080a] text-slate-900 dark:text-slate-200 p-4 md:p-8 lg:p-10 font-sans transition-colors duration-300">
      
      {/* Background Ambient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] size-[500px] bg-purple-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] size-[400px] bg-fuchsia-600/5 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        
        {/* TOP NAV / WELCOME */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Link to="/profile" className="relative group">
              <div className="size-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-fuchsia-400 p-[2px] shadow-lg group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-[calc(0.875rem)] bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Alex`} alt="Profile" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 size-5 bg-emerald-500 border-2 border-white dark:border-slate-950 rounded-full" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Welcome back, <span className="text-purple-600">{name}</span> 👋
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Senior Level Path</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* ADMIN PANEL BUTTON - Added here to match HTML reference */}
            <button className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl border border-purple-500/30 text-purple-600 font-bold hover:bg-purple-600/10 transition-colors text-sm">
              <Settings size={16} />
              Admin Panel
            </button>

            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 hidden md:block mx-1"></div>

            <ThemeToggle />
            
            <Link to='/pricing'> 
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-purple-500/20 transition-all flex items-center gap-2">
                <Zap size={18} fill="currentColor" />
                <span className="hidden md:inline">Upgrade</span>
              </button>
            </Link>
          </div>
        </header>

        {/* MAIN DASHBOARD GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* HERO ACTION CARD */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[1rem] p-8 md:p-10 text-white shadow-2xl">
              <div className="relative z-10 space-y-4 max-w-md">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                  <Sparkles size={12} /> Recommended for today
                </div>
                <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tighter">Start AI Voice <br /> Interview</h2>
                <p className="text-purple-100 opacity-90 leading-relaxed text-lg font-medium">Master your technical communication with our GPT-powered voice agent.</p>
                <button onClick={() => navigate('/interview-prep')} className="bg-white text-purple-600 font-bold py-4 px-10 rounded-2xl shadow-xl hover:shadow-2xl hover:bg-slate-50 active:scale-95 transition-all flex items-center gap-3">
                  <Play size={20} fill="currentColor" /> Launch Session
                </button>
              </div>
              <Mic size={280} className="absolute -right-16 -bottom-16 text-white/10 rotate-12 pointer-events-none opacity-20" />
            </div>

            {/* QUICK CATEGORIES */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: 'Trees & Graphs', icon: <BookOpen />, count: '24 Tasks', color: 'bg-amber-500' },
                { title: 'Dynamic Prog.', icon: <Zap />, count: '12 Scenarios', color: 'bg-emerald-500' },
                { title: 'System Design', icon: <LayoutDashboard />, count: '40 Questions', color: 'bg-blue-500' },
              ].map((cat, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-[1rem] hover:border-purple-500/50 transition-all cursor-pointer group shadow-sm">
                  <div className={`${cat.color}/10 ${cat.color.replace('bg-', 'text-')} size-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    {React.cloneElement(cat.icon, { size: 24 })}
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">{cat.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium">{cat.count}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: PERFORMANCE & GOALS */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1rem] p-8 shadow-sm">
              <h3 className="font-bold flex items-center gap-2 mb-8">
                <BarChart3 size={20} className="text-purple-500" /> Performance
              </h3>
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-3 uppercase tracking-widest text-slate-400">
                    <span>Weekly Goal</span> <span className="text-slate-900 dark:text-white">12/20 Solved</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-600 rounded-full w-[60%] shadow-[0_0_12px_rgba(147,51,234,0.4)]" />
                  </div>
                </div>
              </div>
            </div>

            {/* LATEST INSIGHTS */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1rem] p-8 shadow-sm">
              <h3 className="font-bold mb-6 flex items-center gap-2">
                <Sparkles size={18} className="text-purple-500" /> Latest Insights
              </h3>
              <div className="space-y-5">
                <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-transparent hover:border-purple-500/20 transition-all cursor-pointer group">
                  <div className="size-10 shrink-0 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xs">AI</div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold group-hover:text-purple-600 transition-colors">Communication Feedback</p>
                    <p className="text-[11px] text-slate-500">Clarity & Confidence score improved.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LEARNING MAPS */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1rem] p-8 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Learning Maps</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Your personalized path to Senior Software Engineer</p>
            </div>
            <button className="text-purple-600 font-bold flex items-center gap-1 hover:underline text-sm">
              View Full Roadmap <ArrowRight size={16} />
            </button>
          </div>
          <div className="relative flex items-center justify-between px-4">
             <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800 -translate-y-8" />
             <div className="absolute top-1/2 left-0 w-[66%] h-1 bg-purple-600 -translate-y-8" />
             
             <div className="relative z-10 flex flex-col items-center gap-3">
                <div className="size-12 bg-purple-600 text-white rounded-full flex items-center justify-center shadow-lg"><Check size={20}/></div>
                <div className="text-center"><p className="font-bold text-sm">Junior Dev</p><p className="text-[10px] text-slate-400">Completed</p></div>
             </div>
             <div className="relative z-10 flex flex-col items-center gap-3">
                <div className="size-14 bg-purple-600 text-white rounded-full flex items-center justify-center shadow-xl ring-4 ring-purple-500/20"><Sparkles size={24}/></div>
                <div className="text-center"><p className="font-bold text-sm text-purple-600">Mid-Level</p><p className="text-[10px] text-purple-500 font-medium">Current Focus</p></div>
             </div>
             <div className="relative z-10 flex flex-col items-center gap-3">
                <div className="size-12 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full flex items-center justify-center"><Lock size={20}/></div>
                <div className="text-center"><p className="font-bold text-sm text-slate-500">Senior</p><p className="text-[10px] text-slate-400">Locked</p></div>
             </div>
          </div>
        </section>

        {/* BOTTOM: HISTORY & NEWS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1rem] p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2"><History size={20} className="text-purple-600" /> Interview History</h3>
              <button className="text-xs font-bold text-purple-600 hover:underline">View All</button>
            </div>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
               {[
                 { title: 'Voice Mock Interview', date: 'Oct 24 • 2:30 PM', score: '88/100', icon: <Mic size={18}/> },
                 { title: 'DSA Challenge', date: 'Oct 22 • 10:15 AM', score: '4/5 Stars', icon: <Code size={18}/> },
                 { title: 'System Design', date: 'Oct 20 • 4:45 PM', score: '92/100', icon: <Terminal size={18}/> }
               ].map((item, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-transparent hover:border-purple-500/20 transition-all flex justify-between items-center">
                  <div className="flex gap-4">
                    <div className="size-10 rounded-xl bg-purple-600/10 flex items-center justify-center text-purple-600">{item.icon}</div>
                    <div>
                      <h4 className="font-bold text-sm">{item.title}</h4>
                      <p className="text-[10px] text-slate-500">{item.date}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 rounded bg-emerald-500/10 text-emerald-500">{item.score}</span>
                </div>
               ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1rem] p-8 shadow-sm">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-6"><BookOpen size={20} className="text-purple-600" /> Daily Code News</h3>
            <div className="space-y-6">
              <div className="flex gap-4 group cursor-pointer">
                <div className="size-20 shrink-0 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden">
                   <img src="https://api.dicebear.com/7.x/shapes/svg?seed=rust" alt="news" className="size-full object-cover group-hover:scale-110 transition-transform"/>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1"><span className="text-[9px] font-bold text-purple-600 uppercase">Trends</span></div>
                  <h4 className="font-bold text-sm leading-tight group-hover:text-purple-600 transition-colors">Rust vs. Go: 2026 Performance Benchmarks</h4>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">New memory safety protocols changing microservice architecture...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}