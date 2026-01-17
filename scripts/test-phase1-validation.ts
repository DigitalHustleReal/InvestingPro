/**
 * Test Script for Phase 1 Validation
 * Tests fact-checking and compliance validation
 */

import { factCheckArticle, formatFactCheckResult } from '../lib/validation/fact-checker';
import { checkCompliance, formatComplianceResult } from '../lib/compliance/regulatory-checker';

async function testFactChecking() {
    console.log('\n🧪 Testing Fact-Checking...\n');

    // Test 1: Valid financial data
    console.log('Test 1: Valid financial data');
    const validContent = `
        The HDFC Bank Credit Card offers an interest rate of 3.5% per month.
        The annual fee is ₹500.
        The card has a reward rate of 2% cashback on all purchases.
    `;
    const validResult = await factCheckArticle(validContent, {
        category: 'credit-cards',
        title: 'Best Credit Cards',
        financialData: {
            interestRate: '3.5',
            fee: '500'
        }
    });
    console.log(formatFactCheckResult(validResult));
    console.log('Confidence:', validResult.confidence);
    console.log('Valid:', validResult.isValid);
    console.log('Errors:', validResult.errors.length);
    console.log('Warnings:', validResult.warnings.length);

    // Test 2: Invalid data (red flag)
    console.log('\nTest 2: Invalid financial data (guaranteed 30% return)');
    const invalidContent = `
        This investment guarantees 30% returns annually.
        It's completely risk-free and guaranteed by the government.
        The annual return is 30% and it's guaranteed.
    `;
    const invalidResult = await factCheckArticle(invalidContent, {
        category: 'mutual-funds',
        title: 'Best Investments'
    });
    console.log(formatFactCheckResult(invalidResult));
    console.log('Valid:', invalidResult.isValid);
    console.log('Critical Errors:', invalidResult.errors.filter(e => e.severity === 'critical').length);
    if (invalidResult.errors.length > 0) {
        console.log('Error Details:', invalidResult.errors.map(e => `${e.field}: ${e.message}`));
    }

    // Test 3: Missing citations
    console.log('\nTest 3: Missing citations');
    const noCitationsContent = `
        Credit card interest rates in India are typically 24-48% per annum.
        The processing fee is usually 1-2% of the loan amount.
    `;
    const citationResult = await factCheckArticle(noCitationsContent, {
        category: 'credit-cards',
        sources: [] // No sources provided
    });
    console.log(formatFactCheckResult(citationResult));
    console.log('Warnings (citation check):', citationResult.warnings.filter(w => w.type === 'unsourced').length);

    console.log('\n✅ Fact-checking tests complete\n');
}

async function testCompliance() {
    console.log('\n🧪 Testing Compliance Validation...\n');

    // Test 1: SEBI violation (guaranteed returns)
    console.log('Test 1: SEBI violation (guaranteed returns)');
    const sebiViolation = `
        Invest in our mutual fund and get guaranteed 25% returns.
        This is completely risk-free and guaranteed by SEBI.
    `;
    const sebiResult = await checkCompliance(sebiViolation, {
        category: 'mutual-funds',
        title: 'Best Mutual Fund'
    });
    console.log(formatComplianceResult(sebiResult));
    console.log('Compliant:', sebiResult.isCompliant);
    console.log('Critical Violations:', sebiResult.violations.filter(v => v.severity === 'critical').length);

    // Test 2: IRDA violation (insurance)
    console.log('\nTest 2: IRDA violation (insurance)');
    const irdaViolation = `
        Get instant insurance approval without any medical check.
        Our insurance policies guarantee no rejection.
    `;
    const irdaResult = await checkCompliance(irdaViolation, {
        category: 'insurance',
        title: 'Best Insurance'
    });
    console.log(formatComplianceResult(irdaResult));
    console.log('Compliant:', irdaResult.isCompliant);

    // Test 3: Missing affiliate disclosure
    console.log('\nTest 3: Missing affiliate disclosure');
    const noDisclosure = `
        Apply now for the best credit card and get instant approval.
        Click here to apply: [affiliate link]
    `;
    const disclosureResult = await checkCompliance(noDisclosure, {
        category: 'credit-cards',
        isPromotional: true
    });
    console.log(formatComplianceResult(disclosureResult));
    console.log('Critical Violations (disclosure):', disclosureResult.violations.filter(v => v.type === 'disclosure' && v.severity === 'critical').length);

    // Test 4: Valid content
    console.log('\nTest 4: Valid content');
    const validContent = `
        Mutual fund investments are subject to market risks.
        Past performance does not guarantee future returns.
        Please read the scheme information document carefully before investing.
    `;
    const validResult = await checkCompliance(validContent, {
        category: 'mutual-funds'
    });
    console.log(formatComplianceResult(validResult));
    console.log('Compliant:', validResult.isCompliant);
    console.log('Compliance Score:', validResult.complianceScore);

    console.log('\n✅ Compliance tests complete\n');
}

async function runTests() {
    console.log('═══════════════════════════════════════════════════════');
    console.log('🧪 PHASE 1 VALIDATION TEST SUITE');
    console.log('═══════════════════════════════════════════════════════');

    try {
        await testFactChecking();
        await testCompliance();

        console.log('═══════════════════════════════════════════════════════');
        console.log('✅ ALL TESTS COMPLETE');
        console.log('═══════════════════════════════════════════════════════');
    } catch (error) {
        console.error('❌ Test failed:', error);
        process.exit(1);
    }
}

// Run tests if executed directly
if (require.main === module) {
    runTests();
}

export { testFactChecking, testCompliance };
