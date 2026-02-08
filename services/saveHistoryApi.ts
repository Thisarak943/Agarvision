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
