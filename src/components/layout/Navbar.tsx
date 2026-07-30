"use client";

import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NavbarProps {
  title?: string;
  notificationCount?: number;
}

export function Navbar({ title, notificationCount = 0 }: NavbarProps) {
  return (
    <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {title && <h1 className="text-lg font-semibold text-slate-900">{title}</h1>}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search..."
            className="pl-9 w-64 h-9 bg-slate-50 border-slate-200"
          />
        </div>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5 text-slate-600" />
          {notificationCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </Button>
      </div>
    </header>
  );
}
