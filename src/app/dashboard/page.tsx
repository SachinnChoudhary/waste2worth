import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
  Package,
  ShoppingCart,
  Gavel,
  HandshakeIcon,
  TrendingUp,
  Leaf,
  DollarSign,
  Zap,
} from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WasteCard } from "@/components/shared/WasteCard";
import Link from "next/link";
import { formatRelativeTime, wasteCategoryLabels } from "@/lib/utils";

async function getCompanyDashboardData(companyId: string) {
  const [
    activeListings,
    totalListings,
    bidsReceived,
    bidsPlaced,
    completedTransactions,
    recentListings,
    recentBids,
    notifications,
  ] = await Promise.all([
    prisma.wasteListing.count({ where: { companyId, status: "ACTIVE" } }),
    prisma.wasteListing.count({ where: { companyId } }),
    prisma.bid.count({
      where: {
        listing: { companyId },
        status: "PENDING",
      },
    }),
    prisma.bid.count({ where: { buyerCompanyId: companyId } }),
    prisma.transaction.count({
      where: {
        OR: [{ sellerCompanyId: companyId }, { buyerCompanyId: companyId }],
        status: "COMPLETED",
      },
    }),
    prisma.wasteListing.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.bid.findMany({
      where: { listing: { companyId }, status: "PENDING" },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        listing: { select: { title: true } },
        buyerCompany: { select: { name: true } },
      },
    }),
    prisma.notification.findMany({
      where: { userId: { not: undefined }, isRead: false },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const transactionStats = await prisma.transaction.aggregate({
    where: {
      OR: [{ sellerCompanyId: companyId }, { buyerCompanyId: companyId }],
      status: "COMPLETED",
    },
    _sum: { finalAmount: true, quantity: true },
  });

  // Get recommended listings from marketplace (simplified - just get recent active ones)
  const recommendedListings = await prisma.wasteListing.findMany({
    where: {
      status: "ACTIVE",
      companyId: { not: companyId },
    },
    orderBy: { createdAt: "desc" },
    take: 4,
    include: { company: { select: { name: true } } },
  });

  return {
    activeListings,
    totalListings,
    bidsReceived,
    bidsPlaced,
    completedTransactions,
    totalRevenue: transactionStats._sum.finalAmount || 0,
    totalWasteDiverted: transactionStats._sum.quantity || 0,
    recentListings,
    recentBids,
    recommendedListings,
    notifications,
  };
}

export default async function CompanyDashboard() {
  const session = await auth();
  if (!session?.user?.companyId) redirect("/login");

  const data = await getCompanyDashboardData(session.user.companyId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Welcome back! Here&apos;s your overview.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/listings/new">
            <Button>
              <Package className="w-4 h-4" /> List New Waste
            </Button>
          </Link>
          <Link href="/dashboard/marketplace">
            <Button variant="outline">
              <ShoppingCart className="w-4 h-4" /> Browse Marketplace
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active Listings"
          value={data.activeListings}
          icon={Package}
          color="emerald"
        />
        <StatCard
          label="Pending Bids"
          value={data.bidsReceived}
          icon={Gavel}
          color="amber"
        />
        <StatCard
          label="Completed Deals"
          value={data.completedTransactions}
          icon={HandshakeIcon}
          color="purple"
        />
        <StatCard
          label="CO₂ Saved"
          value={`${(data.totalWasteDiverted * 0.3 / 1000).toFixed(1)}t`}
          icon={Leaf}
          color="cyan"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bids Received */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Incoming Bids</CardTitle>
            {data.bidsReceived > 0 && (
              <Badge variant="warning">{data.bidsReceived} pending</Badge>
            )}
          </CardHeader>
          <CardContent>
            {data.recentBids.length > 0 ? (
              <div className="space-y-3">
                {data.recentBids.map((bid) => (
                  <div
                    key={bid.id}
                    className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {bid.buyerCompany.name}
                      </p>
                      <span className="text-sm font-bold text-emerald-600">
                        ${bid.bidAmount.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">
                      on {bid.listing.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {formatRelativeTime(bid.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Gavel className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No pending bids yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recommended Listings */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <CardTitle className="text-base">AI Recommended for You</CardTitle>
            </div>
            <Link href="/dashboard/marketplace">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {data.recommendedListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.recommendedListings.map((listing) => (
                  <WasteCard
                    key={listing.id}
                    id={listing.id}
                    title={listing.title}
                    category={listing.category}
                    quantity={listing.quantity}
                    unit={listing.unit}
                    location={listing.location}
                    priceExpectation={listing.priceExpectation}
                    aiEstimatedValue={listing.aiEstimatedValue}
                    hazardClass={listing.hazardClass}
                    status={listing.status}
                    images={listing.images}
                    aiTags={listing.aiTags}
                    viewCount={listing.viewCount}
                    createdAt={listing.createdAt.toISOString()}
                    companyName={listing.company.name}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ShoppingCart className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No recommendations yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
