import React from "react";
import { Navbar } from "../components/landing/layout/Navbar";
import { Hero } from "../components/landing/sections/Hero";
import { LogoStrip } from "../components/landing/sections/LogoStrip";
import { ProductPillars } from "../components/landing/sections/ProductPillars";
import { FeatureShowcase } from "../components/landing/sections/FeatureShowcase";
import { HowItWorks } from "../components/landing/sections/HowItWorks";
import { ComingSoon } from "../components/landing/sections/ComingSoon";
import { Testimonials } from "../components/landing/sections/Testimonials";
import { StatsCounter } from "../components/landing/sections/StatsCounter";
import { Pricing } from "../components/landing/sections/Pricing";
import { BlogStrip } from "../components/landing/sections/BlogStrip";
import { PressLogos } from "../components/landing/sections/PressLogos";
import { Faq } from "../components/landing/sections/Faq";
import { CtaBanner } from "../components/landing/sections/CtaBanner";
import { Footer } from "../components/landing/layout/Footer";
import { ScrollReveal } from "../components/landing/ui/ScrollReveal";

export const PlatformHomepage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0A] text-[#FAFAFA] font-sans selection:bg-[rgba(254,150,56,0.2)] selection:text-[#FE9638]">
      {/* [SECTION 1] ANNOUNCEMENT BAR & STICKY NAVBAR */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow">
        {/* [SECTION 2] HERO SECTION */}
        <Hero />

        {/* [SECTION 3] LOGO STRIP (Social Proof) */}
        <ScrollReveal animation="fade-in" duration={800}>
          <LogoStrip />
        </ScrollReveal>

        {/* [SECTION 4] TWIN PRODUCT PILLARS */}
        <ScrollReveal animation="fade-up">
          <ProductPillars />
        </ScrollReveal>

        {/* [SECTION 5] FEATURE SHOWCASE (Deep Dive Tab/Grid System) */}
        <ScrollReveal animation="fade-up">
          <FeatureShowcase />
        </ScrollReveal>

        {/* [SECTION 6] HOW IT WORKS (4-Step Flow) */}
        <ScrollReveal animation="fade-up">
          <HowItWorks />
        </ScrollReveal>

        {/* [SECTION 7] COMING SOON / AGENT ECOSYSTEM EXPANSION */}
        <ScrollReveal animation="fade-up">
          <ComingSoon />
        </ScrollReveal>

        {/* [SECTION 8] TESTIMONIALS */}
        <ScrollReveal animation="fade-up">
          <Testimonials />
        </ScrollReveal>

        {/* [SECTION 9] STATS COUNTER STRIP */}
        <ScrollReveal animation="scale-up" duration={600}>
          <StatsCounter />
        </ScrollReveal>

        {/* [SECTION 10] PRICING (Investor & Founder Tiers) */}
        <ScrollReveal animation="fade-up">
          <Pricing />
        </ScrollReveal>

        {/* [SECTION 11] BLOG STRIP (SEO / Education Hub) */}
        <ScrollReveal animation="fade-up">
          <BlogStrip />
        </ScrollReveal>

        {/* [SECTION 12] PRESS & MEDIA LOGOS (Authority Proof) */}
        <ScrollReveal animation="fade-in" duration={800}>
          <PressLogos />
        </ScrollReveal>

        {/* [SECTION 13] FAQ ARCHIVE / ACCORDION */}
        <ScrollReveal animation="fade-up">
          <Faq />
        </ScrollReveal>

        {/* [SECTION 14] FINAL CTA BANNER */}
        <ScrollReveal animation="scale-up" duration={800}>
          <CtaBanner />
        </ScrollReveal>
      </main>

      {/* [SECTION 15] FOOTER */}
      <Footer />
    </div>
  );
};
