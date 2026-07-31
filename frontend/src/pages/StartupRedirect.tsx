import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getStartups } from "../api/startups";

export const StartupRedirect: React.FC<{ toUpload?: boolean }> = ({ toUpload }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndRedirect = async () => {
      try {
        const startups = await getStartups();
        const urlParams = new URLSearchParams(location.search);
        const action = urlParams.get('action');

        if (startups.length === 0) {
          // If no startups, prompt to create one
          navigate("/founder/startups/new");
        } else {
          // Use saved startup from localStorage, or fall back to the first one
          const savedId = localStorage.getItem("ventureai_selected_startup");
          const targetStartup = (savedId && startups.find(s => s.id === savedId))
            ? savedId
            : startups[0].id;

          if (action === 'documents') {
            navigate(`/founder/startups/${targetStartup}/documents`);
          } else if (action === 'report') {
            navigate(`/founder/startups/${targetStartup}/report`);
          } else {
            navigate(`/founder/startups/${targetStartup}`);
          }
        }
      } catch (err: any) {
        setError(err.message || "Failed to load startups");
      }
    };
    
    fetchAndRedirect();
  }, [navigate, toUpload, location.search]);

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center bg-transparent p-8 text-center text-[#F87171] min-h-screen">
        <p className="font-bold text-sm bg-[rgba(248,113,113,0.12)] px-4 py-3 rounded-xl border border-[#F87171]/30">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-transparent min-h-screen">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FE9638] border-t-transparent"></div>
    </div>
  );
};
