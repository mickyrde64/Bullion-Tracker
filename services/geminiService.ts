import { GoogleGenAI } from "@google/genai";
import { PortfolioStats, MarketPrices, Currency } from "../types";
import { formatCurrency, formatWeight } from "../utils/calculations";

// Initialize the Gemini client with the API key from the environment variable.
// We assume process.env.API_KEY is pre-configured and valid as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generatePortfolioInsight = async (stats: PortfolioStats, prices: MarketPrices, currency: Currency): Promise<string> => {
  const prompt = `
    Act as a senior financial analyst specializing in commodities.
    
    Current Market Spot Prices (${currency}/oz):
    Gold: ${formatCurrency(prices.Gold, currency)}
    Silver: ${formatCurrency(prices.Silver, currency)}
    Platinum: ${formatCurrency(prices.Platinum, currency)}
    
    User Portfolio Snapshot:
    Total Value: ${formatCurrency(stats.totalValue, currency)}
    Gold Holdings: ${formatWeight(stats.totalGoldWeightOz)} oz (${formatCurrency(stats.totalGoldValue, currency)})
    Silver Holdings: ${formatWeight(stats.totalSilverWeightOz)} oz (${formatCurrency(stats.totalSilverValue, currency)})
    Platinum Holdings: ${formatWeight(stats.totalPlatinumWeightOz)} oz (${formatCurrency(stats.totalPlatinumValue, currency)})
    
    Provide a concise, 3-sentence insight about this portfolio. 
    1. Comment on the Gold/Silver ratio or diversification.
    2. Give a quick historical context or fun fact about the purchasing power of this amount (e.g., "In Roman times...").
    3. A brief strategic tip (e.g., "Consider hedging...").
    Keep it professional but engaging.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Unable to generate insights at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI service is currently unavailable.";
  }
};

export const identifyItemFromDescription = async (description: string): Promise<{ metal: string; weight: number; unit: string } | null> => {
  // Use AI to parse natural language descriptions like "2 gold coins 1oz each" or "500g silver bar"
  const prompt = `
    Extract inventory data from this description: "${description}".
    Return ONLY a JSON object with keys: "metal" (Enum: Gold, Silver, Platinum), "weight" (number), "unit" (Enum: g, oz, t oz, kg).
    If ambiguous, default to 1 unit. If metal is unclear, return null.
    Example output: { "metal": "Gold", "weight": 1, "unit": "oz" }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });
    
    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (e) {
    console.error("Parsing error", e);
    return null;
  }
};