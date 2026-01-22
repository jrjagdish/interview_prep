"use client";

import React from 'react';
import { 
  Bell, 
  Flame, 
  BarChart3, 
  ChevronRight, 
  BookOpen, 
  History, 
  PlayCircle,
  Play,
  Award,
  TrendingUp,
  Clock,
  Users
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// --- Types ---
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
}

interface SectionHeaderProps {
  title: string;
}

interface TipCardProps {
  title: string;
  subtitle: string;
  image: string;
}

const HomePage = () => {
  const quickActions = [
    { title: 'Technical Interview', desc: 'Practice coding questions', time: '30-45 min', color: 'from-blue-500 to-cyan-500' },
    { title: 'Behavioral Interview', desc: 'HR & situational questions', time: '20-30 min', color: 'from-purple-500 to-pink-500' },
    { title: 'System Design', desc: 'Architecture challenges', time: '45-60 min', color: 'from-orange-500 to-red-500' },
    { title: 'Mock Interview', desc: 'Full simulation with AI', time: '60 min', color: 'from-green-500 to-emerald-500' },
  ];

  const skills = [
    { name: 'Technical Skills', level: 85 },
    { name: 'Communication', level: 75 },
    { name: 'Problem Solving', level: 65 },
    { name: 'Confidence', level: 55 },
  ];
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 pb-20 selection:bg-indigo-500/30">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between p-4 md:px-8">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                alt="Profile"
                className="relative w-11 h-11 rounded-full border-2 border-slate-800 bg-slate-900 object-cover"
              />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Hello, Alex</h2>
              <p className="text-xs text-slate-400 font-medium">Ready for your mock interview?</p>
            </div>
          </div>
          <button className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-all">
            <Bell className="w-5 h-5 text-slate-300" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-slate-900"></span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 space-y-12 mt-8">
        
        {/* Welcome Hero */}
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter leading-none">
            Ready to Ace Your
            <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Next Interview?
            </span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl leading-relaxed">
            Practice with AI-powered interviews, get instant feedback, and track your progress.
          </p>
        </div>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={<Play className="text-indigo-400" size={20} />} label="Sessions" value="24" change="+12%" />
          <StatCard icon={<Award className="text-emerald-400" size={20} />} label="Mastered" value="18" change="+5" />
          <StatCard icon={<Clock className="text-orange-400" size={20} />} label="Hours" value="48.5" change="+8.2h" />
          <StatCard icon={<TrendingUp className="text-purple-400" size={20} />} label="Score" value="87%" change="+4%" />
        </section>

        {/* Quick Start Grid */}
        <section className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Start Interview Practice</h2>
              <p className="text-slate-400 text-sm">Choose your specialty and begin a session</p>
            </div>
            <Link href="/interviewtab"><button className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
              <PlayCircle className="w-5 h-5" />
              Start All Sessions
            </button></Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <div
                key={index}
                className={`group relative overflow-hidden bg-gradient-to-br ${action.color} rounded-2xl p-6 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl`}
              >
                <div className="relative z-10 flex flex-col h-full justify-between min-h-[140px]">
                  <div>
                    <h3 className="font-bold text-lg text-white mb-1">{action.title}</h3>
                    <p className="text-white/80 text-xs leading-relaxed">{action.desc}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-[10px] font-bold text-white/90 bg-black/20 px-2 py-1 rounded-md uppercase tracking-wider">{action.time}</span>
                    <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/40 transition-colors">
                      <Link href="/interviewtab"><Play className="w-4 h-4 text-white fill-white" /></Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Section: Progress & Tips */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Progress Overview */}
          <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              Progress Overview
            </h3>
            <div className="space-y-6">
              {skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-slate-300">{skill.name}</span>
                    <span className="text-sm font-bold text-indigo-400">{skill.level}%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                  <Users className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-bold">Community Sessions</p>
                  <p className="text-[10px] text-slate-400">Join peers every Friday</p>
                </div>
              </div>
              <button onClick={()=>{
                router.push("/interviewerDashboard")
              }} className="w-full mt-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-sm font-bold rounded-xl transition-colors border border-slate-700">
                See All Sessions
              </button>
            </div>
          </div>

          {/* Tips and Insights */}
          <div className="lg:col-span-2 space-y-6">
            <SectionHeader title="Daily Tips & Insights" />
            <div className="grid md:grid-cols-2 gap-4">
              <TipCard
                title="The STAR Method Masterclass"
                subtitle="The secret to perfect behavioral answers."
                image="https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&q=80"
              />
              <TipCard
                title="Interview Body Language"
                subtitle="Non-verbal cues that build trust."
                image="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&q=80"
              />
              <TipCard
                title="Technical Whiteboarding"
                subtitle="Communicate your logic effectively."
                image="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=200&q=80"
              />
              <TipCard
                title="Salary Negotiation"
                subtitle="Know your worth and ask for it."
                image="https://images.unsplash.com/photo-1454165833767-027ffea9e77b?w=200&q=80"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

/* ---------- Sub-components with TypeScript Typing ---------- */

const StatCard = ({ icon, label, value, change }: StatCardProps) => (
  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl hover:bg-slate-800/50 transition-all group">
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 bg-slate-800 rounded-xl group-hover:scale-110 transition-transform">{icon}</div>
      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">{change}</span>
    </div>
    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{label}</p>
    <h4 className="text-2xl font-black mt-1">{value}</h4>
  </div>
);

const SectionHeader = ({ title }: SectionHeaderProps) => (
  <div className="flex justify-between items-end">
    <h3 className="text-xl font-bold tracking-tight">{title}</h3>
    <button className="text-indigo-400 text-sm font-semibold hover:text-indigo-300 transition-colors">View all</button>
  </div>
);

const TipCard = ({ title, subtitle, image }: TipCardProps) => (
  <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group">
    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
      <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="font-bold text-sm truncate">{title}</h4>
      <p className="text-xs text-slate-400 line-clamp-2">{subtitle}</p>
    </div>
    <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-slate-300 transition-colors" />
  </div>
);

export default HomePage;