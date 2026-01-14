/**
 * Integration Tests: Error Handling
 */

import {
  ApiError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ErrorCode,
} from '@/lib/errors/types';
import { handleError } from '@/lib/errors/handler';

describe('Error Handling Integration', () => {
  describe('Error Types', () => {
    it('should create ValidationError with correct properties', () => {
      const error = new ValidationError('Invalid input', {
        field: 'email',
        value: 'invalid-email',
      });

      expect(error.code).toBe(ErrorCode.VALIDATION_ERROR);
      expect(error.statusCode).toBe(400);
      expect(error.details?.field).toBe('email');
      expect(error.isRetryable).toBe(false);
    });

    it('should create NotFoundError with correct properties', () => {
      const error = new NotFoundError('Article', 'test-id');

      expect(error.code).toBe(ErrorCode.NOT_FOUND);
      expect(error.statusCode).toBe(404);
      expect(error.message).toContain('Article');
      expect(error.isRetryable).toBe(false);
    });

    it('should create UnauthorizedError with correct properties', () => {
      const error = new UnauthorizedError('Invalid token');

      expect(error.code).toBe(ErrorCode.UNAUTHORIZED);
      expect(error.statusCode).toBe(401);
      expect(error.isRetryable).toBe(false);
    });

    it('should create ForbiddenError with correct properties', () => {
      const error = new ForbiddenError('Insufficient permissions');

      expect(error.code).toBe(ErrorCode.FORBIDDEN);
      expect(error.statusCode).toBe(403);
      expect(error.isRetryable).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should handle ApiError correctly', () => {
      const error = new ValidationError('Test error');
      const response = handleError(error);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('code');
    });

    it('should handle generic Error correctly', () => {
      const error = new Error('Generic error');
      const response = handleError(error);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
      expect(response.body.code).toBe(ErrorCode.INTERNAL_ERROR);
    });

    it('should include correlation ID in error response', () => {
      const error = new ApiError(
        ErrorCode.INTERNAL_ERROR,
        'Test error',
        500,
        { correlationId: 'test-correlation-id' }
      );
      const response = handleError(error);

      expect(response.body.correlationId).toBe('test-correlation-id');
    });
  });
});
