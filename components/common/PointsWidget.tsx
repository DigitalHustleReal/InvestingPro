"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

type Level = 'Beginner' | 'Contributor' | 'Expert' | 'Guru' | 'Legend';

const levelThresholds: Record<Level, number> = {
    'Beginner': 0,
    'Contributor': 100,
    'Expert': 500,
    'Guru': 1000,
    'Legend': 2500
};

interface PointsWidgetProps {
    points?: number;
    level?: Level;
}

export default function PointsWidget({ points = 0, level = 'Beginner' }: PointsWidgetProps) {
    const getLevelColor = (lvl: Level) => {
        const colors: Record<Level, string> = {
            'Beginner': 'from-gray-400 to-gray-500',
            'Contributor': 'from-secondary-400 to-secondary-600',
            'Expert': 'from-secondary-400 to-secondary-600',
            'Guru': 'from-accent-400 to-accent-600',
            'Legend': 'from-accent-500 to-accent-700'
        };
        return colors[lvl] || colors['Beginner'];
    };

    const getNextLevel = () => {
        const levels = Object.keys(levelThresholds) as Level[];
        const currentIndex = levels.indexOf(level);
        if (currentIndex === levels.length - 1) return null;
        return levels[currentIndex + 1];
    };

    const nextLevel = getNextLevel();
    const nextThreshold = nextLevel ? levelThresholds[nextLevel] : null;
    const currentThreshold = levelThresholds[level];
    const progress = nextThreshold
        ? ((points - currentThreshold) / (nextThreshold - currentThreshold)) * 100
        : 100;

    return (
        <Card className="overflow-hidden">
            <div className={`h-2 bg-gradient-to-r ${getLevelColor(level)}`}></div>
            <CardContent className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Your Progress</span>
                    </div>
                    <Badge className={`bg-gradient-to-r ${getLevelColor(level)} text-white border-0`}>
                        {level}
                    </Badge>
                </div>
                <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-3xl font-bold text-gray-900">{points}</span>
                    <span className="text-sm text-gray-500">points</span>
                </div>
                {nextLevel && nextThreshold !== null && (
                    <>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div
                                className={`h-2 rounded-full bg-gradient-to-r ${getLevelColor(nextLevel)} transition-all duration-500`}
                                style={{ width: `${Math.max(0, Math.min(progress, 100))}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-gray-500">
                            {Math.max(0, nextThreshold - points)} points to {nextLevel}
                        </p>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
