/**
 * Generate Download File
 * Generates Excel, PDF, CSV files on-the-fly
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDownloadById } from '@/lib/downloads/download-service';
import { getTemplate, getAllTemplates } from '@/lib/downloads/dashboard-templates';
import { generateExcelFromTemplate, generatePDFFromTemplate, generateCSVFromTemplate, generateNotionInstructions } from '@/lib/downloads/file-generators';
import { logger } from '@/lib/logger';

export async function GET(
    request: NextRequest,
    { params }: { params: { resourceId: string } }
) {
    try {
        const resource = await getDownloadById(params.resourceId);
        
        if (!resource) {
            return NextResponse.json(
                { error: 'Resource not found' },
                { status: 404 }
            );
        }

        // Generate file based on format
        if (resource.format === 'excel') {
            return await generateExcelFile(resource);
        } else if (resource.format === 'pdf') {
            return await generatePDFFile(resource);
        } else if (resource.format === 'csv') {
            return await generateCSVFile(resource);
        } else if (resource.format === 'google-sheets') {
            // Return CSV (can be imported to Google Sheets)
            return await generateCSVFile(resource);
        } else if (resource.format === 'notion') {
            // Return Notion setup instructions
            const template = getTemplate(resource.title);
            if (template) {
                const instructions = generateNotionInstructions(template);
                return new NextResponse(instructions, {
                    headers: {
                        'Content-Type': 'text/markdown',
                        'Content-Disposition': `attachment; filename="${resource.title.replace(/\s+/g, '_')}_Notion_Setup.md"`
                    }
                });
            }
            return await generateCSVFile(resource); // Fallback
        }

        return NextResponse.json(
            { error: 'Unsupported format' },
            { status: 400 }
        );

    } catch (error: any) {
        logger.error('Error generating download file', error);
        
        return NextResponse.json(
            {
                error: 'Failed to generate file',
                message: error.message
            },
            { status: 500 }
        );
    }
}

/**
 * Generate Excel file
 */
async function generateExcelFile(resource: any): Promise<NextResponse> {
    try {
        // Check if it's a dashboard template
        const template = getTemplate(resource.title);
        
        if (template) {
            // Generate CSV (Excel-compatible)
            const csvData = generateExcelFromTemplate(template);
            
            // Return as CSV (Excel can open CSV files)
            // TODO: Use ExcelJS to generate real .xlsx files
            return new NextResponse(csvData, {
                headers: {
                    'Content-Type': 'text/csv',
                    'Content-Disposition': `attachment; filename="${resource.title.replace(/\s+/g, '_')}.csv"`
                }
            });
        }

        // Fallback: simple CSV
        const csv = generateSimpleCSV(resource);
        
        return new NextResponse(csv, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="${resource.title.replace(/\s+/g, '_')}.csv"`
            }
        });

    } catch (error) {
        throw error;
    }
}

/**
 * Generate PDF file
 */
async function generatePDFFile(resource: any): Promise<NextResponse> {
    // For now, return a placeholder
    // In production, use jsPDF or Puppeteer to generate PDFs
    
    const pdfContent = `PDF Generation for: ${resource.title}\n\n${resource.description}`;
    
    return new NextResponse(pdfContent, {
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${resource.title.replace(/\s+/g, '_')}.pdf"`
        }
    });
}

/**
 * Generate CSV file
 */
async function generateCSVFile(resource: any): Promise<NextResponse> {
    const csv = generateSimpleCSV(resource);
    
    return new NextResponse(csv, {
        headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="${resource.title.replace(/\s+/g, '_')}.csv"`
        }
    });
}


/**
 * Generate simple CSV
 */
function generateSimpleCSV(resource: any): string {
    return `Title,Description,Category\n"${resource.title}","${resource.description}","${resource.category}"`;
}
