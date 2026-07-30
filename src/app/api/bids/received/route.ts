import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.companyId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const bids = await prisma.bid.findMany({
    where: {
      listing: { companyId: session.user.companyId },
    },
    orderBy: { createdAt: "desc" },
    include: {
      listing: { select: { id: true, title: true } },
      buyerCompany: { select: { id: true, name: true, rating: true } },
    },
  });

  return NextResponse.json({ success: true, data: bids });
}
