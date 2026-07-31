import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-helpers";
import { getAssistantResponse } from "@/lib/ai";

export async function POST(request: Request) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { message } = body;

    const response = await getAssistantResponse(message);

    return NextResponse.json({
      success: true,
      data: { response },
    });
  } catch (error) {
    console.error("Assistant error:", error);
    return NextResponse.json({ success: false, error: "Assistant failed" }, { status: 500 });
  }
}
