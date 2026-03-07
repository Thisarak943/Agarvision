// services/marketIntelligenceApi.ts
// ─────────────────────────────────────────────────────────────────────────────
// API service for Oshini's Market Intelligence module
// Endpoints:
//   POST /oshini/predict-demand   → demand + price prediction
//   POST /chatbot/chat            → NLP chatbot
//   POST /chatbot/reset-conversation → reset chatbot state
// ─────────────────────────────────────────────────────────────────────────────

import axios from "axios";
import { MARKET_BASE } from "./config";

const marketApi = axios.create({
  baseURL: MARKET_BASE,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

// ─── Types ────────────────────────────────────────────────────────────────────

export type OilType =
  | "Silani Ravana"
  | "Silani Savera"
  | "Silani Cobra"
  | "Silani Junglefowl"
  | "Silani Butterfly"
  | "Silani Peacock";

export type OilGrade = "Premium" | "Standard" | "Budget";

export type MarketRegion =
  | "Middle East"
  | "East Asia"
  | "Southeast Asia"
  | "Europe"
  | "South Asia";

export type PredictionPeriod = "Next Week" | "Next Month" | "Next Quarter";

// POST /oshini/predict-demand  — request body
export interface DemandRequest {
  oil_type: OilType;
  oil_grade: OilGrade;
  market_region: MarketRegion;
  market_country: string;
  prediction_period: PredictionPeriod;
  festival_season: boolean;
}

// POST /oshini/predict-demand  — response body
export interface DemandResponse {
  selected_details: {
    oil_type: string;
    oil_grade: string;
    market_country: string;
    prediction_period: string;
  };
  demand_index: number;        // 0 – 100
  demand_level: "High" | "Medium" | "Low";
  recommended_price_range: {
    min_price_lkr: number;
    max_price_lkr: number;
  };
  why: string[];
}

// POST /chatbot/chat  — request body
export interface ChatRequest {
  message: string;
  session_id?: string;
}

// POST /chatbot/chat  — response body
export interface ChatResponse {
  intent: string;
  response: string;
  confidence: number;
  status?: string;
  data?: {
    demand_index?: number;
    demand_level?: string;
    recommended_price_range?: {
      min_price_lkr: number;
      max_price_lkr: number;
    };
    why?: string[];
    [key: string]: any;
  } | null;
}

// ─── API calls ────────────────────────────────────────────────────────────────

/**
 * Call the demand + pricing prediction model.
 * Used by the Form → Result flow.
 */
export async function predictDemand(
  payload: DemandRequest
): Promise<DemandResponse> {
  try {
    const res = await marketApi.post<DemandResponse>(
      "/oshini/predict-demand",
      payload
    );
    return res.data;
  } catch (err: any) {
    const detail =
      err?.response?.data?.detail ||
      err?.message ||
      "Demand prediction failed";
    throw new Error(detail);
  }
}

/**
 * Send a chat message to the NLP chatbot.
 * Used by the Chat page.
 */
export async function sendChatMessage(
  message: string,
  sessionId?: string
): Promise<ChatResponse> {
  try {
    const body: ChatRequest = { message };
    if (sessionId) body.session_id = sessionId;

    const res = await marketApi.post<ChatResponse>("/chatbot/chat", body);
    return res.data;
  } catch (err: any) {
    const detail =
      err?.response?.data?.detail ||
      err?.message ||
      "Chat request failed";
    throw new Error(detail);
  }
}

/**
 * Reset the chatbot conversation state on the backend.
 */
export async function resetChatConversation(): Promise<void> {
  try {
    await marketApi.post("/chatbot/reset-conversation");
  } catch {
    // non-critical — ignore silently
  }
}

/**
 * Health check — returns true if backend is reachable.
 */
export async function checkMarketHealth(): Promise<boolean> {
  try {
    await marketApi.get("/oshini/health", { timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}