import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0, // 10% in production, 100% in dev

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: process.env.NODE_ENV === 'development',

  // Environment
  environment: process.env.NODE_ENV || process.env.VERCEL_ENV || 'development',

  // Release tracking
  release: process.env.APP_VERSION || process.env.VERCEL_GIT_COMMIT_SHA || undefined,

  // Enhanced error tracking
  beforeSend(event, hint) {
    // Filter out known non-critical errors
    if (event.exception) {
      const error = hint.originalException;
      if (error instanceof Error) {
        // Ignore Supabase connection errors in development
        if (process.env.NODE_ENV === 'development' && error.message.includes('Supabase')) {
          return null;
        }
      }
    }
    return event;
  },

  // Add server context
  initialScope: {
    tags: {
      component: 'server',
    },
  },

  // Enhanced features
  integrations: [
    // HTTP integration is included by default in @sentry/nextjs
  ],

  // Performance monitoring
  profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Ignore patterns
  ignoreErrors: [
    // Browser extensions
    'top.GLOBALS',
    'originalCreateNotification',
    'canvas.contentDocument',
    'MyApp_RemoveAllHighlights',
    'atomicFindClose',
    'fb_xd_fragment',
    'bmi_SafeAddOnload',
    'EBCallBackMessageReceived',
    'conduitPage',
  ],

  // Uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: process.env.NODE_ENV === 'development',
});
