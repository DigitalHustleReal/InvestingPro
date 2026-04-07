interface ProductSchemaMarkupProps {
  product: {
    name: string;
    description: string;
    image?: string;
    rating: number;
    category: string;
    provider: string;
    url: string;
  };
}

export function ProductSchemaMarkup({ product }: ProductSchemaMarkupProps) {
  const baseUrl = "https://investingpro.in";
  const fullUrl = `${baseUrl}${product.url}`;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    ...(product.image ? { image: product.image } : {}),
    category: product.category,
    brand: {
      "@type": "Organization",
      name: product.provider,
    },
    offers: {
      "@type": "Offer",
      url: fullUrl,
      availability: "https://schema.org/InStock",
      priceCurrency: "INR",
      price: "0",
    },
  };

  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "Product",
      name: product.name,
    },
    author: {
      "@type": "Organization",
      name: "InvestingPro",
      url: baseUrl,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: String(product.rating),
      bestRating: "5",
      worstRating: "1",
    },
    publisher: {
      "@type": "Organization",
      name: "InvestingPro",
      url: baseUrl,
    },
  };

  // Derive breadcrumb from url: e.g. "/credit-cards/hdfc-regalia" → ["Credit Cards", "HDFC Regalia"]
  const segments = product.url.split("/").filter(Boolean);
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
