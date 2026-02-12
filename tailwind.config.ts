import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // ============================================================
                // SEMANTIC COLORS - CSS Variable Based (Theme-Aware)
                // ============================================================
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                primary: {
                    50: '#F0FDFB',
                    100: '#CCFBF1',
                    200: '#99F6E4',
                    300: '#5EEAD4',
                    400: '#2DD4BF',
                    500: '#1CB7A8', // Brand Teal Primary
                    600: '#14B8A6',
                    700: '#0D9488', // Accessible Teal (Primary Dark)
                    800: '#0F766E',
                    900: '#134E4A',
                    950: '#0A2F2B',
                },
                secondary: {
                    50: '#F8FAFC',
                    100: '#F1F5F9',
                    200: '#E2E8F0',
                    300: '#CBD5E1',
                    400: '#94A3B8',
                    500: '#1B5E99', // Fintech Blue
                    600: '#0F66CC',
                    700: '#1E40AF',
                    800: '#1E3A8A',
                    900: '#1E3A5F',
                    950: '#1A2332', // Brand Navy
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                    50: '#fffbeb',
                    100: '#fef3c7',
                    200: '#fde68a',
                    300: '#fcd34d',
                    400: '#fbbf24',
                    500: '#f59e0b',
                    600: '#d97706',
                    700: '#b45309',
                    800: '#92400e',
                    900: '#78350f',
                },
                success: {
                    DEFAULT: 'hsl(var(--success))',
                    foreground: 'hsl(var(--success-foreground))',
                    500: '#10B981',
                },
                // ... same as before for warning, error, info ...
                warning: {
                    DEFAULT: 'hsl(var(--warning))',
                    foreground: 'hsl(var(--warning-foreground))',
                    500: '#F59E0B',
                },
                error: {
                    DEFAULT: 'hsl(var(--error))',
                    foreground: 'hsl(var(--error-foreground))',
                    500: '#EF4444',
                },
                info: {
                    DEFAULT: 'hsl(var(--info))',
                    foreground: 'hsl(var(--info-foreground))',
                    500: '#3B82F6',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
                
                // ============================================================
                // NEUTRAL STANDARDIZATION
                // ============================================================
                slate: {
                    50: '#F8FAFC',   /* Light background */
                    100: '#F1F5F9',
                    200: '#E2E8F0',  /* Light borders */
                    300: '#CBD5E1',  /* Disabled state */
                    400: '#94A3B8',  /* Deactivated text */
                    500: '#64748B',  /* Secondary text (NEW - STANDARDIZED) */
                    600: '#475569',
                    700: '#334155',  /* Body text */
                    800: '#1E293B',
                    900: '#0F172A',
                    950: '#1A2332',  /* PRIMARY DARK */
                },
                // stone - Keeping alias for backward compatibility
                stone: {
                    50: '#F9FAFB',
                    100: '#F3F4F6',
                    200: '#E5E7EB',
                    300: '#D1D5DB',
                    400: '#9CA3AF',
                    500: '#6B7280',
                    600: '#4B5563',
                    700: '#374151',
                    800: '#1F2937',
                    900: '#111827',
                },
                // Danger - Keep for backward compatibility
                danger: {
                    50: '#fef2f2',
                    100: '#fee2e2',
                    200: '#fecaca',
                    300: '#fca5a5',
                    400: '#f87171',
                    500: '#ef4444',
                    600: '#dc2626',
                    700: '#b91c1c',
                    800: '#991b1b',
                    900: '#7f1d1d',
                    DEFAULT: '#ef4444',
                },
                // Surface Tokens (Replaces Hardcoded Hex Values)
                surface: {
                    page: '#fafaf9',      // stone-50 - Main page background (light)
                    card: '#ffffff',      // white - Card backgrounds
                    border: '#e7e5e4',    // stone-200 - Borders
                    dark: '#020617',      // Replaces bg-[#020617]
                    darker: '#0f172a',    // Replaces bg-[#0f172a] 
                    darkest: '#0a0c10',   // Replaces bg-[#0a0c10]
                },
                // Admin Glassmorphism Theme (legacy - kept for compatibility)
                admin: {
                    'bg': '#0A0118',
                    'surface': '#1A1128',
                    'surface-hover': '#2D1B4E',
                    'glass': 'rgba(26, 17, 40, 0.8)',
                    'glass-border': 'rgba(139, 92, 246, 0.2)',
                    'glass-hover': 'rgba(45, 27, 78, 0.9)',
                    'text': '#F8FAFC',
                    'text-muted': '#A78BFA',
                    'text-dim': '#6D5D8F',
                    'accent': '#8B5CF6',
                    'accent-glow': '#A78BFA',
                    'accent-strong': '#7C3AED',
                    'border': 'rgba(139, 92, 246, 0.3)',
                    'border-strong': 'rgba(139, 92, 246, 0.5)',
                    'input': '#0F0A1A',
                    'input-focus': '#1A1128',
                },
                // Admin Pro - Clean SaaS dark theme (single accent, neutral base)
                'admin-pro': {
                    bg: '#09090b',
                    sidebar: '#0f0f11',
                    surface: '#18181b',
                    'surface-hover': '#27272a',
                    border: '#27272a',
                    'border-light': '#3f3f46',
                    text: '#fafafa',
                    'text-muted': '#a1a1aa',
                    'text-dim': '#71717a',
                    accent: '#10b981',
                    'accent-hover': '#059669',
                    'accent-subtle': 'rgba(16, 185, 129, 0.12)',
                    danger: '#ef4444',
                    'danger-subtle': 'rgba(239, 68, 68, 0.12)',
                    warning: '#f59e0b',
                    'warning-subtle': 'rgba(245, 158, 11, 0.12)',
                },
                // Wealth & Trust – professional finance CMS (navy, gold, green)
                wt: {
                    nav: '#1F3B5C',
                    'nav-light': '#2D5A8C',
                    navy: {
                        50: '#F0F4F8',
                        100: '#D9E2EC',
                        200: '#BCCCDC',
                        300: '#9FB3C8',
                        400: '#829AB1',
                        500: '#627D98',
                        600: '#486581',
                        700: '#334E68',
                        800: '#243B53',
                        900: '#102A43',
                        950: '#061729',
                    },
                    gold: '#D4AF37',
                    'gold-hover': '#B8A028',
                    'gold-subtle': 'rgba(212, 175, 55, 0.15)',
                    green: '#2E7D32',
                    'green-subtle': 'rgba(46, 125, 50, 0.12)',
                    orange: '#FF6B35',
                    'orange-subtle': 'rgba(255, 107, 53, 0.12)',
                    teal: '#00BFA5',
                    bg: '#F9F9F9',
                    card: '#F5F5F5',
                    surface: '#FFFFFF',
                    'surface-hover': '#EEEEEE',
                    border: '#DDDDDD',
                    'border-light': '#E8E8E8',
                    text: '#1A1A1A',
                    'text-muted': '#555555',
                    'text-dim': '#777777',
                    danger: '#DC2626',
                    'danger-subtle': 'rgba(220, 38, 38, 0.12)',
                }
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
                heading: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
                serif: ['var(--font-serif)', 'Georgia', 'serif'],
                mono: ['var(--font-mono)', 'Courier New', 'monospace'],
            },
            fontSize: {
                'xs': '0.75rem',
                'sm': '0.875rem',
                'base': '1rem',
                'lg': '1.125rem',
                'xl': '1.25rem',
                '2xl': '1.5rem',
                '3xl': '1.875rem',
                '4xl': '2.25rem',
                '5xl': '3rem',
                '6xl': '3.75rem',
                '7xl': '4.5rem',
            },
            spacing: {
                '0.5': '4px',    // Tight internal spacing (icon + text)
                '1.5': '12px',   // Default gap (form fields)
                '6': '48px',     // Generous spacing (desktop padding)
                '12': '96px',    // Major section breaks (desktop)
                '18': '4.5rem',  // 72px (keep for compatibility)
                '20': '160px',   // Hero spacing
                '24': '192px',   // Large hero spacing
                '88': '22rem',   // Keep for compatibility
                '128': '32rem',  // Container max-width
            },
            borderRadius: {
                'sm': '4px',     // Tight corners (data tables, inputs)
                'base': '8px',   // Standard (buttons, small cards)
                'md': '0.75rem', // Keep for compatibility
                'lg': '12px',    // Large cards, panels
                'xl': '16px',    // Modals, hero sections (max for fintech)
                '2xl': '2rem',   // Keep for compatibility (legacy)
                '3xl': '3rem',   // Keep for compatibility (legacy)
            },
            boxShadow: {
                // Standard shadows with layered depth (UI/UX Phase 2)
                'xs': '0 1px 2px rgba(0, 0, 0, 0.05)',
                'sm': '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.05)',
                'base': '0 4px 12px 0 rgb(0 0 0 / 0.08)',
                'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                'lg': '0 10px 20px -3px rgb(0 0 0 / 0.12), 0 4px 6px -4px rgb(0 0 0 / 0.08)',
                'xl': '0 20px 40px -5px rgb(0 0 0 / 0.15), 0 8px 16px -8px rgb(0 0 0 / 0.1)',
                '2xl': '0 30px 60px -12px rgb(0 0 0 / 0.2), 0 12px 24px -12px rgb(0 0 0 / 0.15)',
                
                // Brand colored shadows
                'primary': '0 4px 12px rgba(20, 184, 166, 0.15)',      // Teal brand shadow
                'primary-lg': '0 8px 24px rgba(20, 184, 166, 0.25)',   // Teal brand shadow (hover)
                'secondary': '0 4px 12px rgba(14, 165, 233, 0.15)',    // Sky/Blue shadow
                'secondary-lg': '0 8px 24px rgba(14, 165, 233, 0.25)', // Sky/Blue shadow (hover)
                'accent': '0 4px 12px rgba(245, 158, 11, 0.15)',       // Amber accent shadow
                'accent-lg': '0 8px 24px rgba(245, 158, 11, 0.25)',    // Amber accent shadow (hover)
                'success': '0 4px 12px rgba(16, 185, 129, 0.15)',      // Success shadow
                'danger': '0 4px 12px rgba(239, 68, 68, 0.15)',        // Danger shadow
                
                // Card-specific shadows for depth
                'card': '0 2px 8px -2px rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06)',
                'card-hover': '0 12px 28px -6px rgba(0, 0, 0, 0.12), 0 4px 8px -4px rgba(0, 0, 0, 0.08)',
                
                // Inner shadows for depth
                'inner-sm': 'inset 0 1px 2px rgba(0, 0, 0, 0.05)',
                'inner': 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in',
                'slide-up': 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                'slide-down': 'slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                'scale-in': 'scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                'shimmer': 'shimmer 1.5s infinite',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                shimmer: {
                    '100%': { transform: 'translateX(100%)' },
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'gradient-mesh': `
          radial-gradient(at 0% 0%, rgba(16, 185, 129, 0.15) 0px, transparent 50%),
          radial-gradient(at 100% 0%, rgba(59, 130, 246, 0.15) 0px, transparent 50%),
          radial-gradient(at 100% 100%, rgba(245, 158, 11, 0.1) 0px, transparent 50%),
          radial-gradient(at 0% 100%, rgba(16, 185, 129, 0.1) 0px, transparent 50%)
        `,
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
};

export default config;
