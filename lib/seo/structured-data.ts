/**
 * Structured Data Generators
 *
 * Generates JSON-LD structured data for SEO
 * Supports Schema.org markup for articles, products, reviews, organizations
 */

export interface ArticleStructuredData {
  "@context": string;
  "@type": string;
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified: string;
  author: {
    "@type": string;
    name: string;
    url?: string;
  };
  publisher: {
    "@type": string;
    name: string;
    logo?: {
      "@type": string;
      url: string;
    };
  };
  mainEntityOfPage?: {
    "@type": string;
    "@id": string;
  };
}

export interface ProductStructuredData {
  "@context": string;
  "@type": string;
  name: string;
  description: string;
  image?: string;
  brand?: {
    "@type": string;
    name: string;
  };
  offers?: {
    "@type": string;
    price?: string;
    priceCurrency?: string;
    availability?: string;
    url?: string;
  };
  aggregateRating?: {
    "@type": string;
    ratingValue: string;
    reviewCount: string;
  };
}

export interface OrganizationStructuredData {
  "@context": string;
  "@type": string;
  name: string;
  url: string;
  logo?: string;
  description?: string;
  contactPoint?: {
    "@type": string;
    contactType: string;
    email?: string;
  };
  sameAs?: string[];
}

export interface BreadcrumbStructuredData {
  "@context": string;
  "@type": string;
  itemListElement: Array<{
    "@type": string;
    position: number;
    name: string;
    item: string;
  }>;
}

/**
 * Generate Article structured data
 */
export function generateArticleStructuredData(data: {
  title: string;
  description: string;
  url: string;
  image?: string;
  publishedDate: string;
  modifiedDate?: string;
  authorName: string;
  authorUrl?: string;
}): ArticleStructuredData {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://investingpro.in";

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.title,
    description: data.description,
    image: data.image || `${baseUrl}/og-image.png`,
    datePublished: data.publishedDate,
    dateModified: data.modifiedDate || data.publishedDate,
    author: {
      "@type": "Person",
      name: data.authorName,
      url: data.authorUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "InvestingPro.in",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": data.url,
    },
  };
}

/**
 * Generate Product structured data
 */
export function generateProductStructuredData(data: {
  name: string;
  description: string;
  url: string;
  image?: string;
  brand?: string;
  price?: string;
  currency?: string;
  rating?: number;
  reviewCount?: number;
}): ProductStructuredData {
  const structured: ProductStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: data.name,
    description: data.description,
    image: data.image,
  };

  if (data.brand) {
    structured.brand = {
      "@type": "Brand",
      name: data.brand,
    };
  }

  if (data.price) {
    structured.offers = {
      "@type": "Offer",
      price: data.price,
      priceCurrency: data.currency || "INR",
      availability: "https://schema.org/InStock",
      url: data.url,
    };
  }

  if (data.rating && data.reviewCount) {
    structured.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: data.rating.toString(),
      reviewCount: data.reviewCount.toString(),
    };
  }

  return structured;
}

/**
 * Generate Organization structured data
 */
export function generateOrganizationStructuredData(data?: {
  name?: string;
  url?: string;
  logo?: string;
  description?: string;
  email?: string;
  socialLinks?: string[];
}): OrganizationStructuredData {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://investingpro.in";

  const structured: OrganizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: data?.name || "InvestingPro.in",
    url: data?.url || baseUrl,
    logo: data?.logo || `${baseUrl}/logo.png`,
    description:
      data?.description ||
      "Compare 5000+ mutual funds, stocks, credit cards & insurance in India. Free calculators, expert reviews & personalized recommendations.",
  };

  if (data?.email) {
    structured.contactPoint = {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      email: data.email,
    };
  }

  if (data?.socialLinks && data.socialLinks.length > 0) {
    structured.sameAs = data.socialLinks;
  }

  return structured;
}

/**
 * Generate Breadcrumb structured data
 *
 * Items must be ABSOLUTE URLs per Google's Rich Results requirement.
 * Relative paths trigger "Invalid URL in field 'id'" errors in GSC.
 */
export function generateBreadcrumbStructuredData(
  items: Array<{ name: string; url: string }>,
): BreadcrumbStructuredData {
  const SITE_URL =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.investingpro.in";
  const toAbsolute = (url: string): string => {
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `${SITE_URL}${url.startsWith("/") ? url : `/${url}`}`;
  };
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: toAbsolute(item.url),
    })),
  };
}

/**
 * Generate FAQ structured data
 */
export function generateFAQStructuredData(
  faqs: Array<{ question: string; answer: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate Review structured data
 */
export function generateReviewStructuredData(data: {
  author: string;
  rating: number;
  reviewBody: string;
  datePublished: string;
  itemReviewed: {
    name: string;
    type: string;
  };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    author: {
      "@type": "Person",
      name: data.author,
    },
    datePublished: data.datePublished,
    reviewBody: data.reviewBody,
    reviewRating: {
      "@type": "Rating",
      ratingValue: data.rating,
      bestRating: 5,
      worstRating: 1,
    },
    itemReviewed: {
      "@type": data.itemReviewed.type,
      name: data.itemReviewed.name,
    },
  };
}
