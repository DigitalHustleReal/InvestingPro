export type FundCategory = 'Large Cap' | 'Mid Cap' | 'Small Cap' | 'Flexi Cap' | 'Multi Cap' | 'ELSS' | 'Index Fund' | 'Debt' | 'Hybrid';
export type RiskLevel = 'Low' | 'Moderate' | 'Moderately High' | 'High' | 'Very High';

export interface MutualFund {
    id: string;
    slug: string;
    name: string;
    fund_house: string;
    category: FundCategory;
    description?: string;

    nav: number;
    aum?: string;
    expense_ratio?: number;

    returns_1y?: number;
    returns_3y?: number;
    returns_5y?: number;

    rating?: number;
    risk?: RiskLevel;
    min_investment?: string;
    launch_date?: string;

    image_url?: string;
}
