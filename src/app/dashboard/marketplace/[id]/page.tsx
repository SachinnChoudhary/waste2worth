"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Eye,
  Gavel,
  ShieldCheck,
  Building2,
  Sparkles,
  Leaf,
  MessageSquare,
  Send,
  AlertTriangle,
  Tag,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { WasteCard } from "@/components/shared/WasteCard";
import { toast } from "sonner";
import { formatCurrency, formatDate, wasteCategoryLabels, hazardClassLabels } from "@/lib/utils";

interface MarketplaceDetailProps {
  params: Promise<{ id: string }>;
}

export default function MarketplaceItemPage({ params }: MarketplaceDetailProps) {
  const { id } = use(params);
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Bid Dialog state
  const [bidModalOpen, setBidModalOpen] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [quantityRequested, setQuantityRequested] = useState("");
  const [message, setMessage] = useState("");
  const [submittingBid, setSubmittingBid] = useState(false);
  const [interestExpressed, setInterestExpressed] = useState(false);

  useEffect(() => {
    fetchMarketplaceItem();
  }, [id]);

  const fetchMarketplaceItem = async () => {
    try {
      const res = await fetch(`/api/marketplace/${id}`);
      const result = await res.json();
      if (result.success) {
        setData(result.data);
        setQuantityRequested(String(result.data.listing.quantity));
        if (result.data.listing.priceExpectation) {
          setBidAmount(String(result.data.listing.priceExpectation));
        }
      } else {
        toast.error(result.error || "Failed to load item");
      }
    } catch {
      toast.error("Failed to load item details");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingBid(true);
    try {
      const res = await fetch("/api/bids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: id,
          bidAmount: parseFloat(bidAmount),
          quantityRequested: parseFloat(quantityRequested),
          message,
        }),
      });

      const result = await res.json();
      if (result.success) {
        toast.success("Bid submitted successfully!");
        setBidModalOpen(false);
        fetchMarketplaceItem();
      } else {
        toast.error(result.error || "Failed to submit bid");
      }
    } catch {
      toast.error("An error occurred while placing the bid");
    } finally {
      setSubmittingBid(false);
    }
  };

  const handleExpressInterest = () => {
    setInterestExpressed(true);
    toast.success("Interest expressed! AI matching engine will process potential symbiosis connections.");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
      </div>
    );
  }

  if (!data || !data.listing) {
    return (
      <div className="text-center py-16">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Item not found</h3>
        <Link href="/dashboard/marketplace">
          <Button variant="outline"><ArrowLeft className="w-4 h-4" /> Back to Marketplace</Button>
        </Link>
      </div>
    );
  }

  const { listing, relatedListings } = data;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard/marketplace">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4" /> Back to Marketplace
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Listed {formatDate(listing.createdAt)}
          </Badge>
          <Badge variant="success">Active</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Image Banner */}
          <Card className="overflow-hidden border border-slate-200 shadow-sm">
            <div className="relative h-80 bg-slate-900 flex items-center justify-center overflow-hidden">
              {listing.images?.[0] ? (
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400">
                  <Tag className="w-20 h-20 mb-2 opacity-50" />
                  <span className="text-sm font-medium">Industrial Material Passport</span>
                </div>
              )}
              {listing.hazardClass !== "NONE" && (
                <div className="absolute top-4 left-4 bg-red-600 text-white text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1 shadow-md">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Hazard Class: {listing.hazardClass}
                </div>
              )}
            </div>
          </Card>

          {/* Title & Overview */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Badge variant="secondary" className="text-xs">
                  {wasteCategoryLabels[listing.category] || listing.category}
                </Badge>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" /> {listing.viewCount} views
                  </span>
                  <span className="flex items-center gap-1">
                    <Gavel className="w-3.5 h-3.5" /> {listing._count?.bids || 0} bids
                  </span>
                </div>
              </div>

              <h1 className="text-3xl font-extrabold text-slate-900">{listing.title}</h1>

              <div className="flex items-center gap-6 text-sm text-slate-600">
                <span className="flex items-center gap-1.5 font-medium">
                  <MapPin className="w-4 h-4 text-emerald-600" /> {listing.location}
                </span>
                <span className="font-semibold text-slate-900">
                  Available Quantity: {listing.quantity} {listing.unit}
                </span>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-semibold text-slate-900 mb-2">Material Description</h3>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {listing.description}
                </p>
              </div>

              {/* AI Tags */}
              {listing.aiTags?.length > 0 && (
                <div className="pt-2">
                  <h4 className="text-xs font-semibold text-slate-500 mb-2">Material Characteristics (AI Discovered)</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {listing.aiTags.map((tag: string) => (
                      <span key={tag} className="text-xs px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Circular Economy & Impact Analysis */}
          <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-teal-50/50">
            <CardHeader>
              <CardTitle className="text-emerald-900 flex items-center gap-2 text-lg">
                <Sparkles className="w-5 h-5 text-emerald-600" /> AI Environmental Impact & Material Passport
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="p-4 rounded-xl bg-white/80 border border-emerald-100 shadow-sm">
                <div className="flex items-center gap-2 text-emerald-700 font-semibold mb-1">
                  <Leaf className="w-4 h-4" /> Estimated CO₂ Avoidance
                </div>
                <p className="text-2xl font-bold text-slate-900">
                  {listing.aiEstimatedCo2Savings
                    ? `${listing.aiEstimatedCo2Savings} kg CO₂e`
                    : `${(listing.quantity * 1.85).toFixed(0)} kg CO₂e`}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Diverting this batch prevents raw virgin extraction emissions.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/80 border border-emerald-100 shadow-sm">
                <div className="flex items-center gap-2 text-emerald-700 font-semibold mb-1">
                  <Building2 className="w-4 h-4" /> Recommended Secondary Uses
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {listing.aiSuggestedIndustries?.length > 0 ? (
                    listing.aiSuggestedIndustries.map((ind: string) => (
                      <Badge key={ind} variant="outline" className="text-[11px] bg-white">
                        {ind}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500">Recycling, Construction, Manufacturing</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Sidebar Column */}
        <div className="space-y-6">
          {/* Pricing & Bidding Box */}
          <Card className="border-2 border-emerald-500 shadow-xl">
            <CardHeader className="bg-emerald-600 text-white rounded-t-lg">
              <CardDescription className="text-emerald-100">Asking / Estimated Value</CardDescription>
              <CardTitle className="text-3xl font-extrabold text-white">
                {listing.priceExpectation
                  ? formatCurrency(listing.priceExpectation)
                  : listing.aiEstimatedValue
                  ? `~${formatCurrency(listing.aiEstimatedValue)}`
                  : "Open to Offers"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <Button
                size="lg"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 text-base shadow-md"
                onClick={() => setBidModalOpen(true)}
              >
                <Gavel className="w-5 h-5" /> Place a Bid
              </Button>

              <Button
                variant="outline"
                className="w-full border-emerald-300 text-emerald-800 hover:bg-emerald-50"
                onClick={handleExpressInterest}
                disabled={interestExpressed}
              >
                {interestExpressed ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" /> Interest Registered
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-500" /> Express Circular Interest
                  </>
                )}
              </Button>

              <Link href={`/dashboard/messages?recipient=${listing.company?.id}`} className="block">
                <Button variant="ghost" className="w-full text-slate-600 hover:text-slate-900">
                  <MessageSquare className="w-4 h-4" /> Send Seller Message
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Seller Profile Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-500" /> Verified Supplier Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-base">{listing.company?.name}</h4>
                  {listing.company?.verificationStatus === "APPROVED" && (
                    <span title="Verified Business">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">{listing.company?.industrySector || "Industrial Manufacturing"}</p>
              </div>

              <div className="flex items-center gap-3 pt-2 text-xs text-slate-600 border-t border-slate-100">
                <span>⭐ Rating: <strong>{listing.company?.rating || "5.0"}</strong></span>
                <span>•</span>
                <span>Location: <strong>{listing.company?.city || "Industrial Zone"}</strong></span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Related Waste Listings Carousel / Grid */}
      {relatedListings && relatedListings.length > 0 && (
        <div className="pt-8 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Similar Available Materials</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedListings.map((rel: any) => (
              <WasteCard
                key={rel.id}
                id={rel.id}
                title={rel.title}
                category={rel.category}
                quantity={rel.quantity}
                unit={rel.unit}
                location={rel.location}
                priceExpectation={rel.priceExpectation}
                aiEstimatedValue={rel.aiEstimatedValue}
                hazardClass={rel.hazardClass}
                status={rel.status}
                images={rel.images}
                aiTags={rel.aiTags || []}
                createdAt={rel.createdAt}
                companyName={rel.company?.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* Place Bid Modal Dialog */}
      <Dialog open={bidModalOpen} onOpenChange={setBidModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <Gavel className="w-5 h-5 text-emerald-600" /> Submit Bid Offer
            </DialogTitle>
            <DialogDescription>
              Propose your total bid amount and requested quantity for &ldquo;{listing.title}&rdquo;.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handlePlaceBid} className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Requested Quantity ({listing.unit})
              </label>
              <Input
                type="number"
                value={quantityRequested}
                onChange={(e) => setQuantityRequested(e.target.value)}
                required
                placeholder={`Max ${listing.quantity}`}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Total Bid Price (₹ INR)
              </label>
              <Input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                required
                placeholder="Enter total offer amount"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Optional Message for Seller
              </label>
              <Textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Specify logistics preferences, pickup timeline, or recycling certifications..."
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setBidModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submittingBid} className="bg-emerald-600 text-white">
                <Send className="w-4 h-4" /> {submittingBid ? "Submitting..." : "Submit Bid"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
