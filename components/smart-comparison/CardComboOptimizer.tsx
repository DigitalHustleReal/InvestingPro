'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { 
  Layers,
  CreditCard,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShoppingCart,
  Plane,
  Fuel,
  Utensils,
  Package,
  ChevronRight,
  Star
} from 'lucide-react';
import { CreditCard as CreditCardType } from '@/types/credit-card';
import { 
  CardComboOptimizer as ComboEngine,
  CardComboResult,
  UserSpendingProfile 
} from '@/lib/decision-engines/smart-comparison-engine';

interface CardComboOptimizerProps {
  cards: CreditCardType[];
  onOptimize?: (result: CardComboResult) => void;
}

export function CardComboOptimizerComponent({ cards, onOptimize }: CardComboOptimizerProps) {
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
  
  const [maxCards, setMaxCards] = useState(3);
  const [monthlyIncome, setMonthlyIncome] = useState(80000);
  const [result, setResult] = useState<CardComboResult | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const totalSpending = useMemo(() => 
    Object.values(spending).reduce((a, b) => a + b, 0), 
    [spending]
  );

  const handleOptimize = () => {
    setIsOptimizing(true);
    
    const profile: UserSpendingProfile = {
      monthlyIncome,
      totalMonthlySpending: totalSpending,
      categories: spending,
      existingCards: 0,
      employmentType: 'salaried',
    };
    
    const optimizeResult = ComboEngine.optimize(cards, profile, maxCards);
    setResult(optimizeResult);
    onOptimize?.(optimizeResult);
    setIsOptimizing(false);
  };

  const getCategoryIcon = (category: string) => {
    if (category.toLowerCase().includes('online') || category.toLowerCase().includes('amazon') || category.toLowerCase().includes('flipkart')) {
      return <ShoppingCart className="h-4 w-4" />;
    }
    if (category.toLowerCase().includes('travel')) {
      return <Plane className="h-4 w-4" />;
    }
    if (category.toLowerCase().includes('fuel') || category.toLowerCase().includes('petrol')) {
      return <Fuel className="h-4 w-4" />;
    }
    if (category.toLowerCase().includes('dining') || category.toLowerCase().includes('restaurant')) {
      return <Utensils className="h-4 w-4" />;
    }
    return <Package className="h-4 w-4" />;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'primary':
        return 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white';
      case 'secondary':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'tertiary':
        return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white';
      default:
        return 'bg-muted';
    }
  };

  const spendingCategories = [
    { key: 'online', label: 'Online Shopping', icon: <ShoppingCart className="h-4 w-4" /> },
    { key: 'travel', label: 'Travel', icon: <Plane className="h-4 w-4" /> },
    { key: 'dining', label: 'Dining', icon: <Utensils className="h-4 w-4" /> },
    { key: 'groceries', label: 'Groceries', icon: <Package className="h-4 w-4" /> },
    { key: 'fuel', label: 'Fuel', icon: <Fuel className="h-4 w-4" /> },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" />
          Smart Card Stack
        </CardTitle>
        <CardDescription>
          Find the optimal combination of cards for maximum rewards
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Spending Sliders */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Your Monthly Spending</Label>
          <div className="space-y-6">
            {spendingCategories.map((cat) => (
              <div key={cat.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2 text-sm">
                    {cat.icon}
                    {cat.label}
                  </Label>
                  <span className="font-semibold">₹{spending[cat.key as keyof typeof spending].toLocaleString()}</span>
                </div>
                <Slider
                  value={[spending[cat.key as keyof typeof spending]]}
                  onValueChange={([value]) => setSpending(prev => ({ ...prev, [cat.key]: value }))}
                  max={50000}
                  step={1000}
                  className="w-full"
                />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <span className="text-sm text-muted-foreground">Total Monthly Spending</span>
            <span className="text-lg font-bold">₹{totalSpending.toLocaleString()}</span>
          </div>
        </div>

        {/* Max Cards Selector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Maximum Cards in Stack</Label>
            <span className="font-semibold">{maxCards} cards</span>
          </div>
          <Slider
            value={[maxCards]}
            onValueChange={([value]) => setMaxCards(value)}
            min={2}
            max={4}
            step={1}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            More cards = more rewards, but more complexity
          </p>
        </div>

        <Button onClick={handleOptimize} disabled={isOptimizing || cards.length === 0} className="w-full">
          {isOptimizing ? 'Optimizing...' : 'Find Optimal Card Stack'}
          <Sparkles className="h-4 w-4 ml-2" />
        </Button>

        {/* Results */}
        {result && (
          <div className="space-y-6 pt-4">
            <Separator />
            
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border border-green-200 dark:border-green-800 rounded-lg text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Annual Value</p>
                <p className="text-2xl font-bold text-green-600">₹{result.totalAnnualValue.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Single Card Value</p>
                <p className="text-2xl font-bold">₹{result.vsingleCardValue.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border border-blue-200 dark:border-blue-800 rounded-lg text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Extra Earnings</p>
                <p className={`text-2xl font-bold ${result.additionalValue >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  +₹{result.additionalValue.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Card Stack Visualization */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Your Optimal Card Stack</h4>
                <Badge variant={result.complexity === 'simple' ? 'secondary' : result.complexity === 'moderate' ? 'default' : 'outline'}>
                  {result.complexity === 'simple' ? 'Simple' : result.complexity === 'moderate' ? 'Moderate' : 'Complex'} Setup
                </Badge>
              </div>
              
              <div className="space-y-3">
                {result.usageStrategy.map((strategy, index) => (
                  <div 
                    key={strategy.card.id} 
                    className="relative overflow-hidden rounded-xl border shadow-sm"
                  >
                    {/* Priority Badge */}
                    <div className={`absolute top-0 left-0 right-0 h-1.5 ${getPriorityColor(strategy.priority)}`} />
                    
                    <div className="p-4 pt-5">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge className={getPriorityColor(strategy.priority)}>
                              {strategy.priority === 'primary' ? '1st' : strategy.priority === 'secondary' ? '2nd' : '3rd'} Card
                            </Badge>
                            {index === 0 && <Star className="h-4 w-4 text-amber-500 fill-amber-500" />}
                          </div>
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-muted-foreground" />
                            <span className="font-semibold text-lg">{strategy.card.name}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{strategy.card.provider}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Est. Annual Rewards</p>
                          <p className="text-xl font-bold text-green-600">
                            ₹{strategy.estimatedAnnualRewards.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      {/* Use For Categories */}
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-xs text-muted-foreground mb-2">USE FOR:</p>
                        <div className="flex flex-wrap gap-2">
                          {strategy.useFor.map((use, useIndex) => (
                            <Badge key={useIndex} variant="secondary" className="flex items-center gap-1">
                              {getCategoryIcon(use)}
                              {use}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendation */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <p className="text-sm">{result.recommendation}</p>
              </div>
            </div>

            {/* Usage Tips */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Quick Tips</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div className="flex items-start gap-2 p-2 bg-muted/50 rounded">
                  <ChevronRight className="h-3 w-3 mt-0.5 shrink-0" />
                  <span>Set up auto-pay on all cards to avoid late fees</span>
                </div>
                <div className="flex items-start gap-2 p-2 bg-muted/50 rounded">
                  <ChevronRight className="h-3 w-3 mt-0.5 shrink-0" />
                  <span>Use each card only for its specialized categories</span>
                </div>
                <div className="flex items-start gap-2 p-2 bg-muted/50 rounded">
                  <ChevronRight className="h-3 w-3 mt-0.5 shrink-0" />
                  <span>Track rewards points expiry dates</span>
                </div>
                <div className="flex items-start gap-2 p-2 bg-muted/50 rounded">
                  <ChevronRight className="h-3 w-3 mt-0.5 shrink-0" />
                  <span>Review and adjust stack every 6 months</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {cards.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <CreditCard className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No cards available to optimize</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default CardComboOptimizerComponent;
