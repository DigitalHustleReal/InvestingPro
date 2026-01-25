/**
 * Linkable Assets Module
 * Central export for all linkable asset generation and management
 * 
 * Linkable assets are high-value content pieces designed to attract backlinks:
 * - Data Studies (live financial data)
 * - Embeddable Calculators
 * - Infographics
 * - Live Rate Tables
 */

// Data Studies
export {
  // Core generators
  generateRBIPolicyRatesStudy,
  generateMutualFundPerformanceStudy,
  generateFDRatesStudy,
  generateCreditCardRewardsStudy,
  generateLoanRatesStudy,
  // Expanded loan studies
  generateEducationLoanStudy,
  generateGoldLoanStudy,
  generateBusinessLoanStudy,
  generateLAPStudy,
  // Insurance studies
  generateTermInsuranceStudy,
  generateHealthInsuranceStudy,
  // Banking studies
  generateSavingsAccountStudy,
  generateRDRatesStudy,
  // Investment studies
  generatePPFRatesStudy,
  generateSmallSavingsStudy,
  generateNPSReturnsStudy,
  generateELSSFundStudy,
  // Additional studies
  generateGoldPriceStudy,
  generateCreditCardFeeStudy,
  // Query functions
  getAllDataStudies,
  getDataStudyBySlug,
  getStudiesByCategory,
  searchStudies,
  // Types
  type DataStudy,
  type DataPoint,
  type StudyCategory,
} from './data-studies-service';

// Embeddable Widgets
export {
  EMBEDDABLE_CALCULATORS,
  generateEmbedCode,
  getEmbedPreviewUrl,
  generateShareLinks,
  generateCalculatorShareLinks,
  generateOGMetaTags,
  trackWidgetEmbed,
  type EmbedConfig,
  type EmbedCode,
  type ShareConfig,
  type ShareLinks,
} from './embeddable-widget';

// Auto Infographics
export {
  analyzeContentForInfographics,
  extractDataPoints,
  generateArticleInfographics,
  getArticleInfographics,
  onArticlePublished,
  batchGenerateInfographics,
  type ArticleInfographicConfig,
  type InfographicType,
  type InfographicPlatform,
  type GeneratedInfographic,
} from './auto-infographic';

// =============================================================================
// CONVENIENCE FUNCTIONS
// =============================================================================

import { getAllDataStudies, type DataStudy } from './data-studies-service';
import { EMBEDDABLE_CALCULATORS } from './embeddable-widget';

/**
 * Get all available linkable assets summary
 */
export async function getLinkableAssetsSummary(): Promise<{
  dataStudies: { count: number; categories: string[] };
  calculators: { count: number; names: string[] };
  totalAssets: number;
}> {
  const studies = await getAllDataStudies();
  const calculatorNames = Object.values(EMBEDDABLE_CALCULATORS).map(c => c.name);
  const categories = [...new Set(studies.map(s => s.category))];

  return {
    dataStudies: {
      count: studies.length,
      categories,
    },
    calculators: {
      count: Object.keys(EMBEDDABLE_CALCULATORS).length,
      names: calculatorNames,
    },
    totalAssets: studies.length + Object.keys(EMBEDDABLE_CALCULATORS).length,
  };
}

/**
 * Get SEO-optimized metadata for a linkable asset
 */
export function getAssetSEOMetadata(
  type: 'study' | 'calculator',
  identifier: string
): { title: string; description: string; keywords: string[] } | null {
  if (type === 'calculator') {
    const calc = EMBEDDABLE_CALCULATORS[identifier];
    if (!calc) return null;
    
    return {
      title: `${calc.name} - Free Online Calculator | InvestingPro`,
      description: `${calc.description}. Calculate instantly with our free ${calc.name.toLowerCase()}.`,
      keywords: calc.keywords,
    };
  }

  // For studies, metadata is generated from the study itself
  return null;
}
