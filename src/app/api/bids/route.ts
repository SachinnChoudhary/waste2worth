import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.companyId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Verify listing exists and is active
    const listing = await prisma.wasteListing.findUnique({
      where: { id: body.listingId },
      select: { companyId: true, status: true, minimumBid: true },
    });

    if (!listing || listing.status !== "ACTIVE") {
      return NextResponse.json({ success: false, error: "Listing not available" }, { status: 400 });
    }

    if (listing.companyId === session.user.companyId) {
      return NextResponse.json({ success: false, error: "Cannot bid on own listing" }, { status: 400 });
    }

    if (listing.minimumBid && body.bidAmount < listing.minimumBid) {
      return NextResponse.json({
        success: false,
        error: `Minimum bid is $${listing.minimumBid}`,
      }, { status: 400 });
    }

    const bid = await prisma.bid.create({
      data: {
        listingId: body.listingId,
        buyerCompanyId: session.user.companyId,
        bidAmount: body.bidAmount,
        quantityRequested: body.quantityRequested,
        message: body.message,
        status: "PENDING",
      },
    });

    // Notify seller
    const sellerUsers = await prisma.user.findMany({
      where: { companyId: listing.companyId },
      select: { id: true },
    });

    const buyerCompany = await prisma.company.findUnique({
      where: { id: session.user.companyId },
      select: { name: true },
    });

    await prisma.notification.createMany({
      data: sellerUsers.map((u) => ({
        userId: u.id,
        type: "NEW_BID",
        title: "New Bid Received",
        content: `${buyerCompany?.name} placed a $${body.bidAmount} bid on your listing.`,
        link: `/dashboard/listings/${body.listingId}`,
      })),
    });

    return NextResponse.json({ success: true, data: bid }, { status: 201 });
  } catch (error) {
    console.error("Bid error:", error);
    return NextResponse.json({ success: false, error: "Failed to place bid" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.companyId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const bids = await prisma.bid.findMany({
    where: { buyerCompanyId: session.user.companyId },
    orderBy: { createdAt: "desc" },
    include: {
      listing: {
        select: { id: true, title: true, category: true, images: true, quantity: true, unit: true },
        include: { company: { select: { name: true } } },
      },
    },
  });

  return NextResponse.json({ success: true, data: bids });
}
