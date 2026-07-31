import React from "react";
import { SectionHeader } from "../ui/SectionHeader";

export const TrustSection: React.FC = () => {
  const badges = [
    {
      text: "SOC 2 Compliant",
      icon: (
        <svg className="w-4 h-4 text-[#FE9638]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      text: "Data Encrypted at Rest",
      icon: (
        <svg className="w-4 h-4 text-[#FE9638]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
    },
    {
      text: "Supabase PostgreSQL",
      icon: (
        <svg className="w-4 h-4 text-[#FE9638]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      ),
    },
    {
      text: "Row-Level Security",
      icon: (
        <svg className="w-4 h-4 text-[#FE9638]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
        </svg>
      ),
    },
    {
      text: "No Training on Your Data",
      icon: (
        <svg className="w-4 h-4 text-[#FE9638]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
      ),
    },
  ];

  const points = [
    "Pitch decks are never stored longer than your session requires",
    "All agent outputs are scoped to your authenticated workspace",
    "LLM providers receive only text chunks — no file metadata",
  ];

  return (
    <section id="security" className="bg-transparent py-20 border-t border-[rgba(255,255,255,0.08)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="ENTERPRISE SECURITY"
          headline="Built for confidential deal flow"
          subheadline="Every pitch deck processed with enterprise-grade security."
          centered={true}
        />

        {/* 5 Trust Badges in a row */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 mb-12 mt-8">
          {badges.map((b, idx) => (
            <div
              key={idx}
              className="bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-full px-5 py-2.5 flex items-center gap-2 text-sm font-medium text-[#FAFAFA] transition-all duration-150 hover:border-[#FE9638]/60 hover:shadow-[0_4px_12px_rgba(254,150,56,0.12)] cursor-default"
            >
              {b.icon}
              <span>{b.text}</span>
            </div>
          ))}
        </div>

        {/* 3 Trust copy points */}
        <div className="max-w-2xl mx-auto space-y-3">
          {points.map((pt, idx) => (
            <div key={idx} className="flex items-center gap-3 text-base text-[#B5B5B5] bg-[#141414] p-4 rounded-xl border border-[rgba(255,255,255,0.06)] shadow-sm">
              <span className="text-[#FE9638] font-bold text-lg leading-none">→</span>
              <span>{pt}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
