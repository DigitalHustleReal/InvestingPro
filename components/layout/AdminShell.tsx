"use client";

import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";

interface AdminShellProps {
  children: ReactNode;
}

/**
 * Wraps the layout when on admin routes to force admin-pro dark theme.
 * Ensures header, sidebar, and content all use the same dark palette.
 */
export default function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const isAdmin =
    pathname?.startsWith("/admin") ??
    (typeof window !== "undefined" && window.location.pathname.startsWith("/admin"));

  if (isAdmin) {
    return (
      <div className="admin-pro-app min-h-screen bg-admin-pro-bg text-admin-pro-text flex flex-col [color-scheme:dark]">
        {children}
      </div>
    );
  }

  return <>{children}</>;
}
