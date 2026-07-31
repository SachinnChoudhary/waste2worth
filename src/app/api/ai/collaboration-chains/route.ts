import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-helpers";
import { getCollaborationChains } from "@/lib/ai";

export async function GET() {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const chains = await getCollaborationChains();
  return NextResponse.json({ success: true, data: chains });
}
