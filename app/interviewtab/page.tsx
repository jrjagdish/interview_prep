"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Settings,
  Send,
  Mic,
  User,
  Sparkles,
  Plus,
  RotateCcw,
  AlertCircle, // Added for error icons
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function AIInterviewChat() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      role: "ai",
      content: "Initializing your interview session...",
    },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when history changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isLoading]);

  // Initial Session Start
  useEffect(() => {
    const startSession = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/interview/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: "Software Engineer", level: "Mid" }),
          credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to start session");

        const data = await response.json();
        setSessionId(data.session_id);
        setChatHistory([{ role: "ai", content: data.question }]);
      } catch (error) {
        setChatHistory([
          {
            role: "ai",
            content:
              "System: Unable to connect to the interview server. Please check your connection.",
          },
        ]);
      }
    };

    startSession();
  }, []);

  const handleSend = async () => {
    if (!message.trim() || !sessionId || isLoading) return;

    const userMessage = message.trim();
    setMessage("");
    setChatHistory((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/interview/${sessionId}/answer`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answer: userMessage }),
        },
      );

      if (!response.ok) throw new Error("Submission failed");

      const data = await response.json();

      if (data.completed) {
        // SECURE REDIRECT: Send user to the review folder with the ID
        router.push(`/review/${sessionId}`);
      } else {
        setChatHistory((prev) => [
          ...prev,
          { role: "ai", content: data.question || "Next question..." },
        ]);
      }
    } catch (error) {
      setChatHistory((prev) => [
        ...prev,
        {
          role: "ai",
          content:
            "I'm having trouble processing that. Could you try sending your answer again?",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEvaluation = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/interview/${sessionId}/evaluate`,
        {
          method: "POST",
        },
      );
      const data = await response.json();
      setChatHistory((prev) => [
        ...prev,
        {
          role: "ai",
          content: `Interview Complete! Score: ${data.score}. Feedback: ${data.feedback}`,
        },
      ]);
    } catch (err) {
      console.error("Evaluation failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1219] text-slate-100 flex flex-col items-center font-sans">
      <header className="w-full max-w-4xl flex items-center justify-between p-4 border-b border-white/5 bg-[#0b1219]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight leading-none mb-1">
              Interview AI
            </h2>
            <div className="flex items-center gap-1.5">
              <span
                className={`size-1.5 ${sessionId ? "bg-emerald-500" : "bg-amber-500"} rounded-full animate-pulse`}
              />
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                {sessionId ? "Coach Active" : "Connecting..."}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => window.location.reload()}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
          >
            <RotateCcw size={18} />
          </button>
          <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
            <Settings size={18} />
          </button>
        </div>
      </header>

      <main
        ref={scrollRef}
        className="flex-1 w-full max-w-3xl flex flex-col p-4 sm:p-6 space-y-8 overflow-y-auto mb-[140px] scroll-smooth"
      >
        {chatHistory.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-3 duration-500`}
          >
            <div
              className={`flex items-start gap-3 sm:gap-4 max-w-[88%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`size-8 rounded-lg shrink-0 flex items-center justify-center border mt-0.5 ${
                  msg.role === "user"
                    ? "bg-slate-800 border-slate-700"
                    : "bg-blue-600/10 border-blue-500/20"
                }`}
              >
                {msg.role === "user" ? (
                  <User size={14} className="text-slate-300" />
                ) : (
                  <Sparkles size={14} className="text-blue-400" />
                )}
              </div>
              <div
                className={`relative px-4 py-2.5 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-none"
                    : "bg-slate-800/50 border border-white/5 text-slate-200 rounded-tl-none"
                }`}
              >
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-slate-800/50 px-4 py-2 rounded-2xl text-xs text-slate-400">
              AI is thinking...
            </div>
          </div>
        )}
      </main>

      <div className="fixed bottom-0 w-full flex justify-center px-4 pb-8 pt-4 bg-gradient-to-t from-[#0b1219] via-[#0b1219]/90 to-transparent">
        <div className="w-full max-w-3xl">
          <div className="relative flex items-end bg-[#1a242f] border border-white/10 rounded-[26px] p-1.5 transition-all duration-300 focus-within:border-blue-500/40 focus-within:shadow-[0_0_20px_rgba(59,130,246,0.05)]">
            <button className="flex shrink-0 items-center justify-center size-10 text-slate-400 hover:text-white transition-colors ml-1 mb-0.5">
              <Plus size={22} />
            </button>
            <div className="flex-1 min-w-0">
              <ChatInput
                value={message}
                onChange={setMessage}
                onEnter={handleSend}
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center gap-1 mr-1 mb-0.5">
              <button className="hidden sm:flex items-center justify-center size-10 text-slate-400 hover:text-blue-400 transition-colors">
                <Mic size={20} />
              </button>
              <button
                onClick={handleSend}
                disabled={!message.trim() || isLoading}
                className={`size-10 flex items-center justify-center rounded-full transition-all duration-300 ${
                  message.trim() && !isLoading
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-slate-800 text-slate-600 opacity-50"
                }`}
              >
                <Send
                  size={18}
                  className={message.trim() ? "translate-x-0.5" : ""}
                />
              </button>
            </div>
          </div>
          <div className="flex justify-center mt-3 items-center gap-3 opacity-40">
            <p className="text-[10px] font-medium tracking-wide uppercase">
              {isLoading ? "AI typing..." : "AI Coach"}
            </p>
            <div className="size-1 bg-slate-700 rounded-full" />
            <p className="text-[10px] font-medium tracking-wide text-slate-400">
              SHIFT + ENTER FOR NEW LINE
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatInput({
  value,
  onChange,
  onEnter,
  disabled,
}: {
  value: string;
  onChange: (val: string) => void;
  onEnter: () => void;
  disabled?: boolean;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "42px";
      const scrollHeight = textareaRef.current.scrollHeight;
      if (value) {
        textareaRef.current.style.height = `${Math.min(scrollHeight, 160)}px`;
      }
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onEnter();
    }
  };

  return (
    <textarea
      ref={textareaRef}
      rows={1}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      placeholder={disabled ? "Waiting for AI..." : "Type your response..."}
      className="w-full bg-transparent border-none outline-none focus:ring-0 text-slate-100 text-[15px] py-[10px] px-2 resize-none overflow-y-auto placeholder:text-slate-500 leading-normal block disabled:opacity-50"
    />
  );
}
