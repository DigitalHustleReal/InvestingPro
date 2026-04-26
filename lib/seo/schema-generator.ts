/**
 * 🧬 SYSTEM FOR AI-SEO / GEO (Generative Engine Optimization)
 *
 * Generates JSON-LD Schema markup to help AI engines (Google SGE, ChatGPT, Perplexity)
 * understand and cite our content.
 */

export interface SchemaOptions {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  authorName: string;
  /** Slug or URL — defaults to /about/editorial-team if not provided.
   *  We deliberately attribute Articles to the relevant editorial DESK
   *  (Tax Desk, Investment Desk, Credit Desk etc.) rather than to a
   *  fake individual expert. The desk is more honest because there's
   *  no individual byline policy on this platform. */
  authorUrl?: string;
  /** Optional dateModified — falls back to datePublished if missing. */
  dateModified?: string;
  url: string;
  faq?: { question: string; answer: string }[];
}

const DEFAULT_AUTHOR_URL = "https://investingpro.in/about/editorial-team";

export function generateArticleSchema(options: SchemaOptions) {
  const {
    headline,
    description,
    image,
    datePublished,
    authorName,
    authorUrl,
    dateModified,
    url,
    faq,
  } = options;

  // 1. Base Article Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: headline,
    description: description,
    image: image,
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type":
        authorName.toLowerCase().includes("desk") ||
        authorName.toLowerCase().includes("team") ||
        authorName.toLowerCase().includes("editorial")
          ? "Organization"
          : "Person",
      name: authorName,
      url: authorUrl || DEFAULT_AUTHOR_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "InvestingPro India",
      logo: {
        "@type": "ImageObject",
        url: "https://investingpro.in/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    // GEO / AI SEO Specifics
    isAccessibleForFree: true,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".key-takeaways", ".quick-verdict"],
    },
  };

  // 2. FAQ Schema (Critical for Featured Snippets & AI Answers)
  let faqSchema = null;
  if (faq && faq.length > 0) {
    faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    };
  }

  // 3. Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://investingpro.in",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Articles",
        item: "https://investingpro.in/articles",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: headline,
        item: url,
      },
    ],
  };

  return {
    articleSchema,
    faqSchema,
    breadcrumbSchema,
    // Combined JSON-LD string
    scriptTags: [
      JSON.stringify(articleSchema),
      faqSchema ? JSON.stringify(faqSchema) : null,
      JSON.stringify(breadcrumbSchema),
    ].filter(Boolean),
  };
}

/**
 * Extract FAQ items from HTML content (heuristic)
 */
export function extractFAQsFromContent(
  html: string,
): { question: string; answer: string }[] {
  const faqs: { question: string; answer: string }[] = [];

  // Simple regex to find FAQ section (assumes headings with ?)
  // This is a heuristic; in production, we might want the LLM to output explicit JSON
  const matches = html.matchAll(/<h3>(.*?\?)<\/h3>\s*<p>(.*?)<\/p>/g);

  for (const match of matches) {
    if (match[1] && match[2]) {
      faqs.push({
        question: match[1].trim(),
        answer: match[2].trim().replace(/<[^>]*>/g, ""), // Strip HTML for schema
      });
    }
  }

  return faqs.slice(0, 5); // Limit to top 5
}

/**
 * Product / FinancialProduct schema generator.
 *
 * Emits Schema.org JSON-LD for product detail pages so Google can show
 * rich-result snippets (rating, price/fee, provider, review counts).
 * For most financial categories we use the more specific FinancialProduct
 * type which Google supports for things like CreditCard, BankAccount,
 * LoanOrCredit, MortgageLoan, FinancialIncentive.
 *
 * The aggregateRating block is only emitted when we have a real rating
 * — never fabricate a rating count or value here.
 */
export interface ProductSchemaOptions {
  name: string;
  /** Product type — maps to schema.org sub-type */
  productType:
    | "credit_card"
    | "loan"
    | "mortgage"
    | "fixed_deposit"
    | "savings_account"
    | "mutual_fund"
    | "insurance"
    | "broker"
    | "govt_scheme";
  description: string;
  image?: string;
  url: string;
  provider: {
    name: string;
    /** Optional URL to the provider's homepage (e.g. issuer site) */
    url?: string;
  };
  /** 0–5 scale; null/undefined → no aggregateRating block emitted */
  rating?: number | null;
  /** Real review count from a verifiable source. Default 1 = our editorial review. */
  reviewCount?: number;
  /** Optional URL to the methodology rubric used to score this product */
  methodologyUrl?: string;
  /** Optional offer details (e.g., interest rate, annual fee) */
  offer?: {
    /** "INR" — Indian Rupees */
    priceCurrency?: string;
    /** Annual fee or upfront cost; -1 means N/A */
    price?: number | string;
    /** Description of the offer (e.g., "10.5% p.a. starting rate") */
    description?: string;
  };
}

const SCHEMA_TYPE_MAP: Record<ProductSchemaOptions["productType"], string> = {
  credit_card: "CreditCard",
  loan: "LoanOrCredit",
  mortgage: "MortgageLoan",
  fixed_deposit: "BankAccount",
  savings_account: "BankAccount",
  mutual_fund: "InvestmentOrDeposit",
  insurance: "FinancialProduct",
  broker: "FinancialService",
  govt_scheme: "InvestmentOrDeposit",
};

export function generateProductSchema(
  options: ProductSchemaOptions,
): Record<string, unknown> {
  const schemaType = SCHEMA_TYPE_MAP[options.productType] || "FinancialProduct";

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": schemaType,
    name: options.name,
    description: options.description,
    url: options.url,
    provider: {
      "@type": "Organization",
      name: options.provider.name,
      ...(options.provider.url ? { url: options.provider.url } : {}),
    },
  };

  if (options.image) {
    schema.image = options.image;
  }

  // Real aggregateRating only — never fabricate
  if (typeof options.rating === "number" && options.rating > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: options.rating.toFixed(1),
      bestRating: "5",
      worstRating: "1",
      ratingCount: options.reviewCount ?? 1,
    };
  }

  if (options.methodologyUrl) {
    // Custom property — Google ignores unknown but it documents intent
    schema.additionalProperty = {
      "@type": "PropertyValue",
      name: "Scoring methodology",
      url: options.methodologyUrl,
    };
  }

  if (options.offer) {
    schema.offers = {
      "@type": "Offer",
      priceCurrency: options.offer.priceCurrency || "INR",
      ...(options.offer.price !== undefined
        ? { price: options.offer.price }
        : {}),
      ...(options.offer.description
        ? { description: options.offer.description }
        : {}),
      availability: "https://schema.org/InStock",
    };
  }

  return schema;
}

/** Convenience: returns a JSON-LD <script> string for direct embedding */
export function productSchemaScript(options: ProductSchemaOptions): string {
  return JSON.stringify(generateProductSchema(options));
}
