"use client";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

export const Hero: React.FC = () => {
  const { user } = useAuth();
  const dashboardHref = user?.role === "investor" ? "/investor/dashboard" : "/founder/dashboard";
  const [filledTiles, setFilledTiles] = useState<{ col: number; row: number }[]>([
    { col: 1, row: 1 },
    { col: 4, row: 3 },
    { col: 7, row: 2 },
    { col: 10, row: 1 },
  ]);

  useEffect(() => {
    const generateTiles = () => {
      const cols = Math.max(Math.ceil(window.innerWidth / 120), 4);
      const rows = 6;
      const tiles: { col: number; row: number }[] = [];
      const count = Math.min(Math.max(Math.floor(cols / 3), 2), 5);
      const used = new Set<string>();

      for (let i = 0; i < count; i++) {
        const minCol = Math.floor((i * cols) / count);
        const maxCol = Math.max(minCol + 1, Math.floor(((i + 1) * cols) / count) - 1);
        const col = minCol + Math.floor(Math.random() * (maxCol - minCol + 1));
        const row = 1 + Math.floor(Math.random() * (rows - 2));
        const key = `${col}-${row}`;
        if (!used.has(key)) {
          used.add(key);
          tiles.push({ col, row });
        }
      }
      setFilledTiles(tiles);
    };

    generateTiles();
    window.addEventListener("resize", generateTiles);
    return () => window.removeEventListener("resize", generateTiles);
  }, []);

  return (
    <section className="relative bg-[#0d0d0d] pt-[100px] pb-[90px] overflow-hidden">
      {/* BACKGROUND GRID / CHECKERBOARD TEXTURE */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Lighter filled focal tiles (#222222) */}
        {filledTiles.map((tile, idx) => (
          <div
            key={idx}
            className="absolute transition-all duration-700"
            style={{
              left: `${tile.col * 120 + 1}px`,
              top: `${tile.row * 120 + 1}px`,
              width: "119px",
              height: "119px",
              backgroundColor: "#222222",
            }}
          />
        ))}

        {/* 120x120 Grid lines */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
            `,
            backgroundSize: "120px 120px",
          }}
        />
      </div>

      {/* AMBIENT WARM GLOW IN CORNERS */}
      <div
        className="absolute right-0 bottom-0 w-[600px] h-[600px] rounded-full pointer-events-none animate-glow-pulse z-0"
        style={{
          background: "radial-gradient(circle at center, rgba(254, 174, 76, 0.18), transparent 70%)",
        }}
      />
      <div
        className="absolute left-1/2 top-10 -translate-x-1/2 w-[800px] h-[300px] rounded-full pointer-events-none z-0"
        style={{
          background: "radial-gradient(ellipse at center, rgba(254, 150, 56, 0.12), transparent 70%)",
        }}
      />

      <div className="max-w-[880px] mx-auto px-4 sm:px-6 relative z-10 text-center flex flex-col items-center">
        {/* SOCIAL PROOF AVATAR ROW */}
        <div className="flex items-center justify-center gap-3 mb-8 animate-fade-in-up">
          <div className="flex -space-x-3 overflow-hidden p-0.5">
            <img
              src="/avatars/sundar.jpg"
              alt="Sundar Pichai"
              className="inline-block h-10 w-10 rounded-full ring-2 ring-[#0A0A0A] object-cover bg-[#242424] shadow-md"
            />
            <img
              src="/avatars/elon.jpg"
              alt="Elon Musk"
              className="inline-block h-10 w-10 rounded-full ring-2 ring-[#0A0A0A] object-cover bg-[#242424] shadow-md"
            />
            <img
              src="/avatars/tim.png"
              alt="Tim Cook"
              className="inline-block h-10 w-10 rounded-full ring-2 ring-[#0A0A0A] object-cover object-top bg-[#242424] shadow-md"
            />
          </div>
          <span className="text-[14px] font-medium text-[#E2A56B]">
            Trusted by 10,500+ founders worldwide.
          </span>
        </div>

        {/* HEADLINE */}
        <h1 className="text-3xl sm:text-5xl md:text-[56px] font-extrabold text-[#FAFAFA] leading-[1.12] tracking-[-0.01em] max-w-[800px] mb-6 animate-fade-in-up [animation-delay:100ms]">
          Find Ideal VCs or Angel Investors in Minutes <br className="hidden sm:inline" />
          with AI.
        </h1>

        {/* SUBHEADLINE */}
        <p className="text-base sm:text-[18px] md:text-[19px] font-normal text-[#B5B5B5] leading-[1.5] max-w-[640px] mx-auto mb-10 animate-fade-in-up [animation-delay:200ms]">
          VentureAI helps founders match with investors and perfect their pitch decks; all in one place, powered by five specialized AI agents.
        </p>

        {/* ANIMATED TRAVELING BORDER CTA BUTTON */}
        <div className="mb-14 animate-fade-in-up [animation-delay:300ms]">
          <Link
            to={user ? dashboardHref : "/register"}
            className="group relative inline-flex items-center justify-center p-[2px] rounded-full overflow-hidden shadow-[0_0_24px_rgba(254,150,56,0.15)] hover:shadow-[0_0_36px_rgba(254,150,56,0.35)] transition-all duration-300 active:scale-[0.98] cursor-pointer"
          >
            {/* Traveling glowing border lines (opposite 180deg arcs) */}
            <span className="absolute inset-[-1000%] animate-rotate-border bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0%,#FE9638_15%,transparent_30%,transparent_50%,#FE9638_65%,transparent_80%)] opacity-85 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Core button background */}
            <span className="relative inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-[#141414] group-hover:bg-[#1A1A1A] transition-colors duration-300 text-[#FAFAFA] font-bold text-base sm:text-lg">
              <span>{user ? "Go to Dashboard →" : "Get Started For Free!"}</span>
            </span>
          </Link>
        </div>

        {/* HERO PRODUCT SCREENSHOT / MOCKUP */}
        <div className="w-full max-w-[880px] bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-2xl p-4 sm:p-6 shadow-[0_24px_64px_rgba(254,150,56,0.10),0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_28px_72px_rgba(254,150,56,0.15)] transition-all duration-500 relative text-left animate-fade-in-up [animation-delay:400ms]">
          {/* Mockup Header bar */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[rgba(255,255,255,0.08)]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#F87171]" />
              <div className="w-3 h-3 rounded-full bg-[#FBBF24]" />
              <div className="w-3 h-3 rounded-full bg-[#34D399]" />
              <span className="ml-3 text-xs font-mono text-[#9A9A9A]">app.ventureai.com/eval/deal_8921</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-[rgba(52,211,153,0.12)] text-[#34D399] border border-[#34D399]/30">
                ● Supabase Synced
              </span>
            </div>
          </div>

          {/* Mockup Body Content */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left sidebar nav preview */}
            <div className="hidden md:flex md:col-span-3 flex-col gap-2 border-r border-[rgba(255,255,255,0.08)] pr-4">
              <div className="text-xs font-semibold text-[#9A9A9A] uppercase tracking-wider mb-2">Evaluation View</div>
              <div className="px-3 py-2 rounded-lg bg-[rgba(254,150,56,0.12)] text-[#FE9638] font-medium text-sm flex items-center justify-between border border-[#FE9638]/20">
                <span>Overview</span>
                <span className="text-xs bg-[#FE9638] text-[#0A0A0A] font-bold px-1.5 py-0.5 rounded">74</span>
              </div>
              <div className="px-3 py-2 rounded-lg text-[#B5B5B5] font-medium text-sm hover:bg-[rgba(255,255,255,0.04)] transition-colors">Risk Map (7 Cats)</div>
              <div className="px-3 py-2 rounded-lg text-[#B5B5B5] font-medium text-sm hover:bg-[rgba(255,255,255,0.04)] transition-colors">Diligence Q&A (24)</div>
              <div className="px-3 py-2 rounded-lg text-[#B5B5B5] font-medium text-sm hover:bg-[rgba(255,255,255,0.04)] transition-colors">Scoring Breakdown</div>
              <div className="px-3 py-2 rounded-lg text-[#B5B5B5] font-medium text-sm hover:bg-[rgba(255,255,255,0.04)] transition-colors">Investor Matches</div>
            </div>

            {/* Main dashboard preview area */}
            <div className="md:col-span-9 flex flex-col gap-6">
              {/* Top summary row */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#1C1C1C] p-5 rounded-xl border border-[rgba(255,255,255,0.08)] shadow-sm gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-[#FAFAFA]">Nexus AI Studio</h3>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[rgba(52,211,153,0.12)] text-[#34D399] border border-[#34D399]/30">
                      INVESTOR READY
                    </span>
                  </div>
                  <p className="text-sm text-[#9A9A9A] mt-1">Series Seed · Enterprise AI SaaS · Analyzed by 5 Agents</p>
                </div>
                <div className="flex items-center gap-4 bg-[#141414] px-4 py-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] self-stretch sm:self-auto justify-center">
                  <div className="text-right">
                    <div className="text-[11px] font-semibold text-[#9A9A9A] uppercase">Readiness Score</div>
                    <div className="text-2xl font-black text-[#FE9638]">74<span className="text-sm font-normal text-[#9A9A9A]">/100</span></div>
                  </div>
                  <div className="w-11 h-11 rounded-full border-2 border-[#FE9638] bg-[rgba(254,150,56,0.12)] flex items-center justify-center font-extrabold text-sm text-[#FE9638]">
                    A-
                  </div>
                </div>
              </div>

              {/* Risk category badges preview */}
              <div className="bg-[#1C1C1C] p-5 rounded-xl border border-[rgba(255,255,255,0.08)] shadow-sm">
                <div className="text-xs font-semibold text-[#9A9A9A] uppercase tracking-wider mb-3 flex items-center justify-between">
                  <span>7-Category Risk Map Output</span>
                  <span className="text-[#FE9638] cursor-pointer hover:underline text-xs">View Full Risk Report →</span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[rgba(251,191,36,0.12)] text-[#FBBF24] border border-[#FBBF24]/30">
                    Market: MEDIUM RISK
                  </span>
                  <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[rgba(248,113,113,0.12)] text-[#F87171] border border-[#F87171]/30">
                    Team: HIGH RISK (CTO Hire Needed)
                  </span>
                  <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[rgba(52,211,153,0.12)] text-[#34D399] border border-[#34D399]/30">
                    Product: LOW RISK
                  </span>
                  <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[rgba(52,211,153,0.12)] text-[#34D399] border border-[#34D399]/30">
                    Technology: LOW RISK
                  </span>
                  <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[rgba(251,191,36,0.12)] text-[#FBBF24] border border-[#FBBF24]/30">
                    Competition: MEDIUM RISK
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
