"use client";
import { HandshakeIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Transactions</h1>
        <p className="text-sm text-slate-500 mt-1">View your completed and in-progress deals</p>
      </div>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <HandshakeIcon className="w-12 h-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No transactions yet</h3>
          <p className="text-sm text-slate-500">Transactions are created when a bid is accepted.</p>
        </CardContent>
      </Card>
    </div>
  );
}
