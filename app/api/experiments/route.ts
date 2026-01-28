import { NextRequest, NextResponse } from 'next/server';

/**
 * Experiments API
 * 
 * GET /api/experiments - List all experiments
 * POST /api/experiments - Create new experiment
 */

// Mock experiments data (replace with database)
const experiments = [
    {
        id: 'cta-button-color',
        name: 'CTA Button Color Test',
        description: 'Testing red vs blue CTA buttons for conversion rate',
        status: 'running',
        variants: [
            { id: 'control', name: 'Blue Button', weight: 50 },
            { id: 'red', name: 'Red Button', weight: 50 }
        ],
        startDate: new Date('2026-01-20'),
        targetMetric: 'click_through_rate',
        trafficAllocation: 100
    },
    {
        id: 'headline-test',
        name: 'Homepage Headline Test',
        description: 'Testing different headline copy',
        status: 'running',
        variants: [
            { id: 'control', name: 'Original', weight: 33 },
            { id: 'variant-a', name: 'Benefit-focused', weight: 33 },
            { id: 'variant-b', name: 'Question-based', weight: 34 }
        ],
        startDate: new Date('2026-01-25'),
        targetMetric: 'signup_rate',
        trafficAllocation: 50
    }
];

export async function GET(request: NextRequest) {
    try {
        return NextResponse.json(experiments);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch experiments' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        // Validate experiment data
        if (!body.name || !body.variants || body.variants.length < 2) {
            return NextResponse.json(
                { error: 'Invalid experiment data' },
                { status: 400 }
            );
        }

        // Create new experiment
        const newExperiment = {
            id: body.name.toLowerCase().replace(/\s+/g, '-'),
            name: body.name,
            description: body.description || '',
            status: 'draft',
            variants: body.variants,
            targetMetric: body.targetMetric || 'conversion_rate',
            trafficAllocation: body.trafficAllocation || 100,
            startDate: new Date()
        };

        experiments.push(newExperiment);

        return NextResponse.json(newExperiment, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create experiment' },
            { status: 500 }
        );
    }
}
