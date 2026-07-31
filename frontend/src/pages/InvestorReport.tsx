import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getStartup, getEvaluations, getEvaluationReport, type EvaluationReportResponse, verifyClaim, startupAiChat, type VerifyClaimResponse, requestMeeting, getInvestorMeetings, toggleShortlistAPI, getShortlistedAPI } from "../api/startups";
import type { StartupResponse } from "../schemas/startup"
import ReactMarkdown from "react-markdown";
import { useChatStore } from "../store/chatStore";

// Helper components for UI layout
const SectionCard: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className = "" }) => (
  <div className={`rounded-3xl bg-[#141414] border border-[rgba(255,255,255,0.08)] p-6 sm:p-8 shadow-2xl space-y-6 ${className}`}>
    <h2 className="text-xl font-bold text-[#FAFAFA]">{title}</h2>
    {children}
  </div>
);

// Claim Verification Item Component
const ClaimItem: React.FC<{ startupId: string; claim: string; category: string }> = ({ startupId, claim, category }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifyClaimResponse | null>(null);
  const [error, setError] = useState("");

  const handleVerify = async (_force: boolean = false) => {
    try {
      setLoading(true);
      setError("");
      // In a real app we'd pass `force` to bypass cache if needed, but our backend uses cache by default.
      const res = await verifyClaim(startupId, claim, category);
      setResult(res);
    } catch (err: any) {
      setError(err.message || "Failed to verify.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#1C1C1C] p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#FE9638]">{category}</span>
          <p className="text-sm font-semibold text-[#FAFAFA] mt-1 leading-relaxed">"{claim}"</p>
        </div>
        {!result && !loading && (
          <button 
            onClick={() => handleVerify(false)}
            className="shrink-0 rounded-xl bg-[rgba(254,150,56,0.15)] border border-[#FE9638]/30 px-4 py-2 text-xs font-bold text-[#FE9638] hover:bg-[#FE9638] hover:text-[#0A0A0A] transition-colors"
          >
            Verify Claim
          </button>
        )}
        {loading && (
          <div className="shrink-0 h-8 w-8 animate-spin rounded-full border-2 border-[#FE9638] border-t-transparent"></div>
        )}
      </div>

      {error && <p className="text-xs text-[#F87171] font-semibold">{error}</p>}

      {result && !loading && (
        <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.08)] space-y-3">
          <div className="flex items-center gap-4">
            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
              result.status.toLowerCase() === 'verified' ? 'bg-[rgba(52,211,153,0.15)] text-[#34D399] border border-[#34D399]/30' :
              result.status.toLowerCase() === 'contradicted' ? 'bg-[rgba(248,113,113,0.15)] text-[#F87171] border border-[#F87171]/30' :
              'bg-[rgba(251,191,36,0.15)] text-[#FBBF24] border border-[#FBBF24]/30'
            }`}>
              {result.status}
            </div>
            <span className="text-xs font-bold text-[#9A9A9A]">Confidence: <span className="text-[#FAFAFA]">{(result.confidence * 100).toFixed(0)}%</span></span>
            
            <button onClick={() => handleVerify(true)} className="ml-auto text-xs text-[#9A9A9A] hover:text-[#FE9638] underline">
              Re-verify
            </button>
          </div>
          
          <p className="text-xs text-[#9A9A9A]">{result.reason}</p>
          
          {result.evidence && result.evidence.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#666]">Sources</span>
              <ul className="list-disc pl-4 space-y-1">
                {result.evidence.map((link, idx) => (
                  <li key={idx}>
                    <a href={link} target="_blank" rel="noreferrer" className="text-xs text-[#FE9638] hover:underline break-all">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export const InvestorReport: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [startup, setStartup] = useState<StartupResponse | null>(null);
  const [report, setReport] = useState<EvaluationReportResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Global Chat Context
  const setContextStartupId = useChatStore(state => state.setContextStartupId);

  // Actions State
  const [meetingStatus, setMeetingStatus] = useState<string>("Request Meeting");
  const [canRerequest, setCanRerequest] = useState<boolean>(true);
  
  // Meeting Schedule Modal State
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [meetingAgenda, setMeetingAgenda] = useState("");
  const [meetingSubmitting, setMeetingSubmitting] = useState(false);

  const handleSubmitMeeting = async () => {
    if (!id || !meetingDate || !meetingTime) return;
    setMeetingSubmitting(true);
    try {
      const scheduledAt = new Date(`${meetingDate}T${meetingTime}`).toISOString();
      const newReq = await requestMeeting(id, scheduledAt, meetingAgenda);
      setMeetingStatus(newReq.status);
      setCanRerequest(false);
      setShowMeetingModal(false);
    } catch (err: any) {
      console.error("Failed to request meeting", err);
      if (err.response && err.response.data && err.response.data.detail) {
        alert(err.response.data.detail);
      }
    } finally {
      setMeetingSubmitting(false);
    }
  };

  const fetchMeetingStatus = async () => {
    try {
      const [meetings, shortlistedData] = await Promise.all([
        getInvestorMeetings(),
        getShortlistedAPI()
      ]);
      const existing = meetings.find((m: any) => m.startup_id === id);
      if (existing) {
        if (existing.status === "declined") {
          const declinedTimeStr = existing.declined_at || existing.updated_at;
          if (declinedTimeStr) {
            const declinedTime = new Date(declinedTimeStr).getTime();
            const cooldownEndTime = declinedTime + 7 * 24 * 60 * 60 * 1000;
            const diffMs = cooldownEndTime - Date.now();
            const remainingDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
            
            if (remainingDays > 0) {
              setMeetingStatus(`Declined (Re-request in ${remainingDays}d)`);
              setCanRerequest(false);
            } else {
              setMeetingStatus("Re-request Meeting");
              setCanRerequest(true);
            }
          } else {
            setMeetingStatus("Re-request Meeting");
            setCanRerequest(true);
          }
        } else {
          setMeetingStatus(existing.status); // "pending", "accepted"
          setCanRerequest(false);
        }
      }
      if (id && shortlistedData.includes(id)) {
        setIsShortlisted(true);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const [isShortlisted, setIsShortlisted] = useState<boolean>(false);

  const toggleShortlist = async () => {
    if (!id) return;
    try {
      await toggleShortlistAPI(id);
      setIsShortlisted(!isShortlisted);
    } catch (err) {
      console.error("Failed to toggle shortlist", err);
    }
  };

  useEffect(() => {
    if (!authLoading && (!user || (user.role !== "investor" && user.role !== "founder"))) {
      navigate("/login");
      return;
    }

    if (id && user && (user.role === "investor" || user.role === "founder")) {
      fetchReportData();
      if (user.role === "investor") {
        fetchMeetingStatus();
      }
    }
  }, [id, user, authLoading, navigate]);

  useEffect(() => {
    if (id) {
      setContextStartupId(id);
    }
    return () => {
      setContextStartupId(null);
    };
  }, [id, setContextStartupId]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const startupData = await getStartup(id!);
      setStartup(startupData);

      const evaluations = await getEvaluations(id!);
      const completedEval = evaluations.find((e) => e.status === "completed");
      
      if (completedEval) {
        const reportData = await getEvaluationReport(completedEval.id);
        setReport(reportData);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load evaluation report.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-transparent text-[#FAFAFA] min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FE9638] border-t-transparent"></div>
      </div>
    );
  }

  if (error || !startup) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-transparent p-8 text-[#FAFAFA] min-h-screen">
        <div className="rounded-3xl bg-[#141414] border border-[rgba(255,255,255,0.08)] p-8 text-center max-w-md shadow-2xl">
          <p className="text-[#F87171] font-semibold mb-6">{error || "Startup not found"}</p>
          <button onClick={() => navigate(-1)} className="inline-block rounded-xl bg-[#FE9638] px-6 py-2.5 text-sm font-bold text-[#0A0A0A]">Go Back</button>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-transparent p-8 text-[#FAFAFA] min-h-screen">
        <h2 className="text-2xl font-bold text-[#FAFAFA]">Report Pending</h2>
        <p className="text-sm text-[#9A9A9A] mt-2">The AI evaluation for {startup.startup_name} is not complete.</p>
      </div>
    );
  }

  const { summary, risks, questions, scores } = report;
  const isFounder = user?.role === "founder";

  // Generate some dummy claims based on summary text to demonstrate the USP if none exist
  // In a full implementation, `claim_verification_agent` extracts these and saves them to the report.
  const dummyClaims = [
    { category: "Market", text: `Target market: ${summary.target_market?.substring(0, 100)}...` },
    { category: "Revenue", text: `Business model involves: ${summary.business_model?.substring(0, 100)}...` },
    { category: "Founder", text: "The founder has significant prior experience in this industry." }
  ];

  return (
    <div className="flex flex-1 bg-transparent text-[#FAFAFA] h-screen overflow-hidden selection:bg-[rgba(254,150,56,0.2)] selection:text-[#FE9638]">
      <div className="max-w-[1600px] w-full mx-auto flex flex-col lg:flex-row h-full">
        
        {/* Report Content */}
        <div className="flex-1 w-full p-6 sm:p-10 lg:pr-6 space-y-8 overflow-y-auto custom-scrollbar h-full pb-32">
          
          {/* Header & Actions */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <button onClick={() => navigate(-1)} className="text-sm font-bold text-[#9A9A9A] hover:text-[#FE9638] mb-4 flex items-center gap-2">
                ← {isFounder ? "Back to My Startup" : "Back to Dealflow"}
              </button>
              <h1 className="text-4xl font-extrabold tracking-tight text-[#FAFAFA]">{startup.startup_name}</h1>
              <div className="flex gap-2 mt-3">
                <span className="rounded-lg bg-[rgba(255,255,255,0.08)] px-3 py-1 text-xs font-bold uppercase text-[#FAFAFA]">{startup.industry || "No Industry"}</span>
                <span className="rounded-lg bg-[rgba(254,150,56,0.15)] border border-[#FE9638]/30 px-3 py-1 text-xs font-bold uppercase text-[#FE9638]">{startup.stage || "No Stage"}</span>
              </div>
            </div>
            
            {/* Action Buttons */}
            {user?.role === "investor" && (
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={toggleShortlist}
                  className={`rounded-xl border px-5 py-2.5 text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    isShortlisted 
                      ? 'bg-[rgba(254,150,56,0.1)] border-[#FE9638]/40 text-[#FE9638]' 
                      : 'bg-[#1C1C1C] border-[rgba(255,255,255,0.08)] text-[#FAFAFA] hover:border-[#FE9638]/40 hover:text-[#FE9638]'
                  }`}
                >
                  <svg className="w-4 h-4" fill={isShortlisted ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                  {isShortlisted ? "Shortlisted" : "Shortlist"}
                </button>
                <button 
                  onClick={() => {
                    if (!canRerequest) return;
                    setMeetingDate("");
                    setMeetingTime("");
                    setMeetingAgenda("");
                    setShowMeetingModal(true);
                  }}
                  className={`rounded-xl px-5 py-2.5 text-sm font-bold transition-all shadow-lg cursor-pointer ${
                    canRerequest ? "bg-[#FE9638] text-[#0A0A0A] hover:bg-[#E28528] shadow-[#FE9638]/20" :
                    "bg-[rgba(52,211,153,0.15)] text-[#34D399] border border-[#34D399]/30 capitalize"
                  }`}
                  disabled={!canRerequest}
                >
                  {canRerequest && meetingStatus === "Request Meeting" ? "Schedule Meeting" :
                   canRerequest && meetingStatus === "Re-request Meeting" ? "Re-request Meeting" :
                   `${meetingStatus}`}
                </button>
              </div>
            )}
          </div>

          {/* AI Score Overview */}
          <SectionCard title="AI Scorecard" className="border-t-4 border-t-[#FE9638]">
            <div className="flex items-center gap-6">
              <div className="text-5xl font-black text-[#FE9638]">{scores.startup_score || 0}<span className="text-2xl text-[#9A9A9A]">/100</span></div>
              <p className="text-sm text-[#9A9A9A] max-w-md">Calculated by analyzing market size, founder background, product innovation, and business model viability against current market trends.</p>
            </div>
          </SectionCard>

          {/* Detailed Score Breakdown */}
          {scores.score_reasoning && (
            <SectionCard title="Score Breakdown">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {([
                  { key: 'market_opportunity', label: 'Market', val: scores.market_opportunity },
                  { key: 'product_innovation', label: 'Product', val: scores.product_innovation },
                  { key: 'team_strength', label: 'Team', val: scores.team_strength },
                  { key: 'business_model_score', label: 'Business Model', val: scores.business_model_score },
                  { key: 'competitive_advantage', label: 'Competition', val: scores.competitive_advantage },
                  { key: 'traction_score', label: 'Traction', val: scores.traction_score },
                  { key: 'scalability', label: 'Scalability', val: scores.scalability },
                ] as { key: string; label: string; val: number | undefined }[]).map(({ key, label, val }) => (
                  <div key={key} className="rounded-2xl bg-[#1C1C1C] border border-[rgba(255,255,255,0.08)] p-4">
                    <span className="block text-[10px] font-bold uppercase text-[#9A9A9A] mb-1">{label}</span>
                    <span className="text-2xl font-black text-[#FE9638]">{val ?? 0}<span className="text-xs text-[#666]">/100</span></span>
                    {scores.score_reasoning?.[key] && (
                      <p className="text-[10px] text-[#9A9A9A] mt-2 leading-relaxed">{scores.score_reasoning[key]}</p>
                    )}
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {/* Executive Summary */}
          <SectionCard title="Executive Summary">
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase text-[#FE9638] mb-2">The Problem</h3>
                <div className="text-sm text-[#FAFAFA] leading-relaxed bg-[#1C1C1C] p-4 rounded-xl prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{summary.problem}</ReactMarkdown>
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase text-[#FE9638] mb-2">The Solution</h3>
                <div className="text-sm text-[#FAFAFA] leading-relaxed bg-[#1C1C1C] p-4 rounded-xl prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{summary.solution}</ReactMarkdown>
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase text-[#FE9638] mb-2">Target Market</h3>
                <div className="text-sm text-[#FAFAFA] leading-relaxed bg-[#1C1C1C] p-4 rounded-xl prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{summary.target_market}</ReactMarkdown>
                </div>
              </div>
              {summary.business_model && (
                <div>
                  <h3 className="text-xs font-bold uppercase text-[#FE9638] mb-2">Business Model</h3>
                  <div className="text-sm text-[#FAFAFA] leading-relaxed bg-[#1C1C1C] p-4 rounded-xl prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{summary.business_model}</ReactMarkdown>
                  </div>
                </div>
              )}
              {summary.traction && (
                <div>
                  <h3 className="text-xs font-bold uppercase text-[#FE9638] mb-2">Traction</h3>
                  <div className="text-sm text-[#FAFAFA] leading-relaxed bg-[#1C1C1C] p-4 rounded-xl prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{summary.traction}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          </SectionCard>

          {/* Verification Section — Investor only */}
          {!isFounder && (
          <SectionCard title="Claim Verification" className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#38BDF8]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <p className="text-sm text-[#9A9A9A] mb-6">Verify key claims automatically across billions of web sources, registries, and databases.</p>
            <div className="space-y-4">
              {dummyClaims.map((c, i) => (
                <ClaimItem key={i} startupId={id!} claim={c.text} category={c.category} />
              ))}
            </div>
          </SectionCard>
          )}

          {/* Investor Questions — Investor only */}
          {!isFounder && questions && questions.length > 0 && (
            <SectionCard title="Investor Questions">
              <p className="text-sm text-[#9A9A9A] mb-4">AI-generated due diligence questions based on the pitch deck analysis.</p>
              <div className="space-y-3">
                {questions.map((q, idx) => (
                  <div key={q.id || idx} className="rounded-xl bg-[#1C1C1C] border border-[rgba(255,255,255,0.08)] p-4">
                    <span className="text-[10px] font-bold uppercase text-[#FE9638] tracking-wider">{q.category}</span>
                    <p className="text-sm text-[#FAFAFA] mt-1 leading-relaxed">{q.question}</p>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {/* Risks */}
          <SectionCard title="Risk Analysis">
            <div className="grid md:grid-cols-2 gap-4">
              {risks.map((item) => (
                <div key={item.id} className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#1C1C1C] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase text-[#9A9A9A]">{item.category}</span>
                    <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-full ${
                      item.severity.toLowerCase() === 'high' ? 'bg-[rgba(248,113,113,0.15)] text-[#F87171] border border-[#F87171]/30' :
                      item.severity.toLowerCase() === 'medium' ? 'bg-[rgba(251,191,36,0.15)] text-[#FBBF24] border border-[#FBBF24]/30' :
                      'bg-[rgba(52,211,153,0.15)] text-[#34D399] border border-[#34D399]/30'
                    }`}>{item.severity}</span>
                  </div>
                  <div className="text-xs font-semibold text-[#FAFAFA] leading-relaxed prose prose-invert prose-xs max-w-none">
                    <ReactMarkdown>{item.risk}</ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

        </div>
      </div>

      {/* Schedule Meeting Modal */}
      {showMeetingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowMeetingModal(false)}>
          <div className="bg-[#141414] border border-[rgba(255,255,255,0.1)] rounded-2xl p-8 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-[#FAFAFA] mb-1">Schedule Meeting</h2>
            <p className="text-sm text-[#9A9A9A] mb-6">Choose a date, time, and provide an optional agenda. A Zoom link will be generated once approved by the founder.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#9A9A9A] mb-1.5 uppercase tracking-wider">Date</label>
                <input
                  type="date"
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full rounded-xl bg-[#1C1C1C] border border-[rgba(255,255,255,0.08)] text-[#FAFAFA] px-4 py-3 text-sm focus:outline-none focus:border-[#FE9638] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#9A9A9A] mb-1.5 uppercase tracking-wider">Time</label>
                <input
                  type="time"
                  value={meetingTime}
                  onChange={(e) => setMeetingTime(e.target.value)}
                  className="w-full rounded-xl bg-[#1C1C1C] border border-[rgba(255,255,255,0.08)] text-[#FAFAFA] px-4 py-3 text-sm focus:outline-none focus:border-[#FE9638] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#9A9A9A] mb-1.5 uppercase tracking-wider">Agenda (Optional)</label>
                <textarea
                  value={meetingAgenda}
                  onChange={(e) => setMeetingAgenda(e.target.value)}
                  placeholder="What would you like to discuss?"
                  rows={3}
                  className="w-full rounded-xl bg-[#1C1C1C] border border-[rgba(255,255,255,0.08)] text-[#FAFAFA] px-4 py-3 text-sm placeholder-[#555] focus:outline-none focus:border-[#FE9638] transition-colors resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowMeetingModal(false)}
                className="flex-1 py-3 rounded-xl border border-[rgba(255,255,255,0.1)] text-[#9A9A9A] font-bold text-sm hover:bg-[rgba(255,255,255,0.05)] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitMeeting}
                disabled={!meetingDate || !meetingTime || meetingSubmitting}
                className="flex-1 py-3 rounded-xl bg-[#FE9638] text-[#0A0A0A] font-bold text-sm hover:bg-[#E28528] transition-colors shadow-lg shadow-[#FE9638]/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {meetingSubmitting ? "Sending..." : "Send Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
