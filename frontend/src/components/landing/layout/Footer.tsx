"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-[#000000] text-[#FAFAFA] pt-16 pb-8 border-t border-[rgba(255,255,255,0.08)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-16">
          {/* COLUMN 1 — Brand (spans 5 cols on desktop) */}
          <div className="lg:col-span-5 md:col-span-2 space-y-5">
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-1.5 cursor-pointer"
            >
              <span className="font-bold text-[18px] text-[#FAFAFA] tracking-tight">VentureAI</span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#FE9638] inline-block" />
            </Link>
            <p className="text-[14px] text-[#9A9A9A] leading-relaxed max-w-sm">
              Redefining how founders and investors connect.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-4 text-[#9A9A9A] pt-1">
              <a href="#" aria-label="LinkedIn" className="hover:text-[#FAFAFA] transition-colors duration-150">
                <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-[#FAFAFA] transition-colors duration-150">
                <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a href="#" aria-label="Twitter/X" className="hover:text-[#FAFAFA] transition-colors duration-150">
                <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" aria-label="YouTube" className="hover:text-[#FAFAFA] transition-colors duration-150">
                <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>

            {/* Newsletter input */}
            <form onSubmit={handleSubscribe} className="pt-2 max-w-sm">
              <div className="flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="bg-[#141414] border border-[rgba(255,255,255,0.08)] border-r-0 rounded-l-lg py-2.5 px-3.5 text-sm text-[#FAFAFA] placeholder-[#9A9A9A] focus:outline-none focus:border-[#FE9638] w-full transition-colors"
                />
                <button
                  type="submit"
                  className="bg-[#FE9638] text-[#0A0A0A] font-semibold text-sm py-2.5 px-4 rounded-r-lg hover:brightness-110 active:scale-[0.99] transition-all whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {subscribed ? "Subscribed!" : "Subscribe"}
                </button>
              </div>
            </form>
          </div>

          {/* COLUMN 2 — Company */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-[11px] font-semibold text-[#9A9A9A] uppercase tracking-widest">
              COMPANY
            </h3>
            <ul className="space-y-3 text-[14px]">
              <li><a href="#" className="text-[#B5B5B5] hover:text-[#FAFAFA] transition-colors">Terms & Conditions</a></li>
              <li><a href="#" className="text-[#B5B5B5] hover:text-[#FAFAFA] transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* COLUMN 3 — Insights */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-[11px] font-semibold text-[#9A9A9A] uppercase tracking-widest">
              INSIGHTS
            </h3>
            <ul className="space-y-3 text-[14px]">
              <li><a href="#resources" className="text-[#B5B5B5] hover:text-[#FAFAFA] transition-colors">Blog</a></li>
              <li><a href="#pitch-deck-guides" className="text-[#B5B5B5] hover:text-[#FAFAFA] transition-colors">Pitch Deck Guides</a></li>
              <li><a href="#fundraising-guides" className="text-[#B5B5B5] hover:text-[#FAFAFA] transition-colors">Fundraising Guides</a></li>
              <li><a href="#outreach-guides" className="text-[#B5B5B5] hover:text-[#FAFAFA] transition-colors">Investor Outreach</a></li>
              <li><a href="#ai-guides" className="text-[#B5B5B5] hover:text-[#FAFAFA] transition-colors">Tools & AI Guides</a></li>
            </ul>
          </div>

          {/* COLUMN 4 — Product */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-[11px] font-semibold text-[#9A9A9A] uppercase tracking-widest">
              PRODUCT
            </h3>
            <ul className="space-y-3 text-[14px]">
              <li><a href="#features" className="text-[#B5B5B5] hover:text-[#FAFAFA] transition-colors">Platform Agents</a></li>
              <li><a href="#pitch-deck-analysis" className="text-[#B5B5B5] hover:text-[#FAFAFA] transition-colors">Pitch Deck Analysis</a></li>
              <li><a href="#pricing" className="text-[#B5B5B5] hover:text-[#FAFAFA] transition-colors">Pricing</a></li>
              <li><a href="#investor-matching" className="text-[#B5B5B5] hover:text-[#FAFAFA] transition-colors">Investor Matching</a></li>
            </ul>
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div className="pt-8 border-t border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[13px] text-[#9A9A9A] text-center">
          Built with 💛 by VentureAI. Copyright © 2026. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
