"use client";

import React, { useState } from "react";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  ControlBar,
  AudioVisualizer,
  useTracks,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import {
  MicOff,
  Loader2,
  Sparkles,
  BrainCircuit,
  Waves,
  XCircle,
  AlertCircle,
} from "lucide-react";
import "@livekit/components-styles";

export default function InterviewPage() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sessionData, setSessionData] = useState(null);
  const [error, setError] = useState(null);
  const [roomName, setRoomName] = useState(null);

  // For Vite, use import.meta.env. If not defined, fallback to localhost
  const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL ;

  const startInterview = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8000/interview/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "Fullstack Developer",
          level: "Mid-Level",
        }),
        credentials: "include",
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Failed to initialize session");
      }

      const data = await response.json();
      if (!data.token) throw new Error("No token received from server");

      setToken(data.token);
      setRoomName(data.room_name);
      setSessionData(data);
    } catch (error) {
      console.error("Connection Error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05080a] text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-500">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] size-[600px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] size-[500px] bg-fuchsia-600/10 blur-[100px] rounded-full pointer-events-none" />

      {!token ? (
        // --- PRE-INTERVIEW LOBBY ---
        <div className="max-w-md w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 backdrop-blur-xl rounded-[2.5rem] p-10 shadow-2xl text-center relative z-10">
          <div className="bg-gradient-to-tr from-purple-600 to-fuchsia-500 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-purple-500/20 rotate-3">
            <BrainCircuit className="text-white w-10 h-10 -rotate-3" />
          </div>

          <h1 className="text-3xl font-black tracking-tight mb-3">
            Technical Check
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
            You are about to start a{" "}
            <span className="text-purple-600 font-bold">
              Fullstack Developer
            </span>{" "}
            interview.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800/50 p-4 rounded-2xl text-left border border-transparent dark:hover:border-purple-500/30 transition-all">
              <Waves className="text-purple-500" size={20} />
              <span className="text-sm font-semibold">Microphone ready</span>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <button
              onClick={startInterview}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-purple-600/20 transition-all active:scale-95 flex items-center justify-center gap-3 text-lg mt-4"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <span>Start Interview</span>
                  <Sparkles size={20} />
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        // --- ACTIVE INTERVIEW ROOM ---
        <LiveKitRoom
          video={false}
          audio={true}
          token={token}
          serverUrl={LIVEKIT_URL}
          connect={true}
          onDisconnected={() => {
            // setToken(null);
            // setError(null);
            console.log("Disconnected")
          }}
          // Added h-full and min-h to prevent blank collapsing
          className="flex-1 w-full max-w-5xl flex flex-col relative z-10 min-h-[500px]"
        >
          <div className="flex-1 flex flex-col items-center justify-center space-y-12">
            {/* Session Status Header */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-500/10 dark:bg-purple-500/20 border border-purple-500/20 text-purple-600 dark:text-purple-400 rounded-full text-xs font-black uppercase tracking-[0.2em]">
                <div className="size-2 bg-purple-500 rounded-full animate-ping" />
                Live Analysis In Progress
              </div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Fullstack Developer Simulation
              </h2>
            </div>

            {/* Neural Visualizer Circle */}
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-purple-500/30 blur-[100px] rounded-full animate-pulse" />
              <div className="relative bg-white dark:bg-slate-900 border-8 border-slate-100 dark:border-slate-800 h-64 w-64 rounded-full flex items-center justify-center overflow-hidden shadow-2xl">
                <VisualizerDisplay />
              </div>
            </div>

            {/* AI Status Indicator */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex gap-1">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="size-1.5 bg-purple-500 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
              <p className="text-purple-600 dark:text-purple-400 font-bold text-sm uppercase tracking-widest">
                AI Interviewer Listening
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="pb-10 flex justify-center">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-4 rounded-[2rem] shadow-2xl flex items-center gap-6">
              <ControlBar
                variation="minimal"
                controls={{
                  microphone: true,
                  leave: false,
                  camera: false,
                  screenShare: false,
                }}
              />
              <div className="w-px h-8 bg-slate-200 dark:bg-slate-800" />
              <button
                onClick={() => setToken(null)}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-xl font-bold text-sm hover:bg-red-100 transition-all active:scale-95"
              >
                <XCircle size={18} />
                End Session
              </button>
            </div>
          </div>

          <RoomAudioRenderer />
        </LiveKitRoom>
      )}
    </div>
  );
}

function VisualizerDisplay() {
  // useTracks returns an array of objects that include the track
  const tracks = useTracks([Track.Source.Microphone]);
  const micTrack = tracks[0];

  // Check if track actually exists before trying to visualize it
  if (!micTrack || !micTrack.track) {
    return (
      <div className="flex flex-col items-center gap-3 text-center p-4">
        <MicOff className="w-10 h-10 text-slate-300 dark:text-slate-700" />
        <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">
          Connecting Audio...
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full h-full p-6">
      <AudioVisualizer
        trackRef={micTrack}
        className="w-full h-24 text-purple-500"
        barWidth={5}
        gap={3}
      />
    </div>
  );
}
