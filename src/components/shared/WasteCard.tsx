"use client";

import Link from "next/link";
import { MapPin, Clock, Eye, Gavel, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency, wasteCategoryLabels, formatRelativeTime } from "@/lib/utils";

interface WasteCardProps {
  id: string;
  title: string;
  category: string;
  quantity: number;
  unit: string;
  location: string;
  priceExpectation?: number | null;
  aiEstimatedValue?: number | null;
  hazardClass: string;
  status: string;
  images: string[];
  aiTags: string[];
  viewCount?: number;
  bidCount?: number;
  createdAt: string;
  companyName?: string;
  href?: string;
}

const statusVariant: Record<string, "default" | "secondary" | "warning" | "success" | "destructive"> = {
  ACTIVE: "success",
  PENDING_REVIEW: "warning",
  DRAFT: "secondary",
  SOLD: "default",
  EXPIRED: "destructive",
  REMOVED: "destructive",
};

const categoryDefaultImages: Record<string, string> = {
  METAL_SCRAP: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80",
  PLASTIC: "https://images.unsplash.com/photo-1562077772-3bd90403f7f0?w=800&auto=format&fit=crop&q=80",
  TEXTILE_WASTE: "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=800&auto=format&fit=crop&q=80",
  CHEMICAL_BYPRODUCTS: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80",
  E_WASTE: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80",
  CONSTRUCTION_DEBRIS: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=800&auto=format&fit=crop&q=80",
  ORGANIC_AGRI: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80",
  WOOD: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80",
};

export function WasteCard({
  id,
  title,
  category,
  quantity,
  unit,
  location,
  priceExpectation,
  aiEstimatedValue,
  hazardClass,
  status,
  images,
  aiTags,
  viewCount = 0,
  bidCount = 0,
  createdAt,
  companyName,
  href,
}: WasteCardProps) {
  const cardHref = href || `/dashboard/marketplace/${id}`;
  const displayImage = images?.[0] || categoryDefaultImages[category] || "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80";

  return (
    <Link href={cardHref}>
      <div className="group rounded-xl border border-slate-200 bg-white overflow-hidden hover:shadow-xl hover:border-emerald-200 transition-all duration-300 hover:-translate-y-1">
        {/* Image */}
        <div className="relative h-44 bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden">
          <img
            src={displayImage}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge variant={statusVariant[status] || "secondary"}>
              {status.replace(/_/g, " ")}
            </Badge>
            {hazardClass !== "NONE" && (
              <Badge variant="destructive">⚠ Hazardous</Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-slate-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
              {title}
            </h3>
          </div>

          <Badge variant="outline" className="mb-3 text-xs">
            {wasteCategoryLabels[category] || category}
          </Badge>

          {companyName && (
            <p className="text-xs text-slate-500 mb-2">by {companyName}</p>
          )}

          <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {location}
            </span>
            <span>{quantity} {unit}</span>
          </div>

          {/* AI Tags */}
          {aiTags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {aiTags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Price & Stats */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div>
              {priceExpectation ? (
                <span className="text-lg font-bold text-emerald-600">
                  {formatCurrency(priceExpectation)}
                </span>
              ) : aiEstimatedValue ? (
                <span className="text-lg font-bold text-emerald-600">
                  ~{formatCurrency(aiEstimatedValue)}
                  <span className="text-xs font-normal text-slate-400 ml-1">est.</span>
                </span>
              ) : (
                <span className="text-sm text-slate-500">Open to offers</span>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" /> {viewCount}
              </span>
              <span className="flex items-center gap-1">
                <Gavel className="w-3 h-3" /> {bidCount}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {formatRelativeTime(createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
