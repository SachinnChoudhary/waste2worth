import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Find conversations where user is in participantIds
    const conversations = await prisma.conversation.findMany({
      where: {
        participantIds: {
          has: userId,
        },
      },
      orderBy: { updatedAt: "desc" },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    // Resolve participant user details
    const formatted = await Promise.all(
      conversations.map(async (conv: any) => {
        const otherUserId = conv.participantIds.find((id: string) => id !== userId);
        const otherUser = otherUserId
          ? await prisma.user.findUnique({
              where: { id: otherUserId },
              select: { id: true, name: true, email: true, companyId: true },
            })
          : null;

        const otherCompany = otherUser?.companyId
          ? await prisma.company.findUnique({
              where: { id: otherUser.companyId },
              select: { id: true, name: true, logoUrl: true },
            })
          : null;

        return {
          id: conv.id,
          updatedAt: conv.updatedAt,
          lastMessage: conv.messages[0] || null,
          otherUser: otherUser
            ? {
                id: otherUser.id,
                name: otherUser.name,
                companyName: otherCompany?.name || "Company",
              }
            : { id: "unknown", name: "User", companyName: "Business" },
        };
      })
    );

    return NextResponse.json({ success: true, data: formatted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { recipientId, recipientCompanyId, listingId } = await request.json();
    let targetUserId = recipientId;

    if (!targetUserId && recipientCompanyId) {
      const companyUser = await prisma.user.findFirst({
        where: { companyId: recipientCompanyId },
        select: { id: true },
      });
      targetUserId = companyUser?.id;
    }

    if (!targetUserId) {
      return NextResponse.json({ success: false, error: "Recipient user not found" }, { status: 404 });
    }

    if (targetUserId === session.user.id) {
      return NextResponse.json({ success: false, error: "Cannot message yourself" }, { status: 400 });
    }

    // Check if conversation exists
    let conversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          { participantIds: { has: session.user.id } },
          { participantIds: { has: targetUserId } },
        ],
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participantIds: [session.user.id, targetUserId],
          listingId: listingId || null,
        },
      });
    }

    return NextResponse.json({ success: true, data: conversation });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
