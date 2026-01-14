/**
 * API Middleware Index
 * 
 * Purpose: Central export point for all API middleware
 */

export { withAuth, withAdmin, withOptionalAuth } from './with-auth';
export { withValidation, withQueryValidation } from './with-validation';
export {
  withErrorHandling,
  withCORS,
  withRateLimitHeaders,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError
} from './with-error-handling';

/**
 * Usage:
 * 
 * import { withAuth, withValidation, withErrorHandling } from '@/lib/api/middleware';
 * 
 * export const POST = withErrorHandling(
 *   withAuth(
 *     withValidation(schema)(
 *       async (request, { validated, user }) => {
 *         // Your logic here
 *       }
 *     )
 *   )
 * );
 */
