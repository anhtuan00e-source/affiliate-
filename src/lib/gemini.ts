import { GoogleGenAI } from "@google/genai";
import { Outfit } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getStylistRecommendation(style: string, occasion: string, catalog: Outfit[]) {
  const prompt = `
    You are a professional Korean Fashion Stylist. 
    A user is looking for an outfit for the following:
    Style: ${style}
    Occasion: ${occasion}

    Available Outfits in our catalog:
    ${catalog.map(o => `ID: ${o.id}, Name: ${o.tên_outfit}, Description: ${o.mô_tả}`).join('\n')}

    Based on the user's preference, pick the BEST outfit from the catalog.
    Return ONLY a JSON object with:
    {
      "outfitId": "string",
      "reason": "A short, catchy explanation in Vietnamese why this fits them perfectly."
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Stylist AI Error:", error);
    return null;
  }
}
