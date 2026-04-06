/**
 * SVG Featured Image Generator
 *
 * Creates branded 1200x630 featured images for articles using pure SVG templates.
 * No external dependencies — works in Edge runtime and serverless functions.
 *
 * 6 category-specific templates with InvestingPro brand colors:
 * - credit-cards, mutual-funds, loans, tax-planning, insurance, personal-finance
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type FeaturedCategory =
  | "credit-cards"
  | "mutual-funds"
  | "loans"
  | "tax-planning"
  | "insurance"
  | "personal-finance";

export interface FeaturedImageInput {
  title: string;
  category: FeaturedCategory;
  author?: string;
  date?: string;
}

// ---------------------------------------------------------------------------
// Brand constants
// ---------------------------------------------------------------------------

const BRAND = {
  green900: "#14532d",
  green700: "#15803d",
  green600: "#166534",
  greenLight: "#16A34A",
  gold: "#D97706",
  white: "#FFFFFF",
  whiteAlpha: "rgba(255,255,255,0.08)",
} as const;

// ---------------------------------------------------------------------------
// Category-specific configs
// ---------------------------------------------------------------------------

interface CategoryConfig {
  label: string;
  gradientFrom: string;
  gradientTo: string;
  icon: string; // SVG path data for category icon
}

const CATEGORY_CONFIGS: Record<FeaturedCategory, CategoryConfig> = {
  "credit-cards": {
    label: "Credit Cards",
    gradientFrom: "#14532d",
    gradientTo: "#166534",
    icon: `<rect x="40" y="50" width="70" height="45" rx="6" fill="none" stroke="${BRAND.white}" stroke-width="2.5" opacity="0.25"/>
           <line x1="40" y1="66" x2="110" y2="66" stroke="${BRAND.white}" stroke-width="2" opacity="0.2"/>
           <rect x="48" y="74" width="20" height="12" rx="2" fill="${BRAND.white}" opacity="0.15"/>`,
  },
  "mutual-funds": {
    label: "Mutual Funds",
    gradientFrom: "#14532d",
    gradientTo: "#15803d",
    icon: `<polyline points="45,90 60,65 75,75 90,50 105,40" fill="none" stroke="${BRAND.white}" stroke-width="2.5" opacity="0.25" stroke-linecap="round" stroke-linejoin="round"/>
           <circle cx="105" cy="40" r="4" fill="${BRAND.white}" opacity="0.2"/>
           <line x1="45" y1="95" x2="105" y2="95" stroke="${BRAND.white}" stroke-width="1.5" opacity="0.15"/>`,
  },
  loans: {
    label: "Loans",
    gradientFrom: "#14532d",
    gradientTo: "#166534",
    icon: `<rect x="50" y="42" width="50" height="55" rx="4" fill="none" stroke="${BRAND.white}" stroke-width="2.5" opacity="0.25"/>
           <line x1="58" y1="58" x2="92" y2="58" stroke="${BRAND.white}" stroke-width="2" opacity="0.15"/>
           <line x1="58" y1="70" x2="85" y2="70" stroke="${BRAND.white}" stroke-width="2" opacity="0.15"/>
           <line x1="58" y1="82" x2="78" y2="82" stroke="${BRAND.white}" stroke-width="2" opacity="0.15"/>`,
  },
  "tax-planning": {
    label: "Tax Planning",
    gradientFrom: "#14532d",
    gradientTo: "#15803d",
    icon: `<rect x="48" y="45" width="54" height="50" rx="5" fill="none" stroke="${BRAND.white}" stroke-width="2.5" opacity="0.25"/>
           <line x1="56" y1="62" x2="94" y2="62" stroke="${BRAND.white}" stroke-width="1.5" opacity="0.15"/>
           <text x="75" y="85" text-anchor="middle" fill="${BRAND.white}" font-size="18" font-weight="700" opacity="0.2" font-family="system-ui, sans-serif">%</text>`,
  },
  insurance: {
    label: "Insurance",
    gradientFrom: "#14532d",
    gradientTo: "#166534",
    icon: `<path d="M75 40 L100 52 L100 72 C100 85 75 97 75 97 C75 97 50 85 50 72 L50 52 Z" fill="none" stroke="${BRAND.white}" stroke-width="2.5" opacity="0.25"/>
           <polyline points="64,68 72,76 88,60" fill="none" stroke="${BRAND.white}" stroke-width="2.5" opacity="0.2" stroke-linecap="round" stroke-linejoin="round"/>`,
  },
  "personal-finance": {
    label: "Personal Finance",
    gradientFrom: "#14532d",
    gradientTo: "#15803d",
    icon: `<path d="M55 52 L55 90 L95 90" fill="none" stroke="${BRAND.white}" stroke-width="2" opacity="0.15"/>
           <rect x="50" y="52" width="15" height="38" rx="3" fill="none" stroke="${BRAND.white}" stroke-width="2.5" opacity="0.25"/>
           <text x="75" y="82" text-anchor="middle" fill="${BRAND.white}" font-size="20" font-weight="700" opacity="0.2" font-family="system-ui, sans-serif">&#8377;</text>`,
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Break title into lines of roughly equal length, max 3 lines */
function wrapTitle(title: string, maxCharsPerLine = 28): string[] {
  const words = title.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    if (lines.length === 2) {
      // Last line — put everything remaining
      current = current ? `${current} ${word}` : word;
    } else if (current.length + word.length + 1 > maxCharsPerLine && current) {
      lines.push(current);
      current = word;
    } else {
      current = current ? `${current} ${word}` : word;
    }
  }
  if (current) lines.push(current);

  // Truncate last line if too long
  if (lines.length > 0) {
    const last = lines[lines.length - 1];
    if (last.length > maxCharsPerLine + 10) {
      lines[lines.length - 1] = last.substring(0, maxCharsPerLine + 7) + "...";
    }
  }

  return lines.slice(0, 3);
}

