"use client";

import React, { useState, useEffect } from "react";
import { SectionHeader } from "../ui/SectionHeader";
import { ScrollReveal } from "../ui/ScrollReveal";

export const BlogStrip: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash === "pitch-deck-guides") {
        setActiveCategory("pitch-deck");
      } else if (hash === "fundraising-guides") {
        setActiveCategory("fundraising");
      } else if (hash === "outreach-guides") {
        setActiveCategory("outreach");
      } else if (hash === "ai-guides") {
        setActiveCategory("ai");
      } else if (hash === "resources") {
        setActiveCategory("all");
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const categories = [
    { id: "all", label: "All Resources" },
    { id: "pitch-deck", label: "Pitch Deck Guides" },
    { id: "fundraising", label: "Fundraising Guides" },
    { id: "outreach", label: "Investor Outreach" },
    { id: "ai", label: "Tools & AI Guides" },
  ];

  const allArticles = [
    // Pitch Deck Guides
    {
      category: "pitch-deck",
      tag: "PITCH DECK GUIDES",
      date: "June 24, 2026 · 8 min read",
      title: "Designing Your Pitch Deck for AI-First VC Due Diligence",
      excerpt: "As tier-1 venture funds adopt LLM screening tools, here is how founders should structure slide decks to ensure high machine extraction accuracy and top readiness scores.",
    },
    {
      category: "pitch-deck",
      tag: "PITCH DECK GUIDES",
      date: "June 18, 2026 · 5 min read",
      title: "The 15-Slide Seed Deck Master Template: Structuring Problem & TAM",
      excerpt: "A complete framework breakdown of the exact sequence institutional seed investors expect, featuring bottoms-up TAM methodology and defensible problem statements.",
    },
    {
      category: "pitch-deck",
      tag: "PITCH DECK GUIDES",
      date: "June 10, 2026 · 6 min read",
      title: "Avoiding Common Financial Slide Fallacies That Trigger AI Red Flags",
      excerpt: "How unit economics omissions (like unburdened CAC or ignoring gross margin compression) immediately flag your deck for manual review delay.",
    },

    // Fundraising Guides
    {
      category: "fundraising",
      tag: "FUNDRAISING GUIDES",
      date: "June 20, 2026 · 10 min read",
      title: "Step-by-Step Seed Round Strategy: From SAFE Notes to Term Sheets",
      excerpt: "Comprehensive playbook on post-money vs pre-money valuation caps, pro-rata rights negotiation, and setting up clean board governance.",
    },
    {
      category: "fundraising",
      tag: "FUNDRAISING GUIDES",
      date: "June 12, 2026 · 7 min read",
      title: "How to Calculate Defensible Unit Economics for Series A Investors",
      excerpt: "Why NDR (Net Dollar Retention) and LTV:CAC ratios must be cohort-adjusted before sharing financial projections with tier-1 partners.",
    },
    {
      category: "fundraising",
      tag: "FUNDRAISING GUIDES",
      date: "May 28, 2026 · 6 min read",
      title: "Building Your Institutional Data Room: A Complete Checklist",
      excerpt: "The exact legal, IP, employment, and accounting documents that VC associates inspect during Phase 2 technical due diligence.",
    },

    // Investor Outreach Guides
    {
      category: "outreach",
      tag: "INVESTOR OUTREACH",
      date: "June 22, 2026 · 4 min read",
      title: "The 5-Sentence Cold Email Framework That Gets 42% VC Reply Rates",
      excerpt: "Why attaching 40-page PDFs kills reply rates — and how concise traction bullets with a personalized thesis hook lead to first meetings.",
    },
    {
      category: "outreach",
      tag: "INVESTOR OUTREACH",
      date: "June 15, 2026 · 5 min read",
      title: "Securing High-Converting Warm Intros via Founder Ecosystems",
      excerpt: "How to map angel investors, portfolio founders, and legal partners to broker double-opt-in warm introductions to target partners.",
    },
    {
      category: "outreach",
      tag: "INVESTOR OUTREACH",
      date: "June 5, 2026 · 5 min read",
      title: "Managing VC Follow-Ups Without Sounding Desperate: A 4-Week Cadence",
      excerpt: "How to use milestone-driven updates (new enterprise contracts, product releases) to re-engage partners stalled in diligence.",
    },

    // Tools & AI Guides
    {
      category: "ai",
      tag: "TOOLS & AI GUIDES",
      date: "June 25, 2026 · 7 min read",
      title: "How Multi-Agent Pipelines Outperform Single LLMs in Venture Evaluation",
      excerpt: "Why passing a pitch deck to GPT-4 in a single prompt causes hallucinations — and how our 5 specialized LangChain agents split extraction and risk scoring.",
    },
    {
      category: "ai",
      tag: "TOOLS & AI GUIDES",
      date: "June 14, 2026 · 6 min read",
      title: "Automating CRM Deal Flow Tracking with VentureAI JSON Webhooks",
      excerpt: "How venture funds and accelerators sync structured AI due diligence scores directly into Affinity, HubSpot, and Notion databases.",
    },
    {
      category: "ai",
      tag: "TOOLS & AI GUIDES",
      date: "June 1, 2026 · 8 min read",
      title: "Prompt Engineering for Diligence: Customizing Risk Thresholds",
      excerpt: "Configure specialized evaluation weights for Deep Tech, Biotech, and B2B SaaS evaluations using custom LangChain agent parameters.",
    },
  ];

  const displayedArticles = activeCategory === "all"
    ? allArticles.slice(0, 6) // show top 6 diverse guides on 'All'
    : allArticles.filter((art) => art.category === activeCategory);

  return (
    <section id="resources" className="bg-transparent py-24 border-t border-[rgba(255,255,255,0.08)] relative">
      {/* Absolute anchor offsets for smooth navbar dropdown navigation */}
      <div id="pitch-deck-guides" className="absolute -top-24" />
      <div id="fundraising-guides" className="absolute -top-24" />
      <div id="outreach-guides" className="absolute -top-24" />
      <div id="ai-guides" className="absolute -top-24" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="RESOURCES & EDUCATION HUB"
          headline="Master Venture Due Diligence & AI Pitch Deck Design"
          subheadline="Step-by-step frameworks, outreach playbooks, and prompt engineering best practices from our research team."
          centered={true}
        />

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-center flex-wrap gap-2 mt-10 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 border cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-[#FE9638] text-[#0A0A0A] border-[#FE9638] shadow-[0_0_20px_rgba(254,150,56,0.35)] scale-105"
                  : "bg-[#141414] text-[#B5B5B5] border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.2)] hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayedArticles.map((art, idx) => (
            <ScrollReveal key={`${art.title}-${idx}`} animation="fade-up" delay={idx * 100} className="h-full">
              <article className="bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 h-full flex flex-col justify-between transition-all duration-300 hover:shadow-[0_16px_40px_rgba(254,150,56,0.12)] hover:-translate-y-1.5 hover:border-[#FE9638]/40 group">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-[rgba(254,150,56,0.12)] text-[#FE9638] border border-[rgba(254,150,56,0.2)]">
                      {art.tag}
                    </span>
                    <span className="text-xs text-[#9A9A9A]">{art.date}</span>
                  </div>

                  <h3 className="text-xl font-bold text-[#FAFAFA] mb-3 group-hover:text-[#FE9638] transition-colors line-clamp-2">
                    {art.title}
                  </h3>
                  <p className="text-sm text-[#B5B5B5] leading-relaxed line-clamp-3">
                    {art.excerpt}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-[rgba(255,255,255,0.06)]">
                  <a
                    href="#"
                    className="inline-flex items-center gap-1.5 font-semibold text-sm text-[#FE9638] group-hover:translate-x-1 transition-all"
                  >
                    <span>Read guide</span>
                    <span>→</span>
                  </a>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
