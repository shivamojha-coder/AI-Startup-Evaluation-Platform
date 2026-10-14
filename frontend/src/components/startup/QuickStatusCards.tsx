import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, FileText, Sparkles, Eye, ArrowRight } from "lucide-react";
import type { StartupResponse } from "../../schemas/startup";
import { getDocuments, getEvaluations, type DocumentResponse, type EvaluationResponse } from "../../api/startups";

interface QuickStatusCardsProps {
  startup?: StartupResponse;
  startupId?: string;
}

export const QuickStatusCards: React.FC<QuickStatusCardsProps> = ({ startup, startupId }) => {
  const [documents, setDocuments] = useState<DocumentResponse[]>([]);
  const [evaluations, setEvaluations] = useState<EvaluationResponse[]>([]);

  useEffect(() => {
    if (!startupId) return;

    let mounted = true;
    Promise.allSettled([getDocuments(startupId), getEvaluations(startupId)]).then(([docsRes, evalsRes]) => {
      if (!mounted) return;
      if (docsRes.status === "fulfilled") setDocuments(docsRes.value || []);
      if (evalsRes.status === "fulfilled") setEvaluations(evalsRes.value || []);
    });

    return () => {
      mounted = false;
    };
  }, [startupId]);

  // Profile completion calculation
  const profileFields = [
    startup?.startup_name,
    startup?.industry,
    startup?.stage,
    startup?.website,
    startup?.description,
    startup?.team_size,
    startup?.funding_raised,
    startup?.linkedin_url,
  ];
  const filledCount = profileFields.filter((val) => Boolean(val && String(val).trim().length > 0)).length;
  const progressPct = Math.round((filledCount / profileFields.length) * 100);

  // Pitch Deck Status
  const latestDoc = documents.length > 0 ? documents[documents.length - 1] : null;
  const deckStatus = latestDoc ? "Uploaded" : "Missing";
  const deckSubtitle = latestDoc
    ? `${latestDoc.file_name.substring(0, 18)}${latestDoc.file_name.length > 18 ? "..." : ""}`
    : "Upload pitch deck in Documents";

  // AI Report Status
  const completedEval = evaluations.find((e) => e.status === "completed");
  const inProgressEval = evaluations.find((e) => e.status === "processing" || e.status === "pending");
  const reportStatus = completedEval
    ? "Ready"
    : inProgressEval
    ? "Analyzing"
    : "Pending";
  const reportSubtitle = completedEval
    ? `Deck v${completedEval.version || 1} evaluated`
    : inProgressEval
    ? "AI agents reviewing deck"
    : "Requires pitch deck upload";

  // Visibility
  const isPublished = Boolean(startup && documents.length > 0);
  const visibilityStatus = isPublished ? "Active" : "Draft";
  const visibilitySubtitle = isPublished ? "Visible in deal flow" : "Requires pitch deck to activate";

  const cards = [
    {
      title: "Profile Completion",
      value: `${progressPct}%`,
      subtitle: `${filledCount} of ${profileFields.length} sections completed`,
      icon: <CheckCircle2 className="w-5 h-5 text-purple-400" />,
      type: "progress",
      progress: progressPct,
    },
    {
      title: "Pitch Deck",
      value: deckStatus,
      subtitle: deckSubtitle,
      icon: <FileText className={`w-5 h-5 ${latestDoc ? "text-emerald-400" : "text-[#A1A1AA]"}`} />,
      type: "status",
      linkTo: startupId ? `/founder/startups/${startupId}/documents` : undefined,
    },
    {
      title: "AI Diligence Report",
      value: reportStatus,
      subtitle: reportSubtitle,
      icon: <Sparkles className={`w-5 h-5 ${completedEval ? "text-blue-400" : "text-[#A1A1AA]"}`} />,
      type: "status",
      linkTo: startupId && completedEval ? `/founder/startups/${startupId}/report/${completedEval.id}` : undefined,
    },
    {
      title: "Investor Visibility",
      value: visibilityStatus,
      subtitle: visibilitySubtitle,
      icon: <Eye className={`w-5 h-5 ${isPublished ? "text-emerald-400" : "text-[#FF8A24]"}`} />,
      type: "action",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const content = (
          <div
            key={idx}
            className="bg-[#151515] border border-[#262626] rounded-[20px] p-5 flex flex-col gap-4 hover:border-[#FF8A24]/30 transition-colors group h-full"
          >
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-[#0B0B0B] border border-[#262626] flex items-center justify-center">
                {card.icon}
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-[#A1A1AA] text-sm font-medium mb-1">{card.title}</h4>
                <div className="text-xl font-semibold text-white mb-1 flex items-center justify-between">
                  {card.value}
                  {card.linkTo && (
                    <span className="text-[#FF8A24] text-xs font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      View <ArrowRight className="w-3.5 h-3.5" />
                    </span>
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
              </div>

              <p className="text-[#A1A1AA] text-xs truncate mt-1">{card.subtitle}</p>
            </div>
          </div>
        );

        if (card.linkTo) {
          return (
            <Link key={idx} to={card.linkTo} className="block">
              {content}
            </Link>
          );
        }

        return <div key={idx}>{content}</div>;
      })}
    </div>
  );
};
