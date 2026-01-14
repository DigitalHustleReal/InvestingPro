/**
 * Distributed Lock
 * 
 * Implements distributed locking using Redis
 * Prevents concurrent execution of critical operations across multiple instances
 * 
 * Uses Redis SET with NX (only if not exists) and EX (expiration)
 * for atomic lock acquisition and automatic release
 */

import { getRedisClient } from '@/lib/cache/redis-client';
import { logger } from '@/lib/logger';
import { randomUUID } from 'crypto';

export interface Lock {
    key: string;
    lockId: string;
    acquiredAt: Date;
    expiresAt: Date;
    release: () => Promise<void>;
    extend?: (ttl: number) => Promise<boolean>;
}

export interface LockOptions {
    ttl?: number; // Time to live in seconds (default: 60)
    retry?: {
        maxAttempts?: number; // Max retry attempts (default: 0, no retry)
        delayMs?: number; // Delay between retries in ms (default: 100)
    };
    extendable?: boolean; // Allow lock extension (default: false)
}

export class DistributedLock {
    private readonly keyPrefix: string;

    constructor(keyPrefix: string = 'lock:') {
        this.keyPrefix = keyPrefix;
    }

    /**
     * Acquire a distributed lock
     * Returns Lock object if acquired, null otherwise
     */
    async acquire(
        key: string,
        options: LockOptions = {}
    ): Promise<Lock | null> {
        const redis = getRedisClient();
        
        if (!redis) {
            logger.warn('Redis not available, cannot acquire lock', { key });
            return null;
        }

        const ttl = options.ttl || 60;
        const lockId = randomUUID();
        const fullKey = `${this.keyPrefix}${key}`;
        const maxAttempts = options.retry?.maxAttempts || 0;
        const delayMs = options.retry?.delayMs || 100;

        for (let attempt = 0; attempt <= maxAttempts; attempt++) {
            try {
                // Try to acquire lock with NX (only if not exists) and EX (expiration)
                const result = await redis.set(
                    fullKey,
                    lockId,
                    {
                        ex: ttl,
                        nx: true, // Only set if key doesn't exist
                    }
                );

                if (result === 'OK') {
                    const acquiredAt = new Date();
                    const expiresAt = new Date(acquiredAt.getTime() + ttl * 1000);

                    logger.debug('Lock acquired', {
                        key,
                        lockId,
                        ttl,
                        expiresAt: expiresAt.toISOString(),
                    });

                    return {
                        key,
                        lockId,
                        acquiredAt,
                        expiresAt,
                        release: () => this.release(key, lockId),
                        extend: options.extendable
                            ? (extendTtl: number) => this.extend(key, lockId, extendTtl)
                            : undefined,
                    };
                }

                // Lock already held by another instance
                if (attempt < maxAttempts) {
                    logger.debug('Lock not available, retrying', {
                        key,
                        attempt: attempt + 1,
                        maxAttempts,
                    });
                    await new Promise(resolve => setTimeout(resolve, delayMs));
                    continue;
                }

                logger.debug('Lock not acquired', {
                    key,
                    reason: 'Already held by another instance',
                });
                return null;
            } catch (error) {
                logger.error('Failed to acquire lock', error as Error, {
                    key,
                    attempt: attempt + 1,
                });

                if (attempt < maxAttempts) {
                    await new Promise(resolve => setTimeout(resolve, delayMs));
                    continue;
                }

                return null;
            }
        }

        return null;
    }

