# Testing Guide

**Version:** 1.0  
**Last Updated:** January 22, 2026  
**Purpose:** Comprehensive guide to testing the InvestingPro platform

---

## 📋 Table of Contents

1. [Testing Overview](#1-testing-overview)
2. [Test Types](#2-test-types)
3. [Running Tests](#3-running-tests)
4. [Writing Tests](#4-writing-tests)
5. [Test Coverage](#5-test-coverage)
6. [Best Practices](#6-best-practices)

---

## 1. Testing Overview

### Testing Philosophy

- **Comprehensive**: Cover critical paths and edge cases
- **Fast**: Tests should run quickly
- **Isolated**: Tests should not depend on each other
- **Maintainable**: Tests should be easy to understand and update

### Test Structure

```
__tests__/
├── setup/              # Test utilities and helpers
│   └── test-helpers.ts
├── integration/        # Integration tests
│   ├── workflows.test.ts
│   ├── state-machine.test.ts
│   └── api.test.ts
├── e2e/                # End-to-end tests
│   └── article-flow.test.ts
├── load/               # Load tests
│   └── api-load.test.ts
└── unit/               # Unit tests (future)
    └── ...
```

---

## 2. Test Types

### Unit Tests

**Purpose:** Test individual functions and components in isolation

**Location:** `__tests__/unit/`

**Example:**
```typescript
describe('Article Service', () => {
  it('should normalize article body', () => {
    const normalized = normalizeArticleBody('<h1>Test</h1>');
    expect(normalized).toBe('Test');
  });
});
```

### Integration Tests

**Purpose:** Test interactions between components and services

**Location:** `__tests__/integration/`

**Coverage:**
- Workflow engine execution
- State machine transitions
- API endpoint behavior
- Database operations

**Example:**
```typescript
describe('Workflow Engine Integration', () => {
  it('should execute workflow with dependencies', async () => {
    const instance = await executor.execute(definition);
    expect(instance?.state).toBe('completed');
  });
});
```

### End-to-End Tests

**Purpose:** Test complete user flows from start to finish

**Location:** `__tests__/e2e/`

**Coverage:**
- Article creation → review → publish flow
- Admin operations
- User workflows

**Example:**
```typescript
describe('Article Creation Flow (E2E)', () => {
  it('should create, review, and publish article', async () => {
    const draft = await createArticle(...);
    const reviewed = await reviewArticle(draft.id);
    const published = await publishArticle(reviewed.id);
    expect(published.status).toBe('published');
  });
});
```

### Load Tests

**Purpose:** Test system performance under load

**Location:** `__tests__/load/`

**Coverage:**
- API endpoint performance
- Concurrent request handling
- Response time limits

**Example:**
```typescript
describe('API Load Tests', () => {
  it('should handle concurrent requests', async () => {
    const requests = Array(100).fill(null).map(() => fetch('/api/health'));
    const responses = await Promise.all(requests);
    expect(responses.filter(r => r.ok).length).toBeGreaterThan(95);
  });
});
```

---

## 3. Running Tests

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Specific Test File

```bash
npm test -- workflows.test.ts
```

### Run Tests with Coverage

```bash
npm test -- --coverage
```

### Run Load Tests

```bash
npm run test:load
```

---

## 4. Writing Tests

### Test Structure

```typescript
describe('Feature Name', () => {
  let setup: TestSetup;

  beforeAll(() => {
    // Setup before all tests
  });

  beforeEach(() => {
    // Setup before each test
  });

  afterEach(() => {
    // Cleanup after each test
  });

  afterAll(() => {
    // Cleanup after all tests
  });

  describe('Sub-feature', () => {
    it('should do something', async () => {
      // Arrange
      const input = 'test';
      
      // Act
      const result = await functionUnderTest(input);
      
      // Assert
      expect(result).toBe('expected');
    });
  });
});
```

### Using Test Helpers

```typescript
import { createTestClient, createTestUser, cleanupTestData } from '../setup/test-helpers';

describe('My Test', () => {
  let supabase: ReturnType<typeof createTestClient>;
  let userId: string;

  beforeAll(async () => {
    supabase = createTestClient();
    const user = await createTestUser(supabase);
    userId = user.id;
  });

  afterAll(async () => {
    await cleanupTestData(supabase, 'articles', [articleId]);
  });
});
```

### Mocking External Services

```typescript
jest.mock('@/lib/ai/providers', () => ({
  generateContent: jest.fn().mockResolvedValue({
    content: 'Mocked content',
    tokens: 100,
  }),
}));
```

---

## 5. Test Coverage

### Coverage Goals

- **Overall**: >80%
- **Critical Paths**: >90%
- **API Endpoints**: >85%
- **Workflows**: >90%

### View Coverage Report

```bash
npm test -- --coverage
```

Coverage report will be generated in `coverage/` directory.

### Coverage Exclusions

Some files are excluded from coverage:
- Configuration files
- Type definitions
- Test utilities
- Migration scripts

---

## 6. Best Practices

### ✅ Do

- **Write descriptive test names**: `it('should create article with valid data')`
- **Test one thing per test**: Each test should verify a single behavior
- **Use setup/teardown**: Clean up test data after tests
- **Mock external dependencies**: Don't call real APIs in tests
- **Test edge cases**: Include error cases and boundary conditions
- **Keep tests fast**: Avoid slow operations in tests

### ❌ Don't

- **Don't test implementation details**: Test behavior, not internals
- **Don't make tests depend on each other**: Each test should be independent
- **Don't use real credentials**: Use test credentials and mocks
- **Don't skip cleanup**: Always clean up test data
- **Don't test third-party code**: Only test your own code
- **Don't write flaky tests**: Tests should be deterministic

---

## 7. Test Examples

### API Endpoint Test

```typescript
describe('GET /api/v1/articles/[id]', () => {
  it('should return article', async () => {
    const article = await createTestArticle();
    
    const response = await fetch(`/api/v1/articles/${article.id}`);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.id).toBe(article.id);
  });

  it('should return 404 for non-existent article', async () => {
    const response = await fetch('/api/v1/articles/invalid-id');
    
    expect(response.status).toBe(404);
  });
});
```

### Workflow Test

```typescript
describe('Workflow Execution', () => {
  it('should execute workflow steps in order', async () => {
    const definition: WorkflowDefinition = {
      id: 'test',
      steps: [
        { id: 'step1', action: 'action1' },
        { id: 'step2', action: 'action2', dependsOn: ['step1'] },
      ],
    };

    const instance = await executor.execute(definition);

    expect(instance?.completedSteps).toEqual(['step1', 'step2']);
  });
});
```

### State Machine Test

```typescript
describe('Article State Machine', () => {
  it('should allow draft → review → published', async () => {
    const draft = await createArticle({ status: 'draft' });
    const reviewed = await updateArticle(draft.id, { status: 'review' });
    const published = await updateArticle(reviewed.id, { status: 'published' });

    expect(published.status).toBe('published');
  });

  it('should prevent invalid transitions', async () => {
    const archived = await createArticle({ status: 'archived' });
    
    await expect(
      updateArticle(archived.id, { status: 'published' })
    ).rejects.toThrow();
  });
});
```

---

## 8. Continuous Integration

### GitHub Actions

Tests run automatically on:
- Pull requests
- Pushes to main branch
- Scheduled runs

### Pre-commit Hooks

Tests run before commits (via Husky):
- Type checking
- Linting
- Unit tests

---

## 9. Troubleshooting

### Tests Failing

1. **Check test data**: Ensure test data is properly set up
2. **Check mocks**: Verify mocks are configured correctly
3. **Check environment**: Ensure test environment variables are set
4. **Check database**: Ensure test database is accessible

### Slow Tests

1. **Use mocks**: Mock slow external services
2. **Parallelize**: Run tests in parallel when possible
3. **Optimize setup**: Reduce setup/teardown overhead
4. **Skip slow tests**: Use `describe.skip` for load tests in CI

---

**See Also:**
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library](https://testing-library.com/)
- [Runbook](../operations/runbook.md)
