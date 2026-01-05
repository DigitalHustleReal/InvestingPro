/**
 * Disclaimer Banner Component - Week 2, Task 2.1
 * Purpose: Regulatory compliance for financial services platform
 * Legal requirement: Investment disclaimers must be visible on all financial content
 */

import { cn } from "@/lib/utils";
import { AlertTriangle, Info, Lock, ShieldCheck } from "lucide-react";

export type DisclaimerVariant = 'investment' | 'privacy' | 'general' | 'sebi';

interface DisclaimerBannerProps {
  variant: DisclaimerVariant;
  sticky?: boolean;
  className?: string;
}

const disclaimerContent = {
  investment: {
    icon: AlertTriangle,
    iconColor: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-600',
    textColor: 'text-amber-900',
    title: 'Investment Risk Disclaimer',
    text: 'Investment in financial products is subject to market risk. Past performance does not guarantee future results. Please read all scheme-related documents carefully before investing. Returns are not guaranteed and depend on market conditions.',
  },
  privacy: {
    icon: Lock,
    iconColor: 'text-secondary-700',
    bgColor: 'bg-secondary-50',
    borderColor: 'border-secondary-600',
    textColor: 'text-secondary-900',
    title: 'Data Privacy Notice',
    text: 'We value your privacy. Your data is encrypted and never shared with third parties without your consent. We use cookies to improve your experience. By continuing, you agree to our Privacy Policy and Terms of Service.',
  },
  general: {
    icon: Info,
    iconColor: 'text-stone-700',
    bgColor: 'bg-stone-50',
    borderColor: 'border-stone-400',
    textColor: 'text-stone-900',
    title: 'Important Information',
    text: 'InvestingPro.in is an independent comparison and education platform. We are not SEBI registered advisors. Always consult with a certified financial advisor before making investment decisions. We may receive compensation from product providers featured on our site.',
  },
  sebi: {
    icon: ShieldCheck,
    iconColor: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-600',
    textColor: 'text-red-900',
    title: 'SEBI Regulatory Notice',
    text: 'InvestingPro.in is NOT a SEBI registered investment advisor (RIA). We provide comparison and educational content only. Investment decisions should be made after consulting with SEBI registered advisors. Refer to www.sebi.gov.in for registered advisors.',
  },
};

export function DisclaimerBanner({ 
  variant, 
  sticky = false,
  className 
}: DisclaimerBannerProps) {
  const config = disclaimerContent[variant];
  const Icon = config.icon;

  return (
    <div 
      className={cn(
        "border-t-4 p-4",
        config.bgColor,
        config.borderColor,
        sticky && "sticky bottom-0 z-50 shadow-lg",
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="max-w-7xl mx-auto flex items-start gap-3">
        {/* Icon */}
        <Icon 
          className={cn(
            "w-5 h-5 flex-shrink-0 mt-0.5",
            config.iconColor
          )} 
          aria-hidden="true"
        />
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={cn(
            "text-xs font-semibold mb-1 uppercase tracking-wide",
            config.textColor
          )}>
            {config.title}
          </p>
          <p className={cn(
            "text-xs leading-relaxed",
            config.textColor
          )}>
            {config.text}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Sticky Bottom Disclaimer - For pages with "Invest Now" or "Apply Now" CTAs
 */
export function StickyInvestmentDisclaimer() {
  return <DisclaimerBanner variant="investment" sticky />;
}

/**
 * Inline Disclaimer - For embedding within content
 */
export function InlineDisclaimer({ variant = 'general' }: { variant?: DisclaimerVariant }) {
  return <DisclaimerBanner variant={variant} className="my-6 rounded-lg" />;
}

/**
 * Page Footer Disclaimer - For global footer
 */
export function FooterDisclaimer() {
  return (
    <div className="space-y-2">
      <DisclaimerBanner variant="sebi" className="rounded-lg" />
      <DisclaimerBanner variant="general" className="rounded-lg" />
    </div>
  );
}
