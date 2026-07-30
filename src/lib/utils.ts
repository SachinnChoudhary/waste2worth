import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatWeight(kg: number): string {
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(1)} tons`;
  }
  return `${kg.toFixed(0)} kg`;
}

export function formatCo2(kg: number): string {
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(1)} t CO₂`;
  }
  return `${kg.toFixed(0)} kg CO₂`;
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return formatDate(date);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const wasteCategoryLabels: Record<string, string> = {
  METAL_SCRAP: "Metal Scrap",
  PLASTIC: "Plastic",
  CHEMICAL_BYPRODUCTS: "Chemical Byproducts",
  TEXTILE_WASTE: "Textile Waste",
  E_WASTE: "E-Waste",
  ORGANIC_AGRI: "Organic / Agriculture",
  CONSTRUCTION_DEBRIS: "Construction Debris",
  PAPER_CARDBOARD: "Paper & Cardboard",
  GLASS: "Glass",
  RUBBER: "Rubber",
  WOOD: "Wood",
  OIL_LUBRICANTS: "Oil & Lubricants",
  OTHER: "Other",
};

export const hazardClassLabels: Record<string, string> = {
  NONE: "Non-Hazardous",
  CLASS_1: "Class 1 - Explosives",
  CLASS_2: "Class 2 - Gases",
  CLASS_3: "Class 3 - Flammable Liquids",
  CLASS_4: "Class 4 - Flammable Solids",
  CLASS_5: "Class 5 - Oxidizers",
  CLASS_6: "Class 6 - Toxic Substances",
  CLASS_7: "Class 7 - Radioactive",
  CLASS_8: "Class 8 - Corrosives",
  CLASS_9: "Class 9 - Misc. Dangerous",
};

export const wasteCategoryColors: Record<string, string> = {
  METAL_SCRAP: "#6366f1",
  PLASTIC: "#f59e0b",
  CHEMICAL_BYPRODUCTS: "#ef4444",
  TEXTILE_WASTE: "#ec4899",
  E_WASTE: "#8b5cf6",
  ORGANIC_AGRI: "#22c55e",
  CONSTRUCTION_DEBRIS: "#78716c",
  PAPER_CARDBOARD: "#d97706",
  GLASS: "#06b6d4",
  RUBBER: "#1e293b",
  WOOD: "#a16207",
  OIL_LUBRICANTS: "#334155",
  OTHER: "#94a3b8",
};
