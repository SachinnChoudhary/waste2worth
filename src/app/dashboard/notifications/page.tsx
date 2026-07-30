"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, CheckCheck, Clock, ExternalLink, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatRelativeTime } from "@/lib/utils";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data || []);
      }
    } catch {
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      const res = await fetch("/api/notifications", { method: "PATCH" });
      const data = await res.json();
      if (data.success) {
        toast.success("All marked as read");
        fetchNotifications();
      }
    } catch {
      toast.error("Failed to mark notifications as read");
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-emerald-600" /> Notifications & Activity Stream
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time updates on bids, accepted transactions, and platform activities
          </p>
        </div>

        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead} className="gap-2">
            <CheckCheck className="w-4 h-4 text-emerald-600" /> Mark All as Read
          </Button>
        )}
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((n) => (
            <Card
              key={n.id}
              className={`transition-colors ${
                !n.isRead ? "bg-emerald-50/40 border-emerald-200" : "bg-white border-slate-200"
              }`}
            >
              <CardContent className="p-4 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      !n.isRead ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{n.title}</h4>
                      {!n.isRead && <Badge variant="warning" className="text-[10px]">New</Badge>}
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{n.content}</p>
                    <span className="text-[10px] text-slate-400 mt-1.5 block">
                      {formatRelativeTime(n.createdAt)}
                    </span>
                  </div>
                </div>

                {n.link && (
                  <Link href={n.link}>
                    <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700">
                      View <ExternalLink className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !loading ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Bell className="w-12 h-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">All caught up!</h3>
            <p className="text-sm text-slate-500">You have no unread notifications at this time.</p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
