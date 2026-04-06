"use client";

import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Mail,
  Send,
  MousePointerClick,
  TrendingUp,
  Users,
  BarChart3,
  RefreshCw,
  Eye,
  Plus,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface EmailStats {
  totalSubscribers: number;
  emailsSent: number;
  openRate: number;
  clickRate: number;
  resendConfigured: boolean;
}

interface EmailMetrics {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  converted: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
}

interface EmailCampaign {
  id: string;
  name: string;
  type: "newsletter" | "sequence" | "promotional";
  sent: number;
  opened: number;
  clicked: number;
  converted: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
  date: string;
}

export default function EmailDashboard() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [newsletterSubject, setNewsletterSubject] = useState("");
  const [newsletterContent, setNewsletterContent] = useState("");
  const [newsletterAudience, setNewsletterAudience] = useState<
    "all" | "credit-cards" | "mutual-funds"
  >("all");

  // Fetch top-level stats
  const {
    data: stats,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useQuery<EmailStats>({
    queryKey: ["email-stats"],
    queryFn: async () => {
      const response = await fetch("/api/admin/email/stats");
      if (!response.ok) throw new Error("Failed to fetch email stats");
      return response.json();
    },
  });

  // Fetch email metrics for the time range
  const {
    data: metrics,
    isLoading: metricsLoading,
    refetch: refetchMetrics,
  } = useQuery<EmailMetrics>({
    queryKey: ["email-metrics", timeRange],
    queryFn: async () => {
      const response = await fetch(`/api/email/analytics?range=${timeRange}`);
      if (!response.ok) throw new Error("Failed to fetch email metrics");
      return response.json();
    },
  });

  // Fetch email campaigns
  const { data: campaigns, isLoading: campaignsLoading } = useQuery<
    EmailCampaign[]
  >({
    queryKey: ["email-campaigns", timeRange],
    queryFn: async () => {
      const response = await fetch(`/api/email/campaigns?range=${timeRange}`);
      if (!response.ok) throw new Error("Failed to fetch email campaigns");
      const data = await response.json();
      return data.campaigns || [];
    },
  });

  // Send newsletter mutation
  const sendMutation = useMutation({
    mutationFn: async (params: {
      subject: string;
      content: string;
      audience: string;
    }) => {
      const response = await fetch("/api/admin/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to send newsletter");
      }
      return data;
    },
    onSuccess: (data) => {
      toast.success(`Newsletter sent to ${data.sentCount} subscribers`);
      setSendDialogOpen(false);
      setNewsletterSubject("");
      setNewsletterContent("");
      setNewsletterAudience("all");
      refetchStats();
      refetchMetrics();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleSendNewsletter = () => {
    if (!newsletterSubject.trim()) {
      toast.error("Subject is required");
      return;
    }
    if (!newsletterContent.trim()) {
      toast.error("Content is required");
      return;
    }
    sendMutation.mutate({
      subject: newsletterSubject,
      content: newsletterContent,
      audience: newsletterAudience,
    });
  };

  const handleRefresh = () => {
    refetchStats();
    refetchMetrics();
  };

  const isLoading = statsLoading || metricsLoading;

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Email Marketing Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Track email performance, manage subscribers, and send newsletters
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              {(["7d", "30d", "90d"] as const).map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                >
                  {range === "7d"
                    ? "7 Days"
                    : range === "30d"
                      ? "30 Days"
                      : "90 Days"}
                </Button>
              ))}
            </div>
            <Button onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>

            {/* Send Newsletter Dialog */}
            <Dialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Send Newsletter
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>Send Newsletter</DialogTitle>
                  <DialogDescription>
                    Compose and send a newsletter to your subscribers via
                    Resend.
                  </DialogDescription>
                </DialogHeader>

                {stats && !stats.resendConfigured ? (
                  <div className="flex items-start gap-3 rounded-lg border border-amber-800 bg-amber-950/30 p-4">
                    <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-amber-200">
                        Resend not configured
                      </p>
                      <p className="text-sm text-amber-300 mt-1">
                        Add{" "}
                        <code className="bg-amber-900 px-1 rounded text-xs">
                          RESEND_API_KEY
                        </code>{" "}
                        to your environment variables to enable email sending.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        placeholder="Weekly Finance Roundup"
                        value={newsletterSubject}
                        onChange={(e) => setNewsletterSubject(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="content">Body</Label>
                      <Textarea
                        id="content"
                        placeholder="Write your newsletter content here..."
                        rows={8}
                        value={newsletterContent}
                        onChange={(e) => setNewsletterContent(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="audience">Audience</Label>
                      <select
                        id="audience"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={newsletterAudience}
                        onChange={(e) =>
                          setNewsletterAudience(
                            e.target.value as
                              | "all"
                              | "credit-cards"
                              | "mutual-funds",
                          )
                        }
                      >
                        <option value="all">All Subscribers</option>
                        <option value="credit-cards">
                          Credit Card Interested
                        </option>
                        <option value="mutual-funds">
                          Mutual Fund Interested
                        </option>
                      </select>
                    </div>
                    {stats && (
                      <p className="text-xs text-muted-foreground">
                        Sending to {stats.totalSubscribers} active subscriber
                        {stats.totalSubscribers !== 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                )}

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setSendDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSendNewsletter}
                    disabled={
                      sendMutation.isPending ||
                      (stats ? !stats.resendConfigured : false)
                    }
                  >
                    {sendMutation.isPending ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Newsletter
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-muted-foreground">
              Loading email metrics...
            </p>
          </div>
        ) : (
          <>
            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Subscribers
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(stats?.totalSubscribers ?? 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Active subscribers
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Emails Sent
                  </CardTitle>
                  <Send className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(metrics?.sent ?? stats?.emailsSent ?? 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {metrics
                      ? `${metrics.delivered} delivered`
                      : "In selected period"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Open Rate
                  </CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(metrics?.openRate ?? stats?.openRate ?? 0).toFixed(1)}%
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {metrics ? `${metrics.opened} opened` : "Overall"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Click Rate
                  </CardTitle>
                  <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(metrics?.clickRate ?? stats?.clickRate ?? 0).toFixed(1)}%
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {metrics ? `${metrics.clicked} clicked` : "Overall"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Resend Status Banner */}
            {stats && !stats.resendConfigured && (
              <Card className="border-amber-800 bg-amber-950/20">
                <CardContent className="flex items-center gap-3 py-4">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <p className="font-medium text-amber-200">
                      Email provider not configured
                    </p>
                    <p className="text-sm text-amber-300">
                      Add{" "}
                      <code className="bg-amber-900 px-1 rounded text-xs">
                        RESEND_API_KEY
                      </code>{" "}
                      to your environment variables to enable sending
                      newsletters.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {stats && stats.resendConfigured && (
              <Card className="border-green-800 bg-green-950/20">
                <CardContent className="flex items-center gap-3 py-4">
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                  <div>
                    <p className="font-medium text-green-200">
                      Resend connected
                    </p>
                    <p className="text-sm text-green-300">
                      Email sending is active. Use the &quot;Send
                      Newsletter&quot; button to reach your subscribers.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Campaigns Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Recent Campaigns
                </CardTitle>
              </CardHeader>
              <CardContent>
                {campaignsLoading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-primary" />
                  </div>
                ) : campaigns && campaigns.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 text-sm font-semibold">
                            Campaign
                          </th>
                          <th className="text-center py-3 px-4 text-sm font-semibold">
                            Sent
                          </th>
                          <th className="text-center py-3 px-4 text-sm font-semibold">
                            Open Rate
                          </th>
                          <th className="text-center py-3 px-4 text-sm font-semibold">
                            Click Rate
                          </th>
                          <th className="text-center py-3 px-4 text-sm font-semibold">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {campaigns.map((campaign) => (
                          <tr
                            key={campaign.id}
                            className="border-b last:border-b-0 hover:bg-muted/50"
                          >
                            <td className="py-4 px-4">
                              <div className="font-medium">{campaign.name}</div>
                              <Badge variant="outline" className="mt-1">
                                {campaign.type}
                              </Badge>
                            </td>
                            <td className="py-4 px-4 text-center">
                              {campaign.sent}
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span
                                className={
                                  campaign.openRate >= 20
                                    ? "text-green-400"
                                    : "text-muted-foreground"
                                }
                              >
                                {campaign.openRate.toFixed(1)}%
                              </span>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span
                                className={
                                  campaign.clickRate >= 3
                                    ? "text-green-400"
                                    : "text-muted-foreground"
                                }
                              >
                                {campaign.clickRate.toFixed(1)}%
                              </span>
                            </td>
                            <td className="py-4 px-4 text-center text-sm text-muted-foreground">
                              {new Date(campaign.date).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Mail className="w-10 h-10 mx-auto mb-3 opacity-40" />
                    <p className="font-medium">No campaigns yet</p>
                    <p className="text-sm mt-1">
                      Send your first newsletter to see campaign data here.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
