import React from "react";
import { Pricing as PricingSection } from "../components/landing/sections/Pricing";
import { Faq as FaqSection } from "../components/landing/sections/Faq";

export const Pricing: React.FC = () => {
  return (
    <div className="bg-[#0A0A0A] text-[#FAFAFA] min-h-[calc(100vh-64px)] py-12 selection:bg-[rgba(254,150,56,0.2)] selection:text-[#FE9638]">
      <PricingSection />
      <FaqSection />
    </div>
  );
};
