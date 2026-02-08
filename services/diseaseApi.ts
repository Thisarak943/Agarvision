import axios from "axios";
import { API_BASE, DISEASE_BASE } from "./config";
import { getToken } from "./tokenStorage";

export async function predictDisease(imageUri: string) {
  const formData = new FormData();

  formData.append("file", {
    uri: imageUri,
    name: "leaf.jpg",
    type: "image/jpeg",
  } as any);

  try {
    const res = await axios.post(`${DISEASE_BASE}/disease/predict`, formData, {
      timeout: 30000, // ✅ more time
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err: any) {
    // helpful debug
    const msg =
      err?.response?.data?.detail ||
      err?.response?.data?.error ||
      err?.message ||
      "Prediction failed";
    throw new Error(msg);
  }
}

export async function getDiseaseHistory() {
  const token = await getToken();

  const res = await axios.get(`${API_BASE}/disease-history`, {
    timeout: 20000,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  return res.data; // { items: [...] }
}

export async function deleteDiseaseHistory(id: string) {
  const token = await getToken();

  const res = await axios.delete(`${API_BASE}/disease-history/${id}`, {
    timeout: 20000,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  return res.data;
}
