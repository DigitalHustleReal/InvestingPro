/**
 * Leader Election
 * 
 * Implements distributed leader election using Redis
 * Ensures only one orchestrator instance runs continuous mode
 * 
 * Uses Redis SET with NX (only if not exists) and EX (expiration)
 * for atomic leader acquisition and automatic failover
 */

import { getRedisClient } from '@/lib/cache/redis-client';
import { logger } from '@/lib/logger';
import { randomUUID } from 'crypto';

export interface LeaderInfo {
    instanceId: string;
    acquiredAt: string;
    expiresAt: string;
}

export class LeaderElection {
    private readonly leaderKey: string;
    private readonly instanceId: string;
    private readonly ttlSeconds: number;
    private readonly renewalIntervalMs: number;
    private renewalTimer: NodeJS.Timeout | null = null;
    private isLeader: boolean = false;
    private onLeadershipAcquired?: () => void;
    private onLeadershipLost?: () => void;

    constructor(
        leaderKey: string = 'orchestrator:leader',
        ttlSeconds: number = 60,
        renewalIntervalMs: number = 30000 // Renew every 30 seconds (half of TTL)
    ) {
        this.leaderKey = leaderKey;
        this.instanceId = `${process.env.VERCEL_REGION || 'local'}-${randomUUID()}`;
        this.ttlSeconds = ttlSeconds;
        this.renewalIntervalMs = renewalIntervalMs;
    }

    /**
     * Set callbacks for leadership events
     */
    setCallbacks(callbacks: {
        onAcquired?: () => void;
        onLost?: () => void;
    }): void {
        this.onLeadershipAcquired = callbacks.onAcquired;
        this.onLeadershipLost = callbacks.onLost;
    }

    /**
     * Attempt to acquire leadership
     * Returns true if leadership was acquired, false otherwise
     */
    async acquireLeadership(): Promise<boolean> {
        const redis = getRedisClient();
        
        if (!redis) {
            logger.warn('Redis not available, cannot acquire leadership');
            return false;
        }

        try {
            // Try to set the leader key with NX (only if not exists) and EX (expiration)
            const result = await redis.set(
                this.leaderKey,
                JSON.stringify({
                    instanceId: this.instanceId,
                    acquiredAt: new Date().toISOString(),
                }),
                {
                    ex: this.ttlSeconds,
                    nx: true, // Only set if key doesn't exist
                }
            );

            if (result === 'OK') {
                this.isLeader = true;
                logger.info('Leadership acquired', {
                    instanceId: this.instanceId,
                    leaderKey: this.leaderKey,
                });

                // Start renewal process
                this.startRenewal();

                // Notify callback
                if (this.onLeadershipAcquired) {
                    this.onLeadershipAcquired();
                }

                return true;
            }

            // Leadership already held by another instance
            this.isLeader = false;
            return false;
        } catch (error) {
            logger.error('Failed to acquire leadership', error as Error, {
                instanceId: this.instanceId,
            });
            this.isLeader = false;
            return false;
        }
    }

    /**
     * Renew leadership (extend TTL)
     * Should be called periodically while leader
     */
    async renewLeadership(): Promise<boolean> {
        if (!this.isLeader) {
            return false;
        }

        const redis = getRedisClient();
        
        if (!redis) {
            logger.warn('Redis not available, cannot renew leadership');
            this.loseLeadership();
            return false;
        }

        try {
            // Get current leader info
            const currentLeader = await redis.get<LeaderInfo>(this.leaderKey);
            
            if (!currentLeader) {
                // Key expired or was deleted
                logger.warn('Leadership key not found, lost leadership');
                this.loseLeadership();
                return false;
            }

            // Verify we're still the leader
            const leaderInfo = typeof currentLeader === 'string' 
                ? JSON.parse(currentLeader) 
                : currentLeader;
            
            if (leaderInfo.instanceId !== this.instanceId) {
                // Another instance is now the leader
                logger.warn('Another instance is the leader', {
                    currentLeader: leaderInfo.instanceId,
                    ourId: this.instanceId,
                });
                this.loseLeadership();
                return false;
            }

            // Renew TTL
            await redis.expire(this.leaderKey, this.ttlSeconds);
            
            logger.debug('Leadership renewed', {
                instanceId: this.instanceId,
                ttl: this.ttlSeconds,
            });

            return true;
        } catch (error) {
            logger.error('Failed to renew leadership', error as Error, {
                instanceId: this.instanceId,
            });
            this.loseLeadership();
            return false;
        }
    }

