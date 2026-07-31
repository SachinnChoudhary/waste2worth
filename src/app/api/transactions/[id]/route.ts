import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        listing: true,
        bid: true,
        sellerCompany: true,
        buyerCompany: true,
        reviews: {
          include: {
            reviewer: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!transaction) {
      return NextResponse.json({ success: false, error: "Transaction not found" }, { status: 404 });
    }

    if (
      transaction.sellerCompanyId !== user.companyId &&
      transaction.buyerCompanyId !== user.companyId &&
      user.role !== "ADMIN"
    ) {
      return NextResponse.json({ success: false, error: "Not authorized" }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: transaction });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      return NextResponse.json({ success: false, error: "Transaction not found" }, { status: 404 });
    }

    if (
      transaction.sellerCompanyId !== user.companyId &&
      transaction.buyerCompanyId !== user.companyId &&
      user.role !== "ADMIN"
    ) {
      return NextResponse.json({ success: false, error: "Not authorized" }, { status: 403 });
    }

    const updateData: any = {};
    if (body.status) {
      updateData.status = body.status;
      if (body.status === "COMPLETED") {
        updateData.completedAt = new Date();
      }
    }
    if (body.notes !== undefined) {
      updateData.notes = body.notes;
    }

    const updated = await prisma.transaction.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
