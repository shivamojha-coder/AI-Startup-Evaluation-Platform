"use client";

import React from "react";
import { Button } from "../ui/Button";

export const CtaBanner: React.FC = () => {
  return (
    <section id="signup" className="bg-[#141414] py-28 relative overflow-hidden border-t border-[rgba(255,255,255,0.08)]">
      {/* Ambient background glow */}
      <div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[900px] h-[450px] pointer-events-none z-0 animate-glow-pulse"
        style={{
          background: "radial-gradient(ellipse at center bottom, rgba(254,150,56,0.22), transparent 75%)",
        }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center flex flex-col items-center">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center px-4 py-1 rounded-full text-[12px] font-bold tracking-widest uppercase mb-6 bg-[rgba(254,150,56,0.15)] border border-[rgba(254,150,56,0.3)] text-[#FE9638]">
          START EVALUATING TODAY
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-5xl md:text-[52px] font-extrabold text-[#FAFAFA] leading-[1.12] mb-6 tracking-tight max-w-3xl">
          Your next great investment is waiting in a PDF.
        </h2>

        {/* Sub */}
        <p className="text-lg sm:text-xl font-normal text-[#B5B5B5] leading-relaxed max-w-2xl mb-12">
          Upload a pitch deck and get a comprehensive AI evaluation in under 5 minutes. No credit card required.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Button
            variant="solid"
            size="lg"
            onClick={() => { window.location.href = "/register"; }}
            className="w-full sm:w-auto !font-bold !px-8 !py-4 shadow-xl shadow-[#FE9638]/25 text-base"
          >
            Evaluate Your First Deck →
          </Button>
          <a
            href="#contact"
            className="inline-flex items-center justify-center py-3.5 px-8 rounded-xl font-semibold text-base text-[#FAFAFA] border border-[rgba(255,255,255,0.16)] hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.3)] transition-all w-full sm:w-auto cursor-pointer"
          >
            Book an Enterprise Demo
          </a>
        </div>
      </div>
    </section>
  );
};
