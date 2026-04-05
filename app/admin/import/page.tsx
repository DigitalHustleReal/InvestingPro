"use client";

import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminPageContainer from "@/components/admin/AdminPageContainer";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useRouter } from "next/navigation";
import {
  FileSpreadsheet,
  FileJson,
  Sheet,
  FileText,
  Upload,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Import Source Cards ---

interface ImportSourceCard {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  href: string | null; // null = coming soon
  color: string; // tailwind bg class for icon container
}

const IMPORT_SOURCES: ImportSourceCard[] = [
  {
    id: "csv",
    title: "CSV Upload",
    description:
      "Drag & drop a CSV file, map columns to article fields, and import in bulk.",
    icon: FileSpreadsheet,
    href: "/admin/import/csv",
    color:
      "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  },
  {
    id: "json",
    title: "JSON Upload",
    description:
      "Upload a JSON file, preview the data structure, and import articles.",
    icon: FileJson,
    href: "/admin/import/json",
    color:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  },
  {
    id: "sheets",
    title: "Google Sheets",
    description:
      "Paste a public Google Sheets URL to fetch and import rows as articles.",
    icon: Sheet,
    href: null,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  },
  {
    id: "markdown",
    title: "Markdown Files",
    description:
      "Upload .md files and convert them to articles with frontmatter parsing.",
    icon: FileText,
    href: "/admin/import/markdown",
    color:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
  },
];

// --- Recent Import Placeholder Data ---

interface RecentImport {
  id: string;
  source: string;
  filename: string;
  articlesImported: number;
  status: "success" | "failed" | "partial";
  date: string;
}

const RECENT_IMPORTS: RecentImport[] = [
  {
    id: "1",
    source: "CSV",
    filename: "credit-cards-batch-apr.csv",
    articlesImported: 24,
    status: "success",
    date: "2026-04-04",
  },
  {
    id: "2",
    source: "CSV",
    filename: "mutual-funds-q1.csv",
    articlesImported: 18,
    status: "success",
    date: "2026-04-02",
  },
  {
    id: "3",
    source: "JSON",
    filename: "loans-export.json",
    articlesImported: 5,
    status: "partial",
    date: "2026-03-28",
  },
  {
    id: "4",
    source: "Markdown",
    filename: "blog-posts.zip",
    articlesImported: 0,
    status: "failed",
    date: "2026-03-25",
  },
];

function StatusBadge({ status }: { status: RecentImport["status"] }) {
  const config = {
    success: {
      label: "Success",
      icon: CheckCircle2,
      cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    },
    partial: {
      label: "Partial",
      icon: Clock,
      cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    },
    failed: {
      label: "Failed",
      icon: XCircle,
      cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    },
  }[status];

  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full",
        config.cls,
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
}

export default function ImportHubPage() {
  const router = useRouter();

  return (
    <AdminLayout>
      <AdminPageContainer>
        {/* Header */}
        <AdminPageHeader title="Import Hub">
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
            Bulk-import content from CSV files, JSON exports, Google Sheets, or
            Markdown files. Map fields, preview data, and import articles in
            seconds.
          </p>
        </AdminPageHeader>

        {/* Import Source Cards — 2x2 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {IMPORT_SOURCES.map((source) => {
            const Icon = source.icon;
            const isAvailable = source.href !== null;

            return (
              <button
                key={source.id}
                onClick={() => isAvailable && router.push(source.href!)}
                disabled={!isAvailable}
                className={cn(
                  "group relative flex flex-col items-start gap-4 p-6 rounded-xl border text-left transition-all duration-200",
                  "bg-card hover:shadow-md",
                  isAvailable
                    ? "border-border hover:border-primary/40 cursor-pointer"
                    : "border-border/50 opacity-60 cursor-not-allowed",
                )}
              >
                {/* Icon */}
                <div className={cn("p-3 rounded-lg", source.color)}>
                  <Icon className="w-6 h-6" />
                </div>

                {/* Text */}
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-foreground font-inter flex items-center gap-2">
                    {source.title}
                    {!isAvailable && (
                      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        Coming Soon
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {source.description}
                  </p>
                </div>

                {/* Action arrow */}
                {isAvailable && (
                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-5 h-5 text-primary" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Recent Imports Table */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground font-inter">
            Recent Imports
          </h2>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground font-inter">
                      Source
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground font-inter">
                      File
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground font-inter">
                      Articles
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground font-inter">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground font-inter">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {RECENT_IMPORTS.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-muted px-2 py-1 rounded-md text-foreground">
                          <Upload className="w-3 h-3" />
                          {item.source}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground font-mono text-xs">
                        {item.filename}
                      </td>
                      <td className="px-4 py-3 text-foreground tabular-nums">
                        {item.articlesImported}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {item.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </AdminPageContainer>
    </AdminLayout>
  );
}
