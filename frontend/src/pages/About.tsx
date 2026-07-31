import React from "react";
import { Link } from "react-router-dom";

export const About: React.FC = () => {
  const stats = [
    { value: "85,000+", label: "Pitch decks analyzed to date" },
    { value: "40+", label: "Institutional VC partners" },
    { value: "99.4%", label: "Extraction accuracy rate" },
    { value: "5", label: "Specialized LangChain agents" },
  ];

  const team = [
    { name: "Shivam Ojha", title: "Co-Founder & CTO", bio: "Visionary leader driving the next generation of AI-powered venture capital.", avatar: "/team/shivam.png" },
    { name: "Shazan", title: "Co-Founder & CEO", bio: "Tech mastermind architecting cutting-edge AI solutions for startup evaluation.", avatar: "/team/shazan.png" },
  ];

  return (
    <div className="pt-16 pb-24 bg-transparent text-[#FAFAFA] min-h-screen selection:bg-[rgba(254,150,56,0.2)] selection:text-[#FE9638]">
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 text-center border-b border-[rgba(255,255,255,0.08)]">
        <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-[rgba(254,150,56,0.12)] text-[#FE9638] border border-[#FE9638]/30 mb-6">
          OUR MISSION
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-[56px] font-extrabold text-[#FAFAFA] tracking-tight max-w-4xl mx-auto mb-6">
          Bringing scientific precision to venture capital due diligence.
        </h1>
        <p className="text-lg sm:text-xl text-[#9A9A9A] max-w-3xl mx-auto leading-relaxed">
          VentureAI was born out of a simple frustration: VC funds evaluate thousands of pitch decks a year using unstructured manual reviews. We built a multi-agent AI pipeline to level the playing field and uncover exceptional founders faster.
        </p>
      </div>

      {/* Stats */}
      <div className="bg-[#141414] py-16 border-b border-[rgba(255,255,255,0.08)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((s, idx) => (
              <div key={idx} className="p-6 bg-[#1C1C1C] rounded-2xl border border-[rgba(255,255,255,0.08)] shadow-lg">
                <div className="text-4xl font-extrabold text-[#FE9638] mb-2">{s.value}</div>
                <div className="text-sm font-medium text-[#9A9A9A]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Narrative */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 space-y-12">
        <div>
          <h2 className="text-3xl font-bold text-[#FAFAFA] mb-4">Why LangChain & Multi-Agent Architecture?</h2>
          <p className="text-base text-[#9A9A9A] leading-relaxed mb-4">
            Single LLM prompts fail at complex due diligence because they suffer from context fatigue and hallucination. By splitting the workflow into five autonomous agents — Summary, Risk, Question Engine, Scoring, and Report Generator — our pipeline verifies claims against data across multiple verification passes.
          </p>
          <p className="text-base text-[#9A9A9A] leading-relaxed">
            Each agent has its own system prompt, structured schema, and memory buffer. The result is an audit-ready investor report backed by Supabase row-level security.
          </p>
        </div>

        {/* Team Leadership */}
        <div className="pt-8 border-t border-[rgba(255,255,255,0.08)]">
          <h2 className="text-3xl font-bold text-[#FAFAFA] mb-8 text-center">Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {team.map((member, idx) => (
              <div key={idx} className="bg-[#141414] p-6 rounded-2xl border border-[rgba(255,255,255,0.08)] hover:border-[#FE9638]/40 transition-all shadow-lg">
                {member.avatar ? (
                  <img src={member.avatar} alt={member.name} className="w-14 h-14 rounded-full mb-4 border border-[#FE9638]/30 object-cover" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-[rgba(254,150,56,0.15)] text-[#FE9638] font-bold text-lg flex items-center justify-center mb-4 border border-[#FE9638]/30">
                    {member.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                  </div>
                )}
                <h3 className="text-lg font-bold text-[#FAFAFA]">{member.name}</h3>
                <div className="text-xs font-bold text-[#FE9638] mb-3">{member.title}</div>
                <p className="text-xs text-[#9A9A9A] leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to action */}
        <div className="mt-16 p-10 bg-[#141414] rounded-3xl text-center text-[#FAFAFA] border border-[rgba(255,255,255,0.08)] relative overflow-hidden shadow-2xl">
          <h3 className="text-2xl sm:text-3xl font-bold mb-4">Ready to upgrade your deal flow?</h3>
          <p className="text-[#9A9A9A] mb-8 max-w-xl mx-auto">See why 40+ top venture funds rely on VentureAI for first-pass evaluations.</p>
          <Link
            to="/register"
            className="inline-flex h-12 px-8 items-center justify-center font-bold text-sm rounded-xl bg-[#FE9638] text-[#0A0A0A] hover:bg-[#E28528] shadow-lg shadow-[#FE9638]/20 transition-all"
          >
            Start Free Evaluation →
          </Link>
        </div>
      </div>
    </div>
  );
};
