"use client";

import React from 'react';
import { 
  Sparkles, 
  ChevronRight, 
  Zap, 
  Play, 
  BarChart3, 
  BookOpen, 
  History, 
  Search,
  LayoutDashboard,
  User,
  Code,
  Server,
  Palette,
  Database
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle'; // Adjust path if needed
import { useThemeContext } from "../context/ThemeContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { theme } = useThemeContext();

  // Mock data for recommendation cards with icons
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
            {/* Profile Avatar Link */}
            <Link to="/profile" className="relative group">
              <div className="size-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-fuchsia-400 p-[2px] shadow-lg group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-[calc(0.875rem)] bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden">
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Alex`} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 size-5 bg-emerald-500 border-2 border-white dark:border-slate-950 rounded-full" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Welcome back, <span className="text-purple-600">Alex</span> 👋
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
                Pro Member
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            

            {/* THEME TOGGLE ADDED HERE */}
            <div>
               <ThemeToggle />
            </div>

           <Link to='/pricing'> <button className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-purple-500/20 transition-all flex items-center gap-2">
              <Zap size={18} fill="currentColor" />
              <span className="hidden md:inline">Upgrade</span>
            </button></Link>
          </div>
        </header>

        {/* MAIN DASHBOARD GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: MAIN ACTION CARDS */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* HERO ACTION CARD */}
            <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 to-indigo-700 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl">
              <div className="relative z-10 space-y-6 max-w-md">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                  <Sparkles size={12} />
                  New: System Design AI
                </div>
                <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tighter">
                  Start an Instant <br /> Mock Session
                </h2>
                <p className="text-purple-100 opacity-90 leading-relaxed text-lg font-medium">
                  Get real-time feedback on your technical and soft skills.
                </p>
                <button 
                  onClick={() => navigate('/interview-prep')}
                  className="bg-white text-purple-600 font-bold py-4 px-10 rounded-2xl shadow-xl hover:shadow-2xl hover:bg-slate-50 active:scale-95 transition-all flex items-center gap-3"
                >
                  <Play size={20} fill="currentColor" />
                  Launch Simulator
                </button>
              </div>
              
              {/* Decorative graphic */}
              <LayoutDashboard size={280} className="absolute -right-16 -bottom-16 text-white/10 rotate-12 pointer-events-none" />
            </div>

            {/* QUICK CATEGORIES */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: 'Data Structures', icon: <BookOpen />, count: '24 Tasks', color: 'bg-amber-500' },
                { title: 'System Design', icon: <LayoutDashboard />, count: '12 Scenarios', color: 'bg-emerald-500' },
                { title: 'Behavioral', icon: <History />, count: '40 Questions', color: 'bg-blue-500' },
              ].map((cat, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-[2rem] hover:border-purple-500/50 transition-all cursor-pointer group shadow-sm">
                  <div className={`${cat.color}/10 ${cat.color.replace('bg-', 'text-')} size-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    {React.cloneElement(cat.icon, { size: 24 })}
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">{cat.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium">{cat.count}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: SIDEBAR STATS & ACTIVITY */}
          <div className="space-y-6">
            
            {/* PROGRESS CARD */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold flex items-center gap-2">
                  <BarChart3 size={20} className="text-purple-500" />
                  Performance
                </h3>
              </div>
              
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-3 uppercase tracking-widest text-slate-400">
                    <span>Coding Skill</span>
                    <span className="text-slate-900 dark:text-white">82%</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-600 rounded-full w-[82%] shadow-[0_0_12px_rgba(147,51,234,0.4)]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-3 uppercase tracking-widest text-slate-400">
                    <span>Communication</span>
                    <span className="text-slate-900 dark:text-white">65%</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-fuchsia-500 rounded-full w-[65%] shadow-[0_0_12px_rgba(217,70,239,0.4)]" />
                  </div>
                </div>
              </div>
            </div>

            {/* RECENT FEEDBACK LIST */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm">
              <h3 className="font-bold mb-6 flex items-center gap-2">
                <Sparkles size={18} className="text-purple-500" />
                Latest Insights
              </h3>
              <div className="space-y-5">
                {[1, 2].map((i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-transparent hover:border-purple-500/20 transition-all cursor-pointer group">
                    <div className="size-10 shrink-0 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-lg shadow-purple-500/20">
                      AI
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold group-hover:text-purple-600 transition-colors">Frontend Dev Mock</p>
                      <p className="text-[11px] text-slate-500 leading-relaxed">Optimization & hooks feedback ready.</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                View Reports
              </button>
            </div>

          </div>
        </div>

        {/* BOTTOM SECTION: RECOMMENDED PATHS */}
        <section className="pt-4 pb-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Personalized Roadmaps</h2>
            <Link to="/pricing" className="text-sm font-bold text-purple-600 flex items-center gap-1 hover:gap-2 transition-all">
              See All <ChevronRight size={18} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map((item, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 hover:shadow-2xl hover:-translate-y-1 transition-all group">
                <div className="size-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
                  {item.icon}
                </div>
                <p className="font-bold text-lg mb-1">{item.role}</p>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{item.sessions}</p>
                <div className="mt-6 flex items-center text-purple-600 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  Practice Now <ChevronRight size={14} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}