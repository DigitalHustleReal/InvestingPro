/**
 * Smart Comparison Components
 * 
 * A suite of advanced comparison tools for financial products
 */

export { BreakEvenCalculatorComponent } from './BreakEvenCalculator';
export { ApprovalProbabilityComponent } from './ApprovalProbability';
export { CardComboOptimizerComponent } from './CardComboOptimizer';
export { DecisionMatrixComponent } from './DecisionMatrix';
export { WhatIfSimulatorComponent } from './WhatIfSimulator';

// Also export the engine
export { default as SmartComparison } from '@/lib/decision-engines/smart-comparison-engine';
export * from '@/lib/decision-engines/smart-comparison-engine';
