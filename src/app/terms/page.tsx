"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-black text-slate-900">
            Waste<span className="text-emerald-600">2Worth</span>
          </Link>
          <Link href="/">
            <Button variant="outline" size="sm">Back Home</Button>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 bg-white my-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b pb-4">
          <FileText className="w-8 h-8 text-emerald-600" />
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Terms of Service</h1>
            <p className="text-xs text-slate-500">Effective Date: July 30, 2026</p>
          </div>
        </div>

        <section className="space-y-4 text-sm text-slate-600 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900">1. Marketplace Platform Agreement</h2>
          <p>
            By accessing CircuLink, companies agree to provide truthful descriptions of waste materials, hazard classifications, and business registration credentials.
          </p>

          <h2 className="text-lg font-bold text-slate-900">2. Environmental Compliance & Regulations</h2>
          <p>
            Both buyers and sellers are responsible for maintaining lawful transport permits, EPA/local environmental licenses, and adhering to hazardous waste disposal guidelines.
          </p>

          <h2 className="text-lg font-bold text-slate-900">3. Bidding & Transaction Integrity</h2>
          <p>
            Accepted bids constitute a binding agreement between buyer and seller to fulfill material transfer under agreed financial and logistics terms.
          </p>

          <h2 className="text-lg font-bold text-slate-900">4. Limitation of Liability</h2>
          <p>
            CircuLink provides AI estimates and matching software as a service and is not liable for transport delays or material impurity disputes beyond marketplace verification tools.
          </p>
        </section>
      </main>
    </div>
  );
}
