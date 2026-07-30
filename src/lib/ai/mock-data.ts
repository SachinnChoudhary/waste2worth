// Mock AI responses for development without an API key
// These provide realistic demo data for all AI features

import type {
  AIClassification,
  AIValueEstimate,
  AIEnvironmentalImpact,
  AIIndustryRecommendation,
  AICollaborationChain,
} from "@/types";

const categoryMap: Record<string, { subCategories: string[]; tags: string[]; industries: string[] }> = {
  METAL_SCRAP: {
    subCategories: ["Steel scrap", "Aluminum offcuts", "Copper wire", "Iron filings"],
    tags: ["recyclable", "ferrous", "high-value", "industrial-grade"],
    industries: ["Automotive Manufacturing", "Construction", "Electronics", "Metal Fabrication"],
  },
  PLASTIC: {
    subCategories: ["HDPE containers", "PET bottles", "PVC pipes", "Polypropylene sheets"],
    tags: ["thermoplastic", "recyclable", "post-industrial", "clean"],
    industries: ["Packaging", "Injection Molding", "Textile Manufacturing", "3D Printing"],
  },
  CHEMICAL_BYPRODUCTS: {
    subCategories: ["Acid solutions", "Solvent waste", "Catalyst residue", "Chemical sludge"],
    tags: ["chemical", "requires-treatment", "industrial-byproduct", "controlled"],
    industries: ["Chemical Processing", "Pharmaceuticals", "Paint Manufacturing", "Water Treatment"],
  },
  TEXTILE_WASTE: {
    subCategories: ["Cotton scraps", "Polyester offcuts", "Denim waste", "Fabric rolls"],
    tags: ["textile", "recyclable", "pre-consumer", "clean-fiber"],
    industries: ["Fashion & Apparel", "Insulation Manufacturing", "Paper Production", "Automotive Interior"],
  },
  E_WASTE: {
    subCategories: ["Circuit boards", "CRT monitors", "Battery cells", "Cable assemblies"],
    tags: ["electronic", "precious-metals", "requires-dismantling", "certified"],
    industries: ["Precious Metal Recovery", "Electronics Refurbishment", "Component Harvesting"],
  },
  ORGANIC_AGRI: {
    subCategories: ["Crop residue", "Food processing waste", "Biomass", "Animal byproducts"],
    tags: ["organic", "biodegradable", "compostable", "biomass-energy"],
    industries: ["Biogas Production", "Composting", "Animal Feed", "Fertilizer Manufacturing"],
  },
  CONSTRUCTION_DEBRIS: {
    subCategories: ["Concrete rubble", "Brick waste", "Timber offcuts", "Roofing materials"],
    tags: ["construction", "aggregate-suitable", "heavy", "recyclable"],
    industries: ["Road Construction", "Concrete Manufacturing", "Landscaping", "Fill Material"],
  },
};

export function getMockClassification(description: string, category?: string): AIClassification {
  const cat = category || "METAL_SCRAP";
  const catData = categoryMap[cat] || categoryMap.METAL_SCRAP;

  return {
    category: cat,
    subCategory: catData.subCategories[Math.floor(Math.random() * catData.subCategories.length)],
    hazardClass: cat === "CHEMICAL_BYPRODUCTS" ? "CLASS_6" : "NONE",
    confidence: 0.85 + Math.random() * 0.12,
    tags: catData.tags.slice(0, 3 + Math.floor(Math.random() * 2)),
  };
}

export function getMockValueEstimate(
  category: string,
  quantity: number,
  _condition?: string
): AIValueEstimate {
  const basePricePerUnit: Record<string, number> = {
    METAL_SCRAP: 0.45,
    PLASTIC: 0.25,
    CHEMICAL_BYPRODUCTS: 0.15,
    TEXTILE_WASTE: 0.20,
    E_WASTE: 1.50,
    ORGANIC_AGRI: 0.08,
    CONSTRUCTION_DEBRIS: 0.05,
    PAPER_CARDBOARD: 0.12,
    GLASS: 0.10,
    RUBBER: 0.18,
    WOOD: 0.15,
    OIL_LUBRICANTS: 0.30,
    OTHER: 0.10,
  };

  const base = (basePricePerUnit[category] || 0.1) * quantity;
  const variance = base * 0.2;

  return {
    estimatedValue: {
      min: Math.round(base - variance),
      max: Math.round(base + variance),
    },
    historicalComparisons: [
      { description: `Similar ${category} lot sold`, price: Math.round(base * 0.95), date: "2024-11-15" },
      { description: `Bulk ${category} transaction`, price: Math.round(base * 1.1), date: "2024-10-22" },
      { description: `Regional ${category} deal`, price: Math.round(base * 0.88), date: "2024-09-30" },
    ],
    disposalCostAvoided: Math.round(quantity * 0.08),
  };
}

export function getMockEnvironmentalImpact(category: string, quantity: number): AIEnvironmentalImpact {
  const co2PerKg: Record<string, number> = {
    METAL_SCRAP: 1.8,
    PLASTIC: 2.5,
    CHEMICAL_BYPRODUCTS: 0.5,
    TEXTILE_WASTE: 3.2,
    E_WASTE: 5.0,
    ORGANIC_AGRI: 0.3,
    CONSTRUCTION_DEBRIS: 0.2,
    PAPER_CARDBOARD: 1.5,
    GLASS: 0.6,
    RUBBER: 2.0,
    WOOD: 1.0,
    OIL_LUBRICANTS: 3.0,
    OTHER: 0.5,
  };

  const co2Factor = co2PerKg[category] || 0.5;

  return {
    co2Avoided: Math.round(quantity * co2Factor),
    landfillDiverted: quantity,
    waterSaved: Math.round(quantity * 0.5),
    energySaved: Math.round(quantity * 2.3),
  };
}

