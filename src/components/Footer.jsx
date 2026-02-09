import { Link } from "react-router-dom";
import { useThemeContext } from "../context/ThemeContext";
import { navLinks } from "../data/navLinks";

export default function Footer() {
    const { theme } = useThemeContext();
    return (
        <footer className="relative px-6 md:px-16 lg:px-24 xl:px-32 mt-40 w-full dark:text-slate-50">
            <img 
                className="absolute max-w-4xl w-full h-auto -mt-30 max-md:px-4 right-0 md:right-16 lg:right-24 xl:right-32 top-0 pointer-events-none opacity-50 dark:opacity-100" 
                src={theme === "dark" ? "/assets/landing-text-dark.svg" : "/assets/landing-text-light.svg"} 
                alt="landing" 
                width={930} 
                height={340} 
            />
            <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-200 dark:border-slate-700 pb-6">
                <div className="md:max-w-114 z-10">
                    <Link to="/">
                        <img 
                            className="h-9 md:h-9.5 w-auto shrink-0" 
                            src={theme === "dark" ? "/assets/logo-light.svg" : "/assets/logo-dark.svg"} 
                            alt="Logo" 
                            width={140} 
                            height={40} 
                        />
                    </Link>
                    <p className="mt-6 text-slate-600 dark:text-slate-400 leading-relaxed">
                        Master your technical and behavioral interviews with our high-performance AI engine. 
                        Powered by Groq and LiveKit, we provide the world&apos;s fastest, most realistic mock 
                        interview experience for modern developers.
                    </p>
                </div>
                <div className="flex-1 flex items-start md:justify-end gap-20 z-10">
                    <div>
                        <h2 className="font-semibold mb-5 uppercase tracking-wider text-xs text-purple-600 dark:text-purple-400">Platform</h2>
                        <ul className="space-y-3">
                            {navLinks.map((link, index) => (
                                <li key={index}>
                                    <Link to={link.href} className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h2 className="font-semibold mb-5 uppercase tracking-wider text-xs text-purple-600 dark:text-purple-400">Support</h2>
                        <div className="space-y-3 text-slate-600 dark:text-slate-400">
                            <p className="hover:text-purple-600 transition cursor-pointer">Help Center</p>
                            <p className="hover:text-purple-600 transition cursor-pointer">Terms of Service</p>
                            <p className="hover:text-purple-600 transition cursor-pointer">Privacy Policy</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center py-8 text-slate-500 text-sm">
                <p>Copyright 2026 © PrepAI. All Right Reserved.</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                    <span className="hover:text-purple-600 cursor-pointer">Twitter</span>
                    <span className="hover:text-purple-600 cursor-pointer">LinkedIn</span>
                    <span className="hover:text-purple-600 cursor-pointer">GitHub</span>
                </div>
            </div>
        </footer>
    );
};