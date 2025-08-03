import { NextRequest, NextResponse } from 'next/server';

interface SessionData {
  sessionStart: string;
  sessionEnd: string;
  accessToken: string;
}

interface SentimentReport {
  overallSentiment: string;
  emotionalTone: string;
  confidenceLevel: number;
  keyInsights: string[];
  improvementTips: string[];
  praisedAspects: string[];
  emotionBreakdown: {
    [emotion: string]: number;
  };
}

// Mock sentiment analysis for demonstration
// In a real implementation, this would integrate with Hume AI's emotion analysis
function generateMockAnalysis(): SentimentReport {
  const sentiments = [
    "Positive and Engaged",
    "Calm and Confident", 
    "Slightly Nervous but Determined",
    "Optimistic with Some Anxiety",
    "Composed and Thoughtful"
  ];

  const emotionalTones = [
    "Calm with slight nervousness",
    "Confident and clear",
    "Thoughtful and measured",
    "Warm and engaging",
    "Steady with positive energy"
  ];

  const insightTemplates = [
    "You maintained good eye contact throughout the session",
    "Your voice remained steady and clear",
    "You asked thoughtful questions about your health",
    "You expressed your concerns clearly and directly",
    "You showed good listening skills during the conversation",
    "Your body language conveyed openness and engagement",
    "You demonstrated patience when discussing complex topics"
  ];

  const improvementTemplates = [
    "Try to speak a bit slower to convey more confidence",
    "Practice deep breathing before important conversations", 
    "Consider preparing key questions in advance",
    "Try to maintain more consistent eye contact",
    "Practice summarizing your main concerns concisely",
    "Work on reducing filler words like 'um' and 'uh'",
    "Consider using more specific language when describing symptoms"
  ];

  const praiseTemplates = [
    "Excellent communication clarity",
    "Good emotional regulation throughout the session",
    "Active listening demonstrated consistently",
    "Clear articulation of health concerns",
    "Appropriate level of detail in responses",
    "Strong rapport building with the provider",
    "Good use of follow-up questions"
  ];

  const emotionOptions = [
    { "Calm": 40, "Confident": 30, "Nervous": 20, "Engaged": 10 },
    { "Confident": 35, "Calm": 30, "Engaged": 25, "Nervous": 10 },
    { "Engaged": 40, "Calm": 25, "Confident": 20, "Nervous": 15 },
    { "Calm": 45, "Confident": 25, "Nervous": 15, "Engaged": 15 },
    { "Confident": 40, "Engaged": 30, "Calm": 20, "Nervous": 10 }
  ];

  // Randomly select elements to create variety
  const randomSentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
  const randomTone = emotionalTones[Math.floor(Math.random() * emotionalTones.length)];
  const randomConfidence = 65 + Math.floor(Math.random() * 25); // 65-90%
  
  // Shuffle and select 3 random insights
  const shuffledInsights = [...insightTemplates].sort(() => 0.5 - Math.random());
  const selectedInsights = shuffledInsights.slice(0, 3);
  
  // Shuffle and select 3 random improvement tips
  const shuffledImprovements = [...improvementTemplates].sort(() => 0.5 - Math.random());
  const selectedImprovements = shuffledImprovements.slice(0, 3);
  
  // Shuffle and select 3 random praised aspects
  const shuffledPraise = [...praiseTemplates].sort(() => 0.5 - Math.random());
  const selectedPraise = shuffledPraise.slice(0, 3);
  
  // Select random emotion breakdown
  const randomEmotions = emotionOptions[Math.floor(Math.random() * emotionOptions.length)];

  return {
    overallSentiment: randomSentiment,
    emotionalTone: randomTone,
    confidenceLevel: randomConfidence,
    keyInsights: selectedInsights,
    improvementTips: selectedImprovements,
    praisedAspects: selectedPraise,
    emotionBreakdown: randomEmotions
  };
}

// Advanced analysis using session timing and patterns
function generateAdvancedAnalysis(sessionData: SessionData): SentimentReport {
  const sessionDuration = new Date(sessionData.sessionEnd).getTime() - new Date(sessionData.sessionStart).getTime();
  const durationSeconds = sessionDuration / 1000;
  
  let report = generateMockAnalysis();
  
  // Adjust analysis based on session characteristics
  if (durationSeconds < 30) {
    report.improvementTips.push("Try to engage for the full session duration to get maximum benefit");
    report.confidenceLevel = Math.max(report.confidenceLevel - 10, 50);
  }
  
  if (durationSeconds >= 55) {
    report.praisedAspects.push("You utilized the full practice session effectively");
    report.confidenceLevel = Math.min(report.confidenceLevel + 5, 95);
  }
  
  // Add time-based insights
  const currentHour = new Date().getHours();
  if (currentHour < 12) {
    report.keyInsights.push("Morning practice sessions often show higher energy levels");
  } else if (currentHour >= 17) {
    report.keyInsights.push("Evening sessions demonstrate good preparation habits");
  }
  
  return report;
}

export async function POST(request: NextRequest) {
  try {
    const sessionData: SessionData = await request.json();
    
    // Validate required fields
    if (!sessionData.sessionStart || !sessionData.sessionEnd || !sessionData.accessToken) {
      return NextResponse.json(
        { error: 'Missing required session data' },
        { status: 400 }
      );
    }
    
    // Simulate processing time for more realistic UX
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate sentiment analysis report
    const report = generateAdvancedAnalysis(sessionData);
    
    // In a real implementation, you would:
    // 1. Use the accessToken to fetch actual conversation data from Hume
    // 2. Analyze the voice/text data for real emotions and sentiment
    // 3. Generate personalized insights based on actual conversation content
    // 4. Store the report in a database for future reference
    
    return NextResponse.json(report);
    
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Use POST method to generate reports' },
    { status: 405 }
  );
} 