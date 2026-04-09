import { GoogleGenAI, Type } from "@google/genai";

import { WasteResult } from "../src/types";

const WASTE_CLASSIFICATION_PROMPT = `
You are an expert waste management assistant. Your task is to classify a waste item into one of three categories:
1. WET: Compostable organic waste (e.g., food scraps, banana peels).
2. DRY: Recyclable non-organic waste (e.g., paper, plastic bottles, cardboard).
3. HAZARD: Toxic or chemical waste requiring special disposal (e.g., batteries, electronics, chemicals).

Provide the classification in JSON format with the following fields:
- name: The identified name of the item.
- category: One of "WET", "DRY", or "HAZARD".
- description: A brief description of the item.
- disposalMethod: Clear instructions on how to dispose of it (e.g., "Green bin", "Blue bin", "Specialized center").
- confidence: A number between 0 and 1 representing your confidence.
`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    category: { type: Type.STRING, enum: ["WET", "DRY", "HAZARD"] },
    description: { type: Type.STRING },
    disposalMethod: { type: Type.STRING },
    confidence: { type: Type.NUMBER },
  },
  required: ["name", "category", "description", "disposalMethod", "confidence"],
} as const;

function getAI(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set.");
  }
  return new GoogleGenAI({ apiKey });
}

export async function classifyByText(text: string): Promise<WasteResult> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Classify this waste item: ${text}`,
    config: {
      systemInstruction: WASTE_CLASSIFICATION_PROMPT,
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
    },
  });

  return JSON.parse(response.text || "{}") as WasteResult;
}

export async function classifyByImage(
  base64DataUrl: string
): Promise<WasteResult> {
  const ai = getAI();

  // Strip the data URL prefix (e.g. "data:image/jpeg;base64,") to get raw base64
  const base64Data = base64DataUrl.includes(",")
    ? base64DataUrl.split(",")[1]
    : base64DataUrl;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { text: "Identify and classify the waste item in this image." },
        { inlineData: { data: base64Data, mimeType: "image/jpeg" } },
      ],
    },
    config: {
      systemInstruction: WASTE_CLASSIFICATION_PROMPT,
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
    },
  });

  return JSON.parse(response.text || "{}") as WasteResult;
}
