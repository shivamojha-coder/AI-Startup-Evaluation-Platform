import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { 
  getStartups, 
  getDocuments, 
  type DocumentResponse,
  getFounderMeetings,
  respondToMeeting
} from "../api/startups";
import type { StartupResponse } from "../schemas/startup";
import { 
  Bell, 
  FileText, 
  Sparkles, 
  Users, 
  ChevronRight,
  FileUp,
  LineChart,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  User,
  Briefcase
} from "lucide-react";

export const DashboardFounder: React.FC = () => {
  const { user } = useAuth();

  // API States
  const [startups, setStartups] = useState<StartupResponse[]>([]);
  const [selectedStartupId, setSelectedStartupId] = useState<string>("");
  const [documents, setDocuments] = useState<DocumentResponse[]>([]);
  const [selectedEvaluationId, setSelectedEvaluationId] = useState<string>("");
  const [meetingRequests, setMeetingRequests] = useState<any[]>([]);
  
  // UX States
  const [loading, setLoading] = useState<boolean>(true);
  const [showChecklist, setShowChecklist] = useState<boolean>(false);

  const fetchDocumentsForStartup = async (startupId: string) => {
    try {
      const docs = await getDocuments(startupId);
      setDocuments(docs);

      const completed = docs.filter(d => d.status === "completed");
      if (completed.length > 0) {
        const latestEvalId = completed[0].evaluation_id;
        setSelectedEvaluationId(latestEvalId);
      } else {
        setSelectedEvaluationId("");
      }
    } catch (err) {
      console.error("Error fetching documents:", err);
    }
  };

  useEffect(() => {
    const initFetch = async () => {
      try {
        setLoading(true);
        const fetchedStartups = await getStartups();
        setStartups(fetchedStartups);
        if (fetchedStartups.length > 0) {
          const savedId = localStorage.getItem("ventureai_selected_startup");
          const defaultStartupId = (savedId && fetchedStartups.find(s => s.id === savedId))
            ? savedId
            : fetchedStartups[0].id;
          setSelectedStartupId(defaultStartupId);
          localStorage.setItem("ventureai_selected_startup", defaultStartupId);
          await fetchDocumentsForStartup(defaultStartupId);
        }
        
        // Fetch meetings
        try {
          const data = await getFounderMeetings();
          setMeetingRequests(data);
        } catch (e) {
          console.error("Failed to fetch meetings:", e);
        }
      } catch (err) {
        console.error("Error in dashboard initialization:", err);
      } finally {
        setLoading(false);
      }
    };
    initFetch();
  }, []);

  const handleMeetingResponse = async (id: string, status: string) => {
    try {
      const updatedMeeting = await respondToMeeting(id, status);
      setMeetingRequests(prev => prev.map(m => m.id === id ? { ...m, ...updatedMeeting } : m));
    } catch (err) {
      console.error(err);
    }
  };

  const currentStartup = startups.find(s => s.id === selectedStartupId);
  const userName = user?.name?.split(" ")[0] || "shazan";
  const userInitial = userName.charAt(0).toUpperCase();

  // 1. Founder Completeness (5 fields, each 20%)
  const getFounderCompleteness = () => {
    let score = 0;
    if (user?.name?.trim()) score += 20;
    if (user?.headline?.trim()) score += 20;
    if (user?.bio?.trim()) score += 20;
    if (user?.linkedin_url?.trim()) score += 20;
    if (user?.profile_photo_url) score += 20;
    return score;
  };

  // 2. Startup Completeness (11 fields: 9 at 10%, 2 at 5%)
  const getStartupCompleteness = (startup: StartupResponse | undefined) => {
    if (!startup) return 0;
    let score = 0;
    if (startup.startup_name?.trim()) score += 10;
    if (startup.description?.trim()) score += 10;
    if (startup.industry?.trim()) score += 10;
    if (startup.website?.trim()) score += 10;
    if (startup.tagline?.trim()) score += 10;
    if (startup.stage?.trim()) score += 10;
    if (startup.logo_url) score += 10;
    if (startup.team_size?.trim()) score += 10;
    if (startup.funding_raised?.trim()) score += 10;
    if (startup.linkedin_url?.trim()) score += 5;
    if (documents.length > 0) score += 5;
    return score;
  };

  const founderProgress = getFounderCompleteness();
  const startupProgress = getStartupCompleteness(currentStartup);
  const overallProgress = Math.round((founderProgress * 0.3) + (startupProgress * 0.7));
  const completenessVal = `${overallProgress}%`;

  const docCount = documents.length > 0 ? String(documents.length) : "1";
  
  // Determine report status string
  const getReportStatus = () => {
    if (documents.length === 0) return "Failed";
    const latest = documents[0];
    if (latest.status === "completed") return "Ready";
    if (latest.status === "failed") return "Failed";
    return "Analyzing";
  };
  const reportStatusVal = getReportStatus();

  const checklist = [
    { id: 'fname', done: !!user?.name?.trim() },
    { id: 'fheadline', done: !!user?.headline?.trim() },
    { id: 'fbio', done: !!user?.bio?.trim() },
    { id: 'flinkedin', done: !!user?.linkedin_url?.trim() },
    { id: 'fphoto', done: !!user?.profile_photo_url },
    { id: 'sname', done: !!currentStartup?.startup_name },
    { id: 'stagline', done: !!currentStartup?.tagline },
    { id: 'sdesc', done: !!currentStartup?.description },
    { id: 'sindustry', done: !!currentStartup?.industry },
    { id: 'sstage', done: !!currentStartup?.stage },
    { id: 'swebsite', done: !!currentStartup?.website },
    { id: 'slogo', done: !!currentStartup?.logo_url },
    { id: 'steam', done: !!currentStartup?.team_size },
    { id: 'sfunding', done: !!currentStartup?.funding_raised },
    { id: 'slinkedin', done: !!currentStartup?.linkedin_url },
    { id: 'sdeck', done: documents.length > 0 },
  ];
  const firstIncompleteId = checklist.find(item => !item.done)?.id;
  const remainingTasksCount = checklist.filter(item => !item.done).length;

  const getDotState = (id: string, isCompleted: boolean) => {
    if (isCompleted) return 'completed';
    if (id === firstIncompleteId) return 'current';
    return 'incomplete';
  };

  const DotIndicator = ({ id, isCompleted }: { id: string; isCompleted: boolean }) => {
    const state = getDotState(id, isCompleted);
    const bgColor = state === 'completed' ? 'bg-[#22c55e]' : state === 'current' ? 'bg-[#f97316]' : 'bg-[#4b5563]';
    return (
      <div className="flex items-center justify-center w-4 h-4">
        <div className={`w-[9px] h-[9px] rounded-full transition-transform duration-300 hover:scale-[1.15] ${bgColor}`} />
      </div>
    );
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const ctaClass = "h-[28px] px-[12px] bg-[#f97316] text-white text-[12px] font-semibold rounded-[8px] flex items-center justify-center transition-all duration-[180ms] hover:bg-[#fb923c] hover:-translate-y-[1px] hover:shadow-[0_0_12px_rgba(249,115,22,0.4)] active:scale-[0.98] cursor-pointer whitespace-nowrap";

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[600px] text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#f97316] border-t-transparent"></div>
          <span className="text-xs font-medium text-[#9ca3af] tracking-wider">Loading Workspace...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1340px] mx-auto text-white selection:bg-[rgba(249,115,22,0.15)] selection:text-[#f97316]">
      
      {/* TOP BAR (Main area) */}
      <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-2">
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col"
        >
          <h1 className="text-[28px] font-bold text-white tracking-tight leading-tight">
            {getGreeting()} <span className="font-bold">{userName}</span>
          </h1>
          <p className="text-base text-[#d1d5db] mt-2 font-medium">
            Your startup is <span className="text-[#f97316] font-bold">{overallProgress}%</span> investment ready.
          </p>
          {remainingTasksCount > 0 ? (
            <p className="text-sm text-[#9ca3af] mt-1">
              Complete {remainingTasksCount} remaining tasks to unlock your full investor profile.
            </p>
          ) : (
            <p className="text-sm text-[#22c55e] mt-1 font-medium">
              Your profile is complete! You are ready to connect with investors.
            </p>
          )}

          <div className="flex items-center gap-2 mt-4">
            <span className="text-[#6b7280] text-sm">Managing:</span>
            {startups.length > 0 ? (
              <select
                value={selectedStartupId}
                onChange={async (e) => {
                  const sid = e.target.value;
                  setSelectedStartupId(sid);
                  localStorage.setItem("ventureai_selected_startup", sid);
                  await fetchDocumentsForStartup(sid);
                }}
                className="bg-[#111111] border border-[#1e1e1e] text-[#f97316] font-semibold text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#f97316] cursor-pointer"
              >
                {startups.map(s => (
                  <option key={s.id} value={s.id}>{s.startup_name}</option>
                ))}
              </select>
            ) : (
              <Link to="/founder/startups/new" className="text-[#f97316] hover:underline font-bold text-xs">
                Register a Startup +
              </Link>
            )}
          </div>
        </motion.div>

        <div className="flex items-center gap-3.5 mt-2 sm:mt-0">
          {/* Notification bell icon */}
          <button className="p-2.5 rounded-full bg-[#111111] border border-[#1e1e1e] text-[#9ca3af] hover:text-white transition-all relative cursor-pointer">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#f97316]" />
          </button>

          {/* User avatar pill */}
          <Link to="/founder/profile" className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#111111] border border-[#1e1e1e] hover:border-[#2a2a2a] transition-all cursor-pointer">
            {user?.profile_photo_url ? (
              <img src={user.profile_photo_url} alt="Profile" className="w-7 h-7 rounded-full object-cover" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-[#f97316] text-[#0a0a0a] font-bold text-xs flex items-center justify-center shrink-0">
                {userInitial}
              </div>
            )}
            <span className="text-sm font-medium text-white">{userName}</span>
            <svg className="w-4 h-4 text-[#6b7280]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </Link>
        </div>
      </header>

      {/* STAT CARDS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px] my-[24px]">
        {/* Card 1 — Profile Completeness */}
        <div 
          onClick={() => setShowChecklist(!showChecklist)}
          className="bg-[#111111] border border-[#1e1e1e] rounded-[12px] p-5 flex flex-col items-center justify-center hover:bg-white/5 transition-all duration-150 cursor-pointer group relative min-h-[140px]"
        >
          <div className="relative w-[72px] h-[72px] flex items-center justify-center mb-3">
             {/* Background circle */}
             <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
               <circle cx="50" cy="50" r="42" stroke="#2a2a2a" strokeWidth="8" fill="none" />
             </svg>
             {/* Animated Progress Circle */}
             <motion.svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
               <motion.circle 
                  cx="50" 
                  cy="50" 
                  r="42" 
                  stroke="#f97316" 
                  strokeWidth="8" 
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={263.89}
                  initial={{ strokeDashoffset: 263.89 }}
                  whileInView={{ strokeDashoffset: 263.89 * (1 - overallProgress / 100) }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
               />
             </motion.svg>
             <span className="text-lg font-bold text-white">{overallProgress}%</span>
          </div>
          <span className="text-sm font-semibold text-white">Application Ready</span>
          
          <div className="absolute top-4 right-4">
            {showChecklist ? <ChevronUp className="w-5 h-5 text-[#6b7280]" /> : <ChevronDown className="w-5 h-5 text-[#6b7280] group-hover:text-white transition-colors" />}
          </div>
        </div>

        {/* Card 2 — Documents Uploaded */}
        <Link 
          to={selectedStartupId ? `/founder/startups/${selectedStartupId}/documents` : "/founder/startup-redirect?action=documents"}
          className="bg-[#111111] border border-[#1e1e1e] rounded-[12px] p-5 flex items-center justify-between hover:bg-white/5 transition-all duration-150"
        >
          <div className="flex items-center gap-4">
            <div className="w-[48px] h-[48px] rounded-full bg-[#1a1a1a] flex items-center justify-center shrink-0 text-[#3b82f6]">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-medium tracking-wider text-[#9ca3af] uppercase">
                DOCUMENTS UPLOADED
              </p>
              <p className="text-[32px] font-bold text-white leading-none my-1">
                {docCount}
              </p>
              <p className="text-xs text-[#6b7280]">
                Keep going! Upload more documents.
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#6b7280] shrink-0" />
        </Link>

        {/* Card 3 — Report Status */}
        <Link 
          to={selectedEvaluationId ? `/founder/startups/${selectedStartupId}/report/${selectedEvaluationId}` : "/founder/startup-redirect?action=report"}
          className="bg-[#111111] border border-[#1e1e1e] rounded-[12px] p-5 flex items-center justify-between hover:bg-white/5 transition-all duration-150"
        >
          <div className="flex items-center gap-4">
            <div className="w-[48px] h-[48px] rounded-full bg-[#1a1a1a] flex items-center justify-center shrink-0 text-[#ef4444]">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-medium tracking-wider text-[#9ca3af] uppercase">
                REPORT STATUS
              </p>
              <p className="text-[32px] font-bold text-white leading-none my-1">
                {reportStatusVal}
              </p>
              <p className="text-xs text-[#6b7280]">
                Your latest report needs attention.
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#6b7280] shrink-0" />
        </Link>
      </div>

      {/* COLLAPSIBLE CHECKLIST PANEL */}
      {showChecklist && (
        <div className="bg-[#111111] border border-[#f97316]/30 rounded-[12px] p-6 mb-6 animate-fadeIn space-y-6">
          <div className="flex justify-between items-center border-b border-[rgba(255,255,255,0.06)] pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#f97316]" />
                <span>Application Readiness Checklist</span>
              </h2>
              <p className="text-xs text-[#9ca3af]">Complete the founder and startup profiles to finish your profile.</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-[#6b7280] uppercase block">Overall Progress</span>
              <span className="text-2xl font-black text-[#f97316]">{overallProgress}%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Column 1: Founder Profile Checklist */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm text-[#f97316] uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  <span>Founder Profile</span>
                </h3>
                <span className="text-xs font-extrabold bg-[rgba(249,115,22,0.1)] px-2 py-0.5 rounded text-[#f97316]">
                  {founderProgress}%
                </span>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-sm py-1 border-b border-[rgba(255,255,255,0.02)]">
                  <div className="flex items-center gap-2.5">
                    <DotIndicator id="fname" isCompleted={!!user?.name?.trim()} />
                    <span className={user?.name?.trim() ? "text-[#9ca3af] font-medium" : "text-white font-medium"}>Full Name</span>
                  </div>
                  {!user?.name?.trim() && (
                    <Link to="/founder/profile" className={ctaClass}>Add</Link>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm py-1 border-b border-[rgba(255,255,255,0.02)]">
                  <div className="flex items-center gap-2.5">
                    <DotIndicator id="fheadline" isCompleted={!!user?.headline?.trim()} />
                    <span className={user?.headline?.trim() ? "text-[#9ca3af] font-medium" : "text-white font-medium"}>Professional Headline</span>
                  </div>
                  {!user?.headline?.trim() && (
                    <Link to="/founder/profile" className={ctaClass}>Add</Link>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm py-1 border-b border-[rgba(255,255,255,0.02)]">
                  <div className="flex items-center gap-2.5">
                    <DotIndicator id="fbio" isCompleted={!!user?.bio?.trim()} />
                    <span className={user?.bio?.trim() ? "text-[#9ca3af] font-medium" : "text-white font-medium"}>Professional Bio</span>
                  </div>
                  {!user?.bio?.trim() && (
                    <Link to="/founder/profile" className={ctaClass}>Add</Link>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm py-1 border-b border-[rgba(255,255,255,0.02)]">
                  <div className="flex items-center gap-2.5">
                    <DotIndicator id="flinkedin" isCompleted={!!user?.linkedin_url?.trim()} />
                    <span className={user?.linkedin_url?.trim() ? "text-[#9ca3af] font-medium" : "text-white font-medium"}>LinkedIn Profile</span>
                  </div>
                  {!user?.linkedin_url?.trim() && (
                    <Link to="/founder/profile" className={ctaClass}>Add</Link>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm py-1">
                  <div className="flex items-center gap-2.5">
                    <DotIndicator id="fphoto" isCompleted={!!user?.profile_photo_url} />
                    <span className={user?.profile_photo_url ? "text-[#9ca3af] font-medium" : "text-white font-medium"}>Profile Photo</span>
                  </div>
                  {!user?.profile_photo_url && (
                    <Link to="/founder/profile" className={ctaClass}>Add</Link>
                  )}
                </div>
              </div>
            </div>

            {/* Column 2: Startup Profile Checklist */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm text-[#f97316] uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4" />
                  <span>Startup Profile</span>
                </h3>
                <span className="text-xs font-extrabold bg-[rgba(249,115,22,0.1)] px-2 py-0.5 rounded text-[#f97316]">
                  {startupProgress}%
                </span>
              </div>

              {currentStartup ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                  <div className="flex items-center justify-between text-sm py-1 border-b border-[rgba(255,255,255,0.02)]">
                    <div className="flex items-center gap-2.5">
                      <DotIndicator id="sname" isCompleted={!!currentStartup.startup_name} />
                      <span className="text-xs text-white">Startup Name</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm py-1 border-b border-[rgba(255,255,255,0.02)]">
                    <div className="flex items-center gap-2.5">
                      <DotIndicator id="stagline" isCompleted={!!currentStartup.tagline} />
                      <span className="text-xs text-white">One-line Tagline</span>
                    </div>
                    {!currentStartup.tagline && (
                      <Link to={`/founder/startups/${selectedStartupId}`} className={ctaClass}>Add</Link>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm py-1 border-b border-[rgba(255,255,255,0.02)]">
                    <div className="flex items-center gap-2.5">
                      <DotIndicator id="sdesc" isCompleted={!!currentStartup.description} />
                      <span className="text-xs text-white">Description</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm py-1 border-b border-[rgba(255,255,255,0.02)]">
                    <div className="flex items-center gap-2.5">
                      <DotIndicator id="sindustry" isCompleted={!!currentStartup.industry} />
                      <span className="text-xs text-white">Industry</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm py-1 border-b border-[rgba(255,255,255,0.02)]">
                    <div className="flex items-center gap-2.5">
                      <DotIndicator id="sstage" isCompleted={!!currentStartup.stage} />
                      <span className="text-xs text-white">Stage</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm py-1 border-b border-[rgba(255,255,255,0.02)]">
                    <div className="flex items-center gap-2.5">
                      <DotIndicator id="swebsite" isCompleted={!!currentStartup.website} />
                      <span className="text-xs text-white">Website</span>
                    </div>
                    {!currentStartup.website && (
                      <Link to={`/founder/startups/${selectedStartupId}`} className={ctaClass}>Add</Link>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm py-1 border-b border-[rgba(255,255,255,0.02)]">
                    <div className="flex items-center gap-2.5">
                      <DotIndicator id="slogo" isCompleted={!!currentStartup.logo_url} />
                      <span className="text-xs text-white">Startup Logo</span>
                    </div>
                    {!currentStartup.logo_url && (
                      <Link to={`/founder/startups/${selectedStartupId}`} className={ctaClass}>Add</Link>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm py-1 border-b border-[rgba(255,255,255,0.02)]">
                    <div className="flex items-center gap-2.5">
                      <DotIndicator id="steam" isCompleted={!!currentStartup.team_size} />
                      <span className="text-xs text-white">Team Size</span>
                    </div>
                    {!currentStartup.team_size && (
                      <Link to={`/founder/startups/${selectedStartupId}`} className={ctaClass}>Add</Link>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm py-1 border-b border-[rgba(255,255,255,0.02)]">
                    <div className="flex items-center gap-2.5">
                      <DotIndicator id="sfunding" isCompleted={!!currentStartup.funding_raised} />
                      <span className="text-xs text-white">Funding</span>
                    </div>
                    {!currentStartup.funding_raised && (
                      <Link to={`/founder/startups/${selectedStartupId}`} className={ctaClass}>Add</Link>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm py-1 border-b border-[rgba(255,255,255,0.02)]">
                    <div className="flex items-center gap-2.5">
                      <DotIndicator id="slinkedin" isCompleted={!!currentStartup.linkedin_url} />
                      <span className="text-xs text-white">Company LinkedIn</span>
                    </div>
                    {!currentStartup.linkedin_url && (
                      <Link to={`/founder/startups/${selectedStartupId}`} className={ctaClass}>Add</Link>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm py-1 col-span-2">
                    <div className="flex items-center gap-2.5">
                      <DotIndicator id="sdeck" isCompleted={documents.length > 0} />
                      <span className="text-xs text-white">Upload Pitch Deck</span>
                    </div>
                    {documents.length === 0 && (
                      <Link to={`/founder/startups/${selectedStartupId}/documents`} className={ctaClass}>Add</Link>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 bg-[#1a1a1a] rounded-xl border border-[rgba(255,255,255,0.06)]">
                  <p className="text-xs text-[#9ca3af] mb-3">No startup is registered yet.</p>
                  <Link to="/founder/startups/new" className="px-4 py-2 bg-[#f97316] text-[#0a0a0a] font-bold text-xs rounded-lg inline-block">
                    Register Startup (+70%)
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT ROW (two columns) */}
      <div className="flex flex-col lg:flex-row gap-[16px]">
        
        {/* LEFT — AI Report Summary Card (~65% width) */}
        <div className="w-full lg:w-[65%] bg-[#111111] border border-[#1e1e1e] rounded-[12px] p-6 flex flex-col justify-between min-h-[460px]">
          <div>
            {/* Header row */}
            <div className="flex items-center justify-between gap-4 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-[#f97316]">✦</span>
                <h2 className="text-lg font-bold text-white">AI Report Summary</h2>
              </div>
              <Link
                to={selectedEvaluationId ? `/founder/startups/${selectedStartupId}/report/${selectedEvaluationId}` : "/founder/startup-redirect?action=report"}
                className="px-3 py-1.5 rounded-lg border border-[#f97316] text-[#f97316] hover:bg-[#f97316]/10 text-xs font-medium transition-all"
              >
                View Full Report →
              </Link>
            </div>
            <p className="text-[#9ca3af] text-xs">
              A comprehensive analysis of your startup&apos;s investment readiness.
            </p>
          </div>

          {/* Empty state center (or awaiting evaluation) */}
          <div className="my-auto py-8 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-[#f97316]/10 border border-[#f97316]/30 flex items-center justify-center mb-5 shadow-[0_0_40px_rgba(249,115,22,0.3)]">
              <FileText className="w-10 h-10 text-[#f97316]" />
            </div>
            <h3 className="text-[20px] font-bold text-white mb-2">
              Awaiting Evaluation Report
            </h3>
            <p className="text-[#9ca3af] text-sm max-w-md mx-auto mb-8 leading-relaxed">
              Upload your pitch deck PDF in the documents manager to trigger the AI multi-agent evaluation pipeline.
            </p>
            <Link
              to={selectedStartupId ? `/founder/startups/${selectedStartupId}/documents` : "/founder/startup-redirect?action=documents"}
              className="w-full max-w-md py-3.5 bg-[#f97316] hover:bg-orange-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-500/20 transition-all text-center block"
            >
              Manage Documents & Upload →
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN (stacked cards, ~35% width) */}
        <div className="w-full lg:w-[35%] flex flex-col gap-[16px]">
          
          {/* Activity Card */}
          <div className="bg-[#111111] border border-[#1e1e1e] rounded-[12px] p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                  <span>⚡</span>
                  <span>Activity</span>
                </h3>
                <button className="px-2.5 py-1 rounded-[8px] bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-[#9ca3af] hover:text-white transition-all cursor-pointer">
                  View All
                </button>
              </div>

              {/* Activity items */}
              <div className="space-y-4 my-4">
                {/* Item 1 */}
                <div className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#ef4444] shrink-0 mt-1.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">
                      Report v3 evaluation failed
                    </p>
                    <p className="text-[11px] text-[#6b7280]">10 mins ago</p>
                  </div>
                  <span className="bg-[#ef4444]/15 text-[#ef4444] border border-[#ef4444]/30 rounded-full px-2 py-0.5 text-[10px] font-medium ml-2 shrink-0">
                    Failed
                  </span>
                </div>

                {/* Item 2 */}
                <div className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#3b82f6] shrink-0 mt-1.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">
                      EcoTrack AI Pitch_Deck.pdf (v3) uploaded
                    </p>
                    <p className="text-[11px] text-[#6b7280]">12 mins ago</p>
                  </div>
                  <span className="bg-[#3b82f6]/15 text-[#3b82f6] border border-[#3b82f6]/30 rounded-full px-2 py-0.5 text-[10px] font-medium ml-2 shrink-0">
                    Uploaded
                  </span>
                </div>
              </div>
            </div>

            <Link
              to={selectedStartupId ? `/founder/startups/${selectedStartupId}/documents` : "/founder/startup-redirect?action=documents"}
              className="block text-center text-xs font-medium text-[#f97316] hover:underline pt-3 border-t border-[#1e1e1e] mt-2"
            >
              View All Activity →
            </Link>
          </div>

          {/* Meeting Requests Card */}
          <div className="bg-[#111111] border border-[#1e1e1e] rounded-[12px] p-5 flex flex-col justify-between max-h-[300px] overflow-y-auto custom-scrollbar">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <User className="w-4 h-4 text-[#f97316]" />
              Meeting Requests
            </h3>
            
            {meetingRequests.length === 0 ? (
              <p className="text-xs text-[#9ca3af] text-center my-4">No meeting requests yet.</p>
            ) : (
              <div className="space-y-3">
                {meetingRequests.map(req => (
                  <div key={req.id} className="bg-[#1a1a1a] p-3 rounded-lg border border-[rgba(255,255,255,0.05)]">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {req.users?.profile_photo_url ? (
                          <img src={req.users.profile_photo_url} className="w-5 h-5 rounded-full" />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-[#f97316] text-[#0A0A0A] font-bold text-[10px] flex items-center justify-center">
                            {req.users?.name?.charAt(0) || "I"}
                          </div>
                        )}
                        <span className="text-xs font-bold text-white">{req.users?.name || "Investor"}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                        req.status === 'pending' ? 'bg-[#f97316]/20 text-[#f97316]' :
                        req.status === 'accepted' ? 'bg-[#34D399]/20 text-[#34D399]' :
                        'bg-[#EF4444]/20 text-[#EF4444]'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#9ca3af] mb-1">
                      Requested meeting for <strong className="text-white">{req.startups?.startup_name}</strong>
                    </p>
                    {req.agenda && (
                      <p className="text-[10px] text-[#9ca3af] mb-1 italic border-l-2 border-[#1e1e1e] pl-2 py-0.5">
                        "{req.agenda}"
                      </p>
                    )}
                    {req.scheduled_at && (
                      <p className="text-[10px] text-[#FAFAFA] mb-1 flex items-center gap-1">
                        📅 {new Date(req.scheduled_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} at {new Date(req.scheduled_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    )}
                    {req.meeting_link && req.status === 'accepted' && (
                      <a
                        href={req.meeting_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-[#34D399] hover:underline mb-2"
                      >
                        🔗 Join Meeting
                      </a>
                    )}
                    {req.status === 'pending' && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleMeetingResponse(req.id, 'accepted')}
                          className="flex-1 py-1 rounded bg-[#34D399]/10 text-[#34D399] border border-[#34D399]/20 hover:bg-[#34D399]/20 text-xs font-bold transition-colors"
                        >
                          Accept
                        </button>
                        <button 
                          onClick={() => handleMeetingResponse(req.id, 'declined')}
                          className="flex-1 py-1 rounded bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20 hover:bg-[#EF4444]/20 text-xs font-bold transition-colors"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Connect with Top VCs Card */}
          <div className="bg-[#1a1040] border border-[#6c4bdb] rounded-[12px] p-5 flex flex-col justify-between flex-1">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#c4b5fd]" />
                  <h3 className="text-base font-bold text-white">Connect with Top VCs</h3>
                </div>
                
                {/* Stacked investor avatars */}
                <div className="flex items-center -space-x-2">
                  <div className="w-6 h-6 rounded-full border-2 border-[#1a1040] bg-gradient-to-tr from-purple-500 to-indigo-500 text-[9px] font-bold flex items-center justify-center text-white">
                    VC
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 border-[#1a1040] bg-gradient-to-tr from-blue-500 to-cyan-500 text-[9px] font-bold flex items-center justify-center text-white">
                    A1
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 border-[#1a1040] bg-gradient-to-tr from-emerald-500 to-teal-500 text-[9px] font-bold flex items-center justify-center text-white">
                    S
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 border-[#1a1040] bg-[#f97316] text-[10px] font-bold flex items-center justify-center text-white">
                    +4
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#c4b5fd]/80 my-3 leading-relaxed">
                Upload a pitch deck to get evaluated and matched with top investors.
              </p>
            </div>

            <button
              onClick={() => alert("Office hours scheduling modal triggered.")}
              className="w-full py-2.5 px-4 rounded-lg border border-[#f97316] text-[#f97316] hover:bg-[#f97316]/10 text-xs font-bold transition-all text-center block cursor-pointer mt-2"
            >
              Schedule Office Hours →
            </button>
          </div>

        </div>

      </div>

      {/* QUICK ACCESS SECTION */}
      <div className="mt-[24px]">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span>⚡</span>
          <span>Quick Access</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Action 1 */}
          <Link
            to={selectedStartupId ? `/founder/startups/${selectedStartupId}/documents` : "/founder/startup-redirect?action=documents"}
            className="bg-[#111111] border border-[#1e1e1e] rounded-[12px] p-4 flex items-center justify-between hover:bg-white/5 transition-all duration-150 group cursor-pointer"
          >
            <div>
              <FileUp className="w-5 h-5 text-[#9ca3af] group-hover:text-[#f97316] transition-colors mb-2.5" />
              <p className="text-sm font-bold text-white">Upload Documents</p>
              <p className="text-xs text-[#6b7280] mt-0.5">Pitch decks & financials</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[#6b7280] group-hover:text-[#f97316] group-hover:translate-x-1 transition-all" />
          </Link>

          {/* Action 2 */}
          <Link
            to={selectedEvaluationId ? `/founder/startups/${selectedStartupId}/report/${selectedEvaluationId}` : "/founder/startup-redirect?action=report"}
            className="bg-[#111111] border border-[#1e1e1e] rounded-[12px] p-4 flex items-center justify-between hover:bg-white/5 transition-all duration-150 group cursor-pointer"
          >
            <div>
              <FileText className="w-5 h-5 text-[#9ca3af] group-hover:text-[#f97316] transition-colors mb-2.5" />
              <p className="text-sm font-bold text-white">View Reports</p>
              <p className="text-xs text-[#6b7280] mt-0.5">AI evaluation analysis</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[#6b7280] group-hover:text-[#f97316] group-hover:translate-x-1 transition-all" />
          </Link>

          {/* Action 3 */}
          <div
            onClick={() => alert("Investor matching portal opened.")}
            className="bg-[#111111] border border-[#1e1e1e] rounded-[12px] p-4 flex items-center justify-between hover:bg-white/5 transition-all duration-150 group cursor-pointer"
          >
            <div>
              <Users className="w-5 h-5 text-[#9ca3af] group-hover:text-[#f97316] transition-colors mb-2.5" />
              <p className="text-sm font-bold text-white">Investor Matches</p>
              <p className="text-xs text-[#6b7280] mt-0.5">Find ideal VCs</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[#6b7280] group-hover:text-[#f97316] group-hover:translate-x-1 transition-all" />
          </div>

          {/* Action 4 */}
          <div
            onClick={() => alert("Analytics view triggered.")}
            className="bg-[#111111] border border-[#1e1e1e] rounded-[12px] p-4 flex items-center justify-between hover:bg-white/5 transition-all duration-150 group cursor-pointer"
          >
            <div>
              <LineChart className="w-5 h-5 text-[#9ca3af] group-hover:text-[#f97316] transition-colors mb-2.5" />
              <p className="text-sm font-bold text-white">Analytics</p>
              <p className="text-xs text-[#6b7280] mt-0.5">Deal flow metrics</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[#6b7280] group-hover:text-[#f97316] group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>

    </div>
  );
};
