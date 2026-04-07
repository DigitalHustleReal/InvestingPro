import React from "react";
import {
  Lightbulb,
  AlertTriangle,
  Info,
  XCircle,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type CalloutType = "tip" | "warning" | "info" | "danger" | "success";

interface CalloutProps {
  type: CalloutType;
  title?: string;
  children: React.ReactNode;
}

const calloutConfig: Record<
  CalloutType,
  {
    icon: LucideIcon;
    defaultTitle: string;
    containerClass: string;
    borderClass: string;
    iconClass: string;
    titleClass: string;
  }
> = {
  tip: {
    icon: Lightbulb,
    defaultTitle: "Tip",
    containerClass:
      "bg-gradient-to-br from-green-50 to-green-50/40 dark:from-green-950/40 dark:to-green-900/20",
    borderClass: "border-l-green-700 dark:border-l-green-500",
    iconClass: "text-green-700 dark:text-green-400",
    titleClass: "text-green-800 dark:text-green-300",
  },
  warning: {
    icon: AlertTriangle,
    defaultTitle: "Warning",
    containerClass:
      "bg-gradient-to-br from-amber-50 to-amber-50/40 dark:from-amber-950/40 dark:to-amber-900/20",
    borderClass: "border-l-amber-500 dark:border-l-amber-400",
    iconClass: "text-amber-600 dark:text-amber-400",
    titleClass: "text-amber-800 dark:text-amber-300",
  },
  info: {
    icon: Info,
    defaultTitle: "Info",
    containerClass:
      "bg-gradient-to-br from-blue-50 to-blue-50/40 dark:from-blue-950/40 dark:to-blue-900/20",
    borderClass: "border-l-blue-500 dark:border-l-blue-400",
    iconClass: "text-blue-600 dark:text-blue-400",
    titleClass: "text-blue-800 dark:text-blue-300",
  },
  danger: {
    icon: XCircle,
    defaultTitle: "Important",
    containerClass:
      "bg-gradient-to-br from-red-50 to-red-50/40 dark:from-red-950/40 dark:to-red-900/20",
    borderClass: "border-l-red-500 dark:border-l-red-400",
    iconClass: "text-red-600 dark:text-red-400",
    titleClass: "text-red-800 dark:text-red-300",
  },
  success: {
    icon: CheckCircle2,
    defaultTitle: "Success",
    containerClass:
      "bg-gradient-to-br from-emerald-50 to-emerald-50/40 dark:from-emerald-950/40 dark:to-emerald-900/20",
    borderClass: "border-l-emerald-500 dark:border-l-emerald-400",
    iconClass: "text-emerald-600 dark:text-emerald-400",
    titleClass: "text-emerald-800 dark:text-emerald-300",
  },
};

export default function Callout({ type, title, children }: CalloutProps) {
  const config = calloutConfig[type];
  const Icon = config.icon;
  const displayTitle = title ?? config.defaultTitle;

  return (
    <div
      className={cn(
        "my-8 rounded-2xl border-l-[6px] p-6 shadow-sm",
        config.containerClass,
        config.borderClass,
      )}
      role="note"
      aria-label={displayTitle}
    >
      {/* Header */}
      <div className="mb-3 flex items-center gap-3">
        <Icon className={cn("h-5 w-5 shrink-0", config.iconClass)} />
        <span
          className={cn(
            "text-base font-semibold tracking-tight",
            config.titleClass,
          )}
        >
          {displayTitle}
        </span>
      </div>

      {/* Content */}
      <div className="pl-8 text-sm leading-relaxed text-gray-700 dark:text-gray-300 [&>p:last-child]:mb-0">
        {children}
      </div>
    </div>
  );
}
