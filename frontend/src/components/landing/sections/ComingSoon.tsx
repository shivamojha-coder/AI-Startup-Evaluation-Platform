"use client";

import React from "react";
import { SectionHeader } from "../ui/SectionHeader";
import { ScrollReveal } from "../ui/ScrollReveal";

export const ComingSoon: React.FC = () => {
  const agents = [
    {
      title: "Competitive Landscape Agent",
      description: "Deep web scraping to map hidden direct and indirect competitors before VC meetings.",
      icon: (
        <svg className="w-6 h-6 text-[#FE9638]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      title: "Term Sheet Benchmarker",
      description: "Compare proposed terms against 5,000+ anonymized recent seed/Series A deals.",
      icon: (
        <svg className="w-6 h-6 text-[#FE9638]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      title: "Founder Reference Checker",
      description: "Automated professional graph mapping and reference sentiment synthesis.",
      icon: (
        <svg className="w-6 h-6 text-[#FE9638]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="bg-transparent py-24 border-t border-[rgba(255,255,255,0.08)] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          eyebrow="ROADMAP"
          headline="The VentureAI Agent Ecosystem is Expanding"
          subheadline="More autonomous agents launching Q3 2026 to cover the entire venture lifecycle."
          centered={true}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {agents.map((agent, idx) => (
            <ScrollReveal key={idx} animation="fade-up" delay={idx * 150} className="h-full">
              <div className="bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 h-full flex flex-col justify-between transition-all duration-300 hover:shadow-[0_16px_40px_rgba(254,150,56,0.12)] hover:-translate-y-1.5 hover:border-[#FE9638]/50 group relative">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[rgba(254,150,56,0.12)] border border-[#FE9638]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {agent.icon}
                    </div>
                    <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-[rgba(254,150,56,0.12)] text-[#FE9638] border border-[rgba(254,150,56,0.2)]">
                      Q3 2026
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#FAFAFA] mb-3 group-hover:text-[#FE9638] transition-colors">
                    {agent.title}
                  </h3>
                  <p className="text-sm text-[#B5B5B5] leading-relaxed">
                    {agent.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-[rgba(255,255,255,0.06)] flex items-center text-xs font-medium text-[#9A9A9A]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#FE9638] animate-ping" />
                    In active model training
                  </span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
