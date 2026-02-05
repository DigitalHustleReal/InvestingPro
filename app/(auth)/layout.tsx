/**
 * Auth Pages Layout
 * 
 * Forces dynamic rendering for all auth pages (login, signup, etc.)
 * because they use client-side features like useSearchParams
 */

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
