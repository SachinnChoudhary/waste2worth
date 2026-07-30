"use client";
import { Card, CardContent } from "@/components/ui/card";
import { HandshakeIcon } from "lucide-react";
export default function AdminTransactionsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Transaction Oversight</h1>
      <Card><CardContent className="flex flex-col items-center justify-center py-16">
        <HandshakeIcon className="w-12 h-12 text-slate-300 mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Transaction management</h3>
        <p className="text-sm text-slate-500">Oversee all platform transactions and mediate disputes.</p>
      </CardContent></Card>
    </div>
  );
}
