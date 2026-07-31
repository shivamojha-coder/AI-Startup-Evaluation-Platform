"use client";

import React, { useState } from "react";
import { Button } from "../ui/Button";

export const ProductPillars: React.FC = () => {
  const [activeSlideTab, setActiveSlideTab] = useState<number>(0);

  const slideTabs = [
    {
      id: "slide-4",
      title: "Slide 4: Financials & Unit Economics",
      score: "68/100",
      status: "Review Required",
      statusColor: "text-[#F87171] bg-[#F87171]/10 border-[#F87171]/30",
      critique: "CAC Payback calculation assumes zero customer churn in Q1-Q3. Tier-1 VC partners will challenge this immediately during diligence.",
      rewrite: "Show conservative 5% monthly churn scenario alongside base 12-month payback model, highlighting net retention expansion.",
      agent: "Financial Audit Agent",
    },
    {
      id: "slide-3",
      title: "Slide 3: Problem & Market Sizing",
      score: "94/100",
      status: "Exceptional Fit",
      statusColor: "text-[#34D399] bg-[#34D399]/10 border-[#34D399]/30",
      critique: "TAM calculation uses rigorous bottoms-up customer segment sizing aligned with 2026 enterprise software spend benchmarks.",
      rewrite: "No structural changes needed. Consider moving the $48B SAM chart slightly higher up to grab immediate visual focus.",
      agent: "Market Intelligence Agent",
    },
    {
      id: "slide-7",
      title: "Slide 7: Go-To-Market & Traction",
      score: "85/100",
      status: "Strong Potential",
      statusColor: "text-[#FBBF24] bg-[#FBBF24]/10 border-[#FBBF24]/30",
      critique: "Organic inbound velocity is impressive (42% MoM), but outbound enterprise sales cycle duration is omitted.",
      rewrite: "Add a 3-stage enterprise sales pipeline metric box showing average deal closing velocity (currently ~45 days).",
      agent: "Growth & Traction Agent",
    },
  ];

  const currentSlide = slideTabs[activeSlideTab];

  return (
    <section id="investor-matching" className="bg-transparent py-24 border-t border-[rgba(255,255,255,0.08)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-36">
        {/* BLOCK 1 — Investor Matching */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="text-[12px] font-semibold text-[#FE9638] uppercase tracking-widest">
              INVESTOR MATCHING
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[36px] font-bold text-[#FAFAFA] leading-[1.2] max-w-[480px]">
              Smarter Investor Matching, Powered by AI.
            </h2>
            <p className="text-base sm:text-[18px] text-[#B5B5B5] leading-[1.6] max-w-[520px]">
              Get instantly connected with the right investors for your stage, sector, and growth. Our AI cross-references your pitch deck against 180+ active VC mandates and angel portfolios.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#signup"
                className="group relative inline-flex flex-col items-center justify-center py-2.5 px-3 text-[#FAFAFA] hover:text-white font-semibold text-base transition-all"
              >
                <span>Get started →</span>
                <span className="mt-1 h-[2px] w-3/5 bg-[#FE9638] rounded-full group-hover:w-full transition-all" />
              </a>
              <Button variant="secondary" size="sm" className="!h-11 !px-5 !text-sm">
                Learn more
              </Button>
            </div>
          </div>

          {/* Visual (right side): 3 overlapping investor-match cards */}
          <div className="lg:col-span-6 relative">
            <div className="relative space-y-4 max-w-lg mx-auto lg:ml-auto">
              {/* Card 1 */}
              <div className="bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-2xl p-5 shadow-[0_16px_40px_rgba(0,0,0,0.5)] hover:border-[rgba(255,255,255,0.16)] transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center font-bold text-white text-sm">
                      SC
                    </div>
                    <div>
                      <div className="font-bold text-[#FAFAFA] text-base">Sequoia Catalyst Fund</div>
                      <div className="text-xs text-[#9A9A9A]">Seed · AI / Enterprise · Check: $1M–$3M</div>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[rgba(52,211,153,0.12)] text-[#34D399] border border-[#34D399]/30">
                    96% FIT
                  </span>
                </div>
                <div className="text-xs text-[#B5B5B5] bg-[#1C1C1C] p-3 rounded-xl border border-[rgba(255,255,255,0.04)]">
                  💡 <strong className="text-[#FAFAFA]">Mandate Match:</strong> Actively seeking developer-first AI infrastructure in North America.
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-2xl p-5 shadow-[0_16px_40px_rgba(0,0,0,0.5)] hover:border-[rgba(255,255,255,0.16)] transition-all translate-x-3 sm:translate-x-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center font-bold text-white text-sm">
                      AV
                    </div>
                    <div>
                      <div className="font-bold text-[#FAFAFA] text-base">Apex Ventures</div>
                      <div className="text-xs text-[#9A9A9A]">Pre-Seed / Seed · B2B SaaS · Check: $500K</div>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[rgba(52,211,153,0.12)] text-[#34D399] border border-[#34D399]/30">
                    92% FIT
                  </span>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-2xl p-5 shadow-[0_16px_40px_rgba(0,0,0,0.5)] hover:border-[rgba(255,255,255,0.16)] transition-all translate-x-1 sm:translate-x-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center font-bold text-[#0A0A0A] text-sm">
                      KV
                    </div>
                    <div>
                      <div className="font-bold text-[#FAFAFA] text-base">Khosla Seed Partners</div>
                      <div className="text-xs text-[#9A9A9A]">Deep Tech / AI Automation</div>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[rgba(52,211,153,0.12)] text-[#34D399] border border-[#34D399]/30">
                    89% FIT
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BLOCK 2 — Pitch Deck Analysis (Expanded, High-Impact Interactive Layout) */}
        <div id="pitch-deck-analysis" className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Interactive Slide Diagnostics Console (Left on desktop) */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="bg-[#141414] border border-[rgba(255,255,255,0.1)] rounded-3xl p-6 sm:p-8 shadow-[0_32px_80px_rgba(0,0,0,0.7),0_0_40px_rgba(254,150,56,0.08)] relative overflow-hidden">
              {/* Top ambient glow inside card */}
              <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-gradient-to-bl from-[rgba(254,150,56,0.12)] via-transparent to-transparent pointer-events-none rounded-tr-3xl" />

              {/* Console Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-[rgba(255,255,255,0.08)] relative z-10">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#F87171]" />
                    <div className="w-3 h-3 rounded-full bg-[#FBBF24]" />
                    <div className="w-3 h-3 rounded-full bg-[#34D399]" />
                  </div>
                  <span className="text-xs font-mono font-semibold text-[#9A9A9A] pl-2 border-l border-[rgba(255,255,255,0.1)]">
                    AI Deck Audit · Nexus SaaS Seed Deck.pdf
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#9A9A9A]">Readiness Score:</span>
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-[rgba(254,150,56,0.15)] text-[#FE9638] border border-[#FE9638]/40">
                    78/100 (Top 15%)
                  </span>
                </div>
              </div>

              {/* Interactive Slide Selector Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none relative z-10">
                {slideTabs.map((tab, index) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSlideTab(index)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                      activeSlideTab === index
                        ? "bg-[#FE9638] text-[#0A0A0A] border-[#FE9638] shadow-[0_0_16px_rgba(254,150,56,0.4)]"
                        : "bg-[#1C1C1C] text-[#B5B5B5] border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.2)] hover:text-white"
                    }`}
                  >
                    {tab.title}
                  </button>
                ))}
              </div>

              {/* Active Slide Diagnostic Panel */}
              <div className="bg-[#191919] border border-[rgba(255,255,255,0.08)] rounded-2xl p-5 sm:p-6 space-y-5 relative z-10 transition-all duration-300">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(255,255,255,0.06)] pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-extrabold text-[#FAFAFA]">{currentSlide.title}</span>
                    <span className="text-xs font-medium text-[#9A9A9A]">({currentSlide.agent})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${currentSlide.statusColor}`}>
                      {currentSlide.status}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#FAFAFA] bg-[#141414] px-2 py-0.5 rounded border border-[rgba(255,255,255,0.08)]">
                      {currentSlide.score}
                    </span>
                  </div>
                </div>

                {/* AI Critique & Suggestion Boxes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#141414] p-4 rounded-xl border-l-4 border-[#F87171] space-y-1.5">
                    <div className="text-[11px] font-bold text-[#F87171] uppercase tracking-wider flex items-center gap-1.5">
                      <span>⚠ Investor Diligence Flag</span>
                    </div>
                    <p className="text-xs sm:text-[13px] text-[#D1D1D1] leading-relaxed">
                      {currentSlide.critique}
                    </p>
                  </div>

                  <div className="bg-[#141414] p-4 rounded-xl border-l-4 border-[#34D399] space-y-1.5">
                    <div className="text-[11px] font-bold text-[#34D399] uppercase tracking-wider flex items-center gap-1.5">
                      <span>✦ AI Recommended Fix</span>
                    </div>
                    <p className="text-xs sm:text-[13px] text-[#D1D1D1] leading-relaxed">
                      {currentSlide.rewrite}
                    </p>
                  </div>
                </div>
              </div>

              {/* 4-Dimension Breakdown Footer */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-[rgba(255,255,255,0.08)] relative z-10">
                {[
                  { label: "Market & TAM", val: "94%", color: "bg-[#34D399]" },
                  { label: "Unit Economics", val: "68%", color: "bg-[#FBBF24]" },
                  { label: "Team Strength", val: "88%", color: "bg-[#34D399]" },
                  { label: "Slide Narrative", val: "91%", color: "bg-[#34D399]" },
                ].map((item, idx) => (
                  <div key={idx} className="bg-[#1A1A1A] px-3.5 py-2.5 rounded-xl border border-[rgba(255,255,255,0.05)]">
                    <div className="flex justify-between text-[11px] font-medium text-[#9A9A9A] mb-1.5">
                      <span>{item.label}</span>
                      <span className="font-bold text-[#FAFAFA]">{item.val}</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#141414] rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: item.val }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Content & High-Impact Copy (Right on desktop) */}
          <div className="lg:col-span-5 order-1 lg:order-2 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(254,150,56,0.12)] border border-[#FE9638]/30">
              <span className="w-2 h-2 rounded-full bg-[#FE9638] animate-pulse" />
              <span className="text-[11px] font-bold text-[#FE9638] uppercase tracking-wider">
                MULTI-AGENT DECK AUDIT
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#FAFAFA] leading-[1.15] tracking-tight">
              Pitch Deck Analysis That Sees What Investors See.
            </h2>

            <p className="text-base sm:text-[17px] text-[#B5B5B5] leading-[1.65]">
              Don&apos;t walk into a partner meeting blind. Our five specialized LangChain agents evaluate every single slide across 18 diligence dimensions—flagging logical loopholes, questionable financials, and narrative gaps before a VC does.
            </p>

            {/* Structured Feature Checkpoints */}
            <div className="space-y-4 pt-2">
              {[
                {
                  title: "Slide-by-Slide AI Diagnostics",
                  desc: "Instant line-by-line inspection of claims, TAM methodology, and competitor charts.",
                },
                {
                  title: "Simulated VC Diligence Q&A",
                  desc: "Predicts the exact 10 toughest questions institutional partners will ask during review.",
                },
                {
                  title: "Weighted Readiness Benchmark",
                  desc: "Compare your deck's structural strength against 2,000+ funded seed and Series A decks.",
                },
              ].map((feat, idx) => (
                <div key={idx} className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-lg bg-[rgba(254,150,56,0.15)] border border-[#FE9638]/30 flex items-center justify-center text-[#FE9638] font-bold text-xs mt-0.5 shrink-0">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#FAFAFA]">{feat.title}</h4>
                    <p className="text-xs sm:text-[13px] text-[#9A9A9A] leading-relaxed mt-0.5">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#FE9638] to-[#EA580C] text-[#0A0A0A] font-bold text-sm shadow-[0_0_24px_rgba(254,150,56,0.3)] hover:shadow-[0_0_36px_rgba(254,150,56,0.5)] transition-all active:scale-[0.98]"
              >
                <span>Analyze My Pitch Deck</span>
                <span>→</span>
              </a>
              <Button variant="secondary" size="sm" className="!h-12 !px-6 !text-sm !rounded-xl !border-[rgba(255,255,255,0.12)]">
                View Sample Audit
              </Button>
            </div>
          </div>
        </div>

        {/* Connecting strip below both blocks */}
        <div className="bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 md:p-12 text-center space-y-8">
          <div className="space-y-3">
            <div className="text-[12px] font-semibold text-[#FE9638] uppercase tracking-widest">
              FROM DECK TO DEALS
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#FAFAFA]">
              A New Way to Raise for Startups
            </h3>
            <p className="text-base text-[#B5B5B5] max-w-xl mx-auto">
              AI finds fit, improves your story, and keeps every lead moving.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 pt-2">
            {[
              "Advanced Investor Search",
              "AI-Powered Investor Matching",
              "Investor Readiness Score",
              "Comprehensive Business Analysis",
            ].map((label, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-2 bg-[#1C1C1C] border border-[rgba(255,255,255,0.08)] rounded-full py-2.5 px-5 text-sm font-semibold text-[#FAFAFA] shadow-sm"
              >
                <span className="text-[#FE9638] font-black">◆</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

