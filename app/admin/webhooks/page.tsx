"use client";

import React, { useState, useCallback } from "react";
import { toast } from "sonner";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminPageContainer from "@/components/admin/AdminPageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Webhook,
  Plus,
  Copy,
  Pencil,
  Trash2,
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  RefreshCw,
  Globe,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type WebhookStatus = "active" | "paused" | "failed";

interface WebhookEvent {
  id: string;
  label: string;
}

interface WebhookEndpoint {
  id: string;
  url: string;
  secret: string;
  events: string[];
  status: WebhookStatus;
  lastTriggered: string;
  successRate: number;
  active: boolean;
}

interface DeliveryLog {
  id: string;
  timestamp: string;
  event: string;
  endpoint: string;
  statusCode: number;
  responseTime: number;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const AVAILABLE_EVENTS: WebhookEvent[] = [
  { id: "article.published", label: "Article Published" },
  { id: "article.updated", label: "Article Updated" },
  { id: "article.deleted", label: "Article Deleted" },
  { id: "content.generated", label: "Content Generated" },
  { id: "scraper.completed", label: "Scraper Completed" },
  { id: "agent.completed", label: "Agent Completed" },
];

/* ------------------------------------------------------------------ */
/*  Initial data (hardcoded — backend integration later)               */
/* ------------------------------------------------------------------ */

const INITIAL_WEBHOOKS: WebhookEndpoint[] = [
  {
    id: "wh-1",
    url: "https://api.example.com/webhooks/content",
    secret: "whsec_a1b2c3d4e5f6g7h8i9j0",
    events: ["article.published", "article.updated", "content.generated"],
    status: "active",
    lastTriggered: "2026-04-05T09:12:00Z",
    successRate: 99.2,
    active: true,
  },
  {
    id: "wh-2",
    url: "https://hooks.slack.com/services/T00000/B00000/XXXXXXX",
    secret: "whsec_k1l2m3n4o5p6q7r8s9t0",
    events: ["article.published", "article.deleted"],
    status: "paused",
    lastTriggered: "2026-04-04T15:30:00Z",
    successRate: 95.1,
    active: false,
  },
  {
    id: "wh-3",
    url: "https://internal.investingpro.in/api/sync",
    secret: "whsec_u1v2w3x4y5z6a7b8c9d0",
    events: ["article.published", "scraper.completed", "agent.completed"],
    status: "failed",
    lastTriggered: "2026-04-05T08:45:00Z",
    successRate: 72.8,
    active: true,
  },
];

const INITIAL_DELIVERIES: DeliveryLog[] = [
  {
    id: "dl-1",
    timestamp: "2026-04-05T09:12:00Z",
    event: "article.published",
    endpoint: "https://api.example.com/webhooks/content",
    statusCode: 200,
    responseTime: 142,
  },
  {
    id: "dl-2",
    timestamp: "2026-04-05T08:58:00Z",
    event: "content.generated",
    endpoint: "https://api.example.com/webhooks/content",
    statusCode: 200,
    responseTime: 89,
  },
  {
    id: "dl-3",
    timestamp: "2026-04-05T08:45:00Z",
    event: "scraper.completed",
    endpoint: "https://internal.investingpro.in/api/sync",
    statusCode: 504,
    responseTime: 30000,
  },
  {
    id: "dl-4",
    timestamp: "2026-04-05T07:30:00Z",
    event: "article.updated",
    endpoint: "https://api.example.com/webhooks/content",
    statusCode: 200,
    responseTime: 156,
  },
  {
    id: "dl-5",
    timestamp: "2026-04-05T06:15:00Z",
    event: "agent.completed",
    endpoint: "https://internal.investingpro.in/api/sync",
    statusCode: 422,
    responseTime: 210,
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function statusBadge(status: WebhookStatus) {
  switch (status) {
    case "active":
      return (
        <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
          <span className="relative mr-1.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          Active
        </Badge>
      );
    case "failed":
      return (
        <Badge className="bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30">
          <span className="mr-1.5 h-2 w-2 rounded-full bg-red-500 inline-block" />
          Failed
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary" className="text-muted-foreground">
          <span className="mr-1.5 h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-500 inline-block" />
          Paused
        </Badge>
      );
  }
}

function statusCodeBadge(code: number) {
  if (code >= 200 && code < 300) {
    return (
      <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-mono text-xs">
        {code}
      </Badge>
    );
  }
  if (code >= 400 && code < 500) {
    return (
      <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 font-mono text-xs">
        {code}
      </Badge>
    );
  }
  return (
    <Badge className="bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30 font-mono text-xs">
      {code}
    </Badge>
  );
}

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

function formatDateTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function truncateUrl(url: string, maxLength = 45): string {
  if (url.length <= maxLength) return url;
  return url.slice(0, maxLength) + "...";
}

function generateSecret(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "whsec_";
  for (let i = 0; i < 20; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>(INITIAL_WEBHOOKS);
  const [deliveries] = useState<DeliveryLog[]>(INITIAL_DELIVERIES);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<WebhookEndpoint | null>(
    null,
  );

  /* Form state */
  const [formUrl, setFormUrl] = useState("");
  const [formSecret, setFormSecret] = useState("");
  const [formEvents, setFormEvents] = useState<string[]>([]);
  const [formActive, setFormActive] = useState(true);

  /* Reset form */
  const resetForm = useCallback(() => {
    setFormUrl("");
    setFormSecret(generateSecret());
    setFormEvents([]);
    setFormActive(true);
    setEditingWebhook(null);
  }, []);

  /* Open add dialog */
  const handleAdd = useCallback(() => {
    resetForm();
    setFormSecret(generateSecret());
    setDialogOpen(true);
  }, [resetForm]);

  /* Open edit dialog */
  const handleEdit = useCallback((wh: WebhookEndpoint) => {
    setEditingWebhook(wh);
    setFormUrl(wh.url);
    setFormSecret(wh.secret);
    setFormEvents([...wh.events]);
    setFormActive(wh.active);
    setDialogOpen(true);
  }, []);

  /* Save webhook (add or edit) */
  const handleSave = useCallback(() => {
    if (!formUrl.trim()) {
      toast.error("URL is required");
      return;
    }
    if (formEvents.length === 0) {
      toast.error("Select at least one event");
      return;
    }

    if (editingWebhook) {
      setWebhooks((prev) =>
        prev.map((wh) =>
          wh.id === editingWebhook.id
            ? {
                ...wh,
                url: formUrl.trim(),
                secret: formSecret,
                events: formEvents,
                active: formActive,
                status: formActive
                  ? ("active" as WebhookStatus)
                  : ("paused" as WebhookStatus),
              }
            : wh,
        ),
      );
      toast.success("Webhook updated");
    } else {
      const newWebhook: WebhookEndpoint = {
        id: `wh-${Date.now()}`,
        url: formUrl.trim(),
        secret: formSecret,
        events: formEvents,
        status: formActive ? "active" : "paused",
        lastTriggered: "Never",
        successRate: 0,
        active: formActive,
      };
      setWebhooks((prev) => [...prev, newWebhook]);
      toast.success("Webhook created");
    }

    setDialogOpen(false);
    resetForm();
  }, [formUrl, formSecret, formEvents, formActive, editingWebhook, resetForm]);

  /* Delete webhook */
  const handleDelete = useCallback((wh: WebhookEndpoint) => {
    setWebhooks((prev) => prev.filter((w) => w.id !== wh.id));
    toast.success("Webhook deleted", {
      description: `Removed ${truncateUrl(wh.url, 30)}`,
    });
  }, []);

  /* Toggle active/paused */
  const handleToggle = useCallback((wh: WebhookEndpoint) => {
    setWebhooks((prev) =>
      prev.map((w) =>
        w.id === wh.id
          ? {
              ...w,
              active: !w.active,
              status: !w.active
                ? ("active" as WebhookStatus)
                : ("paused" as WebhookStatus),
            }
          : w,
      ),
    );
    toast.success(wh.active ? "Webhook paused" : "Webhook activated");
  }, []);

  /* Toggle event in form */
  const toggleEvent = useCallback((eventId: string) => {
    setFormEvents((prev) =>
      prev.includes(eventId)
        ? prev.filter((e) => e !== eventId)
        : [...prev, eventId],
    );
  }, []);

  /* Copy secret */
  const handleCopySecret = useCallback((secret: string) => {
    navigator.clipboard.writeText(secret);
    toast.success("Secret copied to clipboard");
  }, []);

  /* Computed stats */
  const activeCount = webhooks.filter((w) => w.status === "active").length;
  const failedCount = webhooks.filter((w) => w.status === "failed").length;
  const avgSuccess =
    webhooks.length > 0
      ? (
          webhooks.reduce((sum, w) => sum + w.successRate, 0) / webhooks.length
        ).toFixed(1)
      : "0";

  return (
    <AdminLayout>
      <AdminPageContainer>
        {/* Header */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <Webhook className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Webhooks</h1>
                <p className="text-sm text-muted-foreground">
                  Manage webhook endpoints for content events
                </p>
              </div>
            </div>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={handleAdd}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Webhook
            </Button>
          </div>
        </div>

        {/* Top Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                <Globe className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Endpoints</p>
                <p className="text-xl font-bold">{webhooks.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                <Activity className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Active</p>
                <p className="text-xl font-bold">{activeCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Failed</p>
                <p className="text-xl font-bold">{failedCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                <Zap className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Avg. Success Rate
                </p>
                <p className="text-xl font-bold">{avgSuccess}%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Webhook Cards */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Endpoints</h2>
          <div className="grid grid-cols-1 gap-4">
            {webhooks.map((wh) => (
              <Card
                key={wh.id}
                className={cn(
                  "transition-shadow hover:shadow-md",
                  wh.status === "failed" && "border-red-500/30",
                  wh.status === "active" && "border-emerald-500/30",
                )}
              >
                <CardContent className="p-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left: URL + Events + Status */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                            wh.status === "failed"
                              ? "bg-red-500/10"
                              : "bg-emerald-500/10",
                          )}
                        >
                          <Globe
                            className={cn(
                              "h-4.5 w-4.5",
                              wh.status === "failed"
                                ? "text-red-600 dark:text-red-400"
                                : "text-emerald-600 dark:text-emerald-400",
                            )}
                          />
                        </div>
                        <div className="min-w-0">
                          <p
                            className="text-sm font-semibold truncate"
                            title={wh.url}
                          >
                            {wh.url}
                          </p>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {wh.events.map((event) => (
                              <Badge
                                key={event}
                                variant="secondary"
                                className="text-[10px] px-1.5 py-0"
                              >
                                {event}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Center: Metrics */}
                    <div className="flex items-center gap-6 text-center shrink-0">
                      <div>
                        <p className="text-xs text-muted-foreground">Status</p>
                        <div className="mt-1">{statusBadge(wh.status)}</div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Last Triggered
                        </p>
                        <p className="text-xs font-medium mt-1">
                          <Clock className="inline h-3 w-3 mr-0.5 -mt-0.5" />
                          {wh.lastTriggered === "Never"
                            ? "Never"
                            : formatTimestamp(wh.lastTriggered)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Success Rate
                        </p>
                        <p
                          className={cn(
                            "text-xs font-medium mt-1",
                            wh.successRate >= 95
                              ? "text-emerald-600 dark:text-emerald-400"
                              : wh.successRate >= 85
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-red-600 dark:text-red-400",
                          )}
                        >
                          {wh.successRate > 0 ? `${wh.successRate}%` : "--"}
                        </p>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(wh)}
                        title="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggle(wh)}
                        title={wh.active ? "Pause" : "Activate"}
                      >
                        {wh.active ? (
                          <RefreshCw className="h-3.5 w-3.5" />
                        ) : (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:border-red-300"
                        onClick={() => handleDelete(wh)}
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {webhooks.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Webhook className="h-10 w-10 mb-3 opacity-40" />
                  <p className="text-sm">No webhooks configured yet</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={handleAdd}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                    Add your first webhook
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Recent Deliveries */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Recent Deliveries</h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="text-left font-medium text-muted-foreground px-4 py-3">
                        Timestamp
                      </th>
                      <th className="text-left font-medium text-muted-foreground px-4 py-3">
                        Event
                      </th>
                      <th className="text-left font-medium text-muted-foreground px-4 py-3">
                        Endpoint
                      </th>
                      <th className="text-left font-medium text-muted-foreground px-4 py-3">
                        Status
                      </th>
                      <th className="text-right font-medium text-muted-foreground px-4 py-3">
                        Response Time
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {deliveries.map((log) => (
                      <tr
                        key={log.id}
                        className="border-b last:border-b-0 hover:bg-muted/20 transition-colors"
                      >
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                          <Clock className="inline h-3 w-3 mr-1 -mt-0.5" />
                          {formatDateTime(log.timestamp)}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="secondary" className="text-xs">
                            {log.event}
                          </Badge>
                        </td>
                        <td
                          className="px-4 py-3 font-mono text-xs text-muted-foreground truncate max-w-[250px]"
                          title={log.endpoint}
                        >
                          {truncateUrl(log.endpoint)}
                        </td>
                        <td className="px-4 py-3">
                          {statusCodeBadge(log.statusCode)}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-xs text-muted-foreground">
                          {log.responseTime >= 1000
                            ? `${(log.responseTime / 1000).toFixed(1)}s`
                            : `${log.responseTime}ms`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add / Edit Webhook Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingWebhook ? "Edit Webhook" : "Add Webhook"}
              </DialogTitle>
              <DialogDescription>
                {editingWebhook
                  ? "Update the webhook endpoint configuration."
                  : "Configure a new webhook endpoint to receive content events."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5 py-4">
              {/* URL */}
              <div className="space-y-2">
                <Label htmlFor="webhook-url">Endpoint URL</Label>
                <Input
                  id="webhook-url"
                  type="url"
                  placeholder="https://example.com/webhooks"
                  value={formUrl}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormUrl(e.target.value)
                  }
                />
              </div>

              {/* Secret */}
              <div className="space-y-2">
                <Label htmlFor="webhook-secret">Signing Secret</Label>
                <div className="flex gap-2">
                  <Input
                    id="webhook-secret"
                    value={formSecret}
                    readOnly
                    className="font-mono text-xs flex-1"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopySecret(formSecret)}
                    title="Copy secret"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setFormSecret(generateSecret())}
                    title="Regenerate"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Use this secret to verify webhook payloads.
                </p>
              </div>

              {/* Events */}
              <div className="space-y-3">
                <Label>Events</Label>
                <div className="grid grid-cols-1 gap-2">
                  {AVAILABLE_EVENTS.map((event) => (
                    <label
                      key={event.id}
                      className="flex items-center gap-2.5 cursor-pointer"
                    >
                      <Checkbox
                        checked={formEvents.includes(event.id)}
                        onCheckedChange={() => toggleEvent(event.id)}
                      />
                      <span className="text-sm">{event.label}</span>
                      <span className="text-xs text-muted-foreground font-mono">
                        {event.id}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Active toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <Label>Active</Label>
                  <p className="text-xs text-muted-foreground">
                    Enable or disable this webhook
                  </p>
                </div>
                <Switch checked={formActive} onCheckedChange={setFormActive} />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setDialogOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={handleSave}
              >
                <ShieldCheck className="h-4 w-4 mr-2" />
                {editingWebhook ? "Update Webhook" : "Create Webhook"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </AdminPageContainer>
    </AdminLayout>
  );
}
