"use client";

import React, { ReactNode } from "react";
import { AdminBreadcrumb } from "./AdminBreadcrumb";
import { cn } from "@/lib/utils";

interface AdminPageHeaderProps {
  /**
   * Page title (optional - can use breadcrumbs instead)
   */
  title?: string;
  /**
   * Optional description text below the title
   */
  description?: string;
  /**
   * Action buttons or controls to display on the right
   */
  actions?: ReactNode;
  /**
   * Whether to show breadcrumbs (layout already shows one; set true only if no layout breadcrumb)
   * @default false
   */
  showBreadcrumbs?: boolean;
  /**
   * Additional header content
   */
  children?: ReactNode;
  className?: string;
}

/**
 * AdminPageHeader - Standardized page header for admin pages
 *
 * Combines breadcrumbs, title, and action buttons in a consistent layout.
 * Integrates breadcrumbs seamlessly without separate container borders.
 *
 * Usage:
 * ```tsx
 * <AdminPageHeader
 *   title="Articles"
 *   actions={<Button>New Article</Button>}
 * />
 * ```
 */
export default function AdminPageHeader({
  title,
  description,
  actions,
  showBreadcrumbs = false,
  children,
  className,
}: AdminPageHeaderProps) {
  return (
    <div className={cn("pb-6 mb-6", className)}>
      {/* Breadcrumbs */}
      {showBreadcrumbs && (
        <div className="mb-4">
          <AdminBreadcrumb />
        </div>
      )}

      {/* Title and Actions Row */}
      {(title || actions) && (
        <div className="flex items-center justify-between gap-4">
          <div>
            {title && (
              <h1 className="text-2xl font-bold tracking-tight font-inter">
                {title}
              </h1>
            )}
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}

      {/* Additional header content */}
      {children}

      {/* Subtle gradient divider */}
      <div className="mt-6 h-[2px] bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />
    </div>
  );
}
