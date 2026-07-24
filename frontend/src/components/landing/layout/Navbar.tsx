"use client";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AnnouncementBar } from "../ui/AnnouncementBar";
import { useAuth } from "../../../context/AuthContext";

export const Navbar: React.FC = () => {
  const { user } = useAuth();
  const dashboardHref = user?.role === "investor" ? "/investor/dashboard" : "/founder/dashboard";
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const productsMenu = [
    {
      title: "Investor Matching",
      desc: "Find aligned VCs and angels by stage, sector, fit",
      href: "#investor-matching",
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
        </svg>
      ),
    },
    {
      title: "Pitch Deck Analysis",
      desc: "Investor-style feedback + readiness scoring",
      href: "#pitch-deck-analysis",
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
        </svg>
      ),
    },
    {
      title: "Summary Agent",
      desc: "Executive summaries in seconds",
      href: "#summary-agent",
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      ),
    },
    {
      title: "Risk Analyzer",
      desc: "7-category due diligence map",
      href: "#risk-analyzer",
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      ),
    },
    {
      title: "Scoring Model",
      desc: "Investor Readiness Score (1–100)",
      href: "#scoring-model",
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
        </svg>
      ),
    },
    {
      title: "Report Generator",
      desc: "Instant investment memos & verdicts",
      href: "#report-generator",
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
    },
  ];

  const resourcesMenu = [
    {
      title: "Blog",
      desc: "Latest fundraising insights and sector lists",
      href: "#resources",
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
        </svg>
      ),
    },
    {
      title: "Pitch Deck guides",
      desc: "Best practices to structure your story",
      href: "#pitch-deck-guides",
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
    },
    {
      title: "Fundraising guides",
      desc: "Step-by-step strategies for closing rounds",
      href: "#fundraising-guides",
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>
      ),
    },
    {
      title: "Investor Outreach guides",
      desc: "Templates and workflows for warm intros",
      href: "#outreach-guides",
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      ),
    },
    {
      title: "Tools & AI guides",
      desc: "Leveraging automation in venture evaluations",
      href: "#ai-guides",
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <AnnouncementBar />
      <header
        className={`sticky top-0 left-0 right-0 z-50 h-16 transition-all duration-300 ${
          isScrolled
            ? "bg-[#0A0A0A]/85 backdrop-blur-md border-b border-[rgba(255,255,255,0.08)] shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
            : "bg-[#0A0A0A] border-b border-[rgba(255,255,255,0.08)]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* LEFT: Brand Logo */}
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-1.5 group cursor-pointer"
          >
            <span className="font-bold text-[19px] text-[#FAFAFA] tracking-tight">VentureAI</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#FE9638] inline-block" />
          </Link>

          {/* CENTER: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {/* Products Dropdown */}
            <div
              className="relative py-4"
              onMouseEnter={() => setActiveDropdown("products")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                className="flex items-center gap-1 text-[15px] font-normal text-[#9A9A9A] hover:text-[#FAFAFA] transition-colors duration-150 focus:outline-none cursor-pointer"
              >
                <span>Products</span>
                <svg
                  className={`w-4 h-4 text-[#9A9A9A] transition-transform duration-150 ${activeDropdown === "products" ? "rotate-180 text-[#FAFAFA]" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeDropdown === "products" && (
                <div className="absolute top-full left-0 w-[620px] bg-[#1a1a1a] rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.7)] border border-[#2a2a2a] overflow-hidden animate-fade-in-up z-50 divide-y divide-[#2a2a2a]/60">
                  <div className="grid grid-cols-2 divide-x divide-[#2a2a2a]/40">
                    {productsMenu.slice(0, 2).map((item, idx) => (
                      <a
                        key={idx}
                        href={item.href}
                        className="flex items-start gap-3.5 p-5 transition-colors group/item"
                      >
                        <div className="w-[40px] h-[40px] rounded-lg bg-[#242424] border border-[#333333] flex items-center justify-center shrink-0 group-hover/item:border-[#555555] transition-colors">
                          {item.icon}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-white group-hover/item:text-[#FE9638] transition-colors leading-snug">
                            {item.title}
                          </span>
                          <span className="text-xs text-[#888888] mt-1 leading-relaxed">
                            {item.desc}
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 divide-x divide-[#2a2a2a]/40">
                    {productsMenu.slice(2, 4).map((item, idx) => (
                      <a
                        key={idx + 2}
                        href={item.href}
                        className="flex items-start gap-3.5 p-5 transition-colors group/item"
                      >
                        <div className="w-[40px] h-[40px] rounded-lg bg-[#242424] border border-[#333333] flex items-center justify-center shrink-0 group-hover/item:border-[#555555] transition-colors">
                          {item.icon}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-white group-hover/item:text-[#FE9638] transition-colors leading-snug">
                            {item.title}
                          </span>
                          <span className="text-xs text-[#888888] mt-1 leading-relaxed">
                            {item.desc}
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 divide-x divide-[#2a2a2a]/40">
                    {productsMenu.slice(4).map((item, idx) => (
                      <a
                        key={idx + 4}
                        href={item.href}
                        className="flex items-start gap-3.5 p-5 transition-colors group/item"
                      >
                        <div className="w-[40px] h-[40px] rounded-lg bg-[#242424] border border-[#333333] flex items-center justify-center shrink-0 group-hover/item:border-[#555555] transition-colors">
                          {item.icon}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-white group-hover/item:text-[#FE9638] transition-colors leading-snug">
                            {item.title}
                          </span>
                          <span className="text-xs text-[#888888] mt-1 leading-relaxed">
                            {item.desc}
                          </span>
                        </div>
                      </a>
                    ))}
                    <div className="p-5" />
                  </div>
                </div>
              )}
            </div>

            {/* Resources Dropdown */}
            <div
              className="relative py-4"
              onMouseEnter={() => setActiveDropdown("resources")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                className="flex items-center gap-1 text-[15px] font-normal text-[#9A9A9A] hover:text-[#FAFAFA] transition-colors duration-150 focus:outline-none cursor-pointer"
              >
                <span>Resources</span>
                <svg
                  className={`w-4 h-4 text-[#9A9A9A] transition-transform duration-150 ${activeDropdown === "resources" ? "rotate-180 text-[#FAFAFA]" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeDropdown === "resources" && (
                <div className="absolute top-full left-0 w-[620px] bg-[#1a1a1a] rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.7)] border border-[#2a2a2a] overflow-hidden animate-fade-in-up z-50 divide-y divide-[#2a2a2a]/60">
                  <div className="grid grid-cols-2 divide-x divide-[#2a2a2a]/40">
                    {resourcesMenu.slice(0, 2).map((item, idx) => (
                      <a
                        key={idx}
                        href={item.href}
                        className="flex items-start gap-3.5 p-5 transition-colors group/item"
                      >
                        <div className="w-[40px] h-[40px] rounded-lg bg-[#242424] border border-[#333333] flex items-center justify-center shrink-0 group-hover/item:border-[#555555] transition-colors">
                          {item.icon}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-white group-hover/item:text-[#FE9638] transition-colors leading-snug">
                            {item.title}
                          </span>
                          <span className="text-xs text-[#888888] mt-1 leading-relaxed">
                            {item.desc}
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 divide-x divide-[#2a2a2a]/40">
                    {resourcesMenu.slice(2, 4).map((item, idx) => (
                      <a
                        key={idx + 2}
                        href={item.href}
                        className="flex items-start gap-3.5 p-5 transition-colors group/item"
                      >
                        <div className="w-[40px] h-[40px] rounded-lg bg-[#242424] border border-[#333333] flex items-center justify-center shrink-0 group-hover/item:border-[#555555] transition-colors">
                          {item.icon}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-white group-hover/item:text-[#FE9638] transition-colors leading-snug">
                            {item.title}
                          </span>
                          <span className="text-xs text-[#888888] mt-1 leading-relaxed">
                            {item.desc}
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 divide-x divide-[#2a2a2a]/40">
                    {resourcesMenu.slice(4).map((item, idx) => (
                      <a
                        key={idx + 4}
                        href={item.href}
                        className="flex items-start gap-3.5 p-5 transition-colors group/item"
                      >
                        <div className="w-[40px] h-[40px] rounded-lg bg-[#242424] border border-[#333333] flex items-center justify-center shrink-0 group-hover/item:border-[#555555] transition-colors">
                          {item.icon}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-white group-hover/item:text-[#FE9638] transition-colors leading-snug">
                            {item.title}
                          </span>
                          <span className="text-xs text-[#888888] mt-1 leading-relaxed">
                            {item.desc}
                          </span>
                        </div>
                      </a>
                    ))}
                    <div className="p-5" />
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/about"
              className="text-[15px] font-normal text-[#9A9A9A] hover:text-[#FAFAFA] transition-colors duration-150"
            >
              About
            </Link>
            <a
              href="#pricing"
              className="text-[15px] font-normal text-[#9A9A9A] hover:text-[#FAFAFA] transition-colors duration-150"
            >
              Pricing
            </a>
          </nav>

          {/* RIGHT: Sign In / Dashboard pill button */}
          <div className="hidden md:flex items-center">
            <Link
              to={user ? dashboardHref : "/login"}
              className="inline-flex items-center justify-center gap-2 bg-[#FAFAFA] text-[#0A0A0A] font-semibold text-sm h-[40px] px-5 rounded-full hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 shadow-sm cursor-pointer"
            >
              <span>{user ? "Dashboard" : "Sign In"}</span>
              <span className="font-bold">→</span>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#FAFAFA] hover:bg-[rgba(255,255,255,0.06)] focus:outline-none cursor-pointer"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#141414] border-b border-[rgba(255,255,255,0.08)] px-4 pt-4 pb-6 space-y-4 shadow-2xl">
            <div className="grid gap-2">
              <div className="text-xs font-semibold uppercase tracking-widest text-[#FE9638] px-3 pt-2">Products</div>
              {productsMenu.map((item, idx) => (
                <a
                  key={`mob-prod-${idx}`}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#FAFAFA] rounded-lg hover:bg-[rgba(255,255,255,0.04)]"
                >
                  <div className="w-7 h-7 rounded-md bg-[#242424] border border-[#333333] flex items-center justify-center shrink-0">
                    {React.cloneElement(item.icon, { className: "w-4 h-4 text-white" })}
                  </div>
                  <span>{item.title}</span>
                </a>
              ))}
              <div className="text-xs font-semibold uppercase tracking-widest text-[#FE9638] px-3 pt-3">Resources</div>
              {resourcesMenu.map((item, idx) => (
                <a
                  key={`mob-res-${idx}`}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#FAFAFA] rounded-lg hover:bg-[rgba(255,255,255,0.04)]"
                >
                  <div className="w-7 h-7 rounded-md bg-[#242424] border border-[#333333] flex items-center justify-center shrink-0">
                    {React.cloneElement(item.icon, { className: "w-4 h-4 text-white" })}
                  </div>
                  <span>{item.title}</span>
                </a>
              ))}
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-3 text-base font-medium text-[#FAFAFA] rounded-lg hover:bg-[rgba(255,255,255,0.04)] border-t border-[rgba(255,255,255,0.08)] mt-2"
              >
                About
              </Link>
              <a
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-3 text-base font-medium text-[#FAFAFA] rounded-lg hover:bg-[rgba(255,255,255,0.04)]"
              >
                Pricing
              </a>
            </div>
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to={user ? dashboardHref : "/login"}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#FAFAFA] text-[#0A0A0A] font-semibold text-sm h-[44px] px-5 rounded-full hover:bg-white cursor-pointer"
              >
                <span>{user ? "Dashboard" : "Sign In"}</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
