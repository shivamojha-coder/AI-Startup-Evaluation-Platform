import React, { useState } from "react";
import { Upload } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../context/AuthContext";
import { createStartup } from "../api/startups";
import { uploadImage } from "../api/upload";
import { startupSchema } from "../schemas/startup";
import type { StartupFormData } from "../schemas/startup";

const INDUSTRIES = [
  "AI",
  "SaaS",
  "FinTech",
  "EdTech",
  "HealthTech",
  "E-commerce",
  "Cybersecurity",
  "Gaming",
  "Robotics",
  "ClimateTech",
  "Web3",
  "Other"
];

const STAGES = [
  "Idea",
  "MVP",
  "Beta",
  "Early Revenue",
  "Growth",
  "Scaling"
];

export const StartupCreate: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedLogoUrl, setSelectedLogoUrl] = useState("");
  const [fileError, setFileError] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<StartupFormData>({
    resolver: zodResolver(startupSchema),
    defaultValues: {
      startup_name: "",
      industry: "",
      stage: "",
      website: "",
      description: "",
      logo_url: "",
      tagline: "",
      team_size: "",
      funding_raised: "",
      linkedin_url: "",
    }
  });

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
        setValue("logo_url", url);
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
      const newStartup = await createStartup(data);
      navigate(`/founder/startups/${newStartup.id}`);
    } catch (err: any) {
      setApiError(err.message || "Failed to create startup");
    }
  };

  if (!user || user.role !== "founder") {
    navigate("/login");
    return null;
  }

  return (
    <div className="flex flex-1 flex-col bg-[#0A0A0A] p-6 sm:p-10 text-[#FAFAFA] min-h-screen selection:bg-[rgba(254,150,56,0.2)] selection:text-[#FE9638]">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <div className="flex items-center gap-4">
          <Link
            to="/founder/dashboard"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#141414] border border-[rgba(255,255,255,0.08)] text-[#9A9A9A] hover:text-[#FE9638] hover:border-[#FE9638]/40 transition-all shadow-lg"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#FAFAFA]">Create Startup Profile</h1>
            <p className="text-sm text-[#9A9A9A]">Enter the details of your company below.</p>
          </div>
        </div>

        <div className="rounded-2xl bg-[#141414] p-8 border border-[rgba(255,255,255,0.08)] shadow-2xl">
          {(apiError || fileError) && (
            <div className="mb-6 rounded-xl bg-[rgba(248,113,113,0.12)] p-4 text-xs font-semibold text-[#F87171] border border-[#F87171]/30">
              {apiError || fileError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                placeholder="Acme Corp"
              />
              {errors.startup_name && (
                <p className="mt-1.5 text-xs text-[#F87171] font-semibold">{errors.startup_name.message}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#9A9A9A]">
                Logo
              </label>
              <label className="relative flex flex-col items-center justify-center w-full h-32 rounded-xl bg-[#1C1C1C] border-2 border-dashed border-[rgba(255,255,255,0.12)] cursor-pointer hover:border-[#FE9638]/50 transition-colors group">
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
              </label>
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
                placeholder="e.g. Next-generation AI-powered data platform"
              />
              {errors.tagline && (
                <p className="mt-1.5 text-xs text-[#F87171] font-semibold">{errors.tagline.message}</p>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#9A9A9A]">
                  Industry <span className="text-[#F87171]">*</span>
                </label>
                <select
                  {...register("industry")}
                  className={`w-full h-11 px-4 rounded-xl bg-[#1C1C1C] border text-sm text-[#FAFAFA] focus:outline-none focus:border-[#FE9638] focus:ring-1 focus:ring-[#FE9638]/30 transition-all ${
                    errors.industry ? "border-[#F87171]" : "border-[rgba(255,255,255,0.12)]"
                  }`}
                >
                  <option className="bg-[#141414]" value="">Select Industry</option>
                  {INDUSTRIES.map(ind => (
                    <option key={ind} className="bg-[#141414]" value={ind}>{ind}</option>
                  ))}
                </select>
                {errors.industry && (
                  <p className="mt-1.5 text-xs text-[#F87171] font-semibold">{errors.industry.message}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#9A9A9A]">
                  Stage <span className="text-[#F87171]">*</span>
                </label>
                <select
                  {...register("stage")}
                  className={`w-full h-11 px-4 rounded-xl bg-[#1C1C1C] border text-sm text-[#FAFAFA] focus:outline-none focus:border-[#FE9638] focus:ring-1 focus:ring-[#FE9638]/30 transition-all ${
                    errors.stage ? "border-[#F87171]" : "border-[rgba(255,255,255,0.12)]"
                  }`}
                >
                  <option className="bg-[#141414]" value="">Select Stage</option>
                  {STAGES.map(st => (
                    <option key={st} className="bg-[#141414]" value={st}>{st}</option>
                  ))}
                </select>
                {errors.stage && (
                  <p className="mt-1.5 text-xs text-[#F87171] font-semibold">{errors.stage.message}</p>
                )}
              </div>
            </div>

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
                placeholder="https://example.com"
              />
              {errors.website && (
                <p className="mt-1.5 text-xs text-[#F87171] font-semibold">{errors.website.message}</p>
              )}
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
                placeholder="Briefly describe your product, team, and company vision..."
              />
              {errors.description && (
                <p className="mt-1.5 text-xs text-[#F87171] font-semibold">{errors.description.message}</p>
              )}
            </div>

            <div className="flex justify-end pt-6 mt-2 border-t border-[rgba(255,255,255,0.08)]">
              <Link
                to="/founder/dashboard"
                className="mr-4 rounded-xl px-6 py-2.5 text-xs font-bold text-[#9A9A9A] hover:bg-[#1C1C1C] hover:text-[#FAFAFA] transition-all flex items-center"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-[#FE9638] hover:bg-[#E28528] px-8 py-2.5 text-xs font-bold text-[#0A0A0A] shadow-lg shadow-[#FE9638]/20 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? "Creating..." : "Create Startup →"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
