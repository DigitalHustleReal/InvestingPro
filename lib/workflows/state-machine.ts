/**
 * Content State Machine
 * Manages content lifecycle state transitions
 */

import { ContentState, StateTransition, StateMachineConfig } from './types';
import { logger } from '@/lib/logger';

/**
 * Content Lifecycle State Machine Configuration
 */
export const CONTENT_STATE_MACHINE: StateMachineConfig = {
  states: ['draft', 'review', 'approved', 'scheduled', 'published', 'archived'],
  initial: 'draft',
  transitions: [
    // Draft → Review (submit for review)
    {
      from: 'draft',
      to: ['review'],
      action: 'submit',
      conditions: (context) => {
        // Must have title and content
        return !!(context.title && context.content);
      }
    },
    // Review → Draft (reject/request revision)
    {
      from: 'review',
      to: ['draft'],
      action: 'reject',
    },
    // Review → Approved (approve)
    {
      from: 'review',
      to: ['approved'],
      action: 'approve',
    },
    // Approved → Scheduled (schedule for publication)
    {
      from: 'approved',
      to: ['scheduled'],
      action: 'schedule',
    },
    // Approved → Published (publish immediately)
    {
      from: 'approved',
      to: ['published'],
      action: 'publish',
    },
    // Scheduled → Published (auto-publish at scheduled time)
    {
      from: 'scheduled',
      to: ['published'],
      action: 'publish',
    },
    // Published → Archived (archive)
    {
      from: 'published',
      to: ['archived'],
      action: 'archive',
    },
    // Any → Draft (reset to draft)
    {
      from: 'draft',
      to: ['draft'],
      action: 'reset',
    },
    {
      from: 'review',
      to: ['draft'],
      action: 'reset',
    },
    {
      from: 'approved',
      to: ['draft'],
      action: 'reset',
    },
    {
      from: 'archived',
      to: ['draft'],
      action: 'reset',
    }
  ]
};

/**
 * State Machine Validator
 */
export class StateMachine {
  private config: StateMachineConfig;

  constructor(config: StateMachineConfig = CONTENT_STATE_MACHINE) {
    this.config = config;
  }

  /**
   * Check if a state transition is valid
   */
  canTransition(
    from: ContentState,
    to: ContentState,
    action: string,
    context?: any
  ): boolean {
    const transition = this.config.transitions.find(
      t => t.from === from && t.to.includes(to) && t.action === action
    );

    if (!transition) {
      logger.debug('Invalid transition', { from, to, action });
      return false;
    }

    // Check conditions if provided
    if (transition.conditions && context) {
      return transition.conditions(context);
    }

    return true;
  }

  /**
   * Get valid next states from current state
   */
  getValidNextStates(from: ContentState, action?: string): ContentState[] {
    const transitions = this.config.transitions.filter(
      t => t.from === from && (!action || t.action === action)
    );

    const nextStates = new Set<ContentState>();
    transitions.forEach(t => {
      t.to.forEach(state => nextStates.add(state as ContentState));
    });

    return Array.from(nextStates);
  }

  /**
   * Get valid actions from current state
   */
  getValidActions(from: ContentState): string[] {
    const transitions = this.config.transitions.filter(
      t => t.from === from
    );

    return [...new Set(transitions.map(t => t.action))];
  }

  /**
   * Validate and execute state transition
   */
  async transition(
    from: ContentState,
    to: ContentState,
    action: string,
    context?: any
  ): Promise<StateTransition> {
    if (!this.canTransition(from, to, action, context)) {
      throw new Error(
        `Invalid transition: Cannot ${action} from ${from} to ${to}`
      );
    }

    const transition: StateTransition = {
      from,
      to,
      action,
      metadata: context,
      timestamp: new Date().toISOString(),
      userId: context?.userId
    };

    logger.info('State transition', { from, to, action });
    return transition;
  }
}

/**
 * Singleton instance
 */
export const contentStateMachine = new StateMachine(CONTENT_STATE_MACHINE);
