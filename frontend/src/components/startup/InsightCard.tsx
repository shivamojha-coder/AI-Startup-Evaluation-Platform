import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  Sparkles, 
  Check, 
  AlertTriangle, 
  RefreshCw, 
  ArrowRight, 
  FileText, 
  Target, 
  Lightbulb, 
  ShieldAlert, 
  TrendingUp 
} from "lucide-react";
import { getEvaluations, getEvaluationReport, type EvaluationResponse, type EvaluationReportResponse } from "../../api/startups";

interface InsightCardProps {
  startupId?: string;
}

export const InsightCard: React.FC<InsightCardProps> = ({ startupId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [latestEval, setLatestEval] = useState<EvaluationResponse | null>(null);
  const [report, setReport] = useState<EvaluationReportResponse | null>(null);

  const fetchInsights = async () => {
    if (!startupId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const evals = await getEvaluations(startupId);
      
      if (!evals || evals.length === 0) {
        setLatestEval(null);
        setReport(null);
        return;
      }

      // Sort by version / creation descending to find latest
      const sorted = [...evals].sort((a, b) => (b.version || 0) - (a.version || 0));
      const completed = sorted.find((e) => e.status === "completed") || sorted[0];
      setLatestEval(completed);

      if (completed && completed.status === "completed") {
        const reportData = await getEvaluationReport(completed.id);
        setReport(reportData);
      } else {
        setReport(null);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load AI insights");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [startupId]);

  if (loading) {
    return (
      <div className="bg-[#151515] border border-[#262626] rounded-[22px] p-8 relative overflow-hidden flex flex-col items-center justify-center min-h-[320px]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#FF8A24] border-t-transparent mb-4" />
        <p className="text-[#A1A1AA] text-sm font-medium animate-pulse">Loading AI insights & analysis...</p>
      </div>
    );
  }

  // Case 1: No evaluations or no pitch deck uploaded yet
  if (!latestEval) {
    return (
      <div className="bg-[#151515] border border-[#262626] rounded-[22px] p-8 lg:p-12 relative overflow-hidden text-center">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#FF8A24]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="w-16 h-16 rounded-2xl bg-[#0B0B0B] border border-[#262626] flex items-center justify-center mx-auto mb-5 text-[#FF8A24]">
          <Sparkles className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No AI Insights Yet</h3>
        <p className="text-[#A1A1AA] text-sm max-w-lg mx-auto mb-6 leading-relaxed">
          Upload your startup pitch deck (PDF or PPTX) to trigger the multi-agent AI evaluation engine. It will automatically extract your problem, solution, calculate diligence scores, and highlight key investment risks.
        </p>
        {startupId && (
          <Link
            to={`/founder/startups/${startupId}/documents`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF8A24] hover:bg-[#E28528] text-[#0A0A0A] font-semibold text-sm rounded-xl transition-all shadow-lg shadow-[#FF8A24]/20"
          >
            <FileText className="w-4 h-4" />
            Upload Pitch Deck Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    );
  }

  // Case 2: Evaluation is still in progress
  if (latestEval.status !== "completed") {
    return (
      <div className="bg-[#151515] border border-[#262626] rounded-[22px] p-8 lg:p-12 relative overflow-hidden text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#0B0B0B] border border-[#262626] flex items-center justify-center mx-auto mb-4 text-[#FF8A24] animate-spin">
          <RefreshCw className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">AI Evaluation in Progress</h3>
        <p className="text-[#A1A1AA] text-sm max-w-md mx-auto mb-6">
          Status: <span className="text-[#FF8A24] font-medium uppercase tracking-wider">{latestEval.progress_stage || latestEval.status}</span>. Our agents are reading your slides and running diligence checks.
        </p>
        <button
          onClick={fetchInsights}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1F1F1F] hover:bg-[#2A2A2A] text-white text-sm font-medium rounded-xl border border-[#333333] transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Check Status Again
        </button>
      </div>
    );
  }

  const scores = report?.scores || {};
  const summary = report?.summary;
  const risks = report?.risks || [];
  const startupScore = scores.startup_score || 0;

  return (
    <div className="bg-[#151515] border border-[#262626] rounded-[22px] p-6 lg:p-8 relative overflow-hidden space-y-8">
      {/* Glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#FF8A24]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#262626] relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#0B0B0B] border border-[#262626] flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-[#FF8A24]" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold text-white">AI Diligence Insights</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FF8A24]/10 text-[#FF8A24] border border-[#FF8A24]/20">
                Deck v{latestEval.version || 1}
              </span>
            </div>
            <p className="text-[#A1A1AA] text-xs mt-0.5">Real AI analysis generated from your uploaded pitch deck</p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <button
            onClick={fetchInsights}
            title="Refresh AI Insights"
            className="flex items-center gap-1.5 px-3 py-2 bg-[#0B0B0B] hover:bg-[#1C1C1C] text-[#A1A1AA] hover:text-white rounded-xl border border-[#262626] transition-colors text-xs font-medium"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
          {startupId && latestEval && (
            <Link
              to={`/founder/startups/${startupId}/report/${latestEval.id}`}
              className="flex items-center gap-2 px-4 py-2 bg-[#FF8A24] hover:bg-[#E28528] text-[#0A0A0A] rounded-xl transition-all text-xs font-bold shadow-md shadow-[#FF8A24]/20"
            >
              Full Diligence Report
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Overall Score Highlight */}
      <div className="bg-[#0B0B0B] border border-[#262626] rounded-2xl p-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="flex items-baseline">
              <span className="text-5xl font-black text-[#FF8A24]">{startupScore}</span>
              <span className="text-xl text-[#71717A] font-semibold ml-1">/100</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#FF8A24]" />
                <h4 className="text-white font-semibold text-base">Overall Startup Score</h4>
              </div>
              <p className="text-[#A1A1AA] text-xs mt-1 max-w-md">
                Synthesized across market size, product innovation, team strength, and traction metrics.
              </p>
            </div>
          </div>

          {/* Quick Score Bars */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:border-l md:border-[#262626] md:pl-6">
            <div className="bg-[#151515] p-3 rounded-xl border border-[#262626]">
              <span className="text-[#A1A1AA] text-[11px] uppercase tracking-wider block font-medium">Market</span>
              <span className="text-white font-bold text-lg">{scores.market_opportunity || "N/A"}</span>
            </div>
            <div className="bg-[#151515] p-3 rounded-xl border border-[#262626]">
              <span className="text-[#A1A1AA] text-[11px] uppercase tracking-wider block font-medium">Product</span>
              <span className="text-white font-bold text-lg">{scores.product_innovation || "N/A"}</span>
            </div>
            <div className="bg-[#151515] p-3 rounded-xl border border-[#262626]">
              <span className="text-[#A1A1AA] text-[11px] uppercase tracking-wider block font-medium">Team</span>
              <span className="text-white font-bold text-lg">{scores.team_strength || "N/A"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Problem & Solution Highlights */}
      {(summary?.problem || summary?.solution) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          {summary.problem && (
            <div className="bg-[#0B0B0B] border border-[#262626] rounded-2xl p-6">
              <h4 className="text-white font-semibold mb-3 flex items-center gap-2 text-sm">
                <Target className="w-4 h-4 text-red-400" />
                Problem Statement (Extracted by AI)
              </h4>
              <p className="text-[#D4D4D8] text-sm leading-relaxed whitespace-pre-line">
                {summary.problem}
              </p>
            </div>
          )}

          {summary.solution && (
            <div className="bg-[#0B0B0B] border border-[#262626] rounded-2xl p-6">
              <h4 className="text-white font-semibold mb-3 flex items-center gap-2 text-sm">
                <Lightbulb className="w-4 h-4 text-green-400" />
                Proposed Solution (Extracted by AI)
              </h4>
              <p className="text-[#D4D4D8] text-sm leading-relaxed whitespace-pre-line">
                {summary.solution}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Strengths & Identified Risks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        {/* Strengths */}
        <div className="bg-[#0B0B0B] border border-[#262626] rounded-2xl p-6">
          <h4 className="text-white font-semibold mb-4 flex items-center gap-2 text-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            Key Evaluated Strengths
          </h4>
          <ul className="space-y-3.5">
            {summary?.target_market && (
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-[#D4D4D8] text-sm">
                  <strong className="text-white font-medium">Target Market: </strong>
                  {summary.target_market.length > 180 ? `${summary.target_market.substring(0, 180)}...` : summary.target_market}
                </span>
              </li>
            )}
            {summary?.traction && (
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-[#D4D4D8] text-sm">
                  <strong className="text-white font-medium">Demonstrated Traction: </strong>
                  {summary.traction.length > 180 ? `${summary.traction.substring(0, 180)}...` : summary.traction}
                </span>
              </li>
            )}
            {summary?.business_model && (
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-[#D4D4D8] text-sm">
                  <strong className="text-white font-medium">Business Model: </strong>
                  {summary.business_model.length > 180 ? `${summary.business_model.substring(0, 180)}...` : summary.business_model}
                </span>
              </li>
            )}
            {!summary?.target_market && !summary?.traction && !summary?.business_model && (
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-[#D4D4D8] text-sm">
                  Valid pitch deck parsed with overall readiness score of {startupScore}/100.
                </span>
              </li>
            )}
          </ul>
        </div>

        {/* Identified Risks / Areas to Address */}
        <div className="bg-[#0B0B0B] border border-[#262626] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-white font-semibold flex items-center gap-2 text-sm">
              <ShieldAlert className="w-4 h-4 text-[#FF8A24]" />
              Identified Diligence Risks ({risks.length})
            </h4>
            <span className="text-[11px] text-[#A1A1AA]">From AI Agent</span>
          </div>

          {risks.length === 0 ? (
            <div className="text-center py-6 text-[#A1A1AA] text-sm">
              <Check className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              No major red flags identified in this pitch deck version.
            </div>
          ) : (
            <div className="space-y-3">
              {risks.slice(0, 4).map((r, i) => {
                const isHigh = r.severity?.toLowerCase() === "high";
                const isMed = r.severity?.toLowerCase() === "medium";
                return (
                  <div key={r.id || i} className="p-3 rounded-xl bg-[#151515] border border-[#262626]">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-semibold text-white uppercase tracking-wider">
                        {r.category || "General"}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          isHigh
                            ? "bg-red-500/15 text-red-400 border border-red-500/30"
                            : isMed
                            ? "bg-[#FF8A24]/15 text-[#FF8A24] border border-[#FF8A24]/30"
                            : "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                        }`}
                      >
                        {r.severity || "Risk"}
                      </span>
                    </div>
                    <p className="text-xs text-[#A1A1AA] leading-relaxed">{r.risk}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
