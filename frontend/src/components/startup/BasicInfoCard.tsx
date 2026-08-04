import React from "react";
import { Info, Edit3 } from "lucide-react";
import type { StartupResponse } from "../../schemas/startup";

interface BasicInfoCardProps {
  startup: StartupResponse;
  onEdit: () => void;
}

export const BasicInfoCard: React.FC<BasicInfoCardProps> = ({ startup, onEdit }) => {
  const fields = [
    { label: "Startup Name", value: startup.startup_name },
    { label: "Tagline", value: startup.tagline || "-" },
    { label: "Industry", value: startup.industry || "-" },
    { label: "Startup Stage", value: startup.stage || "-" },
    { label: "Founded Year", value: "2023" }, // Placeholder as it's not in schema
    { label: "Company Type", value: "C-Corp" }, // Placeholder
  ];

  return (
    <div className="bg-[#151515] border border-[#262626] rounded-[22px] p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0B0B0B] border border-[#262626] flex items-center justify-center">
            <Info className="w-5 h-5 text-[#FF8A24]" />
          </div>
          <h3 className="text-lg font-semibold text-white">Basic Information</h3>
        </div>
        <button 
          onClick={onEdit}
          className="flex items-center gap-2 px-4 py-2 bg-[#262626]/50 hover:bg-[#262626] text-white rounded-lg transition-colors text-sm font-medium border border-[#262626]"
        >
          <Edit3 className="w-4 h-4" />
          Edit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        {fields.map((field, idx) => (
          <div key={idx} className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#A1A1AA] uppercase tracking-wider">{field.label}</label>
            <div className="text-sm text-white font-medium bg-[#0B0B0B] border border-[#262626] rounded-xl px-4 py-3">
              {field.value}
            </div>
          </div>
        ))}
        
        <div className="col-span-1 md:col-span-2 flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#A1A1AA] uppercase tracking-wider">Description</label>
          <div className="text-sm text-white bg-[#0B0B0B] border border-[#262626] rounded-xl px-4 py-4 min-h-[120px] leading-relaxed whitespace-pre-wrap">
            {startup.description || "No description provided."}
          </div>
        </div>
      </div>
    </div>
  );
};
