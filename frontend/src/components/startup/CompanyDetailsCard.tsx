import React from "react";
import { Briefcase, Edit3 } from "lucide-react";
import type { StartupResponse } from "../../schemas/startup";

interface CompanyDetailsCardProps {
  startup: StartupResponse;
  onEdit: () => void;
}

export const CompanyDetailsCard: React.FC<CompanyDetailsCardProps> = ({ startup, onEdit }) => {
  const fields = [
    { label: "Team Size", value: startup.team_size || "-" },
    { label: "Funding Raised", value: startup.funding_raised || "-" },
    { label: "Funding Stage", value: startup.stage || "-" }, // Using stage as proxy for funding stage if needed
    { label: "Registration Number", value: "Not provided" }, // Placeholder
    { label: "Country", value: "India" }, // Placeholder
    { label: "City", value: "Bangalore" }, // Placeholder
  ];

  return (
    <div className="bg-[#151515] border border-[#262626] rounded-[22px] p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0B0B0B] border border-[#262626] flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-[#FF8A24]" />
          </div>
          <h3 className="text-lg font-semibold text-white">Company Details</h3>
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
      </div>
    </div>
  );
};
