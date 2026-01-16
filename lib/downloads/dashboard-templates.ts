/**
 * Finance Dashboard Templates
 * Generates Excel, Google Sheets, and Notion templates for finance tracking
 */

export interface DashboardTemplate {
    name: string;
    description: string;
    category: 'portfolio' | 'expenses' | 'investments' | 'tax' | 'budget';
    format: 'excel' | 'google-sheets' | 'notion';
    columns: ColumnDefinition[];
    formulas?: FormulaDefinition[];
    sampleData?: any[];
}

export interface ColumnDefinition {
    name: string;
    type: 'text' | 'number' | 'date' | 'currency' | 'percentage' | 'formula';
    width?: number;
    format?: string;
}

export interface FormulaDefinition {
    cell: string;
    formula: string;
    description: string;
}

/**
 * Portfolio Tracking Dashboard
 */
export const PORTFOLIO_DASHBOARD: DashboardTemplate = {
    name: 'Investment Portfolio Tracker',
    description: 'Track all your investments in one place - stocks, mutual funds, ETFs, bonds',
    category: 'portfolio',
    format: 'excel',
    columns: [
        { name: 'Asset Name', type: 'text', width: 20 },
        { name: 'Type', type: 'text', width: 15 },
        { name: 'Purchase Date', type: 'date', width: 12 },
        { name: 'Quantity', type: 'number', width: 10 },
        { name: 'Purchase Price', type: 'currency', width: 15 },
        { name: 'Current Price', type: 'currency', width: 15 },
        { name: 'Total Invested', type: 'currency', width: 15 },
        { name: 'Current Value', type: 'formula', width: 15 },
        { name: 'Gain/Loss', type: 'formula', width: 15 },
        { name: 'Gain/Loss %', type: 'percentage', width: 12 }
    ],
    formulas: [
        {
            cell: 'H2',
            formula: '=D2*F2',
            description: 'Current Value = Quantity × Current Price'
        },
        {
            cell: 'I2',
            formula: '=H2-G2',
            description: 'Gain/Loss = Current Value - Total Invested'
        },
        {
            cell: 'J2',
            formula: '=(H2-G2)/G2*100',
            description: 'Gain/Loss % = (Gain/Loss / Total Invested) × 100'
        }
    ],
    sampleData: [
        ['HDFC Bank', 'Stock', '2024-01-15', 10, 1650, 1720, 16500, 17200, 700, 4.24],
        ['SBI Bluechip Fund', 'Mutual Fund', '2024-02-01', 500, 45.2, 48.5, 22600, 24250, 1650, 7.30]
    ]
};

/**
 * Expense Tracking Dashboard
 */
export const EXPENSE_DASHBOARD: DashboardTemplate = {
    name: 'Monthly Expense Tracker',
    description: 'Track your monthly expenses by category and stay within budget',
    category: 'expenses',
    format: 'excel',
    columns: [
        { name: 'Date', type: 'date', width: 12 },
        { name: 'Category', type: 'text', width: 20 },
        { name: 'Description', type: 'text', width: 30 },
        { name: 'Amount', type: 'currency', width: 15 },
        { name: 'Payment Method', type: 'text', width: 15 },
        { name: 'Budget', type: 'currency', width: 15 },
        { name: 'Remaining', type: 'formula', width: 15 }
    ],
    formulas: [
        {
            cell: 'G2',
            formula: '=F2-SUMIF($B:$B,B2,$D:$D)',
            description: 'Remaining Budget = Budget - Sum of expenses in category'
        }
    ],
    sampleData: [
        ['2024-01-05', 'Food & Dining', 'Grocery Shopping', 2500, 'Credit Card', 10000, 7500],
        ['2024-01-10', 'Transportation', 'Fuel', 2000, 'UPI', 5000, 3000]
    ]
};

/**
 * Tax Planning Dashboard
 */
export const TAX_DASHBOARD: DashboardTemplate = {
    name: 'Tax Planning & Savings Tracker',
    description: 'Track tax-saving investments and calculate your tax liability',
    category: 'tax',
    format: 'excel',
    columns: [
        { name: 'Investment Type', type: 'text', width: 25 },
        { name: 'Section', type: 'text', width: 10 },
        { name: 'Amount Invested', type: 'currency', width: 18 },
        { name: 'Tax Saved', type: 'formula', width: 15 },
        { name: 'Lock-in Period', type: 'text', width: 12 },
        { name: 'Maturity Date', type: 'date', width: 12 }
    ],
    formulas: [
        {
            cell: 'D2',
            formula: '=IF(B2="80C",C2*0.3,IF(B2="80D",C2*0.3,IF(B2="24B",C2*0.2,0)))',
            description: 'Tax Saved = Amount × Tax Rate (based on section)'
        }
    ],
    sampleData: [
        ['ELSS Mutual Fund', '80C', 150000, 45000, '3 years', '2027-01-15'],
        ['Health Insurance', '80D', 25000, 7500, '1 year', '2025-01-15'],
        ['Home Loan Principal', '80C', 100000, 30000, 'N/A', 'N/A']
    ]
};

/**
 * Budget Planning Dashboard
 */
export const BUDGET_DASHBOARD: DashboardTemplate = {
    name: 'Annual Budget Planner',
    description: 'Plan your annual budget and track spending across categories',
    category: 'budget',
    format: 'excel',
    columns: [
        { name: 'Category', type: 'text', width: 25 },
        { name: 'Monthly Budget', type: 'currency', width: 18 },
        { name: 'Annual Budget', type: 'formula', width: 18 },
        { name: 'Jan', type: 'currency', width: 12 },
        { name: 'Feb', type: 'currency', width: 12 },
        { name: 'Mar', type: 'currency', width: 12 },
        { name: 'Q1 Total', type: 'formula', width: 15 },
        { name: 'Q1 %', type: 'percentage', width: 12 }
    ],
    formulas: [
        {
            cell: 'C2',
            formula: '=B2*12',
            description: 'Annual Budget = Monthly Budget × 12'
        },
        {
            cell: 'G2',
            formula: '=D2+E2+F2',
            description: 'Q1 Total = Jan + Feb + Mar'
        },
        {
            cell: 'H2',
            formula: '=G2/C2*100',
            description: 'Q1 % = (Q1 Total / Annual Budget) × 100'
        }
    ]
};

/**
 * Get template by name
 */
export function getTemplate(name: string): DashboardTemplate | null {
    const templates = [
        PORTFOLIO_DASHBOARD,
        EXPENSE_DASHBOARD,
        TAX_DASHBOARD,
        BUDGET_DASHBOARD
    ];
    
    return templates.find(t => t.name === name) || null;
}

/**
 * Get all templates
 */
export function getAllTemplates(): DashboardTemplate[] {
    return [
        PORTFOLIO_DASHBOARD,
        EXPENSE_DASHBOARD,
        TAX_DASHBOARD,
        BUDGET_DASHBOARD
    ];
}
