// services/marketIntelligenceApi.ts
// ─────────────────────────────────────────────────────────────────────────────
// API service for Oshini's Market Intelligence module
// Endpoints:
//   POST /oshini/predict-demand   → demand + price prediction
//   POST /oshini/market-chatbot/chat  → market assistant chatbot
//   POST /oshini/market-chatbot/reset → reset chatbot state
// ─────────────────────────────────────────────────────────────────────────────

import axios from "axios";

const marketChatbotApi = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

const marketDemandApi = axios.create({
  baseURL: "http://127.0.0.1:8000",
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

export interface DemandOptionsResponse {
  oil_types: string[];
  oil_grades: string[];
  market_regions: string[];
  countries_by_region: Record<string, string[]>;
  months: Array<
    | string
    | number
    | {
        label?: string | number;
        value?: string | number;
        month?: string | number;
        month_name?: string | number;
        name?: string | number;
      }
  >;
  weeks: Array<
    | string
    | number
    | {
        label?: string | number;
        value?: string | number;
        week?: string | number;
        name?: string | number;
      }
  >;
}

// POST /oshini/predict-demand  — request body
export interface DemandRequest {
  oil_type: string;
  oil_grade: string;
  market_region: string;
  market_country: string;
  prediction_month: string;
  prediction_week: number;
  festival_season: boolean;
}

// POST /oshini/predict-demand  — response body
export interface DemandResponse {
  oil_name: string;
  oil_grade: string;
  export_country: string;
  export_date: string;
  predicted_time?: {
    year: number;
    month: number;
    month_name: string;
    week: number;
    forecast_horizon_months?: number;
    forecast_horizon?: string;
    forecast_scope?: string;
  };
  market_region: string;
  market_country: string;
  festival_season: boolean;
  demand_index: number;        // 0 – 100
  demand_category: "High" | "Medium" | "Low" | string;
  reasons: string[];
  recommended_price_range: {
    current_selling_price_lkr?: number;
    min_price_lkr: number;
    max_price_lkr: number;
  };
}

// POST /chatbot/chat  — request body
export interface ChatRequest {
  message: string;
  session_id: string;
}

// POST /chatbot/chat  — response body
export interface MarketChatPrediction {
  oil_name: string;
  oil_grade: string;
  export_country: string;
  export_date: string;
  demand_index: number;
  demand_category: string;
  reasons?: string[];
  recommended_price_range?: {
    current_selling_price_lkr?: number;
    min_price_lkr: number;
    max_price_lkr: number;
  };
}

export interface ChatResponse {
  intent: string;
  language?: string;
  reply: string;
  status: "success" | "missing_fields" | "unsupported_market" | "error" | string;
  missing_fields?: string[];
  extracted?: Record<string, any>;
  prediction?: MarketChatPrediction | null;
}

// ─── API calls ────────────────────────────────────────────────────────────────

/**
 * Call the demand + pricing prediction model.
 * Used by the Form → Result flow.
 */
export async function getDemandOptions(): Promise<DemandOptionsResponse> {
  try {
    const res = await marketDemandApi.get<DemandOptionsResponse>(
      "/oshini/demand-options"
    );
    return res.data;
  } catch (err: any) {
    const detail =
      err?.response?.data?.detail ||
      err?.response?.data?.error ||
      err?.message ||
      "Could not load demand options";
    throw new Error(detail);
  }
}

export async function predictDemand(
  payload: DemandRequest
): Promise<DemandResponse> {
  try {
    const res = await marketDemandApi.post<DemandResponse>(
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
  sessionId: string
): Promise<ChatResponse> {
  try {
    const body: ChatRequest = { message, session_id: sessionId };

    const res = await marketChatbotApi.post<ChatResponse>(
      "/oshini/market-chatbot/chat",
      body
    );
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
export async function resetChatConversation(sessionId: string): Promise<void> {
  try {
    await marketChatbotApi.post("/oshini/market-chatbot/reset", {
      session_id: sessionId,
    });
  } catch (err: any) {
    const detail =
      err?.response?.data?.detail ||
      err?.response?.data?.error ||
      err?.message ||
      "Chat reset failed";
    throw new Error(detail);
  }
}

export async function checkDemandHealth(): Promise<boolean> {
  try {
    await marketDemandApi.get("/oshini/health", { timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}

/**
 * Health check — returns true if backend is reachable.
 */
export async function checkMarketHealth(): Promise<boolean> {
  try {
    await marketChatbotApi.get("/oshini/market-chatbot/health", {
      timeout: 5000,
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * LLM health check — returns true if the OpenAI/LLM service is configured.
 */
export async function checkMarketLlmHealth(): Promise<boolean> {
  try {
    await marketChatbotApi.get("/oshini/market-chatbot/llm-health", {
      timeout: 5000,
    });
    return true;
  } catch {
    return false;
  }
}
