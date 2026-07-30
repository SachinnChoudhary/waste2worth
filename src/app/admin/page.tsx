import { prisma } from "@/lib/prisma";
import {
  Building2,
  Package,
  HandshakeIcon,
  TrendingUp,
  Leaf,
  Users,
  AlertTriangle,
  DollarSign,
} from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils";

async function getAdminStats() {
  const [
    totalCompanies,
    pendingVerifications,
    activeListings,
    totalTransactions,
    completedTransactions,
    recentCompanies,
    recentListings,
    openReports,
  ] = await Promise.all([
    prisma.company.count(),
    prisma.company.count({ where: { verificationStatus: "PENDING" } }),
    prisma.wasteListing.count({ where: { status: "ACTIVE" } }),
    prisma.transaction.count(),
    prisma.transaction.count({ where: { status: "COMPLETED" } }),
    prisma.company.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, industrySector: true, verificationStatus: true, createdAt: true },
    }),
    prisma.wasteListing.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { company: { select: { name: true } } },
    }),
    prisma.report.count({ where: { status: "OPEN" } }),
  ]);

  // Calculate aggregate stats
  const wasteStats = await prisma.transaction.aggregate({
    where: { status: "COMPLETED" },
    _sum: { finalAmount: true, quantity: true },
  });

  return {
    totalCompanies,
    pendingVerifications,
    activeListings,
    totalTransactions,
    completedTransactions,
    totalRevenue: wasteStats._sum.finalAmount || 0,
    totalWasteDiverted: wasteStats._sum.quantity || 0,
    recentCompanies,
    recentListings,
    openReports,
  };
}

export default async function AdminDashboard() {
  const stats = await getAdminStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Platform overview and management</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Companies"
          value={stats.totalCompanies}
          icon={Building2}
          color="blue"
          change={12}
          changeLabel="this month"
        />
        <StatCard
          label="Active Listings"
          value={stats.activeListings}
          icon={Package}
          color="emerald"
          change={8}
          changeLabel="this month"
        />
        <StatCard
          label="Completed Deals"
          value={stats.completedTransactions}
          icon={HandshakeIcon}
          color="purple"
          change={15}
          changeLabel="this month"
        />
        <StatCard
          label="Waste Diverted"
          value={`${(stats.totalWasteDiverted / 1000).toFixed(1)}t`}
          icon={Leaf}
          color="emerald"
          change={22}
          changeLabel="this month"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Verifications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">
              Pending Verifications
              {stats.pendingVerifications > 0 && (
                <Badge variant="warning" className="ml-2">{stats.pendingVerifications}</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentCompanies.length > 0 ? (
              <div className="space-y-3">
                {stats.recentCompanies.map((company) => (
                  <div
                    key={company.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">{company.name}</p>
                      <p className="text-xs text-slate-500">{company.industrySector}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          company.verificationStatus === "APPROVED"
                            ? "success"
                            : company.verificationStatus === "PENDING"
                            ? "warning"
                            : "destructive"
                        }
                      >
                        {company.verificationStatus}
                      </Badge>
                      <span className="text-xs text-slate-400">
                        {formatRelativeTime(company.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center py-8">No recent companies</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Listings */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Listings</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentListings.length > 0 ? (
              <div className="space-y-3">
                {stats.recentListings.map((listing) => (
                  <div
                    key={listing.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{listing.title}</p>
                      <p className="text-xs text-slate-500">
                        by {listing.company.name} · {listing.quantity} {listing.unit}
                      </p>
                    </div>
                    <Badge variant={listing.status === "ACTIVE" ? "success" : "secondary"}>
                      {listing.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center py-8">No recent listings</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.openReports}</p>
              <p className="text-sm text-slate-500">Open Reports</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                ${(stats.totalRevenue / 1000).toFixed(0)}k
              </p>
              <p className="text-sm text-slate-500">Total Platform Revenue</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.pendingVerifications}</p>
              <p className="text-sm text-slate-500">Awaiting Verification</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
