import { LucideIcon, Plane, Utensils, Fuel, CreditCard, RefreshCw, DollarSign, ShoppingCart, Briefcase, Crown, GraduationCap, Home, School, Wallet, TrendingUp, Car, Gem, Palmtree, FileText, Rocket, BarChart3, Scale, Droplet } from 'lucide-react';

export interface BadgeConfig {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
}

export const BEST_FOR_CATEGORIES: Record<string, BadgeConfig> = {
  'travel-rewards': {
    id: 'travel-rewards',
    label: 'Best for Travel Rewards',
    icon: Plane,
    color: 'text-primary-700',
    bgColor: 'bg-primary-50',
    borderColor: 'border-primary-200',
    description: '10+ lounge visits/year, air miles, travel insurance'
  },
  'cashback-dining': {
    id: 'cashback-dining',
    label: 'Best for Dining & Food',
    icon: Utensils,
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    description: '12% cashback on restaurants & food delivery'
  },
  'fuel-savings': {
    id: 'fuel-savings',
    label: 'Best for Fuel Savings',
    icon: Fuel,
    color: 'text-success-700',
    bgColor: 'bg-success-50',
    borderColor: 'border-green-200',
    description: 'Fuel surcharge waiver, toll cashback'
  },
  'zero-fees': {
    id: 'zero-fees',
    label: 'Zero Annual Fee',
    icon: CreditCard,
    color: 'text-primary-700',
    bgColor: 'bg-primary-50',
    borderColor: 'border-primary-200',
    description: 'No joining fee, no annual fee, lifetime free'
  },
  'balance-transfer': {
    id: 'balance-transfer',
    label: 'Best for Balance Transfer',
    icon: RefreshCw,
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    description: 'Low APR, 0% intro rates on transfers'
  },
  'cashback-general': {
    id: 'cashback-general',
    label: 'Best for Max Cashback',
    icon: DollarSign,
    color: 'text-accent-700',
    bgColor: 'bg-accent-50',
    borderColor: 'border-accent-200',
    description: 'High % cashback on all spends'
  },
  'shopping-rewards': {
    id: 'shopping-rewards',
    label: 'Best for Online Shopping',
    icon: ShoppingCart,
    color: 'text-pink-700',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    description: 'Amazon, Flipkart, e-commerce rewards'
  },
  'business-expenses': {
    id: 'business-expenses',
    label: 'Best for Business',
    icon: Briefcase,
    color: 'text-slate-700',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
    description: 'Corporate expenses, GST benefits'
  },
  'premium-lifestyle': {
    id: 'premium-lifestyle',
    label: 'Best for VIP Perks',
    icon: Crown,
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    description: 'Concierge, golf, spa access'
  },
  'student-starter': {
    id: 'student-starter',
    label: 'Best for Students',
    icon: GraduationCap,
    color: 'text-primary-700',
    bgColor: 'bg-primary-50',
    borderColor: 'border-indigo-200',
    description: 'Low income limit, entry-level benefits'
  },
  
  // === LOAN CATEGORIES ===
  'home-loan': {
    id: 'home-loan',
    label: 'Best for Home Buyers',
    icon: Home,
    color: 'text-primary-700',
    bgColor: 'bg-primary-50',
    borderColor: 'border-primary-200',
    description: 'Low interest rates, long tenure, tax benefits'
  },
  'education-loan': {
    id: 'education-loan',
    label: 'Best for Education',
    icon: School,
    color: 'text-primary-700',
    bgColor: 'bg-primary-50',
    borderColor: 'border-primary-200',
    description: 'Study abroad, no collateral, moratorium period'
  },
  'personal-loan': {
    id: 'personal-loan',
    label: 'Best for Personal Use',
    icon: Wallet,
    color: 'text-primary-700',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200',
    description: 'Instant approval, flexible use, quick disbursal'
  },
  'business-loan': {
    id: 'business-loan',
    label: 'Best for Business Growth',
    icon: TrendingUp,
    color: 'text-primary-700',
    bgColor: 'bg-primary-50',
    borderColor: 'border-primary-200',
    description: 'Working capital, expansion, machinery purchase'
  },
  'car-loan': {
    id: 'car-loan',
    label: 'Best for Auto Purchase',
    icon: Car,
    color: 'text-cyan-700',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    description: 'New/used cars, low down payment, flexible EMI'
  },
  'gold-loan': {
    id: 'gold-loan',
    label: 'Best for Quick Cash',
    icon: Gem,
    color: 'text-accent-700',
    bgColor: 'bg-accent-50',
    borderColor: 'border-accent-200',
    description: 'Against gold jewelry, instant approval, low rates'
  },
  
  // === MUTUAL FUND CATEGORIES ===
  'retirement-fund': {
    id: 'retirement-fund',
    label: 'Best for Retirement',
    icon: Palmtree,
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    description: 'Long-term growth, low risk, retirement planning'
  },
  'tax-saving-fund': {
    id: 'tax-saving-fund',
    label: 'Best for Tax Saving',
    icon: FileText,
    color: 'text-success-700',
    bgColor: 'bg-success-50',
    borderColor: 'border-green-200',
    description: 'ELSS, Section 80C benefits, 3-year lock-in'
  },
  'aggressive-growth': {
    id: 'aggressive-growth',
    label: 'Best for High Returns',
    icon: Rocket,
    color: 'text-danger-700',
    bgColor: 'bg-danger-50',
    borderColor: 'border-red-200',
    description: 'Small-cap, mid-cap, high risk, high reward'
  },
  'index-fund': {
    id: 'index-fund',
    label: 'Best for Low-Cost Investing',
    icon: BarChart3,
    color: 'text-slate-700',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
    description: 'Passive investing, low expense ratio, tracks Nifty/Sensex'
  },
  'balanced-fund': {
    id: 'balanced-fund',
    label: 'Best for Balanced Growth',
    icon: Scale,
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    description: 'Hybrid fund, equity + debt, moderate risk'
  },
  'liquid-fund': {
    id: 'liquid-fund',
    label: 'Best for Emergency Fund',
    icon: Droplet,
    color: 'text-secondary-700',
    bgColor: 'bg-secondary-50',
    borderColor: 'border-secondary-200',
    description: 'High liquidity, low risk, instant redemption'
  }
};

interface BestForBadgeProps {
  category: string;
  size?: 'sm' | 'md' | 'lg';
  showDescription?: boolean;
  className?: string;
}

export default function BestForBadge({ 
  category, 
  size = 'md', 
  showDescription = false,
  className = ''
}: BestForBadgeProps) {
  const badge = BEST_FOR_CATEGORIES[category];
  
  // Return null if category doesn't exist
  if (!badge) return null;

  const Icon = badge.icon;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-3'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className={className}>
      <div className={`inline-flex items-center ${sizeClasses[size]} ${badge.bgColor} ${badge.borderColor} border-2 rounded-full font-bold ${badge.color} shadow-sm hover:shadow-md transition-shadow`}>
        <Icon className={iconSizes[size]} />
        <span>{badge.label}</span>
      </div>
      {showDescription && (
        <p className="text-xs text-slate-600 mt-2">{badge.description}</p>
      )}
    </div>
  );
}
