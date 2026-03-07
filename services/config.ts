// services/config.ts
<<<<<<< HEAD
export const PC_IP = "172.28.15.232";
=======
import { Platform } from "react-native";

// Browser (Expo Web) must use localhost — LAN IP is unreachable from browser on same PC
// Physical phone (Expo Go) must use the actual LAN IP of the PC
export const PC_IP = Platform.OS === "web" ? "localhost" : "10.92.16.110";
>>>>>>> origin/oshini

// Express API (login/db)
export const API_BASE = `http://${PC_IP}:5000/api`;

<<<<<<< HEAD
// FastAPI base
export const FASTAPI_BASE = `http://${PC_IP}:8000`;

// FastAPI disease model
export const DISEASE_BASE = `http://${PC_IP}:8000`;

// Stage model
export const STAGE_BASE = `${FASTAPI_BASE}/thenuka/stage`;

// FastAPI ML server (Resin grading / Export readiness prediction) 
export const RESIN_BASE = `http://${PC_IP}:8000`;
=======
// FastAPI (market intelligence + disease model)
export const DISEASE_BASE = `http://${PC_IP}:8000`;
export const MARKET_BASE = `http://${PC_IP}:8000`;
>>>>>>> origin/oshini
