"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { 
    Wallet, 
    TrendingDown, 
    TrendingUp, 
    PiggyBank, 
    Plus, 
    Trash2, 
    BarChart3,
    PieChart
} from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { toast } from 'sonner';
import MarketOverview from '@/components/market/MarketOverview';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

interface Transaction {
    id: string;
    amount: number;
    category: string;
    description: string;
    date: string;
}

const CATEGORIES = ['Food', 'Rent', 'Shopping', 'Travel', 'Investing', 'Other'];

export default function PersonalDashboard() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Food');
    const [description, setDescription] = useState('');
    const [budget, setBudget] = useState(50000); // Sample monthly budget

    // Load from local storage
    useEffect(() => {
        const saved = localStorage.getItem('personal_expenses');
        if (saved) setTransactions(JSON.parse(saved));
    }, []);

    // Save to local storage
    useEffect(() => {
        localStorage.setItem('personal_expenses', JSON.stringify(transactions));
    }, [transactions]);

    const addTransaction = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || isNaN(Number(amount))) return;

        const newTx: Transaction = {
            id: Date.now().toString(),
            amount: Number(amount),
            category,
            description,
            date: new Date().toLocaleDateString()
        };

        setTransactions([newTx, ...transactions]);
        setAmount('');
        setDescription('');
        toast.success("Expense added!");
    };

    const deleteTransaction = (id: string) => {
        setTransactions(transactions.filter(t => t.id !== id));
        toast.info("Transaction deleted");
    };

    const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
    const remainingBudget = budget - totalSpent;
    const savingsRate = ((budget - totalSpent) / budget) * 100;

    // Chart Data
    const categoryTotals = CATEGORIES.map(cat => 
        transactions.filter(t => t.category === cat).reduce((sum, t) => sum + t.amount, 0)
    );

    const pieData = {
        labels: CATEGORIES,
        datasets: [{
            data: categoryTotals,
            backgroundColor: [
                '#0d9488', '#0891b2', '#2563eb', '#7c3aed', '#db2777', '#4b5563'
            ],
            borderWidth: 0
        }]
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-20 px-4 md:px-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">Investment Dashboard</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Tracking your wealth building journey.</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => toast.info("Export to Excel coming soon!")} className="dark:text-white dark:border-slate-700">Export Data</Button>
                        <Button size="sm" className="bg-primary-600 hover:bg-primary-700 text-white">Connect Bank</Button>
                    </div>
                </header>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="border-none shadow-sm bg-primary-600 text-white dark:bg-primary-600/90">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <Wallet className="w-5 h-5 opacity-80" />
                                <Badge className="bg-primary-500 border-none text-[10px] text-white">Monthy</Badge>
                            </div>
                            <div className="text-2xl font-bold">₹{totalSpent}</div>
                            <div className="text-xs opacity-80 mt-1">Total Spent This Month</div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
                        <CardContent className="p-6 text-slate-900 dark:text-white">
                            <div className="flex justify-between items-start mb-4">
                                <TrendingDown className="w-5 h-5 text-rose-500" />
                            </div>
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">₹{remainingBudget}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Remaining Budget</div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <PiggyBank className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                            </div>
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">{savingsRate.toFixed(1)}%</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Savings Rate</div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <TrendingUp className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                            </div>
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">₹2.4L</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Total Net Worth</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Market Intelligence Tier - NEW */}
                <div className="mb-6">
                     <MarketOverview />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Entry Form & History */}
                    <div className="lg:col-span-8 space-y-8">
                        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-lg text-slate-900 dark:text-white">Add New Transaction</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={addTransaction} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <Input 
                                        type="number" 
                                        placeholder="Amount" 
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        required
                                        className="bg-slate-50 dark:bg-slate-800"
                                    />
                                    <select 
                                        className="h-10 border rounded-md px-3 bg-white dark:bg-slate-800 dark:border-slate-700 text-sm dark:text-white"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    >
                                        {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                    <Input 
                                        placeholder="Description (e.g. Dinner)" 
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="bg-slate-50 dark:bg-slate-800"
                                    />
                                    <Button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white">
                                        <Plus className="w-4 h-4 mr-2" /> Add
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-lg text-slate-900 dark:text-white">Recent Transactions</CardTitle>
                                <BarChart3 className="w-4 h-4 text-slate-400" />
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {transactions.length === 0 ? (
                                        <div className="p-8 text-center text-slate-400">No transactions yet</div>
                                    ) : (
                                        transactions.slice(0, 10).map(t => (
                                            <div key={t.id} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold">
                                                        {t.category[0]}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-slate-900 dark:text-white">{t.description || t.category}</div>
                                                        <div className="text-xs text-slate-400">{t.date}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="text-right">
                                                        <div className="font-bold text-slate-900 dark:text-white">₹{t.amount}</div>
                                                        <div className="text-[10px] text-slate-400 uppercase font-bold">{t.category}</div>
                                                    </div>
                                                    <button 
                                                        onClick={() => deleteTransaction(t.id)}
                                                        className="p-2 text-slate-300 hover:text-rose-500"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Analytics Sidebar */}
                    <div className="lg:col-span-4 space-y-8">
                        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-6 md:p-8 text-slate-900 dark:text-white">
                                    <PieChart className="w-4 h-4 text-primary-600" /> Spending Mix
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="aspect-square">
                                    <Pie data={pieData} options={{ maintainAspectRatio: false }} />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-primary-600 to-success-600 text-white border-none shadow-xl shadow-primary-500/10">
                            <CardContent className="p-6">
                                <h3 className="font-bold text-lg mb-2">Smart Saving Tip</h3>
                                <p className="text-sm opacity-90 leading-relaxed mb-4">
                                    You're spending 35% on 'Shopping'. If you reduce it to 20%, you could potentially reach your FIRE goal 2 years earlier!
                                </p>
                                <Button variant="secondary" size="sm" className="w-full bg-white text-primary-900 hover:bg-slate-100">View Savings Plan</Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
            {children}
        </span>
    );
}
