import { NextResponse } from 'next/server';
import Twilio from 'twilio';

export async function POST(request: Request) {
  try {
    const { participantName, roomName } = await request.json();

    // Validate the input from the client
    if (!participantName || typeof participantName !== 'string') {
      return NextResponse.json({ error: 'A valid "participantName" string is required.' }, { status: 400 });
    }
    if (!roomName || typeof roomName !== 'string') {
      return NextResponse.json({ error: 'A valid "roomName" string is required.' }, { status: 400 });
    }

    // Retrieve your Twilio credentials from environment variables
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const apiKeySid = process.env.TWILIO_API_KEY;
    const apiKeySecret = process.env.TWILIO_API_SECRET;

    if (!accountSid || !apiKeySid || !apiKeySecret) {
      console.error("Twilio environment variables are not set.");
      return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
    }

    const AccessToken = Twilio.jwt.AccessToken;
    const VideoGrant = AccessToken.VideoGrant;

    // Create a new access token
    const accessToken = new AccessToken(accountSid, apiKeySid, apiKeySecret, {
      identity: participantName,
    });

    // Create a video grant for the specific room
    const videoGrant = new VideoGrant({
      room: roomName,
    });

    // Add the grant to the token
    accessToken.addGrant(videoGrant);

    // Serialize the token to a JWT and send it to the client
    return NextResponse.json({ token: accessToken.toJwt() });

  } catch (error) {
    console.error('Twilio Token API Error:', error);
    return NextResponse.json({ error: 'Failed to generate Twilio token.' }, { status: 500 });
  }
}