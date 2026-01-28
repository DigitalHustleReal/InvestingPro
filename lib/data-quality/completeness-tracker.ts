/**
 * Data Completeness Tracker
 * Calculates and tracks data completeness metrics
 */

import { createClient } from '@/lib/supabase/client';

export interface CompletenessMetrics {
  category: string;
  totalRecords: number;
  completenessPercentage: number;
  fieldCompleteness: Record<string, number>;
  missingFields: Record<string, number>;
}

// Define required fields per category
const REQUIRED_FIELDS: Record<string, string[]> = {
  credit_cards: ['name', 'bank', 'annual_fee', 'interest_rate', 'rewards_rate'],
  mutual_funds: ['scheme_code', 'name', 'nav', 'fund_house'],
  loans: ['name', 'bank', 'interest_rate', 'processing_fee', 'max_amount'],
  insurance: ['name', 'company', 'premium', 'sum_assured', 'coverage_type'],
};

export class CompletenessTracker {
  private supabase = createClient();

  /**
   * Calculate completeness for a specific category
   */
  async calculateCompleteness(category: string): Promise<CompletenessMetrics> {
    const requiredFields = REQUIRED_FIELDS[category];
    
    if (!requiredFields) {
      throw new Error(`Unknown category: ${category}`);
    }

    // Fetch all records
    const { data: records, error } = await this.supabase
      .from(category)
      .select('*');

    if (error) {
      throw new Error(`Error fetching ${category}: ${error.message}`);
    }

    if (!records || records.length === 0) {
      return {
        category,
        totalRecords: 0,
        completenessPercentage: 0,
        fieldCompleteness: {},
        missingFields: {},
      };
    }

    // Calculate field-level completeness
    const fieldCompleteness: Record<string, number> = {};
    const missingFields: Record<string, number> = {};

    for (const field of requiredFields) {
      const populatedCount = records.filter(r => {
        const value = r[field];
        return value !== null && value !== undefined && value !== '';
      }).length;

      const completeness = (populatedCount / records.length) * 100;
      fieldCompleteness[field] = completeness;
      missingFields[field] = records.length - populatedCount;
    }

    // Calculate overall completeness (average of all fields)
    const avgCompleteness = Object.values(fieldCompleteness).reduce((sum, val) => sum + val, 0) / requiredFields.length;

    return {
      category,
      totalRecords: records.length,
      completenessPercentage: avgCompleteness,
      fieldCompleteness,
      missingFields,
    };
  }

  /**
   * Calculate completeness for all categories
   */
  async calculateAllCompleteness(): Promise<CompletenessMetrics[]> {
    const categories = Object.keys(REQUIRED_FIELDS);
    const results: CompletenessMetrics[] = [];

    for (const category of categories) {
      try {
        const metrics = await this.calculateCompleteness(category);
        results.push(metrics);
      } catch (error) {
        console.error(`Error calculating completeness for ${category}:`, error);
      }
    }

    return results;
  }

  /**
   * Get completeness summary
   */
  async getCompletenessSummary() {
    const allMetrics = await this.calculateAllCompleteness();

    const summary = {
      overall: {
        totalCategories: allMetrics.length,
        avgCompleteness: allMetrics.reduce((sum, m) => sum + m.completenessPercentage, 0) / allMetrics.length,
        categoriesAbove95: allMetrics.filter(m => m.completenessPercentage >= 95).length,
        categoriesBelow95: allMetrics.filter(m => m.completenessPercentage < 95).length,
      },
      byCategory: allMetrics,
    };

    return summary;
  }

  /**
   * Check if completeness meets threshold
   */
  async meetsThreshold(threshold: number = 95): Promise<{
    meets: boolean;
    summary: any;
  }> {
    const summary = await this.getCompletenessSummary();
    const meets = summary.overall.avgCompleteness >= threshold;

    return { meets, summary };
  }
}

// CLI usage
if (require.main === module) {
  const tracker = new CompletenessTracker();
  
  tracker.getCompletenessSummary().then(summary => {
    console.log('\n📊 DATA COMPLETENESS SUMMARY\n');
    console.log(`Overall Completeness: ${summary.overall.avgCompleteness.toFixed(2)}%`);
    console.log(`Categories ≥95%: ${summary.overall.categoriesAbove95}/${summary.overall.totalCategories}`);
    console.log(`Categories <95%: ${summary.overall.categoriesBelow95}\n`);

    console.log('Per-Category Completeness:');
    for (const metrics of summary.byCategory) {
      const status = metrics.completenessPercentage >= 95 ? '✅' : '⚠️';
      console.log(`${status} ${metrics.category.padEnd(20)} ${metrics.completenessPercentage.toFixed(2)}%`);
      
      // Show incomplete fields
      const incompleteFields = Object.entries(metrics.fieldCompleteness)
        .filter(([_, completeness]) => completeness < 95);
      
      if (incompleteFields.length > 0) {
        for (const [field, completeness] of incompleteFields) {
          console.log(`   ⚠️ ${field}: ${completeness.toFixed(1)}% (${metrics.missingFields[field]} missing)`);
        }
      }
    }
  }).catch(console.error);
}

export default CompletenessTracker;
