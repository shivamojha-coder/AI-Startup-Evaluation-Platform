import React from "react";
import { MapPin, ShieldCheck, ChevronRight } from "lucide-react";
import type { StartupResponse } from "../../schemas/startup";
import { motion } from "framer-motion";

interface StartupHeroProps {
  startup: StartupResponse;
  onEdit: () => void;
}

export const StartupHero: React.FC<StartupHeroProps> = ({ startup, onEdit }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#151515] border border-[#262626] rounded-[22px] p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl relative overflow-hidden"
    >
      {/* Subtle Glow Effect */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF8A24]/5 rounded-full blur-3xl" />

      {/* Left Side */}
      <div className="flex gap-6 items-start z-10">
        <div className="relative group cursor-pointer" onClick={onEdit}>
          <div className="w-24 h-24 rounded-2xl bg-[#0B0B0B] border border-[#262626] flex items-center justify-center overflow-hidden">
            {startup.logo_url ? (
              <img src={startup.logo_url} alt={`${startup.startup_name} logo`} className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-bold text-[#FF8A24]">
                {startup.startup_name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
            <span className="text-xs text-white font-medium">Edit Logo</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white tracking-tight">{startup.startup_name}</h1>
            <div className="bg-[#FF8A24]/10 text-[#FF8A24] text-xs px-2 py-1 rounded-md flex items-center gap-1 font-medium border border-[#FF8A24]/20">
              <ShieldCheck className="w-3 h-3" />
              Verified
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {startup.industry && (
              <span className="bg-[#262626]/50 text-[#A1A1AA] text-sm px-3 py-1 rounded-full border border-[#262626]">
                {startup.industry}
              </span>
            )}
            {startup.stage && (
              <span className="bg-[#262626]/50 text-[#A1A1AA] text-sm px-3 py-1 rounded-full border border-[#262626]">
                {startup.stage}
              </span>
            )}
            <span className="bg-[#262626]/50 text-[#A1A1AA] text-sm px-3 py-1 rounded-full border border-[#262626] flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              India
            </span>
          </div>

          <p className="text-[#A1A1AA] text-sm max-w-xl mt-2 leading-relaxed">
            {startup.tagline || startup.description?.slice(0, 150) + "..."}
          </p>
        </div>
      </div>

      {/* Right Side: Score */}
      <div className="flex flex-col items-end gap-4 z-10 w-full md:w-auto">
        <div className="bg-[#0B0B0B] border border-[#262626] rounded-2xl p-4 flex items-center gap-4 min-w-[240px]">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="28" className="stroke-[#262626]" strokeWidth="6" fill="none" />
              <circle 
                cx="32" cy="32" r="28" 
                className="stroke-[#FF8A24]" 
                strokeWidth="6" fill="none" 
                strokeDasharray={2 * Math.PI * 28} 
                strokeDashoffset={2 * Math.PI * 28 * (1 - 0.83)} 
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-lg font-bold text-white">83%</span>
          </div>
          <div>
            <h3 className="text-white font-semibold">Investment Ready</h3>
            <p className="text-[#A1A1AA] text-xs">AI Scorecard generated</p>
          </div>
        </div>

        <button className="text-[#FF8A24] hover:text-white flex items-center gap-2 text-sm font-medium transition-colors group">
          View AI Scorecard
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};
