import { CreditCard, Loan, MutualFund } from "@/types";

export const CREDIT_CARDS: CreditCard[] = [
    {
        id: "cc_hdfc_regalia_gold",
        slug: "hdfc-regalia-gold",
        name: "HDFC Regalia Gold",
        provider: "HDFC Bank",
        category: "credit_card",
        type: "travel",
        rating: 4.8,
        reviewsCount: 1250,
        description: "One of India's most popular premium credit cards with excellent travel and milestone benefits.",
        applyLink: "#",
        isPopular: true,

        joiningFee: 2500,
        annualFee: 2500,
        annualFeeWaiverCondition: "Spend Rs. 4 Lakhs in a year",
        rewardRate: "4 Points per Rs. 150",
        welcomeOffer: "Complimentary Club Vistara Silver Membership + MMT Black Gold Membership",

        features: ["12 Complimentary Airport Lounge Access within India", "Priority Pass Membership", "gold-benefits"],
        pros: ["Excellent Milestone Benefits", "Low Foreign Currency Markup (2%)", "Complimentary Lounge Access"],
        cons: ["Reward redemption charges applicable", "High annual fee for beginners"],
        minIncome: "Rs. 1,00,000/month",
        loungeAccess: "12 Domestic + 6 International per year"
    },
    {
        id: "cc_sbi_cashback",
        slug: "sbi-cashback",
        name: "SBI Cashback Card",
        provider: "SBI Card",
        category: "credit_card",
        type: "cashback",
        rating: 4.6,
        reviewsCount: 890,
        description: "The best cashback card for online shopping with flat 5% rewards on almost all online spends.",
        applyLink: "#",
        isPopular: true,

        joiningFee: 999,
        annualFee: 999,
        annualFeeWaiverCondition: "Spend Rs. 2 Lakhs in a year",
        rewardRate: "5% Cashback on Online Spends",

        features: ["5% Cashback on Online", "1% Cashback on Offline", "Fuel Surcharge Waiver"],
        pros: ["High cashback rate", "No merchant restrictions (unlike co-branded cards)", "Auto-credit of cashback"],
        cons: ["No lounge access", "Capped at Rs. 5000 cashback per month"],
        minIncome: "Rs. 25,000/month",
        loungeAccess: "None"
    },
    {
        id: "cc_axis_ace",
        slug: "axis-ace",
        name: "Axis Ace Credit Card",
        provider: "Axis Bank",
        category: "credit_card",
        type: "cashback",
        rating: 4.5,
        reviewsCount: 2100,
        description: "Best entry-level cashback card with 2% flat cashback on all offline spends and 5% on Bill Payments.",
        applyLink: "#",

        joiningFee: 499,
        annualFee: 499,
        annualFeeWaiverCondition: "Spend Rs. 2 Lakhs in a year",
        rewardRate: "2% Unlimited Cashback",

        features: ["5% Cashback on GPay Bill Payments", "4 Complimentary Lounge Visits", "1% Fuel Surcharge Waiver"],
        pros: ["Unlimited 2% Cashback on offline spends", "Low Annual Fee", "Complementary Lounge Access"],
        cons: ["Devaluation in GPay cashback cap", "Invite only in some periods"],
        minIncome: "Rs. 25,000/month",
        loungeAccess: "4 Domestic / year"
    }
];

export const LOANS: Loan[] = [
    {
        id: "loan_hdfc_personal",
        slug: "hdfc-personal-loan",
        name: "HDFC Personal Loan",
        provider: "HDFC Bank",
        category: "loan",
        loanType: "personal",
        rating: 4.5,
        reviewsCount: 3000,
        description: "Quick personal loans with disbursement in 10 seconds for pre-approved customers.",
        applyLink: "#",

        interestRateMin: 10.50,
        interestRateMax: 21.00,
        interestRateType: "fixed",
        processingFee: "Up to Rs. 4999 + GST",
        maxTenureMonths: 60,
        maxAmount: "Up to 40 Lakhs",

        minSalary: 25000,
        minAge: 21,
        isPopular: true
    },
    {
        id: "loan_sbi_home",
        slug: "sbi-home-loan",
        name: "SBI Regular Home Loan",
        provider: "SBI",
        category: "loan",
        loanType: "home",
        rating: 4.7,
        reviewsCount: 5000,
        description: "Most trusted home loan with low interest rates and zero hidden charges.",
        applyLink: "#",

        interestRateMin: 8.50,
        interestRateMax: 9.65,
        interestRateType: "floating",
        processingFee: "0.35% of Loan Amount",
        maxTenureMonths: 360,
        maxAmount: "No Upper Limit",

        minSalary: 15000,
        minAge: 18,
        isPopular: true
    }
];

