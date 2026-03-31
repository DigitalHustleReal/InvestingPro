'use client';

import { useState, useEffect } from 'react';
import CookieConsentLib from 'react-cookie-consent';
import Link from 'next/link';

export default function CookieConsent() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <CookieConsentLib
      location="bottom"
      buttonText="Accept All Cookies"
      declineButtonText="Reject Non-Essential"
      enableDeclineButton
      cookieName="investingpro-cookie-consent"
      style={{
        background: 'rgba(15, 23, 42, 0.98)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(148, 163, 184, 0.2)',
        boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)',
        padding: '20px',
        zIndex: 9999,
      }}
      buttonStyle={{
        background: '#166534',
        color: '#ffffff',
        fontSize: '14px',
        fontWeight: '600',
        borderRadius: '10px',
        padding: '12px 28px',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 4px 6px -1px rgba(22, 101, 52, 0.3)',
        transition: 'all 0.2s ease',
      }}
      declineButtonStyle={{
        background: 'transparent',
        border: '2px solid #475569',
        color: '#e2e8f0',
        fontSize: '14px',
        fontWeight: '600',
        borderRadius: '10px',
        padding: '10px 24px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      expires={365}
      onAccept={() => {
        // Enable analytics cookies
        if (typeof window !== 'undefined') {
          // Google Analytics consent
          window.gtag?.('consent', 'update', {
            analytics_storage: 'granted',
            ad_storage: 'granted',
            ad_user_data: 'granted',
            ad_personalization: 'granted',
          });

          // Track consent acceptance
          window.gtag?.('event', 'cookie_consent', {
            event_category: 'engagement',
            event_label: 'accepted',
          });
        }
      }}
      onDecline={() => {
        // Disable non-essential cookies
        if (typeof window !== 'undefined') {
          // Google Analytics consent
          window.gtag?.('consent', 'update', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
          });

          // Track consent decline
          window.gtag?.('event', 'cookie_consent', {
            event_category: 'engagement',
            event_label: 'declined',
          });
        }
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-base font-semibold text-white mb-2">
              🍪 We value your privacy
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">
              We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
              By clicking "Accept All Cookies", you consent to our use of cookies.{' '}
              <Link 
                href="/privacy-policy" 
                className="text-primary-400 hover:text-primary-300 underline underline-offset-2 font-medium transition-colors"
              >
                Privacy Policy
              </Link>
              {' • '}
              <Link 
                href="/cookie-policy" 
                className="text-primary-400 hover:text-primary-300 underline underline-offset-2 font-medium transition-colors"
              >
                Cookie Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </CookieConsentLib>
  );
}
