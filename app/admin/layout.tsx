/**
 * Admin Layout
 *
 * Auth is enforced UPSTREAM in middleware.ts (lines 110-133):
 *   - Unauthenticated users on /admin/* → redirected to /admin/login
 *   - Authenticated non-admin users on /admin/* → redirected to
 *     /admin/login?error=access_denied
 *   - /admin/login and /admin/signup are excluded from the gate
 *     (isAuthPage check)
 *
 * Middleware uses getUserRole() which checks user_roles + user_profiles,
 * exact same logic as lib/auth/admin-auth.ts requireAdmin(). We do NOT
 * duplicate the check here because that would cause a redirect loop on
 * /admin/login (the layout runs for all /admin/* routes including login).
 *
 * If middleware ever stops covering /admin/* (e.g., matcher change),
 * this layout becomes unprotected — verify middleware coverage when
 * touching either file.
 */

import "./admin-theme.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
