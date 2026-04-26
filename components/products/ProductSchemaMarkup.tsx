/**
 * ProductSchemaMarkup
 *
 * Emits Schema.org JSON-LD for product detail pages. As of 2026-04-26
 * this delegates to `lib/seo/schema-generator.ts:generateProductSchema`
 * which:
 *   - Uses Schema.org sub-types (CreditCard, LoanOrCredit, BankAccount,
 *     InvestmentOrDeposit, FinancialService) instead of generic Product
 *   - Emits aggregateRating ONLY when a real rating exists (no fakes)
 *   - Adds an optional methodology back-link via additionalProperty
 *   - Includes Review + BreadcrumbList schemas alongside
 */

import { generateProductSchema } from "@/lib/seo/schema-generator";

type CategoryInput =
  | "credit-cards"
  | "credit_card"
  | "loans"
  | "loan"
  | "fixed-deposits"
  | "fixed_deposit"
  | "savings-accounts"
  | "savings_account"
  | "mutual-funds"
  | "mutual_fund"
  | "insurance"
  | "demat-accounts"
  | "broker"
  | "ppf-nps"
  | "govt_scheme";

interface ProductSchemaMarkupProps {
  product: {
    name: string;
    description: string;
    image?: string;
    rating: number;
    category: CategoryInput | string;
    provider: string;
    providerUrl?: string;
    url: string;
    annualFee?: number | string;
    interestRate?: string;
    methodologySegment?: string;
  };
}

const CATEGORY_TO_PRODUCT_TYPE: Record<
  string,
  Parameters<typeof generateProductSchema>[0]["productType"]
> = {
  "credit-cards": "credit_card",
  credit_card: "credit_card",
  loans: "loan",
  loan: "loan",
  "fixed-deposits": "fixed_deposit",
  fixed_deposit: "fixed_deposit",
  "savings-accounts": "savings_account",
  savings_account: "savings_account",
  "mutual-funds": "mutual_fund",
  mutual_fund: "mutual_fund",
  insurance: "insurance",
  "demat-accounts": "broker",
  broker: "broker",
  "ppf-nps": "govt_scheme",
  govt_scheme: "govt_scheme",
};

const METHODOLOGY_BY_PRODUCT_TYPE: Record<string, string> = {
  credit_card: "/methodology/credit-cards",
  loan: "/methodology/loans",
  fixed_deposit: "/methodology/banking",
  savings_account: "/methodology/banking",
  mutual_fund: "/methodology/mutual-funds",
  insurance: "/methodology/insurance",
  broker: "/methodology/brokers",
  govt_scheme: "/methodology/banking",
};

export function ProductSchemaMarkup({ product }: ProductSchemaMarkupProps) {
  const baseUrl = "https://investingpro.in";
  const fullUrl = product.url.startsWith("http")
    ? product.url
    : `${baseUrl}${product.url}`;

  const productType = CATEGORY_TO_PRODUCT_TYPE[product.category] || "insurance";
  const methodologyUrl = `${baseUrl}${METHODOLOGY_BY_PRODUCT_TYPE[productType] || "/methodology"}`;

  const offer =
    product.annualFee !== undefined
      ? {
          priceCurrency: "INR",
          price:
            typeof product.annualFee === "number"
              ? product.annualFee
              : product.annualFee,
          description: product.interestRate || undefined,
        }
      : product.interestRate
        ? { priceCurrency: "INR", description: product.interestRate }
        : undefined;

  const productSchema = generateProductSchema({
    name: product.name,
    productType,
    description: product.description,
    image: product.image,
    url: fullUrl,
    provider: {
      name: product.provider,
      url: product.providerUrl,
    },
    rating: product.rating > 0 ? product.rating : null,
    reviewCount: 1, // Editorial review by InvestingPro [Desk]
    methodologyUrl,
    offer,
  });

  // BreadcrumbList — derive from url (e.g. /credit-cards/hdfc-regalia)
  const segments = product.url.split("/").filter(Boolean);
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      ...(segments.length >= 1
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: segments[0]
                .replace(/-/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase()),
              item: `${baseUrl}/${segments[0]}`,
            },
          ]
        : []),
      {
        "@type": "ListItem",
        position: segments.length >= 1 ? 3 : 2,
        name: product.name,
        item: fullUrl,
      },
    ],
  };

  // Review schema — only emitted when rating exists (matches no-fake-data principle)
  const reviewSchema =
    product.rating > 0
      ? {
          "@context": "https://schema.org",
          "@type": "Review",
          itemReviewed: { "@type": "Product", name: product.name },
          author: {
            "@type": "Organization",
            name: "InvestingPro Editorial",
            url: `${baseUrl}/about/editorial-team`,
          },
          reviewRating: {
            "@type": "Rating",
            ratingValue: product.rating.toFixed(1),
            bestRating: "5",
            worstRating: "1",
          },
          publisher: {
            "@type": "Organization",
            name: "InvestingPro",
            url: baseUrl,
          },
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      {reviewSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
