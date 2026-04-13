import axios from "axios";
import { API_BASE } from "./config";
import { getToken } from "./tokenStorage";

export async function saveDiseaseHistory(payload: any) {
  const token = await getToken();

  if (!token) {
    throw new Error("No authentication token found. Please login first.");
  }

  const res = await axios.post(`${API_BASE}/disease-history`, payload, {
    timeout: 20000,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return res.data;
}

export async function getDiseaseHistory() {
  const token = await getToken();

  if (!token) {
    throw new Error("No authentication token found. Please login first.");
  }

  try {
    const res = await axios.get(`${API_BASE}/disease-history`, {
      timeout: 20000,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data; // { items: [...] }
  } catch (error: any) {
    const status = error?.response?.status;
    const msg = error?.response?.data?.message || error?.response?.data?.detail || error?.message;
    
    if (status === 401) {
      throw new Error("Session expired. Please login again.");
    }
    
    throw new Error(msg || "Failed to load prediction history");
  }
}

export async function deleteDiseaseHistory(id: string) {
  const token = await getToken();

  if (!token) {
    throw new Error("No authentication token found. Please login first.");
  }

  const res = await axios.delete(`${API_BASE}/disease-history/${id}`, {
    timeout: 20000,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}
