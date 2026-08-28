import type { StartupFormData, StartupResponse } from "../schemas/startup";

export interface EvaluationResponse {
  id: string;
  startup_id: string;
  version: number;
  status: string;
  progress_stage: string | null;
  created_at: string;
}

export interface EvaluationStatusResponse {
  id: string;
  status: string;
  progress_stage: string | null;
  extraction_status: string | null;
}

export interface PitchDeckUploadResponse {
  id: string;
  status: string;
}

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Helper to get headers with the access token
function getAuthHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
  };
}

export async function getStartups(): Promise<StartupResponse[]> {
  const response = await fetch(`${API_URL}/startups`, {
    headers: getAuthHeaders(),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch startups (${response.status})`);
  }

  return response.json();
}

export async function getStartup(id: string): Promise<StartupResponse> {
  const response = await fetch(`${API_URL}/startups/${id}`, {
    headers: getAuthHeaders(),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch startup (${response.status})`);
  }

  return response.json();
}

export async function createStartup(data: StartupFormData): Promise<StartupResponse> {
  // Convert empty strings to undefined for optional fields to match backend
  const payload = {
    startup_name: data.startup_name,
    industry: data.industry || undefined,
    stage: data.stage || undefined,
    website: data.website || undefined,
    description: data.description || undefined,
    logo_url: data.logo_url || undefined,
    tagline: data.tagline || undefined,
    team_size: data.team_size || undefined,
    funding_raised: data.funding_raised || undefined,
    linkedin_url: data.linkedin_url || undefined,
  };

  const response = await fetch(`${API_URL}/startups`, {
    method: "POST",
    headers: getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to create startup (${response.status})`);
  }

  return response.json();
}

export async function updateStartup(id: string, data: StartupFormData): Promise<StartupResponse> {
  const payload = {
    startup_name: data.startup_name,
    industry: data.industry || undefined,
    stage: data.stage || undefined,
    website: data.website || undefined,
    description: data.description || undefined,
    logo_url: data.logo_url || undefined,
    tagline: data.tagline || undefined,
    team_size: data.team_size || undefined,
    funding_raised: data.funding_raised || undefined,
    linkedin_url: data.linkedin_url || undefined,
  };

  const response = await fetch(`${API_URL}/startups/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to update startup (${response.status})`);
  }

  return response.json();
}

export async function deleteStartup(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/startups/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete startup (${response.status})`);
  }
}

export async function getEvaluations(id: string): Promise<EvaluationResponse[]> {
  const response = await fetch(`${API_URL}/startups/${id}/evaluations`, {
    headers: getAuthHeaders(),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch evaluations (${response.status})`);
  }

  return response.json();
}

export async function getEvaluationStatus(evaluationId: string): Promise<EvaluationStatusResponse> {
  const response = await fetch(`${API_URL}/startups/evaluations/${evaluationId}/status`, {
    headers: getAuthHeaders(),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch evaluation status (${response.status})`);
  }

  return response.json();
}

export function uploadPitchDeck(
  id: string,
  file: File,
  onProgress: (progress: number) => void
): Promise<PitchDeckUploadResponse> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    // In vite dev, this matches the proxy or the absolute URL. We must use withCredentials
    xhr.open("POST", `${API_URL}/startups/${id}/upload`);
    xhr.withCredentials = true;

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        onProgress(percentComplete);       //react state update
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } catch (e) {
          reject(new Error("Invalid JSON response from server"));
        }
      } else {
        try {
          const errorResp = JSON.parse(xhr.responseText);
          reject(new Error(errorResp.detail || "Upload failed"));
        } catch (e) {
          reject(new Error(`Upload failed with status: ${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error occurred during upload"));
    };

    const formData = new FormData();
    formData.append("file", file);

    xhr.send(formData);
  });
}

export interface DocumentResponse {
  id: string;
  evaluation_id: string;
  file_name: string;
  file_size_kb: number;
  page_count: number | null;
  uploaded_at: string;
  extraction_status: string;
  deleted_at: string | null;
  version: number;
  status: string;
}

export async function getDocuments(id: string, includeDeleted: boolean = false): Promise<DocumentResponse[]> {
  const query = includeDeleted ? "?include_deleted=true" : "";
  const response = await fetch(`${API_URL}/startups/${id}/documents${query}`, {
    headers: getAuthHeaders(),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch documents (${response.status})`);
  }

  return response.json();
}

export async function deleteDocument(startupId: string, metadataId: string): Promise<void> {
  const response = await fetch(`${API_URL}/startups/${startupId}/pdf-metadata/${metadataId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete document (${response.status})`);
  }
}

