/**
 * Example API Route using new middleware
 * 
 * Purpose: Demonstrates how to use the new service layer and middleware
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/api/middleware/with-auth';
import { withValidation } from '@/lib/api/middleware/with-validation';
import { withErrorHandling, NotFoundError } from '@/lib/api/middleware/with-error-handling';
import { creditCardService } from '@/lib/services/entities/credit-card.service';
import { z } from 'zod';

// Validation schema
const createCreditCardSchema = z.object({
  name: z.string().min(1),
  issuer: z.string().min(1),
  card_type: z.string(),
  annual_fee: z.number().min(0),
  joining_fee: z.number().min(0),
  rewards_rate: z.number().min(0),
  features: z.array(z.string()).optional(),
  best_for: z.array(z.string()).optional()
});

/**
 * GET /api/credit-cards - List all credit cards
 */
export async function GET(request: NextRequest) {
  return withErrorHandling(async () => {
    const { searchParams } = new URL(request.url);
    const issuer = searchParams.get('issuer');
    const type = searchParams.get('type');

    let cards;
    if (issuer) {
      cards = await creditCardService.findByIssuer(issuer);
    } else if (type) {
      cards = await creditCardService.findByType(type);
    } else {
      cards = await creditCardService.list();
    }

    return NextResponse.json({
      success: true,
      data: cards,
      count: cards.length
    });
  })(request);
}

/**
 * POST /api/credit-cards - Create new credit card (admin only)
 */
export const POST = withErrorHandling(
  withAuth(
    withValidation(createCreditCardSchema)(
      async (request, { validated }) => {
        const card = await creditCardService.create(validated);

        return NextResponse.json({
          success: true,
          data: card
        }, { status: 201 });
      }
    )
  )
);

/**
 * GET /api/credit-cards/[id] - Get credit card by ID
 */
export async function GET_BY_ID(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withErrorHandling(async () => {
    const card = await creditCardService.getById(params.id);

    if (!card) {
      throw new NotFoundError('Credit card not found');
    }

    return NextResponse.json({
      success: true,
      data: card
    });
  })(request);
}
