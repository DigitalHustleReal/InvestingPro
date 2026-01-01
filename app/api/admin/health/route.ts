
import { NextResponse } from 'next/server';
import { api } from '@/lib/api';

export async function GET() {
    try {
        const health = api.integrations.Core.getAIHealth();
        return NextResponse.json({ 
            timestamp: new Date().toISOString(),
            providers: health 
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
