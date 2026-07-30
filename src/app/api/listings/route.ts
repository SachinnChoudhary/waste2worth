import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get("companyId") || user.companyId;
  const status = searchParams.get("status");

  const where: Record<string, unknown> = {};

  if (companyId) {
    where.companyId = companyId;
  }
  if (status) {
    where.status = status;
  }

  const listings = await prisma.wasteListing.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      company: { select: { name: true } },
      _count: { select: { bids: true } },
    },
  });

  return NextResponse.json({ success: true, data: listings });
}

export async function POST(request: Request) {
  const user = await getAuthUser();
  if (!user?.companyId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const listing = await prisma.wasteListing.create({
      data: {
        companyId: user.companyId,
        title: body.title,
        wasteType: body.wasteType,
        category: body.category,
        subCategory: body.subCategory,
        description: body.description,
        quantity: body.quantity,
        unit: body.unit || "kg",
        images: body.images || [],
        location: body.location,
        geoLat: body.geoLat,
        geoLng: body.geoLng,
        hazardClass: body.hazardClass || "NONE",
        condition: body.condition,
        availabilityDate: body.availabilityDate ? new Date(body.availabilityDate) : null,
        isRecurring: body.isRecurring || false,
        priceExpectation: body.priceExpectation,
        minimumBid: body.minimumBid,
        openToOffers: body.openToOffers ?? true,
        aiTags: body.aiTags || [],
        aiSuggestedIndustries: body.aiSuggestedIndustries || [],
        aiEstimatedValue: body.aiEstimatedValue,
        aiEstimatedCo2Savings: body.aiEstimatedCo2Savings,
        aiClassificationData: body.aiClassificationData,
        status: "ACTIVE",
      },
    });

    return NextResponse.json({ success: true, data: listing }, { status: 201 });
  } catch (error) {
    console.error("Create listing error:", error);
    return NextResponse.json({ success: false, error: "Failed to create listing" }, { status: 500 });
  }
}
