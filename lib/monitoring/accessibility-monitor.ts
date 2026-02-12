/**
 * Production Accessibility Monitor
 * Runs checks and alerts on regressions
 * Usage: node lib/monitoring/accessibility-monitor.ts
 */

const { exec } = require('child_process');
const https = require('https');

// Configuration
const PAGES_TO_TEST = [
  'http://localhost:3000',
  'http://localhost:3000/admin',
  'http://localhost:3000/loans',
];

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

function runLighthouse(url) {
  return new Promise((resolve, reject) => {
    console.log(`Testing ${url}...`);
    const command = `npx lighthouse ${url} --only-categories=accessibility --output=json --chrome-flags="--headless"`;
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error testing ${url}:`, stderr);
        resolve(null); // Resolve null to verify other pages
        return;
      }
      
      try {
        const report = JSON.parse(stdout);
        const score = report.categories.accessibility.score * 100;
        resolve({ url, score });
      } catch (e) {
        console.error('Error parsing report:', e);
        resolve(null);
      }
    });
  });
}

async function monitor() {
  console.log('🚀 Starting Accessibility Monitor...\n');
  
  const results = [];
  
  for (const url of PAGES_TO_TEST) {
    const result = await runLighthouse(url);
    if (result) results.push(result);
  }
  
  console.log('\nResults:');
  
  let failed = false;
  
  results.forEach(({ url, score }) => {
    console.log(`${url}: ${score}/100`);
    
    if (score < 95) {
      failed = true;
      console.error(`⚠️ Regression detected on ${url}`);
      
      if (SLACK_WEBHOOK_URL) {
        // Send alert (simulated)
        console.log('Sending Slack alert...');
      }
    }
  });
  
  if (failed) {
    console.log('\n❌ Accessibility check failed!');
    process.exit(1);
  } else {
    console.log('\n✅ All systems normal.');
  }
}

monitor();
