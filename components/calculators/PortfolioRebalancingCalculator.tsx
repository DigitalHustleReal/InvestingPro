"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { Slider } from "@/components/ui/slider";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { RefreshCw, ArrowRight, TrendingUp, TrendingDown, DollarSign } from "lucide-react";

interface AssetClass {
  name: string;
  currentValue: number;
  targetAllocation: number; // Percentage
  color: string;
}

export default function PortfolioRebalancingCalculator() {
  const [assets, setAssets] = useState<AssetClass[]>([
    { name: "Equity (Stocks)", currentValue: 500000, targetAllocation: 60, color: "#10b981" }, // Emerald 500
    { name: "Debt (Bonds/FD)", currentValue: 300000, targetAllocation: 30, color: "#3b82f6" }, // Blue 500
    { name: "Gold / Others", currentValue: 50000, targetAllocation: 10, color: "#f59e0b" },   // Amber 500
  ]);

  const [totalValue, setTotalValue] = useState(0);
  const [actions, setActions] = useState<{ name: string; action: "BUY" | "SELL"; amount: number }[]>([]);

  useEffect(() => {
    const total = assets.reduce((sum, asset) => sum + (asset.currentValue || 0), 0);
    setTotalValue(total);
    calculateRebalancing(total);
  }, [assets]);

  const handleValueChange = (index: number, value: string) => {
    const newAssets = [...assets];
    newAssets[index].currentValue = parseFloat(value) || 0;
    setAssets(newAssets);
  };

  const handleAllocationChange = (index: number, value: number) => {
    const newAssets = [...assets];
    newAssets[index].targetAllocation = value;
    // Note: In a real app, we'd need to ensure total allocation sums to 100%
    // unique logic to auto-adjust others could go here, but kept simple for MVP
    setAssets(newAssets);
  };

  const calculateRebalancing = (total: number) => {
    if (total === 0) return;
    
    const newActions = assets.map(asset => {
      const targetValue = (total * asset.targetAllocation) / 100;
      const difference = targetValue - asset.currentValue;
      
      return {
        name: asset.name,
        action: difference > 0 ? "BUY" : "SELL",
        amount: Math.abs(difference)
      };
    // Type assertion to fix the mismatch
    }) as { name: string; action: "BUY" | "SELL"; amount: number }[];

    setActions(newActions);
  };

  const currentAllocationData = assets.map(a => ({ name: a.name, value: a.currentValue }));
  const targetAllocationData = assets.map(a => ({ name: a.name, value: a.targetAllocation }));

  return (
    <div className="space-y-8">
      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Input Section */}
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary-600" /> Current Portfolio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {assets.map((asset, index) => (
              <div key={index} className="space-y-3 pb-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: asset.color }}></div>
                    {asset.name}
                  </span>
                  <span className="text-sm text-slate-500">Target: {asset.targetAllocation}%</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 items-center">
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Current Value (₹)</label>
                    <Input 
                      type="number" 
                      value={asset.currentValue} 
                      onChange={(e) => handleValueChange(index, e.target.value)}
                      className="font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Target %</label>
                    <Slider 
                      value={[asset.targetAllocation]} 
                      max={100} 
                      step={1} 
                      onValueChange={(vals) => handleAllocationChange(index, vals[0])}
                      className="py-2"
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl flex justify-between items-center">
              <span className="text-slate-500 font-medium">Total Portfolio Value</span>
              <span className="text-xl font-bold text-slate-900 dark:text-white">₹{totalValue.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Visualization */}
        <Card className="border-slate-200 dark:border-slate-800">
             <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">Allocation Split</CardTitle>
             </CardHeader>
             <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={currentAllocationData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {currentAllocationData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={assets[index].color} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="text-center text-sm text-slate-500 mt-[-20px]">
                    Inner: Current Allocation
                </div>
             </CardContent>
        </Card>
      </div>

      {/* Action Plan */}
      <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none shadow-xl">
        <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <RefreshCw className="w-6 h-6 text-primary-400" /> Rebalancing Action Plan
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
                {actions.map((item, index) => (
                    <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-slate-300 font-medium">{item.name}</span>
                            {item.action === "BUY" ? (
                                <span className="bg-green-500/20 text-green-300 text-xs font-bold px-2 py-1 rounded uppercase flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" /> Buy
                                </span>
                            ) : (
                                <span className="bg-red-500/20 text-red-300 text-xs font-bold px-2 py-1 rounded uppercase flex items-center gap-1">
                                    <TrendingDown className="w-3 h-3" /> Sell
                                </span>
                            )}
                        </div>
                        <div className="text-2xl font-bold font-mono">
                            ₹{Math.round(item.amount).toLocaleString()}
                        </div>
                        <p className="text-xs text-slate-400 mt-2">
                            to reach {assets[index].targetAllocation}% allocation
                        </p>
                    </div>
                ))}
            </div>
            
            <div className="mt-8 flex justify-center">
                <Button className="bg-primary-600 hover:bg-primary-500 text-white font-bold px-8 py-6 rounded-full text-lg shadow-lg shadow-primary-500/20">
                    Execute & Save Plan <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
            </div>
        </CardContent>
      </Card>
      
      {/* Educational Note */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800/30">
        <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-2">Why Rebalance?</h4>
        <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
            Rebalancing helps you maintain your desired risk level. By selling asset classes that have performed well and buying those that have underperformed, you naturally "sell high and buy low," enforcing discipline in your investment strategy.
        </p>
      </div>
    </div>
  );
}
