import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

/**
 * Dynamic OG Image Generator
 * Usage: /api/og?title=...&category=...&type=calculator|article|product|default
 *
 * Example:
 *   /api/og?title=SIP+Calculator&category=Calculators&type=calculator
 *   /api/og?title=Best+HDFC+Credit+Cards&category=Credit+Cards&type=product
 */
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    const title = searchParams.get('title') || 'InvestingPro';
    const category = searchParams.get('category') || 'Personal Finance';
    const type = (searchParams.get('type') || 'default') as 'calculator' | 'article' | 'product' | 'default';
    const subtitle = searchParams.get('subtitle') || 'India\'s Most Trusted Finance Platform';

    // Color per content type
    const accent = {
        calculator: '#06B6D4',   // cyan (primary)
        article:    '#8B5CF6',   // purple
        product:    '#10B981',   // green
        default:    '#06B6D4',   // cyan
    }[type];

    const badge = {
        calculator: '🧮 Free Tool',
        article:    '📰 Expert Guide',
        product:    '⭐ Expert Reviewed',
        default:    '🇮🇳 Made for India',
    }[type];

    return new ImageResponse(
        (
            <div
                style={{
                    width: '1200px',
                    height: '630px',
                    background: '#0F172A',
                    display: 'flex',
                    flexDirection: 'column',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Background gradient blob */}
                <div
                    style={{
                        position: 'absolute',
                        top: '-150px',
                        right: '-100px',
                        width: '500px',
                        height: '500px',
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${accent}30 0%, transparent 70%)`,
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: '-100px',
                        left: '-100px',
                        width: '400px',
                        height: '400px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, #1E293B 0%, transparent 70%)',
                    }}
                />

                {/* Left accent bar */}
                <div
                    style={{
                        position: 'absolute',
                        left: '0',
                        top: '0',
                        width: '6px',
                        height: '100%',
                        background: `linear-gradient(180deg, ${accent} 0%, transparent 100%)`,
                    }}
                />

                {/* Content */}
                <div style={{ padding: '60px 80px', display: 'flex', flexDirection: 'column', height: '100%' }}>

                    {/* Top row: Brand + Badge */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                        {/* Brand */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: '40px', height: '40px',
                                borderRadius: '10px',
                                background: accent,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '20px', fontWeight: 'bold', color: 'white',
                            }}>i</div>
                            <span style={{ color: 'white', fontSize: '22px', fontWeight: '700', letterSpacing: '-0.5px' }}>
                                InvestingPro
                            </span>
                            <span style={{ color: '#64748B', fontSize: '14px', marginLeft: '4px' }}>investingpro.in</span>
                        </div>

                        {/* Badge */}
                        <div style={{
                            background: `${accent}20`,
                            border: `1px solid ${accent}50`,
                            borderRadius: '24px',
                            padding: '6px 16px',
                            color: accent,
                            fontSize: '14px',
                            fontWeight: '600',
                        }}>
                            {badge}
                        </div>
                    </div>

                    {/* Category tag */}
                    <div style={{
                        color: accent,
                        fontSize: '16px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        marginBottom: '20px',
                    }}>
                        {category}
                    </div>

                    {/* Main title */}
                    <div style={{
                        color: 'white',
                        fontSize: title.length > 50 ? '44px' : title.length > 35 ? '52px' : '60px',
                        fontWeight: '800',
                        lineHeight: '1.15',
                        letterSpacing: '-1.5px',
                        maxWidth: '850px',
                        flex: 1,
                    }}>
                        {title}
                    </div>

                    {/* Bottom row: subtitle + trust signals */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div style={{ color: '#94A3B8', fontSize: '18px', maxWidth: '500px' }}>
                            {subtitle}
                        </div>

                        {/* Trust signals */}
                        <div style={{ display: 'flex', gap: '24px' }}>
                            {[
                                { label: 'Products', value: '10,000+' },
                                { label: 'Investors', value: '12K+' },
                                { label: 'Free Tools', value: '24' },
                            ].map(({ label, value }) => (
                                <div key={label} style={{ textAlign: 'right' }}>
                                    <div style={{ color: 'white', fontSize: '22px', fontWeight: '700' }}>{value}</div>
                                    <div style={{ color: '#64748B', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
        }
    );
}
