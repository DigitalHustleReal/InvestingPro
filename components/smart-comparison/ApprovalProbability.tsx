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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  CheckCircle2, 
  XCircle, 
  MinusCircle,
  AlertTriangle,
  ShieldCheck,
  TrendingUp,
  User,
  Briefcase,
  CreditCard,
  MapPin,
  Lightbulb
} from 'lucide-react';
import { CreditCard as CreditCardType } from '@/types/credit-card';
import { 
  ApprovalProbabilityCalculator,
  ApprovalProbabilityResult,
  ApprovalFactor,
  UserSpendingProfile 
} from '@/lib/decision-engines/smart-comparison-engine';

interface ApprovalProbabilityProps {
  card: CreditCardType;
  onCalculate?: (result: ApprovalProbabilityResult) => void;
}

export function ApprovalProbabilityComponent({ card, onCalculate }: ApprovalProbabilityProps) {
  const [profile, setProfile] = useState<Partial<UserSpendingProfile>>({
    monthlyIncome: 60000,
    creditScore: 720,
    existingCards: 2,
    employmentType: 'salaried',
    age: 30,
    city: 'metro',
    totalMonthlySpending: 40000,
    categories: {
      online: 10000,
      travel: 5000,
      dining: 5000,
      groceries: 8000,
      fuel: 4000,
      utilities: 3000,
      entertainment: 3000,
      other: 2000,
    },
  });
  
  const [result, setResult] = useState<ApprovalProbabilityResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = () => {
    setIsCalculating(true);
    
    const fullProfile: UserSpendingProfile = {
      monthlyIncome: profile.monthlyIncome || 50000,
      totalMonthlySpending: profile.totalMonthlySpending || 30000,
      categories: profile.categories || {
        online: 5000,
        travel: 2000,
        dining: 3000,
        groceries: 5000,
        fuel: 2000,
        utilities: 2000,
        entertainment: 2000,
        other: 2000,
      },
      creditScore: profile.creditScore,
      existingCards: profile.existingCards || 0,
      employmentType: profile.employmentType || 'salaried',
      age: profile.age,
      city: profile.city,
    };
    
    const calcResult = ApprovalProbabilityCalculator.calculate(card, fullProfile);
    setResult(calcResult);
    onCalculate?.(calcResult);
    setIsCalculating(false);
  };

  const getStatusIcon = (status: ApprovalFactor['status']) => {
    switch (status) {
      case 'positive':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'negative':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <MinusCircle className="h-5 w-5 text-amber-600" />;
    }
  };

  const getImpactBadge = (impact: number) => {
    if (impact > 10) return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">+{impact}%</Badge>;
    if (impact > 0) return <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">+{impact}%</Badge>;
    if (impact < -10) return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">{impact}%</Badge>;
    if (impact < 0) return <Badge className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">{impact}%</Badge>;
    return <Badge variant="secondary">0%</Badge>;
  };

  const getProbabilityColor = (prob: number) => {
    if (prob >= 70) return 'text-green-600';
    if (prob >= 50) return 'text-amber-600';
    return 'text-red-600';
  };

  const getProbabilityGradient = (prob: number) => {
    if (prob >= 70) return 'from-green-500 to-green-600';
    if (prob >= 50) return 'from-amber-500 to-amber-600';
    return 'from-red-500 to-red-600';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          Approval Probability
        </CardTitle>
        <CardDescription>
          Check your chances of getting approved for {card.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="income" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Monthly Income (₹)
            </Label>
            <Input
              id="income"
              type="number"
              value={profile.monthlyIncome}
              onChange={(e) => setProfile(prev => ({ ...prev, monthlyIncome: Number(e.target.value) }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="creditScore" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Credit Score (Optional)
            </Label>
            <Input
              id="creditScore"
              type="number"
              placeholder="e.g., 750"
              value={profile.creditScore || ''}
              onChange={(e) => setProfile(prev => ({ ...prev, creditScore: e.target.value ? Number(e.target.value) : undefined }))}
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Employment Type
            </Label>
            <Select
              value={profile.employmentType}
              onValueChange={(value: UserSpendingProfile['employmentType']) => 
                setProfile(prev => ({ ...prev, employmentType: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select employment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="salaried">Salaried</SelectItem>
                <SelectItem value="self_employed">Self Employed</SelectItem>
                <SelectItem value="business">Business Owner</SelectItem>
                <SelectItem value="student">Student</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="existingCards" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Existing Credit Cards
            </Label>
            <Input
              id="existingCards"
              type="number"
              value={profile.existingCards}
              onChange={(e) => setProfile(prev => ({ ...prev, existingCards: Number(e.target.value) }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="age" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Age (Optional)
            </Label>
            <Input
              id="age"
              type="number"
              placeholder="e.g., 30"
              value={profile.age || ''}
              onChange={(e) => setProfile(prev => ({ ...prev, age: e.target.value ? Number(e.target.value) : undefined }))}
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              City Type (Optional)
            </Label>
            <Select
              value={profile.city || ''}
              onValueChange={(value: UserSpendingProfile['city']) => 
                setProfile(prev => ({ ...prev, city: value || undefined }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select city type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metro">Metro City</SelectItem>
                <SelectItem value="tier1">Tier-1 City</SelectItem>
                <SelectItem value="tier2">Tier-2 City</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={handleCalculate} disabled={isCalculating} className="w-full">
          {isCalculating ? 'Calculating...' : 'Check Approval Odds'}
        </Button>

        {/* Results */}
        {result && (
          <div className="space-y-6 pt-4">
            <Separator />
            
            {/* Main Probability Display */}
            <div className="text-center space-y-4">
              <div className="relative inline-flex items-center justify-center w-40 h-40">
                {/* Circular Progress Background */}
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    className="text-muted"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="12"
                    strokeDasharray={`${result.overallProbability * 4.4} 440`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" className={`${result.overallProbability >= 70 ? 'text-green-500' : result.overallProbability >= 50 ? 'text-amber-500' : 'text-red-500'}`} stopColor="currentColor" />
                      <stop offset="100%" className={`${result.overallProbability >= 70 ? 'text-green-600' : result.overallProbability >= 50 ? 'text-amber-600' : 'text-red-600'}`} stopColor="currentColor" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Percentage Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-4xl font-bold ${getProbabilityColor(result.overallProbability)}`}>
                    {result.overallProbability}%
                  </span>
                  <span className="text-sm text-muted-foreground">Approval Odds</span>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2">
                <Badge variant={result.riskLevel === 'low' ? 'default' : result.riskLevel === 'medium' ? 'secondary' : 'destructive'}>
                  {result.riskLevel === 'low' ? 'Low Risk' : result.riskLevel === 'medium' ? 'Medium Risk' : 'High Risk'}
                </Badge>
                <Badge variant="outline">
                  {result.confidenceLevel === 'high' ? 'High Confidence' : result.confidenceLevel === 'medium' ? 'Medium Confidence' : 'Low Confidence'}
                </Badge>
              </div>
            </div>

            {/* Factor Breakdown */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm uppercase tracking-wider text-muted-foreground">
                Factor Analysis
              </h4>
              <div className="space-y-2">
                {result.factors.map((factor, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg border ${
                      factor.status === 'positive' ? 'bg-green-50/50 dark:bg-green-950/50 border-green-200 dark:border-green-800' :
                      factor.status === 'negative' ? 'bg-red-50/50 dark:bg-red-950/50 border-red-200 dark:border-red-800' :
                      'bg-amber-50/50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getStatusIcon(factor.status)}
                        <div className="space-y-1">
                          <div className="font-medium">{factor.name}</div>
                          <div className="text-sm text-muted-foreground">
                            <span className="font-medium">{factor.currentValue}</span>
                            {factor.requiredValue !== 'Any' && factor.requiredValue !== 'N/A' && (
                              <span className="text-muted-foreground"> (Required: {factor.requiredValue})</span>
                            )}
                          </div>
                          {factor.suggestion && (
                            <p className="text-xs text-muted-foreground flex items-start gap-1 mt-1">
                              <Lightbulb className="h-3 w-3 mt-0.5 shrink-0" />
                              {factor.suggestion}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="shrink-0">
                        {getImpactBadge(factor.impact)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            {result.recommendations.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-sm uppercase tracking-wider text-muted-foreground">
                  Recommendations
                </h4>
                <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                      <span className="text-sm">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Warning for low probability */}
            {result.overallProbability < 40 && (
              <div className="p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800 dark:text-amber-200">Low Approval Chances</h4>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                    Consider applying for entry-level or secured credit cards first to build your credit profile.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ApprovalProbabilityComponent;
