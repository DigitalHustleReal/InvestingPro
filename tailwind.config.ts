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
            
            // Brand Colors — Forest Green (trust, money, growth)
            green: {
                50: '#F0FDF4',
                100: '#DCFCE7',
                200: '#BBF7D0',
                300: '#86EFAC',
                400: '#4ADE80',
                500: '#22C55E',
                600: '#16A34A',
                700: '#15803D',
                800: '#166534',
                900: '#14532D',
                950: '#052E16',
            },

            // Amber/Gold — Indian identity, premium signals
            amber: {
                50: '#FFFBEB',
                100: '#FEF3C7',
                200: '#FDE68A',
                300: '#FCD34D',
                400: '#FBBF24',
                500: '#F59E0B',
                600: '#D97706',
                700: '#B45309',
                800: '#92400E',
                900: '#78350F',
                950: '#451A03',
            },
            
            // Semantic surface tokens — CSS variable mapped (shadcn/ui pattern)
            background: 'hsl(var(--background))',
            foreground: 'hsl(var(--foreground))',

            card: {
                DEFAULT: 'hsl(var(--card))',
                foreground: 'hsl(var(--card-foreground))',
            },

            popover: {
                DEFAULT: 'hsl(var(--popover))',
                foreground: 'hsl(var(--popover-foreground))',
            },

            muted: {
                DEFAULT: 'hsl(var(--muted))',
                foreground: 'hsl(var(--muted-foreground))',
            },

            accent: {
                DEFAULT: 'hsl(var(--accent))',
                foreground: 'hsl(var(--accent-foreground))',
                pale: 'hsl(var(--accent-pale))',
            },

            destructive: {
                DEFAULT: 'hsl(var(--destructive))',
                foreground: 'hsl(var(--destructive-foreground))',
            },

            input: 'hsl(var(--input))',
            ring: 'hsl(var(--ring))',

            // Admin Theme surface aliases (kept for backward compat)
            surface: {
                DEFAULT: 'rgba(30, 41, 59, 0.5)',
                hover: 'rgba(51, 65, 85, 0.3)',
                card: '#ffffff',
                dark: '#1E293B',
                darker: '#0F172A',
                darkest: '#020617',
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
                DEFAULT: 'hsl(var(--border))',
                strong: 'rgba(255, 255, 255, 0.2)',
                subtle: 'rgba(255, 255, 255, 0.05)',
                light: '#E2E8F0',       // slate-200 (Light mode border)
            },
            
            // Functional Colors — primary aligned to CSS variable --primary (Forest Green)
            primary: {
                DEFAULT: 'hsl(var(--primary))',
                foreground: 'hsl(var(--primary-foreground))',
                hover: '#15803D',       // green-700
                light: '#16A34A',       // green-600 (Emerald — CTAs)
                pale: '#DCFCE7',        // green-100 (badge bg)
                50: '#F0FDF4',
                100: '#DCFCE7',
                200: '#BBF7D0',
                300: '#86EFAC',
                400: '#4ADE80',
                500: '#22C55E',
                600: '#16A34A',
                700: '#15803D',
                800: '#166534',
                900: '#14532D',
            },
            
            secondary: {
                DEFAULT: 'hsl(var(--secondary))',
                foreground: 'hsl(var(--secondary-foreground))',
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
            },

            // ----------------------------------------------------------------
            // MISSING COLOR SCALES — restored so existing classes render
            // These were stripped when theme.colors was locked down.
            // Migrate usages to semantic tokens (primary/success/error/info)
            // incrementally — do NOT add new usages of these raw scales.
            // ----------------------------------------------------------------
            red: {
                50: '#FEF2F2', 100: '#FEE2E2', 200: '#FECACA', 300: '#FCA5A5',
                400: '#F87171', 500: '#EF4444', 600: '#DC2626', 700: '#B91C1C',
                800: '#991B1B', 900: '#7F1D1D', 950: '#450A0A',
            },
            blue: {
                50: '#EFF6FF', 100: '#DBEAFE', 200: '#BFDBFE', 300: '#93C5FD',
                400: '#60A5FA', 500: '#3B82F6', 600: '#2563EB', 700: '#1D4ED8',
                800: '#1E40AF', 900: '#1E3A8A', 950: '#172554',
            },
            emerald: {
                50: '#ECFDF5', 100: '#D1FAE5', 200: '#A7F3D0', 300: '#6EE7B7',
                400: '#34D399', 500: '#10B981', 600: '#059669', 700: '#047857',
                800: '#065F46', 900: '#064E3B', 950: '#022C22',
            },
            purple: {
                50: '#FAF5FF', 100: '#F3E8FF', 200: '#E9D5FF', 300: '#D8B4FE',
                400: '#C084FC', 500: '#A855F7', 600: '#9333EA', 700: '#7E22CE',
                800: '#6B21A8', 900: '#581C87', 950: '#3B0764',
            },
            indigo: {
                50: '#EEF2FF', 100: '#E0E7FF', 200: '#C7D2FE', 300: '#A5B4FC',
                400: '#818CF8', 500: '#6366F1', 600: '#4F46E5', 700: '#4338CA',
                800: '#3730A3', 900: '#312E81', 950: '#1E1B4B',
            },
            rose: {
                50: '#FFF1F2', 100: '#FFE4E6', 200: '#FECDD3', 300: '#FDA4AF',
                400: '#FB7185', 500: '#F43F5E', 600: '#E11D48', 700: '#BE123C',
                800: '#9F1239', 900: '#881337', 950: '#4C0519',
            },
            orange: {
                50: '#FFF7ED', 100: '#FFEDD5', 200: '#FED7AA', 300: '#FDBA74',
                400: '#FB923C', 500: '#F97316', 600: '#EA580C', 700: '#C2410C',
                800: '#9A3412', 900: '#7C2D12', 950: '#431407',
            },
            yellow: {
                50: '#FEFCE8', 100: '#FEF9C3', 200: '#FEF08A', 300: '#FDE047',
                400: '#FACC15', 500: '#EAB308', 600: '#CA8A04', 700: '#A16207',
                800: '#854D0E', 900: '#713F12', 950: '#422006',
            },
            pink: {
                50: '#FDF2F8', 100: '#FCE7F3', 200: '#FBCFE8', 300: '#F9A8D4',
                400: '#F472B6', 500: '#EC4899', 600: '#DB2777', 700: '#BE185D',
                800: '#9D174D', 900: '#831843', 950: '#500724',
            },
            violet: {
                50: '#F5F3FF', 100: '#EDE9FE', 200: '#DDD6FE', 300: '#C4B5FD',
                400: '#A78BFA', 500: '#8B5CF6', 600: '#7C3AED', 700: '#6D28D9',
                800: '#5B21B6', 900: '#4C1D95', 950: '#2E1065',
            },
            cyan: {
                50: '#ECFEFF', 100: '#CFFAFE', 200: '#A5F3FC', 300: '#67E8F9',
                400: '#22D3EE', 500: '#06B6D4', 600: '#0891B2', 700: '#0E7490',
                800: '#155E75', 900: '#164E63', 950: '#083344',
            },
            teal: {
                50: '#F0FDFA', 100: '#CCFBF1', 200: '#99F6E4', 300: '#5EEAD4',
                400: '#2DD4BF', 500: '#14B8A6', 600: '#0D9488', 700: '#0F766E',
                800: '#115E59', 900: '#134E4A', 950: '#042F2E',
            },
            sky: {
                50: '#F0F9FF', 100: '#E0F2FE', 200: '#BAE6FD', 300: '#7DD3FC',
                400: '#38BDF8', 500: '#0EA5E9', 600: '#0284C7', 700: '#0369A1',
                800: '#075985', 900: '#0C4A6E', 950: '#082F49',
            },
            lime: {
                50: '#F7FEE7', 100: '#ECFCCB', 200: '#D9F99D', 300: '#BEF264',
                400: '#A3E635', 500: '#84CC16', 600: '#65A30D', 700: '#4D7C0F',
                800: '#3F6212', 900: '#365314', 950: '#1A2E05',
            },
            fuchsia: {
                50: '#FDF4FF', 100: '#FAE8FF', 200: '#F5D0FE', 300: '#F0ABFC',
                400: '#E879F9', 500: '#D946EF', 600: '#C026D3', 700: '#A21CAF',
                800: '#86198F', 900: '#701A75', 950: '#4A044E',
            },
        },
        extend: {
        extend: {
            // Keep font/spacing/shadow extensions
            fontFamily: {
                sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
                heading: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
                display: ['var(--font-outfit)', 'system-ui', 'sans-serif'], // alias — 104 files use font-display
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
                '18': '4.5rem',
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
                'primary': '0 4px 12px rgba(22, 101, 52, 0.15)',
                'primary-lg': '0 8px 24px rgba(22, 101, 52, 0.25)',
                'green-glow': '0 0 20px rgba(22, 163, 74, 0.3)',
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
