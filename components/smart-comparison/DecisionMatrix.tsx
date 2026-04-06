"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import {
  Grid3X3,
  Trophy,
  Plane,
  ShoppingCart,
  Wallet,
  Crown,
  CheckCircle,
  Star,
  ArrowRight,
} from "lucide-react";
import { CreditCard as CreditCardType } from "@/types/credit-card";
import {
  DecisionMatrixGenerator,
  DecisionMatrixData,
  UserSpendingProfile,
} from "@/lib/decision-engines/smart-comparison-engine";

interface DecisionMatrixProps {
  cards: CreditCardType[];
  profile?: UserSpendingProfile;
  onCardSelect?: (cardId: string) => void;
}

export function DecisionMatrixComponent({
  cards,
  profile,
  onCardSelect,
}: DecisionMatrixProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [selectedDimension, setSelectedDimension] = useState<string | null>(
    null,
  );

  const matrixData = useMemo(() => {
    if (cards.length === 0) return null;
    return DecisionMatrixGenerator.generate(cards, profile);
  }, [cards, profile]);

  if (!matrixData || cards.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Grid3X3 className="h-5 w-5 text-primary" />
            Decision Matrix
          </CardTitle>
          <CardDescription>Compare cards across key dimensions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Add cards to compare
          </div>
        </CardContent>
      </Card>
    );
  }

  const getDimensionIcon = (key: string) => {
    switch (key) {
      case "travel":
        return <Plane className="h-4 w-4" />;
      case "shopping":
        return <ShoppingCart className="h-4 w-4" />;
      case "cost":
        return <Wallet className="h-4 w-4" />;
      case "premium":
        return <Crown className="h-4 w-4" />;
      case "eligibility":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-emerald-400";
    if (score >= 40) return "bg-amber-400";
    if (score >= 20) return "bg-orange-400";
    return "bg-red-400";
  };

  const getScoreWidth = (score: number) => `${Math.max(score, 5)}%`;

  const isBestForDimension = (cardId: string, dimensionKey: string) => {
    return matrixData.bestFor[dimensionKey] === cardId;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Grid3X3 className="h-5 w-5 text-primary" />
          Decision Matrix
        </CardTitle>
        <CardDescription>
          Visual comparison across {matrixData.dimensions.length} key dimensions
          {matrixData.userBestMatch && (
            <span className="ml-2">
              • Best match:{" "}
              <strong>
                {cards.find((c) => c.id === matrixData.userBestMatch)?.name}
              </strong>
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Dimension Filter */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedDimension === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedDimension(null)}
          >
            All Dimensions
          </Button>
          {matrixData.dimensions.map((dim) => (
            <Button
              key={dim.key}
              variant={selectedDimension === dim.key ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDimension(dim.key)}
              className="flex items-center gap-1"
            >
              {getDimensionIcon(dim.key)}
              {dim.name}
            </Button>
          ))}
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground w-48">
                  Card
                </th>
                {matrixData.dimensions
                  .filter(
                    (dim) =>
                      !selectedDimension || dim.key === selectedDimension,
                  )
                  .map((dim) => (
                    <th
                      key={dim.key}
                      className="text-center py-3 px-4 font-medium text-muted-foreground"
                    >
                      <div className="flex flex-col items-center gap-1">
                        {getDimensionIcon(dim.key)}
                        <span className="text-xs">{dim.name}</span>
                        <span className="text-xs text-muted-foreground/60">
                          {Math.round(dim.weight * 100)}% weight
                        </span>
                      </div>
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {matrixData.cards.map((card) => {
                const isUserBest = matrixData.userBestMatch === card.id;
                const isHovered = hoveredCard === card.id;

                return (
                  <tr
                    key={card.id}
                    className={`border-b transition-colors cursor-pointer ${
                      isUserBest
                        ? "bg-blue-50 dark:bg-blue-950"
                        : isHovered
                          ? "bg-muted/50"
                          : ""
                    }`}
                    onMouseEnter={() => setHoveredCard(card.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    onClick={() => onCardSelect?.(card.id)}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {isUserBest && (
                          <Trophy className="h-4 w-4 text-amber-500 shrink-0" />
                        )}
                        <div>
                          <p className="font-medium">{card.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {card.provider}
                          </p>
                        </div>
                      </div>
                    </td>
                    {matrixData.dimensions
                      .filter(
                        (dim) =>
                          !selectedDimension || dim.key === selectedDimension,
                      )
                      .map((dim) => {
                        const score = dim.scores[card.id] || 0;
                        const isBest = isBestForDimension(card.id, dim.key);

                        return (
                          <td key={dim.key} className="py-4 px-4">
                            <div className="flex flex-col items-center gap-2">
                              {/* Score Bar */}
                              <div className="w-full max-w-24 h-3 bg-muted rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${getScoreColor(score)} transition-all duration-300`}
                                  style={{ width: getScoreWidth(score) }}
                                />
                              </div>

                              {/* Score Value */}
                              <div className="flex items-center gap-1">
                                <span className="text-sm font-medium">
                                  {Math.round(score)}
                                </span>
                                {isBest && (
                                  <Badge className="text-[10px] h-4 px-1 bg-green-500 hover:bg-green-500">
                                    BEST
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </td>
                        );
                      })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Winners Summary */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm uppercase tracking-wider text-muted-foreground">
            Category Winners
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {matrixData.dimensions.map((dim) => {
              const winnerId = matrixData.bestFor[dim.key];
              const winnerCard = cards.find((c) => c.id === winnerId);

              return (
                <div
                  key={dim.key}
                  className="p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                  onClick={() => winnerCard && onCardSelect?.(winnerCard.id)}
                >
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    {getDimensionIcon(dim.key)}
                    <span className="text-xs font-medium">{dim.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Trophy className="h-3 w-3 text-amber-500" />
                    <span className="text-sm font-medium truncate">
                      {winnerCard?.name || "N/A"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* User Best Match */}
        {matrixData.userBestMatch && (
          <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="h-6 w-6 text-amber-500" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Best match for YOUR spending pattern
                  </p>
                  <p className="font-semibold text-lg">
                    {cards.find((c) => c.id === matrixData.userBestMatch)?.name}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => onCardSelect?.(matrixData.userBestMatch!)}
                className="shrink-0"
              >
                View Details
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>Score Legend:</span>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-green-500" />
            <span>80-100</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-emerald-400" />
            <span>60-79</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-amber-400" />
            <span>40-59</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-orange-400" />
            <span>20-39</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-red-400" />
            <span>0-19</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default DecisionMatrixComponent;
