"use client";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import HeroMedia from "./hero/HeroMedia";

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
    <section className="relative bg-[#0d0d0d] pt-28 md:pt-[150px] pb-24 md:pb-[160px] overflow-hidden">
      {/* BACKGROUND GRID — much more subtle */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {filledTiles.map((tile, idx) => (
          <div
            key={idx}
            className="absolute transition-all duration-700"
            style={{
              left: `${tile.col * 120 + 1}px`,
              top: `${tile.row * 120 + 1}px`,
              width: "119px",
              height: "119px",
              backgroundColor: "rgba(255,255,255,0.015)",
            }}
          />
        ))}

        {/* Grid lines at 12% opacity */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.025) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.025) 1px, transparent 1px)
            `,
            backgroundSize: "120px 120px",
          }}
        />
      </div>

      {/* AMBIENT GLOW — reduced 40%, calm feeling */}
      <div
        className="absolute right-0 bottom-0 w-[500px] h-[500px] rounded-full pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle at center, rgba(254, 174, 76, 0.08), transparent 70%)",
        }}
      />
      <div
        className="absolute left-1/2 top-16 -translate-x-1/2 w-[700px] h-[250px] rounded-full pointer-events-none z-0"
        style={{
          background: "radial-gradient(ellipse at center, rgba(254, 150, 56, 0.06), transparent 70%)",
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
        <p className="text-base sm:text-[18px] md:text-[19px] font-normal text-[#B5B5B5] leading-[1.5] max-w-[640px] mx-auto mb-12 animate-fade-in-up [animation-delay:200ms]">
          VentureAI helps founders match with investors and perfect their pitch decks; all in one place, powered by five specialized AI agents.
        </p>

        {/* ANIMATED TRAVELING BORDER CTA BUTTON */}
        <div className="mb-16 animate-fade-in-up [animation-delay:300ms]">
          <Link
            to={user ? dashboardHref : "/register"}
            className="group relative inline-flex items-center justify-center p-[2px] rounded-full overflow-hidden shadow-[0_0_24px_rgba(254,150,56,0.12)] hover:shadow-[0_0_36px_rgba(254,150,56,0.25)] transition-all duration-300 active:scale-[0.98] cursor-pointer"
          >
            <span className="absolute inset-[-1000%] animate-rotate-border bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0%,#FE9638_15%,transparent_30%,transparent_50%,#FE9638_65%,transparent_80%)] opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-[#141414] group-hover:bg-[#1A1A1A] transition-colors duration-300 text-[#FAFAFA] font-bold text-base sm:text-lg">
              <span>{user ? "Go to Dashboard →" : "Get Started For Free!"}</span>
            </span>
          </Link>
        </div>

        {/* INTERACTIVE HERO MEDIA — cinematic showcase */}
        <HeroMedia />
      </div>
    </section>
  );
};
