"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({
  items,
  className = "",
}: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-2 text-sm ${className}`}
    >
      {/* Home Link */}
      <Link
        href="/"
        className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        aria-label="Home"
      >
        <Home className="w-4 h-4" />
        <span className="hidden sm:inline">Home</span>
      </Link>

      {/* Breadcrumb Items */}
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const Icon = item.icon;

        return (
          <React.Fragment key={item.href}>
            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />

            {isLast ? (
              // Last item - not a link
              <span className="flex items-center gap-1 text-gray-900 dark:text-white font-medium">
                {Icon && <Icon className="w-4 h-4" />}
                <span className="line-clamp-1">{item.label}</span>
              </span>
            ) : (
              // Intermediate items - links
              <Link
                href={item.href}
                className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span className="line-clamp-1">{item.label}</span>
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
