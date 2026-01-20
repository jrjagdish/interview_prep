"use client";

import React from 'react';
import { Home, BookOpen, Users, User } from 'lucide-react';

export default function BottomNav() {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[380px] z-50">
      <nav className="bg-[#1C1F22]/90 backdrop-blur-2xl rounded-[32px] border border-white/10 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex justify-between items-center">
        <NavItem icon={<Home size={22} />} active />
        <NavItem icon={<BookOpen size={22} />} />
        <NavItem icon={<Users size={22} />} />
        <NavItem icon={<User size={22} />} />
      </nav>
    </div>
  );
}

function NavItem({ icon, active = false }: { icon: React.ReactNode, active?: boolean }) {
  return (
    <div className={`
      flex items-center justify-center w-14 h-14 rounded-3xl transition-all duration-300
      ${active ? "bg-white text-black shadow-xl" : "text-[#6B7280] hover:text-white hover:bg-white/5"}
    `}>
      {React.cloneElement(icon as React.ReactElement, { strokeWidth: active ? 2.5 : 1.5 } as any)}
    </div>
  );
}