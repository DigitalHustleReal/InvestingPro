/**
 * Inngest Client
 * Message queue client for background job processing
 */
import { Inngest } from 'inngest';

export const inngest = new Inngest({ 
  id: 'investingpro',
  name: 'InvestingPro Queue',
  // Event key will be set via environment variable
  // Signing key will be set via environment variable
});
