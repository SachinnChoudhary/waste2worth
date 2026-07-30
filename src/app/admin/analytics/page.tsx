"use client";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
export default function AdminAnalyticsPage() { return (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold text-slate-900">Platform Analytics</h1>
    <Card><CardContent className="flex flex-col items-center justify-center py-16">
      <BarChart3 className="w-12 h-12 text-slate-300 mb-4" />
      <h3 className="text-lg font-semibold text-slate-900 mb-2">Platform-wide analytics</h3>
      <p className="text-sm text-slate-500">Revenue trends, sector-wise waste flow, regional heatmap, and more.</p>
    </CardContent></Card>
  </div>
); }
