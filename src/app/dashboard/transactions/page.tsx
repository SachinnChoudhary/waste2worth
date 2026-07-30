"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { HandshakeIcon, ArrowRight, DollarSign, Package, Leaf } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await fetch("/api/transactions");
      const data = await res.json();
      if (data.success) {
        setTransactions(data.data || []);
      }
    } catch {
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const filtered = transactions.filter((tx) => {
    if (statusFilter === "ALL") return true;
    return tx.status === statusFilter;
  });

  const totalValue = transactions.reduce((sum, tx) => sum + (tx.finalAmount || 0), 0);
  const totalVolume = transactions.reduce((sum, tx) => sum + (tx.quantity || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Transactions & Transfers</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage active and completed circular waste transactions
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-2">
          {["ALL", "IN_PROGRESS", "COMPLETED", "CANCELLED", "DISPUTED"].map((st) => (
            <Badge
              key={st}
              variant={statusFilter === st ? "default" : "outline"}
              className="cursor-pointer hover:bg-emerald-50 text-xs px-3 py-1"
              onClick={() => setStatusFilter(st)}
            >
              {st}
            </Badge>
          ))}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Total Transaction Value</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{formatCurrency(totalValue)}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Total Waste Volume Diverted</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{totalVolume.toLocaleString()} kg</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Est. CO₂ Avoidance</p>
              <h3 className="text-2xl font-extrabold text-emerald-700 mt-1">
                {(totalVolume * 1.85 / 1000).toFixed(1)} metric tons
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Leaf className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions List */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((tx) => (
            <Card key={tx.id} className="hover:border-emerald-200 transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <HandshakeIcon className="w-5 h-5 text-emerald-600" />
                      <h3 className="font-bold text-slate-900 text-base">
                        {tx.listing?.title || "Industrial Waste Deal"}
                      </h3>
                      <Badge
                        variant={
                          tx.status === "COMPLETED"
                            ? "success"
                            : tx.status === "IN_PROGRESS"
                            ? "warning"
                            : "destructive"
                        }
                      >
                        {tx.status}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-500 pl-8">
                      Seller: <strong>{tx.sellerCompany?.name}</strong> &bull; Buyer: <strong>{tx.buyerCompany?.name}</strong>
                    </p>

                    <div className="flex items-center gap-6 text-sm pl-8 pt-1">
                      <span className="font-bold text-emerald-600">{formatCurrency(tx.finalAmount)}</span>
                      <span className="text-slate-600">{tx.quantity} {tx.listing?.unit || "kg"}</span>
                      <span className="text-xs text-slate-400">Created: {formatDate(tx.createdAt)}</span>
                    </div>
                  </div>

                  <Link href={`/dashboard/transactions/${tx.id}`}>
                    <Button variant="outline" size="sm" className="gap-2">
                      View Manifest <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !loading ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <HandshakeIcon className="w-12 h-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No transactions found</h3>
            <p className="text-sm text-slate-500">
              Transactions are created automatically when bids are accepted on listings.
            </p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
