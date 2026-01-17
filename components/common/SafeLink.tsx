/**
 * SafeLink Component
 * Prevents broken links by ensuring href is never '#' or empty
 * Automatically falls back to '/' if invalid URL provided
 */

import Link from 'next/link';
import { ComponentProps } from 'react';
import { isValidUrl, getSafeUrl } from '@/lib/utils/product-urls';

type SafeLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: string | null | undefined;
  fallback?: string;
};

/**
 * Safe Link wrapper that prevents broken links
 * Usage: <SafeLink href={maybeInvalidUrl}>Click</SafeLink>
 */
export function SafeLink({ 
  href, 
  fallback = '/', 
  children, 
  ...props 
}: SafeLinkProps) {
  const safeHref = getSafeUrl(href, fallback);
  
  return (
    <Link href={safeHref} {...props}>
      {children}
    </Link>
  );
}

export default SafeLink;
