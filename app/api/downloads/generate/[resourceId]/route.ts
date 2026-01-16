/**
 * Generate Download File
 * Generates Excel, PDF, CSV files on-the-fly
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDownloadById } from '@/lib/downloads/download-service';
import { getTemplate, getAllTemplates } from '@/lib/downloads/dashboard-templates';
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
            // Generate Excel from template
            const excelData = generateExcelFromTemplate(template);
            
            return new NextResponse(excelData, {
                headers: {
                    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'Content-Disposition': `attachment; filename="${resource.title.replace(/\s+/g, '_')}.xlsx"`
                }
            });
        }

        // For now, return a simple CSV (Excel can open CSV)
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
 * Generate Excel from template
 */
function generateExcelFromTemplate(template: any): Buffer {
    // In production, use ExcelJS to generate actual Excel files
    // For now, return CSV that Excel can open
    
    const csv = generateCSVFromTemplate(template);
    return Buffer.from(csv, 'utf-8');
}

/**
 * Generate CSV from template
 */
function generateCSVFromTemplate(template: any): string {
    const headers = template.columns.map((col: any) => col.name).join(',');
    const rows = template.sampleData?.map((row: any) => 
        row.map((cell: any) => `"${cell}"`).join(',')
    ).join('\n') || '';
    
    return `${headers}\n${rows}`;
}

/**
 * Generate simple CSV
 */
function generateSimpleCSV(resource: any): string {
    return `Title,Description,Category\n"${resource.title}","${resource.description}","${resource.category}"`;
}
