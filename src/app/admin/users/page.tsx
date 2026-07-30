"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";
export default function AdminUsersPage() { return (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold text-slate-900">Admin Users</h1>
    <Card><CardContent className="flex flex-col items-center justify-center py-16">
      <Shield className="w-12 h-12 text-slate-300 mb-4" />
      <h3 className="text-lg font-semibold text-slate-900 mb-2">User Management</h3>
      <p className="text-sm text-slate-500">Add or manage admin and staff accounts.</p>
    </CardContent></Card>
  </div>
); }
