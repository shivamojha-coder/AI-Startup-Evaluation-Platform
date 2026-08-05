import React, { useState, useEffect } from "react";
import { Upload, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateStartup } from "../../api/startups";
import { uploadImage } from "../../api/upload";
import { startupSchema } from "../../schemas/startup";
import type { StartupFormData, StartupResponse } from "../../schemas/startup";

const INDUSTRIES = [
  "AI", "SaaS", "FinTech", "EdTech", "HealthTech", "E-commerce",
  "Cybersecurity", "Gaming", "Robotics", "ClimateTech", "Web3", "Other"
];

const STAGES = [
  "Idea", "MVP", "Beta", "Early Revenue", "Growth", "Scaling"
];

interface EditStartupModalProps {
  isOpen: boolean;
  onClose: () => void;
  startup: StartupResponse;
  onSuccess: () => void;
}

export const EditStartupModal: React.FC<EditStartupModalProps> = ({
  isOpen,
  onClose,
  startup,
  onSuccess
}) => {
  const [selectedLogoUrl, setSelectedLogoUrl] = useState(startup.logo_url || "");
  const [fileError, setFileError] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StartupFormData>({
    resolver: zodResolver(startupSchema),
    defaultValues: {
      startup_name: startup.startup_name || "",
      industry: startup.industry || "",
      stage: startup.stage || "",
      website: startup.website || "",
      description: startup.description || "",
      logo_url: startup.logo_url || "",
      tagline: startup.tagline || "",
      team_size: startup.team_size || "",
      funding_raised: startup.funding_raised || "",
      linkedin_url: startup.linkedin_url || "",
    }
  });

  useEffect(() => {
    if (isOpen) {
      setSelectedLogoUrl(startup.logo_url || "");
      reset({
        startup_name: startup.startup_name || "",
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
      setApiError(null);
      setFileError(null);
    }
  }, [isOpen, startup, reset]);

  if (!isOpen) return null;

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
      await updateStartup(startup.id, data);
      onSuccess();
      onClose();
    } catch (err: any) {
      setApiError(err.message || "Failed to update startup");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto font-sans selection:bg-[#FF8A24]/20 selection:text-[#FF8A24]">
      <div className="relative w-full max-w-4xl bg-[#141414] rounded-2xl border border-[rgba(255,255,255,0.08)] shadow-2xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-[rgba(255,255,255,0.08)] bg-[#0B0B0B] shrink-0">
          <h2 className="text-xl font-extrabold tracking-tight text-[#FAFAFA]">Edit Startup Details</h2>
          <button onClick={onClose} className="text-[#9A9A9A] hover:text-[#FAFAFA] transition-colors rounded-lg p-1 hover:bg-[#1C1C1C]">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
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

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#9A9A9A]">
                  Team Size
                </label>
                <input
                  type="text"
                  {...register("team_size")}
                  className={`w-full h-11 px-4 rounded-xl bg-[#1C1C1C] border border-[rgba(255,255,255,0.12)] text-sm text-[#FAFAFA] placeholder-[#666666] focus:outline-none focus:border-[#FE9638] focus:ring-1 focus:ring-[#FE9638]/30 transition-all`}
                  placeholder="e.g. 1-10"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#9A9A9A]">
                  Funding Raised
                </label>
                <input
                  type="text"
                  {...register("funding_raised")}
                  className={`w-full h-11 px-4 rounded-xl bg-[#1C1C1C] border border-[rgba(255,255,255,0.12)] text-sm text-[#FAFAFA] placeholder-[#666666] focus:outline-none focus:border-[#FE9638] focus:ring-1 focus:ring-[#FE9638]/30 transition-all`}
                  placeholder="e.g. $500k"
                />
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
                LinkedIn URL
              </label>
              <input
                type="text"
                {...register("linkedin_url")}
                className={`w-full h-11 px-4 rounded-xl bg-[#1C1C1C] border text-sm text-[#FAFAFA] placeholder-[#666666] focus:outline-none focus:border-[#FE9638] focus:ring-1 focus:ring-[#FE9638]/30 transition-all ${
                  errors.linkedin_url ? "border-[#F87171]" : "border-[rgba(255,255,255,0.12)]"
                }`}
                placeholder="https://linkedin.com/company/..."
              />
              {errors.linkedin_url && (
                <p className="mt-1.5 text-xs text-[#F87171] font-semibold">{errors.linkedin_url.message}</p>
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
              />
              {errors.description && (
                <p className="mt-1.5 text-xs text-[#F87171] font-semibold">{errors.description.message}</p>
              )}
            </div>

            <div className="flex justify-end pt-4 border-t border-[rgba(255,255,255,0.08)] gap-3 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-6 py-2.5 text-xs font-bold text-[#9A9A9A] hover:bg-[#1C1C1C] hover:text-[#FAFAFA] transition-all flex items-center"
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
        </div>
      </div>
    </div>
  );
};
