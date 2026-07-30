import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const notificationCount = await prisma.notification.count({
    where: { userId: session.user.id, isRead: false },
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        role="ADMIN"
        userName={session.user.name}
      />
      <div className="pl-[260px] transition-all duration-300">
        <Navbar title="Admin Panel" notificationCount={notificationCount} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
