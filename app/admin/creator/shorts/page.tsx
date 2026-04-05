"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { toast } from "sonner";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminPageContainer from "@/components/admin/AdminPageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Smartphone,
  ArrowLeft,
  Loader2,
  Copy,
  Hash,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ShortScript {
  id: number;
  hookLine: string;
  keyPoints: string[];
  cta: string;
  hashtags: string[];
}

/* ------------------------------------------------------------------ */
/*  Mock shorts generation                                             */
/* ------------------------------------------------------------------ */

function generateMockShorts(
  topic: string,
  platform: string,
  tone: string,
): ShortScript[] {
  const topicLower = topic.toLowerCase();

  return [
    {
      id: 1,
      hookLine:
        tone === "urgent"
          ? `STOP scrolling — you need to know this about ${topicLower} RIGHT NOW`
          : tone === "casual"
            ? `Okay so here's the thing about ${topicLower} nobody talks about...`
            : `Here's what every Indian investor needs to know about ${topicLower}`,
      keyPoints: [
        `Most people get ${topicLower} completely wrong — here's the reality`,
        `The #1 rule: never invest more than you can afford to lose`,
        `In India, tax implications under Section 80C can save you up to Rs 1.5 lakh`,
        `Start with as little as Rs 500/month — consistency beats amount`,
      ],
      cta:
        platform === "youtube"
          ? "Follow for more finance tips — link to full breakdown in description!"
          : platform === "instagram"
            ? "Save this for later and follow @investingpro for daily finance tips!"
            : "Save this and follow for more! Full breakdown linked in bio.",
      hashtags: [
        "PersonalFinance",
        "InvestingTips",
        "MoneyMatters",
        topicLower.replace(/\s+/g, ""),
        "FinanceIndia",
        "WealthBuilding",
        platform === "instagram" ? "FinanceReels" : "FinanceShorts",
      ],
    },
    {
      id: 2,
      hookLine:
        tone === "urgent"
          ? `Your money is losing value EVERY DAY if you're not doing this with ${topicLower}`
          : tone === "casual"
            ? `POV: you just discovered ${topicLower} and your portfolio changed forever`
            : `3 things I wish I knew about ${topicLower} before I started investing`,
      keyPoints: [
        `Thing #1: Inflation eats 6-7% of your money every year — ${topicLower} can beat that`,
        `Thing #2: Compounding is the 8th wonder — even Rs 1,000/month becomes Rs 10+ lakh in 15 years`,
        `Thing #3: Diversification isn't optional — spread across at least 3-4 instruments`,
      ],
      cta:
        platform === "youtube"
          ? "Subscribe for Part 2 where I show my exact portfolio setup!"
          : platform === "instagram"
            ? "Double tap if you learned something new! Share with a friend who needs this."
            : "Follow for daily finance wisdom! Link in bio for the full guide.",
      hashtags: [
        "InvestSmart",
        "FinancialFreedom",
        "IndianInvestor",
        "MutualFunds",
        topicLower.replace(/\s+/g, ""),
        "MoneyTips",
        platform === "instagram" ? "ReelsIndia" : "YouTubeShorts",
      ],
    },
    {
      id: 3,
      hookLine:
        tone === "urgent"
          ? `Banks DON'T want you to know this about ${topicLower} — here's the truth`
          : tone === "casual"
            ? `My dad never taught me about ${topicLower} so I taught myself — here's what I found`
            : `The beginner's guide to ${topicLower} in 60 seconds`,
      keyPoints: [
        `Step 1: Open a free demat account (takes 10 minutes)`,
        `Step 2: Start with an index fund SIP — lowest risk, proven returns`,
        `Step 3: Increase your SIP by 10% every year — this is the real cheat code`,
        `Bonus: Use the 50-30-20 rule — 50% needs, 30% wants, 20% investments`,
      ],
      cta:
        platform === "youtube"
          ? "Hit that subscribe button — I post finance shorts every single day!"
          : platform === "instagram"
            ? "Follow @investingpro for bite-sized finance education every day!"
            : "Save + share this with someone who needs to hear it! Follow for more.",
      hashtags: [
        "FinanceTips",
        "BeginnerInvestor",
        "SIPInvesting",
        "IndexFunds",
        topicLower.replace(/\s+/g, ""),
        "FinancialLiteracy",
        platform === "instagram" ? "FinanceReels" : "MoneyShorts",
      ],
    },
  ];
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function ShortsGeneratorPage() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("both");
  const [tone, setTone] = useState("professional");
  const [isGenerating, setIsGenerating] = useState(false);
  const [shorts, setShorts] = useState<ShortScript[]>([]);

  const handleGenerate = useCallback(() => {
    if (!topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }

    setIsGenerating(true);
    setShorts([]);

    setTimeout(() => {
      const generated = generateMockShorts(topic, platform, tone);
      setShorts(generated);
      setIsGenerating(false);
      toast.success("3 script variations generated!", {
        description: `Platform: ${platform === "both" ? "YouTube Shorts + Instagram Reels" : platform === "youtube" ? "YouTube Shorts" : "Instagram Reels"}`,
      });
    }, 2000);
  }, [topic, platform, tone]);

  const handleCopyShort = useCallback((short: ShortScript) => {
    const text = [
      `HOOK: ${short.hookLine}`,
      "",
      ...short.keyPoints.map((p, i) => `${i + 1}. ${p}`),
      "",
      `CTA: ${short.cta}`,
      "",
      short.hashtags.map((h) => `#${h}`).join(" "),
    ].join("\n");

    navigator.clipboard.writeText(text).then(() => {
      toast.success(`Variation ${short.id} copied to clipboard`);
    });
  }, []);

  const platformLabel =
    platform === "both"
      ? "YouTube Shorts + Instagram Reels"
      : platform === "youtube"
        ? "YouTube Shorts"
        : "Instagram Reels";

  return (
    <AdminLayout>
      <AdminPageContainer>
        {/* Header */}
        <div className="flex flex-col gap-1">
          <Link
            href="/admin/creator"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Creator Studio
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <Smartphone className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Shorts / Reels Generator
              </h1>
              <p className="text-sm text-muted-foreground">
                Create short-form video scripts for Instagram Reels and YouTube
                Shorts.
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Script Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Topic */}
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="shorts-topic">Topic</Label>
                <Input
                  id="shorts-topic"
                  placeholder="e.g. Best mutual funds for beginners"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              {/* Platform */}
              <div className="space-y-2">
                <Label>Platform</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="youtube">YouTube Shorts</SelectItem>
                    <SelectItem value="instagram">Instagram Reels</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tone */}
              <div className="space-y-2">
                <Label>Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="urgent">Urgent / Clickbait</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-5">
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={isGenerating}
                onClick={handleGenerate}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate 3 Variations
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Empty state */}
        {shorts.length === 0 && !isGenerating && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500/10 mb-4">
                <Smartphone className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold mb-1">
                No shorts generated yet
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Enter a topic above and click Generate to create 3 short-form
                script variations with hooks, key points, CTAs, and hashtags.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Loading state */}
        {isGenerating && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Loader2 className="h-10 w-10 animate-spin text-emerald-600 dark:text-emerald-400 mb-4" />
              <h3 className="text-lg font-semibold mb-1">
                Generating variations...
              </h3>
              <p className="text-sm text-muted-foreground">
                Creating 3 script variations for {platformLabel}.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {shorts.length > 0 && !isGenerating && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {shorts.map((short) => (
              <Card
                key={short.id}
                className="flex flex-col transition-shadow hover:shadow-md"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        {short.id}
                      </span>
                      <CardTitle className="text-sm font-semibold">
                        Variation {short.id}
                      </CardTitle>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8"
                      onClick={() => handleCopyShort(short)}
                    >
                      <Copy className="h-3.5 w-3.5 mr-1.5" />
                      Copy
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  {/* Hook */}
                  <div>
                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
                      Hook Line
                    </p>
                    <p className="text-sm font-medium leading-snug">
                      &ldquo;{short.hookLine}&rdquo;
                    </p>
                  </div>

                  {/* Key Points */}
                  <div>
                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1.5">
                      Key Points
                    </p>
                    <ul className="space-y-1.5">
                      {short.keyPoints.map((point, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold mt-0.5">
                            {i + 1}
                          </span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <div>
                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
                      Call to Action
                    </p>
                    <p className="text-sm text-muted-foreground italic">
                      &ldquo;{short.cta}&rdquo;
                    </p>
                  </div>

                  {/* Hashtags */}
                  <div>
                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1.5">
                      <Hash className="inline h-3 w-3 mr-0.5 -mt-0.5" />
                      Hashtags
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {short.hashtags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-[11px]"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </AdminPageContainer>
    </AdminLayout>
  );
}