    /**
     * Release a lock
     * Only releases if lockId matches (prevents releasing someone else's lock)
     */
    async release(key: string, lockId: string): Promise<void> {
        const redis = getRedisClient();
        
        if (!redis) {
            logger.warn('Redis not available, cannot release lock', { key });
            return;
        }

        const fullKey = `${this.keyPrefix}${key}`;

        try {
            // Get current lock value
            const currentLockId = await redis.get<string>(fullKey);

            if (!currentLockId) {
                logger.debug('Lock already released or expired', { key });
                return;
            }

            // Verify lock ID matches (prevent releasing someone else's lock)
            if (currentLockId !== lockId) {
                logger.warn('Lock ID mismatch, cannot release', {
                    key,
                    expected: lockId,
                    actual: currentLockId,
                });
                return;
            }

            // Release lock
            await redis.del(fullKey);

            logger.debug('Lock released', {
                key,
                lockId,
            });
        } catch (error) {
            logger.error('Failed to release lock', error as Error, {
                key,
                lockId,
            });
        }
    }

    /**
     * Extend lock TTL
     * Only extends if lockId matches
     */
    async extend(key: string, lockId: string, ttl: number): Promise<boolean> {
        const redis = getRedisClient();
        
        if (!redis) {
            logger.warn('Redis not available, cannot extend lock', { key });
            return false;
        }

        const fullKey = `${this.keyPrefix}${key}`;

        try {
            // Get current lock value
            const currentLockId = await redis.get<string>(fullKey);

            if (!currentLockId) {
                logger.debug('Lock not found, cannot extend', { key });
                return false;
            }

            // Verify lock ID matches
            if (currentLockId !== lockId) {
                logger.warn('Lock ID mismatch, cannot extend', {
                    key,
                    expected: lockId,
                    actual: currentLockId,
                });
                return false;
            }

            // Extend TTL
            await redis.expire(fullKey, ttl);

            logger.debug('Lock extended', {
                key,
                lockId,
                newTtl: ttl,
            });

            return true;
        } catch (error) {
            logger.error('Failed to extend lock', error as Error, {
                key,
                lockId,
            });
            return false;
        }
    }

    /**
     * Check if a lock exists
     */
    async exists(key: string): Promise<boolean> {
        const redis = getRedisClient();
        
        if (!redis) {
            return false;
        }

        const fullKey = `${this.keyPrefix}${key}`;

        try {
            const exists = await redis.exists(fullKey);
            return exists === 1;
        } catch (error) {
            logger.error('Failed to check lock existence', error as Error, { key });
            return false;
        }
    }

    /**
     * Get lock information
     */
    async getLockInfo(key: string): Promise<{ lockId: string; ttl: number } | null> {
        const redis = getRedisClient();
        
        if (!redis) {
            return null;
        }

        const fullKey = `${this.keyPrefix}${key}`;

        try {
            const lockId = await redis.get<string>(fullKey);
            
            if (!lockId) {
                return null;
            }

            const ttl = await redis.ttl(fullKey);

            return {
                lockId,
                ttl: ttl > 0 ? ttl : 0,
            };
        } catch (error) {
            logger.error('Failed to get lock info', error as Error, { key });
            return null;
        }
    }

    /**
     * Execute a function with a lock
     * Automatically acquires lock, executes function, and releases lock
     */
    async withLock<T>(
        key: string,
        fn: () => Promise<T>,
        options: LockOptions = {}
    ): Promise<T | null> {
        const lock = await this.acquire(key, options);

        if (!lock) {
            logger.warn('Could not acquire lock, skipping execution', { key });
            return null;
        }

        try {
            return await fn();
        } finally {
            await lock.release();
        }
    }

    /**
     * Execute a function with a lock (throws if lock not acquired)
     */
    async withLockOrThrow<T>(
        key: string,
        fn: () => Promise<T>,
        options: LockOptions = {}
    ): Promise<T> {
        const lock = await this.acquire(key, options);

        if (!lock) {
            throw new Error(`Could not acquire lock: ${key}`);
        }

        try {
            return await fn();
        } finally {
            await lock.release();
        }
    }
}

// Export singleton instance
let distributedLockInstance: DistributedLock | null = null;

/**
 * Get or create singleton distributed lock instance
 */
export function getDistributedLock(keyPrefix?: string): DistributedLock {
    if (!distributedLockInstance) {
        distributedLockInstance = new DistributedLock(keyPrefix);
    }
    return distributedLockInstance;
}
