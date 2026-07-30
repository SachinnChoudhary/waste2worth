"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Recycle, Eye, EyeOff, Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const industrySectors = [
  "Manufacturing",
  "Construction",
  "Automotive",
  "Electronics",
  "Textiles & Apparel",
  "Food & Beverage",
  "Agriculture",
  "Mining & Metals",
  "Chemical Processing",
  "Packaging",
  "Energy",
  "Pharmaceuticals",
  "Recycling & Waste Management",
  "Other",
];

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    industrySector: "",
    companyType: "BOTH" as "SELLER" | "BUYER" | "BOTH",
    registrationNumber: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    phone: "",
    website: "",
  });

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Registration successful! Please log in.");
        router.push("/login");
      } else {
        toast.error(data.error || "Registration failed");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/30 px-4 py-12">
      <div className="absolute top-20 right-20 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-teal-200/20 rounded-full blur-3xl" />

      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <Recycle className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900">
              Circu<span className="text-emerald-600">Link</span>
            </span>
          </Link>
        </div>

        <Card className="shadow-xl border-slate-200/50">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>
              Step {step} of 2 — {step === 1 ? "Personal & Company Info" : "Address & Details"}
            </CardDescription>
            {/* Progress bar */}
            <div className="flex gap-2 mt-4">
              <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? "bg-emerald-500" : "bg-slate-200"}`} />
              <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? "bg-emerald-500" : "bg-slate-200"}`} />
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={form.name}
                        onChange={(e) => updateForm("name", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@company.com"
                        value={form.email}
                        onChange={(e) => updateForm("email", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Min 8 characters"
                          value={form.password}
                          onChange={(e) => updateForm("password", e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={form.confirmPassword}
                        onChange={(e) => updateForm("confirmPassword", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      placeholder="Acme Industries"
                      value={form.companyName}
                      onChange={(e) => updateForm("companyName", e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Industry Sector</Label>
                      <Select
                        value={form.industrySector}
                        onValueChange={(v) => updateForm("industrySector", v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select sector" />
                        </SelectTrigger>
                        <SelectContent>
                          {industrySectors.map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Business Type</Label>
                      <Select
                        value={form.companyType}
                        onValueChange={(v) => updateForm("companyType", v)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SELLER">Waste Seller</SelectItem>
                          <SelectItem value="BUYER">Material Buyer</SelectItem>
                          <SelectItem value="BOTH">Both (Sell & Buy)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    type="button"
                    className="w-full"
                    onClick={() => {
                      if (!form.name || !form.email || !form.password || !form.companyName || !form.industrySector) {
                        toast.error("Please fill in all required fields");
                        return;
                      }
                      setStep(2);
                    }}
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Business Address</Label>
                    <Textarea
                      id="address"
                      placeholder="Full street address"
                      value={form.address}
                      onChange={(e) => updateForm("address", e.target.value)}
                      required
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        placeholder="City"
                        value={form.city}
                        onChange={(e) => updateForm("city", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State / Province</Label>
                      <Input
                        id="state"
                        placeholder="State"
                        value={form.state}
                        onChange={(e) => updateForm("state", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        placeholder="Country"
                        value={form.country}
                        onChange={(e) => updateForm("country", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        placeholder="12345"
                        value={form.postalCode}
                        onChange={(e) => updateForm("postalCode", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        placeholder="+1 (555) 000-0000"
                        value={form.phone}
                        onChange={(e) => updateForm("phone", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="regNum">Registration Number</Label>
                      <Input
                        id="regNum"
                        placeholder="Optional"
                        value={form.registrationNumber}
                        onChange={(e) => updateForm("registrationNumber", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      placeholder="https://your-company.com"
                      value={form.website}
                      onChange={(e) => updateForm("website", e.target.value)}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setStep(1)}
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </Button>
                    <Button type="submit" className="flex-1" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </form>

            <div className="mt-6 text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
