import { STAGE_BASE } from "./config";

export type StagePredictResponse = {
  predicted_label?: string;
  confidence?: number;
  probabilities?: Record<string, number>;
  inputs_used?: Record<string, number>;
  image_input_size?: { width: number; height: number };
  error?: string;
};

export const predictStage = async (params: {
  imageUri: string;
  tree_age: string;
  tree_diameter: string;
  inoculation_count: string;
  months_since_first: string;
  months_since_last: string;
}): Promise<StagePredictResponse> => {
  try {
    const formData = new FormData();

    // ✅ Web + RN compatible file append
    const uriParts = params.imageUri.split(".");
    const ext = (uriParts[uriParts.length - 1] || "jpg").toLowerCase();
    const mime = ext === "jpg" ? "image/jpeg" : `image/${ext}`;

    // For Expo Web: fetch expects Blob, not {uri:...}
    // We'll handle both:
    if (params.imageUri.startsWith("blob:") || params.imageUri.startsWith("http")) {
      const resp = await fetch(params.imageUri);
      const blob = await resp.blob();
      formData.append("file", blob, `upload.${ext}`);
    } else {
      formData.append("file", {
        uri: params.imageUri,
        name: `upload.${ext}`,
        type: mime,
      } as any);
    }

    // ✅ MUST match backend Form(...) names exactly
    formData.append("tree_age", params.tree_age);
    formData.append("tree_diameter", params.tree_diameter);
    formData.append("inoculation_count", params.inoculation_count);
    formData.append("months_since_first", params.months_since_first);
    formData.append("months_since_last", params.months_since_last);

    const res = await fetch(`${STAGE_BASE}/predict`, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });

    const text = await res.text();
    let data: any;

    try {
      data = JSON.parse(text);
    } catch {
      data = { error: text };
    }

    if (!res.ok) {
      return { error: data?.error ?? `HTTP ${res.status}` };
    }

    return data as StagePredictResponse;
  } catch (err: any) {
    return { error: err?.message || "Failed to fetch" };
  }
};