'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/v2/layout/Navbar';
import LegalStrip from '@/components/v2/layout/LegalStrip';
import AdminTopBar from '@/components/admin/AdminTopBar';

export default function ConditionalTopBarV2() {
  const pathname = usePathname();

  const isAdmin =
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/hi/admin') ||
    (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin'));

  if (isAdmin) {
    return <AdminTopBar key="admin-top-bar" />;
  }

  return <Navbar />;
}
