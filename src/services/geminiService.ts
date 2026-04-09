import { WasteResult } from "../types";

const API_BASE = "/api";

export async function classifyWasteByText(text: string): Promise<WasteResult> {
  const response = await fetch(`${API_BASE}/classify/text`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Classification failed.");
  }

  return response.json();
}

export async function classifyWasteByImage(
  base64Image: string
): Promise<WasteResult> {
  const response = await fetch(`${API_BASE}/classify/image`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: base64Image }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Image classification failed.");
  }

  return response.json();
}
