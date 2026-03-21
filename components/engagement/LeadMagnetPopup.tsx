'use client';

/**
 * Lead Magnet Popup System
 * 
 * Features:
 * - Exit intent detection
 * - Timed popups
 * - Scroll-triggered popups
 * - Multiple lead magnet types
 * - Cookie-based frequency capping
 */

import React, { useState, useEffect, useCallback } from 'react';
import { X, Gift, Mail, Download, ArrowRight, Loader2, CheckCircle, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface LeadMagnetPopupProps {
  // When to show
  trigger: 'exit-intent' | 'timed' | 'scroll';
  delay?: number; // For timed trigger (ms)
  scrollPercent?: number; // For scroll trigger (0-100)
  
  // What to offer
  variant: 'newsletter' | 'guide' | 'calculator-results' | 'comparison';
  
  // Content customization
  title?: string;
  description?: string;
  buttonText?: string;
  imageSrc?: string;
  guideTitle?: string;
  
  // Callbacks
  onSubscribe?: (email: string, name?: string) => Promise<void>;
  onClose?: () => void;
  
  // Feature flags
  cookieKey?: string;
  cookieDays?: number;
  disabled?: boolean;
}

export function LeadMagnetPopup({
  trigger = 'exit-intent',
  delay = 30000,
  scrollPercent = 50,
  variant = 'newsletter',
  title,
  description,
  buttonText,
  imageSrc,
  guideTitle = 'Free PDF Guide',
  onSubscribe,
  onClose,
  cookieKey = 'investingpro_lead_popup',
  cookieDays = 7,
  disabled = false,
}: LeadMagnetPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClient();

  // Default content based on variant
  const content = getVariantContent(variant, { title, description, buttonText, guideTitle });

  // Check if popup was already shown
  const wasShown = useCallback(() => {
    if (typeof window === 'undefined') return true;
    return document.cookie.includes(`${cookieKey}=shown`);
  }, [cookieKey]);

  // Mark popup as shown
  const markAsShown = useCallback(() => {
    const expires = new Date();
    expires.setDate(expires.getDate() + cookieDays);
    document.cookie = `${cookieKey}=shown; expires=${expires.toUTCString()}; path=/`;
  }, [cookieKey, cookieDays]);

  // Exit intent detection
  useEffect(() => {
    if (disabled || wasShown() || trigger !== 'exit-intent') return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setIsVisible(true);
        markAsShown();
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [trigger, disabled, wasShown, markAsShown]);

  // Timed trigger
  useEffect(() => {
    if (disabled || wasShown() || trigger !== 'timed') return;

    const timer = setTimeout(() => {
      setIsVisible(true);
      markAsShown();
    }, delay);

    return () => clearTimeout(timer);
  }, [trigger, delay, disabled, wasShown, markAsShown]);

  // Scroll trigger
  useEffect(() => {
    if (disabled || wasShown() || trigger !== 'scroll') return;

    const handleScroll = () => {
      const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrolled >= scrollPercent) {
        setIsVisible(true);
        markAsShown();
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [trigger, scrollPercent, disabled, wasShown, markAsShown]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');

    try {
      // Save to newsletter_subscribers table
      const { error: dbError } = await supabase
        .from('newsletter_subscribers')
        .insert({
          email,
          name: name || null,
          source: `lead_magnet_${variant}`,
          subscribed_at: new Date().toISOString(),
        });

      if (dbError && dbError.code !== '23505') { // Ignore duplicate
        throw dbError;
      }

      // Call custom handler if provided
      if (onSubscribe) {
        await onSubscribe(email, name);
      }

      setSuccess(true);
    } catch (err: any) {
      setError('Something went wrong. Please try again.');
      console.error('Lead magnet error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle close
  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <X className="w-4 h-4 text-slate-600 dark:text-slate-400" />
        </button>

        {/* Success State */}
        {success ? (
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success-100 dark:bg-success-500/20 mb-4">
              <CheckCircle className="w-8 h-8 text-success-600 dark:text-success-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              You're in! ðŸŽ‰
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              {variant === 'newsletter' 
                ? 'Check your inbox for a welcome email.'
                : 'Your download link is on the way!'}
            </p>
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
            >
              Got it!
            </button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row">
            {/* Image Side */}
            <div className="hidden md:block md:w-2/5 bg-gradient-to-br from-primary-500 to-primary-600 p-6 flex items-center justify-center">
              <div className="text-center text-white">
                {getVariantIcon(variant)}
                <p className="text-lg font-semibold mt-4">{content.tagline}</p>
              </div>
            </div>

            {/* Form Side */}
            <div className="flex-1 p-6 md:p-8">
              {/* Mobile Icon */}
              <div className="md:hidden flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                  {getVariantIconSmall(variant)}
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 text-center md:text-left">
                {content.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 text-center md:text-left">
                {content.description}
              </p>

              {error && (
                <div className="mb-4 p-2 bg-danger-50 dark:bg-danger-500/10 border border-danger-200 dark:border-danger-500/20 rounded-lg text-danger-600 dark:text-danger-400 text-sm text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                {variant !== 'newsletter' && (
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                  />
                )}
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-lg transition-all shadow-lg disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {content.buttonText}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <p className="text-xs text-slate-500 text-center mt-4">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Variant content
function getVariantContent(variant: string, custom: any) {
  const defaults: Record<string, any> = {
    newsletter: {
      title: custom.title || 'Get Weekly Finance Tips',
      description: custom.description || 'Join 25,000+ Indians getting our best money-saving tips every Tuesday.',
      buttonText: custom.buttonText || 'Subscribe Free',
      tagline: 'Weekly Insights',
    },
    guide: {
      title: custom.title || `Download: ${custom.guideTitle}`,
      description: custom.description || 'Get our comprehensive guide delivered to your inbox instantly.',
      buttonText: custom.buttonText || 'Get Free PDF',
      tagline: 'Free Download',
    },
    'calculator-results': {
      title: custom.title || 'Email Your Results',
      description: custom.description || 'Get your calculation results with detailed breakdown sent to your inbox.',
      buttonText: custom.buttonText || 'Send Results',
      tagline: 'Save Results',
    },
    comparison: {
      title: custom.title || 'Download Comparison Report',
      description: custom.description || 'Get a detailed PDF comparison you can review offline.',
      buttonText: custom.buttonText || 'Get PDF Report',
      tagline: 'PDF Report',
    },
  };

  return defaults[variant] || defaults.newsletter;
}

function getVariantIcon(variant: string) {
  const iconClass = 'w-16 h-16 text-white/90';
  switch (variant) {
    case 'guide':
      return <Download className={iconClass} />;
    case 'calculator-results':
      return <Sparkles className={iconClass} />;
    case 'comparison':
      return <Download className={iconClass} />;
    default:
      return <Mail className={iconClass} />;
  }
}

function getVariantIconSmall(variant: string) {
  const iconClass = 'w-6 h-6 text-white';
  switch (variant) {
    case 'guide':
      return <Download className={iconClass} />;
    case 'calculator-results':
      return <Sparkles className={iconClass} />;
    case 'comparison':
      return <Download className={iconClass} />;
    default:
      return <Mail className={iconClass} />;
  }
}

export default LeadMagnetPopup;
