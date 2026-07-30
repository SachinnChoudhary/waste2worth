"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Flag } from "lucide-react";
export default function AdminReportsPage() { return (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold text-slate-900">Reports & Tickets</h1>
    <Card><CardContent className="flex flex-col items-center justify-center py-16">
      <Flag className="w-12 h-12 text-slate-300 mb-4" />
      <h3 className="text-lg font-semibold text-slate-900 mb-2">Flagged Content</h3>
      <p className="text-sm text-slate-500">Review user reports and support tickets.</p>
    </CardContent></Card>
  </div>
); }
