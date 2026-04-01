'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/separator';
import {
  Calculator,
  ShieldCheck,
  Layers,
  Grid3X3,
  FlaskConical,
  Sparkles,
  Brain,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { CreditCard } from '@/types/credit-card';
import { 
  BreakEvenCalculatorComponent,
  ApprovalProbabilityComponent,
  CardComboOptimizerComponent,
  DecisionMatrixComponent,
  WhatIfSimulatorComponent
} from '@/components/smart-comparison';

// Mock data for demonstration - in production, fetch from API
const mockCards: any[] = [
  {
    id: '1',
    name: 'HDFC Regalia',
    slug: 'hdfc-regalia',

    type: 'travel',

    annual_fee: '₹2,500',
    features: ['Lounge Access', 'Travel Insurance', 'Airport Meet & Greet', 'Golf Privileges'],
    rating: 4.5,
    reviewsCount: 2340,
    rewardRate: '4 points per ₹150',
    loungeAccess: '6 domestic + 6 international visits',
    welcomeBonus: '₹5,000 worth rewards',
    minCreditScore: 750,
    min_income: '₹60,000/month',
    pros: ['Great travel benefits', 'Low annual fee for features'],
    cons: ['Limited cashback categories'],
    rewards: ['4X rewards on travel', '2X on dining'],
    description: 'Premium travel card with excellent lounge access and travel benefits.'
  },
  {
    id: '2',
    name: 'HDFC Millennia',
    slug: 'hdfc-millennia',

    type: 'cashback',

    annual_fee: 'Lifetime Free',
    features: ['5% Cashback on Amazon/Flipkart', 'EMI on Call', 'Fuel Surcharge Waiver'],
    rating: 4.3,
    reviewsCount: 5670,
    rewardRate: '5% cashback',
    min_income: '₹25,000/month',
    minCreditScore: 700,
    pros: ['Lifetime free', 'Great for online shopping'],
    cons: ['Limited travel benefits'],
    rewards: ['5% on partner sites', '1% on other purchases'],
    description: 'Lifetime free card with excellent cashback on online shopping.'
  },
  {
    id: '3',
    name: 'SBI SimplyCLICK',
    slug: 'sbi-simplyclick',

    type: 'shopping',

    annual_fee: '₹499',
    features: ['10X Rewards on Amazon', 'No Fuel Surcharge', 'E-vouchers'],
    rating: 4.2,
    reviewsCount: 3450,
    rewardRate: '10X on Amazon',
    min_income: '₹30,000/month',
    minCreditScore: 680,
    pros: ['Great for Amazon shoppers', 'Low annual fee'],
    cons: ['Limited airline miles'],
    rewards: ['10X on Amazon', '5X on partner sites'],
    description: 'Best card for Amazon shopping with 10X rewards.'
  },
  {
    id: '4',
    name: 'ICICI Amazon Pay',
    slug: 'icici-amazon-pay',

    type: 'cashback',

    annual_fee: 'Lifetime Free',
    features: ['5% Amazon Cashback', 'Prime Benefits', 'No Foreign Transaction Fee'],
    rating: 4.4,
    reviewsCount: 8920,
    rewardRate: '5% on Amazon',
    min_income: '₹20,000/month',
    minCreditScore: 650,
    pros: ['Lifetime free', 'Best for Amazon', 'No forex markup'],
    cons: ['Only useful for Amazon users'],
    rewards: ['5% on Amazon with Prime', '2% on pay merchants'],
    description: 'Lifetime free card specifically designed for Amazon shoppers.'
  },
  {
    id: '5',
    name: 'Axis Ace',
    slug: 'axis-ace',

    type: 'rewards',

    annual_fee: '₹499 (Waivable)',
    features: ['5% Cashback on Bill Payments', 'Google Pay Integration', 'Movie Discounts'],
    rating: 4.1,
    reviewsCount: 2100,
    rewardRate: '5% on bills',
    min_income: '₹25,000/month',
    minCreditScore: 700,
    pros: ['Great for bill payments', 'Wide acceptance'],
    cons: ['Annual fee applicable'],
    rewards: ['5% on bill payments', '2% on others'],
    description: 'Best card for utility bill payments with integrated Google Pay.'
  },
  {
    id: '6',
    name: 'IndianOil Citi',
    slug: 'indianoil-citi',

    type: 'fuel',

    annual_fee: '₹500',
    features: ['Turbo Points on Fuel', 'Fuel Surcharge Waiver', 'Reward Redemption'],
    rating: 4.0,
    reviewsCount: 1890,
    rewardRate: '4 Turbo Points per ₹100',
    min_income: '₹30,000/month',
    minCreditScore: 700,
    pros: ['Best for fuel users', 'No surcharge at pumps'],
    cons: ['Limited other benefits'],
    rewards: ['4X on fuel', '1X on others'],
    description: 'Premium fuel card with maximum savings on petrol/diesel.'
  }
];

const features = [
  {
    id: 'break-even',
    title: 'Break-Even Calculator',
    description: 'Is a premium card worth it for your spending?',
    icon: Calculator,
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-950',
  },
  {
    id: 'approval',
    title: 'Approval Probability',
    description: 'Check your chances before applying',
    icon: ShieldCheck,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
  },
  {
    id: 'combo',
    title: 'Smart Card Stack',
    description: 'Find the optimal card combination',
    icon: Layers,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-950',
  },
  {
    id: 'matrix',
    title: 'Decision Matrix',
    description: 'Compare across multiple dimensions',
    icon: Grid3X3,
    color: 'text-amber-500',
    bgColor: 'bg-amber-50 dark:bg-amber-950',
  },
  {
    id: 'whatif',
    title: 'What-If Simulator',
    description: 'Test scenarios before making decisions',
    icon: FlaskConical,
    color: 'text-pink-500',
    bgColor: 'bg-pink-50 dark:bg-pink-950',
  },
];

export default function SmartComparePage() {
  const [activeTab, setActiveTab] = useState('break-even');
  const [selectedCard, setSelectedCard] = useState<any>(mockCards[0]);
  const [cards, setCards] = useState<any[]>(mockCards);
  const [isLoading, setIsLoading] = useState(false);

  // In production, fetch cards from API
  // useEffect(() => {
  //   async function fetchCards() {
  //     const response = await fetch('/api/products?type=credit_card');
  //     const data = await response.json();
  //     setCards(data.products);
  //   }
  //   fetchCards();
  // }, []);

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Hero Section */}
      <div className="text-center mb-10 space-y-4">
        <Badge variant="secondary" className="mb-2">
          <Brain className="h-3 w-3 mr-1" />
          AI-Powered Analysis
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight">
          Smart Credit Card Comparison
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Go beyond basic comparisons. Find the perfect card using our advanced 
          algorithms designed to match your unique spending patterns.
        </p>
      </div>

      {/* Feature Cards Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {features.map((feature) => {
          const Icon = feature.icon;
          const isActive = activeTab === feature.id;
          
          return (
            <button
              key={feature.id}
              onClick={() => setActiveTab(feature.id)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                isActive 
                  ? 'border-primary shadow-lg scale-[1.02]' 
                  : 'border-transparent hover:border-muted-foreground/20'
              } ${feature.bgColor}`}
            >
              <Icon className={`h-6 w-6 mb-2 ${feature.color}`} />
              <h3 className="font-medium text-sm">{feature.title}</h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {feature.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Card Selector */}
      <div className="mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Select a Card to Analyze</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {cards.map((card) => (
                <Button
                  key={card.id}
                  variant={selectedCard.id === card.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCard(card)}
                  className="flex items-center gap-2"
                >
                  {card.name}
                  {card.annualFee === 0 && (
                    <Badge variant="secondary" className="text-[10px] h-4 px-1">FREE</Badge>
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="space-y-6">
        {activeTab === 'break-even' && (
          <BreakEvenCalculatorComponent card={selectedCard} />
        )}
        
        {activeTab === 'approval' && (
          <ApprovalProbabilityComponent card={selectedCard} />
        )}
        
        {activeTab === 'combo' && (
          <CardComboOptimizerComponent cards={cards} />
        )}
        
        {activeTab === 'matrix' && (
          <DecisionMatrixComponent 
            cards={cards} 
            onCardSelect={(cardId) => {
              const card = cards.find(c => c.id === cardId);
              if (card) setSelectedCard(card);
            }}
          />
        )}
        
        {activeTab === 'whatif' && (
          <WhatIfSimulatorComponent cards={cards} />
        )}
      </div>

      {/* Bottom CTA */}
      <div className="mt-12 p-8 bg-green-50 rounded-2xl text-center">
        <Sparkles className="h-8 w-8 mx-auto mb-4 text-primary" />
        <h2 className="text-2xl font-bold mb-2">Ready to Apply?</h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          Based on your analysis, {selectedCard.name} could be a great choice. 
          Check current offers and apply securely.
        </p>
        <Button size="lg" className="gap-2">
          Check {selectedCard.name} Offers
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Trust Indicators */}
      <div className="mt-8 flex items-center justify-center gap-8 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4" />
          Rankings not affected by commissions
        </div>
        <Separator orientation="vertical" className="h-4" />
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Data updated daily
        </div>
        <Separator orientation="vertical" className="h-4" />
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4" />
          AI-powered recommendations
        </div>
      </div>
    </div>
  );
}
