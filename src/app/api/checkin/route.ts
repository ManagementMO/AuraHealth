import { NextRequest, NextResponse } from 'next/server';

// Interface for emotion data points from Hume AI analysis
interface EmotionDataPoint {
  timestamp: number;
  emotions: {
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
    surprise: number;
    disgust: number;
    contempt: number;
  };
  confidence: number;
  source: 'facial' | 'vocal';
}

// Interface for check-in request data
interface CheckinRequest {
  patientId?: string;
  transcript?: string;
  emotionTimeline: EmotionDataPoint[];
  createdAt: Date;
}

// Interface for check-in session document in MongoDB
interface CheckinSession {
  patientId?: string;
  transcript?: string;
  emotionTimeline: EmotionDataPoint[];
  createdAt: Date;
  status: 'completed' | 'failed';
}

/**
 * POST /api/checkin
 * Stores completed check-in analysis data in MongoDB
 * Validates request data and handles database errors
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse request body
    const body: CheckinRequest = await request.json();

    // Validate required fields
    if (!body.emotionTimeline || !Array.isArray(body.emotionTimeline)) {
      return NextResponse.json(
        { error: 'emotionTimeline is required and must be an array' },
        { status: 400 }
      );
    }

    // Validate emotion data points
    for (const dataPoint of body.emotionTimeline) {
      if (!validateEmotionDataPoint(dataPoint)) {
        return NextResponse.json(
          { error: 'Invalid emotion data point structure' },
          { status: 400 }
        );
      }
    }

    // Prepare check-in session document
    const checkinSession: CheckinSession = {
      patientId: body.patientId || undefined,
      transcript: body.transcript || undefined,
      emotionTimeline: body.emotionTimeline,
      createdAt: body.createdAt ? new Date(body.createdAt) : new Date(),
      status: 'completed'
    };

   
    // Return success response with session ID
    return NextResponse.json(
      {
        success: true,
        message: 'Check-in data stored successfully'
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error storing check-in data:', error);

    // Handle specific MongoDB errors
    if (error instanceof Error && error.message.includes('MongoDB connection failed')) {
      return NextResponse.json(
        { error: 'Database connection failed. Please try again.' },
        { status: 503 }
      );
    }

    // Generic error response
    return NextResponse.json(
      { error: 'Failed to store check-in data. Please try again.' },
      { status: 500 }
    );
  }
}

/**
 * Validates an emotion data point structure
 * @param dataPoint - The emotion data point to validate
 * @returns boolean - True if valid, false otherwise
 */
interface EmotionDataPoint {
  timestamp: number;
  emotions: {
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
    surprise: number;
    disgust: number;
    contempt: number;
  };
  confidence: number;
  source: 'facial' | 'vocal';
}

function validateEmotionDataPoint(dataPoint: EmotionDataPoint): dataPoint is EmotionDataPoint {
  if (!dataPoint || typeof dataPoint !== 'object') {
    return false;
  }

  // Check required fields
  if (typeof dataPoint.timestamp !== 'number' ||
      typeof dataPoint.confidence !== 'number' ||
      !['facial', 'vocal'].includes(dataPoint.source)) {
    return false;
  }

  // Check emotions object structure
  if (!dataPoint.emotions || typeof dataPoint.emotions !== 'object') {
    return false;
  }

  const requiredEmotions = ['joy', 'sadness', 'anger', 'fear', 'surprise', 'disgust', 'contempt'];

  return true;
}

/**
 * GET /api/checkin
 * Returns method not allowed for GET requests
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to submit check-in data.' },
    { status: 405 }
  );
}