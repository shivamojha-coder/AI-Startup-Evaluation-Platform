import React, { useEffect, useState } from "react";

export const AuthCallback: React.FC = () => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");
    const errorDescription = params.get("error_description");

    if (error) {
      setErrorMsg(errorDescription || error);
      return;
    }

    const code = params.get("code");
    if (!code) {
      setErrorMsg("No authentication code found in URL.");
      return;
    }

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
    // Forward the user to the backend to complete the OAuth PKCE flow and set cookies.
    window.location.href = `${API_BASE_URL}/auth/callback${window.location.search}&redirect_url=${encodeURIComponent(window.location.origin)}`;
  }, []);
  
  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center text-[#FAFAFA] font-sans selection:bg-[rgba(254,150,56,0.2)] selection:text-[#FE9638]">
      {errorMsg ? (
        <div className="text-red-500 bg-red-500/10 p-6 rounded-xl border border-red-500/20 max-w-md text-center">
          <h3 className="font-bold mb-2 text-lg">Authentication Error</h3>
          <p className="text-sm opacity-90">{errorMsg}</p>
          <a href="/" className="mt-6 inline-block text-[#FE9638] hover:underline text-sm font-medium">Return Home</a>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-8 w-8 text-[#FE9638]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <div className="text-sm tracking-wide">Authenticating...</div>
        </div>
      )}
    </div>
  );
};

