"use client";

import React, { useState, useEffect } from "react";

export const AnnouncementBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("ventureai_banner_dismissed");
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem("ventureai_banner_dismissed", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="h-10 bg-[#4361EE] text-white text-[13px] font-medium flex items-center justify-between px-4 sm:px-6 transition-all duration-300 relative z-50">
      <div className="flex-1 text-center truncate pr-8">
        <span>🚀 New: Batch evaluation mode now live — analyze up to 50 pitch decks simultaneously.</span>
        <a href="#features" className="ml-2 font-semibold underline underline-offset-2 hover:text-[#EEF2FF] transition-colors">
          Learn more →
        </a>
      </div>
      <button
        onClick={handleDismiss}
        className="text-white/80 hover:text-white p-1 rounded focus:outline-none shrink-0"
        aria-label="Dismiss announcement"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};
