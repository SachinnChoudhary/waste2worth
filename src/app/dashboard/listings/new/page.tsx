"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Sparkles,
  Leaf,
  DollarSign,
  Factory,
  Tag,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { wasteCategoryLabels, formatCurrency } from "@/lib/utils";

export default function NewListingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<Record<string, unknown> | null>(null);
  const [form, setForm] = useState({
    title: "",
    wasteType: "",
    category: "",
    subCategory: "",
    description: "",
    hazardClass: "NONE",
    condition: "",
    quantity: "",
    unit: "kg",
    isRecurring: false,
    availabilityDate: "",
    location: "",
    geoLat: undefined as number | undefined,
    geoLng: undefined as number | undefined,
    priceExpectation: "",
    minimumBid: "",
    openToOffers: true,
    images: [] as string[],
  });

  const updateForm = (field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const runAIAnalysis = async () => {
    setAnalyzing(true);
    try {
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: form.description,
          category: form.category,
          quantity: parseFloat(form.quantity) || 1000,
          condition: form.condition,
          location: form.location,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAiResult(data.data);
        toast.success("AI analysis complete!");
      }
    } catch {
      toast.error("AI analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  const handlePublish = async () => {
    setLoading(true);
    try {
      const classification = aiResult?.classification as Record<string, unknown> | undefined;
      const valueEstimate = aiResult?.valueEstimate as Record<string, unknown> | undefined;
      const impact = aiResult?.environmentalImpact as Record<string, unknown> | undefined;
      const recommendations = aiResult?.industryRecommendations as Array<Record<string, unknown>> | undefined;

      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          quantity: parseFloat(form.quantity),
          priceExpectation: form.priceExpectation ? parseFloat(form.priceExpectation) : null,
          minimumBid: form.minimumBid ? parseFloat(form.minimumBid) : null,
          aiTags: classification?.tags || [],
          aiSuggestedIndustries: recommendations?.map((r) => r.industry) || [],
          aiEstimatedValue: valueEstimate
            ? ((valueEstimate.estimatedValue as Record<string, number>).min + (valueEstimate.estimatedValue as Record<string, number>).max) / 2
            : null,
          aiEstimatedCo2Savings: (impact?.co2Avoided as number) || null,
          aiClassificationData: aiResult || null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Listing published successfully!");
        router.push("/dashboard/listings");
      } else {
        toast.error(data.error || "Failed to publish listing");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const totalSteps = 5;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Create Waste Listing</h1>
          <p className="text-sm text-slate-500">Step {step} of {totalSteps}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-1.5">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i < step ? "bg-emerald-500" : "bg-slate-200"
            }`}
          />
        ))}
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Listing Title</Label>
              <Input
                placeholder="e.g., 5 tons of clean steel scrap"
                value={form.title}
                onChange={(e) => updateForm("title", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Waste Category</Label>
                <Select value={form.category} onValueChange={(v) => updateForm("category", v)}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(wasteCategoryLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Hazard Classification</Label>
                <Select value={form.hazardClass} onValueChange={(v) => updateForm("hazardClass", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NONE">Non-Hazardous</SelectItem>
                    <SelectItem value="CLASS_1">Class 1 - Explosives</SelectItem>
                    <SelectItem value="CLASS_3">Class 3 - Flammable</SelectItem>
                    <SelectItem value="CLASS_6">Class 6 - Toxic</SelectItem>
                    <SelectItem value="CLASS_8">Class 8 - Corrosive</SelectItem>
                    <SelectItem value="CLASS_9">Class 9 - Misc.</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description (AI will analyze this)</Label>
              <Textarea
                placeholder="Describe the waste material in detail — composition, source, any special properties..."
                value={form.description}
                onChange={(e) => updateForm("description", e.target.value)}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>Condition</Label>
              <Input
                placeholder="e.g., Clean, sorted, dry"
                value={form.condition}
                onChange={(e) => updateForm("condition", e.target.value)}
              />
            </div>
            <Button
              className="w-full"
              onClick={() => {
                if (!form.title || !form.category || !form.description) {
                  toast.error("Please fill in all required fields");
                  return;
                }
                setStep(2);
              }}
            >
              Continue <ArrowRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Quantity & Availability */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Quantity & Availability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  placeholder="e.g., 5000"
                  value={form.quantity}
                  onChange={(e) => updateForm("quantity", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Unit</Label>
                <Select value={form.unit} onValueChange={(v) => updateForm("unit", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kilograms (kg)</SelectItem>
                    <SelectItem value="ton">Metric Tons</SelectItem>
                    <SelectItem value="liter">Liters</SelectItem>
                    <SelectItem value="unit">Units</SelectItem>
                    <SelectItem value="m3">Cubic Meters (m³)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Availability Date</Label>
              <Input
                type="date"
                value={form.availabilityDate}
                onChange={(e) => updateForm("availabilityDate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Pickup Location</Label>
              <Input
                placeholder="City, State, Country"
                value={form.location}
                onChange={(e) => updateForm("location", e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <Button className="flex-1" onClick={() => {
                if (!form.quantity || !form.location) {
                  toast.error("Quantity and location are required");
                  return;
                }
                setStep(3);
              }}>
                Continue <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Pricing */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Expected Price (USD)</Label>
                <Input
                  type="number"
                  placeholder="Leave empty for 'open to offers'"
                  value={form.priceExpectation}
                  onChange={(e) => updateForm("priceExpectation", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Minimum Bid (USD)</Label>
                <Input
                  type="number"
                  placeholder="Optional"
                  value={form.minimumBid}
                  onChange={(e) => updateForm("minimumBid", e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <Button className="flex-1" onClick={() => { setStep(4); runAIAnalysis(); }}>
                Run AI Analysis <Sparkles className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: AI Analysis */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              AI Analysis Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analyzing ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-4" />
                <p className="text-slate-600">Analyzing your waste listing with AI...</p>
                <p className="text-xs text-slate-400 mt-1">This may take a few seconds</p>
              </div>
            ) : aiResult ? (
              <div className="space-y-6">
                {/* Classification */}
                <div className="p-4 rounded-lg bg-slate-50 border">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-4 h-4 text-blue-500" />
                    <h3 className="font-semibold text-slate-900">Classification & Tags</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {((aiResult.classification as Record<string, unknown>)?.tags as string[] || []).map((tag: string) => (
                      <Badge key={tag} variant="default">{tag}</Badge>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Confidence: {(((aiResult.classification as Record<string, unknown>)?.confidence as number || 0) * 100).toFixed(0)}%
                  </p>
                </div>

                {/* Value Estimate */}
                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-2 mb-3">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <h3 className="font-semibold text-slate-900">Estimated Market Value</h3>
                  </div>
                  <p className="text-2xl font-bold text-emerald-600">
                    {formatCurrency(((aiResult.valueEstimate as Record<string, unknown>)?.estimatedValue as Record<string, number>)?.min || 0)} — {formatCurrency(((aiResult.valueEstimate as Record<string, unknown>)?.estimatedValue as Record<string, number>)?.max || 0)}
                  </p>
                  <p className="text-sm text-slate-600 mt-1">
                    Disposal cost avoided: {formatCurrency(((aiResult.valueEstimate as Record<string, unknown>)?.disposalCostAvoided as number) || 0)}
                  </p>
                </div>

                {/* Environmental Impact */}
                <div className="p-4 rounded-lg bg-cyan-50 border border-cyan-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Leaf className="w-4 h-4 text-cyan-600" />
                    <h3 className="font-semibold text-slate-900">Environmental Impact</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-lg font-bold text-cyan-700">
                        {((aiResult.environmentalImpact as Record<string, unknown>)?.co2Avoided as number || 0).toLocaleString()} kg
                      </p>
                      <p className="text-xs text-slate-500">CO₂ emissions avoided</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-cyan-700">
                        {((aiResult.environmentalImpact as Record<string, unknown>)?.landfillDiverted as number || 0).toLocaleString()} kg
                      </p>
                      <p className="text-xs text-slate-500">Landfill diversion</p>
                    </div>
                  </div>
                </div>

                {/* Industry Recommendations */}
                <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Factory className="w-4 h-4 text-purple-600" />
                    <h3 className="font-semibold text-slate-900">Recommended Industries</h3>
                  </div>
                  <div className="space-y-2">
                    {((aiResult.industryRecommendations as Array<Record<string, unknown>>) || []).map((rec, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm text-slate-700">{rec.industry as string}</span>
                        <Badge variant="outline">
                          {((rec.relevanceScore as number) * 100).toFixed(0)}% match
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setStep(3)}>
                    <ArrowLeft className="w-4 h-4" /> Back
                  </Button>
                  <Button className="flex-1" onClick={() => setStep(5)}>
                    Review & Publish <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-500">AI analysis not available</p>
                <Button className="mt-4" onClick={runAIAnalysis}>
                  <Sparkles className="w-4 h-4" /> Run Analysis
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 5: Review & Publish */}
      {step === 5 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              Review & Publish
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Title</p>
                <p className="font-medium text-slate-900">{form.title}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Category</p>
                <p className="font-medium text-slate-900">{wasteCategoryLabels[form.category]}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Quantity</p>
                <p className="font-medium text-slate-900">{form.quantity} {form.unit}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Location</p>
                <p className="font-medium text-slate-900">{form.location}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Price</p>
                <p className="font-medium text-slate-900">
                  {form.priceExpectation ? `$${form.priceExpectation}` : "Open to offers"}
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Hazard Class</p>
                <p className="font-medium text-slate-900">{form.hazardClass === "NONE" ? "Non-Hazardous" : form.hazardClass}</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500 mb-1">Description</p>
              <p className="text-sm text-slate-700">{form.description}</p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setStep(4)}>
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <Button className="flex-1" onClick={handlePublish} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Publishing...
                  </>
                ) : (
                  <>
                    Publish Listing <CheckCircle className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
