"use client";
import { FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function MyBidsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Bids</h1>
        <p className="text-sm text-slate-500 mt-1">Track bids you&apos;ve placed on marketplace listings</p>
      </div>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <FileText className="w-12 h-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No bids placed yet</h3>
          <p className="text-sm text-slate-500">Browse the marketplace and place bids on listings.</p>
        </CardContent>
      </Card>
    </div>
  );
}
