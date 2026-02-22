/**
 * Security Middleware Unit Tests — withAuth
 *
 * Validates `withAuth` / `withAdminAuth` middleware WITHOUT any live Supabase
 * or network calls. Supabase client and role checks are mocked.
 *
 * Key insight: `api-auth.ts` calls `createClient()` WITHOUT await (it was
 * written when createClient was synchronous). Our mock must therefore return
 * the client object directly (not wrapped in a Promise).
 *
 * Covers:
 *  1. Unauthenticated request → 401
 *  2. Authenticated non-admin on admin route → 403
 *  3. Authenticated admin on admin route → 200
 *  4. Public route → 200 regardless of auth state
 *  5. withAdminAuth shorthand
 */

import { NextResponse } from 'next/server';
import { withAuth, withAdminAuth } from '@/lib/middleware/api-auth';

// ─── Mutable state shared by mock factories ───────────────────────────────────

let mockAuthUser: Record<string, unknown> | null = null;
let mockIsAdmin = false;

// ─── Supabase mock (sync — matches how api-auth.ts calls createClient) ────────

jest.mock('@/lib/supabase/server', () => ({
  // NOTE: api-auth.ts does `const supabase = createClient()` (no await).
  // So the mock MUST return the client object synchronously.
  createClient: () => ({
    auth: {
      getUser: async () => {
        if (mockAuthUser) {
          return { data: { user: mockAuthUser }, error: null };
        }
        return { data: { user: null }, error: { message: 'Not authenticated' } };
      },
    },
  }),
}));

jest.mock('@/lib/auth/admin-auth', () => ({
  isAdmin:  async () => mockIsAdmin,
  isEditor: async () => mockIsAdmin,
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Create a minimal request-like object.
 * The `withAuth` middleware only reads `supabase.auth.getUser()` internally —
 * it never inspects the request headers in the auth path. Using a plain object
 * cast avoids the WHATWG NextRequest read-only `url` property crash.
 */
function makeRequest() {
  return {} as Parameters<typeof withAuth>[0] extends ((...a: infer A) => unknown) ? never : import('next/server').NextRequest;
}

/** Simple handler that always returns 200. */
const okHandler = async (_req: import('next/server').NextRequest, _user: unknown) =>
  NextResponse.json({ ok: true }, { status: 200 });

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('withAuth middleware', () => {
  beforeEach(() => {
    mockAuthUser = null;
    mockIsAdmin  = false;
  });

  // ── 1. Unauthenticated ───────────────────────────────────────────────────

  it('returns 401 when no session and requireAuth', async () => {
    const handler = withAuth(okHandler, { requireAuth: true });
    const res = await handler(makeRequest() as any);
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toMatch(/unauthorized/i);
  });

  it('returns 401 when no session and requireAdmin', async () => {
    const handler = withAuth(okHandler, { requireAdmin: true });
    const res = await handler(makeRequest() as any);
    expect(res.status).toBe(401);
  });

  // ── 2. Authenticated non-admin on admin route ────────────────────────────

  it('returns 403 when authenticated but not admin', async () => {
    mockAuthUser = { id: 'user-123', email: 'user@example.com' };
    mockIsAdmin  = false;

    const handler = withAuth(okHandler, { requireAdmin: true });
    const res = await handler(makeRequest() as any);
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.error).toMatch(/forbidden/i);
  });

  // ── 3. Authenticated admin ───────────────────────────────────────────────

  it('returns 200 when user is an authenticated admin', async () => {
    mockAuthUser = { id: 'admin-456', email: 'admin@investingpro.in' };
    mockIsAdmin  = true;

    const handler = withAuth(okHandler, { requireAdmin: true });
    const res = await handler(makeRequest() as any);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
  });

  // ── 4. Public route ──────────────────────────────────────────────────────

  it('calls handler (200) for public route even when unauthenticated', async () => {
    const handler = withAuth(okHandler);
    const res = await handler(makeRequest() as any);
    expect(res.status).toBe(200);
  });

  it('calls handler (200) for public route when user IS authenticated', async () => {
    mockAuthUser = { id: 'user-789', email: 'user@example.com' };
    const handler = withAuth(okHandler);
    const res = await handler(makeRequest() as any);
    expect(res.status).toBe(200);
  });

  // ── 5. withAdminAuth shorthand ───────────────────────────────────────────

  it('withAdminAuth: 401 for unauthenticated', async () => {
    const handler = withAdminAuth(okHandler);
    const res = await handler(makeRequest() as any);
    expect(res.status).toBe(401);
  });

  it('withAdminAuth: 403 for authenticated non-admin', async () => {
    mockAuthUser = { id: 'user-000', email: 'user@example.com' };
    mockIsAdmin  = false;

    const handler = withAdminAuth(okHandler);
    const res = await handler(makeRequest() as any);
    expect(res.status).toBe(403);
  });

  it('withAdminAuth: 200 for authenticated admin', async () => {
    mockAuthUser = { id: 'admin-111', email: 'admin@investingpro.in' };
    mockIsAdmin  = true;

    const handler = withAdminAuth(okHandler);
    const res = await handler(makeRequest() as any);
    expect(res.status).toBe(200);
  });
});
