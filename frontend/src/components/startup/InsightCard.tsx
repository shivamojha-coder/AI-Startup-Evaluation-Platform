import React from "react";
import { Sparkles, Check, AlertTriangle, RefreshCw } from "lucide-react";

export const InsightCard: React.FC = () => {
  return (
    <div className="bg-[#151515] border border-[#262626] rounded-[22px] p-6 lg:p-8 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0B0B0B] border border-[#262626] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">AI Insights</h3>
            <p className="text-[#A1A1AA] text-xs">Based on your current profile</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors text-sm font-medium border border-blue-500/20">
          <RefreshCw className="w-4 h-4" />
          Regenerate
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        <div className="bg-[#0B0B0B] border border-[#262626] rounded-2xl p-6">
          <h4 className="text-white font-medium mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            Strengths
          </h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <Check className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
              <span className="text-[#A1A1AA] text-sm">Strong product positioning with clear value proposition</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
              <span className="text-[#A1A1AA] text-sm">Great market opportunity in a growing sector</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
              <span className="text-[#A1A1AA] text-sm">Experienced founding team with relevant domain expertise</span>
            </li>
          </ul>
        </div>

        <div className="bg-[#0B0B0B] border border-[#262626] rounded-2xl p-6">
          <h4 className="text-white font-medium mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#FF8A24]" />
            Areas to Improve
          </h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-[#FF8A24] shrink-0 mt-0.5" />
              <span className="text-[#A1A1AA] text-sm">Add missing funding details to improve investor confidence</span>
            </li>
            <li className="flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-[#FF8A24] shrink-0 mt-0.5" />
              <span className="text-[#A1A1AA] text-sm">Upload financial projections to unlock detailed AI scoring</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
