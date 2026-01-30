"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import AdminTopBar from '@/components/admin/AdminTopBar';
import type { NavigationCategory } from '@/lib/navigation/config';

interface ConditionalTopBarProps {
  initialConfig?: NavigationCategory[];
}

/**
 * Renders public Navbar or admin AdminTopBar based on route.
 * Keeps CMS integrated (same app) but with a dedicated shell when in /admin
 * so it can later be standalone (e.g. different domain / white-label).
 */
export default function ConditionalTopBar({ initialConfig }: ConditionalTopBarProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin') ?? false;

  if (isAdmin) {
    return <AdminTopBar />;
  }

  return <Navbar initialConfig={initialConfig} />;
}
