import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const hasCalledAPI = useRef(false); // Prevents double-calling in React Strict Mode

  useEffect(() => {
    const handleCallback = async () => {
      // 1. Extract the code from Google's redirect URL
      const code = searchParams.get("code");

      if (!code) {
        setError("Authorization code missing.");
        return;
      }

      if (hasCalledAPI.current) return;
      hasCalledAPI.current = true;

      try {
        // 2. Exchange the code with YOUR backend
        const response = await fetch(`http://localhost:8000/auth/callback?code=${code}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // CRITICAL: Allows backend to set HttpOnly cookies
        });

        const data = await response.json();

        if (response.ok) {
          // 3. Save user data returned by 'authenticate_google_user'
          localStorage.setItem("userName", data.username);
          localStorage.setItem("userEmail", data.email);
          if (data.img) localStorage.setItem("userImg", data.img);

          // 4. Redirect to protected area
          navigate("/dashboard");
        } else {
          throw new Error(data.detail || "Authentication failed");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
      <div className="max-w-sm w-full text-center space-y-6">
        {!error ? (
          <>
            <div className="relative flex justify-center">
              <div className="absolute inset-0 bg-purple-500/20 blur-2xl rounded-full" />
              <Loader2 className="size-12 text-purple-600 dark:text-purple-400 animate-spin relative" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Authenticating</h2>
              <p className="text-slate-500 dark:text-slate-400">Please wait while we secure your session...</p>
            </div>
          </>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 p-6 rounded-2xl">
              <AlertCircle className="size-10 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-red-900 dark:text-red-400 mb-2">Login Failed</h3>
              <p className="text-red-700 dark:text-red-500/80 text-sm mb-6">{error}</p>
              <button 
                onClick={() => navigate("/login")}
                className="w-full bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white py-3 rounded-xl font-bold hover:opacity-90 transition-all"
              >
                Back to Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}