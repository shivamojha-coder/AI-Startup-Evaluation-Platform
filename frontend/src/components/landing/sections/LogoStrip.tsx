import React from "react";

export const LogoStrip: React.FC = () => {
  const logos = [
    "Y Combinator",
    "Techstars",
    "Product Hunt",
    "Launch",
    "Antler",
  ];

  return (
    <section className="bg-transparent py-12 border-t border-[rgba(255,255,255,0.08)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 text-center">
        <h3 className="text-[13px] font-medium text-[#9A9A9A] tracking-[0.05em] uppercase">
          Trusted by founders from
        </h3>
      </div>

      {/* Marquee Container */}
      <div className="relative w-full overflow-hidden flex">
        {/* Gradient edge fade for smooth marquee entrance/exit */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#0A0A0A] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#0A0A0A] to-transparent z-10 pointer-events-none" />

        <div className="flex whitespace-nowrap animate-marquee items-center gap-16 md:gap-28">
          {/* Repeat array for infinite seamless horizontal loop */}
          {[...logos, ...logos, ...logos, ...logos].map((name, index) => (
            <div
              key={index}
              className="flex items-center gap-2 opacity-40 hover:opacity-80 transition-opacity duration-200 cursor-default shrink-0 group"
            >
              <span className="text-xl md:text-2xl font-extrabold tracking-tight text-[#FAFAFA]">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
