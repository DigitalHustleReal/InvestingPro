/**
 * Automated Schema Markup Generator
 *
 * Generates structured data (JSON-LD) automatically for all page types.
 * NOTE: BreadcrumbList items use ABSOLUTE URLs per Google requirement
 * (relative paths like "/calculators" cause "Invalid URL in field 'id'"
 * errors in GSC Rich Results report).
 */

import { InternalLink } from "./engine";
import { BreadcrumbItem } from "./breadcrumbs";

const SITE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.investingpro.in";

function toAbsolute(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${SITE_URL}${url.startsWith("/") ? url : `/${url}`}`;
}

export interface SchemaContext {
  pageType:
    | "glossary"
    | "calculator"
    | "explainer"
    | "pillar"
    | "subcategory"
    | "product";
  title: string;
  description?: string;
  url: string;
  breadcrumbs?: BreadcrumbItem[];
  internalLinks?: InternalLink[];
  publishedDate?: string;
  modifiedDate?: string;
  author?: string;
  category?: string;
  [key: string]: any;
}

/**
 * Generate schema markup for a page
 */
export function generateSchema(context: SchemaContext): any {
  const baseSchema: any = {
    "@context": "https://schema.org",
    "@type": getSchemaType(context.pageType),
    name: context.title,
    description: context.description || "",
    url: context.url,
  };

  // Add breadcrumbs if available
  if (context.breadcrumbs && context.breadcrumbs.length > 0) {
    baseSchema.breadcrumb = {
      "@type": "BreadcrumbList",
      itemListElement: context.breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.label,
        item: toAbsolute(crumb.url),
      })),
    };
  }

  // Add page-specific schema
  switch (context.pageType) {
    case "glossary":
      return generateGlossarySchema(context);
    case "calculator":
      return generateCalculatorSchema(context);
    case "explainer":
      return generateExplainerSchema(context);
    case "pillar":
      return generatePillarSchema(context);
    case "subcategory":
      return generateSubcategorySchema(context);
    default:
      return baseSchema;
  }
}

/**
 * Get schema type for page type
 */
function getSchemaType(pageType: string): string {
  const typeMap: Record<string, string> = {
    glossary: "DefinedTerm",
    calculator: "WebApplication",
    explainer: "Article",
    pillar: "CollectionPage",
    subcategory: "CollectionPage",
    product: "Product",
  };
  return typeMap[pageType] || "WebPage";
}

/**
 * Generate glossary schema
 */
function generateGlossarySchema(context: SchemaContext): any {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: context.title,
    description: context.description,
    url: context.url,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "InvestingPro Financial Glossary",
      url: "https://investingpro.in/glossary",
    },
    ...(context.category && { category: context.category }),
  };
}

/**
 * Generate calculator schema
 */
function generateCalculatorSchema(context: SchemaContext): any {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: context.title,
    description: context.description,
    url: context.url,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
  };

  // Add breadcrumbs if available
  if (context.breadcrumbs && context.breadcrumbs.length > 0) {
    schema.breadcrumb = {
      "@type": "BreadcrumbList",
      itemListElement: context.breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.label,
        item: toAbsolute(crumb.url),
      })),
    };
  }

  return schema;
}

/**
 * Generate explainer schema
 */
function generateExplainerSchema(context: SchemaContext): any {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: context.title,
    description: context.description,
    url: context.url,
    datePublished: context.publishedDate,
    dateModified: context.modifiedDate || context.publishedDate,
    author: {
      "@type": "Organization",
      name: "InvestingPro.in",
    },
    publisher: {
      "@type": "Organization",
      name: "InvestingPro.in",
      logo: {
        "@type": "ImageObject",
        url: "https://investingpro.in/logo.png",
      },
    },
    ...(context.category && { articleSection: context.category }),
  };
}

/**
 * Generate pillar schema
 */
function generatePillarSchema(context: SchemaContext): any {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: context.title,
    description: context.description,
    url: context.url,
    ...(context.category && {
      about: { "@type": "Thing", name: context.category },
    }),
  };
}

/**
 * Generate subcategory schema
 */
function generateSubcategorySchema(context: SchemaContext): any {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: context.title,
    description: context.description,
    url: context.url,
    ...(context.category && {
      about: { "@type": "Thing", name: context.category },
    }),
  };
}

/**
 * Combine multiple schema objects
 */
export function combineSchemas(schemas: any[]): any[] {
  return schemas.filter(Boolean);
}
