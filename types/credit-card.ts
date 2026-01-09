export type CreditCardType = 'Cashback' | 'Rewards' | 'Travel' | 'Premium' | 'Shopping' | 'Fuel' | 'rewards' | 'cashback' | 'travel' | 'shopping' | 'premium' | 'lifetime_free';

export interface CreditCard {
    id: string;
    slug: string;
    name: string;
    bank: string;
    type: CreditCardType;
    description: string;

    annual_fee: string;
    joining_fee: string;
    min_income?: string;
    interest_rate?: string;

    rewards: string[];
    pros: string[];
    cons: string[];

    rating: number;
    image_url?: string;
    apply_link?: string;
}
