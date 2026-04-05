"use client";

import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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
  Share2,
  TrendingUp,
  MousePointerClick,
  MessageSquare,
  RefreshCw,
  Twitter,
  Linkedin,
  Send,
  Plus,
  AlertCircle,
  CheckCircle2,
  Link2,
  Calendar,
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface SocialMediaMetrics {
  platform: "twitter" | "linkedin" | "telegram" | "whatsapp";
  posts: number;
  impressions: number;
  engagement: {
    likes: number;
    shares: number;
    comments: number;
    clicks: number;
  };
  engagementRate: number;
  clickThroughRate: number;
  conversions: number;
  conversionRate: number;
}

interface PlatformConfig {
  id: "twitter" | "linkedin";
  name: string;
  icon: React.ReactNode;
  envVars: string[];
  connected: boolean;
  description: string;
}

export default function SocialDashboard() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [postPlatform, setPostPlatform] = useState<"twitter" | "linkedin">(
    "twitter",
  );
  const [postContent, setPostContent] = useState("");
  const [postSchedule, setPostSchedule] = useState("");

  // Fetch social media metrics
  const {
    data: metrics,
    isLoading,
    refetch,
  } = useQuery<SocialMediaMetrics[]>({
    queryKey: ["social-metrics", timeRange],
    queryFn: async () => {
      const response = await fetch(`/api/social/analytics?range=${timeRange}`);
      if (!response.ok) throw new Error("Failed to fetch social metrics");
      const data = await response.json();
      return data.metrics || [];
    },
  });

  // Post to social mutation
  const postMutation = useMutation({
    mutationFn: async (params: {
      platform: string;
      content: string;
      scheduledAt?: string;
    }) => {
      // Use the social scheduler API
      const response = await fetch("/api/social/schedulers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: params.platform,
          content: params.content,
          scheduled_at: params.scheduledAt || new Date().toISOString(),
          status: params.scheduledAt ? "scheduled" : "pending",
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create post");
      }
      return data;
    },
    onSuccess: () => {
      toast.success("Post created successfully");
      setCreateDialogOpen(false);
      setPostContent("");
      setPostSchedule("");
      refetch();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleCreatePost = () => {
    if (!postContent.trim()) {
      toast.error("Post content is required");
      return;
    }
    postMutation.mutate({
      platform: postPlatform,
      content: postContent,
      scheduledAt: postSchedule || undefined,
    });
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "twitter":
        return <Twitter className="w-5 h-5" />;
      case "linkedin":
        return <Linkedin className="w-5 h-5" />;
      case "telegram":
        return <Send className="w-5 h-5" />;
      case "whatsapp":
        return <MessageSquare className="w-5 h-5" />;
      default:
        return <Share2 className="w-5 h-5" />;
    }
  };

  // Platform configuration cards
  const platforms: PlatformConfig[] = [
    {
      id: "twitter",
      name: "Twitter / X",
      icon: <Twitter className="w-6 h-6" />,
      envVars: [
        "TWITTER_CLIENT_ID",
        "TWITTER_CLIENT_SECRET",
        "TWITTER_ACCESS_TOKEN",
      ],
      connected: false, // Will be determined at runtime by env vars
      description: "Post updates, threads, and engage with your audience on X.",
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: <Linkedin className="w-6 h-6" />,
      envVars: [
        "LINKEDIN_CLIENT_ID",
        "LINKEDIN_CLIENT_SECRET",
        "LINKEDIN_ACCESS_TOKEN",
      ],
      connected: false,
      description:
        "Share professional updates and articles with your LinkedIn network.",
    },
  ];

  const totalPosts = metrics?.reduce((sum, m) => sum + m.posts, 0) || 0;
  const totalImpressions =
    metrics?.reduce((sum, m) => sum + m.impressions, 0) || 0;
  const totalEngagement =
    metrics?.reduce(
      (sum, m) =>
        sum +
        m.engagement.likes +
        m.engagement.shares +
        m.engagement.comments +
        m.engagement.clicks,
      0,
    ) || 0;
  const totalClicks =
    metrics?.reduce((sum, m) => sum + m.engagement.clicks, 0) || 0;
  const avgEngagementRate =
    metrics && metrics.length > 0
      ? metrics.reduce((sum, m) => sum + m.engagementRate, 0) / metrics.length
      : 0;

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Social Media Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage social accounts, create posts, and track engagement
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
            <Button onClick={() => refetch()} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>

            {/* Create Post Dialog */}
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Post
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>Create Social Post</DialogTitle>
                  <DialogDescription>
                    Compose a post for your social channels. Schedule it or post
                    immediately.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="platform">Platform</Label>
                    <select
                      id="platform"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={postPlatform}
                      onChange={(e) =>
                        setPostPlatform(
                          e.target.value as "twitter" | "linkedin",
                        )
                      }
                    >
                      <option value="twitter">Twitter / X</option>
                      <option value="linkedin">LinkedIn</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="post-content">Content</Label>
                    <Textarea
                      id="post-content"
                      placeholder={
                        postPlatform === "twitter"
                          ? "What's happening? (280 characters max for Twitter)"
                          : "Share a professional update..."
                      }
                      rows={6}
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      maxLength={postPlatform === "twitter" ? 280 : 3000}
                    />
                    <p className="text-xs text-muted-foreground text-right">
                      {postContent.length}/
                      {postPlatform === "twitter" ? 280 : 3000}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="schedule">
                      <Calendar className="w-3.5 h-3.5 inline mr-1" />
                      Schedule (optional)
                    </Label>
                    <Input
                      id="schedule"
                      type="datetime-local"
                      value={postSchedule}
                      onChange={(e) => setPostSchedule(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Leave empty to queue for immediate posting.
                    </p>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreatePost}
                    disabled={postMutation.isPending}
                  >
                    {postMutation.isPending ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : postSchedule ? (
                      <>
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule Post
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Create Post
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Platform Connection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {platforms.map((platform) => {
            const platformMetrics = metrics?.find(
              (m) => m.platform === platform.id,
            );
            const hasData = !!platformMetrics && platformMetrics.posts > 0;

            return (
              <Card key={platform.id}>
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      {platform.icon}
                    </div>
                    <div>
                      <CardTitle className="text-base">
                        {platform.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {platform.description}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={hasData ? "default" : "secondary"}
                    className="shrink-0"
                  >
                    {hasData ? "Active" : "Not Connected"}
                  </Badge>
                </CardHeader>
                <CardContent>
                  {hasData && platformMetrics ? (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-2 rounded bg-muted/50">
                        <div className="text-lg font-bold">
                          {platformMetrics.posts}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Posts
                        </div>
                      </div>
                      <div className="text-center p-2 rounded bg-muted/50">
                        <div className="text-lg font-bold">
                          {platformMetrics.impressions.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Impressions
                        </div>
                      </div>
                      <div className="text-center p-2 rounded bg-muted/50">
                        <div className="text-lg font-bold">
                          {platformMetrics.engagementRate.toFixed(1)}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Engagement
                        </div>
                      </div>
                      <div className="text-center p-2 rounded bg-muted/50">
                        <div className="text-lg font-bold">
                          {platformMetrics.engagement.clicks.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Clicks
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed p-4">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-medium">
                            Connect {platform.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Add these environment variables to connect:
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {platform.envVars.map((v) => (
                              <code
                                key={v}
                                className="text-[10px] bg-muted px-1.5 py-0.5 rounded"
                              >
                                {v}
                              </code>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-muted-foreground">
              Loading social metrics...
            </p>
          </div>
        ) : metrics && metrics.length > 0 ? (
          <>
            {/* Aggregate Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Posts
                  </CardTitle>
                  <Share2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalPosts}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Across all platforms
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Impressions
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {totalImpressions.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {totalEngagement.toLocaleString()} total engagement
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Engagement Rate
                  </CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {avgEngagementRate.toFixed(2)}%
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Average across platforms
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Clicks
                  </CardTitle>
                  <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {totalClicks.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    To website
                  </p>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          /* Empty state for recent posts */
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                Recent Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Share2 className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="font-medium">No posts yet</p>
                <p className="text-sm mt-1">
                  Connect a platform and create your first post to see activity
                  here.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => setCreateDialogOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Post
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
