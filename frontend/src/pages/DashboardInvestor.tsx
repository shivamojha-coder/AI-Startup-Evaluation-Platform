import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDealflow, getDealflowStats, requestMeeting, getInvestorMeetings, toggleShortlistAPI, getShortlistedAPI } from "../api/startups";
import type { DealflowStatsResponse } from "../api/startups";
import type { DealflowResponse } from "../schemas/startup";
import { SpotlightCard } from "../components/SpotlightCard";
import { AnimatedBorder } from "../components/ui/AnimatedBorder";
import { TextType } from "../components/ui/TextType";
import { ShinyText } from "../components/ui/ShinyText";
import { CountUp } from "../components/landing/ui/CountUp";
import { User, MapPin, Heart, Calendar, ArrowRight, Search, Briefcase, Layers3, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardSkeleton } from "../components/skeletons/DashboardSkeleton";
import { StartupCardSkeleton } from "../components/skeletons/StartupCardSkeleton";
import { Pagination } from "../components/pagination/Pagination";
import { PaginationInfo } from "../components/pagination/PaginationInfo";
import { ScoreRing } from "../components/ui/ScoreRing";

const FilterSelect = ({ value, onChange, options, placeholder, icon: Icon }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-[52px] bg-[#1B1B1B] border rounded-[14px] px-4 flex items-center justify-between text-sm transition-all duration-180 ease-out cursor-pointer ${isOpen ? "border-[#F97316] shadow-[0_0_0_4px_rgba(249,115,22,0.08)]" : "border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.15)]"
          }`}
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-[#9A9A9A]" />}
          <span className={value ? "text-[#FAFAFA]" : "text-[#9A9A9A]"}>
            {value || placeholder}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-[#9A9A9A] transition-transform duration-180 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-[#1B1B1B] border border-[rgba(255,255,255,0.08)] rounded-[14px] shadow-xl py-1.5 z-50 max-h-60 overflow-y-auto">
          <button
            className="w-full px-4 py-2 text-left text-sm text-[#FAFAFA] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
            onClick={() => { onChange(""); setIsOpen(false); }}
          >
            All {placeholder}s
          </button>
          {options.map((opt: string) => (
            <button
              key={opt}
              className={`w-full px-4 py-2 text-left text-sm transition-colors ${value === opt ? "bg-[rgba(249,115,22,0.1)] text-[#FE9638]" : "text-[#FAFAFA] hover:bg-[rgba(255,255,255,0.05)]"
                }`}
              onClick={() => { onChange(opt); setIsOpen(false); }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const DashboardInvestor: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [startups, setStartups] = useState<DealflowResponse[]>([]);
  const [totalStartups, setTotalStartups] = useState(0);
  const [industries, setIndustries] = useState<string[]>([]);
  const [stages, setStages] = useState<string[]>([]);
  
  const [stats, setStats] = useState<DealflowStatsResponse | null>(null);
  const [meetingRequests, setMeetingRequests] = useState<any[]>([]);
  const [initialDataLoading, setInitialDataLoading] = useState(true);
  const [isFetchingPage, setIsFetchingPage] = useState(false);

  // Pagination limit
  const [limit, setLimit] = useState(10);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const totalPages = Math.ceil(totalStartups / limit);

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
    const updateLimit = () => {
      if (window.innerWidth < 768) setLimit(10);
      else if (window.innerWidth < 1024) setLimit(10);
      else setLimit(10);
    };
    updateLimit();
    window.addEventListener("resize", updateLimit);
    return () => window.removeEventListener("resize", updateLimit);
  }, []);

  useEffect(() => {
    if (!loading && (!user || user.role !== "investor")) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user && user.role === "investor") {
      fetchInitialData();
    }
  }, [user]);

  const fetchInitialData = async () => {
    try {
      setInitialDataLoading(true);
      const [statsData, shortlistedData, meetingsData] = await Promise.all([
        getDealflowStats(),
        getShortlistedAPI(),
        getInvestorMeetings()
      ]);
      setStats(statsData);
      setShortlistedIds(shortlistedData);
      setMeetingRequests(meetingsData);
    } catch (err) {
      console.error("Failed to fetch initial data", err);
    } finally {
      setInitialDataLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === "investor" && !initialDataLoading) {
      fetchPageData();
    }
  }, [initialDataLoading, page, limit, searchQuery, industryFilter, stageFilter, location.hash, shortlistedIds, meetingRequests]);

  const fetchPageData = async () => {
    try {
      setIsFetchingPage(true);
      let s_ids = undefined;
      let m_ids = undefined;
      if (location.hash === "#shortlist") s_ids = shortlistedIds.join(",");
      if (location.hash === "#meetings") m_ids = meetingRequests.map(m => m.startup_id).join(",");

      const response = await getDealflow({
        page,
        limit,
        search: searchQuery,
        industry: industryFilter,
        stage: stageFilter,
        shortlisted_ids: s_ids,
        meeting_ids: m_ids
      });
      setStartups(response.data);
      setTotalStartups(response.total);
      setIndustries(response.industries);
      setStages(response.stages);
    } catch (err) {
      console.error("Failed to fetch page data", err);
    } finally {
      setIsFetchingPage(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams(prev => {
      prev.set("page", newPage.toString());
      return prev;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    setSearchParams(prev => { prev.set("page", "1"); return prev; });
  };

  const handleIndustryChange = (ind: string) => {
    setIndustryFilter(ind);
    setSearchParams(prev => { prev.set("page", "1"); return prev; });
  };

  const handleStageChange = (st: string) => {
    setStageFilter(st);
    setSearchParams(prev => { prev.set("page", "1"); return prev; });
  };

  if (!user || user.role !== "investor") {
    return null;
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low": return "text-[#34D399] bg-[rgba(52,211,153,0.1)] border-[#34D399]/20";
      case "Medium": return "text-[#FBBF24] bg-[rgba(251,191,36,0.1)] border-[#FBBF24]/20";
      case "High": return "text-[#EF4444] bg-[rgba(239,68,68,0.1)] border-[#EF4444]/20";
      default: return "text-[#9A9A9A] bg-[rgba(255,255,255,0.05)] border-transparent";
    }
  };

  return (
    <AnimatePresence mode="wait">
      {loading || initialDataLoading ? (
        <motion.div
          key="skeleton"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="w-full flex flex-1 flex-col"
        >
          <DashboardSkeleton />
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="w-full flex flex-1 flex-col"
        >
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
                  <div className="w-full rounded-[18px] bg-[#141414] border border-[rgba(255,255,255,0.06)] p-4 flex flex-col md:flex-row gap-4 items-center">

                    <div className="relative w-full md:w-[75%] group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9A9A9A] group-hover:text-[#F97316] transition-colors duration-180" />
                      <input
                        type="text"
                        placeholder="Search startups, founders, industries..."
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="w-full h-[52px] bg-[#1B1B1B] border border-[rgba(255,255,255,0.08)] rounded-[14px] pl-12 pr-16 text-sm text-[#FAFAFA] placeholder-[#666] focus:outline-none focus:border-[#F97316] focus:shadow-[0_0_0_4px_rgba(249,115,22,0.08)] hover:border-[#F97316] hover:shadow-[0_0_12px_rgba(249,115,22,0.15)] transition-all duration-180 ease-out"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center h-6 px-2 rounded-md bg-[#141414] border border-[rgba(255,255,255,0.1)] text-[#9A9A9A] text-[10px] font-bold tracking-widest">
                        CTRL K
                      </div>
                    </div>

                    <div className="w-full md:w-[25%] flex gap-4">
                      <div className="flex-1">
                        <FilterSelect
                          value={industryFilter}
                          onChange={handleIndustryChange}
                          options={industries}
                          placeholder="Industry"
                          icon={Briefcase}
                        />
                      </div>
                      <div className="flex-1">
                        <FilterSelect
                          value={stageFilter}
                          onChange={handleStageChange}
                          options={stages}
                          placeholder="Stage"
                          icon={Layers3}
                        />
                      </div>
                    </div>

                  </div>
                )}

                {/* Startups Grid */}
                <div className="grid gap-6 md:grid-cols-2">
                  {isFetchingPage ? (
                    [...Array(limit)].map((_, i) => <StartupCardSkeleton key={i} />)
                  ) : startups.map(startup => (
                    <SpotlightCard
                      key={startup.id}
                      spotlightColor="rgba(249, 115, 22, 0.18)"
                      onClick={() => navigate(`/investor/report/${startup.id}`)}
                      className="rounded-2xl bg-[#141414] border border-[rgba(255,255,255,0.08)] shadow-xl hover:border-[#FE9638]/50 p-5 transition-all relative flex flex-col group cursor-pointer hover:-translate-y-1"
                    >
                      <AnimatedBorder />
                      {/* Header */}
                      <div className="flex items-start gap-4 mb-5">
                        <div className="w-16 h-16 rounded-2xl bg-[rgba(255, 191, 134, 0.15)] border border-[#FE9638]/30 flex items-center justify-center font-bold text-2xl text-[#FE9638] overflow-hidden shrink-0">
                          {startup.logo_url ? <img src={startup.logo_url} alt="logo" className="w-full h-full object-cover" /> : startup.startup_name.charAt(0).toUpperCase()}
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
                            <span>&bull;</span>
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
                            <ScoreRing score={startup.ai_score?.overall || 0} max={100} size={72} strokeWidth={8} />
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
                            className={`p-2 rounded-lg bg-[rgba(255,255,255,0.05)] transition-colors flex items-center justify-center cursor-pointer ${shortlistedIds.includes(startup.id)
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
                          Review Startup <ArrowRight className="w-5 h-5" />
                        </button>
                      </div>
                    </SpotlightCard>
                  ))}

                  {!isFetchingPage && startups.length === 0 && (
                    <div className="col-span-full py-20 text-center text-[#9A9A9A] bg-[#141414] rounded-2xl border border-[rgba(255,255,255,0.05)]">
                      No startups found matching your filters. Try adjusting your search.
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {!isFetchingPage && totalPages > 0 && (
                  <div className="mt-10 mb-6 flex flex-col items-center justify-center w-full max-w-4xl mx-auto bg-[#171717] border border-[#2A2A2A] rounded-[16px] px-6 py-8 shadow-2xl">
                    <PaginationInfo
                      currentPage={page}
                      limit={limit}
                      total={totalStartups}
                    />
                    <Pagination
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      className="mt-6"
                    />
                  </div>
                )}
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
                      disabled={!meetingDate || !meetingTime || !meetingAgenda || meetingSubmitting}
                      className="flex-1 py-3 rounded-xl bg-[#FE9638] text-[#0A0A0A] font-bold text-sm hover:bg-[#E28528] transition-colors shadow-lg shadow-[#FE9638]/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {meetingSubmitting ? "Sending..." : "Send Request"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
