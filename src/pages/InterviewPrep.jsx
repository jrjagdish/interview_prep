"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  MicOff,
  Loader2,
  Sparkles,
  BrainCircuit,
  Waves,
  XCircle,
  AlertCircle,
  MessageSquareText,
} from "lucide-react";

// --- Helper function to downsample microphone audio ---
const downsampleBuffer = (buffer, sampleRate, exportSampleRate) => {
  if (exportSampleRate === sampleRate) {
    return buffer;
  }
  const sampleRateRatio = sampleRate / exportSampleRate;
  const newLength = Math.round(buffer.length / sampleRateRatio);
  const result = new Int16Array(newLength);
  let offsetResult = 0;
  let offsetBuffer = 0;
  while (offsetResult < result.length) {
    const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
    let accum = 0,
      count = 0;
    for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
      accum += buffer[i];
      count++;
    }
    // PCM 16-bit conversion
    result[offsetResult] = Math.max(-1, Math.min(1, accum / count)) * 0x7fff;
    offsetResult++;
    offsetBuffer = nextOffsetBuffer;
  }
  return result;
};

// Helper to format logs
const formatLog = (message) =>
  `[${new Date().toLocaleTimeString()}] ${message}`;

export default function InterviewPage() {
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isRecording, setIsRecording] = useState(false);

  // Refs for Web Audio API and WebSocket
  const ws = useRef(null);
  const inputAudioContext = useRef(null); // Context for mic input
  const processor = useRef(null);
  const inputDevice = useRef(null);

  // --- FIX: Refs for Output Audio Queueing ---
  const outputAudioContext = useRef(null);
  const audioQueue = useRef([]);
  const isPlaying = useRef(false);

  const addLog = (message) => {
    setLogs((prev) => [formatLog(message), ...prev].slice(0, 5)); // Keep last 5 logs
  };

  const startInterview = async () => {
    setLoading(true);
    setError(null);
    setLogs([]);
    addLog("Initializing session...");

    try {
      // 1. Backend: Start Session
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
        throw new Error("Failed to initialize session");
      }

      const data = await response.json();
      setSessionData(data);
      addLog(`Session started: ${data.session_id}`);

      // 2. Setup WebSocket for audio streaming
      setupWebSocket(data.session_id);
    } catch (error) {
      console.error("Connection Error:", error);
      setError(error.message);
      addLog(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const setupWebSocket = (sessionId) => {
    addLog("Connecting to voice server...");

    // Connect to your new websocket endpoint
    const wsUrl = `ws://localhost:8000/ws/interview/${sessionId}`;
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      addLog("Voice server connected.");
      startRecording();
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleBackendEvent(data);
    };

    ws.current.onerror = (e) => {
      console.error("WS Error:", e);
      addLog("WebSocket Error occurred.");
      setError("Voice connection lost.");
    };

    ws.current.onclose = () => {
      addLog("Voice server disconnected.");
      stopRecording();
    };
  };

  const handleBackendEvent = (data) => {
    switch (data.type) {
      case "stt_chunk":
        // Real-time transcript display
        break;
      case "stt_output":
        addLog(`You: ${data.transcript}`);
        break;
      case "agent_chunk":
        // LLM streaming text
        break;
      case "tts_chunk":
        // Play audio received from AI
        playAudioChunk(data.audio);
        break;
      case "agent_end":
        addLog("AI finished speaking.");
        break;
      default:
        break;
    }
  };

  // --- PLAYBACK QUEUEING LOGIC ---
  const playNextInQueue = () => {
    if (
      isPlaying.current ||
      audioQueue.current.length === 0 ||
      !outputAudioContext.current
    ) {
      return;
    }

    isPlaying.current = true;
    const buffer = audioQueue.current.shift();

    const source = outputAudioContext.current.createBufferSource();
    source.buffer = buffer;
    source.connect(outputAudioContext.current.destination);

    // When this chunk ends, play the next one
    source.onended = () => {
      isPlaying.current = false;
      playNextInQueue();
    };

    source.start(0);
  };

  const playAudioChunk = (base64Audio) => {
    // 1. Decode base64 to binary
    const binaryString = window.atob(base64Audio);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // 2. Convert binary to Float32Array (required by Web Audio API)
    const float32Array = new Float32Array(bytes.length / 2);
    const dataView = new DataView(bytes.buffer);
    for (let i = 0; i < bytes.length / 2; i++) {
      // Int16le to Float32 (-1 to 1)
      float32Array[i] = dataView.getInt16(i * 2, true) / 32768;
    }

    // 3. --- FIX: Initialize Output AudioContext with 24000Hz (MATCH BACKEND) ---
    if (!outputAudioContext.current) {
      outputAudioContext.current = new AudioContext({ sampleRate: 24000 });
    }

    const buffer = outputAudioContext.current.createBuffer(
      1,
      float32Array.length,
      24000,
    );
    buffer.copyToChannel(float32Array, 0);

    // 4. --- FIX: Add to Queue to prevent overlapping/chopping ---
    audioQueue.current.push(buffer);
    playNextInQueue();
  };
  // --------------------------------

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Create context for mic input
      inputAudioContext.current = new AudioContext();
      const sourceRate = inputAudioContext.current.sampleRate;
      inputDevice.current =
        inputAudioContext.current.createMediaStreamSource(stream);

      // Process audio in 4096 sample chunks
      processor.current = inputAudioContext.current.createScriptProcessor(
        4096,
        1,
        1,
      );

      inputDevice.current.connect(processor.current);
      processor.current.connect(inputAudioContext.current.destination);

      processor.current.onaudioprocess = (e) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
          const inputData = e.inputBuffer.getChannelData(0);

          // Downsample to 16kHz for STT
          const pcmData = downsampleBuffer(inputData, sourceRate, 16000);
          ws.current.send(pcmData.buffer);
        }
      };

      setIsRecording(true);
      addLog("Microphone active.");
    } catch (err) {
      console.error("Audio Error:", err);
      addLog("Microphone access denied.");
    }
  };

  const stopRecording = useCallback(() => {
    // Stop Input
    if (processor.current) processor.current.disconnect();
    if (inputDevice.current) inputDevice.current.disconnect();
    if (inputAudioContext.current) inputAudioContext.current.close();
    inputAudioContext.current = null;

    // Stop Output
    if (outputAudioContext.current) outputAudioContext.current.close();
    outputAudioContext.current = null;
    audioQueue.current = [];
    isPlaying.current = false;

    // Stop Socket
    if (ws.current) ws.current.close();

    setIsRecording(false);
    setSessionData(null);
    addLog("Session ended.");
    if (currentSessionId) {
      setTimeout(() => {
        navigate(`/review/${currentSessionId}`);
      }, 800);
    }
  }, [sessionData, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05080a] text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden transition-colors duration-500">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] size-[300px] md:size-[600px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] size-[250px] md:size-[500px] bg-fuchsia-600/10 blur-[100px] rounded-full pointer-events-none" />

      {!sessionData ? (
        // --- PRE-INTERVIEW LOBBY ---
        <div className="max-w-md w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-10 shadow-2xl text-center relative z-10">
          <div className="bg-gradient-to-tr from-purple-600 to-fuchsia-500 w-16 h-16 md:w-20 md:h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-lg shadow-purple-500/20 rotate-3">
            <BrainCircuit className="text-white w-8 h-8 md:w-10 md:h-10 -rotate-3" />
          </div>

          <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-3">
            Technical Check
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6 md:mb-8 leading-relaxed text-sm md:text-base">
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
        <div className="flex-1 w-full max-w-5xl flex flex-col relative z-10 min-h-[500px]">
          <div className="flex-1 flex flex-col items-center justify-center space-y-8 md:space-y-12 p-4">
            {/* Session Status Header */}
            <div className="text-center space-y-2 md:space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 bg-purple-500/10 dark:bg-purple-500/20 border border-purple-500/20 text-purple-600 dark:text-purple-400 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.1em] md:tracking-[0.2em]">
                <div className="size-2 bg-purple-500 rounded-full animate-ping" />
                Live Analysis In Progress
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Fullstack Developer Simulation
              </h2>
            </div>

            {/* AI Status Indicator */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex gap-1.5">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="size-2 bg-purple-500 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
              <p className="text-purple-600 dark:text-purple-400 font-bold text-xs md:text-sm uppercase tracking-widest">
                {isRecording ? "AI Interviewer Listening" : "Connecting..."}
              </p>
            </div>

            {/* UX Friendly Logs Panel */}
            <div className="w-full max-w-md bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-lg backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-3 text-slate-500 dark:text-slate-400">
                <MessageSquareText size={16} />
                <h3 className="font-bold text-xs uppercase tracking-wider">
                  Session Log
                </h3>
              </div>
              <div className="space-y-1.5 text-xs font-mono text-slate-700 dark:text-slate-300 h-24 overflow-y-auto">
                {logs.length === 0 && (
                  <p className="text-slate-400">Waiting for events...</p>
                )}
                {logs.map((log, i) => (
                  <p
                    key={i}
                    className={log.includes("Error") ? "text-red-500" : ""}
                  >
                    {log}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="pb-6 md:pb-10 flex justify-center">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-3 md:p-4 rounded-[2rem] shadow-2xl flex items-center gap-4 md:gap-6">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                <div
                  className={`size-3 rounded-full ${isRecording ? "bg-green-500" : "bg-red-500"}`}
                />
                {isRecording ? "Live" : "Disconnected"}
              </div>

              <div className="w-px h-8 bg-slate-200 dark:bg-slate-800" />

              <button
                onClick={stopRecording}
                className="flex items-center gap-2 px-4 md:px-5 py-2.5 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-xl font-bold text-sm hover:bg-red-100 transition-all active:scale-95"
              >
                <XCircle size={18} />
                End Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
