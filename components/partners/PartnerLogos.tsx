'use client';

/**
 * Partner Logos Component
 * Displays partner/bank logos in a grid
 */

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';

interface Partner {
  id: string;
  name: string;
  logo_url: string;
  website_url?: string;
  category?: string;
  featured: boolean;
}

interface PartnerLogosProps {
  category?: string;
  featured?: boolean;
  limit?: number;
  title?: string;
  subtitle?: string;
}

export default function PartnerLogos({
  category,
  featured = true,
  limit,
  title = "Trusted by Leading Financial Institutions",
  subtitle = "Partnered with India's top banks and fintech companies"
}: PartnerLogosProps) {
  // Fetch partners
  const { data: partners = [], isLoading } = useQuery<Partner[]>({
    queryKey: ['partners', category, featured, limit],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (featured) params.append('featured', 'true');
      if (limit) params.append('limit', limit.toString());
      
      const response = await fetch(`/api/partners?${params}`);
      if (!response.ok) throw new Error('Failed to fetch partners');
      return response.json();
    }
  });

  if (isLoading) {
    return (
      <div className="w-full py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!partners || partners.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-16 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Partner Logos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8">
          {partners.map((partner) => (
            <PartnerLogo key={partner.id} partner={partner} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PartnerLogo({ partner }: { partner: Partner }) {
  const logoElement = (
    <div className="group relative h-24 flex items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 transition-all hover:shadow-lg">
      <div className="relative w-full h-full grayscale group-hover:grayscale-0 transition-all opacity-70 group-hover:opacity-100">
        <Image
          src={partner.logo_url}
          alt={`${partner.name} logo`}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
        />
      </div>
    </div>
  );

  if (partner.website_url) {
    return (
      <Link
        href={partner.website_url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {logoElement}
      </Link>
    );
  }

  return logoElement;
}
