/**
 * Indian Currency Formatting Utilities - Week 2, Task 2.5
 * Purpose: Format currency according to Indian numbering system (lakhs/crores)
 * Critical for fintech: ₹1,00,000 not ₹100,000
 */

/**
 * Format amount in Indian Rupee with lakhs/crores notation
 * 
 * @example
 * formatINR(100000) => "₹1,00,000"
 * formatINR(5000000) => "₹50,00,000"
 * formatINR(10000000) => "₹1,00,00,000"
 * formatINR(50000, { compact: true }) => "₹50K"
 * formatINR(5000000, { compact: true }) => "₹50L"
 * formatINR(50000000, { compact: true }) => "₹5Cr"
 */
export function formatINR(
  amount: number,
  options?: {
    compact?: boolean;
    decimals?: number;
    showSymbol?: boolean;
  }
): string {
  const { 
    compact = false, 
    decimals = 0,
    showSymbol = true 
  } = options || {};

  // Handle edge cases
  if (amount === 0) return showSymbol ? '₹0' : '0';
  if (isNaN(amount)) return showSymbol ? '₹--' : '--';

  const symbol = showSymbol ? '₹' : '';

  // Compact notation for UI cards and tight spaces
  if (compact) {
    const absAmount = Math.abs(amount);
    const sign = amount < 0 ? '-' : '';
    
    if (absAmount >= 10000000) {
      // Crores (1 Crore = 10,000,000)
      return `${sign}${symbol}${(absAmount / 10000000).toFixed(decimals === 0 ? 1 : decimals)}Cr`;
    }
    if (absAmount >= 100000) {
      // Lakhs (1 Lakh = 100,000)
      return `${sign}${symbol}${(absAmount / 100000).toFixed(decimals === 0 ? 1 : decimals)}L`;
    }
    if (absAmount >= 1000) {
      // Thousands
      return `${sign}${symbol}${(absAmount / 1000).toFixed(decimals === 0 ? 1 : decimals)}K`;
    }
    return `${sign}${symbol}${absAmount.toFixed(decimals)}`;
  }

  // Full Indian number system formatting (with commas in correct places)
  // Indian system: 12,34,56,789
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return formatter.format(amount);
}

/**
 * Format percentage with consistent decimal places
 * 
 * @example
 * formatPercentage(12.5) => "12.50%"
 * formatPercentage(7.892, 1) => "7.9%"
 */
export function formatPercentage(
  value: number,
  decimals: number = 2
): string {
  if (isNaN(value)) return '--%';
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format returns/gains with color indication
 * Returns object with formatted value, CSS color class, and icon
 * 
 * @example
 * formatGainLoss(5000) 
 * => { formatted: "₹5,000", color: "text-success-700", icon: "▲" }
 */
export function formatGainLoss(amount: number, options?: {
  compact?: boolean;
  decimals?: number;
  showSign?: boolean;
}): {
  formatted: string;
  color: string;
  icon: string;
  isPositive: boolean | null;
} {
  const { compact = false, decimals = 0, showSign = true } = options || {};
  
  if (isNaN(amount)) {
    return {
      formatted: '₹--',
      color: 'text-stone-600',
      icon: '',
      isPositive: null,
    };
  }

  const isPositive = amount > 0;
  const isNeutral = amount === 0;
  
  // Format the amount
  const absAmount = Math.abs(amount);
  let formatted = formatINR(absAmount, { compact, decimals, showSymbol: true });
  
  // Add sign if requested
  if (showSign && !isNeutral) {
    formatted = (isPositive ? '+' : '-') + formatted.replace('₹', '₹');
  }

  return {
    formatted,
    color: isPositive ? 'text-success-700' : isNeutral ? 'text-stone-900' : 'text-danger-700',
    icon: isPositive ? '▲' : isNeutral ? '' : '▼',
    isPositive: isNeutral ? null : isPositive,
  };
}

/**
 * Format interest rate (always 2 decimals for consistency)
 * 
 * @example
 * formatInterestRate(8.5) => "8.50% p.a."
 * formatInterestRate(12.75, false) => "12.75%"
 */
export function formatInterestRate(
  rate: number,
  showPerAnnum: boolean = true
): string {
  if (isNaN(rate)) return '--% p.a.';
  const formatted = formatPercentage(rate, 2);
  return showPerAnnum ? `${formatted} p.a.` : formatted;
}

/**
 * Format large numbers with Indian abbreviations
 * Useful for displaying stats, user counts, etc.
 * 
 * @example
 * formatLargeNumber(5432) => "5.4K"
 * formatLargeNumber(123456) => "1.2L"
 * formatLargeNumber(98765432) => "9.9Cr"
 */
export function formatLargeNumber(num: number): string {
  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';

  if (absNum >= 10000000) {
    return `${sign}${(absNum / 10000000).toFixed(1)}Cr`;
  }
  if (absNum >= 100000) {
    return `${sign}${(absNum / 100000).toFixed(1)}L`;
  }
  if (absNum >= 1000) {
    return `${sign}${(absNum / 1000).toFixed(1)}K`;
  }
  return `${sign}${absNum}`;
}

/**
 * Parse Indian formatted string back to number
 * 
 * @example
 * parseINR("₹1,00,000") => 100000
 * parseINR("₹50L") => 5000000
 * parseINR("₹2.5Cr") => 25000000
 */
export function parseINR(value: string): number {
  if (!value) return 0;

  // Remove currency symbol and spaces
  const cleaned = value.replace(/[₹\s,]/g, '');

  // Handle compact notation
  if (cleaned.includes('Cr')) {
    return parseFloat(cleaned.replace('Cr', '')) * 10000000;
  }
  if (cleaned.includes('L')) {
    return parseFloat(cleaned.replace('L', '')) * 100000;
  }
  if (cleaned.includes('K')) {
    return parseFloat(cleaned.replace('K', '')) * 1000;
  }

  return parseFloat(cleaned) || 0;
}

/**
 * Format currency for display in data tables (monospace font ready)
 * Right-aligned, fixed-width formatting
 */
export function formatTableCurrency(
  amount: number,
  options?: { decimals?: number }
): string {
  const { decimals = 0 } = options || {};
  return formatINR(amount, { compact: false, decimals });
}

/**
 * Format currency for compact card displays
 * Use abbreviations for better space utilization
 */
export function formatCardCurrency(
  amount: number,
  options?: { decimals?: number }
): string {
  const { decimals = 1 } = options || {};
  return formatINR(amount, { compact: true, decimals });
}

/**
 * Type guard to check if value is a valid currency amount
 */
export function isValidCurrency(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

/**
 * Format credit score (300-900 range)
 */
export function formatCreditScore(score: number): {
  formatted: string;
  color: string;
  rating: string;
} {
  if (score < 300 || score > 900 || isNaN(score)) {
    return {
      formatted: '--',
      color: 'text-stone-600',
      rating: 'N/A',
    };
  }

  let color: string;
  let rating: string;

  if (score >= 750) {
    color = 'text-success-700';
    rating = 'Excellent';
  } else if (score >= 700) {
    color = 'text-primary-600';
    rating = 'Good';
  } else if (score >= 650) {
    color = 'text-warning-600';
    rating = 'Fair';
  } else {
    color = 'text-danger-700';
    rating = 'Poor';
  }

  return {
    formatted: score.toString(),
    color,
    rating,
  };
}
