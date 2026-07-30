"use client";

import Link from "next/link";
import { ArrowLeft, Recycle, ShieldCheck, Cpu, Leaf, Users, Globe, Award, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-black text-slate-900">
              Waste<span className="text-emerald-600">2Worth</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-emerald-600 text-white">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" /> Accelerating Industrial Symbiosis
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
            Transforming Industrial Byproducts into Valued Raw Materials
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            CircuLink (Waste2Worth) is an AI-powered B2B exchange network designed to divert millions of tons of manufacturing waste from landfills into closed-loop circular supply chains.
          </p>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="py-16 max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900">Why Modern Enterprises Choose CircuLink</h2>
          <p className="text-sm text-slate-500 mt-2">Pioneering zero-waste manufacturing with AI and automated ESG verification</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">AI Material Passport & Matching</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Our Gemini-powered engine automatically analyzes chemical components, hazard levels, and technical specs to suggest optimal downstream buyers.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Automated Scope 3 Analytics</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Track avoided greenhouse gas emissions (CO₂e) per metric ton and instantly generate audit-ready ESG reporting documents.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Verified Business Security</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Strict enterprise verification, digital waste transfer manifests, and compliance checks ensure lawful handling of industrial materials.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-12">
        <div className="max-w-6xl mx-auto px-6 text-center text-xs text-slate-500 space-y-4">
          <p>&copy; {new Date().getFullYear()} Waste2Worth / CircuLink Inc. All rights reserved.</p>
          <div className="flex justify-center gap-6">
            <Link href="/privacy" className="hover:text-emerald-600">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-emerald-600">Terms of Service</Link>
            <Link href="/how-it-works" className="hover:text-emerald-600">How It Works</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
