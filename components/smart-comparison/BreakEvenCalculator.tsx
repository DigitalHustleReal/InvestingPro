'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  TrendingDown,
  Calculator,
  CreditCard,
  IndianRupee,
  Percent,
  ArrowRight,
  Info
} from 'lucide-react';
import { CreditCard as CreditCardType } from '@/types/credit-card';
import { 
  BreakEvenCalculator as BreakEvenEngine, 
  BreakEvenResult,
  UserSpendingProfile 
} from '@/lib/decision-engines/smart-comparison-engine';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface BreakEvenCalculatorProps {
  card: CreditCardType;
  onCalculate?: (result: BreakEvenResult) => void;
}

export function BreakEvenCalculatorComponent({ card, onCalculate }: BreakEvenCalculatorProps) {
  const [spending, setSpending] = useState({
    online: 15000,
    travel: 5000,
    dining: 8000,
    groceries: 10000,
    fuel: 5000,
    utilities: 5000,
    entertainment: 3000,
    other: 4000,
  });
  
  const [monthlyIncome, setMonthlyIncome] = useState(80000);
  const [result, setResult] = useState<BreakEvenResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const totalSpending = Object.values(spending).reduce((a, b) => a + b, 0);

  const handleCalculate = () => {
    setIsCalculating(true);
    
    const profile: UserSpendingProfile = {
      monthlyIncome,
      totalMonthlySpending: totalSpending,
      categories: spending,
      existingCards: 2,
      employmentType: 'salaried',
    };
    
    const calcResult = BreakEvenEngine.calculate(card, profile);
    setResult(calcResult);
    onCalculate?.(calcResult);
    setIsCalculating(false);
  };

  const spendingCategories = [
    { key: 'online', label: 'Online Shopping', icon: '🛒' },
    { key: 'travel', label: 'Travel', icon: '✈️' },
    { key: 'dining', label: 'Dining', icon: '🍽️' },
    { key: 'groceries', label: 'Groceries', icon: '🥬' },
    { key: 'fuel', label: 'Fuel', icon: '⛽' },
    { key: 'utilities', label: 'Utilities', icon: '💡' },
    { key: 'entertainment', label: 'Entertainment', icon: '🎬' },
    { key: 'other', label: 'Other', icon: '📦' },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Break-Even Calculator
        </CardTitle>
        <CardDescription>
          Find out if {card.name} is worth it based on your spending
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Monthly Income */}
        <div className="space-y-2">
          <Label htmlFor="income" className="flex items-center gap-2">
            <IndianRupee className="h-4 w-4" />
            Monthly Income
          </Label>
          <Input
            id="income"
            type="number"
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(Number(e.target.value))}
            className="max-w-xs"
          />
        </div>

        {/* Spending Categories */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Monthly Spending by Category</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {spendingCategories.map((cat) => (
              <div key={cat.key} className="space-y-1">
                <Label htmlFor={cat.key} className="text-sm text-muted-foreground">
                  {cat.icon} {cat.label}
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                  <Input
                    id={cat.key}
                    type="number"
                    value={spending[cat.key as keyof typeof spending]}
                    onChange={(e) => setSpending(prev => ({
                      ...prev,
                      [cat.key]: Number(e.target.value)
                    }))}
                    className="pl-7"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Total Monthly Spending:</span>
            <span className="font-semibold text-foreground">₹{totalSpending.toLocaleString()}</span>
          </div>
        </div>

        <Button onClick={handleCalculate} disabled={isCalculating} className="w-full">
          {isCalculating ? 'Calculating...' : 'Calculate Break-Even'}
        </Button>

        {/* Results */}
        {result && (
          <div className="space-y-6 pt-4">
            <Separator />
            
            {/* Main Verdict */}
            <div className={`p-4 rounded-lg ${result.isWorthIt ? 'bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800' : 'bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800'}`}>
              <div className="flex items-start gap-3">
                {result.isWorthIt ? (
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 mt-0.5" />
                ) : (
                  <XCircle className="h-6 w-6 text-amber-600 dark:text-amber-400 mt-0.5" />
                )}
                <div>
                  <h3 className="font-semibold text-lg">
                    {result.isWorthIt ? 'Worth It!' : 'Consider Alternatives'}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{result.verdict}</p>
                </div>
              </div>
            </div>

            {/* Key Numbers */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-muted rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Annual Fee</p>
                <p className="text-2xl font-bold">₹{result.annualFee.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Est. Annual Rewards</p>
                <p className="text-2xl font-bold text-green-600">₹{result.estimatedAnnualRewards.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Net Benefit</p>
                <p className={`text-2xl font-bold ${result.netBenefit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {result.netBenefit >= 0 ? '+' : ''}₹{result.netBenefit.toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Break-Even</p>
                <p className="text-2xl font-bold">
                  {result.breakEvenMonths === 0 ? 'N/A' : `${result.breakEvenMonths} mo`}
                </p>
              </div>
            </div>

            {/* Reward Breakdown */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Reward Breakdown
              </h4>
              <div className="space-y-2">
                {result.rewardBreakdown
                  .filter(r => r.rewards > 0)
                  .sort((a, b) => b.rewards - a.rewards)
                  .map((item) => (
                    <div key={item.category} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{item.category}</span>
                        <Badge variant="secondary" className="text-xs">
                          {item.rewardRate}%
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-muted-foreground">
                          ₹{item.spending.toLocaleString()}/yr
                        </span>
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium text-green-600">
                          +₹{item.rewards.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Comparison with Free Card */}
            <div className="p-4 border rounded-lg space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                vs. Lifetime Free Card (1% cashback)
              </h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">Free Card Rewards</p>
                  <p className="font-semibold">₹{result.comparisonWithFreeCard.freeCardRewards.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Premium Advantage</p>
                  <p className={`font-semibold ${result.comparisonWithFreeCard.premiumAdvantage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {result.comparisonWithFreeCard.premiumAdvantage >= 0 ? '+' : ''}
                    ₹{result.comparisonWithFreeCard.premiumAdvantage.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Real Savings</p>
                  <p className={`font-semibold ${result.comparisonWithFreeCard.premiumAdvantage - result.annualFee >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {result.comparisonWithFreeCard.premiumAdvantage - result.annualFee >= 0 ? '+' : ''}
                    ₹{(result.comparisonWithFreeCard.premiumAdvantage - result.annualFee).toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground pt-2 border-t">
                {result.comparisonWithFreeCard.recommendation}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default BreakEvenCalculatorComponent;
