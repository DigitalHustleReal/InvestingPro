# Leader Election for Continuous Mode

This document describes the leader election system for ensuring only one orchestrator instance runs continuous mode.

## 🎯 Overview

When running multiple instances of the application (e.g., on Vercel with multiple regions or Kubernetes with multiple replicas), we need to ensure that only **one instance** runs continuous mode tasks (like content generation, workflow execution, etc.).

**Leader Election** solves this by:
- ✅ Using Redis to coordinate leadership
- ✅ Automatically electing a leader
- ✅ Transferring leadership on failure
- ✅ Allowing multiple instances (non-leaders handle API requests)

---

## 🔧 How It Works

### Redis-Based Leader Election

Uses Redis `SET` command with:
- **NX**: Only set if key doesn't exist (atomic operation)
- **EX**: Set expiration time (automatic failover)

```typescript
await redis.set(
    'orchestrator:leader',
    JSON.stringify({ instanceId, acquiredAt }),
    { ex: 60, nx: true }
);
```

### Leadership Renewal

The leader renews its lease every 30 seconds (half of TTL):
- Prevents expiration
- Verifies it's still the leader
- Automatically releases if another instance took over

### Automatic Failover

If the leader fails:
1. Leadership key expires (60 seconds TTL)
2. Another instance can acquire leadership
3. New leader starts continuous mode execution

---

## 🚀 Usage

### Basic Usage

```typescript
import { LeaderElection } from '@/lib/orchestration/leader-election';

const leaderElection = new LeaderElection();

// Attempt to acquire leadership
const isLeader = await leaderElection.acquireLeadership();

if (isLeader) {
    // This instance is the leader
    startContinuousMode();
} else {
    // This instance is a follower
    // Can still handle API requests
}
```

### With Continuous Mode Orchestrator

```typescript
import { CMSOrchestrator } from '@/lib/agents/orchestrator';
import { ContinuousModeOrchestrator } from '@/lib/orchestration/continuous-mode';

const orchestrator = new CMSOrchestrator();
const continuousMode = new ContinuousModeOrchestrator(orchestrator, {
    intervalMs: 60000, // Check every minute
    leaderKey: 'orchestrator:continuous-mode',
    leaderTtlSeconds: 60,
});

// Start continuous mode (will acquire leadership if available)
await continuousMode.start();

// Check status
const status = continuousMode.getStatus();
console.log(`Running: ${status.running}, Leader: ${status.isLeader}`);
```

### With Callbacks

```typescript
const leaderElection = new LeaderElection();

leaderElection.setCallbacks({
    onAcquired: () => {
        console.log('Became leader! Starting continuous tasks...');
        startContinuousTasks();
    },
    onLost: () => {
        console.log('Lost leadership. Stopping continuous tasks...');
        stopContinuousTasks();
    },
});

await leaderElection.acquireLeadership();
```

---

## 📊 Leader Information

### Get Current Leader

```typescript
const leader = await leaderElection.getCurrentLeader();

if (leader) {
    console.log(`Current leader: ${leader.instanceId}`);
    console.log(`Acquired at: ${leader.acquiredAt}`);
} else {
    console.log('No leader currently');
}
```

### Check Leadership Status

```typescript
// Check if this instance is the leader (cached)
const isLeader = leaderElection.isCurrentLeader();

// Verify leadership (checks Redis)
const verified = await leaderElection.checkLeadership();
```

---

## 🔍 Monitoring

### Health Check Integration

Leader election status is included in health checks:

```json
{
    "status": "healthy",
    "components": {
        "orchestration": {
            "status": "healthy",
            "leader": {
                "instanceId": "us-east-1-abc123",
                "acquiredAt": "2026-01-15T10:30:00.000Z"
            },
            "isLeader": false
        }
    }
}
```

### Logging

All leadership events are logged:
- Leadership acquired
- Leadership renewed
- Leadership lost
- Leadership transfer

---

## ⚙️ Configuration

### Environment Variables

```env
# Redis (required for leader election)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token

# Optional: Custom leader key
ORCHESTRATOR_LEADER_KEY=orchestrator:leader

# Optional: Leadership TTL (seconds)
ORCHESTRATOR_LEADER_TTL=60
```

### Leader Election Options

```typescript
const leaderElection = new LeaderElection(
    'custom:leader:key',  // Leader key
    60,                   // TTL in seconds
    30000                 // Renewal interval in ms
);
```

---

## 🎯 Best Practices

1. **Set appropriate TTL:**
   - Too short: Frequent leadership transfers
   - Too long: Slow failover on leader failure
   - Recommended: 60 seconds

2. **Renewal interval:**
   - Should be less than TTL (recommended: half of TTL)
   - Ensures leadership doesn't expire

3. **Handle leadership loss gracefully:**
   - Stop continuous tasks immediately
   - Don't start new long-running operations
   - Continue handling API requests

4. **Monitor leadership:**
   - Log leadership changes
   - Alert on frequent transfers
   - Track leader uptime

---

## 🧪 Testing

### Single Instance

```typescript
const leaderElection = new LeaderElection();
const acquired = await leaderElection.acquireLeadership();
console.assert(acquired === true, 'Should acquire leadership');
```

### Multiple Instances

```typescript
// Instance 1
const leader1 = new LeaderElection();
const acquired1 = await leader1.acquireLeadership(); // true

// Instance 2
const leader2 = new LeaderElection();
const acquired2 = await leader2.acquireLeadership(); // false (leader1 is leader)

// Instance 1 releases
await leader1.releaseLeadership();

// Instance 2 can now acquire
const acquired2Again = await leader2.acquireLeadership(); // true
```

---

## 🔒 Failure Scenarios

### Leader Crashes

1. Leader stops renewing leadership
2. Key expires after TTL (60 seconds)
3. Another instance acquires leadership
4. New leader starts continuous mode

### Redis Unavailable

- Leader election fails gracefully
- Continuous mode doesn't start
- API requests still work
- Logs warning about Redis unavailability

### Network Partition

- Leader continues running (thinks it's still leader)
- Other instances can't acquire leadership
- When partition heals, leader verification will detect conflict
- New leader is elected

---

## 📈 Next Steps

- ✅ Leader election implemented
- ✅ Continuous mode integration
- 🔄 **Next:** Task 7.2 - Distributed Locks

---

**Questions?** Check the code in `lib/orchestration/leader-election.ts`
