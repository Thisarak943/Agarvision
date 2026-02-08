import axios from "axios";
import { API_BASE } from "./config";
import { getToken } from "./tokenStorage";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 20000, // history can be slow
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// get user’s disease prediction history
export async function getDiseaseHistory() {
  const res = await api.get("/disease-history");
  return res.data;
}
