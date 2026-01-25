/**
 * Intelligence Learners Index
 * 
 * Central export for all intelligence/learning modules
 */

// Quality Learning Engine (existing)
export { qualityLearningEngine, QualityLearningEngine } from './quality-learning-engine';

// A/B Testing Framework (existing)
export { ABTestingFramework, abTestingFramework } from './ab-testing-framework';

// Performance Learner (new)
export {
  PerformanceLearner,
  performanceLearner,
  extractWinningPatterns,
  predictPerformance,
} from './performance-learner';

// Revenue Predictor (new)
export {
  RevenuePredictor,
  revenuePredictor,
  predictRevenue,
  getOptimalAffiliatePositions,
} from './revenue-predictor';
