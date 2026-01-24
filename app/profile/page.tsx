"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  ArrowLeft,
  MapPin,
  Briefcase,
  Calendar,
  ChevronRight,
  Pencil,
  Trophy,
  Play,
  LayoutGrid,
  Loader2,
  LogOut,
} from "lucide-react";
import BottomNav from "../components/NavBar";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/auth/me", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) throw new Error("Unauthorized");

        const data = await response.json();
        setUser(data);
      } catch (err) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("http://127.0.0.1:8000/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      router.push("/login");
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F1113] flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-500" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0F1113] text-[#E2E2E6] flex justify-center font-sans antialiased">
      <div className="w-full max-w-md flex flex-col relative pb-32">
        <header className="sticky top-0 z-30 bg-[#0F1113]/80 backdrop-blur-xl px-6 h-20 flex items-center justify-between">
          <Link href="/home">
            <button className="p-2 -ml-2 rounded-full active:bg-white/10 transition-all text-[#C2C6CF]">
              <ArrowLeft size={22} strokeWidth={1.5} />
            </button>
          </Link>
          <span className="text-sm font-bold tracking-[0.3em] uppercase opacity-60">
            Profile
          </span>

          {/* LOGOUT BUTTON */}
          <button
            onClick={handleLogout}
            className="p-2 -mr-2 rounded-full active:bg-red-500/10 transition-all text-[#C2C6CF] hover:text-red-400"
            title="Logout"
          >
            <LogOut size={22} strokeWidth={1.5} />
          </button>
        </header>

        {/* HERO SECTION */}
        <section className="px-8 pt-6 pb-12 flex flex-col items-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-indigo-500 blur-[60px] opacity-20" />
            <div className="relative w-32 h-32 rounded-[40px] rotate-3 bg-gradient-to-tr from-indigo-500 to-cyan-400 p-[2px]">
              <div
                className="w-full h-full rounded-[38px] bg-[#0F1113] bg-cover bg-center -rotate-3"
                style={{
                  backgroundImage: `url(https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.full_name})`,
                }}
              />
            </div>
          </div>

          <h2 className="text-3xl font-black text-white tracking-tight">
            {user?.full_name}
          </h2>
          <p className="mt-3 text-[#9EA3AE] font-medium flex items-center gap-2 italic">
            <Briefcase size={16} className="text-indigo-400" />
            {user?.role}
          </p>
          <p className="mt-1 text-[#6B7280] text-sm font-medium">
            {user?.email}
          </p>
        </section>

        {/* STATS SECTION */}
        <section className="px-6 grid grid-cols-3 gap-4 mb-14">
          {[
            {
              label: "Interviews",
              value: user?.stats?.total_interviews || "0",
              icon: <Calendar size={14} />,
              theme: "bg-indigo-500/10 text-indigo-300",
            },
            {
              label: "Success",
              value: `${user?.stats?.success_rate || "0"}%`,
              icon: <Trophy size={14} />,
              theme: "bg-emerald-500/10 text-emerald-300",
            },
            {
              label: "Skills",
              value: user?.stats?.skills_count || "0",
              icon: <LayoutGrid size={14} />,
              theme: "bg-amber-500/10 text-amber-300",
            },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col gap-2">
              <div
                className={`${stat.theme} rounded-3xl p-5 flex flex-col items-start gap-3 border border-white/5`}
              >
                {stat.icon}
                <span className="text-2xl font-black tracking-tight">
                  {stat.value}
                </span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-2">
                {stat.label}
              </span>
            </div>
          ))}
        </section>

        <BottomNav />
      </div>
    </div>
  );
}
