import React from "react";

export interface AgentNodeProps {
  title: string;
  category: string;
  colorGradient?: string;
  icon?: React.ReactNode;
  active?: boolean;
}

export const AgentNode: React.FC<AgentNodeProps> = ({
  title,
  category,
  colorGradient = "linear-gradient(135deg, #FE9638 0%, #E2A56B 100%)",
  icon,
  active = false,
}) => {
  return (
    <div
      className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-300 bg-[#141414] ${
        active
          ? "border-[#FE9638] shadow-[0_4px_16px_rgba(254,150,56,0.15)] scale-105"
          : "border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.16)]"
      }`}
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center text-[#0A0A0A] shrink-0 shadow-sm"
        style={{ background: colorGradient }}
      >
        {icon || (
          <svg className="w-5 h-5 text-[#0A0A0A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )}
      </div>
      <div>
        <div className="text-[11px] font-semibold tracking-wider text-[#9A9A9A] uppercase">
          {category}
        </div>
        <div className="text-sm font-semibold text-[#FAFAFA] leading-tight">
          {title}
        </div>
      </div>
    </div>
  );
};
