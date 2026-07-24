"use client";

import React from "react";

export const AnnouncementBar: React.FC = () => {
  return (
    <div
      className="relative w-full overflow-hidden bg-[#0A0A0A] border-b border-[rgba(255,255,255,0.08)] py-2.5 px-4 z-50 flex items-center justify-center min-h-[40px]"
      style={{
        backgroundImage: "radial-gradient(ellipse 600px 60px at 50% 0%, rgba(254,150,56,0.15), transparent)",
      }}
    >
      <div className="flex items-center justify-center text-center gap-2 text-[13px] md:text-[14px] font-semibold text-[#FAFAFA]">
        <span className="text-[#FEAE4C] flex items-center justify-center">⚡</span>
        <span>
          Maximize your fundraising budget, Get 25% OFF our annual plan.
        </span>
        <a
          href="#pricing"
          className="ml-1 text-[#FAFAFA] underline decoration-[#FE9638] underline-offset-4 hover:text-[#FE9638] transition-colors duration-150 font-semibold"
        >
          Get Pro Access
        </a>
      </div>
    </div>
  );
};
