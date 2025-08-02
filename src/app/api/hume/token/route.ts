import { NextResponse } from 'next/server';

interface HumeTokenResponse {
  accessToken?: string;
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

    // Generate access token using Hume AI credentials
    // This follows Hume AI's authentication flow for generating short-lived tokens
    const tokenResponse = await fetch('https://api.hume.ai/oauth2-cc/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: apiKey,
        client_secret: clientSecret,
      }),
    });

    if (!tokenResponse.ok) {
      console.error('Failed to generate Hume AI token:', tokenResponse.status, tokenResponse.statusText);
      return NextResponse.json(
        { error: 'Failed to authenticate with Hume AI' },
        { status: 401 }
      );
    }

    const tokenData = await tokenResponse.json();
    
    if (!tokenData.access_token) {
      console.error('Invalid token response from Hume AI');
      return NextResponse.json(
        { error: 'Invalid authentication response' },
        { status: 500 }
      );
    }

    // Return the access token to the client
    const response: HumeTokenResponse = {
      accessToken: tokenData.access_token,
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