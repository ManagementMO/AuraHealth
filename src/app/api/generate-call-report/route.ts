import { NextRequest, NextResponse } from 'next/server';
import { generateReport } from '@/lib/utilities/gemini';
import { generateTimestampedFilename } from '@/lib/utilities/pdfGenerator';

export async function POST(request: NextRequest) {
  try {
    // Create the filename first
    const pdfFilename = generateTimestampedFilename('patient-sentiment-report');

    const json = await request.json();
    
    // Generate the PDF using the existing function with the filename
    await generateReport(json, pdfFilename);
    
    return NextResponse.json({ 
      success: true, 
      pdfUrl: `/api/reports/${pdfFilename}`,
      filename: pdfFilename
    });
  } catch (error) {
    console.error('Failed to generate report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate report' },
      { status: 500 }
    );
  }
} 