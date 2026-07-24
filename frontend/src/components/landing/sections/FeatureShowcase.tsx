"use client";

import React, { useState, useEffect } from "react";
import { SectionHeader } from "../ui/SectionHeader";

export const FeatureShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash === "summary-agent" || hash === "summary") {
        setActiveTab(0);
      } else if (hash === "risk-analyzer" || hash === "risk") {
        setActiveTab(1);
      } else if (hash === "question-engine" || hash === "questions") {
        setActiveTab(2);
      } else if (hash === "scoring-model" || hash === "scoring") {
        setActiveTab(3);
      } else if (hash === "report-generator" || hash === "report") {
        setActiveTab(4);
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const tabs = [
    { label: "Summary Agent", id: "summary" },
    { label: "Risk Analysis", id: "risk" },
    { label: "Question Engine", id: "questions" },
    { label: "Scoring Model", id: "scoring" },
    { label: "Report Generator", id: "report" },
  ];

  const tabContents = [
    {
      // TAB 1 CONTENT — Summary Agent
      heading: "Executive Summary, Automatically",
      bullets: [
        "Extracts: Problem, Solution, Target Market, Business Model, Traction",
        "120–200 word neutral analyst summary, zero hallucinations",
        "Output in structured JSON — plugs directly into your CRM",
      ],
      codePreview: `{
  "problem": "Investors spend 6–10h/deck on manual review...",
  "solution": "Multi-agent AI pipeline for automated due diligence",
  "traction": "4 VC funds, 2 incubators, 85 decks processed",
  "executive_summary": "VentureAI automates VC due diligence..."
}`,
    },
    {
      // TAB 2 CONTENT — Risk Analysis
      heading: "7-Category Risk Map",
      bullets: [
        "Market · Product · Technology · Team · Financial · Competition · Regulatory",
        "Each risk rated: LOW / MEDIUM / HIGH with max 35-word description",
        "Absence of information is itself surfaced as a risk",
      ],
      customContent: (
        <div className="space-y-3 mt-6">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#1C1C1C] border border-[rgba(255,255,255,0.08)]">
            <span className="font-semibold text-sm text-[#FAFAFA]">Market Opportunity</span>
            <span className="px-2.5 py-1 rounded text-xs font-bold bg-[rgba(251,191,36,0.12)] text-[#FBBF24] border border-[#FBBF24]/30">MEDIUM RISK</span>
          </div>
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#1C1C1C] border border-[rgba(255,255,255,0.08)]">
            <span className="font-semibold text-sm text-[#FAFAFA]">Team Execution & Completeness</span>
            <span className="px-2.5 py-1 rounded text-xs font-bold bg-[rgba(248,113,113,0.12)] text-[#F87171] border border-[#F87171]/30">HIGH RISK</span>
          </div>
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#1C1C1C] border border-[rgba(255,255,255,0.08)]">
            <span className="font-semibold text-sm text-[#FAFAFA]">Proprietary Technology Defensibility</span>
            <span className="px-2.5 py-1 rounded text-xs font-bold bg-[rgba(52,211,153,0.12)] text-[#34D399] border border-[#34D399]/30">LOW RISK</span>
          </div>
        </div>
      ),
    },
    {
      // TAB 3 CONTENT — Question Engine
      heading: "24 Sharp Due Diligence Questions",
      bullets: [
        "Questions across: Product · Market · Financial · Team · Growth · Investment Readiness",
        "Tailored to gaps and ambiguities in each specific deck — never generic",
        "Phrased for a real VC partner meeting",
      ],
      codePreview: `[
  {
    "category": "Financial",
    "question": "What assumptions drive the 4x CAC payback acceleration in Q3 2026?"
  },
  {
    "category": "Team",
    "question": "Given no full-time CTO, who currently owns IP architecture and security compliance?"
  }
]`,
    },
    {
      // TAB 4 CONTENT — Scoring Model
      heading: "Weighted Score: 1 to 100",
      bullets: [
        "Scoring: Market Opportunity (20%) · Traction (20%) · Business Model (15%) · etc.",
        "Every score backed by evidence-based reasoning from the deck",
        "Conservative scoring when data is absent — no guess-work",
      ],
      customContent: (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-around p-6 bg-[#1C1C1C] rounded-2xl border border-[rgba(255,255,255,0.08)] gap-6">
          <div className="relative w-28 h-28 rounded-full flex items-center justify-center border-4 border-[#FE9638] bg-[rgba(254,150,56,0.12)] shrink-0">
            <span className="text-3xl font-black text-[#FE9638]">74</span>
          </div>
          <div className="space-y-3 text-sm w-full sm:w-auto">
            <div className="flex justify-between gap-8 border-b border-[rgba(255,255,255,0.04)] pb-1.5"><span className="text-[#9A9A9A]">Market Opportunity (20%)</span><span className="font-bold text-[#FAFAFA]">82/100</span></div>
            <div className="flex justify-between gap-8 border-b border-[rgba(255,255,255,0.04)] pb-1.5"><span className="text-[#9A9A9A]">Traction & Growth (20%)</span><span className="font-bold text-[#FAFAFA]">78/100</span></div>
            <div className="flex justify-between gap-8"><span className="text-[#9A9A9A]">Team Experience (15%)</span><span className="font-bold text-[#F87171]">58/100</span></div>
          </div>
        </div>
      ),
    },
    {
      // TAB 5 CONTENT — Report Generator
      heading: "Investment Recommendation",
      bullets: [
        "Final verdict: Strong Recommend · Recommend with Conditions · Further Diligence · Not Recommended",
        "Logic-locked: 2+ high-severity risks → never 'Strong Recommend'",
        "60-word justification referencing score + specific risks or strengths",
      ],
      customContent: (
        <div className="mt-6 p-6 bg-[#1C1C1C] rounded-2xl border border-[rgba(255,255,255,0.08)]">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-semibold text-[#9A9A9A] uppercase">Verdict Chip:</span>
            <span className="px-3.5 py-1.5 rounded-full text-sm font-bold bg-[rgba(251,191,36,0.12)] text-[#FBBF24] border border-[#FBBF24]/30">
              Recommend with Conditions
            </span>
          </div>
          <p className="text-sm text-[#B5B5B5] italic leading-relaxed">
            &ldquo;Nexus AI Studio demonstrates strong market momentum and product-market fit with an 82/100 opportunity score. However, conditional recommendation is advised due to a high-severity team risk regarding the vacant technical leadership role.&rdquo;
          </p>
        </div>
      ),
    },
  ];

  return (
    <section id="features" className="bg-[#0A0A0A] py-24 border-t border-[rgba(255,255,255,0.08)] relative">
      {/* Anchors for direct navbar dropdown navigation */}
      <div id="summary-agent" className="absolute -top-24" />
      <div id="risk-analyzer" className="absolute -top-24" />
      <div id="question-engine" className="absolute -top-24" />
      <div id="scoring-model" className="absolute -top-24" />
      <div id="report-generator" className="absolute -top-24" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="THE PLATFORM"
          headline="Five agents. One complete evaluation."
          subheadline="Each agent specializes in a distinct phase of due diligence, communicating via LangChain."
          centered={false}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-12">
          {/* LEFT COLUMN: Tabs / Pills */}
          <div className="lg:col-span-4 flex flex-col gap-2.5">
            {tabs.map((tab, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`w-full text-left px-6 py-4 rounded-[12px] font-semibold text-base transition-all duration-200 flex items-center justify-between cursor-pointer ${
                  activeTab === idx
                    ? "bg-[#FE9638] text-[#0A0A0A] shadow-lg shadow-[#FE9638]/20 scale-[1.02]"
                    : "bg-transparent text-[#9A9A9A] hover:bg-[#141414] hover:text-[#FAFAFA]"
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-sm ${activeTab === idx ? "text-[#0A0A0A]" : "text-[#666666]"}`}>→</span>
              </button>
            ))}
          </div>

          {/* RIGHT COLUMN: Content Panel */}
          <div className="lg:col-span-8 bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 md:p-10 shadow-lg min-h-[420px] flex flex-col justify-between">
            <div>
              <h3 className="text-2xl md:text-[28px] font-bold text-[#FAFAFA] mb-6">
                {tabContents[activeTab].heading}
              </h3>

              <ul className="space-y-4 mb-8">
                {tabContents[activeTab].bullets.map((bullet, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-3 text-base text-[#B5B5B5]">
                    <span className="text-[#FE9638] font-bold shrink-0 mt-0.5">→</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Code / Output Preview Block */}
            {tabContents[activeTab].codePreview ? (
              <div className="bg-[#1C1C1C] border border-[rgba(255,255,255,0.08)] rounded-xl p-5 overflow-x-auto">
                <div className="flex items-center gap-2 mb-3 border-b border-[rgba(255,255,255,0.06)] pb-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#F87171]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FBBF24]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#34D399]" />
                  <span className="ml-2 text-[11px] font-mono text-[#9A9A9A] uppercase tracking-wider">Structured JSON Output</span>
                </div>
                <pre className="font-mono text-xs md:text-sm text-[#FAFAFA] leading-relaxed whitespace-pre">
                  {tabContents[activeTab].codePreview}
                </pre>
              </div>
            ) : (
              tabContents[activeTab].customContent
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
