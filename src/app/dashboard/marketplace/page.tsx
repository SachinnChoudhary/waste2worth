"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, ShoppingCart, SlidersHorizontal, LayoutGrid, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WasteCard } from "@/components/shared/WasteCard";
import { wasteCategoryLabels } from "@/lib/utils";
import { toast } from "sonner";

export default function MarketplacePage() {
  const [listings, setListings] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (category !== "ALL") params.set("category", category);
      const res = await fetch(`/api/marketplace?${params}`);
      const data = await res.json();
      if (data.success) setListings(data.data);
    } catch {
      toast.error("Failed to load marketplace");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [category]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Waste Marketplace</h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse available waste materials from verified companies
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <Map className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search waste materials..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchListings()}
                className="pl-9"
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Categories</SelectItem>
                {Object.entries(wasteCategoryLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={fetchListings}>
              <SlidersHorizontal className="w-4 h-4" /> Apply
            </Button>
          </div>

          {/* Category quick filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {["ALL", "METAL_SCRAP", "PLASTIC", "E_WASTE", "TEXTILE_WASTE", "ORGANIC_AGRI", "CONSTRUCTION_DEBRIS"].map(
              (cat) => (
                <Badge
                  key={cat}
                  variant={category === cat ? "default" : "outline"}
                  className="cursor-pointer hover:bg-emerald-50"
                  onClick={() => setCategory(cat)}
                >
                  {cat === "ALL" ? "All" : wasteCategoryLabels[cat]}
                </Badge>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing: Record<string, unknown>) => (
            <WasteCard
              key={listing.id as string}
              id={listing.id as string}
              title={listing.title as string}
              category={listing.category as string}
              quantity={listing.quantity as number}
              unit={listing.unit as string}
              location={listing.location as string}
              priceExpectation={listing.priceExpectation as number | null}
              aiEstimatedValue={listing.aiEstimatedValue as number | null}
              hazardClass={listing.hazardClass as string}
              status={listing.status as string}
              images={listing.images as string[]}
              aiTags={listing.aiTags as string[]}
              viewCount={listing.viewCount as number}
              bidCount={((listing as Record<string, unknown>)._count as Record<string, number>)?.bids || 0}
              createdAt={(listing.createdAt as string)}
              companyName={(listing.company as Record<string, unknown>)?.name as string}
            />
          ))}
        </div>
      ) : !loading ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <ShoppingCart className="w-12 h-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No listings found</h3>
            <p className="text-sm text-slate-500">Try adjusting your filters or search terms.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-slate-200 bg-white overflow-hidden animate-pulse">
              <div className="h-44 bg-slate-100" />
              <div className="p-4 space-y-3">
                <div className="h-5 bg-slate-100 rounded w-3/4" />
                <div className="h-4 bg-slate-100 rounded w-1/2" />
                <div className="h-4 bg-slate-100 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
