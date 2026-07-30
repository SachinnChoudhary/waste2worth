import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user?.companyId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const companyId = user.companyId;

    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          { sellerCompanyId: companyId },
          { buyerCompanyId: companyId },
        ],
      },
      orderBy: { createdAt: "desc" },
      include: {
        listing: {
          select: { title: true, category: true, unit: true, location: true, images: true },
        },
        sellerCompany: {
          select: { id: true, name: true, phone: true, website: true },
        },
        buyerCompany: {
          select: { id: true, name: true, phone: true, website: true },
        },
        reviews: true,
      },
    });

    return NextResponse.json({ success: true, data: transactions });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
