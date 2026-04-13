import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_BASE } from "./config";
import { clearToken, getToken, saveToken } from "./tokenStorage";

/**
 * IMPORTANT:
 * - Android Emulator:  http://10.0.2.2:5000/api
 * - iOS Simulator:     http://localhost:5000/api
 * - REAL phone (Expo Go): Uses dynamic IP from config.ts
 * - Web browser: Uses localhost (configured in config.ts)
 */
const BASE_URL = API_BASE;

const USER_KEY = "USER_DATA";

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

/* =========================
   AUTH API (UNCHANGED)
========================= */
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
    if (res.data?.user) await saveUserData(res.data.user);
    return res.data;
  },

  async login(email: string, password: string) {
    const res = await api.post("/auth/login", { email, password });
    if (res.data?.token) await saveToken(res.data.token);
    if (res.data?.user) await saveUserData(res.data.user);
    return res.data;
  },

  async me() {
    const res = await api.get("/auth/me");
    if (res.data?.user) await saveUserData(res.data.user);
    return res.data;
  },

  async logout() {
    await clearAuthData();
  },
};

/* =========================
   USER API
========================= */
export const userAPI = {
  async getProfile() {
    const res = await api.get("/auth/me");
    if (res.data?.user) await saveUserData(res.data.user);
    return res.data;
  },

  async deleteAccount() {
    const res = await api.post("/auth/delete-account");
    await clearAuthData();
    return res.data;
  },
};

/* =========================
   AUTH HELPERS
========================= */
export async function isAuthenticated() {
  const token = await getToken();
  return !!token;
}

export async function getUserData() {
  const raw = await AsyncStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function saveUserData(user: any) {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function clearAuthData() {
  await AsyncStorage.multiRemove([USER_KEY]);
  await clearToken();
}

export default api;