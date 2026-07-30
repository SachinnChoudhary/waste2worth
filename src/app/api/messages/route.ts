import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");

    if (!conversationId) {
      return NextResponse.json({ success: false, error: "Conversation ID required" }, { status: 400 });
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation || !conversation.participantIds.includes(session.user.id)) {
      return NextResponse.json({ success: false, error: "Not authorized" }, { status: 403 });
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
      include: {
        sender: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: messages });
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

    const { conversationId, content } = await request.json();

    if (!conversationId || !content?.trim()) {
      return NextResponse.json({ success: false, error: "Conversation ID and content required" }, { status: 400 });
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation || !conversation.participantIds.includes(session.user.id)) {
      return NextResponse.json({ success: false, error: "Not authorized" }, { status: 403 });
    }

    const receiverId = conversation.participantIds.find((id: string) => id !== session.user.id);

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: session.user.id,
        receiverId: receiverId || null,
        content: content.trim(),
      },
      include: {
        sender: {
          select: { id: true, name: true },
        },
      },
    });

    // Update conversation updatedAt timestamp
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({ success: true, data: message });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
