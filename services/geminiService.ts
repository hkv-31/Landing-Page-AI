
import { GoogleGenAI, Type } from "@google/genai";
import { RoastReportData, IssueCategory } from "../types";

export const analyzeLandingPage = async (
  input: string, // Base64 image data or URL
  isImage: boolean
): Promise<RoastReportData> => {
  const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY
});
  
  const systemInstruction = `You are a world-class landing page optimizer and SEO expert.
  Your goal is to analyze a landing page and provide a high-impact, honest audit.
  
  CRITICAL RESPONSE STRUCTURE:
  1. Roast Summary: Provide a CONCISE summary that is MAX 2 LINES long. The tone must be 70% brutal/witty and 30% respectful/professional. It should punch hard but offer a glimmer of hope.
  2. Technical Issues: YOU MUST PROVIDE EXACTLY 2-3 DISTINCT FEEDBACK POINTS FOR EVERY CATEGORY LISTED BELOW.
  
  CATEGORIES TO USE:
  - "On-Page SEO": Meta tags, headers (H1/H2), keyword density, alt text, schema markup.
  - "UX Signals": Visual hierarchy, navigation friction, CTA visibility, readability.
  - "Trust & Credibility": Social proof, testimonials, trust badges, professional polish.
  - "Content & Keywords": Value proposition, messaging clarity, keyword alignment.
  - "Mobile Readiness": Responsive layout, touch targets, font scaling.

  For each issue, ensure the 'description' is deep and technical from an SEO/Conversion standpoint. 
  Respond ONLY with valid JSON.`;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      overallScore: { type: Type.NUMBER },
      statusLabel: { type: Type.STRING, description: "Short status like 'Needs Work' or 'Absolute Disaster'" },
      roastSummary: { type: Type.STRING, description: "Max 2 lines. 70% brutal, 30% respectful." },
      analyzedTarget: { type: Type.STRING },
      issues: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING, enum: Object.values(IssueCategory) },
            severity: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
            title: { type: Type.STRING },
            description: { type: Type.STRING, description: "Deep technical explanation of the flaw" },
            impact: { type: Type.STRING },
            suggestion: { type: Type.STRING }
          },
          required: ["category", "severity", "title", "description", "impact", "suggestion"]
        }
      }
    },
    required: ["overallScore", "statusLabel", "roastSummary", "analyzedTarget", "issues"]
  };

  const modelName = 'gemini-3-flash-preview';
  let parts: any[] = [];
  
  if (isImage) {
    const base64Data = input.split(',')[1] || input;
    parts = [
      { inlineData: { mimeType: 'image/png', data: base64Data } },
      { text: "Roast this landing page screenshot. Keep the Roast Summary under 2 lines. Tone: 70% brutal, 30% respectful. Then provide 2-3 technical feedback points for every SEO category." }
    ];
  } else {
    parts = [{ text: `Roast this website URL: ${input}. Act as if you've crawled it thoroughly. Keep the Roast Summary under 2 lines. Tone: 70% brutal, 30% respectful. Then provide 2-3 technical feedback points per category.` }];
  }

  const response = await ai.models.generateContent({
    model: modelName,
    contents: { parts },
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema,
      temperature: 0.8,
    },
  });

  try {
    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    return JSON.parse(text) as RoastReportData;
  } catch (err) {
    console.error("Failed to parse Gemini response:", err);
    throw new Error("The AI failed to generate a readable roast. Try again!");
  }
};
