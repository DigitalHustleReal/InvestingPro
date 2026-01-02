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
                // Primary - Deep Forest Teal (Fintech-optimized)
                primary: {
                    50: '#F0FDFA',
                    100: '#CCFBF1',
                    200: '#99F6E4',
                    300: '#5EEAD4',
                    400: '#2DD4BF',
                    500: '#14B8A6',   // Standard teal
                    600: '#0A5F56',   // MAIN BRAND COLOR - Deep forest teal
                    700: '#0F766E',   // Hover states
                    800: '#115E59',
                    900: '#134E4A',   // Text on light backgrounds
                },
                // Stone - Warm Neutrals (Professional, not cold)
                stone: {
                    50: '#FAFAF9',    // Page background
                    100: '#F5F5F4',   // Card alternate backgrounds
                    200: '#E7E5E4',   // Borders, dividers
                    300: '#D6D3D1',   // Disabled states
                    400: '#A8A29E',   // Placeholder text
                    500: '#78716C',   // Icons
                    600: '#57534E',   // Secondary text, labels
                    700: '#44403C',   // Tertiary text
                    800: '#292524',   // Dark text
                    900: '#1C1917',   // Primary text, headings
                },
                // Accent - Amber Gold (Secondary CTAs, premium features)
                accent: {
                    50: '#FFFBEB',
                    100: '#FEF3C7',
                    200: '#FDE68A',
                    300: '#FCD34D',
                    400: '#FBBF24',
                    500: '#D97706',   // Main accent color
                    600: '#B45309',   // Hover state
                    700: '#92400E',
                    800: '#78350F',
                    900: '#78350F',
                },
                // Semantic - Financial Data Colors
                success: {
                    50: '#ECFDF5',
                    500: '#10B981',
                    700: '#047857',   // Gains, positive, verified
                },
                warning: {
                    50: '#FFFBEB',
                    500: '#F59E0B',
                    700: '#B45309',   // Caution, review required
                },
                danger: {
                    50: '#FEF2F2',
                    500: '#EF4444',
                    700: '#B91C1C',   // Losses, errors, high risk
                },
                info: {
                    50: '#EFF6FF',
                    500: '#3B82F6',
                    800: '#1E40AF',   // Informational, help text
                },
                // Dark Theme (Keep for future)
                dark: {
                    bg: '#0B1221',
                    surface: '#111827',
                    border: '#1f2937',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
                serif: ['Source Serif 4', 'Georgia', 'serif'],
                mono: ['JetBrains Mono', 'Courier New', 'monospace'],
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
                'sm': '0 1px 3px 0 rgb(0 0 0 / 0.08)',
                'base': '0 4px 12px 0 rgb(0 0 0 / 0.08)',
                'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                'lg': '0 8px 24px -3px rgb(0 0 0 / 0.12)',
                'xl': '0 16px 48px -5px rgb(0 0 0 / 0.16)',
                '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
                'primary': '0 4px 12px rgba(10, 95, 86, 0.15)',      // Teal brand shadow
                'primary-lg': '0 8px 20px rgba(10, 95, 86, 0.25)',  // Teal brand shadow (hover)
                'accent': '0 4px 12px rgba(217, 119, 6, 0.15)',     // Amber accent shadow
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