/** Generate geometric dot pattern overlay */
function generatePatternOverlay(): string {
  const dots: string[] = [];
  for (let row = 0; row < 12; row++) {
    for (let col = 0; col < 24; col++) {
      dots.push(
        `<circle cx="${col * 52 + 26}" cy="${row * 56 + 28}" r="1.5" fill="${BRAND.white}" opacity="0.06"/>`,
      );
    }
  }
  return dots.join("\n");
}

// ---------------------------------------------------------------------------
// Main generator
// ---------------------------------------------------------------------------

/**
 * Generate a branded 1200x630 featured image SVG for an article.
 */
export function generateFeaturedImage(input: FeaturedImageInput): string {
  const config = CATEGORY_CONFIGS[input.category];
  const lines = wrapTitle(input.title);
  const fontSize = lines.some((l) => l.length > 30) ? 42 : 48;
  const lineHeight = fontSize * 1.25;
  const titleBlockY = 200;

  const metaLine = [input.author, input.date].filter(Boolean).join("  ·  ");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${config.gradientFrom}"/>
      <stop offset="100%" stop-color="${config.gradientTo}"/>
    </linearGradient>
    <linearGradient id="shine" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${BRAND.white}" stop-opacity="0.04"/>
      <stop offset="100%" stop-color="${BRAND.white}" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Subtle dot pattern -->
  ${generatePatternOverlay()}

  <!-- Shine overlay top half -->
  <rect width="1200" height="315" fill="url(#shine)"/>

  <!-- Category icon (top-right, large & faded) -->
  <g transform="translate(1040, 30) scale(1.8)">
    ${config.icon}
  </g>

  <!-- Category badge -->
  <rect x="80" y="120" width="${config.label.length * 13 + 32}" height="36" rx="18" fill="${BRAND.gold}"/>
  <text x="${80 + 16}" y="144" fill="${BRAND.white}" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="600">${escapeXml(config.label)}</text>

  <!-- Title lines -->
  ${lines
    .map(
      (line, i) =>
        `<text x="80" y="${titleBlockY + i * lineHeight}" fill="${BRAND.white}" font-family="system-ui, -apple-system, sans-serif" font-size="${fontSize}" font-weight="800" letter-spacing="-0.5">${escapeXml(line)}</text>`,
    )
    .join("\n  ")}

  <!-- Accent underline -->
  <rect x="80" y="${titleBlockY + lines.length * lineHeight + 12}" width="60" height="4" rx="2" fill="${BRAND.gold}"/>

  ${
    metaLine
      ? `<!-- Author / Date -->
  <text x="80" y="${titleBlockY + lines.length * lineHeight + 48}" fill="${BRAND.white}" font-family="system-ui, -apple-system, sans-serif" font-size="16" opacity="0.65">${escapeXml(metaLine)}</text>`
      : ""
  }

  <!-- Brand watermark -->
  <text x="1120" y="600" text-anchor="end" fill="${BRAND.white}" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" opacity="0.5">investingpro.in</text>

  <!-- Bottom border accent -->
  <rect x="0" y="622" width="1200" height="8" fill="${BRAND.gold}" opacity="0.6"/>
</svg>`;
}
