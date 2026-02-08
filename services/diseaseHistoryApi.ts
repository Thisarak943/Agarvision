import axios from "axios";
import { API_BASE } from "./config";
import { getToken } from "./tokenStorage";

export async function saveDiseaseHistory(payload: any) {
  const token = await getToken();

  const res = await axios.post(`${API_BASE}/disease-history`, payload, {
    timeout: 20000,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  });

  return res.data;
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
