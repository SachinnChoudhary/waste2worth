"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Search, Filter, Package, ArrowRight, Tag, ShieldCheck, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { wasteCategoryLabels, formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

export default function MapPage() {
  const [listings, setListings] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [search, setSearch] = useState("");
  const [activePin, setActivePin] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const res = await fetch("/api/marketplace");
      const data = await res.json();
      if (data.success) {
        setListings(data.data || []);
        if (data.data?.length > 0) setActivePin(data.data[0]);
      }
    } catch {
      toast.error("Failed to load map data");
    } finally {
      setLoading(false);
    }
  };

  const filteredListings = listings.filter((l) => {
    const matchesCat = selectedCategory === "ALL" || l.category === selectedCategory;
    const matchesSearch =
      !search ||
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.location.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-emerald-600" />
            Supplier & Waste Marketplace Map
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Geographic visualization of available industrial waste lots and partner facilities
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search location or waste..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-44 h-9 text-xs">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Categories</SelectItem>
              {Object.entries(wasteCategoryLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Container */}
        <Card className="lg:col-span-2 overflow-hidden border border-slate-200 shadow-md">
          <div className="relative h-[550px] bg-slate-900 overflow-hidden flex flex-col justify-between p-6">
            {/* Visual Map Backdrop */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40 pointer-events-none" />

            {/* Simulated Geographic Pins Grid */}
            <div className="relative z-10 grid grid-cols-3 sm:grid-cols-4 gap-6 p-4 my-auto">
              {filteredListings.map((listing, idx) => {
                const isSelected = activePin?.id === listing.id;
                return (
                  <button
                    key={listing.id}
                    onClick={() => setActivePin(listing)}
                    className={`group relative p-3 rounded-xl border transition-all duration-300 text-left flex flex-col justify-between ${
                      isSelected
                        ? "bg-emerald-600 border-emerald-400 text-white shadow-xl scale-105"
                        : "bg-slate-800/80 border-slate-700/80 text-slate-200 hover:bg-slate-700/90 hover:scale-102"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <MapPin
                        className={`w-5 h-5 ${
                          isSelected ? "text-amber-300 animate-bounce" : "text-emerald-400"
                        }`}
                      />
                      <Badge
                        variant={isSelected ? "secondary" : "outline"}
                        className="text-[10px] uppercase font-bold"
                      >
                        {listing.category.slice(0, 8)}
                      </Badge>
                    </div>

                    <h4 className="font-semibold text-xs line-clamp-1">{listing.title}</h4>
                    <p className="text-[11px] opacity-80 mt-1">{listing.location}</p>
                  </button>
                );
              })}

              {filteredListings.length === 0 && (
                <div className="col-span-full text-center py-20 text-slate-400">
                  <MapPin className="w-12 h-12 text-slate-600 mx-auto mb-2 opacity-50" />
                  <p>No listings match your search or filter.</p>
                </div>
              )}
            </div>

            {/* Map Legend */}
            <div className="relative z-10 flex items-center justify-between pt-4 border-t border-slate-800 text-xs text-slate-400">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Active Supply Hubs
              </span>
              <span>Showing {filteredListings.length} Geolocated Waste Streams</span>
            </div>
          </div>
        </Card>

        {/* Selected Pin Preview Drawer Card */}
        <Card className="h-full flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="w-4 h-4 text-emerald-600" /> Location & Material Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
            {activePin ? (
              <div className="space-y-4">
                <div className="h-40 rounded-xl bg-slate-100 overflow-hidden relative border">
                  {activePin.images?.[0] ? (
                    <img
                      src={activePin.images[0]}
                      alt={activePin.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <Tag className="w-10 h-10" />
                    </div>
                  )}
                  <Badge variant="success" className="absolute top-2 left-2 text-xs">
                    {activePin.status}
                  </Badge>
                </div>

                <div>
                  <Badge variant="outline" className="text-xs mb-1">
                    {wasteCategoryLabels[activePin.category] || activePin.category}
                  </Badge>
                  <h3 className="font-extrabold text-slate-900 text-lg">{activePin.title}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {activePin.location}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Quantity:</span>
                    <strong className="text-slate-900">{activePin.quantity} {activePin.unit}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Target Price:</span>
                    <strong className="text-emerald-600">
                      {activePin.priceExpectation ? formatCurrency(activePin.priceExpectation) : "Open"}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Supplier:</span>
                    <strong className="text-slate-900">{activePin.company?.name || "Verified Supplier"}</strong>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {activePin.description}
                </p>

                <Link href={`/dashboard/marketplace/${activePin.id}`} className="block pt-2">
                  <Button className="w-full bg-emerald-600 text-white gap-2">
                    View Full Material Passport <ExternalLink className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-20 text-slate-400">
                <p>Click on any pin on the map to inspect details.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
