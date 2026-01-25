import { NextRequest, NextResponse } from 'next/server';
import { getDataStudyBySlug } from '@/lib/linkable-assets/data-studies-service';

/**
 * GET /api/data-studies/[slug]
 * 
 * Get a specific data study with full data points
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const study = await getDataStudyBySlug(slug);

    if (!study) {
      return NextResponse.json(
        { error: 'Study not found', slug },
        { status: 404 }
      );
    }

    const format = request.nextUrl.searchParams.get('format') || 'json';

    // Return CSV format for data points
    if (format === 'csv') {
      const csvRows = [
        ['Label', 'Value', 'Unit', 'Change', 'Direction'].join(','),
        ...study.dataPoints.map(dp => [
          `"${dp.label}"`,
          dp.value,
          dp.unit || '',
          dp.change || '',
          dp.changeDirection || '',
        ].join(','))
      ];

      return new NextResponse(csvRows.join('\n'), {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${slug}-data.csv"`,
        },
      });
    }

    // Return full JSON
    return NextResponse.json({
      success: true,
      data: {
        ...study,
        url: `https://investingpro.in/data-studies/${study.slug}`,
        embedCode: `<iframe src="https://investingpro.in/data-studies/${study.slug}/embed" width="100%" height="400" frameborder="0"></iframe>`,
      },
      meta: {
        source: 'InvestingPro.in',
        license: 'CC BY 4.0 - Attribution required when citing',
        lastUpdated: study.lastUpdated,
        methodology: study.methodology,
        sources: study.sources || ['Official Government/Regulatory Sources'],
      },
    });
  } catch (error) {
    console.error('Data study API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data study' },
      { status: 500 }
    );
  }
}
