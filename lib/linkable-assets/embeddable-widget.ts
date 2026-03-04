/**
 * Embeddable Widget System
 * Generates embed codes for calculators and tools
 * 
 * This allows other websites to embed our calculators,
 * creating backlinks and brand awareness
 */

// =============================================================================
// TYPES
// =============================================================================

export interface EmbedConfig {
  calculatorSlug: string;
  width: number | string;
  height: number | string;
  theme: 'light' | 'dark' | 'auto';
  showBranding: boolean;
  primaryColor?: string;
  borderRadius?: number;
  autoResize?: boolean;
}

export interface EmbedCode {
  iframe: string;
  script: string;
  wordpress: string;
  react: string;
}

export interface ShareConfig {
  url: string;
  title: string;
  description: string;
  image?: string;
  hashtags?: string[];
}

export interface ShareLinks {
  twitter: string;
  facebook: string;
  linkedin: string;
  whatsapp: string;
  telegram: string;
  email: string;
  copy: string;
}

// =============================================================================
// CALCULATOR REGISTRY
// =============================================================================

export const EMBEDDABLE_CALCULATORS: Record<string, {
  name: string;
  description: string;
  defaultHeight: number;
  keywords: string[];
}> = {
  'sip': {
    name: 'SIP Calculator',
    description: 'Calculate your SIP returns with inflation adjustment',
    defaultHeight: 500,
    keywords: ['sip calculator', 'mutual fund calculator', 'sip return calculator'],
  },
  'emi': {
    name: 'EMI Calculator',
    description: 'Calculate loan EMI for home, car, or personal loans',
    defaultHeight: 450,
    keywords: ['emi calculator', 'loan calculator', 'home loan emi'],
  },
  'fd': {
    name: 'FD Calculator',
    description: 'Calculate fixed deposit maturity amount and interest',
    defaultHeight: 400,
    keywords: ['fd calculator', 'fixed deposit calculator', 'fd interest calculator'],
  },
  'ppf': {
    name: 'PPF Calculator',
    description: 'Calculate PPF maturity amount with yearly contributions',
    defaultHeight: 450,
    keywords: ['ppf calculator', 'public provident fund calculator'],
  },
  'nps': {
    name: 'NPS Calculator',
    description: 'Calculate your NPS pension and retirement corpus',
    defaultHeight: 500,
    keywords: ['nps calculator', 'pension calculator', 'retirement calculator'],
  },
  'tax': {
    name: 'Tax Calculator',
    description: 'Calculate income tax under old and new regime',
    defaultHeight: 600,
    keywords: ['income tax calculator', 'tax calculator india', 'itr calculator'],
  },
  'lumpsum': {
    name: 'Lumpsum Calculator',
    description: 'Calculate lumpsum investment returns',
    defaultHeight: 450,
    keywords: ['lumpsum calculator', 'one time investment calculator'],
  },
  'retirement': {
    name: 'Retirement Calculator',
    description: 'Plan your retirement corpus and monthly savings',
    defaultHeight: 550,
    keywords: ['retirement calculator', 'retirement planning calculator'],
  },
  'compound-interest': {
    name: 'Compound Interest Calculator',
    description: 'Calculate compound interest growth over time',
    defaultHeight: 450,
    keywords: ['compound interest calculator', 'ci calculator'],
  },
  'gst': {
    name: 'GST Calculator',
    description: 'Calculate GST amount for goods and services',
    defaultHeight: 350,
    keywords: ['gst calculator', 'gst calculation', 'igst sgst cgst'],
  },
  'swp': {
    name: 'SWP Calculator',
    description: 'Calculate systematic withdrawal plan for regular income',
    defaultHeight: 450,
    keywords: ['swp calculator', 'systematic withdrawal plan calculator'],
  },
  'goal-planning': {
    name: 'Goal Planning Calculator',
    description: 'Plan investments to achieve your financial goals',
    defaultHeight: 500,
    keywords: ['goal planning calculator', 'financial goal calculator'],
  },
  'financial-health-score': {
    name: 'Financial Health Score',
    description: 'Check your financial health with our comprehensive score',
    defaultHeight: 600,
    keywords: ['financial health score', 'financial fitness calculator'],
  },
};

// =============================================================================
// EMBED CODE GENERATOR
// =============================================================================

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://investingpro.in';

/**
 * Generate embed codes for a calculator
 */
