"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
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
          <ShieldCheck className="w-8 h-8 text-emerald-600" />
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Privacy Policy</h1>
            <p className="text-xs text-slate-500">Effective Date: July 30, 2026</p>
          </div>
        </div>

        <section className="space-y-4 text-sm text-slate-600 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900">1. Information We Collect</h2>
          <p>
            CircuLink collects business registration metadata, user contact details, geolocations, and industrial waste specifications submitted to our platform to facilitate circular B2B transactions.
          </p>

          <h2 className="text-lg font-bold text-slate-900">2. How Information is Used</h2>
          <p>
            We use collected data to train AI matching models, generate digital waste manifests, calculate Scope 3 carbon offsets, and enable secure communication between verified trading partners.
          </p>

          <h2 className="text-lg font-bold text-slate-900">3. Data Security & Enterprise Protection</h2>
          <p>
            All communications and transaction history are encrypted at rest and in transit. Confidential manufacturing secrets and proprietary formulas are strictly safeguarded according to enterprise standards.
          </p>

          <h2 className="text-lg font-bold text-slate-900">4. Contact Us</h2>
          <p>
            For privacy inquiries, reach out to privacy@waste2worth.ai.
          </p>
        </section>
      </main>
    </div>
  );
}
