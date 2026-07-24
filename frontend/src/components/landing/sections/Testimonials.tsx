"use client";

import React from "react";
import { SectionHeader } from "../ui/SectionHeader";
import { ScrollReveal } from "../ui/ScrollReveal";

export const Testimonials: React.FC = () => {
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

  return (
    <section className="bg-[#0A0A0A] py-24 border-t border-[rgba(255,255,255,0.08)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="FOUNDER & INVESTOR LOVE"
          headline="Loved by the Startup Ecosystem"
          subheadline="See how VentureAI accelerates fundraising and venture diligence."
          centered={true}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {testimonials.map((item, idx) => (
            <ScrollReveal key={idx} animation="fade-up" delay={idx * 150} className="h-full">
              <div
                className="bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 flex flex-col justify-between h-full transition-all duration-300 hover:shadow-[0_16px_40px_rgba(254,150,56,0.10)] hover:-translate-y-1.5 hover:border-[#FE9638]/40"
              >
                <div>
                  {/* 5 Stars */}
                  <div className="flex items-center gap-1 mb-6 text-[#FE9638]">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  <p className="italic text-[16px] font-normal text-[#B5B5B5] leading-relaxed mb-8">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-3.5 pt-5 border-t border-[rgba(255,255,255,0.08)]">
                  <div className="w-11 h-11 rounded-full bg-[rgba(254,150,56,0.12)] border border-[#FE9638]/30 text-[#FE9638] font-bold text-sm flex items-center justify-center shrink-0">
                    {item.initials}
                  </div>
                  <div>
                    <div className="font-bold text-[#FAFAFA] text-base leading-tight">
                      {item.name}
                    </div>
                    <div className="text-xs text-[#9A9A9A] mt-0.5">
                      {item.title}, <span className="text-[#FE9638] font-semibold">{item.org}</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
