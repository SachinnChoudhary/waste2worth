"use client";

import { useState, useEffect } from "react";
import { User, Building2, Save, CheckCircle, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [company, setCompany] = useState<any>(null);

  const [name, setName] = useState("");
  const [industrySector, setIndustrySector] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/company/profile");
      const data = await res.json();
      if (data.success && data.data) {
        const c = data.data;
        setCompany(c);
        setName(c.name || "");
        setIndustrySector(c.industrySector || "");
        setDescription(c.description || "");
        setPhone(c.phone || "");
        setWebsite(c.website || "");
        setCity(c.city || "");
        setState(c.state || "");
      }
    } catch {
      toast.error("Failed to load company profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/company/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          industrySector,
          description,
          phone,
          website,
          city,
          state,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Profile updated successfully!");
        fetchProfile();
      } else {
        toast.error(data.error || "Failed to update profile");
      }
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-emerald-600" /> Company Profile & Passport
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage your public business identity and ESG credentials</p>
        </div>

        {company?.verificationStatus && (
          <Badge
            variant={company.verificationStatus === "APPROVED" ? "success" : "warning"}
            className="text-xs px-3 py-1 gap-1"
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Status: {company.verificationStatus}
          </Badge>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Business Details</CardTitle>
          <CardDescription>Visible to potential buyers and sellers on the marketplace</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry Sector</Label>
                <Input
                  id="industry"
                  value={industrySector}
                  onChange={(e) => setIndustrySector(e.target.value)}
                  placeholder="e.g. Chemical Manufacturing, Recycling, Automotive"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="desc">Company Description & Mission</Label>
              <Textarea
                id="desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your manufacturing process, raw material inputs, or sustainability goals..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Business Phone</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="web">Website URL</Label>
                <Input
                  id="web"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://company.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City / Industrial Region</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. San Jose"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State / Province</Label>
                <Input
                  id="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. California"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" disabled={saving} className="bg-emerald-600 text-white gap-2">
                <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
