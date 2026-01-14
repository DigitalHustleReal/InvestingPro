/**
 * Continuous Mode Orchestrator
 * 
 * Runs orchestrator in continuous mode with leader election
 * Only the leader instance executes continuous tasks
 */

import { CMSOrchestrator } from '@/lib/agents/orchestrator';
import { LeaderElection, getLeaderElection } from './leader-election';
import { logger } from '@/lib/logger';

export interface ContinuousModeConfig {
    intervalMs?: number; // How often to check for work
    leaderKey?: string;
    leaderTtlSeconds?: number;
    enabled?: boolean;
}

export class ContinuousModeOrchestrator {
    private orchestrator: CMSOrchestrator;
    private leaderElection: LeaderElection;
    private isRunning: boolean = false;
    private executionTimer: NodeJS.Timeout | null = null;
    private config: Required<ContinuousModeConfig>;

    constructor(
        orchestrator: CMSOrchestrator,
        config: ContinuousModeConfig = {}
    ) {
        this.orchestrator = orchestrator;
        this.config = {
            intervalMs: config.intervalMs || 60000, // Default: 1 minute
            leaderKey: config.leaderKey || 'orchestrator:continuous-mode',
            leaderTtlSeconds: config.leaderTtlSeconds || 60,
            enabled: config.enabled ?? true,
        };

        // Initialize leader election
        this.leaderElection = getLeaderElection(
            this.config.leaderKey,
            this.config.leaderTtlSeconds
        );

        // Set up leadership callbacks
        this.leaderElection.setCallbacks({
            onAcquired: () => {
                logger.info('Continuous mode leadership acquired, starting execution');
                this.startExecution();
            },
            onLost: () => {
                logger.info('Continuous mode leadership lost, stopping execution');
                this.stopExecution();
            },
        });
    }

    /**
     * Start continuous mode
     * Will attempt to acquire leadership and start execution if successful
     */
    async start(): Promise<boolean> {
        if (this.isRunning) {
            logger.warn('Continuous mode already running');
            return false;
        }

        if (!this.config.enabled) {
            logger.info('Continuous mode is disabled');
            return false;
        }

        this.isRunning = true;

        // Attempt to acquire leadership
        const acquired = await this.leaderElection.acquireLeadership();

        if (acquired) {
            logger.info('Continuous mode started as leader', {
                instanceId: this.leaderElection.getInstanceId(),
            });
            this.startExecution();
        } else {
            logger.info('Continuous mode started as follower, waiting for leadership', {
                instanceId: this.leaderElection.getInstanceId(),
            });
            // Start periodic check for leadership
            this.startLeadershipCheck();
        }

        return acquired;
    }

    /**
     * Stop continuous mode
     */
    async stop(): Promise<void> {
        if (!this.isRunning) {
            return;
        }

        this.isRunning = false;
        this.stopExecution();
        this.stopLeadershipCheck();
        await this.leaderElection.releaseLeadership();

        logger.info('Continuous mode stopped');
    }

    /**
     * Start execution loop (only runs if leader)
     */
    private startExecution(): void {
        if (this.executionTimer) {
            return; // Already running
        }

        // Execute immediately
        this.executeCycle();

        // Then execute periodically
        this.executionTimer = setInterval(async () => {
            // Verify we're still the leader before executing
            const isLeader = await this.leaderElection.checkLeadership();
            
            if (isLeader) {
                await this.executeCycle();
            } else {
                // Lost leadership, stop execution
                this.stopExecution();
            }
        }, this.config.intervalMs);
    }

    /**
     * Stop execution loop
     */
    private stopExecution(): void {
        if (this.executionTimer) {
            clearInterval(this.executionTimer);
            this.executionTimer = null;
        }
    }

    /**
     * Start periodic leadership check (for followers)
     */
    private startLeadershipCheck(): void {
        // Check every 30 seconds if we can acquire leadership
        const checkInterval = setInterval(async () => {
            if (!this.isRunning) {
                clearInterval(checkInterval);
                return;
            }

            const isLeader = await this.leaderElection.checkLeadership();
            
            if (!isLeader) {
                // Try to acquire leadership
                const acquired = await this.leaderElection.acquireLeadership();
                
                if (acquired) {
                    clearInterval(checkInterval);
                    this.startExecution();
                }
            }
        }, 30000); // Check every 30 seconds
    }

    /**
     * Stop leadership check
     */
    private stopLeadershipCheck(): void {
        // Timer is scoped to startLeadershipCheck, will be cleaned up
    }

    /**
     * Execute one cycle of continuous mode tasks
     */
    private async executeCycle(): Promise<void> {
        const startTime = Date.now();
        
        try {
            logger.info('Starting continuous mode cycle', {
                instanceId: this.leaderElection.getInstanceId(),
            });

            // Verify we're still the leader
            const isLeader = await this.leaderElection.checkLeadership();
            
            if (!isLeader) {
                logger.warn('Lost leadership during execution cycle');
                this.stopExecution();
                return;
            }

            // Execute orchestrator tasks
            // This is where you'd call orchestrator methods for continuous work
            // Example: Check for pending workflows, generate content, etc.
            
            // For now, log that we're executing
            logger.debug('Continuous mode cycle executed', {
                instanceId: this.leaderElection.getInstanceId(),
                duration_ms: Date.now() - startTime,
            });

        } catch (error) {
            logger.error('Continuous mode cycle failed', error as Error, {
                instanceId: this.leaderElection.getInstanceId(),
            });
        }
    }

    /**
     * Get current status
     */
    getStatus(): {
        running: boolean;
        isLeader: boolean;
        instanceId: string;
    } {
        return {
            running: this.isRunning,
            isLeader: this.leaderElection.isCurrentLeader(),
            instanceId: this.leaderElection.getInstanceId(),
        };
    }

    /**
     * Get leader election instance
     */
    getLeaderElection(): LeaderElection {
        return this.leaderElection;
    }
}