    /**
     * Start automatic renewal of leadership
     */
    private startRenewal(): void {
        // Clear any existing timer
        this.stopRenewal();

        // Set up periodic renewal
        this.renewalTimer = setInterval(async () => {
            const renewed = await this.renewLeadership();
            
            if (!renewed && this.isLeader) {
                // Failed to renew, try to re-acquire
                logger.info('Attempting to re-acquire leadership');
                await this.acquireLeadership();
            }
        }, this.renewalIntervalMs);
    }

    /**
     * Stop renewal timer
     */
    private stopRenewal(): void {
        if (this.renewalTimer) {
            clearInterval(this.renewalTimer);
            this.renewalTimer = null;
        }
    }

    /**
     * Release leadership (voluntarily)
     */
    async releaseLeadership(): Promise<void> {
        const redis = getRedisClient();
        
        if (redis && this.isLeader) {
            try {
                // Get current leader to verify we're still the leader
                const currentLeader = await redis.get<LeaderInfo>(this.leaderKey);
                
                if (currentLeader) {
                    const leaderInfo = typeof currentLeader === 'string' 
                        ? JSON.parse(currentLeader) 
                        : currentLeader;
                    
                    // Only delete if we're still the leader
                    if (leaderInfo.instanceId === this.instanceId) {
                        await redis.del(this.leaderKey);
                        logger.info('Leadership released', {
                            instanceId: this.instanceId,
                        });
                    }
                }
            } catch (error) {
                logger.error('Failed to release leadership', error as Error);
            }
        }

        this.loseLeadership();
    }

    /**
     * Handle leadership loss
     */
    private loseLeadership(): void {
        if (this.isLeader) {
            this.isLeader = false;
            this.stopRenewal();
            
            logger.info('Leadership lost', {
                instanceId: this.instanceId,
            });

            // Notify callback
            if (this.onLeadershipLost) {
                this.onLeadershipLost();
            }
        }
    }

    /**
     * Check if this instance is currently the leader
     */
    async checkLeadership(): Promise<boolean> {
        if (!this.isLeader) {
            return false;
        }

        const redis = getRedisClient();
        
        if (!redis) {
            this.loseLeadership();
            return false;
        }

        try {
            const currentLeader = await redis.get<LeaderInfo>(this.leaderKey);
            
            if (!currentLeader) {
                this.loseLeadership();
                return false;
            }

            const leaderInfo = typeof currentLeader === 'string' 
                ? JSON.parse(currentLeader) 
                : currentLeader;
            
            if (leaderInfo.instanceId !== this.instanceId) {
                this.loseLeadership();
                return false;
            }

            return true;
        } catch (error) {
            logger.error('Failed to check leadership', error as Error);
            this.loseLeadership();
            return false;
        }
    }

    /**
     * Get current leader information
     */
    async getCurrentLeader(): Promise<LeaderInfo | null> {
        const redis = getRedisClient();
        
        if (!redis) {
            return null;
        }

        try {
            const leader = await redis.get<LeaderInfo>(this.leaderKey);
            
            if (!leader) {
                return null;
            }

            return typeof leader === 'string' 
                ? JSON.parse(leader) 
                : leader;
        } catch (error) {
            logger.error('Failed to get current leader', error as Error);
            return null;
        }
    }

    /**
     * Get instance ID
     */
    getInstanceId(): string {
        return this.instanceId;
    }

    /**
     * Check if this instance is the leader (cached)
     */
    isCurrentLeader(): boolean {
        return this.isLeader;
    }

    /**
     * Cleanup resources
     */
    async shutdown(): Promise<void> {
        this.stopRenewal();
        await this.releaseLeadership();
    }
}

// Export singleton instance (can be used globally)
let leaderElectionInstance: LeaderElection | null = null;

/**
 * Get or create singleton leader election instance
 */
export function getLeaderElection(
    leaderKey?: string,
    ttlSeconds?: number
): LeaderElection {
    if (!leaderElectionInstance) {
        leaderElectionInstance = new LeaderElection(leaderKey, ttlSeconds);
    }
    return leaderElectionInstance;
}
