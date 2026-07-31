import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id: transactionId } = await params;
    const body = await request.json();
    const { rating, comment } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ success: false, error: "Rating between 1 and 5 is required" }, { status: 400 });
    }

    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      return NextResponse.json({ success: false, error: "Transaction not found" }, { status: 404 });
    }

    const isSeller = transaction.sellerCompanyId === user.companyId;
    const isBuyer = transaction.buyerCompanyId === user.companyId;

    if (!isSeller && !isBuyer) {
      return NextResponse.json({ success: false, error: "Not authorized" }, { status: 403 });
    }

    // Target reviewee is the counterpart company's user or company
    const revieweeCompanyId = isSeller ? transaction.buyerCompanyId : transaction.sellerCompanyId;
    const revieweeUser = await prisma.user.findFirst({
      where: { companyId: revieweeCompanyId },
      select: { id: true },
    });

    if (!revieweeUser) {
      return NextResponse.json({ success: false, error: "Reviewee user not found" }, { status: 404 });
    }

    // Check if review already exists
    const existing = await prisma.review.findFirst({
      where: {
        transactionId,
        reviewerId: user.id,
      },
    });

    if (existing) {
      return NextResponse.json({ success: false, error: "You have already reviewed this transaction" }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        transactionId,
        reviewerId: user.id,
        revieweeId: revieweeUser.id,
        rating: Number(rating),
        comment: comment || "",
      },
    });

    // Update target company rating average
    const reviewsForCompany = await prisma.review.findMany({
      where: {
        reviewee: { companyId: revieweeCompanyId },
      },
      select: { rating: true },
    });

    if (reviewsForCompany.length > 0) {
      const avgRating = reviewsForCompany.reduce((acc: number, r: { rating: number }) => acc + r.rating, 0) / reviewsForCompany.length;
      await prisma.company.update({
        where: { id: revieweeCompanyId },
        data: {
          rating: Number(avgRating.toFixed(1)),
          totalReviews: reviewsForCompany.length,
        },
      });
    }

    return NextResponse.json({ success: true, data: review });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
