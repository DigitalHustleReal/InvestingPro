/**
 * Inngest Setup Verification Script
 * 
 * Verifies that Inngest is properly configured and ready to use
 * Run: npx tsx scripts/verify-inngest-setup.ts
 */

import { inngest } from '../lib/queue/inngest-client';
import { logger } from '../lib/logger';

async function verifyInngestSetup() {
    console.log('🔍 Verifying Inngest Setup...\n');

    const checks: Array<{ name: string; status: 'pass' | 'fail' | 'warn'; message: string }> = [];

    // Check 1: Package installed
    try {
        const inngestModule = require('inngest');
        checks.push({
            name: 'Inngest Package',
            status: 'pass',
            message: '✅ Package installed'
        });
    } catch (error) {
        checks.push({
            name: 'Inngest Package',
            status: 'fail',
            message: '❌ Package not installed. Run: npm install inngest'
        });
    }

    // Check 2: Environment variables
    const eventKey = process.env.INNGEST_EVENT_KEY;
    const signingKey = process.env.INNGEST_SIGNING_KEY;

    if (eventKey) {
        checks.push({
            name: 'INNGEST_EVENT_KEY',
            status: 'pass',
            message: '✅ Environment variable set'
        });
    } else {
        checks.push({
            name: 'INNGEST_EVENT_KEY',
            status: 'fail',
            message: '❌ Environment variable not set'
        });
    }

    if (signingKey) {
        checks.push({
            name: 'INNGEST_SIGNING_KEY',
            status: 'pass',
            message: '✅ Environment variable set'
        });
    } else {
        checks.push({
            name: 'INNGEST_SIGNING_KEY',
            status: 'fail',
            message: '❌ Environment variable not set'
        });
    }

    // Check 3: Client initialization
    try {
        if (inngest) {
            checks.push({
                name: 'Inngest Client',
                status: 'pass',
                message: '✅ Client initialized'
            });
        } else {
            checks.push({
                name: 'Inngest Client',
                status: 'fail',
                message: '❌ Client not initialized'
            });
        }
    } catch (error) {
        checks.push({
            name: 'Inngest Client',
            status: 'fail',
            message: `❌ Client initialization error: ${error instanceof Error ? error.message : String(error)}`
        });
    }

    // Check 4: API route exists
    try {
        const fs = require('fs');
        const path = require('path');
        const routePath = path.join(process.cwd(), 'app', 'api', 'inngest', 'route.ts');
        if (fs.existsSync(routePath)) {
            checks.push({
                name: 'API Route',
                status: 'pass',
                message: '✅ API route exists'
            });
        } else {
            checks.push({
                name: 'API Route',
                status: 'fail',
                message: '❌ API route not found'
            });
        }
    } catch (error) {
        checks.push({
            name: 'API Route',
            status: 'warn',
            message: '⚠️ Could not verify API route'
        });
    }

    // Check 5: Job definitions exist
    try {
        const fs = require('fs');
        const path = require('path');
        const jobsPath = path.join(process.cwd(), 'lib', 'queue', 'jobs');
        const articleJob = path.join(jobsPath, 'article-generation.ts');
        const bulkJob = path.join(jobsPath, 'bulk-generation.ts');
        const imageJob = path.join(jobsPath, 'image-generation.ts');

        const jobsExist = [
            fs.existsSync(articleJob),
            fs.existsSync(bulkJob),
            fs.existsSync(imageJob)
        ];

        if (jobsExist.every(exists => exists)) {
            checks.push({
                name: 'Job Definitions',
                status: 'pass',
                message: '✅ All job definitions exist'
            });
        } else {
            checks.push({
                name: 'Job Definitions',
                status: 'warn',
                message: '⚠️ Some job definitions missing'
            });
        }
    } catch (error) {
        checks.push({
            name: 'Job Definitions',
            status: 'warn',
            message: '⚠️ Could not verify job definitions'
        });
    }

    // Print results
    console.log('📊 Verification Results:\n');
    checks.forEach(check => {
        const icon = check.status === 'pass' ? '✅' : check.status === 'fail' ? '❌' : '⚠️';
        console.log(`${icon} ${check.name}: ${check.message}`);
    });

    // Summary
    const passed = checks.filter(c => c.status === 'pass').length;
    const failed = checks.filter(c => c.status === 'fail').length;
    const warnings = checks.filter(c => c.status === 'warn').length;

    console.log('\n📈 Summary:');
    console.log(`   ✅ Passed: ${passed}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   ⚠️  Warnings: ${warnings}`);

    if (failed === 0) {
        console.log('\n🎉 All critical checks passed! Inngest is ready to use.');
        console.log('\n📝 Next Steps:');
        console.log('   1. Deploy your application');
        console.log('   2. Visit Inngest Dashboard to verify functions are discovered');
        console.log('   3. Test by sending an event to the queue');
    } else {
        console.log('\n⚠️  Some checks failed. Please fix the issues above before using Inngest.');
        console.log('\n📚 See docs/INNGEST_SETUP_GUIDE.md for detailed setup instructions.');
    }

    process.exit(failed > 0 ? 1 : 0);
}

// Run verification
verifyInngestSetup().catch(error => {
    logger.error('Verification script error', error instanceof Error ? error : new Error(String(error)));
    process.exit(1);
});
