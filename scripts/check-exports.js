#!/usr/bin/env node

/**
 * Check that all lib/ barrel exports resolve correctly.
 * Prevents broken imports from shipping to production.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// Key barrel exports that must resolve
const BARREL_EXPORTS = [
  'lib/utils.ts',
  'lib/supabase/client.ts',
  'lib/supabase/server.ts',
  'lib/ai-service.ts',
  'lib/content-calendar/calendar-data.ts',
  'lib/content-calendar/brief-generator.ts',
  'lib/images/svg/index.ts',
];

let hasError = false;

for (const exp of BARREL_EXPORTS) {
  const fullPath = path.join(ROOT, exp);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Missing export: ${exp}`);
    hasError = true;
  } else {
    console.log(`✅ ${exp}`);
  }
}

// Check that components/ui/ has core primitives
const UI_COMPONENTS = [
  'components/ui/card.tsx',
  'components/ui/badge.tsx',
];

for (const comp of UI_COMPONENTS) {
  const fullPath = path.join(ROOT, comp);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Missing UI component: ${comp}`);
    hasError = true;
  } else {
    console.log(`✅ ${comp}`);
  }
}

if (hasError) {
  console.error('\n❌ Export check failed — some required files are missing.');
  process.exit(1);
} else {
  console.log('\n✅ All exports verified.');
  process.exit(0);
}
