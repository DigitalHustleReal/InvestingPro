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

// v3 Bold Redesign: simple border + light bg, no gradients (per brainstorm rule).
// Sharp corners (rounded-sm), 2px accent border, mono uppercase label.
// Five accent tones map to the 6-color brainstorm palette — no blue or purple.

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
    accentClass: string; // border + icon + label
    bgClass: string; // tinted background
  }
> = {
  tip: {
    icon: Lightbulb,
    defaultTitle: "Tip",
    accentClass: "border-indian-gold text-indian-gold",
    bgClass: "bg-indian-gold/5",
  },
  warning: {
    icon: AlertTriangle,
    defaultTitle: "Watch out",
    accentClass: "border-indian-gold text-indian-gold",
    bgClass: "bg-indian-gold/10",
  },
  info: {
    icon: Info,
    defaultTitle: "Context",
    accentClass: "border-ink text-ink",
    bgClass: "bg-canvas",
  },
  danger: {
    icon: XCircle,
    defaultTitle: "Important",
    accentClass: "border-warning-red text-warning-red",
    bgClass: "bg-warning-red/5",
  },
  success: {
    icon: CheckCircle2,
    defaultTitle: "Rule of thumb",
    accentClass: "border-action-green text-action-green",
    bgClass: "bg-action-green/5",
  },
};

export default function Callout({ type, title, children }: CalloutProps) {
  const config = calloutConfig[type];
  const Icon = config.icon;
  const displayTitle = title ?? config.defaultTitle;

  // Extract accent border colour class from accentClass (first token is "border-X")
  const leftBorderClass = config.accentClass.split(" ")[0];

  return (
    <div
      className={cn(
        "my-8 rounded-sm border-l-4 p-5",
        leftBorderClass,
        config.bgClass,
      )}
      role="note"
      aria-label={displayTitle}
    >
      <div className="mb-3 flex items-center gap-2 pb-2 border-b border-ink/10">
        <Icon className={cn("h-4 w-4 shrink-0", config.accentClass.split(" ")[1])} />
        <span
          className={cn(
            "font-mono text-[11px] font-semibold uppercase tracking-wider",
            config.accentClass.split(" ")[1],
          )}
        >
          {displayTitle}
        </span>
      </div>
      <div className="text-[15px] leading-relaxed text-ink [&>p:last-child]:mb-0 [&>p]:mb-2">
        {children}
      </div>
    </div>
  );
}
