"use client";

import React, { useState, useMemo } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminPageContainer from "@/components/admin/AdminPageContainer";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileText,
  Target,
  Link as LinkIcon,
  X,
  ArrowRight,
  Layers,
  Clock,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

import {
  buildCalendar,
  CATEGORY_COLORS,
  STATUS_COLORS,
  TYPE_LABELS,
  CATEGORY_LABELS,
  type CalendarEntry,
  type ContentCategory,
  type ContentStatus,
} from "@/lib/content-calendar/calendar-data";
import {
  generateBrief,
  type ContentBrief,
} from "@/lib/content-calendar/brief-generator";

// ============================================================================
// HELPERS
// ============================================================================

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = (firstDay.getDay() + 6) % 7; // Mon=0
  const totalDays = lastDay.getDate();
  return { startOffset, totalDays, firstDay, lastDay };
}

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ============================================================================
// CLUSTER CONFIG
// ============================================================================

const CLUSTER_LABELS: Record<string, { label: string; color: string }> = {
  "credit-cards-cibil": {
    label: "Credit Cards + CIBIL",
    color: "bg-green-500",
  },
  "mutual-funds-sip": { label: "Mutual Funds + SIP", color: "bg-blue-500" },
  "tax-loans-savings": { label: "Tax + Loans", color: "bg-amber-500" },
  "insurance-savings": { label: "Insurance + Savings", color: "bg-red-500" },
};

// ============================================================================
// DETAIL PANEL
// ============================================================================

