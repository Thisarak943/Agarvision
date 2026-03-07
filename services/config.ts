// services/config.ts
import { Platform } from "react-native";

// Browser (Expo Web) must use localhost — LAN IP is unreachable from browser on same PC
// Physical phone (Expo Go) must use the actual LAN IP of the PC
export const PC_IP = Platform.OS === "web" ? "localhost" : "10.92.16.110";

// Express API (login/db)
export const API_BASE = `http://${PC_IP}:5000/api`;

// FastAPI (market intelligence + disease model)
export const DISEASE_BASE = `http://${PC_IP}:8000`;
export const MARKET_BASE = `http://${PC_IP}:8000`;
