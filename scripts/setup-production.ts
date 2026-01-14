/**
 * Production Environment Setup Script
 * 
 * This script helps validate and setup the production environment
 * Run with: tsx scripts/setup-production.ts
 */

import * as fs from 'fs';
import * as path from 'path';

interface EnvCheck {
  key: string;
  required: boolean;
  description: string;
  category: string;
}

const ENV_CHECKS: EnvCheck[] = [
  // Supabase (Required)
  { key: 'NEXT_PUBLIC_SUPABASE_URL', required: true, description: 'Supabase project URL', category: 'Database' },
  { key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', required: true, description: 'Supabase anonymous key', category: 'Database' },
  { key: 'SUPABASE_SERVICE_ROLE_KEY', required: true, description: 'Supabase service role key', category: 'Database' },
  
  // Base Configuration
  { key: 'NEXT_PUBLIC_BASE_URL', required: true, description: 'Production base URL', category: 'Configuration' },
  
  // AI Services
  { key: 'OPENAI_API_KEY', required: true, description: 'OpenAI API key for content generation', category: 'AI Services' },
  { key: 'ANTHROPIC_API_KEY', required: false, description: 'Anthropic Claude API key (fallback)', category: 'AI Services' },
  { key: 'GOOGLE_GEMINI_API_KEY', required: false, description: 'Google Gemini API key (fallback)', category: 'AI Services' },
  
  // Image Services
  { key: 'CLOUDINARY_CLOUD_NAME', required: true, description: 'Cloudinary cloud name', category: 'Images' },
  { key: 'CLOUDINARY_API_KEY', required: true, description: 'Cloudinary API key', category: 'Images' },
  { key: 'CLOUDINARY_API_SECRET', required: true, description: 'Cloudinary API secret', category: 'Images' },
  
  // Optional Services
  { key: 'STRIPE_SECRET_KEY', required: false, description: 'Stripe secret key for payments', category: 'Payments' },
  { key: 'RESEND_API_KEY', required: false, description: 'Resend API key for emails', category: 'Email' },
  { key: 'SENTRY_DSN', required: false, description: 'Sentry DSN for error tracking', category: 'Monitoring' },
  { key: 'UPSTASH_REDIS_REST_URL', required: false, description: 'Upstash Redis URL for rate limiting', category: 'Rate Limiting' },
  
  // Security
  { key: 'ADMIN_BYPASS_KEY', required: false, description: 'Admin bypass (MUST NOT be set in production)', category: 'Security' },
];

interface ValidationResult {
  category: string;
  checks: {
    key: string;
    status: 'pass' | 'fail' | 'optional-missing' | 'security-warning';
    message: string;
  }[];
}

function validateEnvironment(): ValidationResult[] {
  const results: Map<string, ValidationResult> = new Map();

  for (const check of ENV_CHECKS) {
    if (!results.has(check.category)) {
      results.set(check.category, {
        category: check.category,
        checks: [],
      });
    }

    const categoryResult = results.get(check.category)!;
    const value = process.env[check.key];

    // Special check for ADMIN_BYPASS_KEY
    if (check.key === 'ADMIN_BYPASS_KEY') {
      if (value) {
        categoryResult.checks.push({
          key: check.key,
          status: 'security-warning',
          message: '🔴 CRITICAL: Admin bypass is set! Remove this in production!',
        });
      } else {
        categoryResult.checks.push({
          key: check.key,
          status: 'pass',
          message: '✓ Not set (correct for production)',
        });
      }
      continue;
    }

    // Check for required variables
    if (check.required) {
      if (!value || value.trim() === '') {
        categoryResult.checks.push({
          key: check.key,
          status: 'fail',
          message: `✗ Missing (required) - ${check.description}`,
        });
      } else if (value.includes('your_') || value.includes('...')) {
        categoryResult.checks.push({
          key: check.key,
          status: 'fail',
          message: `✗ Placeholder value detected - Replace with real value`,
        });
      } else {
        categoryResult.checks.push({
          key: check.key,
          status: 'pass',
          message: `✓ ${check.description}`,
        });
      }
    } else {
      // Optional variables
      if (!value || value.trim() === '') {
        categoryResult.checks.push({
          key: check.key,
          status: 'optional-missing',
          message: `○ Not set (optional) - ${check.description}`,
        });
      } else {
        categoryResult.checks.push({
          key: check.key,
          status: 'pass',
          message: `✓ ${check.description}`,
        });
      }
    }
  }

  return Array.from(results.values());
}

function printResults(results: ValidationResult[]) {
  console.log('\n');
  console.log('═'.repeat(60));
  console.log('  InvestingPro Production Environment Validation');
  console.log('═'.repeat(60));
  console.log('\n');

  let hasErrors = false;
  let hasWarnings = false;

  for (const result of results) {
    console.log(`\n📦 ${result.category}`);
    console.log('─'.repeat(60));

    for (const check of result.checks) {
      console.log(`   ${check.message}`);

      if (check.status === 'fail') hasErrors = true;
      if (check.status === 'security-warning') hasWarnings = true;
    }
  }

  console.log('\n');
  console.log('═'.repeat(60));

  if (hasWarnings) {
    console.log('⚠️  SECURITY WARNINGS DETECTED');
    console.log('   Please review and fix security issues before deployment');
    console.log('═'.repeat(60));
  }

  if (hasErrors) {
    console.log('❌ VALIDATION FAILED');
    console.log('   Missing required environment variables');
    console.log('   See .env.production.template for reference');
    console.log('═'.repeat(60));
    process.exit(1);
  } else if (hasWarnings) {
    console.log('⚠️  VALIDATION PASSED WITH WARNINGS');
    console.log('   Please address security warnings');
    console.log('═'.repeat(60));
    process.exit(1);
  } else {
    console.log('✅ VALIDATION PASSED');
    console.log('   All required environment variables are configured');
    console.log('═'.repeat(60));
  }

  console.log('\n');
}

async function main() {
  console.log('Starting production environment validation...\n');

  // Check if .env.local exists
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    console.log('⚠️  Warning: .env.local file not found');
    console.log('   Using system environment variables');
  }

  const results = validateEnvironment();
  printResults(results);
}

main().catch(console.error);
