import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || session.user.role !== "COMPANY") {
    redirect("/login");
  }

  const company = session.user.companyId
    ? await prisma.company.findUnique({
        where: { id: session.user.companyId },
        select: { name: true, verificationStatus: true },
      })
    : null;

  if (!company || company.verificationStatus !== "APPROVED") {
    redirect("/verify-pending");
  }

  const notificationCount = await prisma.notification.count({
    where: { userId: session.user.id, isRead: false },
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        role="COMPANY"
        userName={session.user.name}
        companyName={company.name}
      />
      <div className="pl-[260px] transition-all duration-300">
        <Navbar notificationCount={notificationCount} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
