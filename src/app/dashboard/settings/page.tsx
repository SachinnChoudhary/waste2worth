"use client";

import { useState } from "react";
import { Settings, Bell, Lock, Shield, Save, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function SettingsPage() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [bidAlerts, setBidAlerts] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Preferences updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-emerald-600" /> Account & Security Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">Configure security credentials and notification channels</p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-600" /> Notification Preferences
            </CardTitle>
            <CardDescription>Choose how you want to be alerted about B2B activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <Label className="font-semibold text-slate-900">Email Notifications</Label>
                <p className="text-xs text-slate-500">Receive email updates for new bids and transaction updates.</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <Label className="font-semibold text-slate-900">AI Symbiosis Matches</Label>
                <p className="text-xs text-slate-500">Get notified when AI discovers multi-party circular opportunities for your waste stream.</p>
              </div>
              <input
                type="checkbox"
                checked={bidAlerts}
                onChange={(e) => setBidAlerts(e.target.checked)}
                className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
              />
            </div>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600" /> Password & Security
            </CardTitle>
            <CardDescription>Update your login password</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currPass">Current Password</Label>
                <Input
                  id="currPass"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPass">New Password</Label>
                <Input
                  id="newPass"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving} className="bg-emerald-600 text-white gap-2">
            <Save className="w-4 h-4" /> {saving ? "Saving Settings..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}
