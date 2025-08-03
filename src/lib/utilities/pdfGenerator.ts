import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

export interface PDFOptions {
  format?: 'A4' | 'Letter' | 'Legal';
  margin?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  printBackground?: boolean;
}

export async function generatePDF(
  htmlContent: string, 
  filename: string, 
  outputDir?: string,
  options: PDFOptions = {}
) {
  try {
    // Create the output directory if it doesn't exist
    const filesDir = outputDir || path.join(process.cwd(), 'src', 'lib', 'utilities', 'files');
    if (!fs.existsSync(filesDir)) {
      fs.mkdirSync(filesDir, { recursive: true });
    }

    // Create HTML content with professional styling
    const styledHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Patient Sentiment Report</title>
        <style>
          @page {
            margin: 0.75in;
            size: A4;
          }
          
          body {
            font-family: 'Times New Roman', serif;
            font-size: 11pt;
            line-height: 1.4;
            color: #2c3e50;
            margin: 0;
            padding: 0;
          }
          
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #34495e;
            padding-bottom: 15px;
          }
          
          .header h1 {
            font-size: 18pt;
            font-weight: bold;
            margin: 0 0 10px 0;
            color: #2c3e50;
          }
          
          .header-info {
            font-size: 10pt;
            color: #7f8c8d;
            margin: 5px 0;
          }
          
          h2 {
            font-size: 14pt;
            font-weight: bold;
            color: #34495e;
            margin: 25px 0 12px 0;
            border-left: 4px solid #3498db;
            padding-left: 12px;
          }
          
          h3 {
            font-size: 12pt;
            font-weight: bold;
            color: #2c3e50;
            margin: 18px 0 8px 0;
          }
          
          p {
            margin: 0 0 10px 0;
            text-align: justify;
            text-indent: 0;
          }
          
          ul, ol {
            margin: 8px 0 8px 20px;
            padding-left: 0;
          }
          
          li {
            margin-bottom: 4px;
            line-height: 1.3;
          }
          
          .section {
            margin-bottom: 20px;
          }
          
          .highlight {
            background-color: #f8f9fa;
            padding: 8px 12px;
            border-left: 3px solid #3498db;
            margin: 10px 0;
            font-style: italic;
          }
          
          .recommendation {
            background-color: #e8f4fd;
            border: 1px solid #b3d9ff;
            padding: 10px 15px;
            margin: 12px 0;
            border-radius: 4px;
          }
          
          .recommendation strong {
            color: #2980b9;
          }
          
          .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #bdc3c7;
            font-size: 9pt;
            color: #7f8c8d;
            text-align: center;
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>
    `;

    // Launch puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(styledHTML);
    
         // Generate PDF with custom options or defaults
     const pdfPath = path.join(filesDir, filename);
     await page.pdf({
       path: pdfPath,
       format: options.format || 'A4',
       margin: {
         top: options.margin?.top || '15mm',
         right: options.margin?.right || '15mm',
         bottom: options.margin?.bottom || '15mm',
         left: options.margin?.left || '15mm'
       },
       printBackground: options.printBackground !== false,
       preferCSSPageSize: true
     });

    await browser.close();
    console.log(`PDF generated successfully: ${pdfPath}`);
    return pdfPath;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}

export function convertTextToHTML(text: string): string {
  // Clean up Gemini formatting and create professional structure
  let cleanedText = text
    // Remove common Gemini artifacts
    .replace(/\*\*/g, '') // Remove bold markers
    .replace(/\*/g, '') // Remove italic markers
    .replace(/`/g, '') // Remove code markers
    .replace(/^["']|["']$/g, '') // Remove surrounding quotes
    .replace(/^Prompt:\s*/i, '') // Remove prompt prefix
    .replace(/Report Tone and Style:[\s\S]*$/i, '') // Remove instructions at the end
    .trim();

  // Extract patient info from the first few lines
  const lines = cleanedText.split('\n');
  let patientInfo = '';
  let reportContent = '';
  let inHeader = true;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (inHeader && (line.includes('Patient:') || line.includes('Date of Consultation:') || line.includes('Report Date:'))) {
      patientInfo += line + '<br>';
    } else if (line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.') || line.startsWith('4.') || line.startsWith('5.')) {
      inHeader = false;
      reportContent += `<h2>${line}</h2>`;
    } else if (line.startsWith('###')) {
      // Handle markdown headers (###)
      const headerText = line.replace(/^###\s*/, '');
      reportContent += `<h3>${headerText}</h3>`;
    } else if (line.startsWith('##')) {
      // Handle markdown headers (##)
      const headerText = line.replace(/^##\s*/, '');
      reportContent += `<h2>${headerText}</h2>`;
    } else if (line.startsWith('#')) {
      // Handle markdown headers (#)
      const headerText = line.replace(/^#\s*/, '');
      reportContent += `<h1>${headerText}</h1>`;
    } else if (line.match(/^[A-Z][^:]*:$/) && !line.includes('Patient:') && !line.includes('Date:')) {
      reportContent += `<h3>${line}</h3>`;
    } else if (line.startsWith('Example Recommendation')) {
      reportContent += `<div class="recommendation"><strong>${line}</strong>`;
    } else if (line.trim() === '') {
      if (reportContent.endsWith('</div>')) {
        reportContent += '<br>';
      } else {
        reportContent += '</p><p>';
      }
    } else {
      if (reportContent.endsWith('</div>')) {
        reportContent += line + '<br>';
      } else {
        reportContent += line + ' ';
      }
    }
  }

  // Create the final HTML structure
  const html = `
    <div class="header">
      <h1>Patient Sentiment & Engagement Report</h1>
      <div class="header-info">
        ${patientInfo}
      </div>
    </div>
    
    <div class="content">
      ${reportContent}
    </div>
    
    <div class="footer">
      <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
      <p>Aura Health - AI-Powered Patient Sentiment Analysis</p>
    </div>
  `;

  return html;
}

export function generateTimestampedFilename(prefix: string, extension: string = 'pdf'): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  return `${prefix}-${timestamp}.${extension}`;
} 