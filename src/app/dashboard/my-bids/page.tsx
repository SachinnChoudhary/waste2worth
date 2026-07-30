"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, Gavel, ExternalLink, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatDate, formatCurrency } from "@/lib/utils";

export default function MyBidsPage() {
  const [bids, setBids] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");

  useEffect(() => {
    fetchMyBids();
  }, []);

  const fetchMyBids = async () => {
    try {
      const res = await fetch("/api/bids/my-bids");
      const data = await res.json();
      if (data.success) {
        setBids(data.data || []);
      }
    } catch {
      toast.error("Failed to load your bids");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawBid = async (bidId: string) => {
    if (!confirm("Are you sure you want to withdraw this bid?")) return;
    try {
      const res = await fetch(`/api/bids/${bidId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "WITHDRAWN" }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Bid withdrawn");
        fetchMyBids();
      } else {
        toast.error(data.error || "Failed to withdraw bid");
      }
    } catch {
      toast.error("Failed to withdraw bid");
    }
  };

  const filteredBids = bids.filter((b) => {
    if (filterStatus === "ALL") return true;
    return b.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Submitted Bids</h1>
          <p className="text-sm text-slate-500 mt-1">
            Track and manage offers you have placed on waste listings
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap gap-2">
          {["ALL", "PENDING", "ACCEPTED", "REJECTED", "WITHDRAWN"].map((st) => (
            <Badge
              key={st}
              variant={filterStatus === st ? "default" : "outline"}
              className="cursor-pointer hover:bg-emerald-50 text-xs px-3 py-1"
              onClick={() => setFilterStatus(st)}
            >
              {st}
            </Badge>
          ))}
        </div>
      </div>

      {filteredBids.length > 0 ? (
        <div className="space-y-4">
          {filteredBids.map((bid) => (
            <Card key={bid.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-lg">
                        {bid.listing?.title || "Waste Listing"}
                      </h3>
                      <Link
                        href={`/dashboard/marketplace/${bid.listingId}`}
                        className="text-emerald-600 hover:text-emerald-700"
                        title="View Listing"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>

                    <p className="text-xs text-slate-500">
                      Seller: {bid.listing?.company?.name || "Supplier"} &bull; Placed on {formatDate(bid.createdAt)}
                    </p>

                    <div className="flex items-center gap-4 text-sm mt-2">
                      <span className="font-extrabold text-emerald-600 text-lg">
                        {formatCurrency(bid.bidAmount)}
                      </span>
                      <span className="text-xs text-slate-500">
                        Requested: <strong>{bid.quantityRequested} {bid.listing?.unit || "kg"}</strong>
                      </span>
                    </div>

                    {bid.message && (
                      <p className="text-xs text-slate-600 italic bg-slate-50 p-2 rounded border border-slate-100 max-w-xl">
                        &ldquo;{bid.message}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 self-start sm:self-center">
                    {bid.status === "PENDING" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => handleWithdrawBid(bid.id)}
                      >
                        <XCircle className="w-3.5 h-3.5" /> Withdraw
                      </Button>
                    )}

                    <Badge
                      variant={
                        bid.status === "ACCEPTED"
                          ? "success"
                          : bid.status === "PENDING"
                          ? "warning"
                          : "destructive"
                      }
                      className="px-3 py-1"
                    >
                      {bid.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !loading ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Gavel className="w-12 h-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No bids found</h3>
            <p className="text-sm text-slate-500 mb-4">
              {filterStatus === "ALL"
                ? "You haven't placed any bids on marketplace listings yet."
                : `No bids with status "${filterStatus}".`}
            </p>
            <Link href="/dashboard/marketplace">
              <Button className="bg-emerald-600 text-white">Browse Marketplace</Button>
            </Link>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
