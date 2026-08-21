import { useState } from "react";
import {
  Settings,
  Shield,
  Bell,
  Key,
  Moon,
  Sun,
  Lock,
  Trash2,
  Check,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/lib/ui/card";
import { Button } from "@/lib/ui/button";
import { Input } from "@/lib/ui/input";
import { Switch } from "@/lib/ui/switch";
import { PageHeader } from "@/components/layout/PageHeader";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

export function AccountSettingsPage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [saved, setSaved] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setIsChangingPassword(false);
    }, 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <PageHeader
        title="Account Settings"
        description="Manage your security options, password, notification preferences, and account controls"
      />

      {/* Security & Password */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-[var(--accent)]" />
              <div>
                <CardTitle>Security & Credentials</CardTitle>
                <CardDescription>
                  Update your password and authentication settings
                </CardDescription>
              </div>
            </div>
            {!isChangingPassword && (
              <Button
                onClick={() => setIsChangingPassword(true)}
                variant="outline"
                size="sm"
              >
                Change Password
              </Button>
            )}
          </div>
        </CardHeader>
        {isChangingPassword && (
          <CardContent className="space-y-4 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-[var(--text-secondary)]">
                  Current Password
                </label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-[var(--text-secondary)]">
                  New Password
                </label>
                <Input type="password" placeholder="••••••••" />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm">
                {saved ? (
                  <>
                    <Check className="h-4 w-4 mr-1 text-emerald-400" /> Saved
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
              <Button
                onClick={() => setIsChangingPassword(false)}
                variant="ghost"
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Theme & Display Preferences */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-[var(--accent)]" />
            <div>
              <CardTitle>Display & Environment</CardTitle>
              <CardDescription>
                Customize your workspace theme and preference options
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="settings-row flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                Interface Theme
              </p>
              <p className="text-xs text-[var(--text-tertiary)]">
                Toggle between Light and Dark mode appearance
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Sun
                className={`h-4 w-4 ${theme === "light" ? "text-amber-400" : "text-[var(--text-tertiary)]"}`}
              />
              <Switch
                checked={theme === "dark"}
                onCheckedChange={toggleTheme}
              />
              <Moon
                className={`h-4 w-4 ${theme === "dark" ? "text-cyan-400" : "text-[var(--text-tertiary)]"}`}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-[var(--accent)]" />
            <div>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose what notifications you receive via email and dashboard
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              title: "Agent Status Updates",
              desc: "Notify when agents finish processing tasks or encounter errors",
            },
            {
              title: "Deployment Health Alerts",
              desc: "Alerts when container deployments restart or exceed threshold limits",
            },
            {
              title: "Billing & Usage Alerts",
              desc: "Alerts when compute credits or monthly limits are near exhaustion",
            },
          ].map((n) => (
            <div
              key={n.title}
              className="settings-row flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  {n.title}
                </p>
                <p className="text-xs text-[var(--text-tertiary)]">{n.desc}</p>
              </div>
              <Switch defaultChecked />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-500/20 bg-red-500/5">
        <CardHeader>
          <CardTitle className="text-red-400">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible actions for your user account
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">
              Delete Account
            </p>
            <p className="text-xs text-[var(--text-tertiary)]">
              Permanently delete your account, agents, and deployments
            </p>
          </div>
          <Button
            variant="outline"
            className="border-red-500/40 text-red-400 hover:bg-red-500/20"
          >
            <Trash2 className="h-4 w-4 mr-1" /> Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
