import React from "react";
import { Activity, Edit3, FileText, Sparkles, Eye } from "lucide-react";

export const TimelineCard: React.FC = () => {
  const activities = [
    {
      type: "investor",
      title: "Investor viewed profile",
      date: "2 hours ago",
      icon: <Eye className="w-4 h-4 text-purple-400" />,
      dotColor: "bg-purple-400",
    },
    {
      type: "insight",
      title: "AI Report generated",
      date: "Oct 12, 2023",
      icon: <Sparkles className="w-4 h-4 text-blue-400" />,
      dotColor: "bg-blue-400",
    },
    {
      type: "document",
      title: "Pitch deck uploaded",
      date: "Oct 10, 2023",
      icon: <FileText className="w-4 h-4 text-green-400" />,
      dotColor: "bg-green-400",
    },
    {
      type: "profile",
      title: "Startup profile updated",
      date: "Oct 9, 2023",
      icon: <Edit3 className="w-4 h-4 text-[#FF8A24]" />,
      dotColor: "bg-[#FF8A24]",
    },
  ];

  return (
    <div className="bg-[#151515] border border-[#262626] rounded-[22px] p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-[#0B0B0B] border border-[#262626] flex items-center justify-center">
          <Activity className="w-5 h-5 text-[#FF8A24]" />
        </div>
        <h3 className="text-lg font-semibold text-white">Activity Timeline</h3>
      </div>

      <div className="relative pl-6 border-l border-[#262626] ml-4 space-y-8">
        {activities.map((activity, idx) => (
          <div key={idx} className="relative">
            {/* Dot */}
            <div className={`absolute -left-[31px] w-3 h-3 rounded-full ${activity.dotColor} shadow-[0_0_10px_rgba(0,0,0,0.5)] border-2 border-[#151515]`} />
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-[#0B0B0B] border border-[#262626] flex items-center justify-center mt-[-4px] shrink-0">
                {activity.icon}
              </div>
              <div>
                <h4 className="text-sm font-medium text-white">{activity.title}</h4>
                <span className="text-xs text-[#A1A1AA]">{activity.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
