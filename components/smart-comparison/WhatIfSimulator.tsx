'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  FlaskConical,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  DollarSign,
  Target,
  Trash2,
  Plus,
  Lightbulb
} from 'lucide-react';
import { CreditCard as CreditCardType } from '@/types/credit-card';
import { 
  WhatIfSimulator as SimulatorEngine,
  WhatIfScenario,
  WhatIfResult,
  UserSpendingProfile 
} from '@/lib/decision-engines/smart-comparison-engine';

interface WhatIfSimulatorProps {
  cards: CreditCardType[];
  initialProfile?: Partial<UserSpendingProfile>;
}

export function WhatIfSimulatorComponent({ cards, initialProfile }: WhatIfSimulatorProps) {
  const [activeTab, setActiveTab] = useState('spending');
  const [profile, setProfile] = useState<UserSpendingProfile>({
    monthlyIncome: initialProfile?.monthlyIncome || 80000,
    totalMonthlySpending: initialProfile?.totalMonthlySpending || 50000,
    categories: initialProfile?.categories || {
      online: 15000,
      travel: 5000,
      dining: 8000,
      groceries: 10000,
      fuel: 5000,
      utilities: 4000,
      entertainment: 3000,
      other: 0,
    },
    creditScore: initialProfile?.creditScore || 720,
    existingCards: initialProfile?.existingCards || 2,
    employmentType: initialProfile?.employmentType || 'salaried',
    age: initialProfile?.age || 30,
    city: initialProfile?.city || 'metro',
  });
  
  const [results, setResults] = useState<WhatIfResult[]>([]);

  // Scenario-specific states
  const [spendingScenario, setSpendingScenario] = useState({
    category: 'travel',
    newAmount: 10000,
  });
  const [incomeScenario, setIncomeScenario] = useState({
    newIncome: 100000,
  });
  const [creditScenario, setCreditScenario] = useState({
    newScore: 750,
  });
  const [closeCardScenario, setCloseCardScenario] = useState({
    cardAge: 3,
  });
  const [newCardScenario, setNewCardScenario] = useState({
    cardId: cards[0]?.id || '',
  });

  const handleSimulate = (type: WhatIfScenario['type']) => {
    let scenario: WhatIfScenario;
    
    switch (type) {
      case 'spending_change':
        scenario = { type, change: spendingScenario };
        break;
      case 'income_change':
        scenario = { type, change: incomeScenario };
        break;
      case 'credit_score_change':
        scenario = { type, change: creditScenario };
        break;
      case 'close_card':
        scenario = { type, change: closeCardScenario };
        break;
      case 'new_card':
        scenario = { type, change: newCardScenario };
        break;
      default:
        return;
    }
    
    const result = SimulatorEngine.simulate(scenario, cards, profile);
    setResults(prev => [result, ...prev].slice(0, 5)); // Keep last 5 results
  };

  const clearResults = () => setResults([]);

  const spendingCategories = [
    { value: 'online', label: 'Online Shopping' },
    { value: 'travel', label: 'Travel' },
    { value: 'dining', label: 'Dining' },
    { value: 'groceries', label: 'Groceries' },
    { value: 'fuel', label: 'Fuel' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'entertainment', label: 'Entertainment' },
  ];

  const getScenarioTypeLabel = (type: WhatIfScenario['type']) => {
    switch (type) {
      case 'spending_change': return 'Spending Change';
      case 'income_change': return 'Income Change';
      case 'credit_score_change': return 'Credit Score Change';
      case 'close_card': return 'Close Card';
      case 'new_card': return 'New Card';
      default: return 'Scenario';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-primary" />
          What-If Simulator
        </CardTitle>
        <CardDescription>
          Test different scenarios and see their impact on your card strategy
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Profile Summary */}
        <div className="p-4 bg-muted rounded-lg space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Current Profile</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Income:</span>
              <span className="ml-1 font-medium">₹{profile.monthlyIncome.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Credit Score:</span>
              <span className="ml-1 font-medium">{profile.creditScore || 'Unknown'}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Existing Cards:</span>
              <span className="ml-1 font-medium">{profile.existingCards}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Employment:</span>
              <span className="ml-1 font-medium capitalize">{profile.employmentType.replace('_', ' ')}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Spending:</span>
              <span className="ml-1 font-medium">₹{profile.totalMonthlySpending.toLocaleString()}/mo</span>
            </div>
          </div>
        </div>

        {/* Scenario Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="spending" className="text-xs">Spending</TabsTrigger>
            <TabsTrigger value="income" className="text-xs">Income</TabsTrigger>
            <TabsTrigger value="credit" className="text-xs">Credit Score</TabsTrigger>
            <TabsTrigger value="close" className="text-xs">Close Card</TabsTrigger>
            <TabsTrigger value="new" className="text-xs">New Card</TabsTrigger>
          </TabsList>

          {/* Spending Change */}
          <TabsContent value="spending" className="space-y-4">
            <div className="p-4 border rounded-lg space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Target className="h-4 w-4" />
                What if I change my spending?
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={spendingScenario.category}
                    onValueChange={(value) => setSpendingScenario(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {spendingCategories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>New Monthly Amount (₹)</Label>
                  <Input
                    type="number"
                    value={spendingScenario.newAmount}
                    onChange={(e) => setSpendingScenario(prev => ({ ...prev, newAmount: Number(e.target.value) }))}
                  />
                </div>
              </div>
              <Button onClick={() => handleSimulate('spending_change')} className="w-full">
                Simulate Spending Change
              </Button>
            </div>
          </TabsContent>

          {/* Income Change */}
          <TabsContent value="income" className="space-y-4">
            <div className="p-4 border rounded-lg space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                What if my income changes?
              </h4>
              <div className="space-y-2">
                <Label>New Monthly Income (₹)</Label>
                <Input
                  type="number"
                  value={incomeScenario.newIncome}
                  onChange={(e) => setIncomeScenario({ newIncome: Number(e.target.value) })}
                />
                <p className="text-xs text-muted-foreground">
                  Current: ₹{profile.monthlyIncome.toLocaleString()}/month
                </p>
              </div>
              <Button onClick={() => handleSimulate('income_change')} className="w-full">
                Simulate Income Change
              </Button>
            </div>
          </TabsContent>

          {/* Credit Score Change */}
          <TabsContent value="credit" className="space-y-4">
            <div className="p-4 border rounded-lg space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                What if my credit score changes?
              </h4>
              <div className="space-y-2">
                <Label>New Credit Score</Label>
                <Input
                  type="number"
                  value={creditScenario.newScore}
                  onChange={(e) => setCreditScenario({ newScore: Number(e.target.value) })}
                  min={300}
                  max={900}
                />
                <p className="text-xs text-muted-foreground">
                  Current: {profile.creditScore || 'Unknown'} | Range: 300-900
                </p>
              </div>
              <Button onClick={() => handleSimulate('credit_score_change')} className="w-full">
                Simulate Credit Score Change
              </Button>
            </div>
          </TabsContent>

          {/* Close Card */}
          <TabsContent value="close" className="space-y-4">
            <div className="p-4 border rounded-lg space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                What if I close a card?
              </h4>
              <div className="space-y-2">
                <Label>Card Age (Years)</Label>
                <Input
                  type="number"
                  value={closeCardScenario.cardAge}
                  onChange={(e) => setCloseCardScenario({ cardAge: Number(e.target.value) })}
                  min={0}
                />
                <p className="text-xs text-muted-foreground">
                  How old is the card you're considering closing?
                </p>
              </div>
              <Button onClick={() => handleSimulate('close_card')} className="w-full" variant="destructive">
                Simulate Closing Card
              </Button>
            </div>
          </TabsContent>

          {/* New Card */}
          <TabsContent value="new" className="space-y-4">
            <div className="p-4 border rounded-lg space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Plus className="h-4 w-4" />
                What if I apply for a new card?
              </h4>
              <div className="space-y-2">
                <Label>Select Card</Label>
                <Select
                  value={newCardScenario.cardId}
                  onValueChange={(value) => setNewCardScenario({ cardId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a card" />
                  </SelectTrigger>
                  <SelectContent>
                    {cards.map((card) => (
                      <SelectItem key={card.id} value={card.id}>
                        {card.name} ({card.provider})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={() => handleSimulate('new_card')} 
                className="w-full"
                disabled={!newCardScenario.cardId}
              >
                Simulate New Card Application
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm uppercase tracking-wider text-muted-foreground">
                Simulation Results
              </h4>
              <Button variant="ghost" size="sm" onClick={clearResults}>
                Clear All
              </Button>
            </div>
            
            <div className="space-y-4">
              {results.map((result, index) => (
                <div 
                  key={index}
                  className="p-4 border rounded-lg space-y-4"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge variant="secondary">
                        {getScenarioTypeLabel(result.scenario.type)}
                      </Badge>
                      <h4 className="font-medium mt-2">{result.impact}</h4>
                    </div>
                    {result.warnings.length > 0 ? (
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                  </div>

                  {/* State Changes */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="p-2 bg-muted rounded flex-1">
                      <p className="text-xs text-muted-foreground mb-1">Before</p>
                      <pre className="text-xs whitespace-pre-wrap">
                        {JSON.stringify(result.currentState, null, 2)}
                      </pre>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded flex-1">
                      <p className="text-xs text-muted-foreground mb-1">After</p>
                      <pre className="text-xs whitespace-pre-wrap">
                        {JSON.stringify(result.projectedState, null, 2)}
                      </pre>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded">
                    <Lightbulb className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                    <p className="text-sm">{result.recommendation}</p>
                  </div>

                  {/* Warnings */}
                  {result.warnings.length > 0 && (
                    <div className="space-y-2">
                      {result.warnings.map((warning, wIndex) => (
                        <div 
                          key={wIndex}
                          className="flex items-start gap-2 p-2 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded text-sm"
                        >
                          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                          {warning}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {results.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <FlaskConical className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Run a simulation to see results</p>
            <p className="text-sm">Choose a scenario above and click simulate</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default WhatIfSimulatorComponent;
