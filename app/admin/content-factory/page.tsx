"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Loader2,
  Rocket,
  Play,
  Check,
  X,
  Star,
  AlertTriangle,
  ChevronDown,
  Search,
  TrendingUp,
  Brain,
  Zap,
  BarChart3,
  Shield,
  Target,
  UserCircle,
} from "lucide-react";

/**
 * CONTENT FACTORY - INTELLIGENT PIPELINE
 *
 * Full pipeline: Trends → Keywords → SERP → Generation → SEO
 *
 * Modes:
 * - Auto:     Full pipeline (discover trends, research keywords, generate)
 * - Trending: Discover trends and generate from top results
 * - Keyword:  Start from a seed keyword, expand, generate
 */

interface PipelineEvent {
  stage: string;
  message: string;
  data?: any;
  progress?: { current: number; total: number };
  timestamp: string;
}

const STAGE_CONFIG: Record<
  string,
  { icon: any; color: string; label: string; order: number }
> = {
  initializing: {
    icon: Zap,
    color: "text-blue-400",
    label: "Initializing",
    order: 0,
  },
  trend_discovery: {
    icon: TrendingUp,
    color: "text-emerald-400",
    label: "Trend Discovery",
    order: 1,
  },
  keyword_research: {
    icon: Search,
    color: "text-amber-400",
    label: "Keyword Research",
    order: 2,
  },
  topic_selection: {
    icon: Target,
    color: "text-emerald-400",
    label: "Topic Selection",
    order: 3,
  },
  deduplication: {
    icon: Shield,
    color: "text-orange-400",
    label: "Deduplication",
    order: 4,
  },
  generating: {
    icon: Brain,
    color: "text-emerald-400",
    label: "AI Generation",
    order: 5,
  },
  seo_audit: {
    icon: BarChart3,
    color: "text-pink-400",
    label: "SEO Audit",
    order: 6,
  },
  complete: {
    icon: Star,
    color: "text-purple-400",
    label: "Complete",
    order: 7,
  },
  error: {
    icon: AlertTriangle,
    color: "text-rose-500",
    label: "Error",
    order: 8,
  },
  result: { icon: Star, color: "text-purple-400", label: "Result", order: 9 },
};

const MODE_OPTIONS = [
  {
    value: "auto",
    label: "Auto (Full Pipeline)",
    description: "Trends → Keywords → SERP → AI Generation → SEO",
    icon: Brain,
  },
  {
    value: "trending",
    label: "Trending Topics",
    description: "Discover hot topics and generate immediately",
    icon: TrendingUp,
  },
  {
    value: "keyword",
    label: "Keyword-Driven",
    description: "Start from a seed keyword, expand, and generate",
    icon: Search,
  },
];

const CATEGORY_OPTIONS = [
  { value: "", label: "All Categories" },
  { value: "mutual-funds", label: "Mutual Funds" },
  { value: "credit-cards", label: "Credit Cards" },
  { value: "loans", label: "Loans" },
  { value: "insurance", label: "Insurance" },
  { value: "tax-planning", label: "Tax Planning" },
  { value: "retirement", label: "Retirement" },
  { value: "investing-basics", label: "Investing Basics" },
  { value: "investing", label: "Investing" },
  { value: "stocks", label: "Stocks" },
  { value: "banking", label: "Banking" },
  { value: "fixed_deposits", label: "Fixed Deposits" },
  { value: "market-analysis", label: "Market Analysis" },
];

const AUTHOR_OPTIONS = [
  { value: "", name: "", label: "Auto (InvestingPro Team)" },
  {
    value: "f7815127-cc75-4233-a4d6-fa97e3fd33d0",
    name: "Arjun Sharma",
    label: "Arjun Sharma (Writer)",
  },
  {
    value: "34ce9a20-9256-4968-a8f6-1fcb5c21468a",
    name: "Priya Menon",
    label: "Priya Menon (Writer)",
  },
  {
    value: "7b1385c2-2782-4cb5-92ce-f1078539c6b5",
    name: "Vikram Singh",
    label: "Vikram Singh (Writer)",
  },
  {
    value: "97d26d4b-8f77-40de-90ae-caaeaf0a2e07",
    name: "Kavita Sharma",
    label: "Kavita Sharma (Writer)",
  },
  {
    value: "1340e6a2-4d80-483b-832c-cd4be67ff923",
    name: "Rahul Chatterjee",
    label: "Rahul Chatterjee (Writer)",
  },
  {
    value: "61f77825-c4bf-443d-a743-b73388f719b3",
    name: "Suresh Patel",
    label: "Suresh Patel (Writer)",
  },
  {
    value: "6db4cb4e-4363-4a6f-86b8-67c672d520e1",
    name: "Aisha Khan",
    label: "Aisha Khan (Writer)",
  },
  {
    value: "a32756f8-c37b-467e-b89e-6c656bd498e2",
    name: "Anjali Deshmukh",
    label: "Anjali Deshmukh (Writer)",
  },
  {
    value: "a4a9df6e-4fbb-4bcc-9403-c6a646aa100c",
    name: "Rajesh Mehta",
    label: "Rajesh Mehta (Editor)",
  },
  {
    value: "031e8e26-a317-4370-bfce-d375a28fba56",
    name: "Dr. Meera Iyer",
    label: "Dr. Meera Iyer (Editor)",
  },
  {
    value: "747dc84c-d017-46a7-9d3d-f20f8537c9ea",
    name: "Karthik Menon",
    label: "Karthik Menon (Editor)",
  },
  {
    value: "2d6fb353-692c-432d-acbd-81f02502e8a8",
    name: "Deepika Singh",
    label: "Deepika Singh (Editor)",
  },
  {
    value: "9ca18bc8-478a-4fd1-a42e-3446329b2db3",
    name: "Amit Desai",
    label: "Amit Desai (Editor)",
  },
  {
    value: "bd6c5c0c-a287-4103-876f-900fb89bf190",
    name: "Thomas Fernandes",
    label: "Thomas Fernandes (Editor)",
  },
  {
    value: "ee88b17a-e472-45a3-944b-fa498504ce77",
    name: "Nandini Reddy",
    label: "Nandini Reddy (Editor)",
  },
  {
    value: "32184985-0b0e-4507-97fa-1cc2d72b386b",
    name: "Harpreet Kaur",
    label: "Harpreet Kaur (Editor)",
  },
];

