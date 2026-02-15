import { MenuIcon, XIcon, Zap, BrainCircuit } from "lucide-react";
import { useEffect, useState } from "react";
import { useThemeContext } from "../context/ThemeContext";
import { navLinks } from "../data/navLinks";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const { theme } = useThemeContext();

  useEffect(() => {
    if (openMobileMenu) {
      document.body.classList.add("max-md:overflow-hidden");
    } else {
      document.body.classList.remove("max-md:overflow-hidden");
    }
  }, [openMobileMenu]);

  return (
    <nav
      className={`flex items-center justify-between fixed z-50 top-0 w-full px-6 md:px-16 lg:px-24 xl:px-34 py-4 ${openMobileMenu ? "" : "backdrop-blur"}`}
    >
      {/* BRAND LOGO SECTION - Restored Original Structure */}
      <Link to="/" className="flex items-center gap-2.5 shrink-0">
        <div className="relative flex items-center justify-center">
          <div className="size-9 rounded-lg bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-600/20">
            <Zap size={18} className="text-white fill-white" />
          </div>
          <BrainCircuit 
            size={14} 
            className="absolute -top-1 -right-1 text-purple-500 bg-white dark:bg-slate-950 rounded-full" 
          />
        </div>
        <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">
          Inter<span className="text-purple-600">Pre</span> AI
        </span>
      </Link>

      <div className="hidden items-center md:gap-8 lg:gap-9 md:flex lg:pl-20">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.href}
            className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* Mobile menu - Restored Original Structure */}
      <div
        className={`fixed inset-0 flex flex-col items-center justify-center gap-6 text-lg font-medium bg-white/60 dark:bg-black/40 backdrop-blur-md md:hidden transition duration-300 ${openMobileMenu ? "translate-x-0" : "-translate-x-full"}`}
      >
        {navLinks.map((link) => (
          <Link key={link.name} to={link.href} onClick={() => setOpenMobileMenu(false)}>
            {link.name}
          </Link>
        ))}
        <Link to="/login" onClick={() => setOpenMobileMenu(false)}>
          <button>Sign in</button>
        </Link>
        <button
          className="aspect-square size-10 p-1 items-center justify-center bg-purple-600 hover:bg-purple-700 transition text-white rounded-md flex"
          onClick={() => setOpenMobileMenu(false)}
        >
          <XIcon size={24} />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Link to="/login">
          <button className="hidden md:block hover:bg-slate-100 dark:hover:bg-purple-950/30 transition px-4 py-2 border border-purple-600 rounded-md text-sm font-medium">
            Sign in
          </button>
        </Link>
        <Link to="/login">
          <button className="hidden md:block px-4 py-2 bg-purple-600 hover:bg-purple-700 transition text-white rounded-md text-sm font-medium">
            Get started
          </button>
        </Link>
        <button
          onClick={() => setOpenMobileMenu(!openMobileMenu)}
          className="md:hidden"
        >
          <MenuIcon size={26} className="active:scale-90 transition text-slate-900 dark:text-white" />
        </button>
      </div>
    </nav>
  );
}