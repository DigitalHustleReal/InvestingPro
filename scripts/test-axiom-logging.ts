/**
 * Test Axiom Logging Integration
 * Run this to verify logs are being sent to Axiom
 * 
 * Usage: npx tsx scripts/test-axiom-logging.ts
 */

import { logger } from '../lib/logger';

async function testAxiomLogging() {
    console.log('🧪 Testing Axiom Logging Integration...\n');

    // Test different log levels
    logger.info('Axiom integration test - INFO', {
        test: true,
        timestamp: new Date().toISOString(),
        testType: 'info'
    });

    logger.warn('Axiom integration test - WARNING', {
        test: true,
        timestamp: new Date().toISOString(),
        testType: 'warning'
    });

    logger.error('Axiom integration test - ERROR', new Error('Test error'), {
        test: true,
        timestamp: new Date().toISOString(),
        testType: 'error'
    });

    logger.performance('test_operation', 150, {
        test: true,
        operation: 'test_operation'
    });

    logger.apiRequest('GET', '/api/test', 200, 100, {
        test: true,
        endpoint: '/api/test'
    });

    console.log('✅ Test logs sent!');
    console.log('\n📊 Check Axiom Dashboard:');
    console.log('   1. Go to https://app.axiom.co');
    console.log('   2. Navigate to dataset: investingpro-logs');
    console.log('   3. Query: [\'message\'] LIKE \'%Axiom integration test%\'');
    console.log('   4. Logs should appear within 5-10 seconds\n');
}

// Run test
testAxiomLogging().catch(console.error);
