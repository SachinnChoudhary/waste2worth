import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getCollaborationChains } from "@/lib/ai";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const chains = await getCollaborationChains();
  return NextResponse.json({ success: true, data: chains });
}

