import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getAuthUser();
  if (!user?.companyId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const bids = await prisma.bid.findMany({
    where: {
      listing: { companyId: user.companyId },
    },
    orderBy: { createdAt: "desc" },
    include: {
      listing: { select: { id: true, title: true } },
      buyerCompany: { select: { id: true, name: true, rating: true } },
    },
  });

  return NextResponse.json({ success: true, data: bids });
}
