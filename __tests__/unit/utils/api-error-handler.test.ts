import { handleAPIError, APIError, APIErrors } from '@/lib/utils/api-error-handler';
import { NextResponse } from 'next/server';

// Mock logger to prevent spam during tests
jest.mock('@/lib/logger', () => ({
    logger: {
        error: jest.fn(),
        warn: jest.fn(),
        info: jest.fn()
    }
}));

// Mock sentry
jest.mock('@/lib/monitoring/sentry', () => ({
    captureException: jest.fn()
}));

describe('API Error Handler', () => {
    describe('APIError', () => {
        it('should create an instance with correct properties', () => {
            const error = new APIError('message', 'CODE', 404, { detail: 'unit test' });
            expect(error.message).toBe('message');
            expect(error.code).toBe('CODE');
            expect(error.statusCode).toBe(404);
            expect(error.details).toEqual({ detail: 'unit test' });
        });
    });

    describe('handleAPIError', () => {
        it('should handle APIError instances', () => {
            const error = new APIError('test fail', 'TEST_CODE', 400);
            const response = handleAPIError(error, 'User Message');
            
            expect(response.status).toBe(400);
            // NextResponse.json() returns a Response object, we need to parse its body
            // However, in Jest with Next.js, we can check the internal state if needed
            // But let's check high level properties if available
        });

        it('should map standard errors to correct status codes', () => {
            const error = new Error('not found something');
            const response = handleAPIError(error);
            expect(response.status).toBe(404);

            const authError = new Error('unauthorized access');
            expect(handleAPIError(authError).status).toBe(401);

            const valError = new Error('validation failed');
            expect(handleAPIError(valError).status).toBe(400);
        });
    });

    describe('APIErrors factory', () => {
        it('should create pre-configured errors', () => {
            const notFound = APIErrors.notFound('Article');
            expect(notFound.statusCode).toBe(404);
            expect(notFound.code).toBe('NOT_FOUND');
            expect(notFound.message).toBe('Article not found');

            const validation = APIErrors.validation('missing title');
            expect(validation.statusCode).toBe(400);
            expect(validation.message).toBe('missing title');
        });
    });
});