export interface EvaluationReportResponse {
  evaluation_id: string;
  summary: {
    executive_summary?: string;
    problem?: string;
    solution?: string;
    target_market?: string;
    business_model?: string;
    traction?: string;
  };
  risks: Array<{
    id?: string;
    category: string;
    risk: string;
    severity: string;
  }>;
  questions: Array<{
    id?: string;
    category: string;
    question: string;
  }>;
  scores: {
    market_opportunity?: number;
    product_innovation?: number;
    team_strength?: number;
    business_model_score?: number;
    competitive_advantage?: number;
    traction_score?: number;
    scalability?: number;
    startup_score?: number;
    score_reasoning?: Record<string, string>;
  };
}

export async function getEvaluationReport(evaluationId: string): Promise<EvaluationReportResponse> {
  const response = await fetch(`${API_URL}/startups/evaluations/${evaluationId}/report`, {
    headers: getAuthHeaders(),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch evaluation report (${response.status})`);
  }

  return response.json();
}


export interface VerifyClaimResponse {
  status: string;
  confidence: number;
  reason: string;
  evidence?: string[];
}
export async function verifyClaim(startupId: string, claim: string, category: string): Promise<VerifyClaimResponse> {
  const response = await fetch(`${API_URL}/verification/startups/${startupId}/verify-claim`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ claim, category }),
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`Failed to verify claim (${response.status})`);
  }
  return response.json();
}
export async function startupAiChat(
  id: string,
  message: string,
  sessionId?: string | null
): Promise<{ answer: string; session_id: string }> {
  const response = await fetch(`${API_URL}/chat/startups/${id}/chat`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ question: message, session_id: sessionId ?? null }),
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`Failed to chat with AI (${response.status})`);
  }
  return response.json();
}

// ─── Chat Session Helpers ────────────────────────────────────────────────────

export interface ChatSession {
  id: string;
  user_id: string;
  startup_id: string | null;
  title: string;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatMessageDB {
  id: string;
  session_id: string;
  role: 'user' | 'ai';
  content: string;
  created_at: string;
}

export async function getChatSessions(): Promise<ChatSession[]> {
  const response = await fetch(`${API_URL}/chat/sessions`, {
    headers: getAuthHeaders(),
    credentials: "include",
  });
  if (!response.ok) throw new Error(`Failed to fetch chat sessions (${response.status})`);
  return response.json();
}


export async function updateChatSession(
  sessionId: string,
  updates: { is_pinned?: boolean; title?: string }
): Promise<ChatSession> {
  const response = await fetch(`${API_URL}/chat/sessions/${sessionId}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(updates),
    credentials: "include",
  });
  if (!response.ok) throw new Error(`Failed to update chat session (${response.status})`);
  return response.json();
}

export async function deleteChatSession(sessionId: string): Promise<void> {
  const response = await fetch(`${API_URL}/chat/sessions/${sessionId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    credentials: "include",
  });
  if (!response.ok) throw new Error(`Failed to delete chat session (${response.status})`);
}

export async function getChatSessionMessages(sessionId: string): Promise<ChatMessageDB[]> {
  const response = await fetch(`${API_URL}/chat/sessions/${sessionId}/messages`, {
    headers: getAuthHeaders(),
    credentials: "include",
  });
  if (!response.ok) throw new Error(`Failed to fetch messages (${response.status})`);
  return response.json();
}

export interface DealflowStatsResponse {
  new_startups: number;
  ready_for_review: number;
  shortlisted: number;
  meeting_requests: number;
}
export async function getDealflowStats(): Promise<DealflowStatsResponse> {
  const response = await fetch(`${API_URL}/startups/dealflow/stats`, {
    headers: getAuthHeaders(),
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch dealflow stats (${response.status})`);
  }
  return response.json();
}
export interface DealflowPaginatedResponse {
  data: any[];
  total: number;
  industries: string[];
  stages: string[];
  page: number;
  limit: number;
}

