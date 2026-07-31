"use client";

import React from "react";
import { CountUp } from "../ui/CountUp";

export const StatsCounter: React.FC = () => {
  const metrics = [
    { valueString: "< 5 min", label: "Full report generation time" },
    { valueString: "1–100", label: "Weighted scoring scale" },
    { endNum: 24, label: "Due-diligence questions generated per deck" },
    { endNum: 7, label: "Risk categories analyzed" },
  ];

  return (
    <section className="bg-transparent py-16 border-y border-[rgba(255,255,255,0.08)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-xl p-8 border-t-[3px] !border-t-[#FE9638] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(254,150,56,0.12)] hover:-translate-y-1 hover:border-[rgba(255,255,255,0.18)]"
            >
              <div className="text-4xl md:text-[48px] font-extrabold text-[#FAFAFA] tracking-tight mb-2">
                {item.endNum ? <CountUp end={item.endNum} duration={2000} /> : item.valueString}
              </div>
              <div className="text-sm font-normal text-[#9A9A9A] leading-snug">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
