/**
 * JSON-LD Structured Data for Mutual Fund Pages
 *
 * Generates InvestmentFund, FAQPage, and BreadcrumbList schema
 * for rich results in Google Search
 */

interface FundStructuredDataProps {
  fund: {
    name: string;
    description: string;
    amc: string;
    category: string;
    nav: number;
    rating: number;
    riskLevel: string;
    expenseRatio: number;
    sipMinInvestment: number;
    minInvestment: number;
    returns: { '1Y': number; '3Y': number; '5Y': number; sinceInception: number };
    launchDate: string;
    aum: number;
  };
  slug: string;
  faqs: Array<{ question: string; answer: string }>;
}

export default function FundStructuredData({ fund, slug, faqs }: FundStructuredDataProps) {
  const baseUrl = 'https://investingpro.in';

  const investmentFundSchema = {
    "@context": "https://schema.org",
    "@type": "InvestmentFund",
    "name": fund.name,
    "description": fund.description,
    "url": `${baseUrl}/mutual-funds/${slug}`,
    "provider": {
      "@type": "Organization",
      "name": fund.amc,
    },
    "category": fund.category,
    ...(fund.launchDate ? { "dateCreated": fund.launchDate } : {}),
    ...(fund.aum > 0 ? { "amount": { "@type": "MonetaryAmount", "value": fund.aum, "currency": "INR" } } : {}),
  };

  const financialProductSchema = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    "name": fund.name,
    "description": fund.description,
    "url": `${baseUrl}/mutual-funds/${slug}`,
    "provider": {
      "@type": "Organization",
      "name": fund.amc,
    },
    "category": `Mutual Fund - ${fund.category}`,
    "offers": {
      "@type": "Offer",
      "price": fund.sipMinInvestment,
      "priceCurrency": "INR",
      "description": `Minimum SIP: ₹${fund.sipMinInvestment}/month, Lumpsum: ₹${fund.minInvestment}`,
    },
    ...(fund.rating > 0 ? {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": fund.rating,
        "bestRating": 5,
        "ratingCount": 1,
      }
    } : {}),
    "additionalProperty": [
      { "@type": "PropertyValue", "name": "NAV", "value": `₹${fund.nav.toFixed(2)}` },
      { "@type": "PropertyValue", "name": "Expense Ratio", "value": `${fund.expenseRatio}%` },
      { "@type": "PropertyValue", "name": "Risk Level", "value": fund.riskLevel },
      ...(fund.returns['3Y'] ? [{ "@type": "PropertyValue", "name": "3 Year CAGR", "value": `${fund.returns['3Y']}%` }] : []),
      ...(fund.returns['5Y'] ? [{ "@type": "PropertyValue", "name": "5 Year CAGR", "value": `${fund.returns['5Y']}%` }] : []),
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
      { "@type": "ListItem", "position": 2, "name": "Mutual Funds", "item": `${baseUrl}/mutual-funds` },
      { "@type": "ListItem", "position": 3, "name": fund.category, "item": `${baseUrl}/mutual-funds?category=${encodeURIComponent(fund.category)}` },
      { "@type": "ListItem", "position": 4, "name": fund.name },
    ],
  };

  const faqSchema = faqs.length > 0 ? {
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
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(investmentFundSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(financialProductSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </>
  );
}
