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
  Upload
} from "lucide-react";

export const Profile: React.FC = () => {
  const { user, login } = useAuth();
  
  // State for forms
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [headline, setHeadline] = useState(user?.headline || "");
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(user?.profile_photo_url || "");
  const [linkedinUrl, setLinkedinUrl] = useState(user?.linkedin_url || "");
  const [email, setEmail] = useState(user?.email || "");
  
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

  return (
    <div className="flex-1 bg-transparent p-6 sm:p-10 text-[#FAFAFA] overflow-y-auto min-h-screen selection:bg-[rgba(254,150,56,0.2)] selection:text-[#FE9638]">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Section */}
        <header className="relative overflow-hidden rounded-3xl bg-[#141414] p-8 border border-[rgba(255,255,255,0.08)] shadow-2xl">
          <div className="absolute top-0 right-0 h-48 w-48 bg-[#FE9638]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
            {profilePhotoUrl ? (
              <img 
                src={profilePhotoUrl} 
                alt={name} 
                className="h-20 w-20 rounded-2xl object-cover border border-[#FE9638]/30 shadow-lg shadow-[#FE9638]/20"
              />
            ) : (
              <div className="h-20 w-20 rounded-2xl bg-[#FE9638] flex items-center justify-center text-3xl font-extrabold text-[#0A0A0A] shadow-lg shadow-[#FE9638]/20">
                {name ? name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="text-center sm:text-left space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 justify-center sm:justify-start">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#FAFAFA] truncate">{name || "User Profile"}</h1>
                <span className="inline-flex self-center items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[rgba(254,150,56,0.15)] text-[#FE9638] border border-[#FE9638]/30 shrink-0">
                  {user.role}
                </span>
              </div>
              {headline ? (
                <p className="text-[#FE9638] text-sm font-semibold tracking-wide">{headline}</p>
              ) : (
                <p className="text-[#666666] text-xs font-semibold italic">No professional headline added yet.</p>
              )}
              <p className="text-[#9A9A9A] text-sm max-w-xl line-clamp-2">
                {bio || "No profile bio added yet. Write a bio in your personal details below to tell others about yourself."}
              </p>
              <div className="text-xs font-semibold text-[#666666] pt-1">
                Registered Email: <span className="text-[#FAFAFA]">{user.email}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Success/Error Alerts */}
        {successMsg && (
          <div className="flex items-center gap-3 rounded-xl bg-[rgba(52,211,153,0.15)] p-4 text-[#34D399] font-semibold border border-[#34D399]/30 animate-fadeIn">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
            <p className="text-xs">{successMsg}</p>
          </div>
        )}

        {errorMsg && (
          <div className="flex items-center gap-3 rounded-xl bg-[rgba(248,113,113,0.15)] p-4 text-[#F87171] font-semibold border border-[#F87171]/30 animate-fadeIn">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-xs">{errorMsg}</p>
          </div>
        )}

        {/* Main Grid: Info Edit & Settings */}
        <div className="grid gap-8 md:grid-cols-3">
          {/* Edit Form (Left/Center 2 cols) */}
          <div className="md:col-span-2 space-y-6">
            <form onSubmit={handleSave} className="space-y-6">
              {/* Card 1: Personal Details */}
              <div className="rounded-2xl bg-[#141414] p-8 space-y-6 border border-[rgba(255,255,255,0.08)] shadow-2xl">
                <div className="flex items-center gap-3 border-b border-[rgba(255,255,255,0.08)] pb-4">
                  <User className="h-5 w-5 text-[#FE9638]" />
                  <h3 className="text-lg font-bold text-[#FAFAFA]">Personal Information</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#9A9A9A] uppercase tracking-wider mb-2">
                      Full Name <span className="text-[#F87171]">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#666666]">
                        <User className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#1C1C1C] border border-[rgba(255,255,255,0.12)] text-sm text-[#FAFAFA] placeholder-[#666666] focus:outline-none focus:border-[#FE9638] focus:ring-1 focus:ring-[#FE9638]/30 transition-all"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#9A9A9A] uppercase tracking-wider mb-2">
                      Professional Headline <span className="text-[#F87171]">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#666666]">
                        <Briefcase className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                        className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#1C1C1C] border border-[rgba(255,255,255,0.12)] text-sm text-[#FAFAFA] placeholder-[#666666] focus:outline-none focus:border-[#FE9638] focus:ring-1 focus:ring-[#FE9638]/30 transition-all"
                        placeholder="e.g., Founder & CEO at TechCorp"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#9A9A9A] uppercase tracking-wider mb-2">
                      Professional Bio <span className="text-[#F87171]">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute top-3.5 left-3.5 pointer-events-none text-[#666666]">
                        <AlignLeft className="h-4 w-4" />
                      </div>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#1C1C1C] border border-[rgba(255,255,255,0.12)] text-sm text-[#FAFAFA] placeholder-[#666666] focus:outline-none focus:border-[#FE9638] focus:ring-1 focus:ring-[#FE9638]/30 transition-all h-32 resize-none"
                        placeholder="Brief summary of your professional background, startup vision, or investment parameters..."
                        maxLength={500}
                        required
                      />
                    </div>
                    <div className="text-xs font-semibold text-[#666666] text-right mt-1">
                      {bio.length}/500 characters
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Contact Information */}
              <div className="rounded-2xl bg-[#141414] p-8 space-y-6 border border-[rgba(255,255,255,0.08)] shadow-2xl">
                <div className="flex items-center gap-3 border-b border-[rgba(255,255,255,0.08)] pb-4">
                  <Mail className="h-5 w-5 text-[#FE9638]" />
                  <h3 className="text-lg font-bold text-[#FAFAFA]">Contact & Verification</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#9A9A9A] uppercase tracking-wider mb-2">
                      LinkedIn Profile <span className="text-[#F87171]">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#666666]">
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                          <rect x="2" y="9" width="4" height="12" />
                          <circle cx="4" cy="4" r="2" />
                        </svg>
                      </div>
                      <input
                        type="url"
                        value={linkedinUrl}
                        onChange={(e) => setLinkedinUrl(e.target.value)}
                        className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#1C1C1C] border border-[rgba(255,255,255,0.12)] text-sm text-[#FAFAFA] placeholder-[#666666] focus:outline-none focus:border-[#FE9638] focus:ring-1 focus:ring-[#FE9638]/30 transition-all"
                        placeholder="https://linkedin.com/in/username"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#9A9A9A] uppercase tracking-wider mb-2">
                      Email Address (Read-only)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#444444]">
                        <Mail className="h-4 w-4" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        disabled
                        className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#121212] border border-[rgba(255,255,255,0.06)] text-sm text-[#666666] cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 rounded-xl bg-[#FE9638] hover:bg-[#E28528] px-8 py-3 font-bold text-xs text-[#0A0A0A] shadow-lg shadow-[#FE9638]/20 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#0A0A0A] border-t-transparent"></div>
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>

          {/* Profile Completeness Side Info Panel (Right 1 col) */}
          <div className="space-y-6">
            {/* Completion Rate Card */}
            <div className="rounded-2xl bg-[#141414] p-6 border border-[rgba(255,255,255,0.08)] shadow-2xl space-y-4">
              <div className="border-b border-[rgba(255,255,255,0.08)] pb-3">
                <h3 className="font-bold text-[#FAFAFA] flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#FE9638]" />
                  <span>Profile Completion</span>
                </h3>
              </div>

              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-[#9A9A9A] font-semibold">Founder Score</span>
                  <span className="text-xl font-black text-[#FE9638]">{founderCompleteness}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[#1C1C1C] overflow-hidden border border-[rgba(255,255,255,0.06)]">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-500 to-[#FE9638] transition-all duration-500"
                    style={{ width: `${founderCompleteness}%` }}
                  />
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase tracking-wider text-[#666666]">Founder Profile</span>
                  <span className="font-bold uppercase tracking-wider text-[#666666]">Weight</span>
                </div>

                <div className="flex items-center justify-between text-sm py-0.5 border-b border-[rgba(255,255,255,0.02)]">
                  <div className="flex items-center gap-2">
                    <span className={name.trim() ? "text-emerald-500" : "text-[#F87171]"}>{name.trim() ? "✔" : "❌"}</span>
                    <span className={name.trim() ? "text-[#9A9A9A] line-through font-medium" : "text-[#FAFAFA] font-medium"}>Full Name</span>
                  </div>
                  <span className="text-xs font-bold text-[#666666]">20%</span>
                </div>

                <div className="flex items-center justify-between text-sm py-0.5 border-b border-[rgba(255,255,255,0.02)]">
                  <div className="flex items-center gap-2">
                    <span className={headline.trim() ? "text-emerald-500" : "text-[#F87171]"}>{headline.trim() ? "✔" : "❌"}</span>
                    <span className={headline.trim() ? "text-[#9A9A9A] line-through font-medium" : "text-[#FAFAFA] font-medium"}>Headline</span>
                  </div>
                  <span className="text-xs font-bold text-[#666666]">20%</span>
                </div>

                <div className="flex items-center justify-between text-sm py-0.5 border-b border-[rgba(255,255,255,0.02)]">
                  <div className="flex items-center gap-2">
                    <span className={bio.trim() ? "text-emerald-500" : "text-[#F87171]"}>{bio.trim() ? "✔" : "❌"}</span>
                    <span className={bio.trim() ? "text-[#9A9A9A] line-through font-medium" : "text-[#FAFAFA] font-medium"}>Bio / Background</span>
                  </div>
                  <span className="text-xs font-bold text-[#666666]">20%</span>
                </div>

                <div className="flex items-center justify-between text-sm py-0.5 border-b border-[rgba(255,255,255,0.02)]">
                  <div className="flex items-center gap-2">
                    <span className={linkedinUrl.trim() ? "text-emerald-500" : "text-[#F87171]"}>{linkedinUrl.trim() ? "✔" : "❌"}</span>
                    <span className={linkedinUrl.trim() ? "text-[#9A9A9A] line-through font-medium" : "text-[#FAFAFA] font-medium"}>LinkedIn Profile</span>
                  </div>
                  <span className="text-xs font-bold text-[#666666]">20%</span>
                </div>

                <div className="flex items-center justify-between text-sm py-0.5">
                  <div className="flex items-center gap-2">
                    <span className={profilePhotoUrl ? "text-emerald-500" : "text-[#F87171]"}>{profilePhotoUrl ? "✔" : "❌"}</span>
                    <span className={profilePhotoUrl ? "text-[#9A9A9A] line-through font-medium" : "text-[#FAFAFA] font-medium"}>Profile Photo</span>
                  </div>
                  <span className="text-xs font-bold text-[#666666]">20%</span>
                </div>
              </div>
            </div>

            {/* Profile Avatar Selection Card */}
            <div className="rounded-2xl bg-[#141414] p-6 border border-[rgba(255,255,255,0.08)] shadow-2xl space-y-4">
              <div className="border-b border-[rgba(255,255,255,0.08)] pb-3">
                <h3 className="font-bold text-[#FAFAFA] flex items-center gap-2">
                  <Camera className="h-4 w-4 text-[#FE9638]" />
                  <span>Choose Profile Photo</span>
                </h3>
              </div>

              {/* Upload image button */}
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-[rgba(255,255,255,0.12)] hover:border-[#FE9638]/50 rounded-xl transition-all cursor-pointer relative bg-[#1C1C1C]/40 group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={uploadingImage}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <Upload className={`w-6 h-6 text-[#9A9A9A] transition-colors mb-2 ${uploadingImage ? "animate-pulse" : "group-hover:text-[#FE9638]"}`} />
                  <span className={`text-xs font-bold text-white transition-colors ${uploadingImage ? "" : "group-hover:text-[#FE9638]"}`}>
                    {uploadingImage ? "Uploading..." : "Upload Image File"}
                  </span>
                  <span className="text-[10px] text-[#666666] mt-0.5">PNG, JPG up to 2MB</span>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-[#666666] uppercase tracking-wider">
                    Or paste Image URL
                  </label>
                  <input
                    type="url"
                    value={profilePhotoUrl}
                    onChange={(e) => setProfilePhotoUrl(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full h-11 px-4 rounded-xl bg-[#1C1C1C] border border-[rgba(255,255,255,0.12)] text-sm text-[#FAFAFA] placeholder-[#444444] focus:outline-none focus:border-[#FE9638] transition-all"
                  />
                </div>

                {profilePhotoUrl && (
                  <div className="flex justify-between items-center bg-[#1C1C1C]/60 p-2.5 rounded-xl border border-[rgba(255,255,255,0.04)]">
                    <span className="text-xs text-[#9A9A9A] font-semibold truncate max-w-[150px]">Current Selection</span>
                    <button 
                      type="button" 
                      onClick={() => setProfilePhotoUrl("")}
                      className="text-xs font-bold text-[#F87171] hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

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

        {/* Statistics section at bottom for Investors */}
        {user.role === "investor" && (
          <div className="rounded-2xl bg-[#141414] p-8 border border-[rgba(255,255,255,0.08)] shadow-2xl space-y-6 mt-8">
            <div className="flex items-center gap-3 border-b border-[rgba(255,255,255,0.08)] pb-4">
              <TrendingUp className="h-6 w-6 text-[#FE9638]" />
              <h3 className="text-xl font-bold text-[#FAFAFA]">Investment Dashboard Statistics</h3>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <div className="rounded-2xl bg-[#1C1C1C] p-6 border border-[rgba(255,255,255,0.08)] space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#9A9A9A] font-bold uppercase tracking-wider">Startups Evaluated</span>
                  <Sparkles className="h-5 w-5 text-[#FE9638]" />
                </div>
                <div className="text-4xl font-extrabold text-[#FAFAFA]">0</div>
                <p className="text-xs font-semibold text-[#666666]">Startups checked with AI evaluations.</p>
              </div>

              <div className="rounded-2xl bg-[#1C1C1C] p-6 border border-[rgba(255,255,255,0.08)] space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#9A9A9A] font-bold uppercase tracking-wider">Shortlisted Deals</span>
                  <Building2 className="h-5 w-5 text-[#38BDF8]" />
                </div>
                <div className="text-4xl font-extrabold text-[#FAFAFA]">0</div>
                <p className="text-xs font-semibold text-[#666666]">Promising projects bookmarked.</p>
              </div>

              <div className="rounded-2xl bg-[#1C1C1C] p-6 border border-[rgba(255,255,255,0.08)] space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#9A9A9A] font-bold uppercase tracking-wider">Reports Downloaded</span>
                  <FileText className="h-5 w-5 text-[#FE9638]" />
                </div>
                <div className="text-4xl font-extrabold text-[#FAFAFA]">0</div>
                <p className="text-xs font-semibold text-[#666666]">Detailed PDF investment reports generated.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
