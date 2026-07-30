"use client";

import { useState, useEffect } from "react";
import { Gavel, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatDate, formatCurrency } from "@/lib/utils";

export default function BidsReceivedPage() {
  const [bids, setBids] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBids();
  }, []);

  const fetchBids = async () => {
    try {
      const res = await fetch("/api/bids/received");
      const data = await res.json();
      if (data.success) setBids(data.data || []);
    } catch {
      // Empty state
    } finally {
      setLoading(false);
    }
  };

  const handleBidAction = async (bidId: string, status: string) => {
    try {
      const res = await fetch(`/api/bids/${bidId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Bid ${status.toLowerCase()}`);
        fetchBids();
      }
    } catch {
      toast.error("Failed to update bid");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Bids Received</h1>
        <p className="text-sm text-slate-500 mt-1">Manage incoming bids on your listings</p>
      </div>

      {bids.length > 0 ? (
        <div className="space-y-4">
          {bids.map((bid: Record<string, unknown>) => (
            <Card key={bid.id as string}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">
                      {((bid.buyerCompany as Record<string, unknown>)?.name as string) || "Unknown"}
                    </p>
                    <p className="text-sm text-slate-500">
                      on {((bid.listing as Record<string, unknown>)?.title as string) || ""}
                    </p>
                    <p className="text-lg font-bold text-emerald-600 mt-1">
                      {formatCurrency(bid.bidAmount as number)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {bid.status === "PENDING" && (
                      <>
                        <Button size="sm" onClick={() => handleBidAction(bid.id as string, "ACCEPTED")}>
                          <CheckCircle className="w-3 h-3" /> Accept
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleBidAction(bid.id as string, "REJECTED")}>
                          <XCircle className="w-3 h-3" /> Reject
                        </Button>
                      </>
                    )}
                    <Badge variant={bid.status === "PENDING" ? "warning" : bid.status === "ACCEPTED" ? "success" : "secondary"}>
                      {bid.status as string}
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
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No bids received yet</h3>
            <p className="text-sm text-slate-500">
              Bids will appear here when buyers are interested in your listings.
            </p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
