import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const hazardClass = searchParams.get("hazardClass");
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";

  const where: Record<string, unknown> = { status: "ACTIVE" };

  // Don't show own company's listings
  if (user.companyId) {
    where.companyId = { not: user.companyId };
  }

  if (category && category !== "ALL") {
    where.category = category;
  }
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { location: { contains: search, mode: "insensitive" } },
    ];
  }
  if (minPrice || maxPrice) {
    where.priceExpectation = {};
    if (minPrice) (where.priceExpectation as Record<string, unknown>).gte = parseFloat(minPrice);
    if (maxPrice) (where.priceExpectation as Record<string, unknown>).lte = parseFloat(maxPrice);
  }
  if (hazardClass && hazardClass !== "ALL") {
    where.hazardClass = hazardClass;
  }

  const listings = await prisma.wasteListing.findMany({
    where,
    orderBy: { [sortBy]: sortOrder },
    include: {
      company: { select: { id: true, name: true, rating: true } },
      _count: { select: { bids: true } },
    },
  });

  return NextResponse.json({ success: true, data: listings });
}
