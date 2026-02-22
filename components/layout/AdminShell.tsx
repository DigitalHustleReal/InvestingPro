"use client";

import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";

interface AdminShellProps {
  children: ReactNode;
}

/**
 * Wraps the layout when on admin routes to apply Wealth & Trust light theme.
 * Ensures header, sidebar, and content use navy, gold, and cream palette.
 */
export default function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const isAdmin =
    pathname?.startsWith("/admin") ??
    (typeof window !== "undefined" && window.location.pathname.startsWith("/admin"));

  if (isAdmin) {
    return (
      <div className="admin-wealth-trust min-h-screen bg-slate-950 text-slate-50 flex flex-col [color-scheme:dark]">
        {children}
      </div>
    );
  }

  return <>{children}</>;
}
