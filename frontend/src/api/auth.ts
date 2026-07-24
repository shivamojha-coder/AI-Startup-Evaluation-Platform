import type { UserProfile } from "../context/AuthContext";

export interface UserProfileUpdateInput {
  name: string;
  bio?: string | null;
  headline?: string | null;
  profile_photo_url?: string | null;
  linkedin_url?: string | null;
  email?: string;
  password?: string | null;
}

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function updateProfile(data: UserProfileUpdateInput): Promise<UserProfile> {
  const response = await fetch(`${API_URL}/auth/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || `Failed to update profile (${response.status})`);
  }

  return response.json();
}
