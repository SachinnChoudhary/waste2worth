"use client";
import { Bell } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
        <p className="text-sm text-slate-500 mt-1">Stay updated on bids, transactions, and more</p>
      </div>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Bell className="w-12 h-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">All caught up!</h3>
          <p className="text-sm text-slate-500">No new notifications.</p>
        </CardContent>
      </Card>
    </div>
  );
}
