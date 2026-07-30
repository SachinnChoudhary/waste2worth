import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user?.companyId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const bids = await prisma.bid.findMany({
      where: { buyerCompanyId: user.companyId },
      orderBy: { createdAt: "desc" },
      include: {
        listing: {
          include: {
            company: {
              select: { name: true, city: true, state: true },
            },
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: bids });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
