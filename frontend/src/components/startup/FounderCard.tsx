import React from "react";
import { Users, Mail, Star, Globe, Edit3 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import type { StartupResponse } from "../../schemas/startup";

interface FounderCardProps {
  startup?: StartupResponse;
}

export const FounderCard: React.FC<FounderCardProps> = ({ startup }) => {
  const { user } = useAuth();

  const founderName = user?.name || "Founder";
  const founderRole = user?.headline || "Founder & CEO";
  const founderEmail = user?.email || "";
  const founderLinkedin = user?.linkedin_url || startup?.linkedin_url || "";
  const founderPhoto = user?.profile_photo_url || "";
  const founderBio = user?.bio || "";

  return (
    <div className="bg-[#151515] border border-[#262626] rounded-[22px] p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0B0B0B] border border-[#262626] flex items-center justify-center">
            <Users className="w-5 h-5 text-[#FF8A24]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Founding Team</h3>
            <p className="text-xs text-[#A1A1AA]">Leadership and key contributors</p>
          </div>
        </div>
        <Link 
          to="/founder/profile" 
          className="flex items-center gap-2 px-4 py-2 bg-[#FF8A24]/10 hover:bg-[#FF8A24]/20 text-[#FF8A24] rounded-lg transition-colors text-sm font-medium border border-[#FF8A24]/20"
        >
          <Edit3 className="w-4 h-4" />
          Edit Profile
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="bg-[#0B0B0B] border border-[#262626] rounded-2xl p-6 flex flex-col gap-5 relative overflow-hidden group hover:border-[#FF8A24]/30 transition-colors">
          <div className="absolute top-0 right-0 bg-[#FF8A24]/10 text-[#FF8A24] text-[10px] uppercase font-bold px-3 py-1 rounded-bl-xl border-l border-b border-[#FF8A24]/20 flex items-center gap-1">
            <Star className="w-3 h-3 fill-[#FF8A24]" />
            Primary Founder
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-[#151515] border border-[#262626] flex items-center justify-center overflow-hidden shrink-0">
              {founderPhoto ? (
                <img src={founderPhoto} alt={founderName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-[#FF8A24]">{founderName.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="flex-1 min-w-0 pr-24">
              <h4 className="text-lg font-semibold text-white truncate">{founderName}</h4>
              <p className="text-[#FF8A24] text-xs font-medium mt-0.5">{founderRole}</p>
              {founderBio && (
                <p className="text-[#A1A1AA] text-xs mt-2 line-clamp-2 leading-relaxed">{founderBio}</p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#1C1C1C]">
            {founderLinkedin ? (
              <a 
                href={founderLinkedin.startsWith("http") ? founderLinkedin : `https://${founderLinkedin}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex-1 min-w-[130px] flex items-center justify-center gap-2 py-2.5 px-4 bg-[#151515] hover:bg-[#202020] border border-[#262626] rounded-xl text-xs font-semibold text-white transition-colors"
              >
                <Globe className="w-4 h-4 text-[#0A66C2]" />
                LinkedIn
              </a>
            ) : (
              <Link
                to="/founder/profile"
                className="flex-1 min-w-[130px] flex items-center justify-center gap-2 py-2.5 px-4 bg-[#151515] hover:bg-[#202020] border border-dashed border-[#333] rounded-xl text-xs font-medium text-[#777] transition-colors"
              >
                + Add LinkedIn
              </Link>
            )}

            {founderEmail && (
              <a 
                href={`mailto:${founderEmail}`} 
                className="flex-1 min-w-[130px] flex items-center justify-center gap-2 py-2.5 px-4 bg-[#151515] hover:bg-[#202020] border border-[#262626] rounded-xl text-xs font-semibold text-[#A1A1AA] hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-[#FF8A24]" />
                {founderEmail}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
