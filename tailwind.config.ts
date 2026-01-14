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
                // Primary - Trust Teal (Growth + Stability)
                primary: {
                    50: '#f0fdfa',
                    100: '#ccfbf1',
                    200: '#99f6e4',
                    300: '#5eead4', // Soft
                    400: '#2dd4bf',
                    500: '#14b8a6', // Brand Base (Matches brand-theme.ts)
                    600: '#0d9488',
                    700: '#0f766e', // Strong
                    800: '#115e59',
                    900: '#134e4a',
                    950: '#042f2e',
                    DEFAULT: '#14b8a6', // ✅ Aligned to brand-theme primary
                },
                // Secondary - Info Sky (Trust & Authority - Matches brand-theme info)
                secondary: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9', // Brand Info Base
                    600: '#0284c7',
                    700: '#0369a1', // Info Strong
                    800: '#075985',
                    900: '#0c4a6e',
                    950: '#082f49',
                    DEFAULT: '#0ea5e9',
                },
                // Stone - Warm Neutrals (Professional)
                stone: {
                    50: '#FAFAF9',
                    100: '#F5F5F4',
                    200: '#E7E5E4',
                    300: '#D6D3D1',
                    400: '#A8A29E',
                    500: '#78716C',
                    600: '#57534E',
                    700: '#44403C',
                    800: '#292524',
                    900: '#1C1917',
                },
                // Accent - Amber Gold (Secondary CTAs)
                accent: {
                    50: '#fffbeb',
                    100: '#fef3c7',
                    200: '#fde68a',
                    300: '#fcd34d',
                    400: '#fbbf24',
                    500: '#f59e0b', // Brand Accent Base
                    600: '#d97706', // Accent Strong
                    700: '#b45309',
                    800: '#92400e',
                    900: '#78350f',
                    DEFAULT: '#f59e0b',
                },
                // Semantic Colors - Full scales for migrated tokens
                success: {
                    50: '#ecfdf5',
                    100: '#d1fae5',
                    200: '#a7f3d0',
                    300: '#6ee7b7',
                    400: '#34d399',
                    500: '#10b981', // Emerald - Gains, positive trends
                    600: '#059669',
                    700: '#047857',
                    800: '#065f46',
                    900: '#064e3b',
                    DEFAULT: '#10b981',
                },
                warning: {
                    50: '#fffbeb',
                    100: '#fef3c7',
                    200: '#fde68a',
                    300: '#fcd34d',
                    400: '#fbbf24',
                    500: '#f59e0b', // Amber
                    600: '#d97706',
                    700: '#b45309',
                    800: '#92400e',
                    900: '#78350f',
                    DEFAULT: '#f59e0b',
                },
                danger: {
                    50: '#fef2f2',
                    100: '#fee2e2',
                    200: '#fecaca',
                    300: '#fca5a5',
                    400: '#f87171',
                    500: '#ef4444', // Red - Losses, warnings
                    600: '#dc2626',
                    700: '#b91c1c',
                    800: '#991b1b',
                    900: '#7f1d1d',
                    DEFAULT: '#ef4444',
                },
                info: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9', // Sky - Matches Secondary
                    600: '#0284c7',
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e',
                    DEFAULT: '#0ea5e9',
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
                // Admin Glassmorphism Theme (Replaces hardcoded hex values)
                admin: {
                    // Base surfaces
                    'bg': '#0A0118',           // Main admin background (replaces #0A0118)
                    'surface': '#1A1128',      // Card backgrounds (replaces #1A1128)
                    'surface-hover': '#2D1B4E', // Hover state (replaces #2D1B4E)
                    
                    // Glass effects (use with backdrop-blur)
                    'glass': 'rgba(26, 17, 40, 0.8)',
                    'glass-border': 'rgba(139, 92, 246, 0.2)',
                    'glass-hover': 'rgba(45, 27, 78, 0.9)',
                    
                    // Text variants
                    'text': '#F8FAFC',
                    'text-muted': '#A78BFA',
                    'text-dim': '#6D5D8F',
                    
                    // Accent colors
                    'accent': '#8B5CF6',        // Primary violet
                    'accent-glow': '#A78BFA',   // Glow effect
                    'accent-strong': '#7C3AED', // Darker accent
                    
                    // Borders
                    'border': 'rgba(139, 92, 246, 0.3)',
                    'border-strong': 'rgba(139, 92, 246, 0.5)',
                    
                    // Input fields
                    'input': '#0F0A1A',
                    'input-focus': '#1A1128',
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
