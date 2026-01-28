"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { assignVariant, type Experiment } from '@/lib/ab-testing/experiment-manager';

interface ExperimentContextValue {
    experiments: Map<string, string>; // experimentId -> variantId
    getVariant: (experimentId: string) => string;
    trackConversion: (experimentId: string, value?: number) => void;
}

const ExperimentContext = createContext<ExperimentContextValue | null>(null);

interface ExperimentProviderProps {
    children: React.ReactNode;
    userId?: string;
    experiments?: Experiment[];
}

/**
 * Experiment Provider
 * 
 * Provides A/B testing context to the app
 * Handles variant assignment and tracking
 */
export function ExperimentProvider({ 
    children, 
    userId, 
    experiments = [] 
}: ExperimentProviderProps) {
    const [assignments, setAssignments] = useState<Map<string, string>>(new Map());
    const [sessionUserId] = useState(() => {
        // Use provided userId or generate session ID
        if (userId) return userId;
        if (typeof window === 'undefined') return 'server';
        
        let sessionId = sessionStorage.getItem('ab_user_id');
        if (!sessionId) {
            sessionId = crypto.randomUUID();
            sessionStorage.setItem('ab_user_id', sessionId);
        }
        return sessionId;
    });

    useEffect(() => {
        // Assign variants for all running experiments
        const newAssignments = new Map<string, string>();
        
        for (const experiment of experiments) {
            if (experiment.status !== 'running') continue;
            
            // Check for existing assignment in localStorage
            const storageKey = `ab_${experiment.id}`;
            let variantId = localStorage.getItem(storageKey);
            
            if (!variantId) {
                // Assign new variant
                variantId = assignVariant(sessionUserId, experiment);
                localStorage.setItem(storageKey, variantId);
                
                // Track assignment
                trackAssignment(experiment.id, variantId);
            }
            
            newAssignments.set(experiment.id, variantId);
        }
        
        setAssignments(newAssignments);
    }, [experiments, sessionUserId]);

    const getVariant = (experimentId: string): string => {
        return assignments.get(experimentId) || 'control';
    };

    const trackConversion = async (experimentId: string, value?: number) => {
        const variantId = assignments.get(experimentId);
        if (!variantId) return;

        try {
            await fetch('/api/experiments/conversion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    experimentId,
                    variantId,
                    userId: sessionUserId,
                    value
                })
            });
        } catch (error) {
            console.error('Failed to track conversion:', error);
        }
    };

    const trackAssignment = async (experimentId: string, variantId: string) => {
        try {
            await fetch('/api/experiments/assignment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    experimentId,
                    variantId,
                    userId: sessionUserId
                })
            });
        } catch (error) {
            console.error('Failed to track assignment:', error);
        }
    };

    return (
        <ExperimentContext.Provider value={{ 
            experiments: assignments, 
            getVariant, 
            trackConversion 
        }}>
            {children}
        </ExperimentContext.Provider>
    );
}

/**
 * Hook to access experiment context
 */
export function useExperimentContext() {
    const context = useContext(ExperimentContext);
    if (!context) {
        throw new Error('useExperimentContext must be used within ExperimentProvider');
    }
    return context;
}
