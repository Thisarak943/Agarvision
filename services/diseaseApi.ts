import axios from "axios";

const BASE_URL = "http://192.168.1.103:8000"; // ✅ your PC IP

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // ✅ TF model cold start can take > 15s sometimes
});

function guessMime(uri: string) {
  const lower = uri.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".heic")) return "image/heic";
  if (lower.endsWith(".heif")) return "image/heif";
  return "image/jpeg";
}

export async function predictDisease(imageUri: string) {
  const formData = new FormData();

  // ✅ iOS sometimes gives no extension; make a safe filename
  const mime = guessMime(imageUri);
  const ext =
    mime === "image/png" ? "png" :
    mime === "image/heic" ? "heic" :
    mime === "image/heif" ? "heif" : "jpg";

  formData.append("file", {
    uri: imageUri,
    name: `leaf.${ext}`,
    type: mime,
  } as any);

  try {
    const res = await client.post("/disease/predict", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });
    return res.data;
  } catch (err: any) {
    // ✅ return the real error so UI can show it
    const status = err?.response?.status;
    const detail =
      err?.response?.data?.detail ||
      err?.response?.data?.error ||
      err?.message ||
      "Unknown error";

    throw new Error(status ? `HTTP ${status}: ${detail}` : detail);
  }
}
