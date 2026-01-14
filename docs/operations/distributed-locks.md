# Distributed Locks

This document describes the distributed locking system for preventing concurrent execution of critical operations.

## 🎯 Overview

When running multiple instances, we need to prevent concurrent execution of critical operations like:
- Bulk article generation
- Workflow execution (prevent duplicates)
- Cache invalidation
- Data synchronization

**Distributed Locks** solve this by:
- ✅ Using Redis for coordination
- ✅ Atomic lock acquisition
- ✅ Automatic expiration (TTL)
- ✅ Lock ownership verification

---

## 🔧 How It Works

### Redis-Based Locking

Uses Redis `SET` command with:
- **NX**: Only set if key doesn't exist (atomic operation)
- **EX**: Set expiration time (automatic release)

```typescript
await redis.set(
    'lock:bulk-generation',
    lockId,
    { ex: 60, nx: true }
);
```

### Lock Ownership

Each lock has a unique `lockId`:
- Prevents releasing someone else's lock
- Allows lock extension
- Enables lock verification

### Automatic Release

Locks automatically expire after TTL:
- Prevents deadlocks
- Ensures operations don't hang forever
- Allows retry after expiration

---

## 🚀 Usage

### Basic Lock Acquisition

```typescript
import { DistributedLock } from '@/lib/locks/distributed-lock';

const lockManager = new DistributedLock();

// Acquire lock
const lock = await lockManager.acquire('bulk-generation', {
    ttl: 300, // 5 minutes
});

if (lock) {
    try {
        // Critical operation
        await performBulkGeneration();
    } finally {
        // Always release lock
        await lock.release();
    }
} else {
    console.log('Lock not acquired, operation skipped');
}
```

### With Retry

```typescript
const lock = await lockManager.acquire('workflow-execution', {
    ttl: 60,
    retry: {
        maxAttempts: 5,
        delayMs: 200,
    },
});
```

### With Lock Extension

```typescript
const lock = await lockManager.acquire('long-operation', {
    ttl: 60,
    extendable: true,
});

if (lock && lock.extend) {
    // Extend lock if operation takes longer
    await lock.extend(120); // Extend to 2 minutes
}
```

### Using withLock Helper

```typescript
// Automatically acquires and releases lock
const result = await lockManager.withLock(
    'bulk-generation',
    async () => {
        return await performBulkGeneration();
    },
    { ttl: 300 }
);

if (result === null) {
    console.log('Lock not acquired');
}
```

### Using withLockOrThrow

```typescript
// Throws error if lock not acquired
try {
    const result = await lockManager.withLockOrThrow(
        'critical-operation',
        async () => {
            return await performCriticalOperation();
        },
        { ttl: 60 }
    );
} catch (error) {
    console.error('Could not acquire lock:', error);
}
```

---

## 📊 Lock Information

### Check if Lock Exists

```typescript
const exists = await lockManager.exists('bulk-generation');
console.log(`Lock exists: ${exists}`);
```

### Get Lock Info

```typescript
const info = await lockManager.getLockInfo('bulk-generation');

if (info) {
    console.log(`Lock ID: ${info.lockId}`);
    console.log(`TTL: ${info.ttl} seconds`);
}
```

---

## 🎯 Use Cases

### Bulk Article Generation

```typescript
import { getDistributedLock } from '@/lib/locks/distributed-lock';

const lockManager = getDistributedLock();

export async function generateBulkArticles(count: number) {
    return await lockManager.withLock(
        'bulk-article-generation',
        async () => {
            // Only one instance can run this at a time
            return await orchestrator.generateBulkArticles(count);
        },
        {
            ttl: 600, // 10 minutes
            retry: {
                maxAttempts: 0, // Don't retry, skip if locked
            },
        }
    );
}
```

### Workflow Execution

```typescript
export async function executeWorkflow(workflowId: string) {
    return await lockManager.withLock(
        `workflow:${workflowId}`,
        async () => {
            // Prevent duplicate workflow execution
            return await workflowEngine.execute(workflowId);
        },
        {
            ttl: 300, // 5 minutes
            extendable: true, // Allow extension for long workflows
        }
    );
}
```

### Cache Invalidation

```typescript
export async function invalidateCache(pattern: string) {
    return await lockManager.withLock(
        `cache-invalidation:${pattern}`,
        async () => {
            // Prevent concurrent cache invalidation
            return await cacheService.invalidate(pattern);
        },
        {
            ttl: 30, // 30 seconds
        }
    );
}
```

---

## ⚙️ Configuration

### Environment Variables

```env
# Redis (required)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token
```

### Lock Options

```typescript
interface LockOptions {
    ttl?: number; // Time to live in seconds (default: 60)
    retry?: {
        maxAttempts?: number; // Max retry attempts (default: 0)
        delayMs?: number; // Delay between retries (default: 100ms)
    };
    extendable?: boolean; // Allow lock extension (default: false)
}
```

---

## 🎯 Best Practices

1. **Set appropriate TTL:**
   - Should be longer than expected operation time
   - Too short: Lock expires during operation
   - Too long: Slow recovery if instance crashes
   - Recommended: 2-3x expected operation time

2. **Always release locks:**
   - Use `try/finally` blocks
   - Or use `withLock` helper (automatic release)

3. **Use unique lock keys:**
   - Include operation type and identifier
   - Example: `workflow:${workflowId}`, `bulk-generation:${batchId}`

4. **Handle lock acquisition failure:**
   - Log and skip operation
   - Or retry with backoff
   - Don't throw errors (unless using `withLockOrThrow`)

5. **Monitor lock usage:**
   - Log lock acquisitions/releases
   - Alert on frequent lock conflicts
   - Track lock hold times

---

## 🔒 Failure Scenarios

### Instance Crashes During Operation

1. Lock expires after TTL
2. Another instance can acquire lock
3. Operation can be retried

### Redis Unavailable

- Lock acquisition fails gracefully
- Operation skipped (or logged)
- System continues operating (without locking)

### Lock Not Released

- Lock expires automatically (TTL)
- Prevents deadlocks
- Operation can be retried

---

## 📈 Next Steps

- ✅ Distributed locks implemented
- ✅ Lock helpers (`withLock`, `withLockOrThrow`)
- ✅ Lock extension support
- 🔄 **Next:** Integrate locks into bulk operations and workflows

---

**Questions?** Check the code in `lib/locks/distributed-lock.ts`
