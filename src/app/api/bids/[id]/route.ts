import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user?.companyId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const bid = await prisma.bid.findUnique({
    where: { id },
    include: {
      listing: { select: { companyId: true, title: true, id: true } },
      buyerCompany: { select: { name: true } },
    },
  });

  if (!bid) {
    return NextResponse.json({ success: false, error: "Bid not found" }, { status: 404 });
  }

  // Only the listing owner can accept/reject
  if (body.status === "ACCEPTED" || body.status === "REJECTED") {
    if (bid.listing.companyId !== user.companyId) {
      return NextResponse.json({ success: false, error: "Not authorized" }, { status: 403 });
    }
  }

  // Only the bidder can withdraw
  if (body.status === "WITHDRAWN") {
    if (bid.buyerCompanyId !== user.companyId) {
      return NextResponse.json({ success: false, error: "Not authorized" }, { status: 403 });
    }
  }

  const updated = await prisma.bid.update({
    where: { id },
    data: { status: body.status },
  });

  // If accepted, create a transaction
  if (body.status === "ACCEPTED") {
    await prisma.transaction.create({
      data: {
        listingId: bid.listingId,
        bidId: bid.id,
        sellerCompanyId: bid.listing.companyId,
        buyerCompanyId: bid.buyerCompanyId,
        finalAmount: bid.bidAmount,
        quantity: bid.quantityRequested,
        status: "IN_PROGRESS",
      },
    });

    // Mark listing as sold
    await prisma.wasteListing.update({
      where: { id: bid.listingId },
      data: { status: "SOLD" },
    });

    // Reject other pending bids
    await prisma.bid.updateMany({
      where: {
        listingId: bid.listingId,
        id: { not: bid.id },
        status: "PENDING",
      },
      data: { status: "REJECTED" },
    });
  }

  // Notify the other party
  const notifyUserId = body.status === "WITHDRAWN" ? null : (
    await prisma.user.findFirst({
      where: { companyId: bid.buyerCompanyId },
      select: { id: true },
    })
  );

  if (notifyUserId) {
    await prisma.notification.create({
      data: {
        userId: notifyUserId.id,
        type: `BID_${body.status}`,
        title: `Bid ${body.status.toLowerCase()}`,
        content: `Your bid on "${bid.listing.title}" has been ${body.status.toLowerCase()}.`,
        link: `/dashboard/my-bids`,
      },
    });
  }

  return NextResponse.json({ success: true, data: updated });
}
