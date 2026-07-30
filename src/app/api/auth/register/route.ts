import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signupSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = signupSchema.parse(body);

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(validatedData.password, 12);

    // Create company and user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: {
          name: validatedData.companyName,
          industrySector: validatedData.industrySector,
          type: validatedData.companyType,
          registrationNumber: validatedData.registrationNumber,
          address: validatedData.address,
          city: validatedData.city,
          state: validatedData.state,
          country: validatedData.country,
          postalCode: validatedData.postalCode,
          phone: validatedData.phone,
          website: validatedData.website || undefined,
          geoLat: validatedData.geoLat,
          geoLng: validatedData.geoLng,
          verificationStatus: "PENDING",
        },
      });

      const user = await tx.user.create({
        data: {
          name: validatedData.name,
          email: validatedData.email,
          passwordHash,
          role: "COMPANY",
          companyId: company.id,
        },
      });

      // Create a notification for admins
      const admins = await tx.user.findMany({
        where: { role: "ADMIN" },
        select: { id: true },
      });

      if (admins.length > 0) {
        await tx.notification.createMany({
          data: admins.map((admin) => ({
            userId: admin.id,
            type: "NEW_COMPANY",
            title: "New Company Registration",
            content: `${company.name} has registered and is awaiting verification.`,
            link: `/admin/companies/${company.id}`,
          })),
        });
      }

      return { user, company };
    });

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful. Please wait for verification.",
        data: {
          userId: result.user.id,
          companyId: result.company.id,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
