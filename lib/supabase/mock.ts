import { Product, MutualFund, CreditCard, Loan } from "@/types";
import { MUTUAL_FUNDS, CREDIT_CARDS, LOANS } from "@/lib/data";

// This is a MOCK service to simulate Supabase data using our central mock data library.
// This allows us to build the UI without blocking on backend setup.

export async function getMutualFunds(): Promise<MutualFund[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return MUTUAL_FUNDS;
}

export async function getMutualFundById(id: string): Promise<MutualFund | undefined> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return MUTUAL_FUNDS.find(mf => mf.id === id);
}

export async function getCreditCards(): Promise<CreditCard[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return CREDIT_CARDS;
}

export async function getLoans(): Promise<Loan[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return LOANS;
}