export function getMockIndustryRecommendations(category: string): AIIndustryRecommendation[] {
  const catData = categoryMap[category] || categoryMap.METAL_SCRAP;

  return catData.industries.map((industry, i) => ({
    industry,
    relevanceScore: 0.95 - i * 0.08,
    reasoning: `${industry} companies commonly use ${category.replace(/_/g, " ").toLowerCase()} as raw material in their production processes.`,
    potentialCompanies: Math.floor(Math.random() * 20) + 5,
  }));
}

export function getMockCollaborationChains(): AICollaborationChain[] {
  return [
    {
      chainId: "chain-1",
      chainName: "Metal-Auto-Construction Loop",
      participants: [
        { companyId: "c1", companyName: "SteelWorks Inc.", role: "Waste Generator", inputMaterial: "Raw Steel", outputMaterial: "Steel Scrap" },
        { companyId: "c2", companyName: "AutoParts Ltd.", role: "Processor", inputMaterial: "Steel Scrap", outputMaterial: "Metal Shavings" },
        { companyId: "c3", companyName: "BuildRight Co.", role: "End User", inputMaterial: "Metal Shavings", outputMaterial: "Rebar" },
      ],
      confidenceScore: 0.89,
      estimatedSavings: 45000,
      estimatedCo2Reduction: 12000,
    },
    {
      chainId: "chain-2",
      chainName: "Plastic-Textile Circular Chain",
      participants: [
        { companyId: "c4", companyName: "PlastiCorp", role: "Waste Generator", inputMaterial: "Virgin Plastic", outputMaterial: "Plastic Flakes" },
        { companyId: "c5", companyName: "FibreWave", role: "Converter", inputMaterial: "Plastic Flakes", outputMaterial: "Polyester Fiber" },
        { companyId: "c6", companyName: "EcoTextile", role: "Manufacturer", inputMaterial: "Polyester Fiber", outputMaterial: "Recycled Fabric" },
      ],
      confidenceScore: 0.82,
      estimatedSavings: 32000,
      estimatedCo2Reduction: 8500,
    },
    {
      chainId: "chain-3",
      chainName: "Agri-Energy-Fertilizer Loop",
      participants: [
        { companyId: "c7", companyName: "FarmFresh Inc.", role: "Waste Generator", inputMaterial: "Crops", outputMaterial: "Crop Residue" },
        { companyId: "c8", companyName: "BioGas Solutions", role: "Energy Producer", inputMaterial: "Crop Residue", outputMaterial: "Digestate" },
        { companyId: "c9", companyName: "GreenFert Co.", role: "End User", inputMaterial: "Digestate", outputMaterial: "Organic Fertilizer" },
      ],
      confidenceScore: 0.91,
      estimatedSavings: 28000,
      estimatedCo2Reduction: 15000,
    },
  ];
}

export function getMockAssistantResponse(message: string): string {
  const lowerMsg = message.toLowerCase();

  if (lowerMsg.includes("plastic")) {
    return "**Plastic Waste Management Tips:**\n\n1. **Sort by resin type** — Separate HDPE, PET, PP, and PVC for maximum recycling value.\n2. **Clean before listing** — Contamination reduces plastic waste value by 30-50%.\n3. **Consider mechanical recycling** — Most thermoplastics can be mechanically recycled 5-7 times.\n4. **Check local regulations** — Some jurisdictions require specific handling for certain plastic grades.\n\n**Market Insight:** Recycled HDPE is currently trading at $0.25-0.35/kg, up 12% from last quarter. Consider listing larger batches for better pricing.";
  }

  if (lowerMsg.includes("metal") || lowerMsg.includes("steel")) {
    return "**Metal Scrap Best Practices:**\n\n1. **Grade separation is key** — Mixed metals fetch significantly lower prices than sorted materials.\n2. **Remove contaminants** — Oil, paint, and coatings should be removed for ferrous scrap.\n3. **Monitor market prices** — Metal scrap prices fluctuate with commodity markets.\n4. **Consider volume** — Larger volumes (>5 tons) typically get 10-15% premium pricing.\n\n**Safety Note:** Always ensure proper handling for any metal waste with sharp edges or hazardous coatings.";
  }

  if (lowerMsg.includes("co2") || lowerMsg.includes("carbon") || lowerMsg.includes("emission")) {
    return "**Understanding Your Carbon Impact:**\n\nEvery ton of waste diverted from landfill through Waste2Worth saves approximately:\n- **Metal scrap:** 1.8 tons CO₂ per ton recycled\n- **Plastic:** 2.5 tons CO₂ per ton recycled  \n- **Textiles:** 3.2 tons CO₂ per ton reused\n- **E-waste:** 5.0 tons CO₂ per ton properly recycled\n\n**Tip:** Track your cumulative impact in the Analytics dashboard to generate ESG reports for your stakeholders.";
  }

  return "Thank you for your question! Here are some general waste management best practices:\n\n1. **Proper classification** — Always accurately describe your waste type and any hazardous properties.\n2. **Documentation** — Keep records of waste generation, handling, and transactions for regulatory compliance.\n3. **Pricing** — Use the AI value estimation tool when creating listings to set competitive prices.\n4. **Circular thinking** — Consider if your waste could be another company's raw material.\n\nFeel free to ask me specific questions about waste categories, regulations, environmental impact, or how to optimize your listings!";
}
