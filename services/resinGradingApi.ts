
import { RESIN_BASE } from "./config";
import { Platform } from "react-native";

export const predictResinGrading = async (imageUri: string) => {
  const formData = new FormData();

  if (Platform.OS === "web") {
    // ✅ Web: convert image URL to Blob then send as File
    const blob = await (await fetch(imageUri)).blob();
    const file = new File([blob], "upload.jpg", { type: blob.type || "image/jpeg" });

    formData.append("file", file);
  } else {
    // ✅ Mobile (Expo / React Native)
    const uriParts = imageUri.split(".");
    const fileType = uriParts[uriParts.length - 1];

    formData.append("file", {
      uri: imageUri,
      name: `upload.${fileType || "jpg"}`,
      type: `image/${fileType || "jpeg"}`,
    } as any);
  }

  const response = await fetch(`${RESIN_BASE}/kavin/image/predict`, {
    method: "POST",
    body: formData,
    headers: {
      Accept: "application/json",
    },
  });

  const text = await response.text();

  if (!response.ok) {
    try {
      const errorData = JSON.parse(text);
      throw new Error(errorData?.detail ?? errorData?.message ?? text);
    } catch {
      throw new Error(text || "Failed to analyze image");
    }
  }

  return JSON.parse(text);
};

