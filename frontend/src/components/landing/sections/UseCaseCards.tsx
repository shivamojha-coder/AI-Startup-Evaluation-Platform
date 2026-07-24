import React from "react";
import { SectionHeader } from "../ui/SectionHeader";
import { ScrollReveal } from "../ui/ScrollReveal";

export const UseCaseCards: React.FC = () => {
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

  return (
    <section id="use-cases" className="bg-[#F9FAFB] py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="FOR YOUR TEAM"
          headline="Built for every stage of the deal flow"
          centered={true}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {useCases.map((item, idx) => (
            <ScrollReveal key={idx} animation="fade-up" delay={idx * 150} className="h-full">
              <div
                className={`bg-white border border-[#E5E7EB] rounded-2xl p-8 flex flex-col justify-between h-full transition-all duration-300 hover:shadow-[0_20px_40px_rgba(67,97,238,0.18)] hover:-translate-y-2 hover:border-[#4361EE]/40 relative group ${
                  item.featured ? "border-t-4 !border-t-[#4361EE] shadow-md md:-translate-y-2 hover:md:-translate-y-4" : ""
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#EEF2FF] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#4361EE] group-hover:text-white transition-all duration-300">
                      {React.cloneElement(item.icon, { className: "w-6 h-6 text-inherit transition-colors" })}
                    </div>
                    {item.badge && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#EEF2FF] text-[#4361EE] border border-[#C7D2FE] animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <div className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2 group-hover:text-[#4361EE] transition-colors">
                    {item.role}
                  </div>
                  <h3 className="text-2xl font-bold text-[#111827] mb-4">
                    {item.headline}
                  </h3>
                  <p className="text-base text-[#6B7280] leading-relaxed mb-8">
                    {item.body}
                  </p>
                </div>

                <div>
                  <a
                    href="#cta"
                    className="inline-flex items-center font-semibold text-sm text-[#4361EE] hover:underline group-hover:translate-x-1 transition-transform"
                  >
                    <span>{item.linkText}</span>
                  </a>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
