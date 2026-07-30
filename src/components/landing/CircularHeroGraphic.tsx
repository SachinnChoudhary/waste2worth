"use client";

import { useEffect, useState } from "react";
import { Recycle, Cpu, ShieldCheck, Activity } from "lucide-react";

export default function CircularHeroGraphic() {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 0.5) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-4xl mx-auto aspect-square md:aspect-[16/9] flex items-center justify-center overflow-hidden my-6">
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-teal-400/20 rounded-full blur-2xl pointer-events-none" />

      {/* Main SVG Visualization */}
      <svg className="w-full h-full max-h-[500px] z-10" viewBox="0 0 800 500" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#059669" />
            <stop offset="100%" stopColor="#0f766e" />
          </linearGradient>

          <linearGradient id="cyanGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3" />
          </linearGradient>

          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Circular Flow Track */}
        <circle cx="400" cy="250" r="180" stroke="url(#emeraldGradient)" strokeWidth="2" strokeDasharray="8 8" opacity="0.4" />
        <circle cx="400" cy="250" r="140" stroke="#059669" strokeWidth="1.5" opacity="0.25" />
        <circle cx="400" cy="250" r="90" stroke="#34d399" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />

        {/* Rotating Circular Arc */}
        <g style={{ transform: `rotate(${rotation}deg)`, transformOrigin: "400px 250px" }}>
          <path
            d="M 220 250 A 180 180 0 0 1 580 250"
            stroke="url(#emeraldGradient)"
            strokeWidth="5"
            strokeLinecap="round"
            filter="url(#glow)"
          />
          <circle cx="580" cy="250" r="8" fill="#10b981" filter="url(#glow)" />
          <circle cx="220" cy="250" r="6" fill="#34d399" />
        </g>

        {/* Opposite Counter Rotating Arc */}
        <g style={{ transform: `rotate(${-rotation * 1.5}deg)`, transformOrigin: "400px 250px" }}>
          <path
            d="M 400 110 A 140 140 0 0 1 540 250"
            stroke="#34d399"
            strokeWidth="3"
            strokeDasharray="6 6"
            strokeLinecap="round"
          />
          <circle cx="540" cy="250" r="5" fill="#34d399" />
        </g>

        {/* Center AI Engine Core Node */}
        <circle cx="400" cy="250" r="55" fill="#0b131e" stroke="#10b981" strokeWidth="3" filter="url(#glow)" />
        <circle cx="400" cy="250" r="45" fill="url(#emeraldGradient)" opacity="0.2" />

        {/* Node Lines and Satellite Points */}
        {/* Node 1: Polymer */}
        <line x1="400" y1="250" x2="220" y2="140" stroke="#10b981" strokeWidth="1.5" opacity="0.6" strokeDasharray="3 3" />
        <circle cx="220" cy="140" r="24" fill="#0b131e" stroke="#10b981" strokeWidth="2" />

        {/* Node 2: Metal / Steel */}
        <line x1="400" y1="250" x2="580" y2="140" stroke="#10b981" strokeWidth="1.5" opacity="0.6" strokeDasharray="3 3" />
        <circle cx="580" cy="140" r="24" fill="#0b131e" stroke="#059669" strokeWidth="2" />

        {/* Node 3: Biomass */}
        <line x1="400" y1="250" x2="580" y2="360" stroke="#10b981" strokeWidth="1.5" opacity="0.6" strokeDasharray="3 3" />
        <circle cx="580" cy="360" r="24" fill="#0b131e" stroke="#34d399" strokeWidth="2" />

        {/* Node 4: Carbon Scope 3 */}
        <line x1="400" y1="250" x2="220" y2="360" stroke="#10b981" strokeWidth="1.5" opacity="0.6" strokeDasharray="3 3" />
        <circle cx="220" cy="360" r="24" fill="#0b131e" stroke="#10b981" strokeWidth="2" />
      </svg>

      {/* Floating Interactive Badge Elements over SVG */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-center z-20 pointer-events-none">
        <Recycle className="w-8 h-8 text-emerald-400 animate-spin" style={{ animationDuration: "12s" }} />
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 mt-1">WASTE2WORTH AI</span>
        <span className="text-[10px] text-slate-400">99.4% Matched</span>
      </div>

      {/* Node Badge 1 */}
      <div className="absolute top-[18%] left-[18%] md:left-[22%] bg-slate-900/90 border border-emerald-500/40 backdrop-blur-md px-3 py-1.5 rounded-full text-white flex items-center gap-2 shadow-lg z-20">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span className="text-xs font-semibold">Polymer Loop</span>
        <span className="text-[10px] text-emerald-400 font-mono">+12.4T</span>
      </div>

      {/* Node Badge 2 */}
      <div className="absolute top-[18%] right-[18%] md:right-[22%] bg-slate-900/90 border border-teal-500/40 backdrop-blur-md px-3 py-1.5 rounded-full text-white flex items-center gap-2 shadow-lg z-20">
        <Cpu className="w-3.5 h-3.5 text-teal-400" />
        <span className="text-xs font-semibold">Rare Earth Metals</span>
        <span className="text-[10px] text-teal-300 font-mono">Scope 3</span>
      </div>

      {/* Node Badge 3 */}
      <div className="absolute bottom-[20%] right-[18%] md:right-[22%] bg-slate-900/90 border border-emerald-500/40 backdrop-blur-md px-3 py-1.5 rounded-full text-white flex items-center gap-2 shadow-lg z-20">
        <Activity className="w-3.5 h-3.5 text-emerald-400" />
        <span className="text-xs font-semibold">Zero-Waste Verified</span>
      </div>

      {/* Node Badge 4 */}
      <div className="absolute bottom-[20%] left-[18%] md:left-[22%] bg-slate-900/90 border border-emerald-500/40 backdrop-blur-md px-3 py-1.5 rounded-full text-white flex items-center gap-2 shadow-lg z-20">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span className="text-xs font-semibold">ESG Passport</span>
      </div>
    </div>
  );
}