function EntryDetailPanel({
  entry,
  brief,
  onClose,
}: {
  entry: CalendarEntry;
  brief: ContentBrief;
  onClose: () => void;
}) {
  const catColor = CATEGORY_COLORS[entry.category];
  const statusColor = STATUS_COLORS[entry.status];

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <Badge
                className={cn(
                  "text-xs",
                  catColor.bg,
                  catColor.text,
                  catColor.border,
                )}
              >
                {CATEGORY_LABELS[entry.category]}
              </Badge>
              <Badge
                className={cn("text-xs", statusColor.bg, statusColor.text)}
              >
                {entry.status}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {TYPE_LABELS[entry.type]}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {entry.searchIntent}
              </Badge>
            </div>
            <CardTitle className="text-lg leading-snug">
              {entry.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {new Date(entry.date + "T00:00:00").toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="shrink-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Brief */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" /> Content Brief
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {entry.contentBrief}
          </p>
        </div>

        {/* Keywords */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5" /> Target Keyword
          </h4>
          <Badge className="bg-primary/10 text-primary border-primary/20">
            {entry.targetKeyword}
          </Badge>
          <div className="flex flex-wrap gap-1 mt-2">
            {entry.secondaryKeywords.map((kw) => (
              <Badge key={kw} variant="outline" className="text-xs">
                {kw}
              </Badge>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-2 rounded-lg bg-muted">
            <p className="text-lg font-bold tabular-nums">
              {entry.wordCountTarget.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Words</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted">
            <p className="text-lg font-bold capitalize">{entry.priority}</p>
            <p className="text-xs text-muted-foreground">Priority</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted">
            <p className="text-lg font-bold">{brief.suggestedH2s.length}</p>
            <p className="text-xs text-muted-foreground">Sections</p>
          </div>
        </div>

        {/* Unique Angle */}
        <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
          <h4 className="text-sm font-semibold text-primary mb-1">
            Unique Angle
          </h4>
          <p className="text-sm text-foreground">{brief.uniqueAngle}</p>
        </div>

        {/* Suggested H2s */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" /> Suggested H2s
          </h4>
          <ol className="space-y-1 list-decimal list-inside">
            {brief.suggestedH2s.map((h2) => (
              <li key={h2} className="text-sm text-muted-foreground">
                {h2}
              </li>
            ))}
          </ol>
        </div>

        {/* FAQs */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2">
            Suggested FAQs
          </h4>
          <ul className="space-y-1">
            {brief.suggestedFAQs.map((faq) => (
              <li
                key={faq}
                className="text-sm text-muted-foreground flex gap-1.5"
              >
                <span className="text-primary shrink-0">Q:</span> {faq}
              </li>
            ))}
          </ul>
        </div>

        {/* Internal Links */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
            <LinkIcon className="w-3.5 h-3.5" /> Internal Links
          </h4>
          <div className="space-y-1">
            {brief.internalLinks.map((link) => (
              <div
                key={link.url}
                className="text-sm text-primary hover:underline cursor-pointer flex items-center gap-1"
              >
                <ArrowRight className="w-3 h-3 shrink-0" />
                <span>{link.text}</span>
                <span className="text-muted-foreground text-xs">
                  ({link.url})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Competitor Gaps */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5" /> Competitor Gaps
          </h4>
          <ul className="space-y-1">
            {brief.competitorGaps.map((gap) => (
              <li
                key={gap}
                className="text-sm text-muted-foreground flex gap-1.5"
              >
                <span className="text-amber-500 shrink-0">-</span> {gap}
              </li>
            ))}
          </ul>
        </div>

        {/* Schema Type */}
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold">Schema:</span>
          <Badge variant="outline">{brief.schemaType}</Badge>
        </div>

        {/* CTA */}
        <Link
          href={`/admin/articles/new?title=${encodeURIComponent(entry.title)}&category=${entry.category}`}
        >
          <Button className="w-full mt-2">
            <FileText className="w-4 h-4 mr-2" />
            Create This Article
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function ContentCalendarPage() {
  const calendar = useMemo(() => buildCalendar(), []);

  // Build a lookup: YYYY-MM-DD -> CalendarEntry[]
  const entriesByDate = useMemo(() => {
    const map = new Map<string, CalendarEntry[]>();
    for (const e of calendar) {
      const existing = map.get(e.date) ?? [];
      existing.push(e);
      map.set(e.date, existing);
    }
    return map;
  }, [calendar]);

  // Month navigation
  const firstEntryDate = calendar[0]
    ? new Date(calendar[0].date + "T00:00:00")
    : new Date();
  const [viewYear, setViewYear] = useState(firstEntryDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(firstEntryDate.getMonth());

  // Selection
  const [selectedEntry, setSelectedEntry] = useState<CalendarEntry | null>(
    null,
  );
  const [selectedBrief, setSelectedBrief] = useState<ContentBrief | null>(null);

  // Filters
  const [filterCategory, setFilterCategory] = useState<ContentCategory | null>(
    null,
  );

  const { startOffset, totalDays } = getMonthDays(viewYear, viewMonth);

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString(
    "en-IN",
    {
      month: "long",
      year: "numeric",
    },
  );

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  function handleEntryClick(entry: CalendarEntry) {
    setSelectedEntry(entry);
    setSelectedBrief(generateBrief(entry));
  }

  // Stats
  const filteredCalendar = filterCategory
    ? calendar.filter((e) => e.category === filterCategory)
    : calendar;

  const pillarCount = filteredCalendar.filter(
    (e) => e.type === "pillar",
  ).length;
  const totalWords = filteredCalendar.reduce(
    (sum, e) => sum + e.wordCountTarget,
    0,
  );
  const clusters = new Set(filteredCalendar.map((e) => e.cluster));

  return (
    <AdminLayout>
      <AdminPageContainer>
        <AdminPageHeader
          title="Content Calendar"
          actions={
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                <Clock className="w-3 h-3 mr-1" />
                30-Day Plan
              </Badge>
            </div>
          }
        />

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-border">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold tabular-nums">
                {filteredCalendar.length}
              </p>
              <p className="text-xs text-muted-foreground">Total Articles</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold tabular-nums">{pillarCount}</p>
              <p className="text-xs text-muted-foreground">Pillar Pages</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold tabular-nums">
                {(totalWords / 1000).toFixed(1)}k
              </p>
              <p className="text-xs text-muted-foreground">Total Words</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold tabular-nums">{clusters.size}</p>
              <p className="text-xs text-muted-foreground">Topic Clusters</p>
            </CardContent>
          </Card>
        </div>

        {/* Cluster Legend */}
        <div className="flex flex-wrap gap-3">
          {Object.entries(CLUSTER_LABELS).map(([key, { label, color }]) => (
            <div
              key={key}
              className="flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <div className={cn("w-2.5 h-2.5 rounded-full", color)} />
              {label}
            </div>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filterCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterCategory(null)}
          >
            All
          </Button>
          {(Object.keys(CATEGORY_LABELS) as ContentCategory[]).map((cat) => {
            const colors = CATEGORY_COLORS[cat];
            return (
              <Button
                key={cat}
                variant={filterCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  setFilterCategory(filterCategory === cat ? null : cat)
                }
                className={filterCategory === cat ? "" : cn(colors.text)}
              >
                {CATEGORY_LABELS[cat]}
              </Button>
            );
          })}
        </div>

        {/* Main Grid: Calendar + Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Grid */}
          <div className="lg:col-span-2">
            <Card className="border-border">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="sm" onClick={prevMonth}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <CardTitle className="text-lg">{monthLabel}</CardTitle>
                  <Button variant="ghost" size="sm" onClick={nextMonth}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Weekday headers */}
                <div className="grid grid-cols-7 gap-1 mb-1">
                  {WEEKDAYS.map((d) => (
                    <div
                      key={d}
                      className="text-center text-xs font-semibold text-muted-foreground py-1"
                    >
                      {d}
                    </div>
                  ))}
                </div>

                {/* Day cells */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Empty offset cells */}
                  {Array.from({ length: startOffset }).map((_, i) => (
                    <div key={`empty-${i}`} className="min-h-[80px]" />
                  ))}

                  {/* Day cells */}
                  {Array.from({ length: totalDays }).map((_, i) => {
                    const dayNum = i + 1;
                    const dateStr = formatDate(
                      new Date(viewYear, viewMonth, dayNum),
                    );
                    const dayEntries = (
                      entriesByDate.get(dateStr) ?? []
                    ).filter(
                      (e) => !filterCategory || e.category === filterCategory,
                    );
                    const isToday = dateStr === formatDate(new Date());
                    const isWeekend = (startOffset + i) % 7 >= 5;

                    return (
                      <div
                        key={dayNum}
                        className={cn(
                          "min-h-[80px] p-1 rounded-md border text-left transition-colors",
                          isToday
                            ? "border-primary bg-primary/5"
                            : "border-border",
                          isWeekend && "bg-muted/30",
                          dayEntries.length > 0 &&
                            "cursor-pointer hover:border-primary/50",
                        )}
                        onClick={() => {
                          if (dayEntries.length > 0) {
                            handleEntryClick(dayEntries[0]);
                          }
                        }}
                      >
                        <span
                          className={cn(
                            "text-xs font-medium tabular-nums",
                            isToday
                              ? "text-primary font-bold"
                              : "text-foreground",
                          )}
                        >
                          {dayNum}
                        </span>
                        <div className="mt-0.5 space-y-0.5">
                          {dayEntries.map((entry) => {
                            const catColor = CATEGORY_COLORS[entry.category];
                            const clusterInfo = CLUSTER_LABELS[entry.cluster];
                            return (
                              <div
                                key={entry.slug}
                                className={cn(
                                  "rounded px-1 py-0.5 text-[10px] leading-tight font-medium truncate border",
                                  catColor.bg,
                                  catColor.text,
                                  catColor.border,
                                  selectedEntry?.slug === entry.slug &&
                                    "ring-1 ring-primary",
                                )}
                                title={entry.title}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEntryClick(entry);
                                }}
                              >
                                <div className="flex items-center gap-0.5">
                                  {clusterInfo && (
                                    <div
                                      className={cn(
                                        "w-1.5 h-1.5 rounded-full shrink-0",
                                        clusterInfo.color,
                                      )}
                                    />
                                  )}
                                  <span className="truncate">
                                    {entry.type === "pillar"
                                      ? "P"
                                      : entry.type === "comparison"
                                        ? "C"
                                        : "S"}{" "}
                                    {entry.title.length > 25
                                      ? entry.title.slice(0, 25) + "..."
                                      : entry.title}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* List View */}
            <Card className="border-border mt-6">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  All Planned Content ({filteredCalendar.length} articles)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {filteredCalendar.map((entry) => {
                    const catColor = CATEGORY_COLORS[entry.category];
                    const statusColor = STATUS_COLORS[entry.status];
                    const clusterInfo = CLUSTER_LABELS[entry.cluster];

                    return (
                      <div
                        key={entry.slug}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/30 transition-colors cursor-pointer",
                          selectedEntry?.slug === entry.slug &&
                            "border-primary bg-primary/5",
                        )}
                        onClick={() => handleEntryClick(entry)}
                      >
                        {/* Date */}
                        <div className="text-center min-w-[48px] shrink-0">
                          <p className="text-sm font-bold tabular-nums">
                            {new Date(entry.date + "T00:00:00").getDate()}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {new Date(
                              entry.date + "T00:00:00",
                            ).toLocaleDateString("en-IN", {
                              month: "short",
                            })}
                          </p>
                        </div>

                        {/* Cluster dot */}
                        {clusterInfo && (
                          <div
                            className={cn(
                              "w-2 h-2 rounded-full shrink-0",
                              clusterInfo.color,
                            )}
                          />
                        )}

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {entry.title}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            <Badge
                              className={cn(
                                "text-[10px] py-0 h-4",
                                catColor.bg,
                                catColor.text,
                                catColor.border,
                              )}
                            >
                              {CATEGORY_LABELS[entry.category]}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="text-[10px] py-0 h-4"
                            >
                              {TYPE_LABELS[entry.type]}
                            </Badge>
                            <Badge
                              className={cn(
                                "text-[10px] py-0 h-4",
                                statusColor.bg,
                                statusColor.text,
                              )}
                            >
                              {entry.status}
                            </Badge>
                          </div>
                        </div>

                        {/* Word count */}
                        <div className="text-right shrink-0 hidden sm:block">
                          <p className="text-xs text-muted-foreground tabular-nums">
                            {entry.wordCountTarget.toLocaleString()} words
                          </p>
                          <p className="text-[10px] text-muted-foreground capitalize">
                            {entry.priority}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-1">
            {selectedEntry && selectedBrief ? (
              <div className="sticky top-6">
                <EntryDetailPanel
                  entry={selectedEntry}
                  brief={selectedBrief}
                  onClose={() => {
                    setSelectedEntry(null);
                    setSelectedBrief(null);
                  }}
                />
              </div>
            ) : (
              <Card className="border-border border-dashed">
                <CardContent className="p-8 text-center">
                  <Calendar className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Click on a calendar entry to view its content brief,
                    suggested H2s, FAQs, and internal linking strategy.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </AdminPageContainer>
    </AdminLayout>
  );
}
