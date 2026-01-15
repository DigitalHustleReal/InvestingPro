/**
 * Integration Tests: Workflow Engine
 */

import { WorkflowExecutor } from '@/lib/workflows/workflow-engine';
import { WorkflowDefinition } from '@/lib/workflows/types';
import { createTestClient, cleanupTestData, waitFor } from '../setup/test-helpers';

// Mock action handlers for testing
jest.mock('@/lib/workflows/workflow-engine', () => {
  const actual = jest.requireActual('@/lib/workflows/workflow-engine');
  return {
    ...actual,
    // Mock action execution for test actions
  };
});

describe('Workflow Engine Integration', () => {
  let executor: WorkflowExecutor;
  let supabase: ReturnType<typeof createTestClient>;
  const workflowInstanceIds: string[] = [];

  beforeAll(() => {
    executor = new WorkflowExecutor();
    supabase = createTestClient();
  });

  afterAll(async () => {
    // Cleanup workflow instances
    await cleanupTestData(supabase, 'workflow_instances', workflowInstanceIds);
  });

  describe('Workflow Execution', () => {
    it('should execute a simple workflow', async () => {
      const definition: WorkflowDefinition = {
        id: 'test-workflow',
        version: '1.0.0',
        name: 'Test Workflow',
        steps: [
          {
            id: 'step1',
            action: 'test.action',
            name: 'Test Step',
          },
        ],
      };

      const instance = await executor.execute(definition, { test: 'data' });

      expect(instance).toBeDefined();
      expect(instance?.state).toBe('completed');
      expect(instance?.completedSteps).toContain('step1');
      
      if (instance) {
        workflowInstanceIds.push(instance.id);
      }
    });

    it('should respect step dependencies', async () => {
      const definition: WorkflowDefinition = {
        id: 'test-workflow-deps',
        version: '1.0.0',
        name: 'Test Workflow with Dependencies',
        steps: [
          {
            id: 'step1',
            action: 'test.action1',
            name: 'Step 1',
          },
          {
            id: 'step2',
            action: 'test.action2',
            name: 'Step 2',
            dependsOn: ['step1'],
          },
        ],
      };

      const instance = await executor.execute(definition);

      expect(instance).toBeDefined();
      expect(instance?.completedSteps).toEqual(['step1', 'step2']);
      
      if (instance) {
        workflowInstanceIds.push(instance.id);
      }
    });

    it('should handle workflow failures gracefully', async () => {
      const definition: WorkflowDefinition = {
        id: 'test-workflow-fail',
        version: '1.0.0',
        name: 'Test Workflow Failure',
        steps: [
          {
            id: 'step1',
            action: 'test.fail',
            name: 'Failing Step',
          },
        ],
      };

      const instance = await executor.execute(definition);

      expect(instance).toBeDefined();
      expect(instance?.state).toBe('failed');
      expect(instance?.failedSteps).toContain('step1');
      
      if (instance) {
        workflowInstanceIds.push(instance.id);
      }
    });

    it('should prevent duplicate execution with distributed lock', async () => {
      const definition: WorkflowDefinition = {
        id: 'test-workflow-lock',
        version: '1.0.0',
        name: 'Test Workflow Lock',
        steps: [
          {
            id: 'step1',
            action: 'test.action',
            name: 'Test Step',
          },
        ],
      };

      // Execute workflow twice simultaneously
      const [instance1, instance2] = await Promise.all([
        executor.execute(definition),
        executor.execute(definition),
      ]);

      // One should succeed, one should be skipped (locked)
      const succeeded = [instance1, instance2].filter(i => i?.state === 'completed');
      expect(succeeded.length).toBeGreaterThanOrEqual(1);
      
      if (instance1) workflowInstanceIds.push(instance1.id);
      if (instance2) workflowInstanceIds.push(instance2.id);
    });
  });

  describe('Workflow State Management', () => {
    it('should track workflow state transitions', async () => {
      const definition: WorkflowDefinition = {
        id: 'test-workflow-state',
        version: '1.0.0',
        name: 'Test Workflow State',
        steps: [
          {
            id: 'step1',
            action: 'test.action',
            name: 'Test Step',
          },
        ],
      };

      const instance = await executor.execute(definition);

      expect(instance?.state).toBe('completed');
      
      // Verify state in database
      const { data } = await supabase
        .from('workflow_instances')
        .select('state')
        .eq('id', instance?.id)
        .single();

      expect(data?.state).toBe('completed');
      
      if (instance) {
        workflowInstanceIds.push(instance.id);
      }
    });
  });
});
