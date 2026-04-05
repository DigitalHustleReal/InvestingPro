/**
 * Unit Tests: Cron Route Authentication Pattern
 *
 * All cron routes share this auth pattern:
 *   const authHeader = request.headers.get("authorization");
 *   const cronSecret = process.env.CRON_SECRET;
 *   if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
 *     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
 *   }
 *
 * Tests verify:
 * - 401 when CRON_SECRET is set but no auth header
 * - 401 when CRON_SECRET is set but wrong token
 * - Success when CRON_SECRET is set and correct token provided
 * - Success when CRON_SECRET is not set (auth skipped)
 */

import { NextRequest } from "next/server";

// Mock dependencies used by cron routes
jest.mock("@/lib/logger", () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
}));

jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn().mockResolvedValue({
    from: () => ({
      select: () => ({
        eq: () => ({
          lt: () => ({
            select: () => Promise.resolve({ count: 0 }),
          }),
          order: () => ({
            limit: () => Promise.resolve({ data: [], error: null }),
          }),
          single: () => Promise.resolve({ data: null, error: null }),
        }),
        order: () => ({
          limit: () => Promise.resolve({ data: [], error: null }),
        }),
      }),
      delete: () => ({
        eq: () => ({
          lt: () => ({
            select: () => Promise.resolve({ count: 0 }),
          }),
        }),
      }),
    }),
  }),
}));

jest.mock("@/lib/cache/redis-service", () => ({
  __esModule: true,
  default: {
    isConfigured: false,
    invalidatePattern: jest.fn().mockResolvedValue(0),
  },
}));

// Mock global fetch for sitemap-ping route
const mockFetch = jest.fn().mockResolvedValue({ status: 200, ok: true });
global.fetch = mockFetch as any;

/**
 * Helper: create a NextRequest with optional Authorization header.
 * Uses native Request then wraps in NextRequest to work in jsdom.
 */
function makeCronRequest(authHeaderValue?: string): NextRequest {
  const headers = new Headers();
  if (authHeaderValue !== undefined) {
    headers.set("authorization", authHeaderValue);
  }
  const req = new Request("http://localhost:3000/api/cron/test", {
    method: "GET",
    headers,
  });
  return req as unknown as NextRequest;
}

/**
 * Verify the cron auth behavior for a given route handler.
 * Extracts the common test logic so each route can be tested identically.
 */
function describeCronAuth(
  routeName: string,
  importRoute: () => Promise<{ GET: (req: NextRequest) => Promise<Response> }>,
) {
  describe(`${routeName} — cron auth`, () => {
    let GET: (req: NextRequest) => Promise<Response>;
    const originalEnv = process.env.CRON_SECRET;

    beforeAll(async () => {
      const mod = await importRoute();
      GET = mod.GET;
    });

    afterEach(() => {
      if (originalEnv !== undefined) {
        process.env.CRON_SECRET = originalEnv;
      } else {
        delete process.env.CRON_SECRET;
      }
    });

    it("returns 401 when CRON_SECRET is set but no auth header provided", async () => {
      process.env.CRON_SECRET = "test-secret-123";
      const req = makeCronRequest();
      const res = await GET(req);

      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body.error).toBe("Unauthorized");
    });

    it("returns 401 when CRON_SECRET is set but wrong Bearer token provided", async () => {
      process.env.CRON_SECRET = "test-secret-123";
      const req = makeCronRequest("Bearer wrong-token");
      const res = await GET(req);

      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body.error).toBe("Unauthorized");
    });

    it("returns 401 when CRON_SECRET is set and token is sent without Bearer prefix", async () => {
      process.env.CRON_SECRET = "test-secret-123";
      const req = makeCronRequest("test-secret-123");
      const res = await GET(req);

      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body.error).toBe("Unauthorized");
    });

    it("does not return 401 when correct Bearer token is provided", async () => {
      process.env.CRON_SECRET = "test-secret-123";
      const req = makeCronRequest("Bearer test-secret-123");
      const res = await GET(req);

      // Should not be 401 — the request passes auth
      expect(res.status).not.toBe(401);
    });

    it("does not return 401 when CRON_SECRET is not set (auth skipped)", async () => {
      delete process.env.CRON_SECRET;
      const req = makeCronRequest();
      const res = await GET(req);

      expect(res.status).not.toBe(401);
    });
  });
}

// Test three representative cron routes to confirm the pattern is consistent

describeCronAuth(
  "analytics-sync",
  () => import("@/app/api/cron/analytics-sync/route"),
);

describeCronAuth("cleanup", () => import("@/app/api/cron/cleanup/route"));

describeCronAuth(
  "sitemap-ping",
  () => import("@/app/api/cron/sitemap-ping/route"),
);

// Additional edge-case tests on a single route
describe("cron auth — edge cases", () => {
  let GET: (req: NextRequest) => Promise<Response>;
  const originalEnv = process.env.CRON_SECRET;

  beforeAll(async () => {
    const mod = await import("@/app/api/cron/cleanup/route");
    GET = mod.GET;
  });

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.CRON_SECRET = originalEnv;
    } else {
      delete process.env.CRON_SECRET;
    }
  });

  it("returns 401 when CRON_SECRET is set and auth header is empty string", async () => {
    process.env.CRON_SECRET = "test-secret-123";
    const req = makeCronRequest("");
    const res = await GET(req);

    expect(res.status).toBe(401);
  });

  it("returns 401 when CRON_SECRET is set and Bearer has extra whitespace", async () => {
    process.env.CRON_SECRET = "test-secret-123";
    const req = makeCronRequest("Bearer  test-secret-123");
    const res = await GET(req);

    // Double space after Bearer means the token won't match
    expect(res.status).toBe(401);
  });

  it("succeeds when CRON_SECRET is empty string (treated as falsy, auth skipped)", async () => {
    process.env.CRON_SECRET = "";
    const req = makeCronRequest();
    const res = await GET(req);

    // Empty string is falsy, so auth check is skipped
    expect(res.status).not.toBe(401);
  });
});
