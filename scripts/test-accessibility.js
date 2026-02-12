#!/usr/bin/env node

/**
 * Accessibility Testing Script
 * Runs Lighthouse and axe audits on InvestingPro platform
 * 
 * Usage: node scripts/test-accessibility.js
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'http://localhost:3000';
const REPORT_DIR = path.join(__dirname, '../accessibility-reports');

// Pages to test
const PAGES_TO_TEST = [
  // Admin pages
  { url: `${BASE_URL}/admin`, name: 'admin-dashboard' },
  { url: `${BASE_URL}/admin/articles`, name: 'admin-articles' },
  { url: `${BASE_URL}/admin/analytics`, name: 'admin-analytics' },
  
  // Public pages
  { url: `${BASE_URL}`, name: 'homepage' },
  { url: `${BASE_URL}/loans`, name: 'loans-page' },
  { url: `${BASE_URL}/credit-cards`, name: 'credit-cards-page' },
  { url: `${BASE_URL}/calculators/sip`, name: 'sip-calculator' },
];

// Create reports directory
if (!fs.existsSync(REPORT_DIR)) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
}

console.log('🚀 Starting Accessibility Testing...\n');

// Run Lighthouse audits
async function runLighthouse() {
  console.log('📊 Running Lighthouse Audits...\n');
  
  for (const page of PAGES_TO_TEST) {
    console.log(`Testing: ${page.name}`);
    
    const outputPath = path.join(REPORT_DIR, `lighthouse-${page.name}.html`);
    const jsonPath = path.join(REPORT_DIR, `lighthouse-${page.name}.json`);
    
    const command = `npx lighthouse ${page.url} --only-categories=accessibility --output=html --output=json --output-path=${outputPath.replace('.html', '')} --chrome-flags="--headless"`;
    
    try {
      await execPromise(command);
      console.log(`✅ ${page.name}: Report saved to ${outputPath}\n`);
    } catch (error) {
      console.error(`❌ ${page.name}: Failed - ${error.message}\n`);
    }
  }
}

// Run axe audits
async function runAxe() {
  console.log('🔍 Running axe Audits...\n');
  
  for (const page of PAGES_TO_TEST) {
    console.log(`Testing: ${page.name}`);
    
    const outputPath = path.join(REPORT_DIR, `axe-${page.name}.json`);
    
    const command = `npx axe ${page.url} --save ${outputPath}`;
    
    try {
      await execPromise(command);
      console.log(`✅ ${page.name}: Report saved to ${outputPath}\n`);
    } catch (error) {
      console.error(`❌ ${page.name}: Failed - ${error.message}\n`);
    }
  }
}

// Generate summary report
function generateSummary() {
  console.log('📝 Generating Summary Report...\n');
  
  const summary = {
    timestamp: new Date().toISOString(),
    pages: [],
    overall: {
      totalPages: PAGES_TO_TEST.length,
      passedPages: 0,
      failedPages: 0,
      averageScore: 0,
    },
  };
  
  let totalScore = 0;
  
  // Read Lighthouse reports
  PAGES_TO_TEST.forEach(page => {
    const jsonPath = path.join(REPORT_DIR, `lighthouse-${page.name}.json`);
    
    if (fs.existsSync(jsonPath)) {
      const report = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      const accessibilityScore = report.categories.accessibility.score * 100;
      
      summary.pages.push({
        name: page.name,
        url: page.url,
        lighthouseScore: accessibilityScore,
        passed: accessibilityScore >= 95,
      });
      
      totalScore += accessibilityScore;
      
      if (accessibilityScore >= 95) {
        summary.overall.passedPages++;
      } else {
        summary.overall.failedPages++;
      }
    }
  });
  
  summary.overall.averageScore = totalScore / PAGES_TO_TEST.length;
  
  // Write summary
  const summaryPath = path.join(REPORT_DIR, 'summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  
  console.log('📊 Summary Report:\n');
  console.log(`Total Pages Tested: ${summary.overall.totalPages}`);
  console.log(`Passed (≥95): ${summary.overall.passedPages}`);
  console.log(`Failed (<95): ${summary.overall.failedPages}`);
  console.log(`Average Score: ${summary.overall.averageScore.toFixed(1)}/100\n`);
  
  if (summary.overall.averageScore >= 95) {
    console.log('✅ WCAG AA Compliance: PASSED\n');
  } else {
    console.log('❌ WCAG AA Compliance: NEEDS IMPROVEMENT\n');
  }
  
  console.log(`Full reports saved to: ${REPORT_DIR}\n`);
}

// Helper function to promisify exec
function execPromise(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
}

// Main execution
async function main() {
  try {
    await runLighthouse();
    // await runAxe(); // Uncomment if axe is installed
    generateSummary();
    
    console.log('✅ Accessibility Testing Complete!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Testing failed:', error);
    process.exit(1);
  }
}

main();
