"use client";

import React from "react";
import { SectionHeader } from "../ui/SectionHeader";
import { ScrollReveal } from "../ui/ScrollReveal";

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      badge: "01",
      title: "Upload Pitch Deck",
      body: "Drop any PDF. Our pipeline extracts, cleans, and chunks the text automatically.",
      icon: (
        <svg className="w-7 h-7 text-[#FE9638]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
    },
    {
      badge: "02",
      title: "Pipeline Activates",
      body: "Text is preprocessed through our extraction → cleaning → chunking engine.",
      icon: (
        <svg className="w-7 h-7 text-[#FE9638]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      ),
    },
    {
      badge: "03",
      title: "5 Agents Run in Parallel",
      body: "Summary · Risk · Questions · Scoring · Report Generator — all run simultaneously via LangChain.",
      icon: (
        <svg className="w-7 h-7 text-[#FE9638]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
        </svg>
      ),
      isFork: true,
    },
    {
      badge: "04",
      title: "Investor Report Delivered",
      body: "Structured JSON report lands in Supabase, rendered immediately on your dashboard.",
      icon: (
        <svg className="w-7 h-7 text-[#34D399]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="bg-[#0A0A0A] py-24 border-t border-[rgba(255,255,255,0.08)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="THE PROCESS"
          headline="From PDF to Investor Report in 4 Steps"
          subheadline="LangChain orchestrates five specialized agents working in parallel."
          centered={true}
        />

        {/* 4-Step Horizontal Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative mt-12">
          {steps.map((step, idx) => (
            <ScrollReveal key={idx} animation="fade-up" delay={idx * 150} className="h-full">
              <div className="relative group h-full">
                <div className="bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 h-full flex flex-col justify-between transition-all duration-300 hover:shadow-[0_16px_36px_rgba(254,150,56,0.15)] hover:-translate-y-2 hover:border-[#FE9638]/60">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-3 rounded-xl bg-[#1C1C1C] border border-[rgba(255,255,255,0.06)] group-hover:bg-[rgba(254,150,56,0.12)] group-hover:scale-110 transition-all duration-300">
                        {step.icon}
                      </div>
                      <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-full bg-[rgba(254,150,56,0.12)] text-[#FE9638] border border-[#FE9638]/20 group-hover:bg-[#FE9638] group-hover:text-[#0A0A0A] transition-colors duration-300">
                        {step.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-[#FAFAFA] mb-3 group-hover:text-[#FE9638] transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-sm text-[#B5B5B5] leading-relaxed">
                      {step.body}
                    </p>
                  </div>

                  {step.isFork && (
                    <div className="mt-6 pt-4 border-t border-[rgba(255,255,255,0.08)] flex items-center justify-between text-[11px] font-semibold text-[#FE9638]">
                      <span>Parallel Execution</span>
                      <span className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#FE9638] animate-pulse" />
                        <span className="w-2 h-2 rounded-full bg-[#FBBF24] animate-pulse [animation-delay:200ms]" />
                        <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse [animation-delay:400ms]" />
                      </span>
                    </div>
                  )}
                </div>

                {/* Arrow Connector between cards on desktop */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10 text-[#FE9638]/40 font-bold text-xl group-hover:translate-x-1 transition-transform">
                    →
                  </div>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
