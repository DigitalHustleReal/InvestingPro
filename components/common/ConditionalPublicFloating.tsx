"use client";

import React from 'react';
import { usePathname } from 'next/navigation';

/**
 * Renders children only on public (non-admin) routes.
 * Use to avoid overlapping floating UI (CompareBar, WhatsAppButton, etc.) on admin pages.
 */
export function ConditionalPublicFloating({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin') ?? false;
  if (isAdmin) return null;
  return <>{children}</>;
}
