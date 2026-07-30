"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Gavel,
  HandshakeIcon,
  MapPin,
  MessageSquare,
  BarChart3,
  Bot,
  User,
  Settings,
  Bell,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Recycle,
  Building2,
  FileText,
  Shield,
  Users,
  Flag,
  Cpu,
  Cog,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface SidebarProps {
  role: "ADMIN" | "COMPANY";
  userName?: string;
  companyName?: string;
}

const companyMenuItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Listings", href: "/dashboard/listings", icon: Package },
  { label: "Marketplace", href: "/dashboard/marketplace", icon: ShoppingCart },
  { label: "Bids Received", href: "/dashboard/bids-received", icon: Gavel },
  { label: "My Bids", href: "/dashboard/my-bids", icon: FileText },
  { label: "Transactions", href: "/dashboard/transactions", icon: HandshakeIcon },
  { label: "Collaboration", href: "/dashboard/collaboration-finder", icon: Users },
  { label: "Map", href: "/dashboard/map", icon: MapPin },
  { label: "AI Assistant", href: "/dashboard/assistant", icon: Bot },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { label: "Profile", href: "/dashboard/profile", icon: User },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const adminMenuItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Companies", href: "/admin/companies", icon: Building2 },
  { label: "Listings", href: "/admin/listings", icon: Package },
  { label: "Transactions", href: "/admin/transactions", icon: HandshakeIcon },
  { label: "Collaborations", href: "/admin/collaboration-chains", icon: Users },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "AI Config", href: "/admin/ai-config", icon: Cpu },
  { label: "Users", href: "/admin/users", icon: Shield },
  { label: "Reports", href: "/admin/reports", icon: Flag },
  { label: "Settings", href: "/admin/settings", icon: Cog },
];

export function Sidebar({ role, userName = "User", companyName }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const menuItems = role === "ADMIN" ? adminMenuItems : companyMenuItems;

  const isActive = (href: string) => {
    if (href === "/dashboard" || href === "/admin") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-white border-r border-slate-200 flex flex-col z-40 transition-all duration-300",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-slate-100">
        <Link href={role === "ADMIN" ? "/admin" : "/dashboard"} className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md flex-shrink-0">
            <Recycle className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold text-slate-900">
              Circu<span className="text-emerald-600">Link</span>
            </span>
          )}
        </Link>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              isActive(item.href)
                ? "bg-emerald-50 text-emerald-700 shadow-sm"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            )}
            title={collapsed ? item.label : undefined}
          >
            <item.icon
              className={cn(
                "w-5 h-5 flex-shrink-0",
                isActive(item.href) ? "text-emerald-600" : "text-slate-400"
              )}
            />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* User section */}
      <div className="border-t border-slate-100 p-3">
        {!collapsed && (
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="text-xs">
                {userName.split(" ").map((n) => n[0]).join("").toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{userName}</p>
              {companyName && (
                <p className="text-xs text-slate-500 truncate">{companyName}</p>
              )}
            </div>
          </div>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>

      {/* Collapse button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </aside>
  );
}
