import { RefreshCw, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface LastUpdatedBadgeProps {
  publishedAt: string;
  updatedAt?: string;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function daysBetween(a: string, b: string): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.abs((new Date(a).getTime() - new Date(b).getTime()) / msPerDay);
}

export default function LastUpdatedBadge({
  publishedAt,
  updatedAt,
}: LastUpdatedBadgeProps) {
  const hasUpdate = updatedAt && daysBetween(publishedAt, updatedAt) > 1;

  if (hasUpdate) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 text-xs",
          "text-action-green dark:text-green-400",
        )}
      >
        <RefreshCw className="w-3 h-3" />
        <span>Updated {formatDate(updatedAt)}</span>
      </span>
    );
  }

  // No meaningful update — show published date subtly
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs",
        "text-ink-60 dark:text-ink-60",
      )}
    >
      <Calendar className="w-3 h-3" />
      <span>{formatDate(publishedAt)}</span>
    </span>
  );
}
