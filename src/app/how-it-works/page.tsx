"use client";

import Link from "next/link";
import { ArrowRight, PlusCircle, Search, Gavel, HandshakeIcon, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function HowItWorksPage() {
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

      {/* Hero */}
      <section className="py-16 bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-4">
          <h1 className="text-4xl font-extrabold text-slate-900">How Waste2Worth Works</h1>
          <p className="text-slate-600 text-base max-w-2xl mx-auto">
            A seamless 4-step process for manufacturers to list industrial byproducts and for recyclers to acquire quality materials.
          </p>
        </div>
      </section>

      {/* Step by Step Breakdown */}
      <section className="py-16 max-w-5xl mx-auto px-6 space-y-12">
        {/* Step 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black">
              1
            </div>
            <h3 className="text-2xl font-bold text-slate-900">List Your Industrial Waste</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Sellers upload waste specifications, quantity, location, and photos. Our AI auto-categorizes the material, tags key attributes, and estimates fair market pricing and CO₂ reduction potential.
            </p>
          </div>
          <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100 flex items-center justify-center">
            <PlusCircle className="w-20 h-20 text-emerald-500" />
          </Card>
        </div>

        {/* Step 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center md:flex-row-reverse">
          <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100 flex items-center justify-center order-2 md:order-1">
            <Search className="w-20 h-20 text-emerald-500" />
          </Card>
          <div className="space-y-3 order-1 md:order-2">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black">
              2
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Discover & Match Opportunities</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Buyers search the marketplace or use our AI Collaboration Finder to discover multi-company symbiosis chains where one facility&apos;s waste is another&apos;s raw material input.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black">
              3
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Place Bids & Agree on Terms</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Buyers submit transparent bid offers specifying volume and pricing. Sellers review incoming offers, negotiate, and accept terms with a single click.
            </p>
          </div>
          <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100 flex items-center justify-center">
            <Gavel className="w-20 h-20 text-emerald-500" />
          </Card>
        </div>

        {/* Step 4 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center md:flex-row-reverse">
          <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100 flex items-center justify-center order-2 md:order-1">
            <HandshakeIcon className="w-20 h-20 text-emerald-500" />
          </Card>
          <div className="space-y-3 order-1 md:order-2">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black">
              4
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Execute Transfer & Download Manifest</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Once accepted, a transaction is generated alongside an official Digital Waste Transfer Certificate and ESG Audit Receipt for corporate compliance.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-12">
        <div className="max-w-6xl mx-auto px-6 text-center text-xs text-slate-500 space-y-4">
          <p>&copy; {new Date().getFullYear()} Waste2Worth / CircuLink Inc. All rights reserved.</p>
          <div className="flex justify-center gap-6">
            <Link href="/about" className="hover:text-emerald-600">About Us</Link>
            <Link href="/privacy" className="hover:text-emerald-600">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-emerald-600">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
