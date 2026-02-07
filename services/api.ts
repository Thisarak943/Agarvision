import axios from "axios";
import { getToken, saveToken, clearToken } from "./tokenStorage";

/**
 * IMPORTANT:
 * - Android Emulator:  http://10.0.2.2:5000/api
 * - iOS Simulator:     http://localhost:5000/api
 * - REAL phone:        http://YOUR_PC_IP:5000/api
 */
const BASE_URL = "http://192.168.8.104:5000/api"; // ✅ your PC IP + :5000 + /api

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  async register(data: {
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    address: string;
    password: string;
  }) {
    const res = await api.post("/auth/register", data);
    if (res.data?.token) await saveToken(res.data.token);
    return res.data;
  },

  async login(email: string, password: string) {
    const res = await api.post("/auth/login", { email, password });
    if (res.data?.token) await saveToken(res.data.token);
    return res.data;
  },

  async me() {
    const res = await api.get("/auth/me");
    return res.data;
  },

  async logout() {
    await clearToken();
  },
};

// ✅ Exported separately (NOT inside authAPI object)
export async function isAuthenticated() {
  const token = await getToken();
  return !!token;
}
