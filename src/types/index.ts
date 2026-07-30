import { UserRole, CompanyType, VerificationStatus } from "@prisma/client";

// Extend NextAuth types to include our custom fields
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: UserRole;
      companyId: string | null;
      companyVerified: boolean;
      image?: string | null;
    };
  }

  interface User {
    role: UserRole;
    companyId: string | null;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    companyId: string | null;
    companyVerified: boolean;
  }
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Dashboard stat types
export interface DashboardStat {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: string;
  color?: string;
}

// AI Analysis types
export interface AIClassification {
  category: string;
  subCategory: string;
  hazardClass: string;
  confidence: number;
  tags: string[];
}

export interface AIValueEstimate {
  estimatedValue: { min: number; max: number };
  historicalComparisons: Array<{
    description: string;
    price: number;
    date: string;
  }>;
  disposalCostAvoided: number;
}

export interface AIEnvironmentalImpact {
  co2Avoided: number;
  landfillDiverted: number;
  waterSaved?: number;
  energySaved?: number;
}

export interface AIIndustryRecommendation {
  industry: string;
  relevanceScore: number;
  reasoning: string;
  potentialCompanies?: number;
}

export interface AICollaborationChain {
  chainId: string;
  chainName: string;
  participants: Array<{
    companyId: string;
    companyName: string;
    role: string;
    inputMaterial: string;
    outputMaterial: string;
  }>;
  confidenceScore: number;
  estimatedSavings: number;
  estimatedCo2Reduction: number;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

// Filter types
export interface ListingFilters {
  category?: string;
  status?: string;
  hazardClass?: string;
  minQuantity?: number;
  maxQuantity?: number;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  radius?: number;
  lat?: number;
  lng?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface CompanyFilters {
  type?: string;
  verificationStatus?: string;
  industrySector?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}