export async function getDealflow(params?: {
  page?: number;
  limit?: number;
  search?: string;
  industry?: string;
  stage?: string;
  shortlisted_ids?: string;
  meeting_ids?: string;
}): Promise<DealflowPaginatedResponse> {
  const query = new URLSearchParams();
  if (params) {
    if (params.page) query.append("page", params.page.toString());
    if (params.limit) query.append("limit", params.limit.toString());
    if (params.search) query.append("search", params.search);
    if (params.industry) query.append("industry", params.industry);
    if (params.stage) query.append("stage", params.stage);
    if (params.shortlisted_ids) query.append("shortlisted_ids", params.shortlisted_ids);
    if (params.meeting_ids) query.append("meeting_ids", params.meeting_ids);
  }
  const queryString = query.toString() ? `?${query.toString()}` : "";
  const response = await fetch(`${API_URL}/startups/dealflow${queryString}`, {
    headers: getAuthHeaders(),
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch dealflow (${response.status})`);
  }
  return response.json();
}

export interface ComparedStartup {
  id: string;
  name: string;
  industry?: string;
  stage?: string;
  funding_ask?: string | number;
  score?: number;
  market?: string;
}
export async function compareStartups(_ids: string[]): Promise<any> {
  return {};
}

// ── Meetings API ────────────────────────────────────────────────────────────

export interface MeetingRequestResponse {
  id: string;
  startup_id: string;
  investor_id: string;
  founder_id: string;
  status: string;
  scheduled_at: string | null;
  meeting_link: string | null;
  created_at: string;
  updated_at: string;
  declined_at?: string | null;
  startups?: { startup_name: string };
  users?: { name: string; profile_photo_url: string };
}

export async function requestMeeting(
  startupId: string,
  scheduledAt: string,
  agenda: string = ""
): Promise<MeetingRequestResponse> {
  const response = await fetch(`${API_URL}/meetings/`, {
    method: "POST",
    headers: getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify({
      startup_id: startupId,
      scheduled_at: scheduledAt,
      agenda: agenda,
    }),
  });
  if (!response.ok) {
    throw new Error(`Failed to request meeting (${response.status})`);
  }
  return response.json();
}

export async function getInvestorMeetings(): Promise<MeetingRequestResponse[]> {
  const response = await fetch(`${API_URL}/meetings/investor`, {
    headers: getAuthHeaders(),
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch investor meetings (${response.status})`);
  }
  return response.json();
}

export async function getFounderMeetings(): Promise<MeetingRequestResponse[]> {
  const response = await fetch(`${API_URL}/meetings/founder`, {
    headers: getAuthHeaders(),
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch founder meetings (${response.status})`);
  }
  return response.json();
}

export async function respondToMeeting(id: string, status: string): Promise<MeetingRequestResponse> {
  const response = await fetch(`${API_URL}/meetings/${id}/respond`, {
    method: "PUT",
    headers: getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    throw new Error(`Failed to respond to meeting (${response.status})`);
  }
  return response.json();
}

export async function toggleShortlistAPI(id: string): Promise<{status: string}> {
  const response = await fetch(`${API_URL}/startups/${id}/shortlist`, {
    method: "POST",
    headers: getAuthHeaders(),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to toggle shortlist (${response.status})`);
  }
  return response.json();
}

export async function getShortlistedAPI(): Promise<string[]> {
  const response = await fetch(`${API_URL}/startups/shortlisted`, {
    headers: getAuthHeaders(),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch shortlisted startups (${response.status})`);
  }
  return response.json();
}
