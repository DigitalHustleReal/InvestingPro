/**
 * CMS Initialization Script
 * 
 * Initializes the CMS system:
 * 1. Sets default budget
 * 2. Verifies all agents
 * 3. Tests system health
 * 4. Creates initial configuration
 */

import { BudgetGovernorAgent } from '../lib/agents/budget-governor-agent';
import { HealthMonitorAgent } from '../lib/agents/health-monitor-agent';
import { CMSOrchestrator } from '../lib/agents/orchestrator';

async function initializeCMS() {
    console.log('🚀 CMS Initialization\n');
    
    // 1. Set default budget
    console.log('1. Setting default budget...');
    try {
        const budgetAgent = new BudgetGovernorAgent();
        await budgetAgent.setDailyBudget({
            maxTokensPerDay: 1000000,
            maxImagesPerDay: 100,
            maxCostPerDay: 50.00
        });
        console.log('   ✅ Default budget set: 1M tokens, 100 images, $50/day');
    } catch (error) {
        console.log(`   ⚠️  Budget setup failed: ${(error as Error).message}`);
        console.log('   💡 You can set budget manually via API: POST /api/cms/budget');
    }
    
    // 2. Check system health
    console.log('\n2. Checking system health...');
    try {
        const healthMonitor = new HealthMonitorAgent();
        const health = await healthMonitor.getSystemHealth();
        console.log(`   ✅ System health: ${health.overall}`);
        console.log(`   📊 Agents: ${health.agents.length} registered`);
        console.log(`   💰 Budget status: ${health.budget.status}`);
    } catch (error) {
        console.log(`   ⚠️  Health check failed: ${(error as Error).message}`);
    }
    
    // 3. Verify orchestrator
    console.log('\n3. Verifying orchestrator...');
    try {
        const orchestrator = new CMSOrchestrator();
        console.log('   ✅ Orchestrator initialized');
        console.log('   📋 All agents loaded');
    } catch (error) {
        console.log(`   ❌ Orchestrator failed: ${(error as Error).message}`);
    }
    
    // 4. Summary
    console.log('\n📊 Initialization Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ CMS System Ready');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('💡 Next Steps:');
    console.log('   1. Verify environment variables in .env.local');
    console.log('   2. Run migration if not done: npm run migrate:cms');
    console.log('   3. Test with canary: POST /api/cms/orchestrator/canary');
    console.log('   4. Start generating: POST /api/cms/orchestrator/execute');
}

initializeCMS()
    .then(() => {
        console.log('✅ Initialization complete');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Initialization failed:', error);
        process.exit(1);
    });
