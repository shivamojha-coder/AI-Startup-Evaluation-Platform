import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDealflow, getDealflowStats, requestMeeting, getInvestorMeetings, toggleShortlistAPI, getShortlistedAPI } from "../api/startups";
import type { DealflowStatsResponse } from "../api/startups";
import type { DealflowResponse } from "../schemas/startup";
import { SpotlightCard } from "../components/SpotlightCard";
import { AnimatedBorder } from "../components/ui/AnimatedBorder";
import { TextType } from "../components/ui/TextType";
import { ShinyText } from "../components/ui/ShinyText";
import { CountUp } from "../components/landing/ui/CountUp";
import { User, MapPin, Heart, Calendar } from "lucide-react";

export const DashboardInvestor: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [startups, setStartups] = useState<DealflowResponse[]>([]);
  const [filteredStartups, setFilteredStartups] = useState<DealflowResponse[]>([]);
  const [stats, setStats] = useState<DealflowStatsResponse | null>(null);
  const [meetingRequests, setMeetingRequests] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  
  const [shortlistedIds, setShortlistedIds] = useState<string[]>([]);

  // Meeting Schedule Modal State
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [meetingStartupId, setMeetingStartupId] = useState<string | null>(null);
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [meetingAgenda, setMeetingAgenda] = useState("");
  const [meetingSubmitting, setMeetingSubmitting] = useState(false);

  const toggleShortlist = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await toggleShortlistAPI(id);
      let updated;
      if (shortlistedIds.includes(id)) {
        updated = shortlistedIds.filter(x => x !== id);
      } else {
        updated = [...shortlistedIds, id];
      }
      setShortlistedIds(updated);
      
      if (stats) {
        setStats({
          ...stats,
          shortlisted: updated.length
        });
      }
    } catch (err) {
      console.error("Failed to toggle shortlist", err);
    }
  };
  
  const openMeetingModal = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (meetingRequests.find(m => m.startup_id === id)) return;
    setMeetingStartupId(id);
    setMeetingDate("");
    setMeetingTime("");
    setMeetingAgenda("");
    setShowMeetingModal(true);
  };

  const handleSubmitMeeting = async () => {
    if (!meetingStartupId || !meetingDate || !meetingTime || !meetingAgenda) return;
    setMeetingSubmitting(true);
    try {
      const scheduledAt = new Date(`${meetingDate}T${meetingTime}`).toISOString();
      const newReq = await requestMeeting(meetingStartupId, scheduledAt, meetingAgenda);
      setMeetingRequests(prev => [...prev, newReq]);
      setShowMeetingModal(false);
    } catch (err) {
      console.error("Failed to request meeting", err);
    } finally {
      setMeetingSubmitting(false);
    }
  };
  
  const fetchMeetingRequests = async () => {
    try {
      const data = await getInvestorMeetings();
      setMeetingRequests(data);
    } catch (err) {
      console.error("Failed to fetch meetings", err);
    }
  };
  useEffect(() => {
    if (!loading && (!user || user.role !== "investor")) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user && user.role === "investor") {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setDataLoading(true);
      const [dealflowData, statsData, shortlistedData] = await Promise.all([
        getDealflow(),
        getDealflowStats(),
        getShortlistedAPI()
      ]);
      setStartups(dealflowData);
      setFilteredStartups(dealflowData);
      setStats(statsData);
      setShortlistedIds(shortlistedData);
      await fetchMeetingRequests();
    } catch (err) {
      console.error("Failed to fetch dealflow", err);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    let result = [...startups];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => 
        (s.startup_name && s.startup_name.toLowerCase().includes(q)) ||
        (s.industry && s.industry.toLowerCase().includes(q)) ||
        (s.description && s.description.toLowerCase().includes(q)) ||
        (s.stage && s.stage.toLowerCase().includes(q)) ||
        (s.founder_name && s.founder_name.toLowerCase().includes(q))
      );
    }

    // Filters
    if (industryFilter) {
      result = result.filter(s => s.industry?.toLowerCase() === industryFilter.toLowerCase());
    }
    if (stageFilter) {
      result = result.filter(s => s.stage?.toLowerCase() === stageFilter.toLowerCase());
    }

    if (location.hash === "#shortlist") {
      result = result.filter(s => shortlistedIds.includes(s.id));
    }

    if (location.hash === "#meetings") {
      const requestedIds = meetingRequests.map(m => m.startup_id);
      result = result.filter(s => requestedIds.includes(s.id));
    }

    setFilteredStartups(result);
  }, [searchQuery, industryFilter, stageFilter, startups, location.hash, shortlistedIds, meetingRequests]);

  if (loading || dataLoading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-transparent min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FE9638] border-t-transparent"></div>
      </div>
    );
  }

  if (!user || user.role !== "investor") {
    return null;
  }

  const industries = Array.from(new Set(startups.map(s => s.industry).filter(Boolean))) as string[];
  const stages = Array.from(new Set(startups.map(s => s.stage).filter(Boolean))) as string[];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low": return "text-[#34D399] bg-[rgba(52,211,153,0.1)] border-[#34D399]/20";
      case "Medium": return "text-[#FBBF24] bg-[rgba(251,191,36,0.1)] border-[#FBBF24]/20";
      case "High": return "text-[#EF4444] bg-[rgba(239,68,68,0.1)] border-[#EF4444]/20";
      default: return "text-[#9A9A9A] bg-[rgba(255,255,255,0.05)] border-transparent";
    }
  };

  return (
    <div className="flex flex-1 flex-col bg-transparent p-6 sm:p-10 text-[#FAFAFA] min-h-screen relative">
      <div className="mx-auto max-w-[1400px] w-full flex flex-col xl:flex-row gap-8 pb-20">
        
        {/* Main Content Area */}
        <div className={`flex-1 space-y-8 ${location.hash === '#shortlist' || location.hash === '#meetings' ? 'max-w-5xl' : ''}`}>
          
          {/* Hero & Stats */}
          {location.hash === '#shortlist' ? (
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#FAFAFA]">
                Your Shortlisted Startups
              </h1>
              <p className="mt-2 text-sm text-[#9A9A9A]">
                Startups you have saved for later review.
              </p>
            </div>
          ) : location.hash === '#meetings' ? (
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#FAFAFA]">
                Your Meetings
              </h1>
              <p className="mt-2 text-sm text-[#9A9A9A]">
                Startups you have requested a meeting with.
              </p>
            </div>
          ) : (
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#FAFAFA]">
                Welcome back,{" "}
                <ShinyText 
                  text={`${user.name?.split(' ')[0] || "Investor"} `}
                  baseColor="#F97316"
                  shineColor="#FFFFFF"
                  speed={3}
                  delay={2}
                  spread={120}
                  direction="left"
                  yoyo={false}
                  pauseOnHover={false}
                  disabled={false}
                />
              </h1>
              <p className="mt-2 text-sm text-[#9A9A9A]">
                <TextType 
                  texts={[
                    `${stats?.ready_for_review || 0} startups are ready for review.`,
                    "Discover your next high-potential startup.",
                    "AI has analyzed new investment opportunities.",
                    "Your shortlist is waiting for review."
                  ]}
                  typingSpeed={50}
                  deletingSpeed={30}
                  pauseDuration={2200}
                  initialDelay={500}
                  loop={true}
                  showCursor={true}
                  hideCursorWhileTyping={false}
                  cursor="|"
                  cursorColor="#F97316"
                  variableSpeed={{ min: 40, max: 65 }}
                  startOnVisible={false}
                  reverseMode={false}
                />
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                <div className="bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-2xl p-4 flex flex-col">
                  <span className="text-xs font-bold uppercase text-[#9A9A9A]">New Startups</span>
                  <CountUp end={stats?.new_startups || 0} duration={2500} separator="" className="text-2xl font-black text-[#FAFAFA] mt-1" />
                </div>
                <div className="bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-2xl p-4 flex flex-col">
                  <span className="text-xs font-bold uppercase text-[#9A9A9A]">Ready for Review</span>
                  <CountUp end={stats?.ready_for_review || 0} duration={2500} separator="" className="text-2xl font-black text-[#FE9638] mt-1" />
                </div>
                <div className="bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-2xl p-4 flex flex-col">
                  <span className="text-xs font-bold uppercase text-[#9A9A9A]">My Shortlist</span>
                  <CountUp end={shortlistedIds.length || 0} duration={2500} separator="" className="text-2xl font-black text-[#FAFAFA] mt-1" />
                </div>
                <div className="bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-2xl p-4 flex flex-col">
                  <span className="text-xs font-bold uppercase text-[#9A9A9A]">Meeting Requests</span>
                  <CountUp end={stats?.meeting_requests || 0} duration={2500} separator="" className="text-2xl font-black text-[#FAFAFA] mt-1" />
                </div>
              </div>
            </div>
          )}

          {/* Search & Filters */}
          {location.hash !== '#shortlist' && location.hash !== '#meetings' && (
            <div className="rounded-2xl bg-[#141414] border border-[rgba(255,255,255,0.08)] p-4 shadow-lg flex flex-col flex-wrap lg:flex-row gap-4">
              <div className="flex-1 min-w-[200px] relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9A9A9A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                  type="text" 
                  placeholder="Search startups, founders, industries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#1C1C1C] border border-[rgba(255,255,255,0.08)] rounded-xl py-3 pl-10 pr-4 text-sm text-[#FAFAFA] placeholder-[#666] focus:outline-none focus:border-[#FE9638]/50 transition-colors"
                />
              </div>
              
              <div className="flex flex-wrap gap-3">
                <select 
                  value={industryFilter} 
                  onChange={(e) => setIndustryFilter(e.target.value)}
                  className="bg-[#1C1C1C] border border-[rgba(255,255,255,0.08)] rounded-xl py-3 px-3 text-xs sm:text-sm text-[#FAFAFA] focus:outline-none focus:border-[#FE9638]/50"
                >
                  <option value="">Industry ▼</option>
                  {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                </select>
                
                <select 
                  value={stageFilter} 
                  onChange={(e) => setStageFilter(e.target.value)}
                  className="bg-[#1C1C1C] border border-[rgba(255,255,255,0.08)] rounded-xl py-3 px-3 text-xs sm:text-sm text-[#FAFAFA] focus:outline-none focus:border-[#FE9638]/50"
                >
                  <option value="">Stage ▼</option>
                  {stages.map(stg => <option key={stg} value={stg}>{stg}</option>)}
                </select>

              </div>
            </div>
          )}

          {/* Startups Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {filteredStartups.map(startup => (
              <SpotlightCard 
                key={startup.id}
                spotlightColor="rgba(249, 115, 22, 0.18)"
                onClick={() => navigate(`/investor/report/${startup.id}`)}
                className="rounded-2xl bg-[#141414] border border-[rgba(255,255,255,0.08)] shadow-xl hover:border-[#FE9638]/50 p-5 transition-all relative flex flex-col group cursor-pointer hover:-translate-y-1"
              >
                <AnimatedBorder />
                {/* Header */}
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-[rgba(254,150,56,0.15)] border border-[#FE9638]/30 flex items-center justify-center font-bold text-2xl text-[#FE9638] overflow-hidden shrink-0">
                    {startup.logo_url ? <img src={startup.logo_url} alt="logo" className="w-full h-full object-cover" /> : startup.startup_name.charAt(0)}
                  </div>
                  <div className="flex-1 pr-8">
                    <h3 className="font-extrabold text-xl text-[#FAFAFA] line-clamp-1">{startup.startup_name}</h3>
                    <p className="text-sm text-[#9A9A9A] mt-0.5 flex items-center gap-3">
                      <span className="flex items-center gap-1.5">
                        {startup.founder_photo_url ? (
                          <img src={startup.founder_photo_url} alt={startup.founder_name} className="w-4 h-4 rounded-full object-cover" />
                        ) : (
                          <User className="w-3.5 h-3.5" />
                        )}
                        {startup.founder_name}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {startup.location}</span>
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#9A9A9A] bg-[#1C1C1C] px-2 py-1 rounded-md border border-[rgba(255,255,255,0.05)]">
                        {startup.industry || "N/A"}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#FE9638] bg-[rgba(254,150,56,0.1)] px-2 py-1 rounded-md border border-[#FE9638]/20">
                        {startup.stage || "N/A"}
                      </span>
                      <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${getRiskColor(startup.risk_level)}`}>
                        <div className="w-1.5 h-1.5 rounded-full bg-current" />
                        {startup.risk_level} Risk
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score Breakdown Grid */}
                <div className="mb-5 rounded-xl bg-[#1C1C1C] border border-[rgba(255,255,255,0.05)] p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-end border-b border-[rgba(255,255,255,0.05)] pb-3">
                    <div>
                      <span className="block text-[10px] font-bold uppercase text-[#666]">Overall Score</span>
                      <span className="text-2xl font-black text-[#FE9638]">
                        <CountUp end={startup.ai_score?.overall || 0} duration={2500} separator="" className="" />
                        <span className="text-sm text-[#666]">/100</span>
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[10px] font-bold uppercase text-[#666]">Asking</span>
                      <span className="text-lg font-bold text-[#FAFAFA]">{startup.funding_ask || "Undisclosed"}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div>
                      <span className="block text-[9px] font-bold uppercase text-[#9A9A9A]">Market</span>
                      <CountUp end={startup.ai_score?.market || 0} duration={2500} separator="" className="text-sm font-semibold text-[#FAFAFA]" />
                    </div>
                    <div>
                      <span className="block text-[9px] font-bold uppercase text-[#9A9A9A]">Founder</span>
                      <CountUp end={startup.ai_score?.founder || 0} duration={2500} separator="" className="text-sm font-semibold text-[#FAFAFA]" />
                    </div>
                    <div>
                      <span className="block text-[9px] font-bold uppercase text-[#9A9A9A]">Financial</span>
                      <CountUp end={startup.ai_score?.financial || 0} duration={2500} separator="" className="text-sm font-semibold text-[#FAFAFA]" />
                    </div>
                    <div>
                      <span className="block text-[9px] font-bold uppercase text-[#9A9A9A]">Product</span>
                      <CountUp end={startup.ai_score?.product || 0} duration={2500} separator="" className="text-sm font-semibold text-[#FAFAFA]" />
                    </div>
                  </div>
                </div>
                
                {/* Verifications */}
                {startup.verifications && startup.verifications.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-5">
                    {startup.verifications.map((ver, idx) => (
                      <span key={idx} className="flex items-center gap-1 text-[10px] font-bold text-[#34D399] bg-[rgba(52,211,153,0.1)] px-2 py-1 rounded">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                        {ver}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-auto pt-4 border-t border-[rgba(255,255,255,0.05)] flex items-center justify-between">
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => toggleShortlist(startup.id, e)}
                      className={`p-2 rounded-lg bg-[rgba(255,255,255,0.05)] transition-colors flex items-center justify-center cursor-pointer ${
                        shortlistedIds.includes(startup.id) 
                          ? 'text-[#FE9638] bg-[rgba(254,150,56,0.1)] hover:bg-[rgba(254,150,56,0.2)]'
                          : 'text-[#9A9A9A] hover:bg-[rgba(255,255,255,0.1)] hover:text-[#FAFAFA]'
                      }`}
                      title="Shortlist"
                    >
                      <Heart className="w-4 h-4" fill={shortlistedIds.includes(startup.id) ? "currentColor" : "none"} />
                    </button>
                    {meetingRequests.find(m => m.startup_id === startup.id) ? (
                      <div className="flex items-center gap-2">
                        {meetingRequests.find(m => m.startup_id === startup.id)?.status === 'accepted' && meetingRequests.find(m => m.startup_id === startup.id)?.meeting_link ? (
                          <a 
                            href={meetingRequests.find(m => m.startup_id === startup.id)?.meeting_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-[#34D399]/10 text-[#34D399] text-xs font-bold border border-[#34D399]/20 hover:bg-[#34D399]/20 transition-colors flex items-center gap-1"
                          >
                            Join Zoom
                          </a>
                        ) : (
                          <div className="px-3 py-1.5 rounded-lg bg-[rgba(254,150,56,0.1)] text-[#FE9638] text-xs font-bold border border-[#FE9638]/20 flex items-center justify-center capitalize">
                            {meetingRequests.find(m => m.startup_id === startup.id)?.status}
                          </div>
                        )}
                      </div>
                    ) : (
                      <button 
                        onClick={(e) => openMeetingModal(startup.id, e)}
                        className="p-2 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-[#9A9A9A] hover:text-[#FAFAFA] transition-colors flex items-center justify-center cursor-pointer"
                        title="Schedule Meeting"
                      >
                        <Calendar className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <button className="flex items-center gap-2 text-sm font-bold text-[#FE9638] group-hover:translate-x-1 transition-transform">
                    Review Startup <span className="text-lg">→</span>
                  </button>
                </div>
              </SpotlightCard>
            ))}
            
            {filteredStartups.length === 0 && (
              <div className="col-span-full py-20 text-center text-[#9A9A9A] bg-[#141414] rounded-2xl border border-[rgba(255,255,255,0.05)]">
                No startups found matching your filters. Try adjusting your search.
              </div>
            )}
          </div>
        </div>

        {/* Right Side Activity Panel */}
        {location.hash !== '#shortlist' && location.hash !== '#meetings' && (
          <div className="xl:w-80 shrink-0 space-y-6">
            <div className="bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 sticky top-24">
              <h3 className="font-bold text-[#FAFAFA] mb-4 text-lg border-b border-[rgba(255,255,255,0.05)] pb-3">Recent Activity</h3>
              <ul className="space-y-4">
                <li className="flex gap-3 items-start">
                  <div className="w-2 h-2 rounded-full bg-[#FE9638] mt-1.5 shrink-0"></div>
                  <p className="text-sm text-[#9A9A9A]"><strong className="text-[#FAFAFA]">3 new startups</strong> were evaluated and added to dealflow.</p>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="w-2 h-2 rounded-full bg-[#34D399] mt-1.5 shrink-0"></div>
                  <p className="text-sm text-[#9A9A9A]"><strong className="text-[#FAFAFA]">TechNova</strong> founder updated their pitch deck.</p>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="w-2 h-2 rounded-full bg-[#FBBF24] mt-1.5 shrink-0"></div>
                  <p className="text-sm text-[#9A9A9A]">You requested a meeting with <strong className="text-[#FAFAFA]">HealthSync AI</strong>.</p>
                </li>
              </ul>

              <h3 className="font-bold text-[#FAFAFA] mb-4 mt-8 text-lg border-b border-[rgba(255,255,255,0.05)] pb-3">Trending Industries</h3>
              <div className="flex flex-wrap gap-2">
                <span className="bg-[#1C1C1C] border border-[rgba(255,255,255,0.05)] text-xs font-bold text-[#FAFAFA] px-3 py-1.5 rounded-lg">#AI</span>
                <span className="bg-[#1C1C1C] border border-[rgba(255,255,255,0.05)] text-xs font-bold text-[#FAFAFA] px-3 py-1.5 rounded-lg">#Healthcare</span>
                <span className="bg-[#1C1C1C] border border-[rgba(255,255,255,0.05)] text-xs font-bold text-[#FAFAFA] px-3 py-1.5 rounded-lg">#FinTech</span>
                <span className="bg-[#1C1C1C] border border-[rgba(255,255,255,0.05)] text-xs font-bold text-[#FAFAFA] px-3 py-1.5 rounded-lg">#SaaS</span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Schedule Meeting Modal */}
      {showMeetingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowMeetingModal(false)}>
          <div className="bg-[#141414] border border-[rgba(255,255,255,0.1)] rounded-2xl p-8 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-[#FAFAFA] mb-1">Schedule Meeting</h2>
            <p className="text-sm text-[#9A9A9A] mb-6">Choose a date, time, and provide your meeting link.</p>

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
                <label className="block text-xs font-bold text-[#9A9A9A] mb-1.5 uppercase tracking-wider">Agenda</label>
                <textarea
                  value={meetingAgenda}
                  onChange={(e) => setMeetingAgenda(e.target.value)}
                  placeholder="E.g., Pitch presentation, Financials review..."
                  rows={2}
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
                disabled={!meetingDate || !meetingTime || !meetingLink || meetingSubmitting}
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
