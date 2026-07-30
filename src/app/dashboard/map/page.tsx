"use client";
import { MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function MapPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Supplier & Buyer Map</h1>
        <p className="text-sm text-slate-500 mt-1">Discover nearby companies and listings</p>
      </div>
      <Card className="h-[calc(100vh-240px)]">
        <CardContent className="flex flex-col items-center justify-center h-full">
          <div className="w-full h-full rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 flex flex-col items-center justify-center">
            <MapPin className="w-16 h-16 text-emerald-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Interactive Map</h3>
            <p className="text-sm text-slate-500 text-center max-w-md">
              The interactive map view with Leaflet integration will display companies and listings
              with cluster markers, filters, and click-to-preview cards.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
