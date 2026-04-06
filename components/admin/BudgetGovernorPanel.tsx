"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DollarSign,
  RefreshCw,
  Pause,
  Play,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

/**
 * Budget Governor Panel
 *
 * Monitor and control daily spending limits
 */
export default function BudgetGovernorPanel() {
  const queryClient = useQueryClient();

  // Get budget status
  const { data: budgetData, isLoading } = useQuery({
    queryKey: ["daily-budget"],
    queryFn: async () => {
      const response = await fetch("/api/cms/budget");
      if (!response.ok) throw new Error("Failed to fetch budget");
      const data = await response.json();
      return data.budget;
    },
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Set budget mutation
  const setBudget = useMutation({
    mutationFn: async (config: any) => {
      const response = await fetch("/api/cms/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "set",
          ...config,
        }),
      });
      if (!response.ok) throw new Error("Failed to set budget");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-budget"] });
    },
  });

  // Pause/resume mutation
  const togglePause = useMutation({
    mutationFn: async (pause: boolean) => {
      const response = await fetch("/api/cms/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "pause",
          pause,
        }),
      });
      if (!response.ok) throw new Error("Failed to toggle pause");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-budget"] });
    },
  });

  const [maxTokensInput, setMaxTokensInput] = useState(1000000);
  const [maxImagesInput, setMaxImagesInput] = useState(100);
  const [maxCostInput, setMaxCostInput] = useState(50.0);

  const budget = budgetData || {
    max_tokens: 1000000,
    max_images: 100,
    max_cost_usd: 50.0,
    tokens_used: 0,
    images_used: 0,
    cost_spent_usd: 0,
    is_paused: false,
  };

  // Ensure all values are numbers (handle undefined/null)
  const tokensUsed = Number(budget?.tokens_used ?? 0);
  const maxTokens = Number(budget?.max_tokens ?? 1000000);
  const imagesUsed = Number(budget?.images_used ?? 0);
  const maxImages = Number(budget?.max_images ?? 100);
  const costSpent = Number(budget?.cost_spent_usd ?? 0);
  const maxCost = Number(budget?.max_cost_usd ?? 50.0);

  // Update input state when budgetData loads
  useEffect(() => {
    if (budgetData) {
      setMaxTokensInput(Number(budgetData.max_tokens) || 1000000);
      setMaxImagesInput(Number(budgetData.max_images) || 100);
      setMaxCostInput(Number(budgetData.max_cost_usd) || 50.0);
    }
  }, [budgetData]);

  const tokensRemaining = maxTokens - tokensUsed;
  const imagesRemaining = maxImages - imagesUsed;
  const costRemaining = maxCost - costSpent;

  const tokensPercent = maxTokens > 0 ? (tokensUsed / maxTokens) * 100 : 0;
  const imagesPercent = maxImages > 0 ? (imagesUsed / maxImages) * 100 : 0;
  const costPercent = maxCost > 0 ? (costSpent / maxCost) * 100 : 0;

  const handleSetBudget = () => {
    setBudget.mutate({
      maxTokensPerDay: maxTokensInput,
      maxImagesPerDay: maxImagesInput,
      maxCostPerDay: maxCostInput,
    });
  };

  // Show loading state
  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
        <CardContent className="p-8">
          <div className="text-center text-gray-500 dark:text-gray-400">
            Loading budget data...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
      <CardHeader className="border-b border-gray-200 dark:border-gray-800 px-8 py-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-emerald-500" />
            Budget Governor
          </CardTitle>
          <Badge
            variant={budget?.is_paused ? "destructive" : "default"}
            className={
              budget?.is_paused
                ? "bg-rose-100 text-rose-700 hover:bg-rose-200 border-rose-200"
                : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200"
            }
          >
            {budget?.is_paused ? (
              <>
                <Pause className="w-3 h-3 mr-2" />
                Paused
              </>
            ) : (
              <>
                <Play className="w-3 h-3 mr-2" />
                Active
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <div className="space-y-6">
          {/* Current Usage */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Tokens
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {tokensUsed.toLocaleString()} / {maxTokens.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    tokensPercent >= 90
                      ? "bg-rose-500"
                      : tokensPercent >= 75
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                  }`}
                  style={{ width: `${Math.min(100, tokensPercent)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {tokensRemaining.toLocaleString()} remaining
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Images
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {imagesUsed} / {maxImages}
                </span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    imagesPercent >= 90
                      ? "bg-rose-500"
                      : imagesPercent >= 75
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                  }`}
                  style={{ width: `${Math.min(100, imagesPercent)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {imagesRemaining.toLocaleString()} remaining
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Cost (USD)
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  ${costSpent.toFixed(2)} / ${maxCost.toFixed(2)}
                </span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    costPercent >= 90
                      ? "bg-rose-500"
                      : costPercent >= 75
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                  }`}
                  style={{ width: `${Math.min(100, costPercent)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                ${costRemaining.toFixed(2)} remaining
              </p>
            </div>
          </div>

          {/* Set Budget */}
          <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Set Daily Limits
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Max Tokens
                </label>
                <input
                  type="number"
                  value={maxTokensInput}
                  onChange={(e) =>
                    setMaxTokensInput(parseInt(e.target.value) || 0)
                  }
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Max Images
                </label>
                <input
                  type="number"
                  value={maxImagesInput}
                  onChange={(e) =>
                    setMaxImagesInput(parseInt(e.target.value) || 0)
                  }
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Max Cost (USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={maxCostInput}
                  onChange={(e) =>
                    setMaxCostInput(parseFloat(e.target.value) || 0)
                  }
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>
            <Button
              onClick={handleSetBudget}
              disabled={setBudget.isPending}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-all shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/30"
            >
              {setBudget.isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Setting...
                </>
              ) : (
                "Set Budget"
              )}
            </Button>
          </div>

          {/* Pause/Resume */}
          <div className="flex items-center gap-4">
            <Button
              onClick={() => togglePause.mutate(!budget.is_paused)}
              disabled={togglePause.isPending}
              variant={budget.is_paused ? "default" : "destructive"}
              className={
                budget.is_paused
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                  : "bg-rose-500 hover:bg-rose-600 text-white"
              }
            >
              {togglePause.isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  {budget.is_paused ? "Resuming..." : "Pausing..."}
                </>
              ) : budget.is_paused ? (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Resume Budget
                </>
              ) : (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause Budget
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
