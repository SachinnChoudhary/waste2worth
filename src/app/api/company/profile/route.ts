import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.companyId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const company = await prisma.company.findUnique({
      where: { id: session.user.companyId },
    });

    return NextResponse.json({ success: true, data: company });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.companyId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, industrySector, description, phone, website, address, city, state } = body;

    const updated = await prisma.company.update({
      where: { id: session.user.companyId },
      data: {
        name,
        industrySector,
        description,
        phone,
        website,
        address: address || "Primary Facility Location",
        city,
        state,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
