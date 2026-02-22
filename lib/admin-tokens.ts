export const adminTokens = {
  colors: {
    primary: 'var(--primary)',
    primaryDark: 'var(--primary-dark)',
    text: {
      primary: 'var(--text-primary)',
      secondary: 'var(--text-secondary)',
      tertiary: 'var(--text-tertiary)',
    },
    status: {
      success: 'var(--success)',
      warning: 'var(--warning)',
      error: 'var(--error)',
      info: 'var(--info)',
    },
    surface: {
      base: 'var(--surface)',
      hover: 'var(--surface-hover)',
      border: 'var(--border)',
    }
  },
  spacing: {
    px: '1px',
    '0': '0',
    '0.5': '0.125rem',
    '1': '0.25rem',
    '2': '0.5rem',
    '3': '0.75rem',
    '4': '1rem',
    '5': '1.25rem',
    '6': '1.5rem',
    '8': '2rem',
    '10': '2.5rem',
    '12': '3rem',
    '16': '4rem',
    '20': '5rem',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  },
  typography: {
    fontFamily: {
      sans: 'var(--font-inter)',
      heading: 'var(--font-outfit)',
    }
  }
} as const;

export type AdminTokens = typeof adminTokens;
