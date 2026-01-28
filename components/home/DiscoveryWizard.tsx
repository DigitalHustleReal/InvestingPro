"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  CreditCard, 
  Utensils, 
  Plane, 
  ShoppingBag, 
  Zap,
  TrendingUp,
  ShieldCheck,
  Star,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface Question {
  id: number;
  title: string;
  subtitle: string;
  options: {
    label: string;
    value: string;
    icon: any;
    desc?: string;
  }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    title: "Where do you spend the most?",
    subtitle: "Select your primary spending category to maximize rewards.",
    options: [
      { label: "Dining & Food", value: "dining", icon: Utensils, desc: "Swiggy, Zomato, Restaurants" },
      { label: "Travel & Fuel", value: "travel", icon: Plane, desc: "Flights, Hotels, Petrol" },
      { label: "Online Shopping", value: "shopping", icon: ShoppingBag, desc: "Amazon, Flipkart, Myntra" },
      { label: "All-rounder", value: "general", icon: CreditCard, desc: "Utilities, Rent, Grocery" },
    ]
  },
  {
    id: 2,
    title: "What's your monthly spend?",
    subtitle: "Higher spending often justifies higher annual fees for better rewards.",
    options: [
      { label: "Under ₹20,000", value: "low", icon: Zap, desc: "Great for entry-level cards" },
      { label: "₹20,000 - ₹50,000", value: "medium", icon: TrendingUp, desc: "Sweet spot for rewards" },
      { label: "Over ₹50,000", value: "high", icon: Sparkles, desc: "Best for premium/travel cards" },
      { label: "Just starting out", value: "none", icon: ShieldCheck, desc: "Credit building cards" },
    ]
  },
  {
    id: 3,
    title: "What matters most to you?",
    subtitle: "Different cards prioritize different benefit structures.",
    options: [
      { label: "Direct Cashback", value: "cashback", icon: CheckCircle2, desc: "Money back to statement" },
      { label: "Airmiles & Points", value: "rewards", icon: Plane, desc: "Free flights & upgrades" },
      { label: "Lounge & Luxury", value: "luxury", icon: Star, desc: "Premium lifestyle perks" },
      { label: "Zero Fees", value: "free", icon: ShieldCheck, desc: "No annual fee, ever" },
    ]
  }
];

export default function DiscoveryWizard() {
  const [step, setStep] = useState(0); // 0 is start, 1-3 are questions, 4 is results
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleOptionSelect = (questionId: number, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    if (step < QUESTIONS.length) {
      setTimeout(() => setStep(step + 1), 300);
    } else {
      showResults();
    }
  };

  const showResults = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setStep(QUESTIONS.length + 1);
    }, 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-2xl overflow-hidden min-h-[500px] flex flex-col">
        
        {/* Progress Header */}
        {step > 0 && step <= QUESTIONS.length && (
          <div className="px-8 pt-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-600">Question {step} of {QUESTIONS.length}</span>
              <button onClick={() => setStep(step - 1)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
               <motion.div 
                className="h-full bg-primary-500"
                initial={{ width: 0 }}
                animate={{ width: `${(step / QUESTIONS.length) * 100}%` }}
               />
            </div>
          </div>
        )}

        <div className="flex-1 p-8 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            
            {/* Step 0: Initial Screen */}
            {step === 0 && (
              <motion.div 
                key="start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center space-y-8"
              >
                <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3">
                   <Sparkles className="w-10 h-10 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4 font-heading tracking-tight">
                    Find Your Perfect Card <br />in 2 Minutes.
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 text-lg max-w-md mx-auto">
                    Answer 3 simple questions and our algorithm will pick the best card for your spending habits.
                  </p>
                </div>
                <Button 
                  onClick={() => setStep(1)}
                  size="lg" 
                  className="bg-primary-600 hover:bg-primary-700 text-white h-14 px-10 rounded-2xl font-black text-lg shadow-xl shadow-primary-600/20 group"
                >
                  Start Discovery <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                  No Personal Data Required
                </p>
              </motion.div>
            )}

            {/* Questions Step */}
            {step > 0 && step <= QUESTIONS.length && (
              <motion.div 
                key={`q-${step}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full h-full flex flex-col"
              >
                <div className="mb-10 text-center md:text-left">
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-2 font-heading tracking-tight">
                    {QUESTIONS[step - 1].title}
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">
                    {QUESTIONS[step - 1].subtitle}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {QUESTIONS[step - 1].options.map((option, idx) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleOptionSelect(step, option.value)}
                        className={cn(
                          "group flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-300",
                          "bg-slate-50 dark:bg-slate-800/50 border-transparent hover:border-primary-500/50",
                          "hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl hover:shadow-primary-500/5"
                        )}
                      >
                        <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                           <Icon className="w-6 h-6 text-slate-600 dark:text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white mb-0.5 group-hover:text-primary-600 transition-colors">{option.label}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{option.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Analyzing Step */}
            {isAnalyzing && (
              <motion.div 
                key="analyzing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center space-y-6"
              >
                <div className="relative w-24 h-24 mx-auto">
                   <div className="absolute inset-0 border-4 border-primary-100 dark:border-primary-900 rounded-full" />
                   <div className="absolute inset-0 border-4 border-primary-600 rounded-full border-t-transparent animate-spin" />
                   <div className="absolute inset-0 flex items-center justify-center">
                      <CreditCard className="w-8 h-8 text-primary-600 animate-pulse" />
                   </div>
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white font-heading">Analyzing Your Spend Patterns...</h3>
                  <p className="text-sm text-slate-500 mt-2">Checking 500+ cards for the best match.</p>
                </div>
              </motion.div>
            )}

            {/* Results Step */}
            {step > QUESTIONS.length && !isAnalyzing && (
              <motion.div 
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full text-center"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-100 dark:border-emerald-800 mb-6">
                   <ShieldCheck className="w-4 h-4" />
                   <span className="text-[10px] font-black uppercase tracking-[0.2em]">Match found</span>
                </div>
                <h2 className="text-3xl font-heading font-black text-slate-900 dark:text-white mb-8">Your Personalized Results</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                   {/* Recommendation Card */}
                   <div className="p-6 rounded-2xl border border-primary-100 bg-white shadow-xl">
                      <div className="flex justify-between items-start mb-4">
                         <div className="w-12 h-8 bg-slate-900 rounded shadow-md" />
                         <BadgeCheck />
                      </div>
                      <h4 className="font-bold text-lg mb-1">HDFC Regalia Gold</h4>
                      <p className="text-xs text-slate-500 mb-4">Excellent for Travel & Dining</p>
                      <ul className="space-y-2 mb-6 text-xs text-slate-600">
                         <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            Complimentary Airport Lounge Access
                         </li>
                         <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            5x Rewards on Myntra, Swiggy, Zomato
                         </li>
                      </ul>
                      <Button className="w-full bg-slate-900 text-white rounded-xl h-10 text-xs">View Details</Button>
                   </div>

                   <button 
                     onClick={() => setStep(0)}
                     className="flex items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors text-slate-500 font-bold"
                   >
                     Redo Quiz
                   </button>
                </div>
              </motion.div>
            )}
            
          </AnimatePresence>
        </div>

        {/* Footer info */}
        <div className="px-8 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-center gap-6">
           <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-500">
              <ShieldCheck className="w-3 h-3" />
              100% Secure
           </div>
           <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-500">
              <BadgeCheck className="w-3 h-3" />
              Verified Data
           </div>
        </div>
      </div>
    </div>
  );
}

function BadgeCheck() {
  return (
    <div className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-black uppercase tracking-tighter">
      98% Match
    </div>
  )
}
