"use client";

import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Wallet, 
  TrendingUp, 
  ShieldCheck, 
  Target,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileOnboardingProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: (data: OnboardingData) => void;
}

export interface OnboardingData {
  income: number;
  creditScore: number;
  employmentType: string;
  goals: string[];
}

const STEPS = [
  {
    title: "Financial Profile",
    description: "Help us understand your baseline to provide accurate recommendations.",
    icon: Wallet
  },
  {
    title: "Credit Health",
    description: "Your credit score determines what products you qualify for.",
    icon: ShieldCheck
  },
  {
    title: "Aspirations",
    description: "What are you looking to achieve with InvestingPro?",
    icon: Target
  }
];

export default function ProfileOnboarding({ open, onOpenChange, onComplete }: ProfileOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<OnboardingData>({
    income: 0,
    creditScore: 750,
    employmentType: 'salaried',
    goals: []
  });

  const [saving, setSaving] = useState(false);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setSaving(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Save to LocalStorage for now
    localStorage.setItem('investingpro_onboarding', JSON.stringify(formData));
    localStorage.setItem('investingpro_onboarded', 'true');
    
    setSaving(false);
    onComplete?.(formData);
    onOpenChange(false);
  };

  const toggleGoal = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal) 
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-0 shadow-2xl rounded-2xl bg-white dark:bg-slate-950">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100 dark:bg-slate-900">
          <div 
            className="h-full bg-primary-600 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-8 pb-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-primary-50 dark:bg-primary-900/30 rounded-xl text-primary-600 dark:text-primary-400">
              {React.createElement(STEPS[currentStep].icon, { size: 24 })}
            </div>
            <div>
              <p className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest">
                Step {currentStep + 1} of {STEPS.length}
              </p>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {STEPS[currentStep].title}
              </h2>
            </div>
          </div>

          <p className="text-slate-500 dark:text-slate-600 mb-8">
            {STEPS[currentStep].description}
          </p>

          <div className="min-h-[280px]">
            {currentStep === 0 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-3">
                  <Label htmlFor="income" className="text-sm font-semibold">Annual Income (INR)</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-600">₹</span>
                    <Input
                      id="income"
                      type="number"
                      placeholder="e.g. 1200000"
                      className="pl-10 h-14 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl focus:ring-primary-500 font-bold text-lg"
                      value={formData.income || ''}
                      onChange={(e) => setFormData({...formData, income: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Employment Type</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {['salaried', 'self-employed', 'business', 'student'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setFormData({...formData, employmentType: type})}
                        className={cn(
                          "h-12 rounded-xl border-2 transition-all font-semibold capitalize",
                          formData.employmentType === type
                            ? "border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 shadow-md shadow-primary-500/10"
                            : "border-slate-100 dark:border-slate-800 text-slate-500 hover:border-slate-200 dark:hover:border-slate-700"
                        )}
                      >
                        {type.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <Label className="text-sm font-semibold">Estimated Credit Score</Label>
                    <span className={cn(
                      "text-xl font-black",
                      formData.creditScore >= 750 ? "text-success-600" : 
                      formData.creditScore >= 700 ? "text-primary-600" : "text-warning-600"
                    )}>
                      {formData.creditScore}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="300"
                    max="900"
                    step="10"
                    value={formData.creditScore}
                    onChange={(e) => setFormData({...formData, creditScore: parseInt(e.target.value)})}
                    className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary-600"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-slate-600 uppercase tracking-tighter">
                    <span>Poor (300)</span>
                    <span>Fair (650)</span>
                    <span>Excellent (900)</span>
                  </div>
                </div>

                <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-2xl border border-primary-100 dark:border-primary-800/50 flex gap-4">
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-xl text-primary-600 shadow-sm flex-shrink-0">
                    <Sparkles size={20} />
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-600 leading-relaxed">
                    Most premium cards require a score of <span className="font-bold text-primary-700 dark:text-primary-400">750+</span>. 
                    Don't worry if yours is lower, we'll suggest cards to help you rebuild.
                  </p>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <Label className="text-sm font-semibold px-1">What are you looking for? (Select all that apply)</Label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: 'better-rewards', label: 'Better Rewards & Cashback', icon: Sparkles },
                    { id: 'save-on-interest', label: 'Save on Loan Interest', icon: TrendingUp },
                    { id: 'tax-saving', label: 'Tax Saving Investments', icon: Wallet },
                    { id: 'build-credit', label: 'Build / Improve Credit Score', icon: ShieldCheck }
                  ].map((goal) => (
                    <button
                      key={goal.id}
                      onClick={() => toggleGoal(goal.id)}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
                        formData.goals.includes(goal.id)
                          ? "border-primary-600 bg-primary-50 dark:bg-primary-900/20 shadow-md shadow-primary-500/10"
                          : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700"
                      )}
                    >
                      <div className={cn(
                        "p-2 rounded-lg",
                        formData.goals.includes(goal.id) ? "bg-primary-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                      )}>
                        <goal.icon size={18} />
                      </div>
                      <span className={cn(
                        "font-bold text-sm",
                        formData.goals.includes(goal.id) ? "text-primary-900 dark:text-white" : "text-slate-600 dark:text-slate-600"
                      )}>
                        {goal.label}
                      </span>
                      {formData.goals.includes(goal.id) && (
                        <CheckCircle2 size={20} className="ml-auto text-primary-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="p-8 pt-0 flex gap-3 sm:justify-between items-center mt-4">
          <Button
            variant="ghost"
            onClick={handleBack}
            className={cn(
              "rounded-xl h-12 px-6 font-bold text-slate-600 hover:text-slate-900 dark:hover:text-white transition-all",
              currentStep === 0 && "opacity-0 pointer-events-none"
            )}
          >
            <ChevronLeft size={20} className="mr-2" />
            Back
          </Button>

          <Button
            onClick={handleNext}
            disabled={saving || (currentStep === 0 && !formData.income)}
            className="rounded-xl h-12 px-8 bg-slate-900 dark:bg-primary-600 hover:bg-primary-700 text-white font-bold transition-all shadow-lg shadow-primary-500/20 min-w-[140px]"
          >
            {saving ? (
              "Building Profile..."
            ) : (
              <>
                {currentStep === STEPS.length - 1 ? "Complete Setup" : "Continue"}
                <ChevronRight size={20} className="ml-2" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
