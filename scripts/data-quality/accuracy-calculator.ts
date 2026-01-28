/**
 * Accuracy Calculator
 * Calculates data accuracy from spot-check verification results
 */

import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';

interface VerificationRecord {
  id: string;
  category: string;
  name: string;
  source_url: string;
  key_fields: string;
  verification_status: 'correct' | 'incorrect' | 'not_found' | '';
  notes: string;
}

interface AccuracyReport {
  overall: {
    total: number;
    correct: number;
    incorrect: number;
    notFound: number;
    accuracy: number;
  };
  byCategory: Record<string, {
    total: number;
    correct: number;
    incorrect: number;
    accuracy: number;
  }>;
  discrepancies: Array<{
    category: string;
    name: string;
    notes: string;
  }>;
}

async function calculateAccuracy(csvPath: string): Promise<AccuracyReport> {
  console.log('📊 Calculating accuracy from spot-check results...\n');

  // Read CSV
  const csvContent = readFileSync(csvPath, 'utf-8');
  const records: VerificationRecord[] = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  });

  // Initialize report
  const report: AccuracyReport = {
    overall: {
      total: 0,
      correct: 0,
      incorrect: 0,
      notFound: 0,
      accuracy: 0,
    },
    byCategory: {},
    discrepancies: [],
  };

  // Process records
  for (const record of records) {
    const status = record.verification_status.toLowerCase();
    
    // Skip unverified records
    if (!status) {
      console.warn(`⚠️ Skipping unverified record: ${record.name}`);
      continue;
    }

    // Count by status
    if (status === 'not_found') {
      report.overall.notFound++;
      continue; // Exclude from accuracy calculation
    }

    report.overall.total++;

    if (status === 'correct') {
      report.overall.correct++;
    } else if (status === 'incorrect') {
      report.overall.incorrect++;
      report.discrepancies.push({
        category: record.category,
        name: record.name,
        notes: record.notes || 'No notes provided',
      });
    }

    // Count by category
    if (!report.byCategory[record.category]) {
      report.byCategory[record.category] = {
        total: 0,
        correct: 0,
        incorrect: 0,
        accuracy: 0,
      };
    }

    const categoryStats = report.byCategory[record.category];
    categoryStats.total++;

    if (status === 'correct') {
      categoryStats.correct++;
    } else if (status === 'incorrect') {
      categoryStats.incorrect++;
    }
  }

  // Calculate accuracy percentages
  report.overall.accuracy = report.overall.total > 0
    ? (report.overall.correct / report.overall.total) * 100
    : 0;

  for (const category in report.byCategory) {
    const stats = report.byCategory[category];
    stats.accuracy = stats.total > 0
      ? (stats.correct / stats.total) * 100
      : 0;
  }

  // Print report
  printReport(report);

  return report;
}

function printReport(report: AccuracyReport) {
  console.log('═══════════════════════════════════════════════════════');
  console.log('           DATA ACCURACY REPORT');
  console.log('═══════════════════════════════════════════════════════\n');

  // Overall accuracy
  console.log('📈 OVERALL ACCURACY');
  console.log('───────────────────────────────────────────────────────');
  console.log(`Total Verified:    ${report.overall.total}`);
  console.log(`Correct:           ${report.overall.correct}`);
  console.log(`Incorrect:         ${report.overall.incorrect}`);
  console.log(`Not Found:         ${report.overall.notFound} (excluded)`);
  console.log(`\n🎯 Accuracy Rate:   ${report.overall.accuracy.toFixed(2)}%`);

  // Status indicator
  if (report.overall.accuracy >= 98) {
    console.log('✅ STATUS: PASS - Meets 98%+ target\n');
  } else if (report.overall.accuracy >= 95) {
    console.log('⚠️ STATUS: WARNING - Below 98% target\n');
  } else {
    console.log('❌ STATUS: FAIL - Below 95% threshold\n');
  }

  // Per-category accuracy
  console.log('📊 ACCURACY BY CATEGORY');
  console.log('───────────────────────────────────────────────────────');
  for (const [category, stats] of Object.entries(report.byCategory)) {
    const status = stats.accuracy >= 98 ? '✅' : stats.accuracy >= 95 ? '⚠️' : '❌';
    console.log(`${status} ${category.padEnd(20)} ${stats.accuracy.toFixed(2)}% (${stats.correct}/${stats.total})`);
  }

  // Discrepancies
  if (report.discrepancies.length > 0) {
    console.log('\n❌ DISCREPANCIES FOUND');
    console.log('───────────────────────────────────────────────────────');
    for (const disc of report.discrepancies) {
      console.log(`\n📌 ${disc.category}: ${disc.name}`);
      console.log(`   ${disc.notes}`);
    }
  }

  console.log('\n═══════════════════════════════════════════════════════\n');
}

// Run if called directly
if (require.main === module) {
  const csvPath = process.argv[2] || 'spot-check-sample.csv';
  calculateAccuracy(csvPath).catch(console.error);
}

export { calculateAccuracy, AccuracyReport };
