"use client";

import React, { useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Settings,
  Save,
  Globe,
  Search,
  Key,
  Database,
  Zap,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import {
  AdminPageHeader,
  ContentSection,
  ActionButton,
} from "@/components/admin/AdminUIKit";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const [siteName, setSiteName] = React.useState("InvestingPro");
  const [siteDescription, setSiteDescription] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const supabase = createClient();

  // Load settings from DB
  useEffect(() => {
    async function loadSettings() {
      const { data } = await supabase
        .from("system_settings")
        .select("key, value")
        .in("key", ["site_name", "site_description"]);
      if (data) {
        data.forEach((s: { key: string; value: string }) => {
          if (s.key === "site_name" && s.value) setSiteName(s.value);
          if (s.key === "site_description" && s.value)
            setSiteDescription(s.value);
        });
      }
    }
    loadSettings();
  }, [supabase]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const settings = [
        { key: "site_name", value: siteName },
        { key: "site_description", value: siteDescription },
      ];
      for (const s of settings) {
        await supabase
          .from("system_settings")
          .upsert(
            {
              key: s.key,
              value: s.value,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "key" },
          );
      }
      toast.success("Settings saved!");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-8 space-y-8">
        <AdminPageHeader
          title="Settings"
          subtitle="Configure site settings and preferences"
          icon={Settings}
          iconColor="blue"
          actions={
            <ActionButton onClick={handleSave} icon={Save} disabled={saving}>
              {saving ? "Saving..." : "Save Settings"}
            </ActionButton>
          }
        />

        <div className="max-w-4xl space-y-6">
          {/* General Settings */}
          <ContentSection
            title="General Settings"
            subtitle="Basic site configuration"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-foreground/80 dark:text-foreground/80 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-muted-foreground/70 dark:text-muted-foreground/70" />{" "}
                  Site Name
                </Label>
                <Input
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="InvestingPro"
                  className="bg-muted/50 dark:bg-muted/50 border-border/70 dark:border-border/70 text-foreground dark:text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground/80 dark:text-foreground/80">
                  Site Description
                </Label>
                <Textarea
                  value={siteDescription}
                  onChange={(e) => setSiteDescription(e.target.value)}
                  placeholder="India's Best Financial Comparison Platform"
                  rows={3}
                  className="bg-muted/50 dark:bg-muted/50 border-border/70 dark:border-border/70 text-foreground dark:text-foreground"
                />
              </div>
            </div>
          </ContentSection>

          {/* SEO Settings */}
          <ContentSection
            title="SEO Settings"
            subtitle="Search engine optimization defaults"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-foreground/80 dark:text-foreground/80 flex items-center gap-2">
                  <Search className="w-4 h-4 text-muted-foreground/70 dark:text-muted-foreground/70" />{" "}
                  Default Meta Title
                </Label>
                <Input
                  placeholder="InvestingPro - Compare Financial Products"
                  className="bg-muted/50 dark:bg-muted/50 border-border/70 dark:border-border/70 text-foreground dark:text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground/80 dark:text-foreground/80">
                  Default Meta Description
                </Label>
                <Textarea
                  placeholder="Compare credit cards, loans, mutual funds, and more..."
                  rows={3}
                  className="bg-muted/50 dark:bg-muted/50 border-border/70 dark:border-border/70 text-foreground dark:text-foreground"
                />
              </div>
            </div>
          </ContentSection>

          {/* API & Integrations */}
          <ContentSection
            title="API & Integrations"
            subtitle="Third-party service connections"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground/80 dark:text-foreground/80 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-accent-500" /> OpenAI API Key
                </Label>
                <Input
                  type="password"
                  placeholder="sk-..."
                  className="bg-muted/50 dark:bg-muted/50 border-border/70 dark:border-border/70 text-foreground dark:text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground/80 dark:text-foreground/80 flex items-center gap-2">
                  <Key className="w-4 h-4 text-secondary-500" /> Google Gemini
                  Key
                </Label>
                <Input
                  type="password"
                  placeholder="AIza..."
                  className="bg-muted/50 dark:bg-muted/50 border-border/70 dark:border-border/70 text-foreground dark:text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground/80 dark:text-foreground/80 flex items-center gap-2">
                  <Database className="w-4 h-4 text-primary-500" /> Supabase URL
                </Label>
                <Input
                  placeholder="https://your-project.supabase.co"
                  className="bg-muted/50 dark:bg-muted/50 border-border/70 dark:border-border/70 text-foreground dark:text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground/80 dark:text-foreground/80 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-secondary-500" /> Supabase
                  Anon Key
                </Label>
                <Input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIs..."
                  className="bg-muted/50 dark:bg-muted/50 border-border/70 dark:border-border/70 text-foreground dark:text-foreground"
                />
              </div>
            </div>
          </ContentSection>

          {/* Environment Info */}
          <ContentSection
            title="Environment"
            subtitle="Current deployment information"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-white/5 rounded-xl border border-border dark:border-border">
                <div className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70 uppercase tracking-wider mb-1">
                  Mode
                </div>
                <div className="text-sm font-medium text-primary-400">
                  Development
                </div>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-border dark:border-border">
                <div className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70 uppercase tracking-wider mb-1">
                  Region
                </div>
                <div className="text-sm font-medium text-foreground dark:text-foreground">
                  Asia (Mumbai)
                </div>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-border dark:border-border">
                <div className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70 uppercase tracking-wider mb-1">
                  Version
                </div>
                <div className="text-sm font-medium text-foreground dark:text-foreground">
                  v1.0.0
                </div>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-border dark:border-border">
                <div className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70 uppercase tracking-wider mb-1">
                  Database
                </div>
                <div className="text-sm font-medium text-primary-400">
                  Connected
                </div>
              </div>
            </div>
          </ContentSection>
        </div>
      </div>
    </AdminLayout>
  );
}
