const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

/**
 * Uploads an image file to the backend, which forwards it to Cloudinary.
 * @returns The secure URL of the uploaded image.
 */
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/upload/image`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || `Failed to upload image (${response.status})`);
  }

  const data = await response.json();
  return data.url;
}
