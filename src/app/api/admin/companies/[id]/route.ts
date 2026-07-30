import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();

  try {
    const company = await prisma.company.update({
      where: { id },
      data: {
        verificationStatus: body.verificationStatus,
      },
    });

    // Notify company users
    const companyUsers = await prisma.user.findMany({
      where: { companyId: id },
      select: { id: true },
    });

    if (companyUsers.length > 0) {
      await prisma.notification.createMany({
        data: companyUsers.map((u) => ({
          userId: u.id,
          type: "VERIFICATION_UPDATE",
          title: `Company ${body.verificationStatus.toLowerCase()}`,
          content: `Your company "${company.name}" has been ${body.verificationStatus.toLowerCase()}.`,
          link: "/dashboard",
        })),
      });
    }

    return NextResponse.json({ success: true, data: company });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update company" }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;

  const company = await prisma.company.findUnique({
    where: { id },
    include: {
      users: { select: { id: true, name: true, email: true, createdAt: true } },
      wasteListings: { orderBy: { createdAt: "desc" }, take: 10 },
      _count: {
        select: {
          wasteListings: true,
          sellerTransactions: true,
          buyerTransactions: true,
        },
      },
    },
  });

  if (!company) {
    return NextResponse.json({ success: false, error: "Company not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: company });
}
