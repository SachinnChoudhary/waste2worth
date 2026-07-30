"use client";

import { useState, useEffect } from "react";
import {
  Users,
  ArrowRight,
  Sparkles,
  Leaf,
  DollarSign,
  Loader2,
  Factory,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

interface ChainParticipant {
  companyId: string;
  companyName: string;
  role: string;
  inputMaterial: string;
  outputMaterial: string;
}

interface Chain {
  chainId: string;
  chainName: string;
  participants: ChainParticipant[];
  confidenceScore: number;
  estimatedSavings: number;
  estimatedCo2Reduction: number;
}

export default function CollaborationFinderPage() {
  const [chains, setChains] = useState<Chain[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChains() {
      try {
        const res = await fetch("/api/ai/collaboration-chains");
        const data = await res.json();
        if (data.success) setChains(data.data);
      } catch {
        // Use mock data
        const { getMockCollaborationChains } = await import("@/lib/ai/mock-data");
        setChains(getMockCollaborationChains());
      } finally {
        setLoading(false);
      }
    }
    fetchChains();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-emerald-600" />
          AI Collaboration Finder
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Discover multi-company circular supply chains where waste becomes raw material
        </p>
      </div>

      <div className="grid gap-6">
        {chains.map((chain) => (
          <Card key={chain.chainId} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    {chain.chainName}
                  </CardTitle>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge variant="default">
                      {(chain.confidenceScore * 100).toFixed(0)}% confidence
                    </Badge>
                    <span className="text-sm text-slate-600 flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5" />
                      {formatCurrency(chain.estimatedSavings)} potential savings
                    </span>
                    <span className="text-sm text-slate-600 flex items-center gap-1">
                      <Leaf className="w-3.5 h-3.5" />
                      {(chain.estimatedCo2Reduction / 1000).toFixed(1)}t CO₂ reduction
                    </span>
                  </div>
                </div>
                <Button size="sm">
                  <Zap className="w-4 h-4" /> Express Interest
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Chain visualization */}
              <div className="flex items-center justify-center gap-2 overflow-x-auto py-4">
                {chain.participants.map((participant, i) => (
                  <div key={participant.companyId} className="flex items-center gap-2">
                    <div className="flex flex-col items-center min-w-[160px]">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-2 shadow-sm">
                        <Factory className="w-7 h-7 text-emerald-600" />
                      </div>
                      <p className="text-sm font-semibold text-slate-900 text-center">
                        {participant.companyName}
                      </p>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {participant.role}
                      </Badge>
                      <div className="mt-2 text-center">
                        <p className="text-[10px] text-slate-400">Input</p>
                        <p className="text-xs text-slate-600">{participant.inputMaterial}</p>
                        <p className="text-[10px] text-slate-400 mt-1">Output</p>
                        <p className="text-xs text-emerald-600 font-medium">{participant.outputMaterial}</p>
                      </div>
                    </div>
                    {i < chain.participants.length - 1 && (
                      <div className="flex flex-col items-center mx-2">
                        <ArrowRight className="w-6 h-6 text-emerald-400" />
                        <p className="text-[10px] text-slate-400 mt-1">flows to</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {chains.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Users className="w-12 h-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                No collaboration chains found
              </h3>
              <p className="text-sm text-slate-500 text-center max-w-md">
                As more companies join and list waste, AI will discover multi-party circular supply chain
                opportunities involving your materials.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
