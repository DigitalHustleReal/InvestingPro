/**
 * Admin Layout
 * Forces dynamic rendering for ALL admin pages to prevent prerendering errors
 */

// Force dynamic rendering for all admin pages - prevents database calls during build
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
