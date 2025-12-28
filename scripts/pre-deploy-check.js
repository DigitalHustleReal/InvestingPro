/**
 * Pre-Deployment Check Script
 * Validates environment variables and configuration before deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Running Pre-Deployment Checks...\n');

let errors = [];
let warnings = [];

// Check 1: Environment Variables
console.log('1. Checking environment variables...');
const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'CRON_SECRET',
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
    warnings.push(`Missing environment variables: ${missingVars.join(', ')}`);
    console.log(`   ⚠️  Missing: ${missingVars.join(', ')} (will need to set in Vercel)`);
} else {
    console.log('   ✅ All required environment variables found');
}

// Check 2: Database Schema
console.log('\n2. Checking database schema file...');
const schemaPath = path.join(__dirname, '../supabase/migrations/000_complete_schema.sql');
if (fs.existsSync(schemaPath)) {
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    if (schemaContent.length > 1000) {
        console.log('   ✅ Database schema file exists and has content');
    } else {
        errors.push('Database schema file is too small or empty');
    }
} else {
    warnings.push('Database schema file not found - make sure to run it in Supabase');
    console.log('   ⚠️  Database schema file not found');
}

// Check 3: Vercel Configuration
console.log('\n3. Checking Vercel configuration...');
const vercelJsonPath = path.join(__dirname, '../vercel.json');
if (fs.existsSync(vercelJsonPath)) {
    const vercelConfig = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));
    if (vercelConfig.crons && vercelConfig.crons.length > 0) {
        console.log(`   ✅ Vercel cron jobs configured (${vercelConfig.crons.length} jobs)`);
    } else {
        warnings.push('No cron jobs configured in vercel.json');
    }
} else {
    warnings.push('vercel.json not found');
}

// Check 4: GitHub Actions
console.log('\n4. Checking GitHub Actions workflow...');
const workflowPath = path.join(__dirname, '../.github/workflows/scraper.yml');
if (fs.existsSync(workflowPath)) {
    console.log('   ✅ GitHub Actions scraper workflow exists');
} else {
    warnings.push('GitHub Actions workflow not found - Python scrapers need alternative deployment');
}

// Check 5: Package.json
console.log('\n5. Checking package.json...');
const packageJsonPath = path.join(__dirname, '../package.json');
if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    if (packageJson.scripts && packageJson.scripts.build) {
        console.log('   ✅ Build script configured');
    }
    if (packageJson.dependencies) {
        console.log(`   ✅ Dependencies configured (${Object.keys(packageJson.dependencies).length} packages)`);
    }
}

// Check 6: No hardcoded localhost in code
console.log('\n6. Checking for hardcoded localhost URLs...');
const checkFiles = (dir, fileList = []) => {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
            checkFiles(filePath, fileList);
        } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
            fileList.push(filePath);
        }
    });
    return fileList;
};

const codeFiles = checkFiles(path.join(__dirname, '../app'));
const libFiles = checkFiles(path.join(__dirname, '../lib'));

let localhostFound = false;
[...codeFiles, ...libFiles].forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('localhost:3000') && !content.includes('//') && !content.includes('http://localhost:3000')) {
        // Check if it's in a comment or string that's okay
        if (!content.includes('// localhost') && !content.includes('"localhost') && !content.includes("'localhost")) {
            localhostFound = true;
            warnings.push(`Potential hardcoded localhost in ${path.relative(__dirname, file)}`);
        }
    }
});

if (!localhostFound) {
    console.log('   ✅ No hardcoded localhost URLs found in code');
} else {
    console.log('   ⚠️  Found potential localhost references (check warnings)');
}

// Check 7: API Routes
console.log('\n7. Checking API routes...');
const apiDir = path.join(__dirname, '../app/api');
if (fs.existsSync(apiDir)) {
    const apiRoutes = fs.readdirSync(apiDir, { recursive: true });
    const routeFiles = apiRoutes.filter(f => f.endsWith('route.ts') || f.endsWith('route.js'));
    console.log(`   ✅ Found ${routeFiles.length} API route files`);
    
    // Check cron routes
    const cronRoutes = routeFiles.filter(f => f.includes('cron'));
    if (cronRoutes.length > 0) {
        console.log(`   ✅ Found ${cronRoutes.length} cron job routes`);
    }
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('📋 Pre-Deployment Check Summary');
console.log('='.repeat(60));

if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ All checks passed! Ready to deploy.');
    process.exit(0);
} else {
    if (errors.length > 0) {
        console.log(`\n❌ Errors (${errors.length}):`);
        errors.forEach(err => console.log(`   - ${err}`));
    }
    if (warnings.length > 0) {
        console.log(`\n⚠️  Warnings (${warnings.length}):`);
        warnings.forEach(warn => console.log(`   - ${warn}`));
    }
    console.log('\n⚠️  Please address warnings before deploying.');
    process.exit(warnings.length > 0 ? 1 : 0);
}

