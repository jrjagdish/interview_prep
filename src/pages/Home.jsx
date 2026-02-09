"use client";
import { VideoIcon } from "lucide-react";
import Marquee from "react-fast-marquee";
import { companiesLogo } from "../data/companiesLogo";
import { featuresData } from "../data/featuresData";
import SectionTitle from "../components/SectionTitle";
import { useThemeContext } from "../context/ThemeContext";
import { FaqSection } from "../sections/FaqSection";
import Pricing from "../sections/Pricing";
import { Link } from "react-router-dom";

export default function Page() {
  const { theme } = useThemeContext();
  return (
    <>
      <div className="flex flex-col items-center justify-center text-center px-4 bg-[url('/assets/light-hero-gradient.svg')] dark:bg-[url('/assets/dark-hero-gradient.svg')] bg-no-repeat bg-cover">
        <div className="flex flex-wrap items-center justify-center gap-3 p-1.5 pr-4 mt-46 rounded-full border border-slate-300 dark:border-slate-600 bg-white/70 dark:bg-slate-600/20">
          <div className="flex items-center -space-x-3">
            <img
              className="size-7 rounded-full border-2 border-white dark:border-slate-800"
              height={50}
              width={50}
              src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=50"
              alt="userImage1"
            />
            <img
              className="size-7 rounded-full border-2 border-white dark:border-slate-800"
              height={50}
              width={50}
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=50"
              alt="userImage2"
            />
            <img
              className="size-7 rounded-full border-2 border-white dark:border-slate-800"
              height={50}
              width={50}
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=50&h=50&auto=format&fit=crop"
              alt="userImage3"
            />
          </div>
          <p className="text-xs font-medium">Join 10k+ engineers leveling up today</p>
        </div>
        
        <h1 className="mt-2 text-5xl/15 md:text-[64px]/19 font-semibold max-w-2xl text-slate-900 dark:text-white">
          Give your interview a competitive{" "}
          <span className="bg-gradient-to-r from-[#923FEF] dark:from-[#C99DFF] to-[#C35DE8] dark:to-[#E1C9FF] bg-clip-text text-transparent">
            edge
          </span>
        </h1>
        
        <p className="text-base text-slate-600 dark:text-slate-300 max-w-lg mt-4">
          The ultimate AI-driven simulator built for early-career developers. 
          Master technical rounds and behavioral storytelling with real-time feedback.
        </p>

        <div className="flex items-center gap-4 mt-8">
          <Link to="/register">
            <button className="bg-purple-600 hover:bg-purple-700 transition text-white rounded-md px-8 h-12 font-medium shadow-lg shadow-purple-500/20 active:scale-95">
              Get started free
            </button>
          </Link>
          <button className="flex items-center gap-2 border border-slate-300 dark:border-purple-900/50 transition text-slate-700 dark:text-white rounded-md px-8 h-12 hover:bg-slate-50 dark:hover:bg-purple-900/10 active:scale-95">
            <VideoIcon className="size-5" strokeWidth={1.5} />
            <span>Watch demo</span>
          </button>
        </div>

        <h3 className="text-sm text-center text-slate-400 mt-28 pb-14 font-medium tracking-wide uppercase">
          Our graduates work at world-class teams
        </h3>
        
        <Marquee
          className="max-w-5xl mx-auto"
          gradient={true}
          speed={35}
          gradientColor={theme === "dark" ? [0, 0, 0] : [255, 255, 255]}
        >
          <div className="flex items-center justify-center">
            {[...companiesLogo, ...companiesLogo].map((company, index) => (
              <img
                key={index}
                className="mx-12 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition duration-300"
                src={company.logo}
                alt={company.name}
                width={120}
                height={40}
              />
            ))}
          </div>
        </Marquee>
      </div>

      <SectionTitle
        text1="PREP ENGINE"
        text2="Built for the next generation of talent"
        text3="Stop guessing and start practicing with a full-stack simulator that analyzes your code logic and communication style."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 px-6 md:px-16 lg:px-24 xl:px-32 max-w-7xl mx-auto">
        {featuresData.map((feature, index) => (
          <div
            key={index}
            className="p-8 rounded-2xl space-y-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:border-purple-500/50 transition-colors duration-300"
          >
            <div className="bg-purple-50 dark:bg-purple-900/20 size-12 rounded-lg flex items-center justify-center">
                <feature.icon
                  className="text-purple-600 dark:text-purple-400 size-6"
                  strokeWidth={1.5}
                />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{feature.title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>

      <Pricing />

      <FaqSection />

      <div className="flex flex-col items-center text-center justify-center py-24 bg-slate-50 dark:bg-slate-900/50 mt-20 border-y border-slate-200 dark:border-slate-800">
        <h3 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Ready to land your dream offer?
        </h3>
        <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-lg">
          Join the thousands of freshers who are replacing interview anxiety with 
          proven confidence.
        </p>
        <div className="flex items-center gap-4 mt-10">
          <button className="bg-purple-600 hover:bg-purple-700 transition text-white rounded-md px-10 h-12 font-semibold shadow-xl shadow-purple-500/25 active:scale-95">
            Start Your First Session
          </button>
          <button className="border border-slate-300 dark:border-slate-700 transition text-slate-700 dark:text-white rounded-md px-10 h-12 hover:bg-white dark:hover:bg-slate-800 active:scale-95">
            Explore Curriculum
          </button>
        </div>
      </div>
    </>
  );
}