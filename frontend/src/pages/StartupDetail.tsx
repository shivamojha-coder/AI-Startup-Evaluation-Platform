import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../context/AuthContext";
import { 
  getStartup, 
  updateStartup, 
  deleteStartup 
} from "../api/startups";
import { uploadImage } from "../api/upload";
import { startupSchema } from "../schemas/startup";
import type { StartupFormData, StartupResponse } from "../schemas/startup";
import { 
  Building2, 
  Globe, 
  Users, 
  DollarSign, 
  Sparkles,
  Trash2,
  Edit3,
  Upload
} from "lucide-react";

const INDUSTRIES = [
  "AI", "SaaS", "FinTech", "EdTech", "HealthTech", "E-commerce", "Cybersecurity", "Gaming", "Robotics", "ClimateTech", "Web3", "Other"
];

const STAGES = [
  "Idea", "MVP", "Beta", "Early Revenue", "Growth", "Scaling"
];

const TEAM_SIZES = [
  "1-10", "11-50", "51-200", "201+"
];

export const StartupDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [startup, setStartup] = useState<StartupResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [selectedLogoUrl, setSelectedLogoUrl] = useState("");
  const [fileError, setFileError] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StartupFormData>({
    resolver: zodResolver(startupSchema),
  });

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "founder")) {
      navigate("/login");
      return;
    }

    if (id && user && user.role === "founder") {
      fetchData();
    }
  }, [id, user, authLoading, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const startupData = await getStartup(id!);
      setStartup(startupData);
      setSelectedLogoUrl(startupData.logo_url || "");
      
      reset({
        startup_name: startupData.startup_name,
        industry: startupData.industry || "",
        stage: startupData.stage || "",
        website: startupData.website || "",
        description: startupData.description || "",
        logo_url: startupData.logo_url || "",
        tagline: startupData.tagline || "",
        team_size: startupData.team_size || "",
        funding_raised: startupData.funding_raised || "",
        linkedin_url: startupData.linkedin_url || "",
      });
    } catch (err: any) {
      setApiError(err.message || "Failed to load startup details");
    } finally {
      setLoading(false);
    }
  };

  const handleLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setFileError("Logo file must be less than 2MB.");
        return;
      }
      try {
        setUploadingLogo(true);
        setFileError(null);
        const url = await uploadImage(file);
        setSelectedLogoUrl(url);
      } catch (err: any) {
        setFileError(err.message || "Failed to upload logo.");
      } finally {
        setUploadingLogo(false);
      }
    }
  };

  const onSubmit = async (data: StartupFormData) => {
    try {
      setApiError(null);
      const updated = await updateStartup(id!, {
        ...data,
        logo_url: selectedLogoUrl,
      });
      setStartup(updated);
      setIsEditing(false);
    } catch (err: any) {
      setApiError(err.message || "Failed to update startup");
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteStartup(id!);
      navigate("/founder/dashboard");
    } catch (err: any) {
      setApiError(err.message || "Failed to delete startup");
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setApiError(null);
    setFileError(null);
    if (startup) {
      setSelectedLogoUrl(startup.logo_url || "");
      reset({
        startup_name: startup.startup_name,
        industry: startup.industry || "",
        stage: startup.stage || "",
        website: startup.website || "",
        description: startup.description || "",
        logo_url: startup.logo_url || "",
        tagline: startup.tagline || "",
        team_size: startup.team_size || "",
        funding_raised: startup.funding_raised || "",
        linkedin_url: startup.linkedin_url || "",
      });
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-transparent min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FE9638] border-t-transparent"></div>
      </div>
    );
  }

  if (!startup && !apiError) return null;

  return (
    <div className="flex flex-1 flex-col bg-transparent p-6 sm:p-10 text-[#FAFAFA] relative min-h-screen selection:bg-[rgba(254,150,56,0.2)] selection:text-[#FE9638]">
      <div className="mx-auto w-full max-w-4xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              to="/founder/dashboard"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#141414] border border-[rgba(255,255,255,0.08)] text-[#9A9A9A] hover:text-[#FE9638] hover:border-[#FE9638]/40 transition-all shadow-lg"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            
            <div className="flex items-center gap-3">
              {startup?.logo_url ? (
                <img 
                  src={startup.logo_url} 
                  alt={startup.startup_name} 
                  className="w-12 h-12 rounded-xl object-cover border border-[#FE9638]/20 bg-[#141414]"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-[rgba(254,150,56,0.1)] border border-[#FE9638]/20 flex items-center justify-center font-black text-lg text-[#FE9638]">
                  {startup?.startup_name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-[#FAFAFA]">
                  {startup?.startup_name || "Startup Details"}
                </h1>
                <p className="text-xs text-[#9A9A9A] font-semibold">{startup?.tagline || "Manage your company profile and evaluations."}</p>
              </div>
            </div>
          </div>

          {!isEditing && !apiError && (
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(true)}
                className="rounded-xl bg-[rgba(248,113,113,0.15)] px-5 py-2.5 text-xs font-bold text-[#F87171] border border-[#F87171]/30 hover:bg-[rgba(248,113,113,0.25)] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="rounded-xl bg-[#FE9638] hover:bg-[#E28528] px-6 py-2.5 text-xs font-bold text-[#0A0A0A] shadow-lg shadow-[#FE9638]/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Profile
              </button>
            </div>
          )}
        </div>

        {apiError && (
          <div className="rounded-xl bg-[rgba(248,113,113,0.12)] p-4 text-xs font-semibold text-[#F87171] border border-[#F87171]/30">
            {apiError}
          </div>
        )}

        {startup && (
          <div className="rounded-2xl bg-[#141414] p-8 border border-[rgba(255,255,255,0.08)] shadow-2xl">
            {isEditing ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Section 1: Basic Profile */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#FE9638] border-b border-[rgba(255,255,255,0.06)] pb-2">
                    Basic Info
                  </h3>
                  
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#9A9A9A]">
                        Startup Name <span className="text-[#F87171]">*</span>
                      </label>
                      <input
                        type="text"
                        {...register("startup_name")}
                        className={`w-full h-11 px-4 rounded-xl bg-[#1C1C1C] border text-sm text-[#FAFAFA] placeholder-[#666666] focus:outline-none focus:border-[#FE9638] focus:ring-1 focus:ring-[#FE9638]/30 transition-all ${
                          errors.startup_name ? "border-[#F87171]" : "border-[rgba(255,255,255,0.12)]"
                        }`}
                      />
                      {errors.startup_name && (
                        <p className="mt-1.5 text-xs text-[#F87171] font-semibold">{errors.startup_name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#9A9A9A]">
                        One-line Tagline <span className="text-[#F87171]">*</span>
                      </label>
                      <input
                        type="text"
                        {...register("tagline")}
                        className={`w-full h-11 px-4 rounded-xl bg-[#1C1C1C] border text-sm text-[#FAFAFA] placeholder-[#666666] focus:outline-none focus:border-[#FE9638] focus:ring-1 focus:ring-[#FE9638]/30 transition-all ${
                          errors.tagline ? "border-[#F87171]" : "border-[rgba(255,255,255,0.12)]"
                        }`}
                      />
                      {errors.tagline && (
                        <p className="mt-1.5 text-xs text-[#F87171] font-semibold">{errors.tagline.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#9A9A9A]">
                      Description <span className="text-[#F87171]">*</span>
                    </label>
                    <textarea
                      {...register("description")}
                      rows={4}
                      className={`w-full rounded-xl bg-[#1C1C1C] border p-4 text-sm text-[#FAFAFA] placeholder-[#666666] focus:outline-none focus:border-[#FE9638] focus:ring-1 focus:ring-[#FE9638]/30 transition-all ${
                        errors.description ? "border-[#F87171]" : "border-[rgba(255,255,255,0.12)]"
                      }`}
                    />
                    {errors.description && (
                      <p className="mt-1.5 text-xs text-[#F87171] font-semibold">{errors.description.message}</p>
                    )}
                  </div>
                </div>

                {/* Section 2: Logo Selection */}
                <div className="space-y-4 pt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#9A9A9A]">
                    Company Logo
                  </label>
                  
                  {fileError && (
                    <div className="rounded-xl bg-[rgba(248,113,113,0.12)] p-3 text-xs font-semibold text-[#F87171] border border-[#F87171]/20">
                      {fileError}
                    </div>
                  )}

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-[rgba(255,255,255,0.12)] hover:border-[#FE9638]/50 rounded-xl transition-all cursor-pointer relative bg-[#1C1C1C]/40 group h-32">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoFileChange}
                        disabled={uploadingLogo}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                      />
                      {selectedLogoUrl ? (
                        <img src={selectedLogoUrl} alt="Startup Logo" className="h-full w-full object-contain p-2 rounded-xl" />
                      ) : (
                        <>
                          <Upload className={`w-6 h-6 text-[#9A9A9A] transition-colors mb-1.5 ${uploadingLogo ? "animate-pulse" : "group-hover:text-[#FE9638]"}`} />
                          <span className={`text-xs font-bold text-white transition-colors ${uploadingLogo ? "" : "group-hover:text-[#FE9638]"}`}>
                            {uploadingLogo ? "Uploading..." : "Upload Logo File"}
                          </span>
                          <span className="text-[10px] text-[#666666] mt-0.5">PNG, JPG up to 2MB</span>
                        </>
                      )}
                    </div>

                    <div className="flex flex-col justify-center space-y-2">
                      <label className="block text-[10px] font-bold text-[#666666] uppercase tracking-wider">
                        Or paste Logo image URL
                      </label>
                      <input
                        type="url"
                        value={selectedLogoUrl}
                        onChange={(e) => setSelectedLogoUrl(e.target.value)}
                        placeholder="https://example.com/logo.png"
                        className="w-full h-11 px-4 rounded-xl bg-[#1C1C1C] border border-[rgba(255,255,255,0.12)] text-sm text-[#FAFAFA] placeholder-[#666666] focus:outline-none focus:border-[#FE9638] transition-all"
                      />
                      
                      {selectedLogoUrl && (
                        <div className="flex justify-between items-center bg-[#1C1C1C]/60 p-2.5 rounded-xl border border-[rgba(255,255,255,0.04)]">
                          <span className="text-xs text-[#9A9A9A] font-semibold truncate max-w-[180px]">Logo Attached</span>
                          <button 
                            type="button" 
                            onClick={() => setSelectedLogoUrl("")}
                            className="text-xs font-bold text-[#F87171] hover:underline cursor-pointer"
                          >
                            Clear
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section 3: Company Details */}
                <div className="space-y-4 pt-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#FE9638] border-b border-[rgba(255,255,255,0.06)] pb-2">
                    Company Details
                  </h3>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#9A9A9A]">
                        Industry <span className="text-[#F87171]">*</span>
                      </label>
                      <select
                        {...register("industry")}
                        className="w-full h-11 px-4 rounded-xl bg-[#1C1C1C] border border-[rgba(255,255,255,0.12)] text-sm text-[#FAFAFA] focus:outline-none focus:border-[#FE9638] focus:ring-1 focus:ring-[#FE9638]/30 transition-all"
                      >
                        {INDUSTRIES.map(ind => (
                          <option key={ind} className="bg-[#141414]" value={ind}>{ind}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#9A9A9A]">
                        Startup Stage <span className="text-[#F87171]">*</span>
                      </label>
                      <select
                        {...register("stage")}
                        className="w-full h-11 px-4 rounded-xl bg-[#1C1C1C] border border-[rgba(255,255,255,0.12)] text-sm text-[#FAFAFA] focus:outline-none focus:border-[#FE9638] focus:ring-1 focus:ring-[#FE9638]/30 transition-all"
                      >
                        {STAGES.map(stg => (
                          <option key={stg} className="bg-[#141414]" value={stg}>{stg}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#9A9A9A]">
                        Team Size
                      </label>
                      <select
                        {...register("team_size")}
                        className="w-full h-11 px-4 rounded-xl bg-[#1C1C1C] border border-[rgba(255,255,255,0.12)] text-sm text-[#FAFAFA] focus:outline-none focus:border-[#FE9638] focus:ring-1 focus:ring-[#FE9638]/30 transition-all"
                      >
                        <option className="bg-[#141414]" value="">Select Team Size</option>
                        {TEAM_SIZES.map(ts => (
                          <option key={ts} className="bg-[#141414]" value={ts}>{ts}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#9A9A9A]">
                        Funding
                      </label>
                      <input
                        type="text"
                        {...register("funding_raised")}
                        placeholder="e.g. Bootstrapped, $150k Seed, $1M Series A"
                        className="w-full h-11 px-4 rounded-xl bg-[#1C1C1C] border border-[rgba(255,255,255,0.12)] text-sm text-[#FAFAFA] placeholder-[#666666] focus:outline-none focus:border-[#FE9638] focus:ring-1 focus:ring-[#FE9638]/30 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 4: Links */}
                <div className="space-y-4 pt-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#FE9638] border-b border-[rgba(255,255,255,0.06)] pb-2">
                    Online Presence
                  </h3>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#9A9A9A]">
                        Website
                      </label>
                      <input
                        type="text"
                        {...register("website")}
                        className={`w-full h-11 px-4 rounded-xl bg-[#1C1C1C] border text-sm text-[#FAFAFA] placeholder-[#666666] focus:outline-none focus:border-[#FE9638] focus:ring-1 focus:ring-[#FE9638]/30 transition-all ${
                          errors.website ? "border-[#F87171]" : "border-[rgba(255,255,255,0.12)]"
                        }`}
                      />
                      {errors.website && (
                        <p className="mt-1.5 text-xs text-[#F87171] font-semibold">{errors.website.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#9A9A9A]">
                        Company LinkedIn
                      </label>
                      <input
                        type="text"
                        {...register("linkedin_url")}
                        placeholder="https://linkedin.com/company/name"
                        className="w-full h-11 px-4 rounded-xl bg-[#1C1C1C] border border-[rgba(255,255,255,0.12)] text-sm text-[#FAFAFA] placeholder-[#666666] focus:outline-none focus:border-[#FE9638] focus:ring-1 focus:ring-[#FE9638]/30 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit / Cancel Buttons */}
                <div className="flex justify-end pt-6 mt-2 border-t border-[rgba(255,255,255,0.08)]">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="mr-4 rounded-xl px-6 py-2.5 text-xs font-bold text-[#9A9A9A] hover:bg-[#1C1C1C] hover:text-[#FAFAFA] transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl bg-[#FE9638] hover:bg-[#E28528] px-8 py-2.5 text-xs font-bold text-[#0A0A0A] shadow-lg shadow-[#FE9638]/20 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-8 animate-fadeIn">
                
                {/* Tagline & Description Banner */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#666666]">Startup Vision</h3>
                  <p className="text-xl font-bold text-[#FAFAFA] leading-snug">{startup.tagline || "No tagline provided."}</p>
                  <p className="text-sm text-[#9A9A9A] leading-relaxed whitespace-pre-wrap">{startup.description}</p>
                </div>

                {/* Company Details Metadata Grid */}
                <div className="grid gap-6 md:grid-cols-2 pt-6 border-t border-[rgba(255,255,255,0.06)]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1C1C1C] flex items-center justify-center text-[#FE9638] shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#666666]">Industry</h4>
                      <p className="text-sm text-[#FAFAFA] font-semibold">{startup.industry || "Not specified"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1C1C1C] flex items-center justify-center text-[#FE9638] shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#666666]">Startup Stage</h4>
                      <span className="inline-block text-xs font-bold text-[#FE9638] bg-[rgba(254,150,56,0.1)] px-2 py-0.5 rounded border border-[#FE9638]/20 uppercase">
                        {startup.stage || "Not specified"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1C1C1C] flex items-center justify-center text-[#FE9638] shrink-0">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#666666]">Team Size</h4>
                      <p className="text-sm text-[#FAFAFA] font-semibold">{startup.team_size ? `${startup.team_size} employees` : "Not specified"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1C1C1C] flex items-center justify-center text-[#FE9638] shrink-0">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#666666]">Funding</h4>
                      <p className="text-sm text-[#FAFAFA] font-semibold">{startup.funding_raised || "Not specified"}</p>
                    </div>
                  </div>
                </div>

                {/* Online Presence Details */}
                <div className="grid gap-6 md:grid-cols-2 pt-6 border-t border-[rgba(255,255,255,0.06)]">
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#666666] mb-1.5">Website</h4>
                    {startup.website ? (
                      <a href={startup.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#FE9638] hover:underline">
                        <Globe className="w-4 h-4" />
                        <span>{startup.website}</span>
                      </a>
                    ) : (
                      <p className="text-sm text-[#444444] italic">No website URL specified</p>
                    )}
                  </div>

                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#666666] mb-1.5">Company LinkedIn</h4>
                    {startup.linkedin_url ? (
                      <a href={startup.linkedin_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#FE9638] hover:underline">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                          <rect x="2" y="9" width="4" height="12" />
                          <circle cx="4" cy="4" r="2" />
                        </svg>
                        <span>View Company Page</span>
                      </a>
                    ) : (
                      <p className="text-sm text-[#444444] italic">No LinkedIn page specified</p>
                    )}
                  </div>
                </div>

                {/* Documents & Evaluations Summary */}
                <div className="pt-6 border-t border-[rgba(255,255,255,0.06)]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-base font-bold text-[#FAFAFA]">Documents &amp; AI Evaluations</h4>
                      <p className="text-[#9A9A9A] text-sm mt-0.5">Manage pitch decks and view detailed AI reports.</p>
                    </div>
                    <Link
                      to={`/founder/startups/${id}/documents`}
                      className="inline-flex items-center gap-2 rounded-xl bg-[rgba(254,150,56,0.15)] hover:bg-[rgba(254,150,56,0.25)] border border-[#FE9638]/30 px-6 py-2.5 text-xs font-bold text-[#FE9638] transition-all whitespace-nowrap cursor-pointer"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Manage Documents →
                    </Link>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent/85 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl bg-[#141414] p-8 border border-[rgba(255,255,255,0.12)] shadow-2xl space-y-4">
            <h3 className="text-xl font-bold text-[#FAFAFA]">Delete Startup</h3>
            <p className="text-sm text-[#9A9A9A] leading-relaxed">
              Are you sure you want to delete <span className="font-bold text-[#FAFAFA]">{startup?.startup_name}</span>? This action cannot be undone and will permanently remove all associated evaluations.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="rounded-xl px-5 py-2.5 text-xs font-bold text-[#9A9A9A] hover:bg-[#1C1C1C] hover:text-[#FAFAFA] transition-all disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded-xl bg-[#EF4444] hover:bg-[#DC2626] px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-[#EF4444]/20 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
