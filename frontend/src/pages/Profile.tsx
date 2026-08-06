import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../api/auth";
import { getStartups } from "../api/startups";
import { uploadImage } from "../api/upload";
import type { StartupResponse } from "../schemas/startup";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  AlignLeft,
  Save,
  Building2,
  TrendingUp,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Camera,
  Briefcase,
  Upload,
  MapPin,
  Calendar,
  Phone,
  Shield,
  Download,
  Bell,
  ChevronRight,
  Lock
} from "lucide-react";
import { motion, useSpring, useTransform } from "framer-motion";

const AnimatedCounter = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / 1000, 1);
      setDisplayValue(Math.floor(progress * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value]);

  return <span>{displayValue}</span>;
};

export const Profile: React.FC = () => {
  const { user, login } = useAuth();

  // State for forms
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [headline, setHeadline] = useState(user?.headline || "");
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(user?.profile_photo_url || "");
  const [linkedinUrl, setLinkedinUrl] = useState(user?.linkedin_url || "");
  const [email, setEmail] = useState(user?.email || "");
  const [location, setLocation] = useState("San Francisco, CA");
  const [phone, setPhone] = useState("+1 (555) 000-0000");

  // UI States
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Founder specific state
  const [startups, setStartups] = useState<StartupResponse[]>([]);
  const [loadingStartups, setLoadingStartups] = useState(false);

  // Sync state if user context updates/loads
  useEffect(() => {
    if (user) {
      setName(user.name);
      setBio(user.bio || "");
      setEmail(user.email);
      setHeadline(user.headline || "");
      setProfilePhotoUrl(user.profile_photo_url || "");
      setLinkedinUrl(user.linkedin_url || "");
    }
  }, [user]);

  // Fetch startups if user is founder
  useEffect(() => {
    if (user?.role === "founder") {
      const fetchStartups = async () => {
        setLoadingStartups(true);
        try {
          const list = await getStartups();
          setStartups(list);
        } catch (err) {
          console.error("Failed to load startups:", err);
        } finally {
          setLoadingStartups(false);
        }
      };
      fetchStartups();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-1 items-center justify-center bg-transparent text-[#FAFAFA] min-h-screen">
        <p className="text-[#9A9A9A]">Please log in to view your profile.</p>
      </div>
    );
  }

  // Calculate Founder Profile Completeness (5 fields, each 20%)
  const getFounderCompleteness = () => {
    let score = 0;
    if (name.trim()) score += 20;
    if (headline.trim()) score += 20;
    if (bio.trim()) score += 20;
    if (linkedinUrl.trim()) score += 20;
    if (profilePhotoUrl) score += 20;
    return score;
  };

  const founderCompleteness = getFounderCompleteness();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrorMsg("File size must be less than 2MB.");
        return;
      }
      try {
        setUploadingImage(true);
        setErrorMsg(null);
        const url = await uploadImage(file);
        setProfilePhotoUrl(url);
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to upload image.");
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    // Basic Validation
    if (!name.trim()) {
      setErrorMsg("Name cannot be empty.");
      setLoading(false);
      return;
    }

    try {
      const updatedUser = await updateProfile({
        name,
        bio: bio.trim() || null,
        headline: headline.trim() || null,
        profile_photo_url: profilePhotoUrl || null,
        linkedin_url: linkedinUrl.trim() || null,
        email: email !== user.email ? email : undefined,
      });

      // Update state in AuthContext
      login(updatedUser);
      setSuccessMsg("Profile updated successfully!");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };


  const staggerVariants: any = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const getInvestorCompleteness = () => {
    let score = 0;
    if (name.trim()) score += 15;
    if (headline.trim()) score += 15;
    if (bio.trim()) score += 20;
    if (linkedinUrl.trim()) score += 15;
    if (profilePhotoUrl) score += 15;
    if (location.trim()) score += 10;
    if (phone.trim()) score += 10;
    return score;
  };
  const completenessScore = user.role === "founder" ? getFounderCompleteness() : getInvestorCompleteness();
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completenessScore / 100) * circumference;

  return (
    <div className="flex-1 bg-transparent p-6 sm:p-10 text-[#FAFAFA] overflow-y-auto min-h-screen selection:bg-[rgba(254,150,56,0.2)] selection:text-[#FE9638]">
      <motion.div
        className="max-w-[1400px] mx-auto"
        variants={staggerVariants}
        initial="hidden"
        animate="show"
      >
        {successMsg && (
          <motion.div variants={itemVariants} className="mb-6 flex items-center gap-3 rounded-xl bg-[rgba(52,211,153,0.15)] p-4 text-[#34D399] font-semibold border border-[#34D399]/30">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">{successMsg}</p>
          </motion.div>
        )}

        {errorMsg && (
          <motion.div variants={itemVariants} className="mb-6 flex items-center gap-3 rounded-xl bg-[rgba(248,113,113,0.15)] p-4 text-[#F87171] font-semibold border border-[#F87171]/30">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">{errorMsg}</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

          <div className="md:col-span-8 lg:col-span-8 xl:col-span-9 space-y-8">

            <motion.div variants={itemVariants} className="relative overflow-hidden rounded-3xl bg-[#141414] p-8 lg:p-10 border border-[rgba(255,255,255,0.06)] shadow-2xl">
              <div className="absolute top-0 right-0 h-96 w-96 bg-[#FE9638]/5 rounded-full blur-[100px] pointer-events-none"></div>

              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2 text-sm font-bold text-[#FAFAFA]">
                  <User className="h-5 w-5 text-[#FE9638]" />
                  Profile Overview
                </div>
                <button className="flex items-center gap-2 rounded-xl bg-transparent border border-[rgba(255,255,255,0.12)] hover:border-[#FE9638]/50 px-4 py-2 text-xs font-bold transition-all group">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-[#9A9A9A] group-hover:text-[#FE9638] transition-colors"><path d="M11.5 15H7a4 4 0 0 0-4 4v2" /><path d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" /><circle cx="10" cy="7" r="4" /></svg>
                  <span className="text-[#FAFAFA] group-hover:text-[#FE9638] transition-colors">Edit Public Profile</span>
                </button>
              </div>

              <div className="flex flex-col lg:flex-row gap-8 relative z-10">
                <div className="relative group shrink-0">
                  {profilePhotoUrl ? (
                    <img
                      src={profilePhotoUrl}
                      alt={name}
                      className="h-28 w-28 rounded-full object-cover border border-[#FE9638]/30 shadow-[0_0_30px_rgba(254,150,56,0.15)]"
                    />
                  ) : (
                    <div className="h-28 w-28 rounded-full bg-[#FE9638] flex items-center justify-center text-4xl font-extrabold text-[#0A0A0A] shadow-[0_0_30px_rgba(254,150,56,0.2)]">
                      {name ? name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || "?"}
                    </div>
                  )}
                  <label className="absolute bottom-0 right-0 p-2 bg-[#1C1C1C] hover:bg-[#FE9638] hover:text-[#0A0A0A] border border-[rgba(255,255,255,0.12)] text-[#FE9638] rounded-full cursor-pointer transition-all shadow-lg group-hover:scale-110">
                    <Camera className="h-4 w-4" />
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>

                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#FAFAFA]">{name || "User Profile"}</h1>
                        <Shield className="h-6 w-6 text-[#FE9638]" fill="#FE9638" fillOpacity={0.2} />
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm font-semibold">
                        <span className="text-[#FAFAFA]">{headline || "VC Partner"}</span>
                        <span className="text-[#666666]">•</span>
                        <span className="text-[#9A9A9A]">Angel Investor</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#9A9A9A]">
                        <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-[#666666]" /> {location}</span>
                        <span className="text-[#444444]">•</span>
                        <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-[#666666]" /> Member since July 2026</span>
                      </div>
                      <p className="text-[#FAFAFA] text-sm max-w-xl leading-relaxed mt-2">
                        {bio || "Passionate about backing innovative founders and building the future. I invest in early-stage startups solving big problems."}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 pt-2">
                        {["AI / ML", "FinTech", "SaaS", "DeepTech"].map(tag => (
                          <span key={tag} className="px-3 py-1 text-xs font-bold rounded bg-[#1C1C1C] text-[rgba(254,150,56,0.8)] border border-[rgba(254,150,56,0.2)]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 min-w-[200px] p-5 rounded-2xl bg-[#1C1C1C]/50 border border-[rgba(255,255,255,0.04)]">
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-[#666666]" />
                        <div className="flex flex-col">
                          <span className="text-[10px] text-[#666666] font-bold uppercase tracking-wider">Email</span>
                          <span className="text-xs text-[#FAFAFA] font-medium truncate max-w-[150px]">{email}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-[#666666]" />
                        <div className="flex flex-col">
                          <span className="text-[10px] text-[#666666] font-bold uppercase tracking-wider">Phone</span>
                          <span className="text-xs text-[#FAFAFA] font-medium">{phone}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <svg className="h-4 w-4 text-[#666666]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                          <rect x="2" y="9" width="4" height="12" />
                          <circle cx="4" cy="4" r="2" />
                        </svg>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-[#666666] font-bold uppercase tracking-wider">LinkedIn</span>
                          <a href={linkedinUrl} target="_blank" rel="noreferrer" className="text-xs text-[#FE9638] hover:underline font-medium truncate max-w-[150px]">
                            {linkedinUrl ? new URL(linkedinUrl).pathname : "Not linked"}
                          </a>
                        </div>
                      </div>
                      <div className="border-t border-[rgba(255,255,255,0.06)] pt-3 mt-1 text-[10px] text-[#666666] font-semibold">
                        Last updated 2 hours ago
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="rounded-3xl bg-[#141414] p-8 lg:p-10 border border-[rgba(255,255,255,0.06)] shadow-2xl relative overflow-hidden">
              <div className="flex justify-between items-start mb-8 border-b border-[rgba(255,255,255,0.06)] pb-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-lg font-bold text-[#FAFAFA]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-[#FE9638]"><path d="M11.5 15H7a4 4 0 0 0-4 4v2" /><path d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" /><circle cx="10" cy="7" r="4" /></svg>
                    Personal Information
                  </div>
                  <p className="text-sm text-[#9A9A9A]">Manage your personal and professional details</p>
                </div>
                <button onClick={handleSave} disabled={loading} className="flex items-center gap-2 rounded-xl bg-[#FE9638] hover:bg-[#E28528] px-5 py-2.5 text-xs font-bold text-[#0A0A0A] shadow-lg shadow-[#FE9638]/20 transition-all disabled:opacity-50 cursor-pointer">
                  {loading ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#0A0A0A] border-t-transparent"></div> : <Save className="h-4 w-4" />}
                  Save Details
                </button>
              </div>

              <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                <div>
                  <label className="block text-xs font-bold text-[#9A9A9A] mb-2">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#666666]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M11.5 15H7a4 4 0 0 0-4 4v2" /><path d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" /><circle cx="10" cy="7" r="4" /></svg>
                    </div>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#1C1C1C] border border-[rgba(255,255,255,0.08)] text-sm text-[#FAFAFA] placeholder-[#444444] focus:outline-none focus:border-[#FE9638] transition-all" required />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#9A9A9A] mb-2">Professional Headline</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#666666]">
                      <Briefcase className="h-4 w-4" />
                    </div>
                    <input type="text" value={headline} onChange={(e) => setHeadline(e.target.value)} className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#1C1C1C] border border-[rgba(255,255,255,0.08)] text-sm text-[#FAFAFA] placeholder-[#444444] focus:outline-none focus:border-[#FE9638] transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#9A9A9A] mb-2">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#666666]">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input type="email" value={email} disabled className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#1C1C1C]/50 border border-[rgba(255,255,255,0.04)] text-sm text-[#666666] cursor-not-allowed" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#9A9A9A] mb-2">Location</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#666666]">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#1C1C1C] border border-[rgba(255,255,255,0.08)] text-sm text-[#FAFAFA] placeholder-[#444444] focus:outline-none focus:border-[#FE9638] transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#9A9A9A] mb-2">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#666666]">
                      <Phone className="h-4 w-4" />
                    </div>
                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#1C1C1C] border border-[rgba(255,255,255,0.08)] text-sm text-[#FAFAFA] placeholder-[#444444] focus:outline-none focus:border-[#FE9638] transition-all" />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#9A9A9A] mb-2">Professional Bio</label>
                  <div className="relative">
                    <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full p-4 rounded-xl bg-[#1C1C1C] border border-[rgba(255,255,255,0.08)] text-sm text-[#FAFAFA] placeholder-[#444444] focus:outline-none focus:border-[#FE9638] transition-all h-32 resize-none" placeholder="Brief summary of your background..." maxLength={500} />
                    <div className="absolute bottom-3 right-4 text-[10px] font-semibold text-[#666666]">
                      {bio.length}/500 characters
                    </div>
                  </div>
                </div>
              </form>
            </motion.div>

            {user.role === "investor" && (
              <motion.div variants={itemVariants} className="rounded-3xl bg-[#141414] p-8 lg:p-10 border border-[rgba(255,255,255,0.06)] shadow-2xl">
                <div className="space-y-1 mb-8 border-b border-[rgba(255,255,255,0.06)] pb-6">
                  <div className="flex items-center gap-2 text-lg font-bold text-[#FAFAFA]">
                    <TrendingUp className="h-5 w-5 text-[#FE9638]" />
                    Investor Statistics
                  </div>
                  <p className="text-sm text-[#9A9A9A]">Overview of your investment activity</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">

                  <motion.div whileHover={{ y: -4, borderColor: 'rgba(254,150,56,0.5)' }} className="rounded-2xl bg-[#1C1C1C] p-5 border border-[rgba(255,255,255,0.06)] transition-all group">
                    <div className="flex justify-between items-start mb-3">
                      <div className="p-2 rounded-lg bg-[rgba(254,150,56,0.1)] text-[#FE9638]">
                        <Sparkles className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="text-3xl font-extrabold text-[#FAFAFA] mb-1">
                      <AnimatedCounter value={24} />
                    </div>
                    <div className="text-xs font-semibold text-[#666666] mb-3">Startups Reviewed</div>
                    <div className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                      ↑ 8 this month
                    </div>
                  </motion.div>

                  <motion.div whileHover={{ y: -4, borderColor: 'rgba(56,189,248,0.5)' }} className="rounded-2xl bg-[#1C1C1C] p-5 border border-[rgba(255,255,255,0.06)] transition-all group">
                    <div className="flex justify-between items-start mb-3">
                      <div className="p-2 rounded-lg bg-[rgba(56,189,248,0.1)] text-[#38BDF8]">
                        <Building2 className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="text-3xl font-extrabold text-[#FAFAFA] mb-1">
                      <AnimatedCounter value={7} />
                    </div>
                    <div className="text-xs font-semibold text-[#666666] mb-3">Shortlisted</div>
                    <div className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                      ↑ 2 this month
                    </div>
                  </motion.div>

                  <motion.div whileHover={{ y: -4, borderColor: 'rgba(52,211,153,0.5)' }} className="rounded-2xl bg-[#1C1C1C] p-5 border border-[rgba(255,255,255,0.06)] transition-all group">
                    <div className="flex justify-between items-start mb-3">
                      <div className="p-2 rounded-lg bg-[rgba(52,211,153,0.1)] text-[#34D399]">
                        <Calendar className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="text-3xl font-extrabold text-[#FAFAFA] mb-1">
                      <AnimatedCounter value={4} />
                    </div>
                    <div className="text-xs font-semibold text-[#666666] mb-3">Meetings Scheduled</div>
                    <div className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                      ↑ 1 this month
                    </div>
                  </motion.div>

                  <motion.div whileHover={{ y: -4, borderColor: 'rgba(167,139,250,0.5)' }} className="rounded-2xl bg-[#1C1C1C] p-5 border border-[rgba(255,255,255,0.06)] transition-all group">
                    <div className="flex justify-between items-start mb-3">
                      <div className="p-2 rounded-lg bg-[rgba(167,139,250,0.1)] text-[#A78BFA]">
                        <TrendingUp className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="text-3xl font-extrabold text-[#FAFAFA] mb-1">
                      <AnimatedCounter value={3} />
                    </div>
                    <div className="text-xs font-semibold text-[#666666] mb-3">Investments Made</div>
                    <div className="text-[10px] font-bold text-[#666666] flex items-center gap-1">
                      No change
                    </div>
                  </motion.div>

                </div>
              </motion.div>
            )}

          </div>

          <div className="md:col-span-4 lg:col-span-4 xl:col-span-3 space-y-6 md:sticky top-6">

            <motion.div variants={itemVariants} className="rounded-3xl bg-[#141414] p-6 border border-[rgba(255,255,255,0.06)] shadow-2xl flex flex-col items-center text-center">
              <div className="w-full flex items-center gap-2 text-sm font-bold text-[#FAFAFA] mb-6">
                <CheckCircle2 className="h-4 w-4 text-[#FE9638]" />
                Profile Completion
              </div>

              <div className="relative w-32 h-32 mb-4">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#1C1C1C" strokeWidth="8" />
                  <motion.circle
                    cx="50" cy="50" r={radius} fill="transparent" stroke="#FE9638" strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-extrabold text-[#FAFAFA]"><AnimatedCounter value={completenessScore} />%</span>
                  <span className="text-[10px] font-bold text-[#9A9A9A] uppercase tracking-wider">Almost there!</span>
                </div>
              </div>

              <p className="text-xs text-[#9A9A9A] font-medium mb-6">Complete your profile to get better startup recommendations.</p>

              <button className="w-full rounded-xl bg-transparent border border-[#FE9638] text-[#FE9638] hover:bg-[#FE9638] hover:text-[#0A0A0A] px-4 py-2.5 text-xs font-bold transition-all">
                Improve Profile
              </button>
            </motion.div>

            <motion.div variants={itemVariants} className="rounded-3xl bg-[#141414] p-6 border border-[rgba(255,255,255,0.06)] shadow-2xl">
              <div className="flex items-center gap-2 text-sm font-bold text-[#FAFAFA] mb-4">
                <Camera className="h-4 w-4 text-[#FE9638]" />
                Profile Photo
              </div>

              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[rgba(255,255,255,0.12)] hover:border-[#FE9638]/50 rounded-2xl transition-all cursor-pointer bg-[#1C1C1C]/40 group relative">
                <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploadingImage} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" />
                <div className="p-3 bg-[#1C1C1C] rounded-full mb-3 group-hover:bg-[#FE9638]/10 transition-colors">
                  <Upload className={`w-5 h-5 text-[#666666] group-hover:text-[#FE9638] transition-colors ${uploadingImage ? 'animate-bounce' : ''}`} />
                </div>
                <span className="text-xs font-bold text-[#FAFAFA] mb-1 group-hover:text-[#FE9638] transition-colors">
                  {uploadingImage ? "Uploading..." : "Upload New Photo"}
                </span>
                <span className="text-[10px] font-semibold text-[#666666]">PNG, JPG up to 2MB</span>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="rounded-3xl bg-[#141414] p-4 border border-[rgba(255,255,255,0.06)] shadow-2xl">
              <div className="flex items-center gap-2 text-sm font-bold text-[#FAFAFA] p-2 mb-2">
                <AlertCircle className="h-4 w-4 text-[#FE9638]" />
                Quick Actions
              </div>

              <div className="space-y-1">
                {[
                  { icon: Download, label: "Export Profile" },
                  { icon: Shield, label: "Privacy Settings" },
                  { icon: Bell, label: "Notification Settings" },
                  { icon: Lock, label: "Change Password" }
                ].map((action, i) => (
                  <button key={i} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#1C1C1C] transition-colors group">
                    <div className="flex items-center gap-3">
                      <action.icon className="w-4 h-4 text-[#666666] group-hover:text-[#FE9638] transition-colors" />
                      <span className="text-xs font-bold text-[#9A9A9A] group-hover:text-[#FAFAFA] transition-colors">{action.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#444444] group-hover:text-[#FAFAFA] transition-colors" />
                  </button>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </motion.div>

      {/* Startups section at the bottom for Founders */}
      {user.role === "founder" && (
        <div className="rounded-2xl bg-[#141414] p-8 border border-[rgba(255,255,255,0.08)] shadow-2xl space-y-6 mt-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[rgba(255,255,255,0.08)] pb-4">
            <div className="flex items-center gap-3">
              <Building2 className="h-6 w-6 text-[#FE9638]" />
              <h3 className="text-xl font-bold text-[#FAFAFA]">Registered Startups</h3>
            </div>
            <Link
              to="/founder/startups/new"
              className="inline-flex items-center gap-2 rounded-xl bg-[rgba(254,150,56,0.15)] hover:bg-[rgba(254,150,56,0.25)] border border-[#FE9638]/30 text-[#FE9638] px-5 py-2.5 text-xs font-bold transition-all"
            >
              Register Startup →
            </Link>
          </div>

          {loadingStartups ? (
            <div className="flex justify-center py-6">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#FE9638] border-t-transparent"></div>
            </div>
          ) : startups.length === 0 ? (
            <div className="text-center py-12 bg-[#1C1C1C] rounded-xl border border-[rgba(255,255,255,0.08)]">
              <p className="text-[#9A9A9A] font-semibold text-sm mb-4">You haven&apos;t registered any startup yet.</p>
              <Link
                to="/founder/startups/new"
                className="inline-block rounded-xl bg-[#FE9638] hover:bg-[#E28528] px-6 py-2.5 text-xs font-bold text-[#0A0A0A] shadow-lg shadow-[#FE9638]/20 transition-all"
              >
                Create Your First Startup →
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {startups.map((startup) => (
                <div
                  key={startup.id}
                  className="relative group rounded-2xl bg-[#1C1C1C] hover:bg-[#222222] hover:border-[#FE9638]/40 p-6 transition-all duration-300 flex flex-col justify-between border border-[rgba(255,255,255,0.08)]"
                >
                  <div>
                    <div className="flex items-center gap-3.5 mb-2.5">
                      {startup.logo_url ? (
                        <img
                          src={startup.logo_url}
                          alt={startup.startup_name}
                          className="w-10 h-10 rounded-xl object-cover border border-[rgba(255,255,255,0.06)] bg-[#141414] p-1"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-[rgba(254,150,56,0.1)] border border-[#FE9638]/20 flex items-center justify-center font-black text-sm text-[#FE9638]">
                          {startup.startup_name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-lg text-[#FAFAFA] group-hover:text-[#FE9638] transition-colors leading-snug">
                          {startup.startup_name}
                        </h4>
                        {startup.tagline && (
                          <p className="text-xs text-[#9A9A9A] line-clamp-1">{startup.tagline}</p>
                        )}
                      </div>
                    </div>

                    {startup.industry && (
                      <span className="inline-block text-[10px] font-bold bg-[rgba(254,150,56,0.1)] text-[#FE9638] border border-[#FE9638]/20 rounded px-2 py-0.5 mb-3.5 uppercase tracking-wide">
                        {startup.industry}
                      </span>
                    )}

                    <p className="text-sm text-[#9A9A9A] line-clamp-2 mb-4 font-normal leading-relaxed">
                      {startup.description || "No description provided."}
                    </p>
                  </div>
                  <div className="flex justify-between items-center border-t border-[rgba(255,255,255,0.06)] pt-4 text-xs font-semibold text-[#9A9A9A] mt-2">
                    <span>Stage: <strong className="text-[#FAFAFA]">{startup.stage || "N/A"}</strong></span>
                    <Link
                      to={`/founder/startups/${startup.id}`}
                      className="text-[#FE9638] hover:underline font-bold flex items-center gap-1"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Statistics section at bottom for Investors (REMOVED: Now handled at the top) */}

    </div>
  );
};
