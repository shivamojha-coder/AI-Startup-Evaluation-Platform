import React, { useState } from "react";

export const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="pt-16 pb-24 bg-[#0A0A0A] text-[#FAFAFA] min-h-screen selection:bg-[rgba(254,150,56,0.2)] selection:text-[#FE9638]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left info */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-[rgba(254,150,56,0.12)] text-[#FE9638] border border-[#FE9638]/30 mb-6">
                GET IN TOUCH
              </span>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-[#FAFAFA] tracking-tight mb-6">
                Let&apos;s talk deal flow.
              </h1>
              <p className="text-base text-[#9A9A9A] leading-relaxed">
                Have questions about our LangChain agent pipeline, SOC 2 compliance, or custom scoring thesis integration? Our engineering and partnership teams are ready to assist.
              </p>
            </div>

            <div className="space-y-6 pt-6 border-t border-[rgba(255,255,255,0.08)]">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[rgba(254,150,56,0.15)] text-[#FE9638] border border-[#FE9638]/30 flex items-center justify-center shrink-0">
                  ✉
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#FAFAFA]">Email Us</h4>
                  <p className="text-sm text-[#9A9A9A]">partnerships@ventureai.com</p>
                  <p className="text-xs text-[#666666] mt-0.5">We typically respond within 2 hours.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[rgba(254,150,56,0.15)] text-[#FE9638] border border-[#FE9638]/30 flex items-center justify-center shrink-0">
                  🛡
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#FAFAFA]">Security & Compliance</h4>
                  <p className="text-sm text-[#9A9A9A]">security@ventureai.com</p>
                  <p className="text-xs text-[#666666] mt-0.5">Request our SOC 2 Type II report or NDA.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right form */}
          <div className="lg:col-span-7 bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-3xl p-8 sm:p-10 shadow-2xl">
            {submitted ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[rgba(52,211,153,0.15)] text-[#34D399] border border-[#34D399]/30 text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                  ✓
                </div>
                <h3 className="text-2xl font-bold text-[#FAFAFA]">Message Received</h3>
                <p className="text-sm text-[#9A9A9A] max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out. A senior onboarding specialist from VentureAI will review your inquiry and contact you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-[#FE9638] text-[#0A0A0A] font-bold text-sm hover:bg-[#E28528] transition-all cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="text-2xl font-bold text-[#FAFAFA] mb-2">Send us a message</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#9A9A9A] mb-2">First Name</label>
                    <input
                      required
                      type="text"
                      placeholder="Sarah"
                      className="w-full h-11 px-4 rounded-xl bg-[#1C1C1C] border border-[rgba(255,255,255,0.12)] text-sm text-[#FAFAFA] placeholder-[#666666] focus:outline-none focus:border-[#FE9638] focus:ring-1 focus:ring-[#FE9638]/30 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#9A9A9A] mb-2">Last Name</label>
                    <input
                      required
                      type="text"
                      placeholder="Jenkins"
                      className="w-full h-11 px-4 rounded-xl bg-[#1C1C1C] border border-[rgba(255,255,255,0.12)] text-sm text-[#FAFAFA] placeholder-[#666666] focus:outline-none focus:border-[#FE9638] focus:ring-1 focus:ring-[#FE9638]/30 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#9A9A9A] mb-2">Work Email</label>
                    <input
                      required
                      type="email"
                      placeholder="sarah@apexventures.com"
                      className="w-full h-11 px-4 rounded-xl bg-[#1C1C1C] border border-[rgba(255,255,255,0.12)] text-sm text-[#FAFAFA] placeholder-[#666666] focus:outline-none focus:border-[#FE9638] focus:ring-1 focus:ring-[#FE9638]/30 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#9A9A9A] mb-2">Organization Type</label>
                    <select className="w-full h-11 px-4 rounded-xl bg-[#1C1C1C] border border-[rgba(255,255,255,0.12)] text-sm text-[#FAFAFA] focus:outline-none focus:border-[#FE9638] focus:ring-1 focus:ring-[#FE9638]/30 transition-all">
                      <option className="bg-[#141414] text-[#FAFAFA]">VC Fund</option>
                      <option className="bg-[#141414] text-[#FAFAFA]">Startup Incubator / Accelerator</option>
                      <option className="bg-[#141414] text-[#FAFAFA]">Angel Syndicate</option>
                      <option className="bg-[#141414] text-[#FAFAFA]">Founder / Startup</option>
                      <option className="bg-[#141414] text-[#FAFAFA]">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#9A9A9A] mb-2">How can we help?</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us about your deal flow volume and evaluation requirements..."
                    className="w-full p-4 rounded-xl bg-[#1C1C1C] border border-[rgba(255,255,255,0.12)] text-sm text-[#FAFAFA] placeholder-[#666666] focus:outline-none focus:border-[#FE9638] focus:ring-1 focus:ring-[#FE9638]/30 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-12 inline-flex items-center justify-center font-bold text-base rounded-xl bg-[#FE9638] text-[#0A0A0A] hover:bg-[#E28528] shadow-lg shadow-[#FE9638]/20 transition-all cursor-pointer"
                >
                  Submit Inquiry →
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
