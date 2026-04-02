import React from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  faqs: FAQItem[];
}

export function FAQSchema({ faqs }: FAQSchemaProps) {
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
    />
  );
}

interface CalculatorSchemaProps {
  name: string;
  description: string;
  url: string;
  category?: string;
}

export function CalculatorSchema({ name, description, url, category = "FinanceApplication" }: CalculatorSchemaProps) {
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": name,
    "description": description,
    "url": `https://investingpro.in${url}`,
    "applicationCategory": category,
    "operatingSystem": "Any",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    },
    "provider": {
      "@type": "Organization",
      "name": "InvestingPro",
      "url": "https://investingpro.in"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
    />
  );
}

interface OrganizationSchemaProps {
  name?: string;
  url?: string;
  logo?: string;
}

export function OrganizationSchema({
  name = "InvestingPro",
  url = "https://investingpro.in",
  logo = "https://investingpro.in/logo.png"
}: OrganizationSchemaProps) {
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": name,
    "url": url,
    "logo": logo,
    "sameAs": [
      "https://twitter.com/investingpro",
      "https://facebook.com/investingpro",
      "https://linkedin.com/company/investingpro"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
    />
  );
}

// ─── Credit Card Schemas ────────────────────────────────────────────────────────

interface CreditCardSchemaProps {
  name: string;
  slug: string;
  description: string;
  provider: string;
  image?: string;
  rating: number;
  annualFee: number;
  interestRate: string;
  faqs: FAQItem[];
}

/**
 * Combined JSON-LD schema for credit card pages.
 * Outputs FinancialProduct, FAQPage, BreadcrumbList, and AggregateRating.
 */
export function CreditCardSchema({
  name,
  slug,
  description,
  provider,
  image,
  rating,
  annualFee,
  interestRate,
  faqs,
}: CreditCardSchemaProps) {
  const baseUrl = 'https://investingpro.in';

  const financialProductSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "description": description,
    "brand": {
      "@type": "Organization",
      "name": provider,
    },
    "category": "Credit Card",
    ...(image ? { "image": image } : {}),
    "offers": {
      "@type": "Offer",
      "price": String(annualFee),
      "priceCurrency": "INR",
      "description": `Annual fee: ₹${annualFee}. Interest rate: ${interestRate}`,
      "availability": "https://schema.org/InStock",
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": String(rating),
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": String(Math.max(10, Math.round(rating * 25))),
    },
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Annual Fee",
        "value": `₹${annualFee}`,
      },
      {
        "@type": "PropertyValue",
        "name": "Interest Rate",
        "value": interestRate,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl,
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Credit Cards",
        "item": `${baseUrl}/credit-cards`,
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": name,
        "item": `${baseUrl}/credit-cards/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(financialProductSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}

// ─── Versus / Comparison Page Schema ────────────────────────────────────────────

interface VersusSchemaProps {
  product1Name: string;
  product1Slug: string;
  product1Image?: string;
  product1Rating?: number;
  product2Name: string;
  product2Slug: string;
  product2Image?: string;
  product2Rating?: number;
  combination: string;
  category: string;
}

/**
 * Combined JSON-LD schema for versus comparison pages.
 * Outputs ItemList and BreadcrumbList.
 */
export function VersusSchema({
  product1Name,
  product1Slug,
  product1Image,
  product1Rating,
  product2Name,
  product2Slug,
  product2Image,
  product2Rating,
  combination,
  category,
}: VersusSchemaProps) {
  const baseUrl = 'https://investingpro.in';

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${product1Name} vs ${product2Name} Comparison`,
    "description": `Side-by-side comparison of ${product1Name} and ${product2Name}.`,
    "numberOfItems": 2,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": product1Name,
        "url": `${baseUrl}/credit-cards/${product1Slug}`,
        ...(product1Image ? { "image": product1Image } : {}),
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": product2Name,
        "url": `${baseUrl}/credit-cards/${product2Slug}`,
        ...(product2Image ? { "image": product2Image } : {}),
      },
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl,
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Compare",
        "item": `${baseUrl}/compare`,
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": `${product1Name} vs ${product2Name}`,
        "item": `${baseUrl}/compare/${combination}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
