"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import {
    TrendingUp,
    Shield,
    CreditCard,
    PiggyBank,
    ArrowRight,
    CheckCircle2,
    Sparkles,
    Users,
    Briefcase,
    Home,
    Zap,
    Star,
    ChevronRight,
    Clock,
    BarChart3,
    Percent,
    Gift,
    Landmark,
    BadgeCheck
} from "lucide-react";
import Link from 'next/link';
import { cn } from '@/lib/utils';

type GoalType = 'build_wealth' | 'save_money' | 'protect_family' | 'improve_credit' | null;
type LifeStage = 'student' | 'young_professional' | 'established' | 'retirement' | null;

interface Recommendation {
    category: string;
    title: string;
    description: string;
    link: string;
    icon: React.ReactNode;
    priority: 'high' | 'medium';
    matchScore: number;
    features: string[];
}

// Product types for typewriter
const rotatingProducts = [
    { text: 'Credit Card', gradient: 'from-secondary-500 to-secondary-600' },
    { text: 'Mutual Fund', gradient: 'from-primary-500 to-primary-600' },
    { text: 'Insurance Plan', gradient: 'from-accent-500 to-accent-600' },
    { text: 'Savings Account', gradient: 'from-success-500 to-success-600' },
];

// Avatar data for social proof
// Avatar data for social proof (Real Human Headshots)
const avatarData = [
    { img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces", alt: "User 1" }, 
    { img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop&crop=faces", alt: "User 2" }, 
    { img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=faces", alt: "User 3" }, 
    { img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=faces", alt: "User 4" }, 
    { img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=faces", alt: "User 5" }, 
];

export default function SmartAdvisorWidget() {
    const [step, setStep] = useState<'intro' | 'goal' | 'lifestage' | 'results'>('intro');
    const [primaryGoal, setPrimaryGoal] = useState<GoalType>(null);
    const [lifeStage, setLifeStage] = useState<LifeStage>(null);
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [currentProductIndex, setCurrentProductIndex] = useState(0);
    const [displayedCount, setDisplayedCount] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentProductIndex((prev) => (prev + 1) % rotatingProducts.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const target = 52847;
        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                setDisplayedCount(target);
                clearInterval(timer);
            } else {
                setDisplayedCount(Math.floor(current));
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, []);

    const goals = [
        { id: 'build_wealth' as GoalType, label: 'Build Wealth', icon: TrendingUp, desc: 'Grow capital through smart investments', colorClass: 'text-primary-600 dark:text-primary-400', bgClass: 'bg-primary-100 dark:bg-primary-500/20' },
        { id: 'save_money' as GoalType, label: 'Save Money', icon: PiggyBank, desc: 'Maximize savings with best rates', colorClass: 'text-secondary-600 dark:text-secondary-400', bgClass: 'bg-secondary-100 dark:bg-secondary-500/20' },
        { id: 'protect_family' as GoalType, label: 'Protect Family', icon: Shield, desc: 'Secure loved ones with insurance', colorClass: 'text-accent-600 dark:text-accent-400', bgClass: 'bg-accent-100 dark:bg-accent-500/20' },
        { id: 'improve_credit' as GoalType, label: 'Improve Credit', icon: CreditCard, desc: 'Boost your credit score fast', colorClass: 'text-success-600 dark:text-success-400', bgClass: 'bg-success-100 dark:bg-success-500/20' },
    ];

    const lifeStages = [
        { id: 'student' as LifeStage, label: 'Student / Beginner', icon: Users, desc: 'Just starting out' },
        { id: 'young_professional' as LifeStage, label: 'Young Professional', icon: Briefcase, desc: '25-35 years' },
        { id: 'established' as LifeStage, label: 'Established / Family', icon: Home, desc: 'Settled with goals' },
        { id: 'retirement' as LifeStage, label: 'Pre-Retirement', icon: Landmark, desc: '50+ planning ahead' },
    ];

    const handleGoalSelect = (goal: GoalType) => {
        setPrimaryGoal(goal);
        setStep('lifestage');
    };

    const handleLifeStageSelect = (stage: LifeStage) => {
        setLifeStage(stage);
        generateRecommendations(primaryGoal, stage);
        setTimeout(() => setStep('results'), 800);
    };

    const generateRecommendations = (goal: GoalType, stage: LifeStage) => {
        const recs: Recommendation[] = [];
        
        if (goal === 'build_wealth') {
            recs.push({
                category: 'Mutual Funds',
                title: 'Axis Bluechip Fund',
                description: 'Large-cap equity fund with consistent 15%+ CAGR.',
                link: '/mutual-funds',
                icon: <TrendingUp className="w-5 h-5 text-primary-600 dark:text-primary-400" />,
                priority: 'high',
                matchScore: 98,
                features: ['Low Expense Ratio', 'SIP from ₹500', '5-Star Rated']
            });
        } else if (goal === 'improve_credit') {
             recs.push({
                category: 'Credit Cards',
                title: 'HDFC Millennia Card',
                description: '5% cashback on online spends, easy approval.',
                link: '/credit-cards',
                icon: <CreditCard className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />,
                priority: 'high',
                matchScore: 95,
                features: ['No Annual Fee Y1', '5% Cashback', 'Lounge Access']
            });
        } else if (goal === 'protect_family') {
            recs.push({
                category: 'Term Insurance',
                title: 'ICICI iProtect Smart',
                description: '₹1 Crore cover at just ₹490/month.',
                link: '/insurance',
                icon: <Shield className="w-5 h-5 text-accent-600 dark:text-accent-400" />,
                priority: 'high',
                matchScore: 96,
                features: ['₹1Cr Cover', 'Critical Illness', 'Tax Benefit']
            });
        } else {
             recs.push({
                category: 'Savings Account',
                title: 'Jupiter Pro Savings',
                description: 'Earn up to 7% interest with zero balance.',
                link: '/banking',
                icon: <PiggyBank className="w-5 h-5 text-success-600 dark:text-success-400" />,
                priority: 'high',
                matchScore: 92,
                features: ['7% Interest', 'Zero Balance', 'Instant UPI']
            });
        }
        setRecommendations(recs);
    };

    const reset = () => {
        setStep('intro');
        setPrimaryGoal(null);
        setLifeStage(null);
        setRecommendations([]);
    };

    return (
        <section className="py-16 md:py-24 bg-muted/30 dark:bg-muted/10 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-200/40 dark:bg-primary-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-secondary-200/40 dark:bg-secondary-500/10 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <motion.div 
                    className="relative overflow-hidden rounded-2xl shadow-xl border border-border bg-card"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                >
                    {/* Top accent bar */}
                    <div className="h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500" />
                    
                    <div className="relative grid lg:grid-cols-5 min-h-[520px]">
                        
                        {/* LEFT: Interaction Area */}
                        <div className="lg:col-span-3 p-8 md:p-12 lg:p-14 flex flex-col justify-center">
                            
                            <AnimatePresence mode="wait">
                                {/* INTRO STATE */}
                                {step === 'intro' && (
                                    <motion.div 
                                        key="intro"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        {/* Badge */}
                                        <Badge className="mb-6 bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-primary-500/30 px-4 py-2 text-sm">
                                            <Zap className="w-4 h-4 mr-2 text-primary-600 dark:text-primary-400" />
                                            AI-Powered Smart Advisor
                                        </Badge>

                                        {/* Headline */}
                                        <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-foreground mb-2 leading-tight tracking-tight">
                                            Find Your Perfect
                                        </h2>
                                        
                                        {/* Animated product text */}
                                        <div className="h-14 md:h-16 mb-6 overflow-hidden">
                                            <AnimatePresence mode="wait">
                                                <motion.div
                                                    key={currentProductIndex}
                                                    initial={{ opacity: 0, y: 40 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -40 }}
                                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                                    className={cn(
                                                        "text-3xl md:text-4xl lg:text-[2.75rem] font-bold bg-clip-text text-transparent bg-gradient-to-r",
                                                        rotatingProducts[currentProductIndex].gradient
                                                    )}
                                                >
                                                    {rotatingProducts[currentProductIndex].text}
                                                    <motion.span 
                                                        className="inline-block w-1 h-8 md:h-10 bg-primary-500 ml-1 align-middle rounded-full"
                                                        animate={{ opacity: [1, 0] }}
                                                        transition={{ duration: 0.6, repeat: Infinity }}
                                                    />
                                                </motion.div>
                                            </AnimatePresence>
                                        </div>

                                        <p className="text-muted-foreground text-lg max-w-lg mb-8 leading-relaxed">
                                            Answer <span className="text-foreground font-semibold">2 simple questions</span> and our AI analyzes 500+ products to find your best match in seconds.
                                        </p>

                                        {/* Social Proof */}
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="flex -space-x-4">
                                                {avatarData.map((avatar, i) => (
                                                    <motion.div 
                                                        key={i} 
                                                        className="w-10 h-10 rounded-full border-2 border-background overflow-hidden shadow-lg relative z-10"
                                                        initial={{ scale: 0, x: -10 }}
                                                        animate={{ scale: 1, x: 0 }}
                                                        transition={{ delay: 0.2 + i * 0.1, type: "spring" }}
                                                    >
                                                        <img 
                                                            src={avatar.img} 
                                                            alt={avatar.alt}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </motion.div>
                                                ))}
                                            </div>
                                            <div className="text-sm">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-bold text-foreground text-lg tabular-nums">
                                                        {displayedCount.toLocaleString()}+
                                                    </span>
                                                    <BadgeCheck className="w-4 h-4 text-primary-500" />
                                                </div>
                                                <span className="text-muted-foreground">users found their match</span>
                                            </div>
                                        </div>

                                        {/* CTA Button */}
                                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                            <Button 
                                                size="lg" 
                                                onClick={() => setStep('goal')}
                                                className="h-14 px-8 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-bold text-lg shadow-lg shadow-primary-500/25 rounded-xl group relative overflow-hidden"
                                            >
                                                <span className="relative z-10 flex items-center">
                                                    Get My Recommendations
                                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                </span>
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                            </Button>
                                        </motion.div>
                                        
                                        {/* Trust badges */}
                                        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground mt-8">
                                            <span className="flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-success-500" /> 
                                                No signup needed
                                            </span>
                                            <span className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-success-500" /> 
                                                30 seconds
                                            </span>
                                            <span className="flex items-center gap-2">
                                                <Gift className="w-4 h-4 text-success-500" /> 
                                                100% Free
                                            </span>
                                        </div>
                                    </motion.div>
                                )}

                                {/* GOAL SELECTION */}
                                {step === 'goal' && (
                                    <motion.div
                                        key="goal"
                                        initial={{ opacity: 0, x: 30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -30 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        {/* Progress indicator */}
                                        <div className="flex items-center gap-3 mb-8">
                                            <div className="flex items-center gap-2">
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-white flex items-center justify-center text-sm font-bold shadow-lg shadow-primary-500/30">
                                                    1
                                                </div>
                                                <div className="w-12 h-1 bg-muted rounded-full overflow-hidden">
                                                    <motion.div 
                                                        className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: "50%" }}
                                                        transition={{ delay: 0.2, duration: 0.5 }}
                                                    />
                                                </div>
                                                <div className="w-9 h-9 rounded-full bg-muted border border-border text-muted-foreground flex items-center justify-center text-sm">
                                                    2
                                                </div>
                                            </div>
                                            <span className="text-muted-foreground text-sm ml-2">Step 1 of 2</span>
                                        </div>

                                        <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">What's your main goal?</h3>
                                        <p className="text-muted-foreground mb-8">Choose what matters most to you right now</p>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {goals.map((goal, index) => (
                                                <motion.button
                                                    key={goal.id}
                                                    onClick={() => handleGoalSelect(goal.id)}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    whileHover={{ scale: 1.02, y: -2 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="relative p-5 rounded-xl border border-border hover:border-primary-500/50 transition-all group text-left bg-background hover:bg-muted/50"
                                                >
                                                    <div className="flex items-start">
                                                        <div className={cn("p-3 rounded-xl mr-4 transition-all group-hover:scale-110", goal.bgClass)}>
                                                            <goal.icon className={cn("w-6 h-6", goal.colorClass)} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-semibold text-foreground text-lg mb-1">{goal.label}</div>
                                                            <div className="text-sm text-muted-foreground">{goal.desc}</div>
                                                        </div>
                                                    </div>
                                                </motion.button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* LIFE STAGE */}
                                {step === 'lifestage' && (
                                    <motion.div
                                        key="lifestage"
                                        initial={{ opacity: 0, x: 30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -30 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        {/* Progress */}
                                        <div className="flex items-center gap-3 mb-8">
                                            <div className="flex items-center gap-2">
                                                <div className="w-9 h-9 rounded-full bg-success-500 text-white flex items-center justify-center shadow-lg shadow-success-500/30">
                                                    <CheckCircle2 className="w-5 h-5" />
                                                </div>
                                                <div className="w-12 h-1 bg-gradient-to-r from-success-500 to-primary-500 rounded-full" />
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-white flex items-center justify-center text-sm font-bold shadow-lg shadow-primary-500/30">
                                                    2
                                                </div>
                                            </div>
                                            <span className="text-muted-foreground text-sm ml-2">Step 2 of 2</span>
                                            <button 
                                                onClick={() => setStep('goal')} 
                                                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 ml-auto transition-colors"
                                            >
                                                ← Back
                                            </button>
                                        </div>

                                        <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Your life stage?</h3>
                                        <p className="text-muted-foreground mb-8">This helps us personalize your recommendations</p>
                                        
                                        <div className="space-y-3">
                                            {lifeStages.map((stage, index) => (
                                                <motion.button
                                                    key={stage.id}
                                                    onClick={() => handleLifeStageSelect(stage.id)}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    whileHover={{ scale: 1.01, x: 4 }}
                                                    whileTap={{ scale: 0.99 }}
                                                    className="w-full flex items-center p-4 rounded-xl bg-background border border-border hover:border-primary-500/50 hover:bg-muted/50 transition-all group text-left"
                                                >
                                                    <div className="p-2.5 rounded-lg bg-muted mr-4 group-hover:bg-primary-100 dark:group-hover:bg-primary-500/20 transition-colors">
                                                        <stage.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <span className="font-medium text-foreground">{stage.label}</span>
                                                        <span className="text-sm text-muted-foreground ml-2">— {stage.desc}</span>
                                                    </div>
                                                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                                                </motion.button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* RESULTS */}
                                {step === 'results' && recommendations.length > 0 && (
                                    <motion.div
                                       key="results"
                                       initial={{ opacity: 0, scale: 0.95 }}
                                       animate={{ opacity: 1, scale: 1 }}
                                       transition={{ duration: 0.5 }}
                                    >
                                        <div className="flex items-center justify-between mb-6">
                                            <Badge className="bg-success-100 dark:bg-success-500/20 text-success-700 dark:text-success-300 border-success-200 dark:border-success-500/30 px-4 py-1.5">
                                                <Sparkles className="w-4 h-4 mr-2" />
                                                Top Match Found!
                                            </Badge>
                                            <button onClick={reset} className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                                                Start Over <ArrowRight className="w-3 h-3" />
                                            </button>
                                        </div>

                                        {/* Result Card */}
                                        <motion.div 
                                            className="relative bg-muted/50 dark:bg-muted/30 rounded-2xl p-6 border border-border overflow-hidden"
                                            initial={{ y: 20 }}
                                            animate={{ y: 0 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <div className="absolute top-0 right-0 w-40 h-40 bg-success-500/10 rounded-full blur-3xl" />
                                            
                                            <div className="relative z-10">
                                                <div className="flex items-start gap-4 mb-5">
                                                    <div className="p-4 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-500/20 dark:to-secondary-500/20 rounded-xl border border-primary-200 dark:border-primary-500/20">
                                                        {recommendations[0].icon}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1.5">
                                                            <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{recommendations[0].category}</span>
                                                            <Badge className="bg-success-100 dark:bg-success-500/20 text-success-700 dark:text-success-400 border-0 text-xs px-2 py-0.5">
                                                                {recommendations[0].matchScore}% Match
                                                            </Badge>
                                                        </div>
                                                        <h4 className="font-bold text-foreground text-xl mb-1">
                                                            {recommendations[0].title}
                                                        </h4>
                                                        <p className="text-muted-foreground text-sm">
                                                            {recommendations[0].description}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Features */}
                                                <div className="flex flex-wrap gap-2 mb-6">
                                                    {recommendations[0].features.map((feature, i) => (
                                                        <motion.span 
                                                            key={i}
                                                            initial={{ opacity: 0, scale: 0.8 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            transition={{ delay: 0.4 + i * 0.1 }}
                                                            className="px-3 py-1.5 bg-background rounded-lg text-xs text-foreground font-medium border border-border"
                                                        >
                                                            <CheckCircle2 className="w-3 h-3 inline mr-1.5 text-success-500" />
                                                            {feature}
                                                        </motion.span>
                                                    ))}
                                                </div>

                                                <div className="flex gap-3">
                                                    <Button 
                                                        className="flex-1 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-semibold shadow-lg shadow-primary-500/20 rounded-xl" 
                                                        asChild
                                                    >
                                                        <Link href={recommendations[0].link}>
                                                            View Details
                                                            <ArrowRight className="w-4 h-4 ml-2" />
                                                        </Link>
                                                    </Button>
                                                    <Button 
                                                        variant="outline" 
                                                        className="h-12 border-border text-foreground hover:bg-muted rounded-xl"
                                                        asChild
                                                    >
                                                        <Link href="/compare">
                                                            Compare
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* RIGHT: Visual Preview */}
                        <div className="hidden lg:flex lg:col-span-2 relative items-center justify-center p-6 overflow-hidden bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-950/50 dark:to-secondary-950/50 border-l border-border">
                            {/* Grid pattern */}
                            <div 
                                className="absolute inset-0 opacity-30 dark:opacity-10" 
                                style={{ 
                                    backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', 
                                    backgroundSize: '20px 20px' 
                                }} 
                            />
                            
                            <AnimatePresence mode="wait">
                                {/* Intro: Stacked product cards */}
                                {step === 'intro' && (
                                    <motion.div 
                                        key="intro-preview"
                                        className="relative w-full max-w-[280px]"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        {/* Background cards */}
                                        <motion.div 
                                            className="absolute top-8 left-4 right-4 h-44 bg-card/60 dark:bg-card/40 rounded-2xl border border-border/50"
                                            animate={{ y: [0, -4, 0] }}
                                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                        />
                                        <motion.div 
                                            className="absolute top-4 left-2 right-2 h-44 bg-card/80 dark:bg-card/60 rounded-2xl border border-border/60"
                                            animate={{ y: [0, -3, 0] }}
                                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.25 }}
                                        />
                                        
                                        {/* Main card */}
                                        <motion.div 
                                            className="relative bg-card rounded-2xl p-5 border border-border shadow-xl"
                                            animate={{ y: [0, -5, 0] }}
                                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <Badge className="bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300 border-0 text-xs">
                                                    <Star className="w-3 h-3 mr-1 fill-primary-500 text-primary-500" />
                                                    Top Pick
                                                </Badge>
                                                <div className="flex gap-0.5">
                                                    {[1,2,3,4,5].map(i => (
                                                        <Star key={i} className="w-3 h-3 text-accent-500 fill-accent-500" />
                                                    ))}
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary-500 to-secondary-600 flex items-center justify-center shadow-lg shadow-secondary-500/30">
                                                    <CreditCard className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-foreground">HDFC Regalia</div>
                                                    <div className="text-sm text-muted-foreground">Premium Card</div>
                                                </div>
                                            </div>

                                            <div className="flex gap-2 mb-4">
                                                <span className="px-2.5 py-1 text-xs bg-muted rounded-md text-foreground">5% Cashback</span>
                                                <span className="px-2.5 py-1 text-xs bg-muted rounded-md text-foreground">₹0 Fee</span>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-muted-foreground">Match Score</span>
                                                    <span className="text-success-600 dark:text-success-400 font-semibold">94%</span>
                                                </div>
                                                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                                    <motion.div 
                                                        className="h-full bg-gradient-to-r from-success-500 to-primary-500 rounded-full"
                                                        initial={{ width: "0%" }}
                                                        animate={{ width: "94%" }}
                                                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>

                                        {/* Floating stats */}
                                        <motion.div 
                                            className="absolute -top-2 -right-2 bg-card backdrop-blur-md p-3 rounded-xl border border-border shadow-lg"
                                            animate={{ y: [0, -6, 0], rotate: [0, 2, 0] }}
                                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                        >
                                            <div className="flex items-center gap-2">
                                                <BarChart3 className="w-4 h-4 text-success-500" />
                                                <span className="text-sm text-foreground font-bold">15% Returns</span>
                                            </div>
                                        </motion.div>

                                        <motion.div 
                                            className="absolute -bottom-2 -left-2 bg-card backdrop-blur-md p-3 rounded-xl border border-border shadow-lg"
                                            animate={{ y: [0, 6, 0], rotate: [0, -2, 0] }}
                                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Percent className="w-4 h-4 text-accent-500" />
                                                <span className="text-sm text-foreground font-bold">Save ₹12K/yr</span>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                )}

                                {/* Questions: Analyzing */}
                                {(step === 'goal' || step === 'lifestage') && (
                                    <motion.div 
                                        key="analyzing"
                                        className="text-center"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                    >
                                        <motion.div 
                                            className="relative w-24 h-24 mx-auto mb-6"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                        >
                                            <div className="absolute inset-0 rounded-full border-2 border-primary-200 dark:border-primary-500/30 border-t-primary-500" />
                                            <div className="absolute inset-2 rounded-full border-2 border-secondary-200 dark:border-secondary-500/30 border-b-secondary-500" />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Sparkles className="w-8 h-8 text-primary-500" />
                                            </div>
                                        </motion.div>
                                        <div className="text-foreground font-semibold text-lg mb-2">Analyzing 500+ Products</div>
                                        <div className="text-muted-foreground text-sm">Finding your best matches...</div>
                                        
                                        <div className="flex justify-center gap-2 mt-6">
                                            {[0, 1, 2].map(i => (
                                                <motion.div
                                                    key={i}
                                                    className="w-2.5 h-2.5 rounded-full bg-primary-500"
                                                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                                                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                                />
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Results: Success */}
                                {step === 'results' && (
                                    <motion.div 
                                        key="success"
                                        className="text-center"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                    >
                                        <motion.div 
                                            className="w-28 h-28 mx-auto mb-6 rounded-full bg-success-100 dark:bg-success-500/20 flex items-center justify-center border-2 border-success-300 dark:border-success-500/50 shadow-xl shadow-success-500/20"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                                        >
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.4, type: "spring" }}
                                            >
                                                <CheckCircle2 className="w-14 h-14 text-success-600 dark:text-success-400" />
                                            </motion.div>
                                        </motion.div>
                                        <motion.div 
                                            className="text-foreground font-bold text-xl mb-2"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 }}
                                        >
                                            Perfect Match!
                                        </motion.div>
                                        <motion.div 
                                            className="text-muted-foreground text-sm"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.6 }}
                                        >
                                            {recommendations[0]?.matchScore}% compatibility score
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
