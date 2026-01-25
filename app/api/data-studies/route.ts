import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllDataStudies, 
  getStudiesByCategory, 
  searchStudies,
  type StudyCategory 
} from '@/lib/linkable-assets/data-studies-service';

/**
 * GET /api/data-studies
 * 
 * Query parameters:
 * - category: Filter by category (loans, insurance, banking, etc.)
 * - search: Search studies by title/description
 * - format: Response format (json, csv)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category') as StudyCategory | null;
    const search = searchParams.get('search');
    const format = searchParams.get('format') || 'json';
    const slug = searchParams.get('slug');

    let studies;

    // Get single study by slug
    if (slug) {
      const allStudies = await getAllDataStudies();
      const study = allStudies.find(s => s.slug === slug);
      
      if (!study) {
        return NextResponse.json(
          { error: 'Study not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: study,
      });
    }

    // Filter by category
    if (category) {
      studies = await getStudiesByCategory(category);
    } 
    // Search studies
    else if (search) {
      studies = await searchStudies(search);
    } 
    // Get all studies
    else {
      studies = await getAllDataStudies();
    }

    // Return CSV format
    if (format === 'csv') {
      const csvRows = [
        ['ID', 'Title', 'Category', 'Data Points', 'Last Updated', 'URL'].join(','),
        ...studies.map(s => [
          s.id,
          `"${s.title}"`,
          s.category,
          s.dataPoints.length,
          s.lastUpdated.toISOString(),
          `https://investingpro.in/data-studies/${s.slug}`,
        ].join(','))
      ];

      return new NextResponse(csvRows.join('\n'), {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="data-studies.csv"',
        },
      });
    }

    // Return JSON format
    return NextResponse.json({
      success: true,
      count: studies.length,
      categories: [...new Set(studies.map(s => s.category))],
      data: studies.map(study => ({
        id: study.id,
        slug: study.slug,
        title: study.title,
        description: study.description,
        category: study.category,
        subCategory: study.subCategory,
        dataPointsCount: study.dataPoints.length,
        insights: study.insights,
        methodology: study.methodology,
        lastUpdated: study.lastUpdated,
        updateFrequency: study.updateFrequency,
        isLive: study.isLive,
        url: `https://investingpro.in/data-studies/${study.slug}`,
        embedUrl: `https://investingpro.in/data-studies/${study.slug}/embed`,
      })),
      meta: {
        source: 'InvestingPro.in',
        license: 'CC BY 4.0 - Attribution required',
        documentation: 'https://investingpro.in/api/docs',
      },
    });
  } catch (error) {
    console.error('Data studies API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data studies' },
      { status: 500 }
    );
  }
}
