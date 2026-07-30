"use client";
import { Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your account preferences</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Account Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Email Notifications</Label>
            <p className="text-sm text-slate-500">Receive email updates for bids, transactions, and more.</p>
          </div>
          <div className="space-y-2">
            <Label>Change Password</Label>
            <div className="grid grid-cols-2 gap-4">
              <Input type="password" placeholder="Current password" />
              <Input type="password" placeholder="New password" />
            </div>
          </div>
          <Button>Save Settings</Button>
        </CardContent>
      </Card>
    </div>
  );
}
