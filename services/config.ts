// services/config.ts
export const PC_IP = "172.28.26.118";

// Express API (login/db)
export const API_BASE = `http://${PC_IP}:5000/api`;

// FastAPI base
export const FASTAPI_BASE = `http://${PC_IP}:8000`;

// FastAPI disease model
export const DISEASE_BASE = `http://${PC_IP}:8000`;

// Stage model
export const STAGE_BASE = `${FASTAPI_BASE}/thenuka/stage`;
