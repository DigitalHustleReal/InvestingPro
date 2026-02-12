/**
 * ADMIN DESIGN SYSTEM - WEALTH & TRUST THEME
 * 
 * Single source of truth for all admin styling.
 * Uses TypeScript constants for type safety and guaranteed rendering
 * (bypassing potentially flaky Tailwind class generation).
 */

export const ADMIN_THEME = {
  colors: {
    // Primary Brand (Navy)
    primary: {
      900: '#102A43', // Deepest Navy (Sidebar, Hero BG)
      800: '#243B53', // Dark Navy (Hero Gradient)
      700: '#334E68', // Medium Navy
      600: '#486581', // Light Navy
      500: '#627D98', // Muted Navy
    },
    
    // Accent (Gold)
    accent: {
      default: '#D4AF37', // Standard Gold
      hover:   '#C5A028', // Darker Gold for hover
      subtle:  'rgba(212, 175, 55, 0.15)', // Light Gold background
    },

    // Backgrounds & Surfaces
    bg: {
      main:    '#F0F4F8', // Main Page Background (Light Gray-Blue)
      surface: '#FFFFFF', // Card Background
      alt:     '#F8FAFC', // Alternating Row / Secondary BG
      hover:   '#F1F5F9', // Hover state
    },

    // Text & Typography
    text: {
      main:    '#102A43', // Primary Text (Navy-900)
      muted:   '#486581', // Secondary Text (Navy-600)
      light:   '#829AB1', // Tertiary Text
      white:   '#FFFFFF', // Text on dark backgrounds
      inverse: '#FFFFFF',
    },

    // Borders
    border: {
      default: '#D9E2EC', // Standard Border
      subtle:  '#F0F4F8', // Light Divider
      strong:  '#BCCCDC', // Input Border / Stronger Divider
    },

    // Semantic / Status
    status: {
      success: {
        text: '#065F46', // Deep Green
        bg:   '#D1FAE5', // Light Green
        icon: '#059669',
      },
      warning: {
        text: '#92400E', // Deep Amber
        bg:   '#FEF3C7', // Light Amber
        icon: '#D97706',
      },
      error: {
        text: '#991B1B', // Deep Red
        bg:   '#FEE2E2', // Light Red
        icon: '#DC2626',
      },
      info: {
        text: '#1E40AF', // Deep Blue
        bg:   '#DBEAFE', // Light Blue
        icon: '#2563EB',
      },
    }
  },

  // Spacing Scale (in px)
  spacing: {
    0: '0px',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
  },

  // Border Radius
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px', 
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    card: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
    cardHover: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  },

  // Typography
  fonts: {
    sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  // Modern UI Tokens
  gradients: {
    primary: 'linear-gradient(135deg, #102A43 0%, #243B53 100%)',
    glass: 'rgba(255, 255, 255, 0.05)',
    surface: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
    glow: 'radial-gradient(circle at center, rgba(212, 175, 55, 0.15) 0%, transparent 70%)',
  },
  
  glass: {
    border: '1px solid rgba(255, 255, 255, 0.08)',
    shadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
    backdrop: 'blur(12px)',
  }

} as const;

// Helper to construct common inline styles
export const cardStyle = {
  backgroundColor: ADMIN_THEME.colors.bg.surface,
  border: `1px solid ${ADMIN_THEME.colors.border.default}`,
  borderRadius: ADMIN_THEME.radius.lg,
  boxShadow: ADMIN_THEME.shadows.card,
  overflow: 'hidden',
};

export const titleStyle = {
  color: ADMIN_THEME.colors.text.main,
  fontWeight: 700,
  letterSpacing: '-0.025em',
};

export const subTextStyle = {
  color: ADMIN_THEME.colors.text.muted,
  fontSize: '0.875rem',
};
