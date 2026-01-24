import { useEffect } from 'react';

export function useSilentRefresh() {
  useEffect(() => {
    const refreshInterval = setInterval(async () => {
      try {
        await fetch("http://127.0.0.1:8000/auth/refresh", {
          method: "POST",
          credentials: "include", // Sends the refresh_token cookie
        });
        console.log("Session extended");
      } catch (err) {
        console.error("Session expired, please login again");
      }
    }, 1000 * 60 * 15); // Refresh every 15 minutes

    return () => clearInterval(refreshInterval);
  }, []);
}