import { NextResponse } from 'next/server';

interface HumeAPIKeyResponse {
  apiKey?: string;
  clientSecret?: string;
  error?: string;
}

export async function GET(): Promise<Response> {
  try {
    // Validate environment variables
    const apiKey = process.env.HUME_API_KEY;
    const clientSecret = process.env.HUME_CLIENT_SECRET;

    if (!apiKey || !clientSecret) {
      console.error('Missing Hume AI credentials in environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    
    // Return the access token to the client
    const response: HumeAPIKeyResponse = {
      apiKey: apiKey,
      clientSecret: clientSecret,
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
      },
    });

  } catch (error) {
    console.error('Error generating Hume AI token:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}