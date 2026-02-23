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

  const isAdmin =
    (pathname?.startsWith('/admin') || 
     pathname?.startsWith('/hi/admin') ||
     (typeof window !== 'undefined' && (
       window.location.pathname.startsWith('/admin') || 
       window.location.pathname.startsWith('/hi/admin')
     )));

  if (isAdmin) {
    return <AdminTopBar key="admin-top-bar" />;
  }

  return <Navbar key="navbar" initialConfig={initialConfig} />;
}
