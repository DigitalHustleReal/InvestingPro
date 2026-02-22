import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: 'class',
    theme: {
        // LOCK DOWN COLORS - Override defaults
        colors: {
            // Primitive Colors (Restricted)
            white: '#ffffff',
            black: '#000000',
            transparent: 'transparent',
            current: 'currentColor',
            
            // Public Site Neutral (Slate) - Used everywhere
            slate: {
                50: '#F8FAFC',
                100: '#F1F5F9',
                200: '#E2E8F0',
                300: '#CBD5E1',
                400: '#94A3B8',
                500: '#64748B',
                600: '#475569',
                700: '#334155',
                800: '#1E293B',
                900: '#0F172A',
                950: '#020617',
            },
            // Alias gray to slate for compatibility
            gray: {
                50: '#F8FAFC',
                100: '#F1F5F9',
                200: '#E2E8F0',
                300: '#CBD5E1',
                400: '#94A3B8',
                500: '#64748B',
                600: '#475569',
                700: '#334155',
                800: '#1E293B',
                900: '#0F172A', // slate-900
                950: '#020617',
            },
            
            // Brand Colors (SaaS Theme)
            sky: {
                50: '#f0f9ff',
                100: '#e0f2fe',
                200: '#bae6fd',
                300: '#7dd3fc',
                400: '#38bdf8',
                500: '#0ea5e9',
                600: '#0284c7',
                700: '#0369a1',
                800: '#075985',
                900: '#0c4a6e',
                950: '#082f49',
            },
            
            // Admin Theme - SEMANTIC & SAFE
            background: {
                primary: '#0F172A',     // slate-900 (Main BG)
                secondary: '#1E293B',   // slate-800 (Cards/Panels)
                tertiary: '#334155',    // slate-700 (Hovers)
                page: '#fafaf9',        // stone-50 (Public Light BG)
            },
            
            surface: {
                DEFAULT: 'rgba(30, 41, 59, 0.5)',  // slate-800/50
                hover: 'rgba(51, 65, 85, 0.3)',    // slate-700/30
                card: '#ffffff',                   // Public/Light Card
                dark: '#1E293B',                   // slate-800 (Panel) - Matches background.secondary
                darker: '#0F172A',                 // slate-900 (Input/Deeper) - Matches background.primary
                darkest: '#020617',                // slate-950 (Body/Deepest)
            },
            
            text: {
                primary: '#F1F5F9',     // slate-100 (10.5:1 on slate-900)
                secondary: '#CBD5E1',   // slate-300 (4.8:1 on slate-900)
                tertiary: '#E2E8F0',    // slate-200 (7.1:1 on slate-900)
                disabled: '#94A3B8',    // slate-400 (Only for disabled)
                inverse: '#0F172A',     // Dark text for light backgrounds
                muted: '#64748B',       // slate-500
            },
            
            border: {
                DEFAULT: 'rgba(255, 255, 255, 0.1)',
                strong: 'rgba(255, 255, 255, 0.2)',
                subtle: 'rgba(255, 255, 255, 0.05)',
                light: '#E2E8F0',       // slate-200 (Light mode border)
            },
            
            // Functional Colors
            primary: {
                DEFAULT: '#14B8A6',     // teal-500
                hover: '#0D9488',       // teal-600
                light: '#2DD4BF',       // teal-400
                // Legacy support (will be removed later, kept for build safety)
                50: '#F0FDFB',
                100: '#CCFBF1',
                200: '#99F6E4',
                300: '#5EEAD4',
                400: '#2DD4BF',
                500: '#14B8A6',
                600: '#0D9488',
                700: '#0F766E',
                800: '#115E59',
                900: '#134E4A',
            },
            
            secondary: {
                DEFAULT: '#1E293B',     // slate-800
                hover: '#334155',       // slate-700
                // Legacy support
                500: '#1B5E99',
                600: '#0F66CC',
            },
            
            success: {
                DEFAULT: '#22C55E',     // green-500
                light: '#4ADE80',       // green-400
                dark: '#16A34A',        // green-600
                500: '#22C55E',         // Legacy
                600: '#16A34A',
            },
            
            warning: {
                DEFAULT: '#F59E0B',     // amber-500
                light: '#FBBF24',       // amber-400
                dark: '#D97706',        // amber-600
                500: '#F59E0B',
            },
            
            error: {
                DEFAULT: '#EF4444',     // red-500
                light: '#F87171',       // red-400
                dark: '#DC2626',        // red-600
                500: '#EF4444',
            },
            
            info: {
                DEFAULT: '#3B82F6',     // blue-500
                light: '#60A5FA',       // blue-400
                dark: '#2563EB',        // blue-600
                500: '#3B82F6',
            },

            // Legacy Brands (Keep until fully refactored, but restricted)
            wt: {
                nav: 'hsl(var(--wt-nav))',
                gold: 'hsl(var(--wt-gold))',
                'gold-hover': 'hsl(var(--wt-gold-hover))',
            }
        },
        extend: {
            // Keep font/spacing/shadow extensions
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
                '0.5': '4px',
                '1.5': '12px',
                '6': '48px',
                '12': '96px',
                '18': '4.5rem',
                '20': '160px',
                '24': '192px',
                '88': '22rem',
                '128': '32rem',
            },
            borderRadius: {
                'sm': '4px',
                'base': '8px',
                'md': '0.75rem',
                'lg': '12px',
                'xl': '16px',
                '2xl': '2rem',
                '3xl': '3rem',
            },
            boxShadow: {
                'xs': '0 1px 2px rgba(0, 0, 0, 0.05)',
                'sm': '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.05)',
                'base': '0 4px 12px 0 rgb(0 0 0 / 0.08)',
                'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                'lg': '0 10px 20px -3px rgb(0 0 0 / 0.12), 0 4px 6px -4px rgb(0 0 0 / 0.08)',
                'xl': '0 20px 40px -5px rgb(0 0 0 / 0.15), 0 8px 16px -8px rgb(0 0 0 / 0.1)',
                '2xl': '0 30px 60px -12px rgb(0 0 0 / 0.2), 0 12px 24px -12px rgb(0 0 0 / 0.15)',
                'primary': '0 4px 12px rgba(20, 184, 166, 0.15)',
                'primary-lg': '0 8px 24px rgba(20, 184, 166, 0.25)',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in',
                'slide-up': 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                'slide-down': 'slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                'scale-in': 'scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                'shimmer': 'shimmer 1.5s infinite',
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
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
};

export default config;
