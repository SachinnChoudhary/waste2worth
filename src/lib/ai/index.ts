import { GoogleGenAI } from "@google/genai";
import type {
  AIClassification,
  AIValueEstimate,
  AIEnvironmentalImpact,
  AIIndustryRecommendation,
  AICollaborationChain,
} from "@/types";
import {
  getMockClassification,
  getMockValueEstimate,
  getMockEnvironmentalImpact,
  getMockIndustryRecommendations,
  getMockCollaborationChains,
  getMockAssistantResponse,
} from "./mock-data";

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

export interface AnalyzeWasteInput {
  description: string;
  category?: string;
  quantity?: number;
  condition?: string;
  location?: string;
}

export interface AnalyzeWasteResult {
  classification: AIClassification;
  valueEstimate: AIValueEstimate;
  environmentalImpact: AIEnvironmentalImpact;
  industryRecommendations: AIIndustryRecommendation[];
}

export async function analyzeWaste(params: AnalyzeWasteInput): Promise<AnalyzeWasteResult> {
  const ai = getGeminiClient();

  if (!ai) {
    const classification = getMockClassification(params.description, params.category);
    const valueEstimate = getMockValueEstimate(params.category || classification.category, params.quantity || 1000, params.condition);
    const environmentalImpact = getMockEnvironmentalImpact(params.category || classification.category, params.quantity || 1000);
    const industryRecommendations = getMockIndustryRecommendations(params.category || classification.category);
    return { classification, valueEstimate, environmentalImpact, industryRecommendations };
  }

  try {
    const prompt = `You are an industrial waste analysis AI for CircuLink, a circular economy platform.
Analyze the following waste listing and generate structured predictions for classification, economic value, environmental impact, and target industries for reuse/recycling.

Waste Details:
- Description: ${params.description}
- Category hint: ${params.category || "Unspecified"}
- Quantity: ${params.quantity || 1000} kg
- Condition: ${params.condition || "Unspecified"}
- Location: ${params.location || "Unspecified"}

Respond with a raw valid JSON object matching the following structure:
{
  "classification": {
    "category": "category string like METAL_SCRAP, PLASTIC, CHEMICAL_BYPRODUCTS, TEXTILE_WASTE, E_WASTE, ORGANIC_AGRI, CONSTRUCTION_DEBRIS, PAPER_CARDBOARD, GLASS, RUBBER, WOOD, OIL_LUBRICANTS, or OTHER",
    "subCategory": "specific subcategory name",
    "hazardClass": "hazard classification string like NONE, CLASS_3, CLASS_6, CLASS_8, CLASS_9",
    "confidence": 0.92,
    "tags": ["tag1", "tag2", "tag3"]
  },
  "valueEstimate": {
    "estimatedValue": { "min": 100, "max": 150 },
    "historicalComparisons": [
      { "description": "similar item deal", "price": 120, "date": "2024-11-01" }
    ],
    "disposalCostAvoided": 80
  },
  "environmentalImpact": {
    "co2Avoided": 450,
    "landfillDiverted": 1000,
    "waterSaved": 500,
    "energySaved": 2300
  },
  "industryRecommendations": [
    {
      "industry": "Target Industry Name",
      "relevanceScore": 0.95,
      "reasoning": "Explanation why this industry needs this waste stream.",
      "potentialCompanies": 12
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    if (response.text) {
      const parsed = JSON.parse(response.text);
      if (parsed.classification && parsed.valueEstimate && parsed.environmentalImpact && parsed.industryRecommendations) {
        return parsed as AnalyzeWasteResult;
      }
    }
  } catch (err) {
    console.warn("Gemini API analyze error, falling back to mock data:", err);
  }

  const classification = getMockClassification(params.description, params.category);
  const valueEstimate = getMockValueEstimate(params.category || classification.category, params.quantity || 1000, params.condition);
  const environmentalImpact = getMockEnvironmentalImpact(params.category || classification.category, params.quantity || 1000);
  const industryRecommendations = getMockIndustryRecommendations(params.category || classification.category);
  return { classification, valueEstimate, environmentalImpact, industryRecommendations };
}

export async function getAssistantResponse(message: string): Promise<string> {
  const ai = getGeminiClient();

  if (!ai) {
    return getMockAssistantResponse(message);
  }

  try {
    const prompt = `You are CircuLink Assistant, an expert AI advisor for circular economy, industrial waste management, material recycling, industrial symbiosis, and environmental compliance.
Provide detailed, helpful, professional, markdown-formatted guidance to the user's message.

User Message: ${message}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    if (response.text) {
      return response.text;
    }
  } catch (err) {
    console.warn("Gemini API assistant error, falling back to mock data:", err);
  }

  return getMockAssistantResponse(message);
}

export async function getCollaborationChains(): Promise<AICollaborationChain[]> {
  const ai = getGeminiClient();

  if (!ai) {
    return getMockCollaborationChains();
  }

  try {
    const prompt = `You are CircuLink AI, an industrial symbiosis optimization system.
Generate 3 realistic circular economy collaboration supply chains where waste streams from one company become valuable inputs for another.

Respond with a raw valid JSON array matching this structure:
[
  {
    "chainId": "chain-1",
    "chainName": "Descriptive Chain Name",
    "participants": [
      {
        "companyId": "c1",
        "companyName": "Company A",
        "role": "Waste Generator",
        "inputMaterial": "Raw Input",
        "outputMaterial": "Waste Stream"
      },
      {
        "companyId": "c2",
        "companyName": "Company B",
        "role": "Processor / End User",
        "inputMaterial": "Waste Stream",
        "outputMaterial": "Final Product"
      }
    ],
    "confidenceScore": 0.91,
    "estimatedSavings": 40000,
    "estimatedCo2Reduction": 10000
  }
]`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    if (response.text) {
      const parsed = JSON.parse(response.text);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed as AICollaborationChain[];
      }
    }
  } catch (err) {
    console.warn("Gemini API collaboration chains error, falling back to mock data:", err);
  }

  return getMockCollaborationChains();
}
