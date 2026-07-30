"use client";
import { MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function MessagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
        <p className="text-sm text-slate-500 mt-1">Communicate with buyers and sellers</p>
      </div>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <MessageSquare className="w-12 h-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No messages yet</h3>
          <p className="text-sm text-slate-500">Start a conversation from a listing or bid.</p>
        </CardContent>
      </Card>
    </div>
  );
}
