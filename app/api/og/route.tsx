import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

/**
 * Dynamic OG Image Generator — InvestingPro Brand V2
 *
 * Usage: /api/og?title=...&category=...&type=calculator|article|product|default
 *
 * Now uses the InvestingPro green/gold brand palette with category-specific
 * accents matching the SVG image pipeline design language.
 */

// ---------------------------------------------------------------------------
// Category → brand mapping
// ---------------------------------------------------------------------------

type ContentType = "calculator" | "article" | "product" | "default";

type CategoryKey =
  | "credit-cards"
  | "mutual-funds"
  | "loans"
  | "tax-planning"
  | "insurance"
  | "personal-finance"
  | "calculators"
  | "default";

const CATEGORY_MAP: Record<string, CategoryKey> = {
  "credit cards": "credit-cards",
  "credit-cards": "credit-cards",
  "mutual funds": "mutual-funds",
  "mutual-funds": "mutual-funds",
  loans: "loans",
  "tax planning": "tax-planning",
  "tax-planning": "tax-planning",
  insurance: "insurance",
  "personal finance": "personal-finance",
  "personal-finance": "personal-finance",
  calculators: "calculators",
};

interface CategoryStyle {
  gradientFrom: string;
  gradientTo: string;
  accent: string;
  badge: string;
  icon: string; // single character shorthand for the category
}

const CATEGORY_STYLES: Record<CategoryKey, CategoryStyle> = {
  "credit-cards": {
    gradientFrom: "#14532d",
    gradientTo: "#166534",
    accent: "#D97706",
    badge: "Credit Cards",
    icon: "💳",
  },
  "mutual-funds": {
    gradientFrom: "#14532d",
    gradientTo: "#15803d",
    accent: "#D97706",
    badge: "Mutual Funds",
    icon: "📈",
  },
  loans: {
    gradientFrom: "#14532d",
    gradientTo: "#166534",
    accent: "#D97706",
    badge: "Loans",
    icon: "🏠",
  },
  "tax-planning": {
    gradientFrom: "#14532d",
    gradientTo: "#15803d",
    accent: "#D97706",
    badge: "Tax Planning",
    icon: "🧮",
  },
  insurance: {
    gradientFrom: "#14532d",
    gradientTo: "#166534",
    accent: "#D97706",
    badge: "Insurance",
    icon: "🛡️",
  },
  "personal-finance": {
    gradientFrom: "#14532d",
    gradientTo: "#15803d",
    accent: "#D97706",
    badge: "Personal Finance",
    icon: "💰",
  },
  calculators: {
    gradientFrom: "#14532d",
    gradientTo: "#166534",
    accent: "#D97706",
    badge: "Free Calculator",
    icon: "🧮",
  },
  default: {
    gradientFrom: "#14532d",
    gradientTo: "#15803d",
    accent: "#D97706",
    badge: "Personal Finance",
    icon: "🇮🇳",
  },
};

function resolveCategory(raw: string): CategoryKey {
  const lower = raw.toLowerCase().trim();
  return CATEGORY_MAP[lower] ?? "default";
}

// ---------------------------------------------------------------------------
// Type badge labels
// ---------------------------------------------------------------------------

function typeBadge(type: ContentType): string {
  switch (type) {
    case "calculator":
      return "Free Tool";
    case "article":
      return "Expert Guide";
    case "product":
      return "Expert Reviewed";
    default:
      return "Made for India";
  }
}

// ---------------------------------------------------------------------------
// Main handler
// ---------------------------------------------------------------------------

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const title = searchParams.get("title") || "InvestingPro";
  const rawCategory = searchParams.get("category") || "Personal Finance";
  const type = (searchParams.get("type") || "default") as ContentType;
  const subtitle =
    searchParams.get("subtitle") || "India's Most Trusted Finance Platform";

  const catKey = resolveCategory(rawCategory);
  const style = CATEGORY_STYLES[catKey];
  const badge = typeBadge(type);

  return new ImageResponse(
    <div
      style={{
        width: "1200px",
        height: "630px",
        background: `linear-gradient(135deg, ${style.gradientFrom} 0%, ${style.gradientTo} 100%)`,
        display: "flex",
        flexDirection: "column",
        fontFamily: "system-ui, -apple-system, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Dot pattern overlay */}
      <div
        style={{
          position: "absolute",
          inset: "0",
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "52px 56px",
        }}
      />

      {/* Top shine */}
      <div
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          width: "1200px",
          height: "315px",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%)",
        }}
      />

      {/* Left accent bar */}
      <div
        style={{
          position: "absolute",
          left: "0",
          top: "0",
          width: "6px",
          height: "100%",
          background: `linear-gradient(180deg, ${style.accent} 0%, transparent 100%)`,
        }}
      />

      {/* Bottom gold bar */}
      <div
        style={{
          position: "absolute",
          bottom: "0",
          left: "0",
          width: "1200px",
          height: "8px",
          background: style.accent,
          opacity: 0.6,
        }}
      />

      {/* Content */}
      <div
        style={{
          padding: "60px 80px",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          position: "relative",
        }}
      >
        {/* Top row: Brand + Badge */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "40px",
          }}
        >
          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: style.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                fontWeight: "bold",
                color: "white",
              }}
            >
              i
            </div>
            <span
              style={{
                color: "white",
                fontSize: "22px",
                fontWeight: "700",
                letterSpacing: "-0.5px",
              }}
            >
              InvestingPro
            </span>
            <span
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "14px",
                marginLeft: "4px",
              }}
            >
              investingpro.in
            </span>
          </div>

          {/* Type badge */}
          <div
            style={{
              background: `rgba(217,119,6,0.15)`,
              border: `1px solid rgba(217,119,6,0.4)`,
              borderRadius: "24px",
              padding: "6px 16px",
              color: style.accent,
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            {style.icon} {badge}
          </div>
        </div>

        {/* Category tag */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              background: style.accent,
              borderRadius: "18px",
              padding: "4px 14px",
              color: "white",
              fontSize: "13px",
              fontWeight: "600",
            }}
          >
            {style.badge}
          </div>
        </div>

        {/* Main title */}
        <div
          style={{
            color: "white",
            fontSize:
              title.length > 50 ? "42px" : title.length > 35 ? "50px" : "56px",
            fontWeight: "800",
            lineHeight: "1.18",
            letterSpacing: "-1.5px",
            maxWidth: "900px",
            flex: 1,
          }}
        >
          {title}
        </div>

        {/* Bottom row: subtitle + trust signals */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "18px",
              maxWidth: "500px",
            }}
          >
            {subtitle}
          </div>

          {/* Trust signals */}
          <div style={{ display: "flex", gap: "24px" }}>
            {[
              { label: "Categories", value: "7" },
              { label: "Banks Tracked", value: "50+" },
              { label: "Free Tools", value: "24" },
            ].map(({ label, value }) => (
              <div key={label} style={{ textAlign: "right" as const }}>
                <div
                  style={{
                    color: "white",
                    fontSize: "22px",
                    fontWeight: "700",
                  }}
                >
                  {value}
                </div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontSize: "12px",
                    textTransform: "uppercase" as const,
                    letterSpacing: "1px",
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}
