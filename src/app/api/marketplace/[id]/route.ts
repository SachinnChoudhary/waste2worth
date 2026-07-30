import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const listing = await prisma.wasteListing.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            industrySector: true,
            rating: true,
            totalReviews: true,
            city: true,
            state: true,
            verificationStatus: true,
            logoUrl: true,
          },
        },
        _count: { select: { bids: true } },
      },
    });

    if (!listing) {
      return NextResponse.json({ success: false, error: "Listing not found" }, { status: 404 });
    }

    // Increment view count asynchronously
    await prisma.wasteListing.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    // Fetch related listings in same category
    const relatedListings = await prisma.wasteListing.findMany({
      where: {
        category: listing.category,
        id: { not: listing.id },
        status: "ACTIVE",
      },
      take: 3,
      include: {
        company: { select: { name: true } },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        listing,
        relatedListings,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
