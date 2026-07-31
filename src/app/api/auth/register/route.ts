import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Basic validation
    const {
      name,
      email,
      password,
      companyName,
      industrySector,
      companyType,
      registrationNumber,
      address,
      city,
      state,
      country,
      postalCode,
      phone,
      website,
    } = body;

    if (!name || !email || !password || !companyName || !industrySector) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { success: false, error: "Server configuration error: Supabase not configured" },
        { status: 500 }
      );
    }

    // Validate service role key looks like a JWT (not a URL)
    if (!serviceRoleKey.startsWith("eyJ")) {
      console.error(
        "SUPABASE_SERVICE_ROLE_KEY appears invalid — it should be a JWT starting with 'eyJ'. " +
        "Get the service_role key from: https://supabase.com/dashboard/project/jbeosmitxmdziipyyvfn/settings/api"
      );
      return NextResponse.json(
        {
          success: false,
          error:
            "Server configuration error: SUPABASE_SERVICE_ROLE_KEY is not set correctly. " +
            "Please paste the service_role JWT from the Supabase dashboard API settings.",
        },
        { status: 500 }
      );
    }

    const supabaseAdmin = createAdminClient();

    // Check if user already exists
    const { data: existingUsers, error: listError } =
      await supabaseAdmin.auth.admin.listUsers();

    if (!listError && existingUsers?.users) {
      const duplicate = existingUsers.users.find((u) => u.email === email);
      if (duplicate) {
        return NextResponse.json(
          { success: false, error: "An account with this email already exists" },
          { status: 400 }
        );
      }
    }

    // Create user in Supabase Auth — email_confirm: true skips the confirmation email
    // so the user can log in immediately and land on /verify-pending for company approval
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          name,
          role: "COMPANY",
          companyName,
          industrySector,
          companyType: companyType || "BOTH",
          registrationNumber: registrationNumber || null,
          address: address || null,
          city: city || null,
          state: state || null,
          country: country || null,
          postalCode: postalCode || null,
          phone: phone || null,
          website: website || null,
          companyVerified: true,
        },
      });

    if (authError) {
      console.error("Supabase auth user creation error:", authError);
      if (authError.message.toLowerCase().includes("already been registered") ||
          authError.message.toLowerCase().includes("already exists")) {
        return NextResponse.json(
          { success: false, error: "An account with this email already exists" },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { success: false, error: authError.message || "Registration failed" },
        { status: 400 }
      );
    }

    const newUserId = authData.user?.id;

    // Optionally sync to Prisma/local DB — swallow errors so Supabase-only setups work
    try {
      const { prisma } = await import("@/lib/prisma");
      const bcrypt = await import("bcryptjs");

      const passwordHash = await bcrypt.hash(password, 12);

      await prisma.$transaction(async (tx) => {
        const company = await tx.company.create({
          data: {
            name: companyName,
            industrySector,
            type: companyType || "BOTH",
            registrationNumber: registrationNumber || undefined,
            address: address || undefined,
            city: city || undefined,
            state: state || undefined,
            country: country || undefined,
            postalCode: postalCode || undefined,
            phone: phone || undefined,
            website: website || undefined,
            verificationStatus: "APPROVED",
          },
        });

        await tx.user.create({
          data: {
            id: newUserId || undefined,
            name,
            email,
            passwordHash,
            role: "COMPANY",
            companyId: company.id,
          },
        });

        // Notify admins
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
              content: `${companyName} has registered and is awaiting verification.`,
              link: `/admin/companies/${company.id}`,
            })),
          });
        }
      });
    } catch (prismaError) {
      // Prisma sync is optional — log but don't fail the request
      console.warn("Prisma sync skipped (non-fatal):", prismaError);
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Account created! You can now log in. Your company profile is pending admin verification.",
        data: { userId: newUserId },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
