/**
 * Entity Services Index
 * 
 * Purpose: Central export point for all entity services
 */

export { BaseEntityService } from './base-entity.service';
export { creditCardService, type CreditCard } from './credit-card.service';
export { mutualFundService, type MutualFund } from './mutual-fund.service';
export { brokerService, type Broker } from './broker.service';
export { insuranceService, type Insurance } from './insurance.service';
export { loanService, type Loan } from './loan.service';
export { ipoService, type IPO } from './ipo.service';

/**
 * Usage:
 * 
 * import { creditCardService, mutualFundService } from '@/lib/services/entities';
 * 
 * const cards = await creditCardService.list();
 * const funds = await mutualFundService.findByCategory('equity');
 */
