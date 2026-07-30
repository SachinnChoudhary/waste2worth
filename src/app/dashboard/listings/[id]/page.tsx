"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Package,
  Gavel,
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  Sparkles,
  Trash2,
  Save,
  Tag,
  AlertTriangle,
  Leaf,
  DollarSign,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { formatCurrency, formatDate, wasteCategoryLabels, hazardClassLabels } from "@/lib/utils";

interface ListingDetailProps {
  params: Promise<{ id: string }>;
}

export default function ListingDetailPage({ params }: ListingDetailProps) {
  const { id } = use(params);
  const router = useRouter();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Editable form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [priceExpectation, setPriceExpectation] = useState("");
  const [status, setStatus] = useState("ACTIVE");

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      const res = await fetch(`/api/listings/${id}`);
      const data = await res.json();
      if (data.success) {
        setListing(data.data);
        setTitle(data.data.title || "");
        setDescription(data.data.description || "");
        setQuantity(data.data.quantity ? String(data.data.quantity) : "");
        setPriceExpectation(data.data.priceExpectation ? String(data.data.priceExpectation) : "");
        setStatus(data.data.status || "ACTIVE");
      } else {
        toast.error(data.error || "Failed to load listing");
      }
    } catch {
      toast.error("An error occurred while loading the listing");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/listings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          quantity: parseFloat(quantity) || listing.quantity,
          priceExpectation: priceExpectation ? parseFloat(priceExpectation) : null,
          status,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Listing updated successfully");
        fetchListing();
      } else {
        toast.error(data.error || "Failed to update listing");
      }
    } catch {
      toast.error("Failed to update listing");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to remove this listing?")) return;
    try {
      const res = await fetch(`/api/listings/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Listing removed");
        router.push("/dashboard/listings");
      }
    } catch {
      toast.error("Failed to remove listing");
    }
  };

  const handleBidAction = async (bidId: string, actionStatus: string) => {
    try {
      const res = await fetch(`/api/bids/${bidId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: actionStatus }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Bid ${actionStatus.toLowerCase()}`);
        fetchListing();
      } else {
        toast.error(data.error || "Failed to update bid");
      }
    } catch {
      toast.error("Failed to update bid");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="text-center py-16">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Listing not found</h3>
        <Link href="/dashboard/listings">
          <Button variant="outline"><ArrowLeft className="w-4 h-4" /> Back to Listings</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/listings">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{listing.title}</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Listed on {formatDate(listing.createdAt)} &bull; {listing.viewCount} views
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant={
              listing.status === "ACTIVE"
                ? "success"
                : listing.status === "SOLD"
                ? "default"
                : "secondary"
            }
            className="text-xs px-3 py-1"
          >
            {listing.status}
          </Badge>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 className="w-4 h-4" /> Remove
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form & Image Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gallery / Image */}
          <Card className="overflow-hidden">
            <div className="relative h-64 bg-slate-100 flex items-center justify-center">
              {listing.images?.[0] ? (
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400">
                  <Package className="w-16 h-16 mb-2" />
                  <span className="text-sm">No photo uploaded</span>
                </div>
              )}
            </div>
          </Card>

          {/* Edit Form */}
          <Card>
            <CardHeader>
              <CardTitle>Edit Listing Information</CardTitle>
              <CardDescription>Update prices, quantity, or current status</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="quantity">Quantity ({listing.unit})</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="price">Price Expectation (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={priceExpectation}
                      onChange={(e) => setPriceExpectation(e.target.value)}
                      placeholder="Optional"
                    />
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                        <SelectItem value="DRAFT">DRAFT</SelectItem>
                        <SelectItem value="SOLD">SOLD</SelectItem>
                        <SelectItem value="EXPIRED">EXPIRED</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button type="submit" disabled={saving}>
                    <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Bids Received Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Gavel className="w-5 h-5 text-emerald-600" /> Bids Received ({listing.bids?.length || 0})
                </CardTitle>
                <CardDescription>Review and accept offers from buyers</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {listing.bids && listing.bids.length > 0 ? (
                <div className="space-y-4">
                  {listing.bids.map((bid: any) => (
                    <div
                      key={bid.id}
                      className="p-4 rounded-lg border border-slate-200 bg-white space-y-2 flex flex-col sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-slate-500" />
                          <span className="font-semibold text-slate-900">
                            {bid.buyerCompany?.name || "Interested Buyer"}
                          </span>
                          {bid.buyerCompany?.rating && (
                            <Badge variant="outline" className="text-xs">
                              ⭐ {bid.buyerCompany.rating}
                            </Badge>
                          )}
                        </div>
                        <p className="text-lg font-bold text-emerald-600 mt-1">
                          {formatCurrency(bid.bidAmount)}
                          <span className="text-xs font-normal text-slate-500 ml-1">
                            for {bid.quantityRequested} {listing.unit}
                          </span>
                        </p>
                        {bid.message && (
                          <p className="text-xs text-slate-600 italic mt-1">&ldquo;{bid.message}&rdquo;</p>
                        )}
                        <p className="text-[11px] text-slate-400 mt-1">{formatDate(bid.createdAt)}</p>
                      </div>

                      <div className="flex items-center gap-2 mt-3 sm:mt-0">
                        {bid.status === "PENDING" && (
                          <>
                            <Button
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700 text-white"
                              onClick={() => handleBidAction(bid.id, "ACCEPTED")}
                            >
                              <CheckCircle className="w-4 h-4" /> Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => handleBidAction(bid.id, "REJECTED")}
                            >
                              <XCircle className="w-4 h-4" /> Reject
                            </Button>
                          </>
                        )}
                        <Badge
                          variant={
                            bid.status === "ACCEPTED"
                              ? "success"
                              : bid.status === "REJECTED"
                              ? "destructive"
                              : "warning"
                          }
                        >
                          {bid.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <Gavel className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm">No bids placed on this listing yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Column (AI Insights & Material Specifications) */}
        <div className="space-y-6">
          {/* AI Insights Card */}
          <Card className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white border-0">
            <CardHeader>
              <CardTitle className="text-emerald-400 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" /> AI Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-slate-400">Estimated Fair Market Value</p>
                <p className="text-2xl font-bold text-white">
                  {listing.aiEstimatedValue ? formatCurrency(listing.aiEstimatedValue) : "Valuating..."}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <Leaf className="w-3.5 h-3.5 text-emerald-400" /> Estimated CO₂ Avoidance
                </p>
                <p className="text-lg font-semibold text-emerald-300">
                  {listing.aiEstimatedCo2Savings
                    ? `${listing.aiEstimatedCo2Savings} kg CO₂e`
                    : `${(listing.quantity * 1.85).toFixed(0)} kg CO₂e`}
                </p>
              </div>

              {listing.aiSuggestedIndustries?.length > 0 && (
                <div className="pt-3 border-t border-slate-800">
                  <p className="text-xs text-slate-400 mb-2">High Demand Buyer Industries</p>
                  <div className="flex flex-wrap gap-1.5">
                    {listing.aiSuggestedIndustries.map((ind: string) => (
                      <span
                        key={ind}
                        className="text-xs px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-medium"
                      >
                        {ind}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Material Passport Specifications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Tag className="w-4 h-4 text-slate-500" /> Material Specification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              <div className="flex justify-between py-1 border-b">
                <span className="text-slate-500">Category</span>
                <span className="font-medium text-slate-900">
                  {wasteCategoryLabels[listing.category] || listing.category}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-slate-500">Hazard Class</span>
                <span className="font-medium text-slate-900">
                  {hazardClassLabels[listing.hazardClass] || listing.hazardClass}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-slate-500">Location</span>
                <span className="font-medium text-slate-900">{listing.location}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-slate-500">Recurring Supply</span>
                <span className="font-medium text-slate-900">
                  {listing.isRecurring ? "Yes (Periodic)" : "One-time batch"}
                </span>
              </div>

              {listing.aiTags?.length > 0 && (
                <div className="pt-2">
                  <p className="text-xs text-slate-500 mb-1.5">AI Tags</p>
                  <div className="flex flex-wrap gap-1">
                    {listing.aiTags.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="text-[11px]">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
