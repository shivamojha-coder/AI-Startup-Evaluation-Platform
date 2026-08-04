import React from "react";
import { FileText, Download, Eye, RefreshCw, Plus } from "lucide-react";

export const DocumentCard: React.FC = () => {
  const documents = [
    { type: "Pitch Deck", status: "Uploaded", date: "Oct 12, 2023", fileType: "PDF" },
    { type: "Business Plan", status: "Missing", date: "-", fileType: "-" },
    { type: "Financial Projection", status: "Uploaded", date: "Oct 10, 2023", fileType: "XLSX" },
    { type: "Product Demo", status: "Missing", date: "-", fileType: "-" },
  ];

  return (
    <div className="bg-[#151515] border border-[#262626] rounded-[22px] p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0B0B0B] border border-[#262626] flex items-center justify-center">
            <FileText className="w-5 h-5 text-[#FF8A24]" />
          </div>
          <h3 className="text-lg font-semibold text-white">Documents</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {documents.map((doc, idx) => (
          <div key={idx} className="bg-[#0B0B0B] border border-[#262626] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-[#FF8A24]/30 transition-colors">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${doc.status === 'Uploaded' ? 'bg-[#FF8A24]/10 border-[#FF8A24]/20 text-[#FF8A24]' : 'bg-[#151515] border-[#262626] text-[#A1A1AA]'}`}>
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-medium">{doc.type}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${doc.status === 'Uploaded' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                    {doc.status}
                  </span>
                  {doc.status === 'Uploaded' && (
                    <>
                      <span className="text-[#A1A1AA] text-xs">•</span>
                      <span className="text-[#A1A1AA] text-xs">{doc.date}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {doc.status === 'Uploaded' ? (
                <>
                  <button className="p-2 rounded-lg bg-[#151515] border border-[#262626] text-[#A1A1AA] hover:text-white hover:border-[#FF8A24] transition-colors" title="Preview">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg bg-[#151515] border border-[#262626] text-[#A1A1AA] hover:text-white hover:border-[#FF8A24] transition-colors" title="Download">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg bg-[#151515] border border-[#262626] text-[#A1A1AA] hover:text-white hover:border-[#FF8A24] transition-colors" title="Replace">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button className="flex items-center gap-2 px-4 py-2 bg-[#FF8A24] text-white rounded-lg hover:bg-[#FF8A24]/90 transition-colors text-sm font-medium">
                  <Plus className="w-4 h-4" />
                  Upload
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
