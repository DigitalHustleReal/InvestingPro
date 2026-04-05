import {
  generateCanonicalUrl,
  normalizePathname,
  shouldHaveCanonical,
} from "@/lib/linking/canonical";

describe("generateCanonicalUrl", () => {
  it("generates a full canonical URL from a pathname", () => {
    const url = generateCanonicalUrl("/credit-cards");
    expect(url).toBe("https://investingpro.in/credit-cards");
  });

  it("removes trailing slashes from pathname", () => {
    const url = generateCanonicalUrl("/credit-cards/");
    expect(url).toBe("https://investingpro.in/credit-cards");
  });

  it("preserves root path as-is", () => {
    const url = generateCanonicalUrl("/");
    expect(url).toBe("https://investingpro.in/");
  });

  it("strips UTM and tracking query params", () => {
    const url = generateCanonicalUrl("/credit-cards", {
      utm_source: "google",
      utm_medium: "cpc",
      ref: "partner123",
    });
    expect(url).toBe("https://investingpro.in/credit-cards");
  });

  it("preserves essential (non-tracking) query params", () => {
    const url = generateCanonicalUrl("/credit-cards", {
      filter: "rewards",
      utm_campaign: "summer",
    });
    expect(url).toContain("filter=rewards");
    expect(url).not.toContain("utm_campaign");
  });

  it("handles pathname with multiple segments", () => {
    const url = generateCanonicalUrl("/credit-cards/best/rewards");
    expect(url).toBe("https://investingpro.in/credit-cards/best/rewards");
  });
});

describe("normalizePathname", () => {
  it("removes trailing slash", () => {
    expect(normalizePathname("/credit-cards/")).toBe("/credit-cards");
  });

  it("preserves root slash", () => {
    expect(normalizePathname("/")).toBe("/");
  });

  it("lowercases the pathname", () => {
    expect(normalizePathname("/Credit-Cards/Best")).toBe("/credit-cards/best");
  });

  it("removes /index.html suffix", () => {
    expect(normalizePathname("/credit-cards/index.html")).toBe("/credit-cards");
    expect(normalizePathname("/credit-cards/index")).toBe("/credit-cards");
  });

  it("returns root for empty result after normalization", () => {
    expect(normalizePathname("/index.html")).toBe("/");
    expect(normalizePathname("/index")).toBe("/");
  });
});

describe("shouldHaveCanonical", () => {
  it("returns true for public pages", () => {
    expect(shouldHaveCanonical("/credit-cards")).toBe(true);
    expect(shouldHaveCanonical("/mutual-funds")).toBe(true);
    expect(shouldHaveCanonical("/")).toBe(true);
  });

  it("returns false for API routes", () => {
    expect(shouldHaveCanonical("/api/health")).toBe(false);
    expect(shouldHaveCanonical("/api/revalidate")).toBe(false);
  });

  it("returns false for admin routes", () => {
    expect(shouldHaveCanonical("/admin/dashboard")).toBe(false);
  });

  it("returns false for Next.js internal routes", () => {
    expect(shouldHaveCanonical("/_next/static/chunk.js")).toBe(false);
  });

  it("returns false for error pages", () => {
    expect(shouldHaveCanonical("/404")).toBe(false);
    expect(shouldHaveCanonical("/500")).toBe(false);
  });
});
