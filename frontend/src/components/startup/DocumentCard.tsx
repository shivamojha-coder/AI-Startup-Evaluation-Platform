import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Eye, Upload, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { getDocuments, type DocumentResponse } from "../../api/startups";

interface DocumentCardProps {
  startupId?: string;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({ startupId }) => {
  const [documents, setDocuments] = useState<DocumentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!startupId) {
      setLoading(false);
      return;
    }

    const fetchDocs = async () => {
      try {
        setLoading(true);
        setError(null);
        const docs = await getDocuments(startupId);
        setDocuments(docs);
      } catch (err: any) {
        console.error("Failed to load documents", err);
        setError(err.message || "Failed to load documents");
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, [startupId]);

  return (
    <div className="bg-[#151515] border border-[#262626] rounded-[22px] p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0B0B0B] border border-[#262626] flex items-center justify-center">
            <FileText className="w-5 h-5 text-[#FF8A24]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Startup Documents</h3>
            <p className="text-xs text-[#A1A1AA]">Pitch decks and investor presentation files</p>
          </div>
        </div>
        {startupId && (
          <Link
            to={`/founder/startups/${startupId}/documents`}
            className="flex items-center gap-2 px-4 py-2 bg-[#FF8A24] hover:bg-[#FF8A24]/90 text-[#0A0A0A] font-semibold text-xs rounded-xl transition-all shadow-lg shadow-[#FF8A24]/20"
          >
            <Upload className="w-4 h-4" />
            Upload New Deck
          </Link>
        )}
      </div>

      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#FF8A24] border-t-transparent animate-spin" />
          <p className="text-xs text-[#A1A1AA]">Loading documents...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-center">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-red-400">{error}</p>
        </div>
      ) : documents.length === 0 ? (
        <div className="p-8 sm:p-12 bg-[#0B0B0B] border border-dashed border-[#262626] rounded-2xl text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-[#151515] border border-[#262626] flex items-center justify-center mb-4 text-[#A1A1AA]">
            <FileText className="w-8 h-8 text-[#FF8A24]" />
          </div>
          <h4 className="text-white font-semibold text-base mb-1">No Pitch Decks Uploaded Yet</h4>
          <p className="text-xs text-[#A1A1AA] max-w-sm mb-6 leading-relaxed">
            Upload your pitch deck (PDF or PPTX) to trigger the multi-agent AI evaluation, scorecards, and investor diligence report.
          </p>
          {startupId && (
            <Link
              to={`/founder/startups/${startupId}/documents`}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#FF8A24] text-[#0A0A0A] font-bold text-xs rounded-xl hover:bg-[#E28528] transition-all"
            >
              <Upload className="w-4 h-4" />
              Upload Pitch Deck Now
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {documents.map((doc) => {
            const isCompleted = doc.status === "completed";
            const isFailed = doc.status === "failed";

            return (
              <div
                key={doc.id}
                className="bg-[#0B0B0B] border border-[#262626] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-[#FF8A24]/30 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center border bg-[#FF8A24]/10 border-[#FF8A24]/20 text-[#FF8A24] shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-white font-semibold text-sm truncate max-w-xs sm:max-w-md">{doc.file_name}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#1C1C1C] text-[#A1A1AA] border border-[#262626]">
                        v{doc.version}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-[#A1A1AA]">
                      <span>{doc.file_size_kb ? `${(doc.file_size_kb / 1024).toFixed(1)} MB` : "PDF"}</span>
                      {doc.page_count && <span>• {doc.page_count} pages</span>}
                      <span>• {new Date(doc.uploaded_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border ${
                      isCompleted
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : isFailed
                        ? "bg-red-500/10 text-red-400 border-red-500/20"
                        : "bg-[#FF8A24]/10 text-[#FF8A24] border-[#FF8A24]/20"
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Analyzed
                      </>
                    ) : isFailed ? (
                      <>
                        <AlertCircle className="w-3.5 h-3.5" />
                        Failed
                      </>
                    ) : (
                      <>
                        <Clock className="w-3.5 h-3.5 animate-spin" />
                        Processing AI
                      </>
                    )}
                  </span>

                  {isCompleted && (
                    <Link
                      to={`/founder/startups/${startupId}/report/${doc.evaluation_id}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#151515] hover:bg-[#202020] border border-[#262626] rounded-xl text-xs font-semibold text-white transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#FF8A24]" />
                      View Report
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
