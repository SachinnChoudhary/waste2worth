"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Package, Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { WasteCard } from "@/components/shared/WasteCard";
import { toast } from "sonner";

export default function MyListingsPage() {
  const [listings, setListings] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchListings() {
      try {
        const res = await fetch("/api/listings");
        const data = await res.json();
        if (data.success) setListings(data.data);
      } catch {
        toast.error("Failed to load listings");
      } finally {
        setLoading(false);
      }
    }
    fetchListings();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Waste Listings</h1>
          <p className="text-sm text-slate-500 mt-1">{listings.length} total listings</p>
        </div>
        <Link href="/dashboard/listings/new">
          <Button>
            <Plus className="w-4 h-4" /> New Listing
          </Button>
        </Link>
      </div>

      {listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing: Record<string, unknown>) => (
            <WasteCard
              key={listing.id as string}
              id={listing.id as string}
              title={listing.title as string}
              category={listing.category as string}
              quantity={listing.quantity as number}
              unit={listing.unit as string}
              location={listing.location as string}
              priceExpectation={listing.priceExpectation as number | null}
              aiEstimatedValue={listing.aiEstimatedValue as number | null}
              hazardClass={listing.hazardClass as string}
              status={listing.status as string}
              images={listing.images as string[]}
              aiTags={listing.aiTags as string[]}
              viewCount={listing.viewCount as number}
              bidCount={((listing as Record<string, unknown>)._count as Record<string, number>)?.bids || 0}
              createdAt={(listing.createdAt as string)}
              href={`/dashboard/listings/${listing.id}`}
            />
          ))}
        </div>
      ) : !loading ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Package className="w-12 h-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No listings yet</h3>
            <p className="text-sm text-slate-500 mb-4">
              Create your first waste listing and let AI find the best buyers.
            </p>
            <Link href="/dashboard/listings/new">
              <Button>
                <Plus className="w-4 h-4" /> Create First Listing
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
