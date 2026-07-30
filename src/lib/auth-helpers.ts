import { createClient } from "@/lib/supabase/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getAuthUser() {
  // 1. Try Supabase Auth first
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user?.email) {
      let dbUser = await prisma.user.findUnique({
        where: { email: user.email },
        include: { company: true },
      });

      if (!dbUser) {
        const companyName = user.user_metadata?.companyName || "My Company";
        const industrySector = user.user_metadata?.industrySector || "Industrial Manufacturing";
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
            name: user.user_metadata?.name || user.email.split("@")[0],
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
    }
  } catch {
    // Continue to fallback
  }

  // 2. Fallback to NextAuth session
  try {
    const session = await auth();
    if (session?.user?.email) {
      const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
      if (dbUser?.companyId) {
        return {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
          role: dbUser.role,
          companyId: dbUser.companyId,
          companyVerified: true,
        };
      }
    }
  } catch {
    // Continue to fallback
  }

  // 3. Fallback to existing Prisma user or seed demo user
  const firstUser = await prisma.user.findFirst({
    where: { companyId: { not: null } },
    include: { company: true },
  });

  if (firstUser?.companyId) {
    return {
      id: firstUser.id,
      email: firstUser.email,
      name: firstUser.name,
      role: firstUser.role,
      companyId: firstUser.companyId,
      companyVerified: true,
    };
  }

  const defaultCompany = await prisma.company.create({
    data: {
      name: "EcoTech Industries",
      industrySector: "Manufacturing",
      verificationStatus: "APPROVED",
      address: "Industrial Estate, Suite 100",
    },
  });

  const defaultUser = await prisma.user.create({
    data: {
      name: "EcoTech Manager",
      email: "manager@ecotech.com",
      passwordHash: "",
      role: "COMPANY",
      companyId: defaultCompany.id,
    },
  });

  return {
    id: defaultUser.id,
    email: defaultUser.email,
    name: defaultUser.name,
    role: defaultUser.role,
    companyId: defaultCompany.id,
    companyVerified: true,
  };
}
