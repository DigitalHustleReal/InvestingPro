/**
 * Unit Tests: Validation
 */

import { z } from 'zod';
import { withZodValidation } from '@/lib/middleware/zod-validation';

describe('Validation Unit Tests', () => {
  describe('Zod Schemas', () => {
    const testSchema = z.object({
      name: z.string().min(1),
      email: z.string().email(),
      age: z.number().min(0).max(120),
    });

    it('should validate correct data', () => {
      const data = {
        name: 'Test User',
        email: 'test@example.com',
        age: 25,
      };

      const result = testSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(data);
      }
    });

    it('should reject invalid email', () => {
      const data = {
        name: 'Test User',
        email: 'invalid-email',
        age: 25,
      };

      const result = testSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject invalid age', () => {
      const data = {
        name: 'Test User',
        email: 'test@example.com',
        age: 150,
      };

      const result = testSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject missing required fields', () => {
      const data = {
        name: 'Test User',
        // email missing
        age: 25,
      };

      const result = testSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('Validation Middleware', () => {
    it('should validate request data', async () => {
      const schema = z.object({
        title: z.string().min(1),
      });

      const mockHandler = async (req: any, context: { body: any }) => {
        return new Response(JSON.stringify({ success: true, data: context.body }), {
           headers: { 'Content-Type': 'application/json' }
        });
      };

      const handler = withZodValidation({ body: schema })(mockHandler as any);

      const request = new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify({ title: 'Test Title' }),
        headers: { 'Content-Type': 'application/json' },
      }) as any;

      request.nextUrl = new URL('http://localhost');

      const response = await handler(request, {});
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.title).toBe('Test Title');
    });

    it('should reject invalid request data', async () => {
      const schema = z.object({
        title: z.string().min(1),
      });

      const mockHandler = async () => {
        return new Response(JSON.stringify({ success: true }), {
           headers: { 'Content-Type': 'application/json' }
        });
      };

      const handler = withZodValidation({ body: schema })(mockHandler as any);

      const request = new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify({ title: '' }), // Invalid: empty string
        headers: { 'Content-Type': 'application/json' },
      }) as any;

      request.nextUrl = new URL('http://localhost');

      const response = await handler(request, {});
      
      expect(response.status).toBe(400);
      const error = await response.json();
      expect(error.code).toBe('VALIDATION_ERROR');
    });
  });
});
