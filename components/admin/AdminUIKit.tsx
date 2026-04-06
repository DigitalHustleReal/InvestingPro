"use client";

import React, { ReactNode } from "react";
import { AdminBreadcrumb } from "./AdminBreadcrumb";
import { LucideIcon, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: "teal" | "purple" | "blue" | "amber" | "rose";
  actions?: ReactNode;
  showBreadcrumb?: boolean;
}

const ICON_COLOR_CLASSES = {
  teal: "bg-primary/10 border-primary/20 text-primary",
  purple: "bg-green-500/10 border-green-500/20 text-green-400",
  blue: "bg-blue-500/10 border-blue-500/20 text-blue-400",
  amber: "bg-amber-500/10 border-amber-500/20 text-amber-400",
  rose: "bg-error/10 border-error/20 text-error",
};

export function AdminPageHeader({
  title,
  subtitle,
  icon: Icon,
  iconColor = "teal",
  actions,
  showBreadcrumb = false,
}: AdminPageHeaderProps) {
  const colorClasses = ICON_COLOR_CLASSES[iconColor] || ICON_COLOR_CLASSES.teal;

  return (
    <div className="mb-8">
      {showBreadcrumb && <AdminBreadcrumb />}

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          {Icon && (
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center shadow-sm border",
                colorClasses,
              )}
            >
              <Icon className="w-6 h-6" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight leading-tight m-0 font-display">
              {title}
            </h1>
            {subtitle && (
              <p className="text-muted-foreground mt-1 text-sm m-0 font-sans">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: LucideIcon;
  color?: "teal" | "purple" | "blue" | "amber" | "rose";
}

export function StatCard({
  label,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  color = "blue",
}: StatCardProps) {
  const isPositive = changeType === "positive";
  const isNegative = changeType === "negative";

  return (
    <div className="group relative overflow-hidden rounded-xl bg-card border border-border p-6 transition-all duration-300 hover:shadow-md hover:border-primary/30">
      <div className="relative flex items-start justify-between z-10">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground font-sans mb-2">
            {label}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-foreground tracking-tight font-display tabular-nums">
              {value}
            </h3>
          </div>

          {change && (
            <div
              className={cn(
                "flex items-center gap-1.5 mt-3 text-xs font-medium px-2 py-1 rounded-md w-fit border",
                isPositive
                  ? "text-success bg-success/10 border-success/20"
                  : isNegative
                    ? "text-error bg-error/10 border-error/20"
                    : "text-muted-foreground bg-muted border-border",
              )}
            >
              {isPositive && <span className="text-[10px] ">▲</span>}
              {isNegative && <span className="text-[10px] ">▼</span>}
              {change}
            </div>
          )}
        </div>

        {Icon && (
          <div
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-lg border shadow-sm transition-transform group-hover:scale-105 duration-300",
              color === "teal"
                ? "bg-primary/10 border-primary/20 text-primary"
                : color === "purple"
                  ? "bg-green-500/10 border-green-500/20 text-green-400"
                  : color === "amber"
                    ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                    : color === "rose"
                      ? "bg-error/10 border-error/20 text-error"
                      : "bg-primary/10 border-primary/20 text-primary",
            )}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}

interface ContentSectionProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function ContentSection({
  title,
  subtitle,
  actions,
  children,
}: ContentSectionProps) {
  return (
    <section className="rounded-xl bg-card border border-border shadow-sm overflow-hidden mb-6">
      {(title || actions) && (
        <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-4">
          <div>
            {title && (
              <h2 className="text-sm font-semibold text-foreground m-0 font-sans tracking-wide">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-0.5 m-0 font-sans">
                {subtitle}
              </p>
            )}
          </div>
          {actions}
        </div>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

interface ActionButtonProps {
  onClick?: () => void;
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  isLoading?: boolean;
  icon?: LucideIcon;
  className?: string;
}

export function ActionButton({
  onClick,
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  isLoading = false,
  icon: Icon,
  className,
}: ActionButtonProps) {
  const buttonVariant =
    variant === "primary"
      ? "default"
      : variant === "secondary"
        ? "outline"
        : variant === "danger"
          ? "destructive"
          : "ghost";

  return (
    <Button
      onClick={onClick}
      disabled={disabled || isLoading}
      variant={buttonVariant}
      size={size === "sm" ? "sm" : size === "lg" ? "lg" : "default"}
      className={cn(
        "gap-2 font-bold transition-all duration-300 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
        variant === "primary" &&
          "bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-0.5 shadow-lg shadow-primary/20 hover:shadow-primary/30 border-none",
        variant === "secondary" &&
          "bg-muted text-foreground border border-border hover:bg-muted/80 hover:border-primary/30 hover:-translate-y-0.5 hover:shadow-sm",
        variant === "ghost" &&
          "text-muted-foreground hover:text-primary hover:bg-primary/10",
        variant === "danger" &&
          "bg-error/10 border border-error/20 text-error hover:bg-error hover:text-error-foreground hover:-translate-y-0.5",
        className,
      )}
    >
      {isLoading ? (
        <RefreshCw className="w-4 h-4 animate-spin" />
      ) : (
        Icon && <Icon className="w-4 h-4" />
      )}
      {children}
    </Button>
  );
}

export function DataTable({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-border overflow-hidden bg-card shadow-sm">
      <table className="w-full border-collapse">{children}</table>
    </div>
  );
}

export function TableHeader({ children }: { children: ReactNode }) {
  return (
    <thead className="bg-muted/50">
      <tr className="border-b border-border">{children}</tr>
    </thead>
  );
}

export function TableHeaderCell({
  children,
  className = "",
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <th
      className={cn(
        "px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function TableBody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-border-subtle">{children}</tbody>;
}

export function TableRow({
  children,
  onClick,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        "border-b border-border transition-colors",
        onClick ? "cursor-pointer hover:bg-muted" : "cursor-default",
        className,
      )}
    >
      {children}
    </tr>
  );
}

export function TableCell({
  children,
  className = "",
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <td
      className={cn(
        "px-4 py-3 text-sm text-foreground align-middle",
        className,
      )}
    >
      {children}
    </td>
  );
}

interface StatusBadgeProps {
  children?: ReactNode;
  status?: "neutral" | "completed" | "processing" | "warning" | "error";
  label?: string;
  size?: "sm" | "md";
}

export function StatusBadge({
  children,
  status = "neutral",
  label,
  size = "md",
}: StatusBadgeProps) {
  const variants = {
    neutral: "bg-muted text-muted-foreground border-border",
    completed: "bg-success/10 text-success border-success/20",
    processing: "bg-info/10 text-info border-info/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    error: "bg-error/10 text-error border-error/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-bold uppercase tracking-wider whitespace-nowrap border backdrop-blur-sm",
        size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-[11px]",
        variants[status],
      )}
    >
      {status === "processing" && (
        <RefreshCw className="w-3 h-3 mr-1.5 animate-spin" />
      )}
      {label || children}
    </span>
  );
}

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-6">
      {Icon && (
        <div className="w-16 h-16 rounded-xl bg-card border border-border flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
          <Icon className="w-8 h-8 text-muted-foreground" />
        </div>
      )}
      <h3 className="text-base font-semibold text-foreground mb-2 m-0 font-inter">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto font-inter">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
