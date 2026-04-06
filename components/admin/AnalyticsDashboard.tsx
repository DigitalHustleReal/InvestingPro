import React from "react";
import { StatCard, ContentSection, TableRow, TableCell } from "./AdminUIKit";
import { Eye, FileText, BarChart3, TrendingUp, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

interface ContentPerformance {
  totalArticles: number;
  totalViews: number;
  avgViewsPerArticle: number;
  topPerformers: {
    id: string;
    title: string;
    slug: string;
    views: number;
    category: string;
  }[];
  categoryBreakdown: {
    category: string;
    articleCount: number;
    totalViews: number;
  }[];
}

export default function AnalyticsDashboard() {
  const { data: analytics, isLoading } = useQuery<ContentPerformance>({
    queryKey: ["analytics-overview"],
    queryFn: async () => {
      const response = await fetch("/api/admin/analytics?type=overview");
      if (!response.ok) throw new Error("Failed to fetch analytics");
      return response.json();
    },
    refetchInterval: 60000, // Refresh every minute
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 bg-card rounded-xl animate-pulse shadow-sm border border-border"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Total Articles"
          value={analytics?.totalArticles || 0}
          icon={FileText}
          change="29 published this month"
          changeType="neutral"
          color="blue"
        />
        <StatCard
          label="Total Views"
          value={analytics?.totalViews?.toLocaleString() || 0}
          icon={Eye}
          change="+12.5% vs last month"
          changeType="positive"
          color="purple"
        />
        <StatCard
          label="Avg. Views/Article"
          value={analytics?.avgViewsPerArticle || 0}
          icon={BarChart3}
          color="amber"
        />
      </div>

      {/* Top Performers */}
      <ContentSection
        title="Top Performing Content"
        subtitle="Articles with highest engagement in the last 30 days"
        actions={<TrendingUp className="w-5 h-5 text-amber-400" />}
      >
        {analytics?.topPerformers && analytics.topPerformers.length > 0 ? (
          <div className="divide-y divide-border">
            {analytics.topPerformers.map((article, idx) => (
              <div
                key={article.id}
                className="flex items-center justify-between py-4 first:pt-0 last:pb-0 hover:bg-muted/30 rounded-lg px-2 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm backdrop-blur-sm border",
                      idx === 0
                        ? "bg-amber-500/10 border-amber-500/20 text-amber-500 shadow-[0_0_10px_rgba(251,191,36,0.2)]"
                        : "bg-muted border-border text-muted-foreground",
                    )}
                  >
                    {idx + 1}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {article.title}
                    </div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {article.category?.replace(/-/g, " ")}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-extrabold text-foreground">
                    {article.views.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            <Sparkles className="w-8 h-8 mx-auto mb-3 opacity-20" />
            <p className="text-sm font-medium">No published articles yet</p>
          </div>
        )}
      </ContentSection>

      {/* Category Breakdown */}
      <ContentSection
        title="Category Performance"
        subtitle="View distribution by primary category"
      >
        {analytics?.categoryBreakdown &&
        analytics.categoryBreakdown.length > 0 ? (
          <div className="space-y-6">
            {analytics.categoryBreakdown.slice(0, 5).map((cat) => {
              const maxViews = Math.max(
                ...analytics.categoryBreakdown.map((c) => c.totalViews),
              );
              const percentage =
                maxViews > 0 ? (cat.totalViews / maxViews) * 100 : 0;

              return (
                <div key={cat.category} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground capitalize font-bold">
                      {cat.category?.replace(/-/g, " ") || "Uncategorized"}
                    </span>
                    <span className="text-muted-foreground font-medium">
                      {cat.articleCount} Articles â€¢{" "}
                      {cat.totalViews.toLocaleString()} Views
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden border border-border">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8 font-medium">
            No category data available
          </div>
        )}
      </ContentSection>
    </div>
  );
}
