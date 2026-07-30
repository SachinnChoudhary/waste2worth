import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const userEmail = user.email || "";
  const userName =
    user.user_metadata?.name ||
    userEmail.split("@")[0] ||
    "User";
  const userRole = (user.user_metadata?.role || "COMPANY") as "ADMIN" | "COMPANY";
  const companyName = user.user_metadata?.companyName || "My Company";

  let notificationCount = 0;
  try {
    notificationCount = await prisma.notification.count({
      where: { userId: user.id, isRead: false },
    });
  } catch {
    // Swallowed if DB user record is unlinked
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        role={userRole}
        userName={userName}
        companyName={companyName}
      />
      <div className="pl-[260px] transition-all duration-300">
        <Navbar notificationCount={notificationCount} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
