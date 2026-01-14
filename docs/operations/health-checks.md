# Health Checks & Readiness Probes

This document describes the health check system for monitoring and Kubernetes integration.

## 🎯 Overview

The application provides multiple health check endpoints:
- ✅ **Liveness Probe** - Is the service running?
- ✅ **Readiness Probe** - Is the service ready to accept traffic?
- ✅ **Health Check** - Comprehensive system health status

---

## 📍 Endpoints

### 1. Liveness Probe
**Endpoint:** `GET /api/health/liveness`

**Purpose:** Verify the process is running (Kubernetes liveness probe)

**Response:**
```json
{
    "status": "alive",
    "timestamp": "2026-01-15T10:30:00.000Z",
    "uptime_seconds": 3600
}
```

**Status Codes:**
- `200` - Service is alive
- `503` - Service is dead

**Use Case:** Kubernetes will restart the pod if this fails.

---

### 2. Readiness Probe
**Endpoint:** `GET /api/health/readiness`

**Purpose:** Verify service can accept traffic (Kubernetes readiness probe)

**Checks:**
- Database connectivity
- AI providers availability

**Response:**
```json
{
    "status": "ready",
    "timestamp": "2026-01-15T10:30:00.000Z"
}
```

**Status Codes:**
- `200` - Service is ready
- `503` - Service is not ready (with reason)

**Use Case:** Kubernetes will remove the pod from load balancer if this fails.

---

### 3. Comprehensive Health Check
**Endpoint:** `GET /api/health`

**Purpose:** Detailed health status for monitoring dashboards

**Checks:**
- Database (connectivity, latency)
- Cache/Redis (optional, degraded is acceptable)
- AI Providers (configuration, circuit breakers)
- Workflows (stuck workflow detection)
- Metrics (error rates, latency)

**Response:**
```json
{
    "status": "healthy",
    "timestamp": "2026-01-15T10:30:00.000Z",
    "uptime_seconds": 3600,
    "version": "1.0.0",
    "components": {
        "database": {
            "status": "healthy",
            "latency_ms": 45,
            "details": {
                "connected": true,
                "response_time": 45
            }
        },
        "cache": {
            "status": "healthy",
            "latency_ms": 12,
            "details": {
                "connected": true,
                "response_time": 12
            }
        },
        "ai_providers": {
            "status": "healthy",
            "latency_ms": 2,
            "details": {
                "configured": ["openai", "groq"],
                "count": 2,
                "circuit_breakers": {
                    "openai": "closed",
                    "groq": "closed"
                }
            }
        },
        "workflows": {
            "status": "healthy",
            "latency_ms": 120,
            "details": {
                "stuck_workflows": 0,
                "threshold": 5
            }
        },
        "metrics": {
            "status": "healthy",
            "latency_ms": 5,
            "details": {
                "total_requests": 1000,
                "error_rate": "2.50",
                "avg_latency_ms": 150
            }
        }
    },
    "circuit_breakers": {
        "openai": {
            "state": "closed",
            "failures": 0
        }
    },
    "total_latency_ms": 184
}
```

**Status Values:**
- `healthy` - All critical components operational
- `degraded` - Some non-critical components degraded, but service functional
- `unhealthy` - Critical components failing

**Status Codes:**
- `200` - Healthy or degraded (service functional)
- `503` - Unhealthy (service not functional)

---

## 🔧 Kubernetes Configuration

### Example Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: investingpro-api
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: api
        image: investingpro/api:latest
        ports:
        - containerPort: 3000
        livenessProbe:
          httpGet:
            path: /api/health/liveness
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /api/health/readiness
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3
```

### Vercel Configuration

For Vercel deployments, configure health checks in `vercel.json`:

```json
{
  "healthCheck": {
    "path": "/api/health/readiness",
    "interval": 60
  }
}
```

---

## 📊 Monitoring Integration

### Prometheus

Use Prometheus to scrape health metrics:

```yaml
scrape_configs:
  - job_name: 'investingpro-health'
    metrics_path: '/api/health'
    static_configs:
      - targets: ['localhost:3000']
```

### Uptime Monitoring

Configure uptime monitoring services (UptimeRobot, Pingdom, etc.):

- **URL:** `https://your-domain.com/api/health`
- **Expected Status:** `200`
- **Check Interval:** 60 seconds
- **Alert on:** `503` status or `"status": "unhealthy"`

---

## 🔍 Health Check Components

### Database Check

- **Query:** Simple SELECT on `articles` table
- **Timeout:** 3 seconds
- **Healthy:** < 1 second latency
- **Degraded:** 1-3 seconds latency
- **Unhealthy:** > 3 seconds or error

### Cache Check

- **Test:** Redis PING command
- **Timeout:** 500ms
- **Healthy:** < 100ms latency
- **Degraded:** 100-500ms latency or not configured
- **Note:** Cache failures don't make system unhealthy

### AI Providers Check

- **Check:** Configuration and circuit breaker states
- **Healthy:** 2+ providers configured
- **Degraded:** 1 provider configured
- **Unhealthy:** No providers configured

### Workflows Check

- **Check:** Stuck workflows (running > 1 hour)
- **Healthy:** 0 stuck workflows
- **Degraded:** 1-4 stuck workflows
- **Unhealthy:** 5+ stuck workflows

### Metrics Check

- **Check:** Error rate and latency from metrics
- **Healthy:** < 5% error rate
- **Degraded:** 5-10% error rate
- **Unhealthy:** > 10% error rate

---

## 🎯 Circuit Breaker Integration

Register circuit breakers for monitoring:

```typescript
import { healthChecker } from '@/lib/health/health-checker';
import { CircuitBreaker } from '@/lib/errors/recovery';

const aiBreaker = new CircuitBreaker(5, 60000);
healthChecker.registerCircuitBreaker('openai', aiBreaker);
```

Circuit breaker states are included in health check responses:

```json
{
    "circuit_breakers": {
        "openai": {
            "state": "closed",
            "failures": 0
        }
    }
}
```

---

## ✅ Best Practices

1. **Use appropriate endpoints:**
   - Liveness: For process monitoring
   - Readiness: For load balancer health checks
   - Health: For detailed monitoring dashboards

2. **Set appropriate timeouts:**
   - Liveness: 30s initial delay, 10s period
   - Readiness: 10s initial delay, 5s period
   - Health: 60s period for monitoring

3. **Monitor health trends:**
   - Track `degraded` status over time
   - Alert on `unhealthy` status
   - Monitor component latencies

4. **Cache headers:**
   - All health endpoints return `Cache-Control: no-cache`
   - Prevents stale health status

---

## 📈 Next Steps

- ✅ Health check endpoints implemented
- ✅ Kubernetes-compatible probes
- ✅ Circuit breaker integration
- 🔄 **Next:** Continue with Phase 2 completion

---

**Questions?** Check the code in `lib/health/health-checker.ts` or `app/api/health/`
