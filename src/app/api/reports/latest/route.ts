import { NextResponse } from 'next/server';

export async function GET() {
  // For now, return a simple HTML page that looks like a PDF
  // In a real implementation, this would serve the actual generated PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Patient Sentiment Report</title>
      <style>
        body {
          font-family: 'Times New Roman', serif;
          margin: 40px;
          line-height: 1.6;
          color: #333;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #34495e;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #2c3e50;
          margin: 0;
        }
        .section {
          margin-bottom: 25px;
        }
        h2 {
          color: #34495e;
          border-left: 4px solid #3498db;
          padding-left: 15px;
        }
        .patient-info {
          background-color: #f8f9fa;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 20px;
        }
        .recommendation {
          background-color: #e8f4fd;
          border: 1px solid #b3d9ff;
          padding: 15px;
          margin: 15px 0;
          border-radius: 5px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Patient Sentiment & Engagement Report</h1>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
      </div>
      
      <div class="patient-info">
        <strong>Patient ID:</strong> P789-01<br>
        <strong>Patient Name:</strong> John Smith<br>
        <strong>Consultation Date:</strong> ${new Date().toLocaleDateString()}<br>
        <strong>Call Duration:</strong> 00:15:30
      </div>
      
      <div class="section">
        <h2>1. Executive Summary</h2>
        <p>This consultation analysis reveals a patient who initially presented with moderate anxiety and uncertainty about their treatment plan. Throughout the conversation, the patient demonstrated increasing engagement and understanding, particularly when complex medical concepts were explained using analogies.</p>
      </div>
      
      <div class="section">
        <h2>2. Detailed Sentiment Analysis</h2>
        <h3>Sentiment Trajectory</h3>
        <p>The patient's emotional state evolved from initial anxiety (score: 0.85) to growing interest and relief as the consultation progressed. Key turning points included clarification of treatment side effects and explanation of the medication mechanism.</p>
        
        <h3>Key Emotional Peaks</h3>
        <p><strong>Anxiety Peak:</strong> When discussing potential side effects of new medication (timestamp: 00:08:20)<br>
        <strong>Relief Peak:</strong> After understanding the treatment mechanism (timestamp: 00:12:50)</p>
      </div>
      
      <div class="section">
        <h2>3. Communication Style Analysis</h2>
        <p>The patient demonstrated a thoughtful communication style with frequent pauses before responding to complex questions. They showed high engagement when medical concepts were explained using relatable analogies.</p>
      </div>
      
      <div class="section">
        <h2>4. Actionable Recommendations</h2>
        <div class="recommendation">
          <strong>Recommendation 1:</strong> Continue using analogies when explaining complex medical concepts, as this significantly improved patient understanding and engagement.
        </div>
        <div class="recommendation">
          <strong>Recommendation 2:</strong> Allow for comfortable silence during patient responses, as they need time to formulate thoughtful answers.
        </div>
        <div class="recommendation">
          <strong>Recommendation 3:</strong> Proactively address potential side effects early in future consultations to reduce patient anxiety.
        </div>
      </div>
      
      <div style="margin-top: 40px; text-align: center; color: #7f8c8d; font-size: 12px;">
        <p>Aura Health - AI-Powered Patient Sentiment Analysis</p>
      </div>
    </body>
    </html>
  `;

  return new NextResponse(htmlContent, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
} 