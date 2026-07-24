"use client";

import React, { useState } from "react";
import { SectionHeader } from "../ui/SectionHeader";
import { Button } from "../ui/Button";

export const Pricing: React.FC = () => {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="pricing" className="bg-[#0A0A0A] py-24 border-t border-[rgba(255,255,255,0.08)] relative overflow-hidden">
      {/* Background ambient glow */}
      <div
        className="absolute left-1/2 top-1/3 -translate-x-1/2 w-[700px] h-[350px] rounded-full pointer-events-none z-0"
        style={{
          background: "radial-gradient(ellipse at center, rgba(254, 150, 56, 0.08), transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          eyebrow="TRANSPARENT PRICING"
          headline="Predictable Pricing for Venture Due Diligence"
          subheadline="Start for free. Scale when your deal flow demands it."
          centered={true}
        />

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mt-8 mb-16">
          <span className={`text-sm font-semibold cursor-pointer transition-colors ${!annual ? "text-[#FAFAFA]" : "text-[#9A9A9A]"}`} onClick={() => setAnnual(false)}>
            Monthly
          </span>
          <button
            type="button"
            onClick={() => setAnnual(!annual)}
            className="w-14 h-8 rounded-full bg-[#1C1C1C] border border-[rgba(255,255,255,0.12)] p-1 flex items-center transition-colors cursor-pointer relative"
            aria-label="Toggle annual billing"
          >
            <div
              className={`w-6 h-6 rounded-full bg-[#FE9638] shadow-sm transform transition-transform duration-200 ${
                annual ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
          <span className={`text-sm font-semibold cursor-pointer transition-colors flex items-center gap-2 ${annual ? "text-[#FAFAFA]" : "text-[#9A9A9A]"}`} onClick={() => setAnnual(true)}>
            <span>Annual</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[rgba(254,150,56,0.15)] text-[#FE9638] border border-[#FE9638]/30">
              Save 20%
            </span>
          </span>
        </div>

        {/* 3 Tier Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* TIER 1 — Founder Starter */}
          <div className="bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 hover:border-[rgba(255,255,255,0.18)]">
            <div>
              <h3 className="text-xl font-bold text-[#FAFAFA]">Founder Starter</h3>
              <p className="text-sm text-[#9A9A9A] mt-1">For founders perfecting pitch decks</p>
              <div className="my-6">
                <span className="text-4xl sm:text-5xl font-extrabold text-[#FAFAFA]">$0</span>
                <span className="text-[#9A9A9A] text-sm ml-1.5">/ mo</span>
              </div>

              <ul className="space-y-3.5 my-8 text-sm text-[#B5B5B5]">
                <li className="flex items-center gap-3">
                  <span className="text-[#FE9638] font-bold">✓</span>
                  <span>3 AI evaluations / month</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#FE9638] font-bold">✓</span>
                  <span>Summary & Readiness Score</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#FE9638] font-bold">✓</span>
                  <span>Basic investor matching</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#FE9638] font-bold">✓</span>
                  <span>PDF summary export</span>
                </li>
              </ul>
            </div>

            <div className="pt-4">
              <a
                href="/register"
                className="group relative flex flex-col items-center justify-center py-3 px-4 w-full text-[#FAFAFA] hover:text-white font-semibold text-sm transition-all bg-[#1C1C1C] rounded-xl border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.2)]"
              >
                <span>Start Free</span>
              </a>
            </div>
          </div>

          {/* TIER 2 — VC Analyst Pro (Highlighted) */}
          <div className="bg-[#141414] border-2 border-[#FE9638] rounded-2xl p-8 flex flex-col justify-between relative shadow-[0_0_50px_rgba(254,150,56,0.15)] transform lg:-translate-y-3">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="bg-[#FE9638] text-[#0A0A0A] font-extrabold text-xs uppercase px-4 py-1 rounded-full shadow-md tracking-wider">
                MOST POPULAR
              </span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#FAFAFA]">VC Analyst Pro</h3>
              <p className="text-sm text-[#9A9A9A] mt-1">For active venture funds & angel syndicates</p>
              <div className="my-6">
                <span className="text-4xl sm:text-5xl font-extrabold text-[#FAFAFA]">
                  ${annual ? "159" : "199"}
                </span>
                <span className="text-[#9A9A9A] text-sm ml-1.5">/ mo per seat</span>
              </div>

              <ul className="space-y-3.5 my-8 text-sm text-[#FAFAFA]">
                <li className="flex items-center gap-3">
                  <span className="text-[#FE9638] font-bold">✓</span>
                  <span><strong className="text-[#FE9638]">Unlimited</strong> AI evaluations</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#FE9638] font-bold">✓</span>
                  <span>All 5 LangChain specialized agents</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#FE9638] font-bold">✓</span>
                  <span>Full 7-category Risk Map & justifications</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#FE9638] font-bold">✓</span>
                  <span>24 Q&A due diligence deck builder</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#FE9638] font-bold">✓</span>
                  <span>Supabase CRM live database sync</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#FE9638] font-bold">✓</span>
                  <span>Priority Slack & email support</span>
                </li>
              </ul>
            </div>

            <div className="pt-4">
              <Button variant="solid" className="w-full !py-3.5 shadow-lg shadow-[#FE9638]/20">
                Start 14-Day Free Trial
              </Button>
            </div>
          </div>

          {/* TIER 3 — Fund Enterprise */}
          <div className="bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 hover:border-[rgba(255,255,255,0.18)]">
            <div>
              <h3 className="text-xl font-bold text-[#FAFAFA]">Enterprise</h3>
              <p className="text-sm text-[#9A9A9A] mt-1">For incubators, syndicates & large institutional funds</p>
              <div className="my-6">
                <span className="text-4xl sm:text-5xl font-extrabold text-[#FAFAFA]">
                  ${annual ? "719" : "899"}
                </span>
                <span className="text-[#9A9A9A] text-sm ml-1.5">/ mo (up to 10 seats)</span>
              </div>

              <ul className="space-y-3.5 my-8 text-sm text-[#B5B5B5]">
                <li className="flex items-center gap-3">
                  <span className="text-[#FE9638] font-bold">✓</span>
                  <span>Batch evaluation engine (50 decks/day)</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#FE9638] font-bold">✓</span>
                  <span>Custom scoring weights & thesis alignment</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#FE9638] font-bold">✓</span>
                  <span>Dedicated private Supabase schema</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#FE9638] font-bold">✓</span>
                  <span>REST API & Webhook integration</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#FE9638] font-bold">✓</span>
                  <span>SOC2 compliance & NDA workflows</span>
                </li>
              </ul>
            </div>

            <div className="pt-4">
              <a
                href="#contact"
                className="flex items-center justify-center py-3 px-4 w-full text-[#FAFAFA] hover:text-white font-semibold text-sm transition-all bg-[#1C1C1C] rounded-xl border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.2)]"
              >
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
