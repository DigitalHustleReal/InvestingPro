import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SpendingPatternPage from '@/components/credit-cards/SpendingPatternPage';
import { createClient } from '@/lib/supabase/server';

interface PageProps {
    params: Promise<{
        category: string;
        amount: string;
    }>;
}

// Map URL categories to spending input fields
const CATEGORY_MAP: Record<string, keyof { groceries: number; fuel: number; travel: number; onlineShopping: number; dining: number; utilities: number; other: number }> = {
    'groceries': 'groceries',
    'fuel': 'fuel',
    'travel': 'travel',
    'online-shopping': 'onlineShopping',
    'dining': 'dining',
    'utilities': 'utilities',
    'other': 'other'
};

const CATEGORY_LABELS: Record<string, string> = {
    'groceries': 'Groceries & Supermarkets',
    'fuel': 'Fuel & Petrol',
    'travel': 'Travel & Flights',
    'online-shopping': 'Online Shopping',
    'dining': 'Dining & Restaurants',
    'utilities': 'Utilities & Bills',
    'other': 'Other Expenses'
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { category, amount } = await params;
    const categoryLabel = CATEGORY_LABELS[category] || category;
    const amountNum = parseInt(amount) || 0;
    const formattedAmount = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amountNum);

    return {
        title: `Best Credit Cards for ${categoryLabel} - Spend ${formattedAmount}/Month | InvestingPro`,
        description: `Find the best credit cards if you spend ${formattedAmount}/month on ${categoryLabel.toLowerCase()}. Compare rewards, fees, and features. Apply instantly.`,
        openGraph: {
            title: `Best Credit Cards for ${categoryLabel} - ${formattedAmount}/Month`,
            description: `Get personalized credit card recommendations based on your ${categoryLabel.toLowerCase()} spending. Maximize your rewards.`,
        }
    };
}

export default async function SpendingPatternDetailPage({ params }: PageProps) {
    const { category, amount } = await params;
    
    if (!CATEGORY_MAP[category]) {
        notFound();
    }

    const amountNum = parseInt(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
        notFound();
    }

    const spendingField = CATEGORY_MAP[category];
    const categoryLabel = CATEGORY_LABELS[category] || category;

    // Fetch credit cards
    const supabase = await createClient();
    const { data: cards, error } = await supabase
        .from('credit_cards')
        .select('*')
        .eq('status', 'active')
        .order('rating', { ascending: false })
        .limit(50);

    if (error || !cards) {
        console.error('Error fetching credit cards:', error);
    }

    return (
        <SpendingPatternPage
            category={category}
            categoryLabel={categoryLabel}
            amount={amountNum}
            spendingField={spendingField}
            cards={cards || []}
        />
    );
}
