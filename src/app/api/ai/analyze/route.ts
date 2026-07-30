import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { analyzeWaste } from "@/lib/ai";

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { description, category, quantity, condition, location } = body;

    const analysis = await analyzeWaste({ description, category, quantity, condition, location });

    return NextResponse.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error("AI analysis error:", error);
    return NextResponse.json({ success: false, error: "AI analysis failed" }, { status: 500 });
  }
}

