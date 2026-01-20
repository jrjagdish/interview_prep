"use client";

import React, { useRef, useState } from 'react';
import { 
  ChevronLeft, Settings, CloudUpload, FileText, 
  CheckCircle2, AlertCircle, MoreVertical, RefreshCcw,
  ShieldCheck, Zap, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EnhancedUploadPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Function to trigger the native file browser
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // START BACKEND CALLED HERE
    console.log("Uploading:", file.name);
    setIsUploading(true);
    
    // Simulate API Call
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await fetch("/api/upload-resume", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log("Success:", data);
    } catch (err) {
      console.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0b1219] text-white flex items-center justify-center p-0 sm:p-4 md:p-8">
      
      {/* DESKTOP WRAPPER 
          On desktop: Flex-row with a 60/40 split
          On mobile: Standard vertical stack
      */}
      <div className="flex flex-col lg:flex-row w-full max-w-6xl h-full lg:h-[800px] bg-[#101922] lg:rounded-[3rem] overflow-hidden shadow-2xl border border-white/5">
        
        {/* LEFT SIDE: Branding/Marketing (Visible only on Desktop) */}
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 to-indigo-900 p-12 flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 rotate-12 translate-x-10">
             <CloudUpload size={400} />
          </div>
          
          <div className="z-10">
            <div className="size-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-8">
              <Zap className="text-white" fill="white" />
            </div>
            <h1 className="text-5xl font-black leading-tight">
              Master the <br /> <span className="text-blue-200">Interview.</span>
            </h1>
            <p className="text-blue-100/70 mt-6 max-w-md text-lg">
              Our AI analyzes your specific career history to generate the exact behavioral questions top tech firms ask.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 z-10">
            {[
              { icon: <ShieldCheck size={20}/>, label: "Privacy First" },
              { icon: <Star size={20}/>, label: "AI Insights" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                {item.icon} <span className="font-bold text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE: Functional Dashboard */}
        <div className="w-full lg:w-[460px] flex flex-col relative bg-[#101922]">
          
          {/* Top bar */}
          <div className="flex items-center p-6 justify-between border-b border-white/5">
            <button className="size-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-xs font-black tracking-widest uppercase text-slate-500">Document Center</h2>
            <button className="size-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
              <Settings size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar p-6 pb-32">
            <div className="mb-8">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                Upload Resume
              </h3>
              <p className="text-slate-400 text-sm mt-1">Get custom AI feedback on your profile.</p>
            </div>

            {/* HIDDEN FILE INPUT */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={onFileChange} 
              accept=".pdf,.docx" 
              className="hidden" 
            />

            {/* CLICKABLE UPLOAD AREA */}
            <motion.div 
              whileHover={{ scale: 0.98 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleUploadClick}
              className="group relative flex flex-col items-center gap-4 rounded-[2.5rem] border-2 border-dashed border-blue-500/30 bg-blue-500/5 px-6 py-12 transition-all hover:border-blue-500 hover:bg-blue-500/10 cursor-pointer"
            >
              <div className="flex size-16 items-center justify-center rounded-2xl bg-blue-600 shadow-xl text-white group-hover:rotate-12 transition-transform">
                <CloudUpload size={32} />
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">Click to browse</p>
                <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold">PDF, DOCX up to 5MB</p>
              </div>
            </motion.div>

            {/* History List */}
            <div className="mt-10 space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Recent Uploads</h3>
              <div className="space-y-3">
                <UploadItem
                  delay={0.1}
                  icon={<FileText className="text-blue-400" />}
                  title="Senior_Dev_Resume.pdf"
                  status={isUploading ? "Uploading..." : "Analyzed"}
                  statusColor={isUploading ? "text-blue-400" : "text-emerald-400"}
                  progress={isUploading ? 45 : undefined}
                />
                <UploadItem
                  delay={0.2}
                  icon={<CheckCircle2 className="text-emerald-400" />}
                  title="Portfolio_2024.pdf"
                  status="Ready"
                  statusColor="text-emerald-400"
                />
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#101922] via-[#101922] to-transparent">
            <button className="w-full h-14 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-blue-500 transition-all">
              Proceed to Interview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function UploadItem({ icon, title, status, statusColor, progress, delay }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="flex items-center gap-4 rounded-2xl bg-white/[0.03] p-4 border border-white/5"
    >
      <div className="size-11 rounded-xl bg-slate-900 flex items-center justify-center border border-white/5">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold truncate text-slate-200">{title}</p>
        <p className={`text-[10px] font-bold uppercase tracking-wider ${statusColor} mt-0.5`}>{status}</p>
        {progress && (
          <div className="mt-2 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
      <MoreVertical size={16} className="text-slate-600" />
    </motion.div>
  );
}