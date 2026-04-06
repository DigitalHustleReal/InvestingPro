"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import {
  Shield,
  CheckCircle,
  XCircle,
  RefreshCw,
  Server,
  Brain,
  CreditCard,
  Mail,
  Database,
  BarChart3,
  Globe,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

interface EnvVar {
  key: string;
  configured: boolean;
  label: string;
}

interface EnvGroup {
  label: string;
  description: string;
  vars: EnvVar[];
}

interface VaultData {
  groups: EnvGroup[];
  summary: { configured: number; total: number; percentage: number };
}

const groupIcons: Record<string, React.ReactNode> = {
  "Database (Supabase)": <Database className="w-5 h-5" />,
  "AI Providers": <Brain className="w-5 h-5" />,
  "Payments (Stripe)": <CreditCard className="w-5 h-5" />,
  "Email (Resend)": <Mail className="w-5 h-5" />,
  "Cache (Upstash Redis)": <Database className="w-5 h-5" />,
  "Monitoring & Analytics": <BarChart3 className="w-5 h-5" />,
  Application: <Globe className="w-5 h-5" />,
  "Event System": <Zap className="w-5 h-5" />,
};

export default function CredentialVaultPage() {
  const { data, isLoading, refetch, isRefetching } = useQuery<VaultData>({
    queryKey: ["vault-status"],
    queryFn: async () => {
      const res = await fetch("/api/admin/settings/vault");
      if (!res.ok) throw new Error("Failed to fetch vault status");
      return res.json();
    },
  });

  const handleRefresh = () => {
    refetch();
    toast.success("Environment status refreshed");
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-500/10 dark:bg-primary-500/10 rounded-lg text-primary-500">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground dark:text-foreground">
                Environment Vault
              </h1>
              <p className="text-muted-foreground dark:text-muted-foreground">
                Configuration status for all integrations (values are never
                exposed)
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefetching}
            className="gap-2"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {/* Summary Card */}
        {data?.summary && (
          <Card className="bg-card dark:bg-card border-border/50 dark:border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16">
                    <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-muted/30 dark:text-muted/30"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      />
                      <path
                        className={
                          data.summary.percentage >= 80
                            ? "text-emerald-500"
                            : data.summary.percentage >= 50
                              ? "text-amber-500"
                              : "text-rose-500"
                        }
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray={`${data.summary.percentage}, 100`}
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-foreground dark:text-foreground">
                      {data.summary.percentage}%
                    </span>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-foreground dark:text-foreground">
                      {data.summary.configured} of {data.summary.total}{" "}
                      variables configured
                    </p>
                    <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                      {data.summary.percentage >= 80
                        ? "All critical integrations are ready"
                        : data.summary.percentage >= 50
                          ? "Some integrations need configuration"
                          : "Many integrations are not yet configured"}
                    </p>
                  </div>
                </div>
                <Badge
                  className={
                    data.summary.percentage >= 80
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      : data.summary.percentage >= 50
                        ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                  }
                >
                  {data.summary.percentage >= 80
                    ? "Healthy"
                    : data.summary.percentage >= 50
                      ? "Partial"
                      : "Needs Setup"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Card
                key={i}
                className="bg-card dark:bg-card border-border/50 dark:border-border/50 animate-pulse"
              >
                <CardContent className="p-6">
                  <div className="h-6 bg-muted/50 dark:bg-muted/50 rounded w-1/4 mb-4" />
                  <div className="space-y-3">
                    <div className="h-4 bg-muted/30 dark:bg-muted/30 rounded w-3/4" />
                    <div className="h-4 bg-muted/30 dark:bg-muted/30 rounded w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Integration Groups */}
        {data?.groups && (
          <div className="space-y-4">
            {data.groups.map((group) => {
              const configuredCount = group.vars.filter(
                (v) => v.configured,
              ).length;
              const allConfigured = configuredCount === group.vars.length;
              const noneConfigured = configuredCount === 0;

              return (
                <Card
                  key={group.label}
                  className="bg-card dark:bg-card border-border/50 dark:border-border/50"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold text-foreground dark:text-foreground flex items-center gap-3">
                        <span
                          className={
                            allConfigured
                              ? "text-emerald-500"
                              : noneConfigured
                                ? "text-muted-foreground dark:text-muted-foreground"
                                : "text-amber-500"
                          }
                        >
                          {groupIcons[group.label] || (
                            <Server className="w-5 h-5" />
                          )}
                        </span>
                        {group.label}
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className={
                          allConfigured
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : noneConfigured
                              ? "bg-muted/30 text-muted-foreground border-border"
                              : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        }
                      >
                        {configuredCount}/{group.vars.length}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                      {group.description}
                    </p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="divide-y divide-border/50 dark:divide-border/50">
                      {group.vars.map((v) => (
                        <div
                          key={v.key}
                          className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                        >
                          <div className="flex items-center gap-3">
                            {v.configured ? (
                              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            ) : (
                              <XCircle className="w-4 h-4 text-muted-foreground/50 dark:text-muted-foreground/50 flex-shrink-0" />
                            )}
                            <div>
                              <p
                                className={`text-sm font-medium ${
                                  v.configured
                                    ? "text-foreground dark:text-foreground"
                                    : "text-muted-foreground dark:text-muted-foreground"
                                }`}
                              >
                                {v.label}
                              </p>
                              <p className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70 font-mono">
                                {v.key}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className={
                              v.configured
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-xs"
                                : "bg-muted/20 text-muted-foreground/60 border-border/50 text-xs"
                            }
                          >
                            {v.configured ? "Configured" : "Not Set"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Security Note */}
        <div className="text-center text-xs text-muted-foreground/60 dark:text-muted-foreground/60 py-4">
          <Shield className="w-3 h-3 inline-block mr-1" />
          Only boolean status is shown. Actual secret values are never
          transmitted to the browser.
        </div>
      </div>
    </AdminLayout>
  );
}
