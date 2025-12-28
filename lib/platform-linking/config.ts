/**
 * Cross-Platform Linking Configuration
 * 
 * This system routes user intent across three platforms:
 * 1. InvestingPro.in - Cognitive/Educational Layer
 * 2. BestStockBrokers.org - Vendor Resolution Layer
 * 3. SwingTrader - Execution Layer
 * 
 * Core Principle: Every link must answer "What is the next rational step?"
 */

export type Platform = 'investingpro' | 'beststockbrokers' | 'swingtrader';
export type UserIntent = 'learning' | 'comparing' | 'executing';
export type LinkPlacement = 'footer' | 'contextual' | 'explainer' | 'hero' | 'cta';

export interface PlatformConfig {
  id: Platform;
  name: string;
  domain: string;
  primaryJob: string;
  vocabulary: string[];
  tone: string;
  layer: 'cognitive' | 'vendor-resolution' | 'execution';
}

export interface LinkingRule {
  from: Platform;
  to: Platform;
  allowedPlacements: LinkPlacement[];
  requiredContext: string;
  explainerPagePath: string;
  intentThreshold: UserIntent[];
  description: string;
}

export const PLATFORMS: Record<Platform, PlatformConfig> = {
  investingpro: {
    id: 'investingpro',
    name: 'InvestingPro.in',
    domain: 'https://investingpro.in',
    primaryJob: 'Reduce confusion, explain choices, compare options, build confidence',
    vocabulary: ['explain', 'compare', 'guide', 'understand', 'learn', 'research', 'analyze'],
    tone: 'calm, analytical, neutral, educational',
    layer: 'cognitive',
  },
  beststockbrokers: {
    id: 'beststockbrokers',
    name: 'BestStockBrokers.org',
    domain: 'https://beststockbrokers.org',
    primaryJob: 'Help users decide who to trust as an intermediary, compare fees, tools, reliability',
    vocabulary: ['fees', 'tools', 'reliability', 'compare', 'broker', 'platform', 'infrastructure'],
    tone: 'calm, analytical, neutral, comparison-focused',
    layer: 'vendor-resolution',
  },
  swingtrader: {
    id: 'swingtrader',
    name: 'SwingTrader',
    domain: 'https://swingtrader.com',
    primaryJob: 'Speed, precision, real-time action',
    vocabulary: ['real-time', 'execute', 'monitor', 'trade', 'action', 'live', 'instant'],
    tone: 'calm, analytical, neutral, action-oriented',
    layer: 'execution',
  },
};

export const LINKING_RULES: LinkingRule[] = [
  // InvestingPro → BestStockBrokers
  {
    from: 'investingpro',
    to: 'beststockbrokers',
    allowedPlacements: ['footer', 'contextual', 'explainer'],
    requiredContext: 'User has decided to trade/invest and needs to choose infrastructure',
    explainerPagePath: '/advanced-tools/broker-comparison',
    intentThreshold: ['comparing'],
    description: 'Link when user is ready to choose a broker after understanding their options',
  },
  // InvestingPro → SwingTrader (NEVER direct, always through explainer)
  {
    from: 'investingpro',
    to: 'swingtrader',
    allowedPlacements: ['explainer'], // Only through explainer pages
    requiredContext: 'User needs advanced real-time trading tools after education',
    explainerPagePath: '/advanced-tools/active-trading',
    intentThreshold: ['executing'],
    description: 'Link only through explainer pages, never directly from shallow content',
  },
  // BestStockBrokers → InvestingPro
  {
    from: 'beststockbrokers',
    to: 'investingpro',
    allowedPlacements: ['footer', 'contextual'],
    requiredContext: 'User needs education before choosing a broker',
    explainerPagePath: '/learn/investment-basics',
    intentThreshold: ['learning'],
    description: 'Backward link for users who need education',
  },
  // BestStockBrokers → SwingTrader
  {
    from: 'beststockbrokers',
    to: 'swingtrader',
    allowedPlacements: ['contextual', 'explainer'],
    requiredContext: 'User has chosen broker and needs execution tools',
    explainerPagePath: '/advanced-tools/execution-platforms',
    intentThreshold: ['executing'],
    description: 'Link when frequency/sophistication threshold is crossed',
  },
  // SwingTrader → InvestingPro
  {
    from: 'swingtrader',
    to: 'investingpro',
    allowedPlacements: ['footer', 'contextual'],
    requiredContext: 'User needs to learn more about investment strategies',
    explainerPagePath: '/learn/advanced-strategies',
    intentThreshold: ['learning'],
    description: 'Context exit for users who need education',
  },
  // SwingTrader → BestStockBrokers
  {
    from: 'swingtrader',
    to: 'beststockbrokers',
    allowedPlacements: ['footer', 'contextual'],
    requiredContext: 'User needs to compare brokers',
    explainerPagePath: '/tools/broker-comparison',
    intentThreshold: ['comparing'],
    description: 'Context exit for users who need broker comparison',
  },
];

/**
 * Evaluates if a link should exist based on user intent and page context
 */
export function shouldLink(
  from: Platform,
  to: Platform,
  userIntent: UserIntent,
  placement: LinkPlacement
): boolean {
  const rule = LINKING_RULES.find((r) => r.from === from && r.to === to);
  
  if (!rule) {
    return false; // No rule exists, don't link
  }

  // Check if placement is allowed
  if (!rule.allowedPlacements.includes(placement)) {
    return false;
  }

  // Check if user intent matches threshold
  if (!rule.intentThreshold.includes(userIntent)) {
    return false;
  }

  // Special rules
  if (placement === 'hero' || placement === 'cta') {
    return false; // Never in hero or primary CTAs
  }

  return true;
}

/**
 * Gets the explainer page path for a cross-platform link
 */
export function getExplainerPath(from: Platform, to: Platform): string | null {
  const rule = LINKING_RULES.find((r) => r.from === from && r.to === to);
  return rule?.explainerPagePath || null;
}

/**
 * Evaluates if a link reduces uncertainty or increases cognitive load
 */
export function evaluateLinkValue(
  from: Platform,
  to: Platform,
  userIntent: UserIntent,
  placement: LinkPlacement
): { shouldLink: boolean; reason: string } {
  const rule = LINKING_RULES.find((r) => r.from === from && r.to === to);

  if (!rule) {
    return {
      shouldLink: false,
      reason: 'No linking rule exists between these platforms',
    };
  }

  // Never in hero or primary CTAs
  if (placement === 'hero' || placement === 'cta') {
    return {
      shouldLink: false,
      reason: 'Links should not be in hero sections or primary CTAs',
    };
  }

  // Check intent match
  if (!rule.intentThreshold.includes(userIntent)) {
    return {
      shouldLink: false,
      reason: `User intent (${userIntent}) does not match required threshold (${rule.intentThreshold.join(', ')})`,
    };
  }

  // Check placement
  if (!rule.allowedPlacements.includes(placement)) {
    return {
      shouldLink: false,
      reason: `Placement (${placement}) is not allowed. Allowed: ${rule.allowedPlacements.join(', ')}`,
    };
  }

  return {
    shouldLink: true,
    reason: rule.description,
  };
}

