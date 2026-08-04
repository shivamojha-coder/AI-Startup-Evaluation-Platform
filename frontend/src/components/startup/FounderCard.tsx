import React from "react";
import { Users, Plus, Mail, Star, Globe } from "lucide-react";

export const FounderCard: React.FC = () => {
  // Mock data as requested
  const founders = [
    {
      name: "Alex Rivera",
      role: "CEO & Co-Founder",
      email: "alex@startup.com",
      linkedin: "https://linkedin.com",
      avatar: "",
      isPrimary: true
    },
    {
      name: "Sarah Chen",
      role: "CTO & Co-Founder",
      email: "sarah@startup.com",
      linkedin: "https://linkedin.com",
      avatar: "",
      isPrimary: false
    }
  ];

  return (
    <div className="bg-[#151515] border border-[#262626] rounded-[22px] p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0B0B0B] border border-[#262626] flex items-center justify-center">
            <Users className="w-5 h-5 text-[#FF8A24]" />
          </div>
          <h3 className="text-lg font-semibold text-white">Founders</h3>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#FF8A24]/10 hover:bg-[#FF8A24]/20 text-[#FF8A24] rounded-lg transition-colors text-sm font-medium border border-[#FF8A24]/20">
          <Plus className="w-4 h-4" />
          Add Founder
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {founders.map((founder, idx) => (
          <div key={idx} className="bg-[#0B0B0B] border border-[#262626] rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden group hover:border-[#FF8A24]/30 transition-colors">
            {founder.isPrimary && (
              <div className="absolute top-0 right-0 bg-[#FF8A24]/10 text-[#FF8A24] text-[10px] uppercase font-bold px-3 py-1 rounded-bl-xl border-l border-b border-[#FF8A24]/20 flex items-center gap-1">
                <Star className="w-3 h-3 fill-[#FF8A24]" />
                Primary
              </div>
            )}
            
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#151515] border border-[#262626] flex items-center justify-center overflow-hidden">
                {founder.avatar ? (
                  <img src={founder.avatar} alt={founder.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl font-bold text-[#A1A1AA]">{founder.name.charAt(0)}</span>
                )}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white">{founder.name}</h4>
                <p className="text-[#A1A1AA] text-sm">{founder.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <a href={founder.linkedin} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#151515] hover:bg-[#262626] border border-[#262626] rounded-xl text-sm font-medium text-white transition-colors">
                <Globe className="w-4 h-4 text-[#0A66C2]" />
                LinkedIn
              </a>
              <a href={`mailto:${founder.email}`} className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#151515] hover:bg-[#262626] border border-[#262626] rounded-xl text-sm font-medium text-white transition-colors">
                <Mail className="w-4 h-4 text-[#A1A1AA]" />
                Email
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
