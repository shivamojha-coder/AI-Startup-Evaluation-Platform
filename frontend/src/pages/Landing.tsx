import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ScrollReveal } from "../components/ScrollReveal";

export const Landing: React.FC = () => {
  const [bannerVisible, setBannerVisible] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const dismissed = localStorage.getItem("ventureai_banner_dismissed");
    if (!dismissed) {
      setBannerVisible(true);
    }
  }, []);

  const handleDismissBanner = () => {
    localStorage.setItem("ventureai_banner_dismissed", "true");
    setBannerVisible(false);
  };

  const logos = [
    "Sequoia Seed Partners",
    "Y-Ventures Capital",
    "Founders Incubator",
    "AlphaFund VC",
    "NexusGrowth Studio",
    "Vertex Labs",
  ];

  const steps = [
    {
      badge: "01",
      title: "Upload Pitch Deck",
      body: "Drop any PDF. Our pipeline extracts, cleans, and chunks the text automatically.",
      icon: (
        <svg className="w-7 h-7 text-[#4361EE]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
    },
    {
      badge: "02",
      title: "Pipeline Activates",
      body: "Text is preprocessed through our extraction → cleaning → chunking engine.",
      icon: (
        <svg className="w-7 h-7 text-[#4361EE]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      ),
    },
    {
      badge: "03",
      title: "5 Agents Run in Parallel",
      body: "Summary · Risk · Questions · Scoring · Report Generator — all run simultaneously via LangChain.",
      icon: (
        <svg className="w-7 h-7 text-[#8B5CF6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        <svg className="w-7 h-7 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  const tabs = [
    { label: "Summary Agent", id: "summary", badge: "AGENT 1", desc: "Synthesizes core startup narrative into clean executive summaries." },
    { label: "Risk Analysis", id: "risk", badge: "AGENT 2", desc: "Evaluates 7 critical risk categories with severity ratings." },
    { label: "Question Engine", id: "questions", badge: "AGENT 3", desc: "Generates tough, tailored VC due diligence questions." },
    { label: "Scoring Model", id: "scoring", badge: "AGENT 4", desc: "Scores 8 key dimensions on a 0-100 scale with reasoning." },
    { label: "Report Generator", id: "report", badge: "AGENT 5", desc: "Compiles all insights into an institutional-grade PDF memo." },
  ];

  const tabContents = [
    {
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
      heading: "7-Category Risk Map",
      bullets: [
        "Market · Product · Technology · Team · Financial · Competition · Regulatory",
        "Each risk rated: LOW / MEDIUM / HIGH with max 35-word description",
        "Absence of information is itself surfaced as a risk",
      ],
      customContent: (
        <div className="space-y-3 mt-6">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
            <span className="font-semibold text-sm text-[#111827]">Market Opportunity</span>
            <span className="px-2.5 py-1 rounded text-xs font-bold bg-[#FEF3C7] text-[#92400E]">MEDIUM RISK</span>
          </div>
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
            <span className="font-semibold text-sm text-[#111827]">Team Execution & Completeness</span>
            <span className="px-2.5 py-1 rounded text-xs font-bold bg-[#FEE2E2] text-[#991B1B]">HIGH RISK</span>
          </div>
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
            <span className="font-semibold text-sm text-[#111827]">Proprietary Technology Defensibility</span>
            <span className="px-2.5 py-1 rounded text-xs font-bold bg-[#D1FAE5] text-[#065F46]">LOW RISK</span>
          </div>
        </div>
      ),
    },
    {
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
      heading: "Weighted Score: 1 to 100",
      bullets: [
        "Scoring: Market Opportunity (20%) · Traction (20%) · Business Model (15%) · etc.",
        "Every score backed by evidence-based reasoning from the deck",
        "Conservative scoring when data is absent — no guess-work",
      ],
      customContent: (
        <div className="mt-6 flex items-center justify-around p-6 bg-[#F9FAFB] rounded-2xl border border-[#E5E7EB]">
          <div className="relative w-28 h-28 rounded-full flex items-center justify-center border-8 border-[#4361EE] shadow-inner">
            <span className="text-3xl font-black text-[#4361EE]">74</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between gap-8"><span className="text-gray-500">Market Opportunity (20%)</span><span className="font-bold text-[#111827]">82/100</span></div>
            <div className="flex justify-between gap-8"><span className="text-gray-500">Traction & Growth (20%)</span><span className="font-bold text-[#111827]">78/100</span></div>
            <div className="flex justify-between gap-8"><span className="text-gray-500">Team Experience (15%)</span><span className="font-bold text-[#EF4444]">58/100</span></div>
          </div>
        </div>
      ),
    },
    {
      heading: "Investment Recommendation",
      bullets: [
        "Final verdict: Strong Recommend · Recommend with Conditions · Further Diligence · Not Recommended",
        "Logic-locked: 2+ high-severity risks → never 'Strong Recommend'",
        "60-word justification referencing score + specific risks or strengths",
      ],
      customContent: (
        <div className="mt-6 p-6 bg-[#F9FAFB] rounded-2xl border border-[#E5E7EB]">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-semibold text-gray-400 uppercase">Verdict Chip:</span>
            <span className="px-3.5 py-1.5 rounded-full text-sm font-bold bg-[#FEF3C7] text-[#92400E] border border-[#F59E0B]">
              Recommend with Conditions
            </span>
          </div>
          <p className="text-sm text-[#374151] italic leading-relaxed">
            &ldquo;Nexus AI Studio demonstrates strong market momentum and product-market fit with an 82/100 opportunity score. However, conditional recommendation is advised due to a high-severity team risk regarding the vacant technical leadership role.&rdquo;
          </p>
        </div>
      ),
    },
  ];

  const metrics = [
    { value: "< 5 min", label: "Full report generation time" },
    { value: "1–100", label: "Weighted scoring scale" },
    { value: "24", label: "Due-diligence questions generated" },
    { value: "7", label: "Risk categories analyzed" },
  ];

  const useCases = [
    {
      role: "VC Fund Analysts",
      headline: "Evaluate 10x More Deals",
      body: "Stop spending 8 hours on a single deck. Run structured first-pass evaluations in minutes, keep your pipeline moving.",
      linkText: "See VC use case →",
      featured: false,
      icon: (
        <svg className="w-6 h-6 text-[#4361EE]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      role: "Startup Incubators",
      headline: "Consistent Batch Evaluation",
      body: "Score every applicant with the same framework. No analyst drift. Full audit trail of every evaluation in Supabase.",
      linkText: "See incubator use case →",
      featured: true,
      badge: "Most Popular",
      icon: (
        <svg className="w-6 h-6 text-[#4361EE]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      role: "Angel Investors",
      headline: "Due Diligence Without a Team",
      body: "Get a senior analyst's structured report on every deal — risk map, investor questions, and a recommendation — solo.",
      linkText: "See angel use case →",
      featured: false,
      icon: (
        <svg className="w-6 h-6 text-[#4361EE]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ];

  const testimonials = [
    {
      quote: "VentureAI cut our first-pass review time from a full day to 20 minutes. The risk map alone is worth it — it surfaces gaps founders never mention.",
      name: "Sarah K.",
      title: "Investment Associate",
      org: "Apex Ventures",
      initials: "SK",
    },
    {
      quote: "We evaluate 80 accelerator applications per cohort. The batch mode means our team spends time on conversations, not reading.",
      name: "James T.",
      title: "Program Director",
      org: "Launchpad Studio",
      initials: "JT",
    },
    {
      quote: "The scoring model is transparent. I can see why a startup scored 68 and exactly what would move that number. That's rare in AI tools.",
      name: "Priya M.",
      title: "Partner",
      org: "Meridian Capital",
      initials: "PM",
    },
  ];

  const badges = [
    { text: "SOC 2 Compliant", icon: <svg className="w-4 h-4 text-[#4361EE]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg> },
    { text: "Data Encrypted at Rest", icon: <svg className="w-4 h-4 text-[#4361EE]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg> },
    { text: "Supabase PostgreSQL", icon: <svg className="w-4 h-4 text-[#4361EE]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg> },
    { text: "Row-Level Security", icon: <svg className="w-4 h-4 text-[#4361EE]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg> },
    { text: "No Training on Your Data", icon: <svg className="w-4 h-4 text-[#4361EE]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg> },
  ];

  const points = [
    "Pitch decks are never stored longer than your session requires",
    "All agent outputs are scoped to your authenticated workspace",
    "LLM providers receive only text chunks — no file metadata",
  ];

  return (
    <div className="pt-16 bg-white text-[#111827]">
      {/* SECTION 2 — ANNOUNCEMENT BANNER */}
      {bannerVisible && (
        <div className="h-10 bg-[#4361EE] text-white text-[13px] font-medium flex items-center justify-between px-4 sm:px-6 transition-all duration-300 relative z-40">
          <div className="flex-1 text-center truncate pr-8">
            <span>🚀 New: Batch evaluation mode now live — analyze up to 50 pitch decks simultaneously.</span>
            <a href="#features" className="ml-2 font-semibold underline underline-offset-2 hover:text-[#EEF2FF] transition-colors">
              Learn more →
            </a>
          </div>
          <button
            onClick={handleDismissBanner}
            className="text-white/80 hover:text-white p-1 rounded focus:outline-none shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* SECTION 3 — HERO SECTION */}
      <section className="relative bg-white pt-[120px] pb-[100px] overflow-hidden">
        <div
          className="absolute right-[-15%] top-[10%] w-[500px] h-[500px] md:w-[650px] md:h-[650px] rounded-full pointer-events-none opacity-85 animate-blob-float z-0"
          style={{
            background: "linear-gradient(135deg, #FF6B9D 0%, #C44BFF 30%, #4361EE 65%, #06B6D4 100%)",
            filter: "blur(40px)",
          }}
        />

        <div className="max-w-[900px] mx-auto px-4 sm:px-6 relative z-10 text-center flex flex-col items-center">
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center px-3.5 py-1 rounded-full text-[13px] font-medium tracking-wide uppercase bg-[#EEF2FF] text-[#4361EE] border border-[#C7D2FE] mb-8 shadow-sm hover:scale-105 transition-transform cursor-default">
              Multi-Agent AI · Powered by LangChain
            </span>
          </div>

          <h1 className="text-[40px] sm:text-[56px] md:text-[72px] font-extrabold text-[#111827] leading-[1.05] tracking-[-0.02em] max-w-[850px] mb-6 animate-fade-in-up [animation-delay:150ms]">
            Due Diligence in <span className="text-gradient-primary">Minutes</span>,<br className="hidden sm:inline" /> Not Days.
          </h1>

          <p className="text-lg sm:text-xl font-normal text-[#6B7280] leading-[1.65] max-w-[680px] mx-auto mb-10 animate-fade-in-up [animation-delay:300ms]">
            Upload any pitch deck. Our five specialized AI agents — built on LangChain — extract, analyze, score, and generate an investor-ready report automatically.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-6 animate-fade-in-up [animation-delay:450ms]">
            <Link
              to="/register"
              className="w-full sm:w-auto h-[52px] px-7 inline-flex items-center justify-center font-semibold text-base rounded-[10px] bg-[#4361EE] text-white hover:bg-[#3B5BDB] shadow-lg shadow-[#4361EE]/20 hover:shadow-xl hover:shadow-[#4361EE]/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
            >
              Evaluate a Pitch Deck →
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto h-[52px] px-6 inline-flex items-center justify-center font-semibold text-base rounded-[10px] bg-transparent text-[#374151] border-[1.5px] border-[#D1D5DB] hover:bg-[#F9FAFB] hover:border-[#4361EE] hover:text-[#4361EE] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 gap-2.5 group"
            >
              <span className="w-6 h-6 rounded-full bg-[#EEF2FF] text-[#4361EE] flex items-center justify-center text-xs group-hover:scale-110 transition-transform">▶</span>
              <span>Watch 2-min Demo</span>
            </Link>
          </div>

          <p className="text-[13px] text-[#9CA3AF] mb-16 animate-fade-in-up [animation-delay:600ms]">
            Trusted by 40+ VC funds and incubators · 2,000+ pitch decks evaluated
          </p>

          {/* Hero Mockup */}
          <div className="w-full max-w-[900px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-4 sm:p-6 shadow-[0_24px_64px_rgba(67,97,238,0.12),0_8px_32px_rgba(0,0,0,0.08)] hover:shadow-[0_32px_80px_rgba(67,97,238,0.22)] hover:-translate-y-1.5 transition-all duration-500 relative text-left animate-fade-in-up [animation-delay:750ms]">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-2 text-xs font-mono text-gray-400">app.ventureai.com/evaluation/deal_8921</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20">
                  ● Supabase Synced
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="hidden md:flex md:col-span-3 flex-col gap-2 border-r border-[#E5E7EB] pr-4">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Deal Navigation</div>
                <div className="px-3 py-2 rounded-lg bg-[#EEF2FF] text-[#4361EE] font-medium text-sm flex items-center justify-between">
                  <span>Overview</span>
                  <span className="text-xs bg-[#4361EE] text-white px-1.5 py-0.2 rounded">74</span>
                </div>
                <div className="px-3 py-2 rounded-lg text-gray-600 font-medium text-sm hover:bg-gray-100 transition-colors">Risk Map</div>
                <div className="px-3 py-2 rounded-lg text-gray-600 font-medium text-sm hover:bg-gray-100 transition-colors">Diligence Q&A</div>
                <div className="px-3 py-2 rounded-lg text-gray-600 font-medium text-sm hover:bg-gray-100 transition-colors">Financial Score</div>
                <div className="px-3 py-2 rounded-lg text-gray-600 font-medium text-sm hover:bg-gray-100 transition-colors">Full Report</div>
              </div>

              <div className="md:col-span-9 flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-5 rounded-xl border border-[#E5E7EB] shadow-sm gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-[#111827]">Nexus AI Studio</h3>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#92400E] border border-[#F59E0B]">
                        Recommend with Conditions
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Series Seed · Enterprise SaaS · Uploaded 3 mins ago</p>
                  </div>
                  <div className="flex items-center gap-3 bg-[#F9FAFB] px-4 py-2 rounded-xl border border-gray-100 self-stretch sm:self-auto justify-center">
                    <div className="text-right">
                      <div className="text-[11px] font-semibold text-gray-400 uppercase">Weighted Score</div>
                      <div className="text-2xl font-black text-[#4361EE]">74<span className="text-sm font-normal text-gray-400">/100</span></div>
                    </div>
                    <div className="w-10 h-10 rounded-full border-4 border-[#4361EE] flex items-center justify-center font-bold text-xs text-[#4361EE]">
                      B+
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-[#E5E7EB] shadow-sm">
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center justify-between">
                    <span>7-Category Risk Map Output</span>
                    <span className="text-[#4361EE] cursor-pointer hover:underline">View Deep Dive →</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-md text-xs font-semibold bg-[#FEF3C7] text-[#92400E]">Market: MEDIUM RISK</span>
                    <span className="px-3 py-1 rounded-md text-xs font-semibold bg-[#FEE2E2] text-[#991B1B]">Team: HIGH RISK (Gap in CTO role)</span>
                    <span className="px-3 py-1 rounded-md text-xs font-semibold bg-[#D1FAE5] text-[#065F46]">Product: LOW RISK</span>
                    <span className="px-3 py-1 rounded-md text-xs font-semibold bg-[#D1FAE5] text-[#065F46]">Technology: LOW RISK</span>
                    <span className="px-3 py-1 rounded-md text-xs font-semibold bg-[#FEF3C7] text-[#92400E]">Financial: MEDIUM RISK</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 w-full max-w-[700px] flex items-center justify-center gap-3 sm:gap-6 opacity-60 text-xs font-medium text-gray-500">
            <div className="flex items-center gap-2 bg-[#F9FAFB] px-3 py-1.5 rounded-lg border border-gray-200">
              <span className="w-2 h-2 rounded-full bg-[#4361EE] animate-ping" />
              <span>PDF Upload</span>
            </div>
            <svg className="w-8 sm:w-16 h-4 text-[#4361EE]/40" stroke="currentColor" fill="none" viewBox="0 0 64 16">
              <path strokeDasharray="4 4" d="M0 8h64" strokeWidth="2" />
            </svg>
            <div className="flex items-center gap-2 bg-[#EEF2FF] px-3 py-1.5 rounded-lg border border-[#C7D2FE] text-[#4361EE] font-semibold">
              <span>5 LangChain Agents</span>
            </div>
            <svg className="w-8 sm:w-16 h-4 text-[#4361EE]/40" stroke="currentColor" fill="none" viewBox="0 0 64 16">
              <path strokeDasharray="4 4" d="M0 8h64" strokeWidth="2" />
            </svg>
            <div className="flex items-center gap-2 bg-[#F9FAFB] px-3 py-1.5 rounded-lg border border-gray-200">
              <span>Supabase Report</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — LOGO STRIP */}
      <ScrollReveal animation="fade-in" duration={800}>
        <section className="bg-white py-12 border-t border-[#E5E7EB] overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 text-center">
            <h3 className="text-[13px] font-medium text-[#9CA3AF] tracking-[0.05em] uppercase">
              Used by analysts at leading funds and programs
            </h3>
          </div>
          <div className="relative w-full overflow-hidden flex">
            <div className="flex whitespace-nowrap animate-marquee items-center gap-16 md:gap-24">
              {[...logos, ...logos, ...logos].map((name, index) => (
                <div key={index} className="flex items-center gap-2.5 opacity-40 hover:opacity-85 transition-opacity duration-200 cursor-default shrink-0">
                  <div className="w-6 h-6 rounded bg-[#111827] text-white flex items-center justify-center font-bold text-xs">{name[0]}</div>
                  <span className="text-lg md:text-xl font-bold tracking-tight text-[#111827]">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* SECTION 5 — PROBLEM STATEMENT */}
      <ScrollReveal animation="fade-up">
        <section className="bg-[#F9FAFB] py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <div className="text-[12px] font-semibold tracking-widest uppercase text-[#4361EE] mb-3">THE PROBLEM</div>
              <h2 className="text-3xl sm:text-4xl md:text-[48px] font-bold text-[#111827] leading-[1.1] mb-8 max-w-[400px]">Manual due diligence is broken.</h2>
              <div className="space-y-6">
                <div className="border-l-3 border-[#4361EE] pl-4 my-3"><p className="text-[17px] font-normal text-[#374151] leading-relaxed">6–10 hours per pitch deck, every analyst, every deal.</p></div>
                <div className="border-l-3 border-[#4361EE] pl-4 my-3"><p className="text-[17px] font-normal text-[#374151] leading-relaxed">Inconsistent assessments — gut feel over structured data.</p></div>
                <div className="border-l-3 border-[#4361EE] pl-4 my-3"><p className="text-[17px] font-normal text-[#374151] leading-relaxed">Slow pipelines miss the best deals first.</p></div>
              </div>
            </div>
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm border-l-4 !border-l-[#EF4444]">
                <h3 className="text-xl font-bold text-[#111827] mb-6 flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />Without VentureAI</h3>
                <ul className="space-y-4 text-[15px] text-[#374151]">
                  <li className="flex items-start gap-3"><span className="text-[#EF4444] font-bold shrink-0 text-lg leading-none">✗</span><span>6–10 hours per deck</span></li>
                  <li className="flex items-start gap-3"><span className="text-[#EF4444] font-bold shrink-0 text-lg leading-none">✗</span><span>No structured risk map</span></li>
                  <li className="flex items-start gap-3"><span className="text-[#EF4444] font-bold shrink-0 text-lg leading-none">✗</span><span>Analyst bias and inconsistency</span></li>
                  <li className="flex items-start gap-3"><span className="text-[#EF4444] font-bold shrink-0 text-lg leading-none">✗</span><span>No repeatable scoring model</span></li>
                </ul>
              </div>
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm border-l-4 !border-l-[#10B981]">
                <h3 className="text-xl font-bold text-[#111827] mb-6 flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />With VentureAI</h3>
                <ul className="space-y-4 text-[15px] text-[#374151]">
                  <li className="flex items-start gap-3"><span className="text-[#10B981] font-bold shrink-0 text-lg leading-none">✓</span><span className="font-medium text-[#111827]">Full report in under 5 minutes</span></li>
                  <li className="flex items-start gap-3"><span className="text-[#10B981] font-bold shrink-0 text-lg leading-none">✓</span><span className="font-medium text-[#111827]">7-category risk breakdown</span></li>
                  <li className="flex items-start gap-3"><span className="text-[#10B981] font-bold shrink-0 text-lg leading-none">✓</span><span className="font-medium text-[#111827]">Weighted score from 1–100</span></li>
                  <li className="flex items-start gap-3"><span className="text-[#10B981] font-bold shrink-0 text-lg leading-none">✓</span><span className="font-medium text-[#111827]">Consistent across every deck</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* SECTION 6 — HOW IT WORKS */}
      <ScrollReveal animation="fade-up">
        <section className="bg-white py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="text-[13px] font-semibold tracking-widest uppercase text-[#4361EE] mb-3">THE PROCESS</div>
              <h2 className="text-4xl md:text-[48px] font-bold text-[#111827] leading-[1.1] mb-4">From PDF to Investor Report in 4 Steps</h2>
              <p className="text-lg md:text-xl text-[#6B7280]">LangChain orchestrates five specialized agents working in parallel.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {steps.map((step, idx) => (
                <div key={idx} className="relative group">
                  <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 h-full flex flex-col justify-between transition-all duration-300 hover:shadow-[0_16px_36px_rgba(67,97,238,0.16)] hover:-translate-y-2 hover:border-[#4361EE]/40">
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="p-3 rounded-xl bg-[#F9FAFB] border border-gray-100 group-hover:bg-[#EEF2FF] group-hover:scale-110 transition-all duration-300">{step.icon}</div>
                        <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-full bg-[#EEF2FF] text-[#4361EE] group-hover:bg-[#4361EE] group-hover:text-white transition-colors duration-300">{step.badge}</span>
                      </div>
                      <h3 className="text-xl font-bold text-[#111827] mb-3 group-hover:text-[#4361EE] transition-colors">{step.title}</h3>
                      <p className="text-sm text-[#6B7280] leading-relaxed">{step.body}</p>
                    </div>
                    {step.isFork && (
                      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] font-semibold text-[#8B5CF6]">
                        <span>Parallel Execution</span>
                        <span className="flex gap-1"><span className="w-2 h-2 rounded-full bg-[#4361EE] animate-pulse" /><span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-pulse [animation-delay:200ms]" /><span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse [animation-delay:400ms]" /></span>
                      </div>
                    )}
                  </div>
                  {idx < steps.length - 1 && <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10 text-[#4361EE]/40 font-bold text-xl group-hover:translate-x-1 transition-transform">→</div>}
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* SECTION 7 — PRODUCT FEATURE SHOWCASE */}
      <ScrollReveal animation="fade-up">
        <section id="features" className="bg-[#F9FAFB] py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <div className="text-[13px] font-semibold tracking-widest uppercase text-[#4361EE] mb-3">THE PLATFORM</div>
              <h2 className="text-3xl sm:text-4xl md:text-[48px] font-bold text-[#111827] leading-[1.1] mb-4">Five specialized agents. One comprehensive report.</h2>
              <p className="text-lg text-[#6B7280]">Our LangChain pipeline breaks down pitch decks into actionable structured intelligence.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-4 flex flex-col gap-3">
                {tabs.map((tab, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(idx)}
                    className={`text-left p-5 rounded-2xl border transition-all duration-300 ${
                      activeTab === idx
                        ? "bg-white border-[#4361EE] shadow-[0_8px_24px_rgba(67,97,238,0.12)] -translate-y-0.5"
                        : "bg-transparent border-transparent hover:bg-white/60 hover:border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-bold text-base ${activeTab === idx ? "text-[#4361EE]" : "text-[#111827]"}`}>{tab.label}</span>
                      <span className={`font-mono text-xs px-2 py-0.5 rounded ${activeTab === idx ? "bg-[#EEF2FF] text-[#4361EE]" : "bg-gray-100 text-gray-500"}`}>{tab.badge}</span>
                    </div>
                    <p className="text-sm text-[#6B7280] leading-relaxed">{tab.desc}</p>
                  </button>
                ))}
              </div>

              <div className="lg:col-span-8 bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-[0_12px_36px_rgba(0,0,0,0.06)] min-h-[460px] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded bg-[#EEF2FF] text-[#4361EE]">AGENT OUTPUT</span>
                      <span className="text-sm font-bold text-[#111827]">{tabs[activeTab].label}</span>
                    </div>
                    <span className="text-xs text-gray-400 font-mono">JSON Schema v2.4</span>
                  </div>
                  {activeTab === 0 ? (
                    <div className="space-y-6">
                      <div>
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">One-Sentence Pitch</div>
                        <p className="text-lg font-medium text-[#111827] bg-[#F9FAFB] p-4 rounded-xl border border-gray-100">AI-powered predictive maintenance for industrial robotics, reducing unplanned downtime by 45%.</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#F9FAFB] p-4 rounded-xl border border-gray-100"><div className="text-xs font-semibold text-gray-400 uppercase mb-1">Target Market</div><div className="font-bold text-[#111827]">Automotive & Manufacturing ($14B TAM)</div></div>
                        <div className="bg-[#F9FAFB] p-4 rounded-xl border border-gray-100"><div className="text-xs font-semibold text-gray-400 uppercase mb-1">Business Model</div><div className="font-bold text-[#111827]">B2B SaaS + Per-Robot Licensing</div></div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Key Traction Metrics Found</div>
                        <div className="flex flex-wrap gap-2"><span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-medium text-sm border border-emerald-200">$1.2M ARR</span><span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 font-medium text-sm border border-blue-200">14 Enterprise Pilots</span><span className="px-3 py-1 rounded-lg bg-purple-50 text-purple-700 font-medium text-sm border border-purple-200">120% Net Retention</span></div>
                      </div>
                    </div>
                  ) : (
                    tabContents[activeTab].customContent
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* SECTION 8 — METRICS STRIP */}
      <ScrollReveal animation="scale-up" duration={600}>
        <section className="bg-white py-16 border-y border-[#E5E7EB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {metrics.map((item, idx) => (
                <div key={idx} className="bg-white border border-[#E5E7EB] rounded-xl p-8 border-t-3 !border-t-[#4361EE] transition-all duration-300 hover:shadow-[0_12px_28px_rgba(67,97,238,0.14)] hover:-translate-y-1.5">
                  <div className="text-4xl md:text-[48px] font-extrabold text-[#111827] tracking-tight mb-2">{item.value}</div>
                  <div className="text-sm font-normal text-[#6B7280]">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* SECTION 9 — USE CASE CARDS */}
      <ScrollReveal animation="fade-up">
        <section id="use-cases" className="bg-[#F9FAFB] py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="text-[13px] font-semibold tracking-widest uppercase text-[#4361EE] mb-3">FOR YOUR TEAM</div>
              <h2 className="text-4xl md:text-[48px] font-bold text-[#111827] leading-[1.1] mb-4">Built for every stage of the deal flow</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              {useCases.map((item, idx) => (
                <div
                  key={idx}
                  className={`bg-white border border-[#E5E7EB] rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_20px_40px_rgba(67,97,238,0.18)] hover:-translate-y-2 hover:border-[#4361EE]/40 relative group ${
                    item.featured ? "border-t-4 !border-t-[#4361EE] shadow-md md:-translate-y-2 hover:md:-translate-y-4" : ""
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-xl bg-[#EEF2FF] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#4361EE] group-hover:text-white transition-all duration-300">{item.icon}</div>
                      {item.badge && <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#EEF2FF] text-[#4361EE] border border-[#C7D2FE] animate-pulse">{item.badge}</span>}
                    </div>
                    <div className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2 group-hover:text-[#4361EE] transition-colors">{item.role}</div>
                    <h3 className="text-2xl font-bold text-[#111827] mb-4">{item.headline}</h3>
                    <p className="text-base text-[#6B7280] leading-relaxed mb-8">{item.body}</p>
                  </div>
                  <div>
                    <Link to="/register" className="inline-flex items-center font-semibold text-sm text-[#4361EE] hover:underline group-hover:translate-x-1 transition-transform">
                      <span>{item.linkText}</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* SECTION 10 — TESTIMONIALS */}
      <ScrollReveal animation="fade-up">
        <section className="bg-white py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl md:text-[48px] font-bold text-[#111827] leading-[1.1]">What analysts are saying</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((item, idx) => (
                <div key={idx} className="bg-white border border-[#E5E7EB] rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_16px_36px_rgba(67,97,238,0.14)] hover:-translate-y-1.5 hover:border-[#4361EE]/30">
                  <div>
                    <div className="text-6xl font-serif text-[#4361EE] leading-none mb-4 font-black">&ldquo;</div>
                    <p className="italic text-[17px] font-normal text-[#374151] leading-relaxed mb-8">{item.quote}</p>
                  </div>
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-[#EEF2FF] text-[#4361EE] font-semibold text-sm flex items-center justify-center shrink-0">{item.initials}</div>
                    <div>
                      <div className="font-bold text-[#111827] text-sm leading-tight">{item.name}</div>
                      <div className="text-xs text-[#6B7280]">{item.title}, <span className="font-medium text-[#374151]">{item.org}</span></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* SECTION 11 — SECURITY & TRUST */}
      <ScrollReveal animation="fade-up">
        <section id="security" className="bg-[#F9FAFB] py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl md:text-[48px] font-bold text-[#111827] leading-[1.1] mb-4">Built for confidential deal flow</h2>
              <p className="text-lg md:text-xl text-[#6B7280]">Every pitch deck processed with enterprise-grade security.</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3.5 mb-12">
              {badges.map((b, idx) => (
                <div key={idx} className="bg-white border border-[#E5E7EB] rounded-full px-5 py-2.5 flex items-center gap-2 text-sm font-medium text-[#374151] transition-all duration-300 hover:border-[#4361EE] hover:shadow-[0_4px_12px_rgba(67,97,238,0.18)] hover:-translate-y-0.5 cursor-default">
                  {b.icon}
                  <span>{b.text}</span>
                </div>
              ))}
            </div>
            <div className="max-w-2xl mx-auto space-y-3">
              {points.map((pt, idx) => (
                <div key={idx} className="flex items-center gap-3 text-base text-[#374151] bg-white p-4 rounded-xl border border-gray-100 shadow-2xs hover:border-[#4361EE]/40 hover:translate-x-1 transition-all duration-300">
                  <span className="text-[#4361EE] font-bold text-lg leading-none">→</span>
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* SECTION 12 — FINAL CTA BANNER */}
      <ScrollReveal animation="scale-up" duration={800}>
        <section id="cta" className="bg-[#111827] py-24 relative overflow-hidden">
          <div
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[800px] h-[400px] pointer-events-none opacity-60 z-0"
            style={{ background: "radial-gradient(ellipse 800px 400px at 50% 100%, rgba(67,97,238,0.25), transparent)" }}
          />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center flex flex-col items-center">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full text-[13px] font-semibold tracking-widest uppercase mb-6 bg-[rgba(67,97,238,0.2)] border border-[rgba(67,97,238,0.4)] text-[#93C5FD]">
              START EVALUATING
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-[48px] font-bold text-white leading-[1.1] mb-6 tracking-tight">
              Your next great investment is in a PDF.
            </h2>
            <p className="text-lg sm:text-xl font-normal text-[#9CA3AF] leading-relaxed max-w-2xl mb-10">
              Upload a pitch deck and get a full investor report in under 5 minutes. No setup. No credit card.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Link
                to="/register"
                className="w-full sm:w-auto h-14 px-8 inline-flex items-center justify-center font-semibold text-lg rounded-xl bg-[#4361EE] text-white hover:bg-[#3B5BDB] shadow-xl shadow-[#4361EE]/30 hover:shadow-[#4361EE]/50 hover:-translate-y-1 active:translate-y-0 transition-all duration-300"
              >
                Evaluate Your First Deck →
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto h-14 px-8 inline-flex items-center justify-center font-semibold text-lg rounded-xl border-[1.5px] border-white/20 text-white hover:bg-white/10 hover:-translate-y-1 active:translate-y-0 transition-all duration-300"
              >
                Book a Demo
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
};