export function generateEmbedCode(config: EmbedConfig): EmbedCode {
  const {
    calculatorSlug,
    width = '100%',
    height = EMBEDDABLE_CALCULATORS[calculatorSlug]?.defaultHeight || 500,
    theme = 'light',
    showBranding = true,
    primaryColor,
    borderRadius = 8,
    autoResize = true,
  } = config;

  const embedUrl = new URL(`/embed/calculators/${calculatorSlug}`, BASE_URL);
  embedUrl.searchParams.set('theme', theme);
  if (!showBranding) embedUrl.searchParams.set('branding', 'false');
  if (primaryColor) embedUrl.searchParams.set('color', primaryColor.replace('#', ''));
  if (borderRadius !== 8) embedUrl.searchParams.set('radius', String(borderRadius));

  const widthValue = typeof width === 'number' ? `${width}px` : width;
  const heightValue = typeof height === 'number' ? `${height}px` : height;

  // Standard iframe embed
  const iframe = `<iframe 
  src="${embedUrl.toString()}" 
  width="${widthValue}" 
  height="${heightValue}" 
  frameborder="0" 
  style="border: none; border-radius: ${borderRadius}px; max-width: 100%;"
  title="${EMBEDDABLE_CALCULATORS[calculatorSlug]?.name || 'Calculator'}"
  loading="lazy"
  allow="clipboard-write"
></iframe>`;

  // Script embed (auto-resize support)
  const script = `<div id="investingpro-${calculatorSlug}" data-calculator="${calculatorSlug}" data-theme="${theme}"${primaryColor ? ` data-color="${primaryColor}"` : ''}></div>
<script src="${BASE_URL}/embed/widget.js" async></script>`;

  // WordPress shortcode style
  const wordpress = `[investingpro calculator="${calculatorSlug}" theme="${theme}"${!showBranding ? ' branding="false"' : ''}${primaryColor ? ` color="${primaryColor}"` : ''}]`;

  // React component
  const react = `import { InvestingProCalculator } from '@investingpro/widgets';

<InvestingProCalculator 
  calculator="${calculatorSlug}"
  theme="${theme}"
  ${primaryColor ? `primaryColor="${primaryColor}"` : ''}
  ${!showBranding ? 'showBranding={false}' : ''}
/>`;

  return { iframe, script, wordpress, react };
}

/**
 * Get preview URL for a calculator embed
 */
export function getEmbedPreviewUrl(calculatorSlug: string, theme: 'light' | 'dark' = 'light'): string {
  return `${BASE_URL}/embed/calculators/${calculatorSlug}?theme=${theme}`;
}

// =============================================================================
// SHARE LINK GENERATOR
// =============================================================================

/**
 * Generate share links for social media
 */
export function generateShareLinks(config: ShareConfig): ShareLinks {
  const { url, title, description, hashtags = [] } = config;
  
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  const hashtagStr = hashtags.map(h => h.replace('#', '')).join(',');

  return {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}${hashtagStr ? `&hashtags=${hashtagStr}` : ''}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
    copy: url,
  };
}

/**
 * Generate share links for a calculator result
 */
export function generateCalculatorShareLinks(
  calculatorSlug: string,
  resultParams: Record<string, string | number>
): ShareLinks {
  const calculator = EMBEDDABLE_CALCULATORS[calculatorSlug];
  if (!calculator) {
    throw new Error(`Unknown calculator: ${calculatorSlug}`);
  }

  // Build result URL with parameters
  const resultUrl = new URL(`/calculators/${calculatorSlug}`, BASE_URL);
  Object.entries(resultParams).forEach(([key, value]) => {
    resultUrl.searchParams.set(key, String(value));
  });
  resultUrl.searchParams.set('shared', 'true');

  return generateShareLinks({
    url: resultUrl.toString(),
    title: `Check out my ${calculator.name} result on InvestingPro`,
    description: `I used the ${calculator.name} to plan my finances. Try it yourself!`,
    hashtags: ['InvestingPro', 'Finance', 'Calculator'],
  });
}

/**
 * Generate OG meta tags for shared calculator results
 */
export function generateOGMetaTags(
  calculatorSlug: string,
  resultSummary: string
): Record<string, string> {
  const calculator = EMBEDDABLE_CALCULATORS[calculatorSlug];
  const url = `${BASE_URL}/calculators/${calculatorSlug}`;

  return {
    'og:title': `${calculator?.name || 'Calculator'} Result - InvestingPro`,
    'og:description': resultSummary,
    'og:url': url,
    'og:type': 'website',
    'og:image': `${BASE_URL}/api/og/calculator?slug=${calculatorSlug}`,
    'og:site_name': 'InvestingPro',
    'twitter:card': 'summary_large_image',
    'twitter:title': `${calculator?.name || 'Calculator'} - InvestingPro`,
    'twitter:description': resultSummary,
    'twitter:image': `${BASE_URL}/api/og/calculator?slug=${calculatorSlug}`,
  };
}

// =============================================================================
// WIDGET ANALYTICS
// =============================================================================

export interface WidgetAnalytics {
  calculatorSlug: string;
  embedDomain: string;
  impressions: number;
  interactions: number;
  completions: number;
  lastSeen: Date;
}

/**
 * Track widget embed usage (called from embed page)
 */
export async function trackWidgetEmbed(
  calculatorSlug: string,
  referrer: string,
  eventType: 'impression' | 'interaction' | 'completion'
): Promise<void> {
  // In production, this would send to analytics
  logger.info('Widget embed tracked:', { calculatorSlug, referrer, eventType });
}

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  EMBEDDABLE_CALCULATORS,
  generateEmbedCode,
  getEmbedPreviewUrl,
  generateShareLinks,
  generateCalculatorShareLinks,
  generateOGMetaTags,
  trackWidgetEmbed,
};
