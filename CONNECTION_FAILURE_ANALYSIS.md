# Connection Failure Analysis & Fixes

## Issues Identified

### 1. **Strict AI Rate Limiting**
- **Location:** `lib/middleware/rate-limit.ts` line 59
- **Issue:** AI endpoints limited to 10 requests/minute
- **Impact:** Rapid failures when multiple AI requests are made
- **Fix:** Increase limit and add better error handling

### 2. **Missing Timeouts on Fetch Requests**
- **Location:** `lib/api.ts` lines 288, 631, 645
- **Issue:** Fetch requests have no timeout, causing hanging connections
- **Impact:** Connections hang indefinitely, leading to repeated failures
- **Fix:** Add timeout to all fetch requests

### 3. **No Request Queuing**
- **Issue:** Multiple simultaneous requests can overwhelm connections
- **Impact:** Connection pool exhaustion
- **Fix:** Implement request queuing for AI operations

### 4. **Aggressive Retry Logic**
- **Location:** `lib/utils/retry.ts`
- **Issue:** Default 3 retries with exponential backoff can compound failures
- **Impact:** Failed requests retry too quickly, hitting rate limits
- **Fix:** Add smarter retry logic with rate limit awareness

### 5. **No Circuit Breaker for External APIs**
- **Issue:** Failed external API calls (Gemini, OpenAI) keep retrying
- **Impact:** Wasted requests and connection failures
- **Fix:** Use circuit breaker pattern already available

## Recommended Fixes

1. **Increase AI rate limits** (100/min instead of 10/min)
2. **Add timeouts to all fetch requests** (30s default)
3. **Implement request queuing** for AI operations
4. **Add rate limit headers** to responses
5. **Improve error messages** to indicate rate limit vs connection issues
