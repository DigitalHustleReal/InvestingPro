import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
}

export function formatPercentage(value: number) {
    return new Intl.NumberFormat('en-IN', {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 2,
    }).format(value / 100);
}

export function slugifyTerm(term: string): string {
    return term
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
        .replace(/^-+|-+$/g, '');     // Remove leading/trailing hyphens
}
export function formatCompactNumber(number: number): string {
    return Intl.NumberFormat('en-US', {
        notation: "compact",
        maximumFractionDigits: 1
    }).format(number);
}
