import React from "react";
import { Globe, ExternalLink, Edit3 } from "lucide-react";
import type { StartupResponse } from "../../schemas/startup";

interface OnlinePresenceCardProps {
  startup: StartupResponse;
  onEdit: () => void;
}

export const OnlinePresenceCard: React.FC<OnlinePresenceCardProps> = ({ startup, onEdit }) => {
  const links = [
    { label: "Website", url: startup.website, icon: <Globe className="w-4 h-4 text-[#A1A1AA]" /> },
    { label: "LinkedIn", url: startup.linkedin_url, icon: <Globe className="w-4 h-4 text-[#A1A1AA]" /> },
    { label: "Twitter / X", url: null, icon: <Globe className="w-4 h-4 text-[#A1A1AA]" /> },
    { label: "GitHub", url: null, icon: <Globe className="w-4 h-4 text-[#A1A1AA]" /> },
    { label: "Product Hunt", url: null, icon: <div className="w-4 h-4 flex items-center justify-center rounded-full bg-[#FF6154] text-white text-[10px] font-bold">P</div> },
  ];

  return (
    <div className="bg-[#151515] border border-[#262626] rounded-[22px] p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0B0B0B] border border-[#262626] flex items-center justify-center">
            <Globe className="w-5 h-5 text-[#FF8A24]" />
          </div>
          <h3 className="text-lg font-semibold text-white">Online Presence</h3>
        </div>
        <button 
          onClick={onEdit}
          className="flex items-center gap-2 px-4 py-2 bg-[#262626]/50 hover:bg-[#262626] text-white rounded-lg transition-colors text-sm font-medium border border-[#262626]"
        >
          <Edit3 className="w-4 h-4" />
          Edit
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {links.map((link, idx) => (
          <div key={idx} className="flex items-center justify-between bg-[#0B0B0B] border border-[#262626] rounded-xl px-5 py-4 group hover:border-[#FF8A24]/30 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-[#151515] border border-[#262626] flex items-center justify-center">
                {link.icon}
              </div>
              <span className="text-sm font-medium text-white">{link.label}</span>
            </div>
            
            {link.url ? (
              <a 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-[#FF8A24] hover:text-white transition-colors"
              >
                <span className="truncate max-w-[200px] hidden md:block">{link.url.replace(/^https?:\/\//, '')}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            ) : (
              <span className="text-sm text-[#A1A1AA] italic">Not provided</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
