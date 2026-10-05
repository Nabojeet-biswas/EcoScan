import { GoogleGenAI, Type } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

export interface WasteAnalysisResult {
  itemName: string;
  category: "Plastic" | "Organic" | "E-Waste" | "Paper" | "Metal" | "Glass" | "Other";
  isRecyclable: boolean;
  disposalMethod: string;
  environmentalImpact: string;
}

export async function analyzeWasteImage(base64Image: string, mimeType: string = "image/jpeg"): Promise<WasteAnalysisResult> {
  const prompt = `
    Analyze this waste/garbage item in the image.
    Identify the item, classify its category, determine whether it is recyclable, and provide safe disposal instructions.
  `;

  // Remove data URI prefix if present
  const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          { text: prompt },
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType,
            },
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          itemName: { type: Type.STRING },
          category: { 
            type: Type.STRING, 
            enum: ["Plastic", "Organic", "E-Waste", "Paper", "Metal", "Glass", "Other"] 
          },
          isRecyclable: { type: Type.BOOLEAN },
          disposalMethod: { type: Type.STRING },
          environmentalImpact: { type: Type.STRING },
        },
        required: ["itemName", "category", "isRecyclable", "disposalMethod", "environmentalImpact"],
      },
    },
  });

  return JSON.parse(response.text || "{}") as WasteAnalysisResult;
}