"use client";

import React, { useRef } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import AdminTopBar from '@/components/admin/AdminTopBar';
import type { NavigationCategory } from '@/lib/navigation/config';

interface ConditionalTopBarProps {
  initialConfig?: NavigationCategory[];
}

/**
 * Renders public Navbar or admin AdminTopBar based on route.
 * Uses pathname + window fallback so admin always gets AdminTopBar (Logo, center text nav).
 */
export default function ConditionalTopBar({ initialConfig }: ConditionalTopBarProps) {
  const pathname = usePathname();
  const lastAdminRef = useRef<boolean | null>(null);

  const pathIsAdmin = pathname ? pathname.startsWith('/admin') : null;
  if (pathIsAdmin !== null) lastAdminRef.current = pathIsAdmin;

  const isAdmin =
    pathIsAdmin === true ||
    pathIsAdmin === false
      ? pathIsAdmin
      : lastAdminRef.current ??
        (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin'));

  if (isAdmin) {
    return <AdminTopBar key="admin-top-bar" />;
  }

  return <Navbar key="navbar" initialConfig={initialConfig} />;
}
