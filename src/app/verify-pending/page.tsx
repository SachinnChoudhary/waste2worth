"use client";

import Link from "next/link";
import { Clock, CheckCircle, Mail, Recycle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function VerifyPendingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/30 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <Recycle className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900">
              Circu<span className="text-emerald-600">Link</span>
            </span>
          </Link>
        </div>

        <Card className="shadow-xl border-slate-200/50">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
              <Clock className="w-10 h-10 text-amber-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-3">Verification Pending</h1>
            <p className="text-slate-600 mb-6">
              Your company registration is under review. Our team will verify your details
              and approve your account within 24-48 hours.
            </p>

            <div className="space-y-3 text-left bg-slate-50 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span className="text-slate-700">Account created successfully</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <span className="text-slate-700">Company verification in progress</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <span className="text-slate-500">You&apos;ll be notified once approved</span>
              </div>
            </div>

            <Link href="/login">
              <Button variant="outline" className="w-full">
                Back to Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
