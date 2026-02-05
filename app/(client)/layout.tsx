/**
 * Client Pages Layout
 * 
 * Forces dynamic rendering for all client pages that use useSearchParams
 * or other client-side features that can't be statically generated
 */

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
