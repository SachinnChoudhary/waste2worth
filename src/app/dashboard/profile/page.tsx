"use client";
import { User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ProfilePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Company Profile</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your company information</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Company Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input placeholder="Company name" />
            </div>
            <div className="space-y-2">
              <Label>Industry Sector</Label>
              <Input placeholder="Industry" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea placeholder="Tell others about your company..." rows={4} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input placeholder="Phone number" />
            </div>
            <div className="space-y-2">
              <Label>Website</Label>
              <Input placeholder="https://..." />
            </div>
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
