import React from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  faqs: FAQItem[];
}

// FAQSchema REMOVED — Google restricted FAQPage schema to government/healthcare
// sites in August 2023. Using it on finance/comparison sites risks a penalty.
// Export kept as no-op to avoid import errors in pages that reference it.
export function FAQSchema({ faqs: _faqs }: FAQSchemaProps) {
  return null;
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
