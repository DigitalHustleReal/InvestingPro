"use client";

import React from 'react';
import Link from 'next/link';
import { ExternalLink, ArrowRight } from 'lucide-react';
import {
  Platform,
  UserIntent,
  LinkPlacement,
  PLATFORMS,
  evaluateLinkValue,
  getExplainerPath,
} from '@/lib/platform-linking/config';

interface CrossPlatformLinkProps {
  from: Platform;
  to: Platform;
  userIntent: UserIntent;
  placement: LinkPlacement;
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'subtle' | 'text';
  showIcon?: boolean;
}

/**
 * CrossPlatformLink Component
 * 
 * Routes user intent across platforms based on the linking framework.
 * Only renders if the link passes the evaluation criteria.
 */
export default function CrossPlatformLink({
  from,
  to,
  userIntent,
  placement,
  children,
  className = '',
  variant = 'subtle',
  showIcon = true,
}: CrossPlatformLinkProps) {
  const evaluation = evaluateLinkValue(from, to, userIntent, placement);

  // Don't render if link shouldn't exist
  if (!evaluation.shouldLink) {
    return null;
  }

  const targetPlatform = PLATFORMS[to];
  const explainerPath = getExplainerPath(from, to);
  
  // If explainer path exists, route through it
  const href = explainerPath || targetPlatform.domain;
  const isExternal = !explainerPath;

  // Determine styling based on variant
  const baseStyles = {
    default: 'text-primary-600 hover:text-primary-700 font-medium',
    subtle: 'text-slate-500 hover:text-slate-700 text-sm',
    text: 'text-slate-600 hover:text-slate-900 underline underline-offset-2',
  };

  const linkContent = (
    <>
      {children || targetPlatform.name}
      {showIcon && (
        <span className="inline-flex items-center ml-1">
          {isExternal ? (
            <ExternalLink className="w-3 h-3" />
          ) : (
            <ArrowRight className="w-3 h-3" />
          )}
        </span>
      )}
    </>
  );

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseStyles[variant]} ${className} transition-colors`}
        aria-label={`Visit ${targetPlatform.name} (opens in new tab)`}
      >
        {linkContent}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={`${baseStyles[variant]} ${className} transition-colors`}
    >
      {linkContent}
    </Link>
  );
}

/**
 * ContextualLinkSection Component
 * 
 * A section that provides contextual cross-platform links based on page context.
 * Should be placed in "Advanced tools", "Next steps", or similar sections.
 */
interface ContextualLinkSectionProps {
  currentPlatform: Platform;
  userIntent: UserIntent;
  title?: string;
  description?: string;
}

export function ContextualLinkSection({
  currentPlatform,
  userIntent,
  title = 'Related Tools',
  description,
}: ContextualLinkSectionProps) {
  const otherPlatforms = Object.values(PLATFORMS).filter(
    (p) => p.id !== currentPlatform
  );

  const validLinks = otherPlatforms
    .map((platform) => {
      const evaluation = evaluateLinkValue(
        currentPlatform,
        platform.id,
        userIntent,
        'contextual'
      );
      return evaluation.shouldLink
        ? { platform, evaluation }
        : null;
    })
    .filter(Boolean) as Array<{ platform: typeof PLATFORMS[Platform]; evaluation: { shouldLink: boolean; reason: string } }>;

  if (validLinks.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 pt-8 border-t border-slate-200">
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-slate-600 mb-4">{description}</p>
      )}
      <div className="space-y-2">
        {validLinks.map(({ platform }) => (
          <CrossPlatformLink
            key={platform.id}
            from={currentPlatform}
            to={platform.id}
            userIntent={userIntent}
            placement="contextual"
            variant="subtle"
          >
            {platform.name} - {platform.primaryJob}
          </CrossPlatformLink>
        ))}
      </div>
    </div>
  );
}



























