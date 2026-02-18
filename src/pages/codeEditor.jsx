"use client";
import React, { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Send, Code2, Bot, Terminal, Sparkles, LogOut } from "lucide-react";
import { useThemeContext } from "../context/ThemeContext";

export default function InterviewRoom({ sessionId, question }) {
  const { theme } = useThemeContext();
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const editorRef = useRef(null);
  const chatEndRef = useRef(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (question?.text) {
      setMessages([{ role: "ai", content: question?.text }]);
    }
  }, [question]);

  const handleSendMessage = async (type = "user", content = chatInput) => {
    const finalContent = content?.trim();
    if (!finalContent && type === "user") return;

    const newEntry = { role: type, content: finalContent };
    const formattedString = `${type.toUpperCase()}: ${finalContent}\n`;

    setMessages((prev) => [...prev, newEntry]);
    if (type === "user") setChatInput("");

    try {
      await fetch(`/api/interview/${sessionId}/append-history`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ segment: formattedString }),
      });
    } catch (error) {
      console.error("Failed to save history:", error);
    }
  };

  const syncCode = () => {
    if (editorRef.current) {
      const code = editorRef.current.getValue();
      handleSendMessage("code", code);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-white dark:bg-[#0B0F1A] text-slate-900 dark:text-slate-300 transition-colors duration-500 overflow-hidden">
      
      {/* --- Sidebar (Chat) --- */}
      <div className="w-full lg:w-[420px] flex flex-col border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 backdrop-blur-xl h-[45vh] lg:h-full">
        
        {/* Header */}
        <div className="py-3 px-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white/40 dark:bg-transparent shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-8 lg:size-9 rounded-xl bg-gradient-to-br from-[#923FEF] to-[#C35DE8] flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Bot size={18} className="text-white" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-purple-600 dark:text-[#C99DFF] uppercase tracking-widest leading-none">Interviewer AI</p>
              <p className="text-xs lg:text-sm font-semibold dark:text-white">Live DSA Round</p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
          {messages.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`group relative max-w-[95%] p-3 lg:p-4 rounded-2xl text-sm leading-relaxed transition-all shadow-sm ${
                msg.role === 'ai' 
                  ? 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-tl-none' 
                  : msg.role === 'code'
                  ? 'bg-[#011627] border border-purple-500/30 font-mono text-[10px] lg:text-[11px] w-full shadow-xl overflow-x-auto text-emerald-400'
                  : 'bg-purple-600 text-white rounded-tr-none shadow-purple-500/10'
              }`}>
                {msg.role === 'code' && (
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10 opacity-70">
                    <Terminal size={12} /> 
                    <span className="text-[9px] font-bold uppercase tracking-widest">Snapshot Sent</span>
                  </div>
                )}
                <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-transparent">
          <div className="relative flex items-center">
            <input 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Explain your thought process..."
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-4 pr-12 py-2.5 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all shadow-sm"
            />
            <button 
              onClick={() => handleSendMessage()} 
              className="absolute right-1.5 p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all active:scale-90 shadow-md"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* --- Main Content (Editor) --- */}
      <div className="flex-1 flex flex-col relative h-[55vh] lg:h-full">
        
        {/* Editor Toolbar */}
        <div className="h-14 lg:h-16 flex items-center justify-between px-4 lg:px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F1A] shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
              <Code2 size={14} className="text-purple-600 dark:text-purple-400" />
              <span className="text-[10px] font-mono font-bold dark:text-slate-400 uppercase tracking-widest">solution.py</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={syncCode}
              className="flex items-center gap-2 text-[11px] font-semibold px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              <Sparkles size={13} className="text-purple-500 hidden sm:block" />
              Sync
            </button>
            <button 
              onClick={() => window.location.href = "/dashboard"}
              className="bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold px-4 py-1.5 rounded-lg shadow-lg shadow-purple-500/20 active:scale-95 transition-all flex items-center gap-2"
            >
              Submit <LogOut size={13} />
            </button>
          </div>
        </div>

        {/* Editor Instance */}
        <div className="flex-1 min-h-0">
          <Editor
            theme={theme === "dark" ? "vs-dark" : "light"}
            defaultLanguage="python"
            onMount={(editor) => (editorRef.current = editor)}
            options={{
              fontSize: 14,
              fontFamily: "'Fira Code', monospace",
              minimap: { enabled: false },
              padding: { top: 16 },
              smoothScrolling: true,
              cursorBlinking: "smooth",
              renderLineHighlight: "all",
              scrollbar: {
                verticalScrollbarSize: 8,
                horizontalScrollbarSize: 8,
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}