export const MUTUAL_FUNDS: MutualFund[] = [
    {
        id: "mf_quant_small",
        slug: "quant-small-cap",
        name: "Quant Small Cap Fund",
        provider: "Quant Mutual Fund",
        category: "mutual_fund",
        rating: 5,
        reviewsCount: 450,
        description: "High growth small cap fund known for its agile and data-driven investment approach.",
        applyLink: "#",
        isPopular: true,

        fundCategory: "equity",
        subCategory: "Small Cap",
        riskLevel: "very_high",

        returns1Y: 45.2,
        returns3Y: 32.5,
        returns5Y: 28.1,

        expenseRatio: 0.75,
        aum: "15,000 Cr",
        manager: "Sanjeev Sharma"
    },
    {
        id: "mf_ppfas",
        slug: "parag-parikh-flexi-cap",
        name: "Parag Parikh Flexi Cap Fund",
        provider: "PPFAS Mutual Fund",
        category: "mutual_fund",
        rating: 5,
        reviewsCount: 1500,
        description: "India's most popular flexi-cap fund with international equity exposure.",
        applyLink: "#",
        isPopular: true,

        fundCategory: "equity",
        subCategory: "Flexi Cap",
        riskLevel: "high",

        returns1Y: 38.5,
        returns3Y: 22.1,
        returns5Y: 24.5,

        expenseRatio: 0.65,
        aum: "55,000 Cr",
        manager: "Rajeev Thakkar"
    }
];

export const BROKERS = [
    {
        id: "broker_zerodha",
        name: "Zerodha",
        logo: "Z",
        color: "from-blue-600 to-blue-700",
        tagline: "India's Largest Stockbroker",
        rating: 4.8,
        reviews: "12,456",
        users: "1+ Crore",
        pricing: {
            equity: "₹0 (Delivery)",
            intraday: "₹20 or 0.03%",
            futures: "₹20 flat",
            options: "₹20 flat",
            accountOpening: "₹200 (One-time)",
            amc: "₹300/year"
        },
        pros: [
            "Zero brokerage on equity delivery",
            "Kite - Industry leading platform",
            "Direct mutual funds via Coin",
            "Extensive education (Varsity)"
        ],
        cons: [
            "No equity research reports",
            "Slightly higher AMC than discounters"
        ],
        bestFor: "Active traders & Long-term investors",
        featured: true
    },
    {
        id: "broker_groww",
        name: "Groww",
        logo: "G",
        color: "from-emerald-500 to-teal-600",
        tagline: "Simple Investing for Everyone",
        rating: 4.6,
        reviews: "8,234",
        users: "80+ Lakhs",
        pricing: {
            equity: "₹0 (Delivery)",
            intraday: "₹20 or 0.05%",
            futures: "₹20 flat",
            options: "₹20 flat",
            accountOpening: "₹0 (Free)",
            amc: "₹0 (Free)"
        },
        pros: [
            "Completely free account opening",
            "Superior minimal & clean UI",
            "One-tap US Stocks & Mutual Funds",
            "Zero AMC for lifetime"
        ],
        cons: [
            "Limited technical charting tools",
            "No flagship desktop terminal"
        ],
        bestFor: "Beginners & Passive investors",
        featured: true
    }
];

export const FD_RATES = [
    {
        id: "fd_sbi",
        bank: "SBI",
        type: "PSU Bank",
        logo: "S",
        color: "from-blue-600 to-blue-700",
        rates: {
            "1 Year": 6.80,
            "2 Years": 7.00,
            "3 Years": 7.00,
            "5 Years": 6.50,
        },
        seniorCitizenBonus: 0.50,
        minDeposit: "₹1,000",
        featured: true
    },
    {
        id: "fd_hdfc",
        bank: "HDFC Bank",
        type: "Private Bank",
        logo: "H",
        color: "from-blue-800 to-red-900",
        rates: {
            "1 Year": 6.60,
            "2 Years": 7.00,
            "3 Years": 7.00,
            "5 Years": 7.00,
        },
        seniorCitizenBonus: 0.50,
        minDeposit: "₹5,000",
        featured: true
    }
];

