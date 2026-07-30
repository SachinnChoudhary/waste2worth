"use client";

import {
  BarChart3,
  Leaf,
  DollarSign,
  Package,
  TrendingUp,
  Recycle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/shared/StatCard";

export default function AnalyticsPage() {
  // Demo analytics data
  const monthlyData = [
    { month: "Jan", wasteDiverted: 1200, revenue: 8500, co2Saved: 2100 },
    { month: "Feb", wasteDiverted: 1800, revenue: 12000, co2Saved: 3200 },
    { month: "Mar", wasteDiverted: 2200, revenue: 15500, co2Saved: 3900 },
    { month: "Apr", wasteDiverted: 1900, revenue: 13200, co2Saved: 3400 },
    { month: "May", wasteDiverted: 2800, revenue: 19800, co2Saved: 5000 },
    { month: "Jun", wasteDiverted: 3500, revenue: 24500, co2Saved: 6300 },
  ];

  const categoryBreakdown = [
    { category: "Metal Scrap", percentage: 35, color: "#6366f1" },
    { category: "Plastic", percentage: 25, color: "#f59e0b" },
    { category: "E-Waste", percentage: 15, color: "#8b5cf6" },
    { category: "Textile", percentage: 12, color: "#ec4899" },
    { category: "Organic", percentage: 8, color: "#22c55e" },
    { category: "Other", percentage: 5, color: "#94a3b8" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Analytics Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          Track your sustainability impact and business performance
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Waste Diverted" value="13.4t" icon={Recycle} color="emerald" change={28} changeLabel="vs last quarter" />
        <StatCard label="Revenue Earned" value="₹93,500" icon={DollarSign} color="blue" change={15} changeLabel="vs last quarter" />
        <StatCard label="CO₂ Saved" value="23.9t" icon={Leaf} color="cyan" change={32} changeLabel="vs last quarter" />
        <StatCard label="Active Listings" value="12" icon={Package} color="purple" change={8} changeLabel="vs last month" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trends */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Monthly Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((month) => (
                <div key={month.month} className="flex items-center gap-4">
                  <span className="w-8 text-sm font-medium text-slate-600">{month.month}</span>
                  <div className="flex-1 flex gap-2">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-500">Waste ({month.wasteDiverted}kg)</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all"
                          style={{ width: `${(month.wasteDiverted / 4000) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-500">Revenue (₹{(month.revenue / 1000).toFixed(1)}k)</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all"
                          style={{ width: `${(month.revenue / 30000) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-500" />
              Category Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categoryBreakdown.map((cat) => (
                <div key={cat.category}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-700">{cat.category}</span>
                    <span className="text-sm font-medium text-slate-900">{cat.percentage}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${cat.percentage}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Impact Summary */}
      <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <Leaf className="w-6 h-6 text-emerald-600" />
            <h3 className="text-lg font-semibold text-slate-900">
              Your Sustainability Impact Report
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-600">13.4t</p>
              <p className="text-sm text-slate-600">Waste diverted from landfill</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-cyan-600">23.9t</p>
              <p className="text-sm text-slate-600">CO₂ emissions avoided</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">6,700m³</p>
              <p className="text-sm text-slate-600">Water saved</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">30,820kWh</p>
              <p className="text-sm text-slate-600">Energy saved</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
