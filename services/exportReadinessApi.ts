import { RESIN_BASE } from "./config";

export const checkExportReadiness = async (data: any) => {
  const response = await fetch(`${RESIN_BASE}/kavin/numeric/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(text);
  }

  return JSON.parse(text);
};