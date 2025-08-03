import { NextRequest, NextResponse } from 'next/server';

interface SessionData {
  sessionStart: string;
  sessionEnd: string;
  accessToken: string;
  emotionData?: Record<string, number>;
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

// Analysis using real emotion data from the session
function generateRealAnalysis(sessionData: SessionData): SentimentReport {
  const sessionDuration = new Date(sessionData.sessionEnd).getTime() - new Date(sessionData.sessionStart).getTime();
  const durationSeconds = sessionDuration / 1000;
  
  // Use real emotion data if available, otherwise fall back to mock
  const emotionData = sessionData.emotionData && Object.keys(sessionData.emotionData).length > 0 
    ? sessionData.emotionData 
    : null;

  if (!emotionData) {
    console.log("No emotion data available, using mock analysis");
    return generateAdvancedMockAnalysis(sessionData);
  }

  console.log("Using real emotion data:", emotionData);

  // Advanced emotion analysis with sophisticated sentiment calculation
  const emotionEntries = Object.entries(emotionData).sort(([,a], [,b]) => b - a);
  const totalEmotionalIntensity = Object.values(emotionData).reduce((sum, val) => sum + val, 0);
  
  // Categorize emotions for better analysis
  const positiveEmotions = ['calmness', 'joy', 'amusement', 'satisfaction', 'relief', 'admiration', 'pride', 'contentment'];
  const confidenceEmotions = ['determination', 'concentration', 'interest', 'realization', 'triumph'];
  const anxietyEmotions = ['anxiety', 'fear', 'nervousness', 'worry', 'distress', 'awkwardness'];
  const negativeEmotions = ['sadness', 'disappointment', 'disgust', 'anger', 'contempt', 'boredom'];
  const neutralEmotions = ['surprise', 'confusion', 'contemplation'];
  
  // Calculate weighted scores for emotion categories
  let positiveScore = 0;
  let confidenceScore = 0;
  let anxietyScore = 0;
  let negativeScore = 0;
  let neutralScore = 0;
  
  Object.entries(emotionData).forEach(([emotion, score]) => {
    const emotionLower = emotion.toLowerCase();
    
    if (positiveEmotions.some(pos => emotionLower.includes(pos))) {
      positiveScore += score;
    }
    if (confidenceEmotions.some(conf => emotionLower.includes(conf))) {
      confidenceScore += score;
    }
    if (anxietyEmotions.some(anx => emotionLower.includes(anx))) {
      anxietyScore += score;
    }
    if (negativeEmotions.some(neg => emotionLower.includes(neg))) {
      negativeScore += score;
    }
    if (neutralEmotions.some(neut => emotionLower.includes(neut))) {
      neutralScore += score;
    }
  });

  // Calculate sophisticated confidence level (0-100)
  let confidenceLevel = 50; // Base level
  
  // Positive factors increase confidence
  confidenceLevel += Math.min(positiveScore * 25, 25);
  confidenceLevel += Math.min(confidenceScore * 30, 30);
  
  // Session duration factor
  const durationFactor = Math.min(durationSeconds / 45, 1.2); // Optimal at 45+ seconds
  confidenceLevel *= durationFactor;
  
  // Anxiety reduces confidence but not linearly (some anxiety is normal)
  if (anxietyScore > 0.3) {
    confidenceLevel -= Math.min((anxietyScore - 0.3) * 20, 15);
  }
  
  // Negative emotions impact
  confidenceLevel -= Math.min(negativeScore * 15, 20);
  
  // Emotional consistency bonus (less scattered emotions = more confidence)
  const emotionCount = Object.keys(emotionData).length;
  const dominanceRatio = emotionEntries[0][1] / totalEmotionalIntensity;
  if (dominanceRatio > 0.4 && emotionCount <= 4) {
    confidenceLevel += 5; // Bonus for clear emotional state
  }
  
  // Clamp confidence level
  confidenceLevel = Math.max(Math.min(Math.round(confidenceLevel), 95), 45);
  
  // Determine overall sentiment with sophisticated logic
  let overallSentiment = "Neutral and Balanced";
  let emotionalTone = "Steady and measured";
  
  const topEmotion = emotionEntries[0];
  const topEmotionName = topEmotion[0].toLowerCase();
  const topEmotionScore = topEmotion[1];
  
  // Edge case: Very low emotional intensity (flat affect)
  if (totalEmotionalIntensity < 0.5) {
    overallSentiment = "Calm and Reserved";
    emotionalTone = "Composed with minimal emotional variation";
    confidenceLevel = Math.max(confidenceLevel - 10, 50);
  }
  // Edge case: Very high anxiety
  else if (anxietyScore > 0.6) {
    overallSentiment = "Notably Anxious but Courageous";
    emotionalTone = "Nervous energy with determination to proceed";
    confidenceLevel = Math.max(confidenceLevel - 10, 45);
  }
  // Edge case: Mixed high anxiety + high confidence 
  else if (anxietyScore > 0.4 && confidenceScore > 0.4) {
    overallSentiment = "Determined Despite Nervousness";
    emotionalTone = "Confident resolve with natural apprehension";
    confidenceLevel = Math.min(confidenceLevel + 5, 85); // Bonus for overcoming anxiety
  }
  // Strong positive emotions
  else if (positiveScore > 0.5) {
    if (confidenceScore > 0.3) {
      overallSentiment = "Confident and Positive";
      emotionalTone = "Self-assured with genuine optimism";
    } else {
      overallSentiment = "Positive and Engaged";
      emotionalTone = "Warm and genuinely interested";
    }
  }
  // Strong confidence without much positive affect
  else if (confidenceScore > 0.5) {
    overallSentiment = "Focused and Determined";
    emotionalTone = "Serious and purposeful";
  }
  // Moderate anxiety (normal for healthcare)
  else if (anxietyScore > 0.2 && anxietyScore <= 0.4) {
    if (positiveScore > 0.2) {
      overallSentiment = "Cautiously Optimistic";
      emotionalTone = "Naturally concerned but hopeful";
    } else {
      overallSentiment = "Appropriately Cautious";
      emotionalTone = "Thoughtfully apprehensive";
    }
  }
  // Negative emotions dominant
  else if (negativeScore > 0.4) {
    overallSentiment = "Subdued but Resilient";
    emotionalTone = "Working through difficult emotions";
    confidenceLevel = Math.max(confidenceLevel - 5, 50);
  }
  // Default cases based on top emotion
  else {
    if (topEmotionName.includes('calm')) {
      overallSentiment = "Composed and Steady";
      emotionalTone = "Naturally calm and collected";
    } else if (topEmotionName.includes('interest') || topEmotionName.includes('concentration')) {
      overallSentiment = "Engaged and Attentive";
      emotionalTone = "Focused and genuinely interested";
    } else if (topEmotionName.includes('confusion')) {
      overallSentiment = "Thoughtfully Processing";
      emotionalTone = "Working through complex information";
      confidenceLevel = Math.max(confidenceLevel - 5, 55);
    }
  }
  
  // Special adjustments for very short or very long sessions
  if (durationSeconds < 20) {
    overallSentiment = "Brief but " + overallSentiment.toLowerCase();
    confidenceLevel = Math.max(confidenceLevel - 15, 45);
  } else if (durationSeconds > 50) {
    confidenceLevel = Math.min(confidenceLevel + 8, 95); // Bonus for full engagement
  }

  // Generate personalized insights based on emotion patterns
  const keyInsights: string[] = [];
  const improvementTips: string[] = [];
  const praisedAspects: string[] = [];

  // Generate sophisticated insights based on emotion pattern analysis
  
  // Confidence-based insights
  if (confidenceLevel >= 85) {
    praisedAspects.push("You demonstrated exceptional composure and readiness");
    keyInsights.push("Your high confidence will enable effective communication with providers");
  } else if (confidenceLevel >= 75) {
    praisedAspects.push("You showed strong emotional regulation and preparation");
    keyInsights.push("Your balanced emotional state suggests good appointment readiness");
  } else if (confidenceLevel >= 65) {
    keyInsights.push("You're developing good emotional awareness for healthcare conversations");
    improvementTips.push("Continue building confidence through practice and preparation");
  } else {
    improvementTips.push("Focus on relaxation techniques to build confidence before appointments");
    keyInsights.push("Building confidence takes time - you're taking the right steps");
  }

  // Emotion-specific insights based on dominant patterns
  if (positiveScore > 0.4) {
    praisedAspects.push("You maintained a positive outlook throughout the session");
    if (anxietyScore < 0.2) {
      keyInsights.push("Your natural positivity will help create rapport with healthcare providers");
    }
  }

  if (confidenceScore > 0.4) {
    praisedAspects.push("You demonstrated strong focus and determination");
    keyInsights.push("Your focused approach shows good preparation for healthcare discussions");
  }

  if (anxietyScore > 0.4) {
    if (confidenceScore > 0.3) {
      improvementTips.push("You're managing anxiety well while staying engaged - keep practicing");
      keyInsights.push("Balancing natural concern with confidence is a valuable skill");
    } else {
      improvementTips.push("Try progressive muscle relaxation before important health conversations");
      improvementTips.push("Practice articulating your main health concerns in advance");
    }
  } else if (anxietyScore > 0.2) {
    keyInsights.push("Your level of concern is appropriate and shows good health awareness");
  }

  if (negativeScore > 0.3) {
    improvementTips.push("Consider addressing underlying concerns before your appointment");
    keyInsights.push("Processing difficult emotions beforehand can improve appointment outcomes");
  }

  // Session engagement insights
  if (durationSeconds >= 50) {
    praisedAspects.push("You engaged fully with the practice session");
  } else if (durationSeconds < 20) {
    improvementTips.push("Try to engage longer in practice sessions for better preparation");
  }

  // Emotional consistency insights
  const primaryEmotionRatio = emotionEntries[0][1] / totalEmotionalIntensity;
  if (primaryEmotionRatio > 0.5) {
    keyInsights.push("You maintained consistent emotional state throughout the conversation");
  } else if (emotionEntries.length > 5) {
    keyInsights.push("You experienced varied emotions - this is normal for healthcare preparation");
  }

  // Special insights for complex emotion combinations
  if (anxietyScore > 0.3 && positiveScore > 0.3) {
    praisedAspects.push("You balanced natural concern with positive engagement");
  }

  if (totalEmotionalIntensity < 0.5) {
    keyInsights.push("Your composed demeanor suggests good emotional regulation skills");
    if (confidenceLevel < 70) {
      improvementTips.push("Consider expressing more of your thoughts and concerns during appointments");
    }
  }

  // Add session duration-based analysis
  if (durationSeconds < 30) {
    improvementTips.push("Try to engage for the full session duration to get maximum benefit");
    confidenceLevel = Math.max(confidenceLevel - 10, 50);
  } else if (durationSeconds >= 55) {
    praisedAspects.push("You utilized the full practice session effectively");
    confidenceLevel = Math.min(confidenceLevel + 5, 95);
  }

  // Fill in with general tips if needed
  if (improvementTips.length < 3) {
    const generalTips = [
      "Consider preparing key questions in advance",
      "Practice describing your symptoms clearly and concisely",
      "Remember to ask for clarification if you don't understand something"
    ];
    improvementTips.push(...generalTips.slice(0, 3 - improvementTips.length));
  }

  if (praisedAspects.length < 3) {
    const generalPraise = [
      "You took initiative by practicing before your appointment",
      "You showed commitment to your healthcare journey",
      "You demonstrated good self-advocacy skills"
    ];
    praisedAspects.push(...generalPraise.slice(0, 3 - praisedAspects.length));
  }

  if (keyInsights.length < 3) {
    const generalInsights = [
      "Practice sessions help build confidence for real appointments",
      "Your emotional awareness will help you communicate better with providers",
      "Taking time to prepare shows dedication to your health"
    ];
    keyInsights.push(...generalInsights.slice(0, 3 - keyInsights.length));
  }

  // Convert emotion data to percentages (normalize to 100%)
  const total = Object.values(emotionData).reduce((sum, val) => sum + val, 0);
  const emotionBreakdown: Record<string, number> = {};
  Object.entries(emotionData).forEach(([emotion, value]) => {
    emotionBreakdown[emotion] = Math.round((value / total) * 100);
  });

  return {
    overallSentiment,
    emotionalTone,
    confidenceLevel,
    keyInsights: keyInsights.slice(0, 3),
    improvementTips: improvementTips.slice(0, 3),
    praisedAspects: praisedAspects.slice(0, 3),
    emotionBreakdown
  };
}

// Fallback function for when no real emotion data is available
function generateAdvancedMockAnalysis(sessionData: SessionData): SentimentReport {
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
    const report = generateRealAnalysis(sessionData);
    
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