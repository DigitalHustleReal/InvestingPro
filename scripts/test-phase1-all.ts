/**
 * Comprehensive Phase 1 Test Suite
 * Runs all validation and keyword API tests
 */

import { testFactChecking, testCompliance } from './test-phase1-validation';
import { testKeywordAPI, testKeywordEstimation } from './test-phase1-keyword-api';
import { testPublishBlocking, testWarningBehavior } from './test-phase1-publish-validation';

async function runAllTests() {
    console.log('═══════════════════════════════════════════════════════');
    console.log('🧪 PHASE 1 COMPREHENSIVE TEST SUITE');
    console.log('═══════════════════════════════════════════════════════');
    console.log('');

    const results = {
        factChecking: { passed: false, error: null as Error | null },
        compliance: { passed: false, error: null as Error | null },
        keywordAPI: { passed: false, error: null as Error | null },
        keywordEstimation: { passed: false, error: null as Error | null },
        publishBlocking: { passed: false, error: null as Error | null },
        warningBehavior: { passed: false, error: null as Error | null },
    };

    // Test 1: Fact-Checking
    try {
        await testFactChecking();
        results.factChecking.passed = true;
    } catch (error) {
        results.factChecking.error = error as Error;
        console.error('❌ Fact-checking tests failed:', error);
    }

    // Test 2: Compliance
    try {
        await testCompliance();
        results.compliance.passed = true;
    } catch (error) {
        results.compliance.error = error as Error;
        console.error('❌ Compliance tests failed:', error);
    }

    // Test 3: Keyword API
    try {
        await testKeywordAPI();
        results.keywordAPI.passed = true;
    } catch (error) {
        results.keywordAPI.error = error as Error;
        console.error('❌ Keyword API tests failed:', error);
    }

    // Test 4: Keyword Estimation
    try {
        await testKeywordEstimation();
        results.keywordEstimation.passed = true;
    } catch (error) {
        results.keywordEstimation.error = error as Error;
        console.error('❌ Keyword estimation tests failed:', error);
    }

    // Test 5: Publish Blocking
    try {
        await testPublishBlocking();
        results.publishBlocking.passed = true;
    } catch (error) {
        results.publishBlocking.error = error as Error;
        console.error('❌ Publish blocking tests failed:', error);
    }

    // Test 6: Warning Behavior
    try {
        await testWarningBehavior();
        results.warningBehavior.passed = true;
    } catch (error) {
        results.warningBehavior.error = error as Error;
        console.error('❌ Warning behavior tests failed:', error);
    }

    // Summary
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('📊 TEST RESULTS SUMMARY');
    console.log('═══════════════════════════════════════════════════════');
    console.log('');

    const passed = Object.values(results).filter(r => r.passed).length;
    const total = Object.keys(results).length;

    Object.entries(results).forEach(([name, result]) => {
        const status = result.passed ? '✅ PASSED' : '❌ FAILED';
        console.log(`  ${status}: ${name}`);
        if (result.error) {
            console.log(`    Error: ${result.error.message}`);
        }
    });

    console.log('');
    console.log(`Total: ${passed}/${total} tests passed`);
    console.log('');

    if (passed === total) {
        console.log('✅ ALL TESTS PASSED - Phase 1 is working correctly!');
        console.log('');
        console.log('Next Steps:');
        console.log('  1. Test in staging environment');
        console.log('  2. Add validation UI in admin editor');
        console.log('  3. Monitor validation results in production');
        console.log('  4. Upgrade to premium APIs when revenue justifies');
    } else {
        console.log('⚠️  Some tests failed - review errors above');
        process.exit(1);
    }

    console.log('═══════════════════════════════════════════════════════');
}

// Run if executed directly
if (require.main === module) {
    runAllTests().catch(error => {
        console.error('❌ Test suite failed:', error);
        process.exit(1);
    });
}

export { runAllTests };
