// services/config.ts
import { Platform } from "react-native";

// Browser (Expo Web) must use localhost — LAN IP is unreachable from browser on same PC
// Physical phone (Expo Go) must use the actual LAN IP of the PC
export const PC_IP = Platform.OS === "web" ? "localhost" : "192.168.0.4";

// Express API (login/db)
export const API_BASE = `http://${PC_IP}:5000/api`;

// FastAPI base
export const FASTAPI_BASE = `http://${PC_IP}:8000`;

// FastAPI disease model
export const DISEASE_BASE = `http://${PC_IP}:8000`;

// FastAPI market intelligence
export const MARKET_BASE = `http://${PC_IP}:8000`;

// Stage classification model
export const STAGE_BASE = `${FASTAPI_BASE}/thenuka/stage`;

// Resin grading / Export readiness prediction
export const RESIN_BASE = `http://${PC_IP}:8000`;
