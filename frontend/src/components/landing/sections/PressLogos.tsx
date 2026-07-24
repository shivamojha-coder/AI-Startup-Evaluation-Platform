import React from "react";

export const PressLogos: React.FC = () => {
  const mediaLogos = [
    "TechCrunch",
    "Bloomberg",
    "VentureBeat",
    "Forbes",
  ];

  return (
    <section className="bg-[#0A0A0A] py-14 border-t border-[rgba(255,255,255,0.08)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h3 className="text-[13px] font-medium text-[#9A9A9A] tracking-[0.05em] uppercase mb-8">
          Featured in &amp; Backed by Research
        </h3>

        <div className="flex flex-wrap items-center justify-center gap-12 sm:gap-20 md:gap-28">
          {mediaLogos.map((name, idx) => (
            <div
              key={idx}
              className="opacity-35 hover:opacity-85 transition-opacity duration-200 cursor-default select-none group"
            >
              <span className="text-xl sm:text-2xl font-black tracking-tighter text-[#FAFAFA]">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
