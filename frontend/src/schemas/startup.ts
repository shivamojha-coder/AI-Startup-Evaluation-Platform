import { z } from "zod";

export const startupSchema = z.object({
  startup_name: z.string().min(1, "Startup name is required"),
  industry: z.string().min(1, "Industry is required"),
  stage: z.string().min(1, "Stage is required"),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  description: z.string().min(1, "Description is required"),
  logo_url: z.string().optional().or(z.literal("")),
  tagline: z.string().min(1, "Tagline is required"),
  team_size: z.string().optional().or(z.literal("")),
  funding_raised: z.string().optional().or(z.literal("")),
  linkedin_url: z.string().optional().or(z.literal("")),
});

export type StartupFormData = z.infer<typeof startupSchema>;

export interface StartupResponse {
  id: string;
  founder_id: string;
  startup_name: string;
  industry: string | null;
  stage: string | null;
  website: string | null;
  description: string | null;
  logo_url: string | null;
  tagline: string | null;
  team_size: string | null;
  funding_raised: string | null;
  linkedin_url: string | null;
  created_at: string;
}
export interface DealflowResponse {
  id: string;
  startup_name: string;
  industry?: string;
  stage?: string;
  description?: string;
  founder_name?: string;
  founder_photo_url?: string;
  location?: string;
  logo_url?: string;
  risk_level: string;
  ai_score?: {
    overall: number;
    market: number;
    founder: number;
    financial: number;
    product: number;
  };
  verifications?: string[];
  funding_ask?: string;
  status?: string;
}
