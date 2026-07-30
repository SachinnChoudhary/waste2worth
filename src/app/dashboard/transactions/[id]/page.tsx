"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  HandshakeIcon,
  CheckCircle2,
  Clock,
  Printer,
  Star,
  Building2,
  Package,
  FileText,
  AlertTriangle,
  MessageSquare,
  Send,
  Leaf,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatCurrency, formatDate } from "@/lib/utils";

interface TransactionDetailProps {
  params: Promise<{ id: string }>;
}

export default function TransactionDetailPage({ params }: TransactionDetailProps) {
  const { id } = use(params);
  const [transaction, setTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Review Form
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchTransaction();
  }, [id]);

  const fetchTransaction = async () => {
    try {
      const res = await fetch(`/api/transactions/${id}`);
      const data = await res.json();
      if (data.success) {
        setTransaction(data.data);
      } else {
        toast.error(data.error || "Failed to load transaction");
      }
    } catch {
      toast.error("Error loading transaction");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Transaction marked as ${newStatus}`);
        fetchTransaction();
      } else {
        toast.error(data.error || "Failed to update transaction");
      }
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      const res = await fetch(`/api/transactions/${id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment: reviewComment }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Review submitted!");
        setReviewComment("");
        fetchTransaction();
      } else {
        toast.error(data.error || "Failed to submit review");
      }
    } catch {
      toast.error("Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="text-center py-16">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Transaction not found</h3>
        <Link href="/dashboard/transactions">
          <Button variant="outline"><ArrowLeft className="w-4 h-4" /> Back to Transactions</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/transactions">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <HandshakeIcon className="w-6 h-6 text-emerald-600" /> Transaction #{transaction.id.slice(-8)}
            </h1>
            <p className="text-xs text-slate-500">Initiated on {formatDate(transaction.createdAt)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="w-4 h-4" /> Print Receipt
          </Button>

          {transaction.status === "IN_PROGRESS" && (
            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => handleStatusUpdate("COMPLETED")}
              disabled={updating}
            >
              <CheckCircle2 className="w-4 h-4" /> Mark Completed
            </Button>
          )}

          <Badge
            variant={
              transaction.status === "COMPLETED"
                ? "success"
                : transaction.status === "IN_PROGRESS"
                ? "warning"
                : "destructive"
            }
            className="text-xs px-3 py-1"
          >
            {transaction.status}
          </Badge>
        </div>
      </div>

      {/* Progress Timeline */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between relative">
            <div className="flex flex-col items-center z-10">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                1
              </div>
              <span className="text-xs font-semibold text-slate-900 mt-2">Bid Accepted</span>
              <span className="text-[11px] text-slate-400">{formatDate(transaction.createdAt)}</span>
            </div>

            <div className="flex-1 h-1 bg-emerald-500 mx-2" />

            <div className="flex flex-col items-center z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md ${
                  transaction.status === "COMPLETED"
                    ? "bg-emerald-600 text-white"
                    : "bg-amber-500 text-white animate-pulse"
                }`}
              >
                2
              </div>
              <span className="text-xs font-semibold text-slate-900 mt-2">Transfer & Delivery</span>
              <span className="text-[11px] text-slate-400">
                {transaction.status === "COMPLETED" ? "Fulfilled" : "In Transit / Processing"}
              </span>
            </div>

            <div
              className={`flex-1 h-1 mx-2 ${
                transaction.status === "COMPLETED" ? "bg-emerald-500" : "bg-slate-200"
              }`}
            />

            <div className="flex flex-col items-center z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md ${
                  transaction.status === "COMPLETED"
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                3
              </div>
              <span className="text-xs font-semibold text-slate-900 mt-2">ESG Verification & Closed</span>
              <span className="text-[11px] text-slate-400">
                {transaction.completedAt ? formatDate(transaction.completedAt) : "Pending"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Digital Waste Transfer Certificate / Invoice Document */}
      <Card className="border-2 border-slate-300 shadow-lg bg-white print:border-none print:shadow-none">
        <CardHeader className="border-b bg-slate-50 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-lg">
                W2W
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  DIGITAL WASTE TRANSFER CERTIFICATE
                </h2>
                <p className="text-xs text-slate-500">CircuLink ESG & Circular Economy Manifest</p>
              </div>
            </div>
            <div className="text-right">
              <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-800 border-emerald-300">
                Verified On-Chain / ESG Audit Ready
              </Badge>
              <p className="text-xs text-slate-400 mt-1">Ref ID: {transaction.id}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Seller & Buyer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Seller (Waste Source)</p>
              <h4 className="font-extrabold text-slate-900 text-base">{transaction.sellerCompany?.name}</h4>
              <p className="text-xs text-slate-600">ID: {transaction.sellerCompany?.id}</p>
              <p className="text-xs text-slate-600 mt-1">Phone: {transaction.sellerCompany?.phone || "N/A"}</p>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Buyer (Recycler / Processor)</p>
              <h4 className="font-extrabold text-slate-900 text-base">{transaction.buyerCompany?.name}</h4>
              <p className="text-xs text-slate-600">ID: {transaction.buyerCompany?.id}</p>
              <p className="text-xs text-slate-600 mt-1">Phone: {transaction.buyerCompany?.phone || "N/A"}</p>
            </div>
          </div>

          {/* Material & Financial Details Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-700 border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-xs font-bold uppercase text-slate-600">
                  <th className="py-3 px-4">Item & Material Category</th>
                  <th className="py-3 px-4">Hazard Class</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4 text-right">Agreed Value</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="py-4 px-4 font-semibold text-slate-900">
                    {transaction.listing?.title}
                    <span className="block text-xs text-slate-500 font-normal">
                      Category: {transaction.listing?.category}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant={transaction.listing?.hazardClass === "NONE" ? "secondary" : "destructive"}>
                      {transaction.listing?.hazardClass || "NONE"}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 font-medium">
                    {transaction.quantity} {transaction.listing?.unit || "kg"}
                  </td>
                  <td className="py-4 px-4 text-right font-extrabold text-emerald-600 text-base">
                    {formatCurrency(transaction.finalAmount)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* CO2 & Environmental Impact Footprint */}
          <div className="p-4 rounded-xl bg-emerald-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Leaf className="w-8 h-8 text-emerald-400" />
              <div>
                <h4 className="font-bold text-sm">Scope 3 Emissions Diverted</h4>
                <p className="text-xs text-emerald-200">Certified reduction calculated via CircuLink Engine</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-emerald-300">
                ~{(transaction.quantity * 1.85).toFixed(0)} kg CO₂e
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Counterpart Review & Rating Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" /> Ratings & Partner Review
          </CardTitle>
          <CardDescription>Share feedback on logistics, material purity, and timeliness</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Submit Review Form */}
          <form onSubmit={handleSubmitReview} className="space-y-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-2">Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-amber-400 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
                    />
                  </button>
                ))}
                <span className="text-sm font-bold text-slate-700 ml-2">{rating} / 5 Stars</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Feedback Comment</label>
              <Textarea
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Describe material accuracy, prompt payment, or logistics handoff..."
                required
              />
            </div>

            <Button type="submit" disabled={submittingReview} className="bg-emerald-600 text-white">
              <Send className="w-4 h-4" /> {submittingReview ? "Submitting..." : "Submit Partner Review"}
            </Button>
          </form>

          {/* Previous Reviews */}
          {transaction.reviews?.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase">Reviews Recorded</h4>
              {transaction.reviews.map((rev: any) => (
                <div key={rev.id} className="p-3 rounded-lg bg-white border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">{rev.reviewer?.name}</span>
                    <span className="text-amber-500 font-bold">{"⭐".repeat(rev.rating)}</span>
                  </div>
                  {rev.comment && <p className="text-slate-600 italic">&ldquo;{rev.comment}&rdquo;</p>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
