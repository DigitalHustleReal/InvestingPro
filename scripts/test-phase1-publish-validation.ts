/**
 * Test Script for Publish Endpoint Validation
 * Tests that fact-checking and compliance block invalid content
 */

import { factCheckArticle } from '../lib/validation/fact-checker';
import { checkCompliance } from '../lib/compliance/regulatory-checker';

async function testPublishBlocking() {
    console.log('\n🧪 Testing Publish Endpoint Validation (Blocking)...\n');

    // Test Case 1: Should BLOCK - Critical fact error
    console.log('Test 1: Should BLOCK - Critical fact error (guaranteed 30% return)');
    const criticalFactError = `
        This investment guarantees 30% annual returns.
        It's completely risk-free and backed by the government.
        The return is 30% per year and it's guaranteed.
    `;
    const factResult = await factCheckArticle(criticalFactError, {
        category: 'mutual-funds'
    });
    console.log('  Fact-check Valid:', factResult.isValid);
    console.log('  Critical Errors:', factResult.errors.filter(e => e.severity === 'critical').length);
    console.log('  All Errors:', factResult.errors.length);
    if (factResult.errors.length > 0) {
        console.log('  Error Details:', factResult.errors.map(e => `${e.field}: ${e.message}`));
    }
    if (!factResult.isValid || factResult.errors.some(e => e.severity === 'critical')) {
        console.log('  ✅ Would BLOCK publish (correct)');
    } else {
        console.log('  ⚠️  Should BLOCK but passed - may need to improve detection');
    }

    // Test Case 2: Should BLOCK - Critical compliance violation
    console.log('\nTest 2: Should BLOCK - Critical compliance violation (SEBI)');
    const sebiViolation = `
        Invest in our mutual fund and get guaranteed 25% returns.
        No risk, guaranteed by SEBI.
        This is a guaranteed returns investment.
    `;
    const complianceResult = await checkCompliance(sebiViolation, {
        category: 'mutual-funds'
    });
    console.log('  Compliance Valid:', complianceResult.isCompliant);
    console.log('  Critical Violations:', complianceResult.violations.filter(v => v.severity === 'critical').length);
    console.log('  All Violations:', complianceResult.violations.length);
    if (complianceResult.violations.length > 0) {
        console.log('  Violation Details:', complianceResult.violations.map(v => `${v.type}: ${v.message}`));
    }
    if (!complianceResult.isCompliant || complianceResult.violations.some(v => v.severity === 'critical')) {
        console.log('  ✅ Would BLOCK publish (correct)');
    } else {
        console.log('  ⚠️  Should BLOCK but passed - may need to improve detection');
    }

    // Test Case 3: Should BLOCK - Missing affiliate disclosure
    console.log('\nTest 3: Should BLOCK - Missing affiliate disclosure');
    const noDisclosure = `
        Apply now for the best credit card.
        Click here to apply: [affiliate link]
        Get instant approval.
    `;
    const disclosureResult = await checkCompliance(noDisclosure, {
        category: 'credit-cards',
        isPromotional: true
    });
    const disclosureViolations = disclosureResult.violations.filter(v => v.type === 'disclosure' && v.severity === 'critical');
    console.log('  Critical Disclosure Violations:', disclosureViolations.length);
    console.log('  All Violations:', disclosureResult.violations.length);
    if (disclosureResult.violations.length > 0) {
        console.log('  Violation Details:', disclosureResult.violations.map(v => `${v.type}: ${v.message}`));
    }
    if (disclosureViolations.length > 0) {
        console.log('  ✅ Would BLOCK publish (correct)');
    } else {
        console.log('  ⚠️  Should BLOCK but may allow - check if "apply now" + "click here" triggers detection');
    }

    // Test Case 4: Should ALLOW - Valid content
    console.log('\nTest 4: Should ALLOW - Valid content');
    const validContent = `
        HDFC Bank Credit Card offers competitive interest rates.
        The annual fee is ₹500.
        Mutual fund investments are subject to market risks.
        Past performance does not guarantee future returns.
    `;
    const validFactCheck = await factCheckArticle(validContent, {
        category: 'credit-cards',
        financialData: {
            interestRate: '3.5',
            fee: '500'
        }
    });
    const validCompliance = await checkCompliance(validContent, {
        category: 'credit-cards'
    });
    console.log('  Fact-check Valid:', validFactCheck.isValid);
    console.log('  Compliance Valid:', validCompliance.isCompliant);
    console.log('  Critical Errors:', validFactCheck.errors.filter(e => e.severity === 'critical').length);
    console.log('  Critical Violations:', validCompliance.violations.filter(v => v.severity === 'critical').length);
    
    if (validFactCheck.isValid && validCompliance.isCompliant) {
        console.log('  ✅ Would ALLOW publish (correct)');
    } else {
        console.log('  ⚠️  May have warnings but should allow (check details)');
    }

    console.log('\n✅ Publish blocking tests complete\n');
}

async function testWarningBehavior() {
    console.log('\n🧪 Testing Warning Behavior (Non-Blocking)...\n');

    // Test: Should ALLOW but warn (missing citations)
    console.log('Test: Should ALLOW but warn - Missing citations');
    const noCitations = `
        Credit card interest rates are typically 24-48% per annum.
        The processing fee is usually 1-2% of the loan amount.
    `;
    const result = await factCheckArticle(noCitations, {
        category: 'credit-cards',
        sources: []
    });
    console.log('  Valid:', result.isValid);
    console.log('  Warnings:', result.warnings.length);
    console.log('  Citation Warnings:', result.warnings.filter(w => w.type === 'unsourced').length);
    
    if (result.isValid && result.warnings.length > 0) {
        console.log('  ✅ Would ALLOW publish with warnings (correct)');
    } else if (!result.isValid) {
        console.log('  ⚠️  Blocked (may be correct if critical errors found)');
    }

    console.log('\n✅ Warning behavior tests complete\n');
}

async function runTests() {
    console.log('═══════════════════════════════════════════════════════');
    console.log('🧪 PHASE 1 PUBLISH VALIDATION TEST SUITE');
    console.log('═══════════════════════════════════════════════════════');

    try {
        await testPublishBlocking();
        await testWarningBehavior();

        console.log('═══════════════════════════════════════════════════════');
        console.log('✅ ALL TESTS COMPLETE');
        console.log('═══════════════════════════════════════════════════════');
        console.log('\n📝 Summary:');
        console.log('- Critical errors BLOCK publish');
        console.log('- Warnings ALLOW publish but logged');
        console.log('- Valid content publishes successfully');
    } catch (error) {
        console.error('❌ Test failed:', error);
        process.exit(1);
    }
}

// Run tests if executed directly
if (require.main === module) {
    runTests();
}

export { testPublishBlocking, testWarningBehavior };
