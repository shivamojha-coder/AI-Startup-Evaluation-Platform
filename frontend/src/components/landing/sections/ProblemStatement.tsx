import React from "react";

export const ProblemStatement: React.FC = () => {
  return (
    <section className="bg-[#F9FAFB] py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* LEFT COLUMN (40%) */}
          <div className="lg:col-span-5">
            <div className="text-[12px] font-semibold tracking-widest uppercase text-[#4361EE] mb-3">
              THE PROBLEM
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-[48px] font-bold text-[#111827] leading-[1.1] mb-8 max-w-[400px]">
              Manual due diligence is broken.
            </h2>

            <div className="space-y-6">
              <div className="border-l-3 border-[#4361EE] pl-4 my-3">
                <p className="text-[17px] font-normal text-[#374151] leading-relaxed">
                  6–10 hours per pitch deck, every analyst, every deal.
                </p>
              </div>
              <div className="border-l-3 border-[#4361EE] pl-4 my-3">
                <p className="text-[17px] font-normal text-[#374151] leading-relaxed">
                  Inconsistent assessments — gut feel over structured data.
                </p>
              </div>
              <div className="border-l-3 border-[#4361EE] pl-4 my-3">
                <p className="text-[17px] font-normal text-[#374151] leading-relaxed">
                  Slow pipelines miss the best deals first.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (60%) */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* BEFORE card */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm border-l-4 !border-l-[#EF4444]">
              <h3 className="text-xl font-bold text-[#111827] mb-6 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                Without VentureAI
              </h3>
              <ul className="space-y-4 text-[15px] text-[#374151]">
                <li className="flex items-start gap-3">
                  <span className="text-[#EF4444] font-bold shrink-0 text-lg leading-none">✗</span>
                  <span>6–10 hours per deck</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#EF4444] font-bold shrink-0 text-lg leading-none">✗</span>
                  <span>No structured risk map</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#EF4444] font-bold shrink-0 text-lg leading-none">✗</span>
                  <span>Analyst bias and inconsistency</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#EF4444] font-bold shrink-0 text-lg leading-none">✗</span>
                  <span>No repeatable scoring model</span>
                </li>
              </ul>
            </div>

            {/* AFTER card */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm border-l-4 !border-l-[#10B981]">
              <h3 className="text-xl font-bold text-[#111827] mb-6 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                With VentureAI
              </h3>
              <ul className="space-y-4 text-[15px] text-[#374151]">
                <li className="flex items-start gap-3">
                  <span className="text-[#10B981] font-bold shrink-0 text-lg leading-none">✓</span>
                  <span className="font-medium text-[#111827]">Full report in under 5 minutes</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#10B981] font-bold shrink-0 text-lg leading-none">✓</span>
                  <span className="font-medium text-[#111827]">7-category risk breakdown</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#10B981] font-bold shrink-0 text-lg leading-none">✓</span>
                  <span className="font-medium text-[#111827]">Weighted score from 1–100</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#10B981] font-bold shrink-0 text-lg leading-none">✓</span>
                  <span className="font-medium text-[#111827]">Consistent across every deck</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
