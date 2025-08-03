import { NextRequest, NextResponse } from 'next/server';

// Interface for EVI message from speech-to-speech interaction
interface EviMessage {
  type: string;
  message?: {
    role: string;
    content: string;
  };
  timestamp: number;
  rawData?: Record<string, unknown>;
}

// Interface for simplified check-in request data (EVI only)
interface CheckinRequest {
  patientId?: string;
  transcript?: string;
  eviMessages?: EviMessage[]; // EVI conversation data
  createdAt: Date;
  analysisMetadata?: {
    sessionDuration: number;
    eviMessageCount: number;
    transcriptLength: number;
  };
}

/**
 * POST /api/checkin
 * Stores completed EVI conversation data (simplified for demo)
 * TODO: Add proper database storage when ready
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse request body
    const body: CheckinRequest = await request.json();

    // Basic validation - at least transcript or EVI messages should be present
    if (!body.transcript && (!body.eviMessages || body.eviMessages.length === 0)) {
      return NextResponse.json(
        { error: 'Either transcript or EVI messages are required' },
        { status: 400 }
      );
    }

    // Validate EVI messages if provided
    if (body.eviMessages && Array.isArray(body.eviMessages)) {
      for (const message of body.eviMessages) {
        if (!validateEviMessage(message)) {
          return NextResponse.json(
            { error: 'Invalid EVI message structure' },
            { status: 400 }
          );
        }
      }
    }

    // Calculate analysis metadata
    const analysisMetadata = calculateAnalysisMetadata(body.transcript, body.eviMessages);

    // For now, just log the data and return success
    // TODO: Replace with proper database storage
    console.log('EVI conversation session received:', {
      eviMessages: body.eviMessages?.length || 0,
      transcriptLength: body.transcript?.length || 0,
      sessionDuration: analysisMetadata.sessionDuration,
      timestamp: new Date().toISOString()
    });

    // Generate a mock session ID for now
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Return success response with session ID and analysis summary
    return NextResponse.json(
      {
        success: true,
        sessionId,
        message: 'EVI conversation data received successfully',
        analysisMetadata
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error processing EVI conversation data:', error);

    // Generic error response
    return NextResponse.json(
      { error: 'Failed to process conversation data. Please try again.' },
      { status: 500 }
    );
  }
}

/**
 * Validates an EVI message structure
 * @param message - The EVI message to validate
 * @returns boolean - True if valid, false otherwise
 */
function validateEviMessage(message: unknown): message is EviMessage {
  if (!message || typeof message !== 'object') {
    return false;
  }

  const msg = message as Record<string, unknown>;

  // Check required fields
  if (typeof msg.type !== 'string' || typeof msg.timestamp !== 'number') {
    return false;
  }

  // If message object exists, validate its structure
  if (msg.message && typeof msg.message === 'object') {
    const messageObj = msg.message as Record<string, unknown>;
    if (typeof messageObj.role !== 'string' || typeof messageObj.content !== 'string') {
      return false;
    }
  }

  return true;
}

/**
 * Calculates analysis metadata from transcript and EVI messages
 * @param transcript - The conversation transcript
 * @param eviMessages - Array of EVI messages
 * @returns Analysis metadata object
 */
function calculateAnalysisMetadata(
  transcript?: string, 
  eviMessages?: EviMessage[]
) {
  const eviMessageCount = eviMessages?.length || 0;
  const transcriptLength = transcript?.length || 0;
  
  // Assume 60-second session for now (could be calculated from timestamps in the future)
  const sessionDuration = 60;

  return {
    sessionDuration,
    eviMessageCount,
    transcriptLength
  };
}

/**
 * GET /api/checkin
 * Returns method not allowed for GET requests
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    { 
      error: 'Method not allowed. Use POST to submit conversation data.',
      supportedMethods: ['POST'],
      version: '2.1',
      features: ['EVI Integration', 'Conversational AI', 'Practice Sessions']
    },
    { status: 405 }
  );
}