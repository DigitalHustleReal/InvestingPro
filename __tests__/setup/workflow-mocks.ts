/**
 * Workflow Action Mocks
 * Mock implementations for workflow actions in tests
 */

export const mockActionHandlers: Record<string, (context: any) => Promise<any>> = {
  'test.action': async (context) => {
    return { success: true, data: 'test-action-result' };
  },
  
  'test.action1': async (context) => {
    return { success: true, step: 1 };
  },
  
  'test.action2': async (context) => {
    return { success: true, step: 2, dependsOn: context.step1 };
  },
  
  'test.fail': async (context) => {
    throw new Error('Test action failure');
  },
  
  'test.timeout': async (context) => {
    await new Promise(resolve => setTimeout(resolve, 10000));
    return { success: true };
  },
  
  'content.generate': async (context) => {
    return {
      articleId: context.articleId || 'test-article-id',
      content: 'Generated content',
      status: 'draft',
    };
  },
  
  'quality.score': async (context) => {
    return {
      score: 85,
      quality: 'good',
      feedback: 'Content meets quality standards',
    };
  },
  
  'publish.article': async (context) => {
    return {
      articleId: context.articleId,
      published: true,
      publishedAt: new Date().toISOString(),
    };
  },
};

/**
 * Mock action handler registry
 */
export function getMockActionHandler(action: string) {
  return mockActionHandlers[action] || (async () => {
    throw new Error(`Unknown action: ${action}`);
  });
}
