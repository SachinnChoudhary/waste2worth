import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const listing = await prisma.wasteListing.findUnique({
    where: { id },
    include: {
      company: {
        select: { id: true, name: true, industrySector: true, rating: true, city: true, state: true },
      },
      bids: {
        orderBy: { createdAt: "desc" },
        include: {
          buyerCompany: { select: { id: true, name: true, rating: true } },
        },
      },
      _count: { select: { bids: true } },
    },
  });

  if (!listing) {
    return NextResponse.json({ success: false, error: "Listing not found" }, { status: 404 });
  }

  // Increment view count
  await prisma.wasteListing.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
  });

  return NextResponse.json({ success: true, data: listing });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.companyId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const listing = await prisma.wasteListing.findUnique({
    where: { id },
    select: { companyId: true },
  });

  if (!listing || listing.companyId !== session.user.companyId) {
    return NextResponse.json({ success: false, error: "Not authorized" }, { status: 403 });
  }

  const updated = await prisma.wasteListing.update({
    where: { id },
    data: body,
  });

  return NextResponse.json({ success: true, data: updated });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.companyId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const listing = await prisma.wasteListing.findUnique({
    where: { id },
    select: { companyId: true },
  });

  if (!listing || listing.companyId !== session.user.companyId) {
    return NextResponse.json({ success: false, error: "Not authorized" }, { status: 403 });
  }

  await prisma.wasteListing.update({
    where: { id },
    data: { status: "REMOVED" },
  });

  return NextResponse.json({ success: true });
}
