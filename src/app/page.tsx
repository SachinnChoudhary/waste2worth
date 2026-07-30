"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Recycle,
  ArrowRight,
  ChevronDown,
  X,
  Menu,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Globe,
  Shield,
  Layers,
  ArrowUpRight,
  Mail,
  Phone,
  MapPin,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import CircularHeroGraphic from "@/components/landing/CircularHeroGraphic";

// Animated counter component for metrics section
function MetricCounter({ target, suffix = "", decimals = 0 }: { target: number; suffix?: string; decimals?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 50;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <span className="editorial-title text-4xl md:text-6xl font-extrabold text-white tracking-tight">
      {count.toFixed(decimals)}
      {suffix}
    </span>
  );
}

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<number | null>(0);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 5000);
      setEmail("");
    }
  };

  const materialMatrix = [
    { name: "Polymers", code: "PL-4820", tag: "High Recyclability" },
    { name: "Aluminum", code: "AL-1316", tag: "95% Energy Saving" },
    { name: "Copper", code: "CU-6088", tag: "Infinite Life" },
    { name: "Biomass", code: "BM-6094", tag: "Carbon Negative" },
    { name: "Rare Earth", code: "RE-9921", tag: "High Scarcity" },
    { name: "Lithium", code: "LI-3042", tag: "Battery Loop" },
    { name: "Steel", code: "ST-8812", tag: "Structural Reuse" },
    { name: "E-Waste", code: "EW-5501", tag: "Urban Mining" },
    { name: "Scope 3 AI", code: "AI-1002", tag: "Gemini Engine" },
    { name: "Material Passport", code: "MP-7740", tag: "Blockchain Ready" },
    { name: "Recycling Loop", code: "RL-3390", tag: "Closed System" },
    { name: "Zero Landfill", code: "ZL-0000", tag: "Target Standard" },
  ];

  return (
    <div className="min-h-screen bg-sand text-onyx selection:bg-emerald-500 selection:text-white relative overflow-x-hidden font-sans">
      {/* ------------------------------------------------------------- */}
      {/* 1. FLOATING NAVIGATION BAR & FULLSCREEN OVERLAY MENU          */}
      {/* ------------------------------------------------------------- */}
      <header className="fixed top-6 left-0 right-0 z-50 px-4 sm:px-8 max-w-7xl mx-auto flex items-center justify-between pointer-events-none">
        {/* Logo Pill */}
        <Link
          href="/"
          className="pointer-events-auto flex items-center gap-3 bg-onyx text-white px-5 py-2.5 rounded-full shadow-2xl hover:scale-105 transition-transform"
        >
          <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
            <Recycle className="w-4 h-4 text-onyx" />
          </div>
          <span className="font-bold text-lg tracking-tight">
            Circu<span className="text-emerald-400">Link</span>
          </span>
        </Link>

        {/* Menu Trigger Button */}
        <div className="pointer-events-auto flex items-center gap-3">
          <Link href="/login" className="hidden sm:inline-flex">
            <Button variant="ghost" className="rounded-full px-5 py-2 text-onyx hover:bg-black/5 font-semibold text-sm">
              Log In
            </Button>
          </Link>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="group flex items-center gap-2 bg-onyx text-white px-5 py-2.5 rounded-full shadow-2xl hover:bg-emerald-600 transition-colors cursor-pointer"
            aria-label="Toggle Menu"
          >
            <span className="text-xs uppercase font-bold tracking-wider">
              {isMenuOpen ? "Close" : "Menu"}
            </span>
            <div className="w-5 h-5 flex flex-col justify-center gap-1">
              {isMenuOpen ? (
                <X className="w-5 h-5 text-emerald-400" />
              ) : (
                <>
                  <div className="w-5 h-0.5 bg-white group-hover:bg-emerald-300 transition-all" />
                  <div className="w-3.5 h-0.5 bg-emerald-400 group-hover:w-5 transition-all" />
                  <div className="w-5 h-0.5 bg-white group-hover:bg-emerald-300 transition-all" />
                </>
              )}
            </div>
          </button>
        </div>
      </header>

      {/* Fullscreen Overlay Menu (b-egg modal_wrapper clone) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-onyx text-white flex flex-col justify-between p-8 sm:p-16 animate-fade-in">
          {/* Top Header Placeholder */}
          <div className="h-16" />

          {/* Navigation Links Grid */}
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 my-auto items-center">
            <div className="lg:col-span-8 flex flex-col space-y-4">
              {[
                { label: "HOME", href: "#" },
                { label: "ABOUT US", href: "#about" },
                { label: "SOLUTIONS", href: "#solutions" },
                { label: "AI ENGINE", href: "#features" },
                { label: "ANALYTICS", href: "#impact" },
              ].map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="editorial-title text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-slate-300 hover:text-emerald-400 transition-colors uppercase cursor-pointer"
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* Contact & Platform Quick Info */}
            <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-slate-800 pt-8 lg:pt-0 lg:pl-12 space-y-8 text-slate-300">
              <div>
                <p className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-2">
                  Get in Touch
                </p>
                <a href="mailto:connect@circulink.ai" className="text-lg hover:text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-400" /> connect@circulink.ai
                </a>
                <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-400" /> +1 (800) 555-CIRC
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-2">
                  Headquarters
                </p>
                <p className="text-sm text-slate-300 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                  Circular Operations Hub<br />350 Mission St, San Francisco, CA 94105
                </p>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                  <Button className="bg-emerald-500 hover:bg-emerald-400 text-onyx font-bold rounded-full px-6 py-3">
                    Launch Platform <ArrowUpRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Footer Info inside Overlay */}
          <div className="max-w-7xl mx-auto w-full border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
            <span>© 2026 CircuLink Inc. All rights reserved.</span>
            <span className="text-emerald-400 font-mono">B2B CIRCULAR ECONOMY ENGINE</span>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. HERO SECTION (b-egg hero_section & container_hero clone)   */}
      {/* ------------------------------------------------------------- */}
      <section className="relative pt-32 sm:pt-44 pb-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-5xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            AI-POWERED INDUSTRIAL MATERIAL LOOPS
          </div>

          {/* Masked Editorial Heading Reveal */}
          <div className="space-y-1">
            <div className="h1-mask">
              <h1 className="h1-mask-text editorial-title text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase text-onyx">
                A NEW ERA
              </h1>
            </div>
            <div className="h1-mask">
              <h1
                className="h1-mask-text editorial-title text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase text-emerald-600"
                style={{ animationDelay: "0.15s" }}
              >
                FOR CIRCULAR
              </h1>
            </div>
            <div className="h1-mask">
              <h1
                className="h1-mask-text editorial-title text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase text-onyx"
                style={{ animationDelay: "0.3s" }}
              >
                SUPPLY CHAINS
              </h1>
            </div>
          </div>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-slate-700 text-base sm:text-xl font-normal leading-relaxed pt-4">
            Transforming industrial waste streams into high-value B2B raw materials through real-time Gemini AI matchmaking and Scope-3 carbon tracking.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
            <Link href="/signup">
              <Button className="bg-onyx hover:bg-slate-800 text-white rounded-full px-8 py-6 text-base font-semibold shadow-xl hover:scale-105 transition-transform flex items-center gap-2">
                Get Started Free <ArrowRight className="w-5 h-5 text-emerald-400" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="outline" className="border-onyx-subtle text-onyx hover:bg-black/5 rounded-full px-8 py-6 text-base font-semibold">
                Explore Technology
              </Button>
            </a>
          </div>
        </div>

        {/* Dynamic Graphic Element (replacing b-egg video) */}
        <CircularHeroGraphic />
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. METRIC HIGHLIGHT BANNER (b-egg milk_section_top clone)     */}
      {/* ------------------------------------------------------------- */}
      <section className="bg-onyx text-white py-20 px-4 sm:px-8 relative overflow-hidden rounded-[2.5rem] max-w-[96%] mx-auto my-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
                CIRCULAR PERFORMANCE INDEX
              </span>
              <h2 className="editorial-title text-4xl sm:text-6xl font-black tracking-tight text-white uppercase mt-2">
                Energy & Material Value
              </h2>
            </div>
            <p className="text-slate-400 max-w-md text-sm sm:text-base">
              Real-time measurement of avoided landfill tonnage, net CO₂ offset, and autonomous AI exchange efficiency across global supply networks.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-8 border-t border-slate-800">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                CARBON OFFSET
              </span>
              <div>
                <MetricCounter target={42.8} suffix=" MT" decimals={1} />
              </div>
              <p className="text-xs text-emerald-400 font-medium">Metric Tons CO₂e Avoided</p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                RESOURCE RECOVERY
              </span>
              <div>
                <MetricCounter target={98.4} suffix="%" decimals={1} />
              </div>
              <p className="text-xs text-emerald-400 font-medium">B2B Material Utilization</p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                AI MATCH ACCURACY
              </span>
              <div>
                <MetricCounter target={99.2} suffix="%" decimals={1} />
              </div>
              <p className="text-xs text-emerald-400 font-medium">Gemini Material Pairings</p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                CIRCULATED MATERIALS
              </span>
              <div>
                <MetricCounter target={14.5} suffix="k T" decimals={1} />
              </div>
              <p className="text-xs text-emerald-400 font-medium">Industrial Inputs Saved</p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 4. MATERIAL MATRIX GRID (b-egg physics_section clone)          */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs uppercase tracking-widest text-emerald-700 font-bold">
            MATERIAL ELEMENT MATRIX
          </span>
          <h2 className="editorial-title text-4xl sm:text-6xl font-black tracking-tight uppercase text-onyx">
            Physics of Circularity
          </h2>
          <p className="text-slate-600 text-base">
            Categorized industrial inputs verified for chemical purity, lab certification, and automated matching.
          </p>
        </div>

        {/* Matrix Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {materialMatrix.map((item, idx) => (
            <div
              key={idx}
              className="group bg-white border border-onyx-subtle rounded-2xl p-6 hover:bg-onyx hover:text-white transition-all duration-300 shadow-sm hover:shadow-xl cursor-pointer flex flex-col justify-between h-40"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-mono font-bold text-emerald-600 group-hover:text-emerald-400">
                  {item.code}
                </span>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <div>
                <h3 className="editorial-title text-xl sm:text-2xl font-bold uppercase tracking-tight mb-1">
                  {item.name}
                </h3>
                <span className="text-[11px] font-medium text-slate-500 group-hover:text-slate-400">
                  {item.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 5. INFINITE TICKER MARQUEE BAR                                 */}
      {/* ------------------------------------------------------------- */}
      <div className="py-6 bg-onyx text-white overflow-hidden border-y border-slate-800 my-12">
        <div className="animate-ticker flex items-center gap-8">
          {[
            "ZERO WASTE CERTIFIED",
            "GEMINI AI MATCHING",
            "SCOPE 3 AUTOMATED",
            "CLOSED-LOOP PROVENANCE",
            "100% RECYCLABLE INPUTS",
            "REAL-TIME CARBON ANALYTICS",
            "B2B RESOURCE NETWORK",
            "ZERO WASTE CERTIFIED",
            "GEMINI AI MATCHING",
            "SCOPE 3 AUTOMATED",
            "CLOSED-LOOP PROVENANCE",
            "100% RECYCLABLE INPUTS",
            "REAL-TIME CARBON ANALYTICS",
            "B2B RESOURCE NETWORK",
          ].map((text, i) => (
            <div key={i} className="flex items-center gap-8 whitespace-nowrap">
              <span className="badge-pill bg-slate-800 text-emerald-400 border border-slate-700 font-mono text-xs uppercase tracking-wider">
                {text}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 6. INTERACTIVE FEATURE ACCORDIONS (b-egg feature accordion)   */}
      {/* ------------------------------------------------------------- */}
      <section id="features" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-emerald-700 font-bold">
              PLATFORM CAPABILITIES
            </span>
            <h2 className="editorial-title text-4xl sm:text-6xl font-black tracking-tight uppercase text-onyx mt-2">
              Engineered for Scale
            </h2>
          </div>
          <p className="text-slate-600 max-w-md text-base">
            Click to explore how CircuLink streamlines B2B material trading, automated certification, and verified ESG compliance.
          </p>
        </div>

        {/* Accordions Stack */}
        <div className="space-y-6">
          {[
            {
              title: "EASY MATCHING",
              metric: "98% MATCH RATE",
              summary: "Automated B2B Material Pairing via Gemini AI",
              description:
                "Upload excess raw materials or secondary waste streams. Our multimodal Gemini AI engine instantly analyzes material chemical specs, location proximity, and buyer requirements to make high-confidence matches in seconds.",
            },
            {
              title: "COMPACT TRACEABILITY",
              metric: "100% CHAIN-OF-CUSTODY",
              summary: "Digital Product Passports & Lab Verification",
              description:
                "Every batch circulating on CircuLink carries an immutable digital passport containing lab purity analysis, supplier provenance, transportation telemetry, and chain-of-custody documentation.",
            },
            {
              title: "PREMIUM QUALITY",
              metric: "ZERO VIRGIN RELIANCE",
              summary: "OEM-Grade Recycled Material Guarantee",
              description:
                "Eliminate reliance on virgin raw inputs. All recycled material matches undergo automated compliance filtering to ensure zero performance degradation for high-precision manufacturing.",
            },
          ].map((item, idx) => {
            const isOpen = activeAccordion === idx;
            return (
              <div
                key={idx}
                className={`border rounded-3xl transition-all duration-300 overflow-hidden ${
                  isOpen ? "bg-white border-onyx shadow-xl" : "bg-sand border-onyx-subtle hover:border-slate-400"
                }`}
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-8 flex items-center justify-between text-left cursor-pointer select-none"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-bold text-emerald-600 uppercase tracking-widest">
                      FEATURE {idx + 1} • {item.metric}
                    </span>
                    <h3 className="editorial-title text-3xl sm:text-5xl font-black uppercase text-onyx tracking-tight">
                      {item.title}
                    </h3>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-full border border-onyx flex items-center justify-center transition-transform duration-300 ${
                      isOpen ? "bg-onyx text-white rotate-180" : "bg-white text-onyx"
                    }`}
                  >
                    <ChevronDown className="w-6 h-6" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-8 pb-8 pt-2 border-t border-slate-100 text-slate-700 animate-slide-up space-y-4">
                    <p className="text-lg font-semibold text-onyx">{item.summary}</p>
                    <p className="text-base leading-relaxed max-w-3xl text-slate-600">
                      {item.description}
                    </p>
                    <div className="pt-2">
                      <Link href="/signup">
                        <Button className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-full px-6 py-2.5 text-sm font-semibold">
                          Explore {item.title} <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 7. SHOWCASE CTA BANNER (b-egg eggs_section clone)             */}
      {/* ------------------------------------------------------------- */}
      <section className="py-24 px-4 sm:px-8 bg-onyx text-white rounded-[2.5rem] max-w-[96%] mx-auto my-16 relative overflow-hidden text-center shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/40 via-onyx to-onyx pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
            READY TO CLOSE THE LOOP?
          </span>
          <h2 className="editorial-title text-4xl sm:text-7xl font-black uppercase tracking-tight leading-none text-white">
            THE BEST OF SUSTAINABLE SUPPLY CHAINS
          </h2>
          <p className="text-slate-300 text-base sm:text-xl max-w-2xl mx-auto">
            Join leading enterprise manufacturers and recyclers standardizing on CircuLink for circular material sourcing and automated ESG reporting.
          </p>
          <div className="pt-4 flex justify-center">
            <Link href="/signup">
              <Button className="bg-emerald-500 hover:bg-emerald-400 text-onyx font-bold text-lg rounded-full px-10 py-7 shadow-2xl hover:scale-105 transition-transform flex items-center gap-3">
                Get Started Now <ArrowRight className="w-6 h-6" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 8. EDITORIAL FOOTER (b-egg footer-light clone)                 */}
      {/* ------------------------------------------------------------- */}
      <footer className="bg-sand text-onyx pt-20 pb-12 border-t border-onyx-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
          {/* Top Newsletter Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-2">
              <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-widest">
                NEWSLETTER & INSIGHTS
              </span>
              <h3 className="editorial-title text-4xl sm:text-5xl font-black uppercase tracking-tight">
                Don't Miss New Circular Updates
              </h3>
            </div>
            <div className="lg:col-span-6">
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  placeholder="Enter your corporate email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white border border-onyx-subtle rounded-full px-6 py-4 text-onyx placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
                <Button type="submit" className="bg-onyx hover:bg-slate-800 text-white rounded-full px-8 py-4 font-bold text-sm">
                  Subscribe
                </Button>
              </form>
              {subscribed && (
                <p className="text-xs text-emerald-600 font-semibold mt-2 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Thank you! You're subscribed to CircuLink insights.
                </p>
              )}
            </div>
          </div>

          <div className="border-t border-onyx-subtle" />

          {/* Links Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 text-sm">
            {/* Column 1: Brand & Contact */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center">
                  <Recycle className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight">
                  Circu<span className="text-emerald-600">Link</span>
                </span>
              </div>
              <p className="text-slate-600 text-sm max-w-sm">
                The AI-powered B2B circular economy platform connecting material suppliers with sustainable manufacturers worldwide.
              </p>
              <div className="text-xs space-y-1 text-slate-500 font-mono pt-2">
                <p>CONTACT: connect@circulink.ai</p>
                <p>PHONE: +1 (800) 555-CIRC</p>
                <p>HUB: 350 Mission St, San Francisco, CA</p>
              </div>
            </div>

            {/* Column 2: Navigation Links */}
            <div className="md:col-span-3 space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                PLATFORM
              </p>
              <ul className="space-y-2 font-medium text-slate-700">
                <li><a href="#about" className="hover:text-emerald-600 transition-colors">WHO WE ARE</a></li>
                <li><a href="#features" className="hover:text-emerald-600 transition-colors">AI MATCHING ENGINE</a></li>
                <li><a href="#features" className="hover:text-emerald-600 transition-colors">MATERIAL PASSPORTS</a></li>
                <li><a href="#impact" className="hover:text-emerald-600 transition-colors">SCOPE 3 ANALYTICS</a></li>
              </ul>
            </div>

            {/* Column 3: Legal & Social */}
            <div className="md:col-span-4 space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                COMPLIANCE & GOVERNANCE
              </p>
              <ul className="space-y-2 font-medium text-slate-700">
                <li><a href="#" className="hover:text-emerald-600 transition-colors">PRIVACY POLICY</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">TERMS OF SERVICE</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">SECURITY & SOC2</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">ESG CERTIFICATIONS</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-onyx-subtle pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
            <p>© 2026 CircuLink Inc. Built for the Circular Economy.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-onyx transition-colors">TWITTER / X</a>
              <a href="#" className="hover:text-onyx transition-colors">LINKEDIN</a>
              <a href="#" className="hover:text-onyx transition-colors">GITHUB</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