export const INSURANCE_PLANS = [
    {
        name: "HDFC Click 2 Protect Life",
        company: "HDFC Life",
        type: "Term Life",
        logo: "H",
        color: "from-blue-600 to-blue-800",
        premium: "₹599/mo",
        coverage: "₹1 Cr",
        rating: 4.8,
        claimRatio: "99.07%",
        features: ["Life Cover till 85", "Critical Illness", "Accidental Death Benefit", "Income Benefit"],
        bestFor: "Comprehensive Protection"
    },
    {
        name: "ICICI Pru iProtect Smart",
        company: "ICICI Prudential",
        type: "Term Life",
        logo: "I",
        color: "from-orange-600 to-red-700",
        premium: "₹625/mo",
        coverage: "₹1 Cr",
        rating: 4.7,
        claimRatio: "97.90%",
        features: ["Special Exit Benefit", "Terminal Illness", "36 Critical Illnesses", "Premium Waiver"],
        bestFor: "Critical Illness Coverage"
    },
    {
        name: "Max Life Smart Term Plan",
        company: "Max Life",
        type: "Term Life",
        logo: "M",
        color: "from-blue-500 to-sky-600",
        premium: "₹580/mo",
        coverage: "₹1 Cr",
        rating: 4.6,
        claimRatio: "99.51%",
        features: ["100% Payout", "Life Stage Benefit", "Premium Refund", "Disability Cover"],
        bestFor: "Highest Claim Settlement"
    },
    {
        name: "HDFC Ergo Optima Restore",
        company: "HDFC Ergo",
        type: "Health",
        logo: "HE",
        color: "from-blue-600 to-cyan-700",
        premium: "₹12,500/yr",
        coverage: "₹5 L",
        rating: 4.7,
        claimRatio: "95.2%",
        features: ["Restore Benefit", "No Room Rent Limit", "10,000+ Hospitals", "AYUSH Cover"],
        bestFor: "Family Health Insurance"
    },
    {
        name: "Care Health Insurance",
        company: "Care Health",
        type: "Health",
        logo: "C",
        color: "bg-emerald-600",
        premium: "₹9,800/yr",
        coverage: "₹5 L",
        rating: 4.5,
        claimRatio: "90.1%",
        features: ["Cumulative Bonus", "Day Care Procedures", "No Claim Bonus", "Pre/Post Hospitalization"],
        bestFor: "Budget Health Cover"
    },
    {
        name: "HDFC Ergo Car Insurance",
        company: "HDFC Ergo",
        type: "Car",
        logo: "HE",
        color: "bg-indigo-600",
        premium: "₹4,500/yr",
        coverage: "IDV Based",
        rating: 4.6,
        claimRatio: "94.8%",
        features: ["Zero Depreciation", "24x7 Roadside Assistance", "Cashless Claims", "NCB Protection"],
        bestFor: "Comprehensive Car Cover"
    }
];

export const IPO_DATA = [
    { name: "FirstCry (Brainbees)", status: "Closing Today", price: "₹440 - ₹465", lot: "32 Shares", listing: "Aug 13, 2024", subscription: "12.4x", color: "bg-blue-600" },
    { name: "Ola Electric", status: "Upcoming", price: "₹72 - ₹76", lot: "195 Shares", listing: "Aug 09, 2024", subscription: "N/A", color: "bg-emerald-500" },
    { name: "Unicommerce eSolutions", status: "Open", price: "₹102 - ₹108", lot: "138 Shares", listing: "Aug 14, 2024", subscription: "2.1x", color: "bg-indigo-600" },
];

export const PORTFOLIO_MOCK = [
    {
        id: "p1",
        asset_name: "Reliance Industries",
        symbol: "RELIANCE",
        asset_type: "Equity",
        quantity: 10,
        average_price: 2450.00,
        current_price: 2980.50,
        user_email: "demo@investingpro.in"
    },
    {
        id: "p2",
        asset_name: "Parag Parikh Flexi Cap",
        symbol: "PPFAS",
        asset_type: "Mutual Fund",
        quantity: 500,
        average_price: 52.30,
        current_price: 68.45,
        user_email: "demo@investingpro.in"
    },
    {
        id: "p3",
        asset_name: "HDFC Bank",
        symbol: "HDFCBANK",
        asset_type: "Equity",
        quantity: 50,
        average_price: 1620.00,
        current_price: 1540.20,
        user_email: "demo@investingpro.in"
    }
];
