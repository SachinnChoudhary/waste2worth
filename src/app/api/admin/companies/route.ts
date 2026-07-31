import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const user = await getAuthUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search");

  const where: Record<string, unknown> = {};
  if (status && status !== "ALL") {
    where.verificationStatus = status;
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { industrySector: { contains: search, mode: "insensitive" } },
    ];
  }

  const companies = await prisma.company.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { wasteListings: true, users: true },
      },
    },
  });

  return NextResponse.json({ success: true, data: companies });
}
