import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function getAuthUser() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      return null;
    }

    let dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      include: { company: true },
    });

    if (!dbUser) {
      const companyName = user.user_metadata?.companyName || user.user_metadata?.company || "My Company";
      const industrySector = user.user_metadata?.industrySector || "Industrial Manufacturing";
      // OAuth providers use different metadata field names
      const userName =
        user.user_metadata?.name ||
        user.user_metadata?.full_name ||
        user.user_metadata?.preferred_username ||
        user.user_metadata?.user_name ||
        user.email?.split("@")[0] ||
        "User";
      const company = await prisma.company.create({
        data: {
          name: companyName,
          industrySector,
          verificationStatus: "APPROVED",
          address: "Primary Facility Location",
        },
      });

      dbUser = await prisma.user.create({
        data: {
          id: user.id,
          email: user.email,
          name: userName,
          passwordHash: "",
          role: (user.user_metadata?.role as any) || "COMPANY",
          companyId: company.id,
        },
        include: { company: true },
      });
    } else if (!dbUser.companyId) {
      const company = await prisma.company.create({
        data: {
          name: "My Company",
          industrySector: "Industrial Manufacturing",
          verificationStatus: "APPROVED",
          address: "Primary Facility Location",
        },
      });
      dbUser = await prisma.user.update({
        where: { id: dbUser.id },
        data: { companyId: company.id },
        include: { company: true },
      });
    }

    return {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      role: dbUser.role,
      companyId: dbUser.companyId!,
      companyVerified: dbUser.company?.verificationStatus === "APPROVED",
    };
  } catch (error) {
    console.error("getAuthUser error:", error);
    return null;
  }
}
