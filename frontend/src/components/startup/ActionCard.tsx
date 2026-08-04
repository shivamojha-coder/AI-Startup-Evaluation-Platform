import React from "react";
import { Eye, Rocket, Sparkles, ArrowRight } from "lucide-react";

export const ActionCard: React.FC = () => {
  const actions = [
    {
      title: "Preview Investor Profile",
      description: "See how investors view your startup",
      icon: <Eye className="w-6 h-6 text-purple-400" />,
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      hover: "hover:border-purple-500/50"
    },
    {
      title: "Generate AI Report",
      description: "Get detailed analysis and scoring",
      icon: <Sparkles className="w-6 h-6 text-blue-400" />,
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      hover: "hover:border-blue-500/50"
    },
    {
      title: "Publish Startup",
      description: "Make profile visible to investors",
      icon: <Rocket className="w-6 h-6 text-[#FF8A24]" />,
      bg: "bg-[#FF8A24]/10",
      border: "border-[#FF8A24]/20",
      hover: "hover:border-[#FF8A24]/50"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
      {actions.map((action, idx) => (
        <button 
          key={idx}
          className={`flex flex-col items-start gap-4 p-6 bg-[#151515] border border-[#262626] ${action.hover} rounded-[22px] transition-all group text-left relative overflow-hidden`}
        >
          {/* Subtle glow on hover */}
          <div className={`absolute top-0 right-0 w-32 h-32 ${action.bg} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`} />
          
          <div className={`w-12 h-12 rounded-xl ${action.bg} ${action.border} border flex items-center justify-center relative z-10`}>
            {action.icon}
          </div>
          
          <div className="relative z-10">
            <h4 className="text-white font-semibold text-lg mb-1">{action.title}</h4>
            <p className="text-[#A1A1AA] text-sm">{action.description}</p>
          </div>

          <div className="mt-2 text-[#A1A1AA] group-hover:text-white transition-colors flex items-center gap-2 text-sm font-medium relative z-10">
            Action <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      ))}
    </div>
  );
};
