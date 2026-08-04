import React from "react";
import { CheckCircle2, FileText, Sparkles, Eye, ArrowRight } from "lucide-react";

export const QuickStatusCards: React.FC = () => {
  const cards = [
    {
      title: "Profile Completion",
      value: "75%",
      subtitle: "6 of 8 sections completed",
      icon: <CheckCircle2 className="w-5 h-5 text-purple-400" />,
      type: "progress",
      progress: 75,
    },
    {
      title: "Pitch Deck",
      value: "Uploaded",
      subtitle: "Updated 2 days ago",
      icon: <FileText className="w-5 h-5 text-green-400" />,
      type: "status",
    },
    {
      title: "AI Report",
      value: "Ready",
      subtitle: "Generated Oct 12",
      icon: <Sparkles className="w-5 h-5 text-blue-400" />,
      type: "status",
    },
    {
      title: "Investor Visibility",
      value: "Not Published",
      subtitle: "Requires full profile",
      icon: <Eye className="w-5 h-5 text-[#FF8A24]" />,
      type: "action",
      actionText: "Publish",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <div 
          key={idx}
          className="bg-[#151515] border border-[#262626] rounded-[20px] p-5 flex flex-col gap-4 hover:border-[#FF8A24]/30 transition-colors group"
        >
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-[#0B0B0B] border border-[#262626] flex items-center justify-center">
              {card.icon}
            </div>
          </div>
          
          <div>
            <h4 className="text-[#A1A1AA] text-sm font-medium mb-1">{card.title}</h4>
            <div className="text-xl font-semibold text-white mb-1 flex items-center justify-between">
              {card.value}
              {card.type === "action" && (
                <button className="text-[#FF8A24] text-sm flex items-center gap-1 hover:gap-2 transition-all">
                  {card.actionText} <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
            
            {card.type === "progress" && (
              <div className="w-full bg-[#0B0B0B] h-1.5 rounded-full overflow-hidden mb-2 mt-2">
                <div 
                  className="h-full bg-purple-500 rounded-full transition-all duration-1000"
                  style={{ width: `${card.progress}%` }}
                />
              </div>
            )}
            
            <p className="text-[#A1A1AA] text-xs">{card.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