export default function ContentFactoryPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [events, setEvents] = useState<PipelineEvent[]>([]);
  const [count, setCount] = useState(3);
  const [mode, setMode] = useState<"auto" | "trending" | "keyword">("auto");
  const [category, setCategory] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [seedKeyword, setSeedKeyword] = useState("");
  const [currentStage, setCurrentStage] = useState<string | null>(null);
  const [pipelineResult, setPipelineResult] = useState<any>(null);
  const consoleRef = useRef<HTMLDivElement>(null);

  // Auto-scroll console
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [events]);

  const startPipeline = async () => {
    setIsRunning(true);
    setEvents([]);
    setCurrentStage("initializing");
    setPipelineResult(null);

    try {
      const response = await fetch("/api/content-pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          count,
          mode,
          category: category || undefined,
          seedKeyword: mode === "keyword" ? seedKeyword : undefined,
          authorId: selectedAuthor || undefined,
          authorName: selectedAuthor
            ? AUTHOR_OPTIONS.find((a) => a.value === selectedAuthor)?.name
            : undefined,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Pipeline failed");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No response body");

      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const event: PipelineEvent = JSON.parse(line.slice(6));
              setEvents((prev) => [...prev, event]);
              setCurrentStage(event.stage);

              if (event.stage === "result" && event.data) {
                setPipelineResult(event.data);
              }

              if (event.stage === "complete" || event.stage === "error") {
                setIsRunning(false);
              }
            } catch {
              // Skip malformed JSON
            }
          }
        }
      }
    } catch (error: any) {
      setEvents((prev) => [
        ...prev,
        {
          stage: "error",
          message: error.message,
          timestamp: new Date().toISOString(),
        },
      ]);
      setIsRunning(false);
    }
  };

  // Calculate progress from events
  const latestProgress = [...events].reverse().find((e) => e.progress);
  const progressCurrent = latestProgress?.progress?.current || 0;
  const progressTotal = latestProgress?.progress?.total || count;
  const percentage =
    currentStage === "complete"
      ? 100
      : currentStage === "generating"
        ? progressTotal > 0
          ? (progressCurrent / progressTotal) * 100
          : 50
        : ((STAGE_CONFIG[currentStage || "initializing"]?.order || 0) / 7) *
          100;

  // Stages completed so far
  const completedStages = new Set(events.map((e) => e.stage));

  return (
    <AdminLayout>
      <div className="p-8 min-h-screen bg-background">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2 flex items-center gap-3">
              <Brain className="text-primary" size={32} />
              Content Factory
            </h1>
            <p className="text-muted-foreground text-base">
              Intelligent pipeline: Trend Discovery → Keyword Research → SERP
              Analysis → AI Generation → SEO Audit
            </p>
          </div>

          {/* Mode Selector */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {MODE_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.value}
                  onClick={() => setMode(opt.value as any)}
                  disabled={isRunning}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200
                                        ${
                                          mode === opt.value
                                            ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                                            : "border-border bg-card hover:border-primary/30"
                                        }
                                        disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Icon
                      size={20}
                      className={
                        mode === opt.value
                          ? "text-primary"
                          : "text-muted-foreground"
                      }
                    />
                    <span
                      className={`font-semibold text-sm ${mode === opt.value ? "text-primary" : "text-foreground"}`}
                    >
                      {opt.label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {opt.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Controls */}
          <div className="bg-card rounded-xl border border-border p-6 mb-8 shadow-sm">
            <div
              className={`grid grid-cols-1 gap-6 ${mode === "keyword" ? "md:grid-cols-5" : "md:grid-cols-4"}`}
            >
              {/* Article Count */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Articles to Generate
                </label>
                <div className="relative">
                  <select
                    value={count}
                    onChange={(e) => setCount(parseInt(e.target.value))}
                    disabled={isRunning}
                    className="w-full bg-background border border-input rounded-md px-4 py-2.5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value={1}>1 Article</option>
                    <option value={3}>3 Articles</option>
                    <option value={5}>5 Articles</option>
                    <option value={10}>10 Articles</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-muted-foreground">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Category Filter
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={isRunning}
                    className="w-full bg-background border border-input rounded-md px-4 py-2.5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-muted-foreground">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>

              {/* Author Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  <UserCircle size={14} className="inline mr-1.5 -mt-0.5" />
                  Author
                </label>
                <div className="relative">
                  <select
                    value={selectedAuthor}
                    onChange={(e) => setSelectedAuthor(e.target.value)}
                    disabled={isRunning}
                    className="w-full bg-background border border-input rounded-md px-4 py-2.5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {AUTHOR_OPTIONS.map((a) => (
                      <option key={a.value} value={a.value}>
                        {a.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-muted-foreground">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>

              {/* Seed Keyword (keyword mode only) */}
              {mode === "keyword" && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Seed Keyword
                  </label>
                  <input
                    type="text"
                    value={seedKeyword}
                    onChange={(e) => setSeedKeyword(e.target.value)}
                    disabled={isRunning}
                    placeholder="e.g. best credit cards 2026"
                    className="w-full bg-background border border-input rounded-md px-4 py-2.5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              )}

              {/* Action Button */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Action
                </label>
                <Button
                  onClick={startPipeline}
                  disabled={
                    isRunning || (mode === "keyword" && !seedKeyword.trim())
                  }
                  className="w-full h-[42px] font-semibold flex items-center justify-center gap-2"
                  variant={isRunning ? "secondary" : "default"}
                >
                  {isRunning ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      <span>Pipeline Running...</span>
                    </>
                  ) : (
                    <>
                      <Rocket size={18} />
                      <span>Launch Pipeline</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Pipeline Stage Indicators */}
          {events.length > 0 && (
            <div className="bg-card rounded-xl border border-border p-6 mb-8 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Pipeline Progress
              </h2>

              {/* Stage Pills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {Object.entries(STAGE_CONFIG)
                  .filter(
                    ([key]) =>
                      !["error", "result", "initializing"].includes(key),
                  )
                  .sort(([, a], [, b]) => a.order - b.order)
                  .map(([key, cfg]) => {
                    const Icon = cfg.icon;
                    const isActive = currentStage === key;
                    const isDone =
                      cfg.order <
                      (STAGE_CONFIG[currentStage || ""]?.order || 0);
                    return (
                      <div
                        key={key}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all
                                                    ${
                                                      isActive
                                                        ? `${cfg.color} bg-current/5 border border-current/20 ring-2 ring-current/10`
                                                        : isDone
                                                          ? "text-emerald-400 bg-emerald-400/5 border border-emerald-400/20"
                                                          : "text-muted-foreground bg-muted/50 border border-transparent"
                                                    }`}
                      >
                        {isActive && isRunning ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : isDone ? (
                          <Check size={12} />
                        ) : (
                          <Icon size={12} />
                        )}
                        {cfg.label}
                      </div>
                    );
                  })}
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-emerald-500 to-emerald-500 transition-all duration-700 ease-out"
                  style={{ width: `${Math.min(100, percentage)}%` }}
                />
              </div>
              <div className="text-center text-muted-foreground text-xs">
                {percentage.toFixed(0)}%
              </div>

              {/* Stats (on completion) */}
              {pipelineResult && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 mt-4 border-t border-border">
                  <div className="text-center">
                    <div className="text-xl font-bold text-emerald-400">
                      {pipelineResult.pipeline_trace?.trends_discovered || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Trends</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-amber-400">
                      {pipelineResult.pipeline_trace?.keywords_researched || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Keywords
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-emerald-400">
                      {pipelineResult.pipeline_trace?.topics_selected || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Topics</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-emerald-400">
                      {pipelineResult.pipeline_trace?.articles_generated || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Published
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-rose-400">
                      {pipelineResult.pipeline_trace?.articles_failed || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Failed</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Console Output */}
          {events.length > 0 && (
            <div className="bg-gray-950 rounded-lg border border-border p-6 mb-8 font-mono">
              <h2 className="text-base font-semibold text-gray-50 mb-4">
                Pipeline Console
              </h2>
              <div
                ref={consoleRef}
                className="space-y-1.5 max-h-[500px] overflow-y-auto text-xs custom-scrollbar"
              >
                {events.map((event, i) => {
                  const cfg =
                    STAGE_CONFIG[event.stage] || STAGE_CONFIG["generating"];
                  const Icon = cfg.icon;
                  return (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-gray-600 select-none shrink-0 w-16 text-right">
                        {new Date(event.timestamp).toLocaleTimeString("en-IN", {
                          hour12: false,
                        })}
                      </span>
                      <span
                        className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider ${cfg.color} bg-current/5`}
                      >
                        {cfg.label.slice(0, 8)}
                      </span>
                      <span
                        className={`${cfg.color} break-all leading-relaxed`}
                      >
                        {event.message}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
