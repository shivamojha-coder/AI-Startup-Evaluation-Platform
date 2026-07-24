"use client";

import React from "react";
import { SectionHeader } from "../ui/SectionHeader";
import { Accordion } from "../ui/Accordion";

export const Faq: React.FC = () => {
  const faqItems = [
    {
      question: "How accurate is the AI scoring compared to human VC analysts?",
      answer: "Our scoring model is calibrated against historical venture outcomes across 2,000+ evaluated seed and Series A deals. Unlike a human analyst who may review a deck in 3 minutes under fatigue, our five specialized agents inspect 100% of the slides, cross-referencing unit economics, team completeness, and market sizing against industry benchmarks with zero bias.",
    },
    {
      question: "Is my pitch deck data shared with other investors or used to train public LLMs?",
      answer: "No. Your pitch decks and financial documents are strictly confidential. We enforce tenant-level Row-Level Security (RLS) in Supabase. Data sent through our LangChain pipeline to foundational LLMs via API is explicitly opted out of model training or data retention.",
    },
    {
      question: "What LangChain models power the five evaluation agents?",
      answer: "We orchestrate a hybrid pipeline using LangChain. The Summary and Question Engine agents run on state-of-the-art reasoning models tailored for document synthesis, while our Risk Analysis and Scoring agents utilize specialized JSON-schema-enforced models to guarantee determinism and structured output.",
    },
    {
      question: "Can our incubator run batch evaluations on 50+ cohort applications at once?",
      answer: "Yes. Our Enterprise and Pro tiers support batch uploading. You can drag and drop a ZIP folder of PDF pitch decks or connect your application form via webhook, and our parallel processing engine will generate standardized 1–100 readiness scores and risk summaries for your entire cohort within minutes.",
    },
    {
      question: "How does the investor matching algorithm work?",
      answer: "Our matching agent extracts 40+ structured attributes from your pitch deck (stage, sector, check size requirement, business model, geographic focus) and cross-references them against an active database of over 180 verified VC fund mandates and angel syndicates to compute an objective percentage match.",
    },
  ];

  return (
    <section id="faq" className="bg-[#0A0A0A] py-24 border-t border-[rgba(255,255,255,0.08)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="FREQUENTLY ASKED QUESTIONS"
          headline="Everything You Need to Know About VentureAI"
          subheadline="Have a different question? Contact our engineering and venture team."
          centered={true}
        />

        <div className="mt-12">
          <Accordion items={faqItems} />
        </div>
      </div>
    </section>
  );
};
