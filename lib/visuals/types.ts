/**
 * Visual System Types
 * 
 * Defines types for standardized visual components
 */

export interface CategoryHeroProps {
    category: string;
    title: string;
    description?: string;
    metrics?: {
        count?: number;
        rate?: number;
        [key: string]: any;
    };
}

export interface ExplainerDiagramProps {
    type: 'process' | 'comparison' | 'flow' | 'hierarchy' | 'timeline';
    title: string;
    data: any;
    steps?: Array<{
        number: number;
        title: string;
        description: string;
    }>;
}

export interface CalculatorVisualProps {
    calculatorType: string;
    inputData: any;
    resultData: any;
    showChart?: boolean;
    showTable?: boolean;
}

export interface VisualStyle {
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        text: string;
    };
    typography: {
        fontFamily: string;
        fontSize: {
            small: string;
            medium: string;
            large: string;
            xlarge: string;
        };
    };
    spacing: {
        small: number;
        medium: number;
        large: number;
    };
}

export const INSTITUTIONAL_VISUAL_STYLE: VisualStyle = {
    colors: {
        primary: '#10b981', // success-500
        secondary: '#0f766e', // primary-700
        accent: '#06b6d4', // cyan-500
        background: '#0f172a', // slate-900
        text: '#f1f5f9', // slate-100
    },
    typography: {
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: {
            small: '0.875rem',
            medium: '1rem',
            large: '1.25rem',
            xlarge: '1.5rem',
        },
    },
    spacing: {
        small: 8,
        medium: 16,
        large: 24,
    },
};

