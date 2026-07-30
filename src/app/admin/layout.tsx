import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const role = user?.user_metadata?.role || "COMPANY";

  if (!user || role !== "ADMIN") {
    redirect("/login");
  }

  const userName = user.user_metadata?.name || user.email?.split("@")[0] || "Admin";

  let notificationCount = 0;
  try {
    notificationCount = await prisma.notification.count({
      where: { userId: user.id, isRead: false },
    });
  } catch {
    // Ignore notification error
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        role="ADMIN"
        userName={userName}
      />
      <div className="pl-[260px] transition-all duration-300">
        <Navbar title="Admin Panel" notificationCount={notificationCount} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
