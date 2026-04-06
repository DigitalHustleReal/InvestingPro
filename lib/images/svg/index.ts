/**
 * Programmatic Image Generation Pipeline
 *
 * Pure SVG generators — no external AI or native dependencies required.
 * Works in Edge runtime, serverless, and Node.js environments.
 */

export { generateFeaturedImage } from "./featured-image-generator";
export type {
  FeaturedImageInput,
  FeaturedCategory,
} from "./featured-image-generator";

export { generateComparisonImage } from "./comparison-image-generator";
export type { ComparisonImageInput } from "./comparison-image-generator";

export {
  generateInfographic,
  generateProcessInfographic,
  generateComparisonInfographic,
  generateStatsInfographic,
} from "./infographic-templates";
export type {
  InfographicInput,
  ProcessInfographicInput,
  ComparisonInfographicInput,
  ComparisonColumn,
  StatsInfographicInput,
  StatItem,
  StepItem,
} from "./infographic-templates";
