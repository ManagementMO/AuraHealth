import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID
const apiKey = process.env.TWILIO_API_KEY
const apiSecret = process.env.TWILIO_API_SECRET

export async function POST(request: NextRequest) {
  try {
    const { roomName, participantName } = await request.json()

    if (!roomName || !participantName) {
      return NextResponse.json(
        { error: 'Room name and participant name are required' },
        { status: 400 }
      )
    }

    // Debug: Log credential status
    console.log('Twilio credentials check:', {
      hasAccountSid: !!accountSid,
      hasApiKey: !!apiKey,
      hasApiSecret: !!apiSecret,
      accountSidLength: accountSid?.length,
      accountSidPrefix: accountSid?.substring(0, 2),
      apiKeyPrefix: apiKey?.substring(0, 2)
    })

    // For development, create a mock token if Twilio credentials aren't set
    if (!accountSid || !apiKey || !apiSecret) {
      console.warn('Twilio credentials not found, using mock token for development')
      return NextResponse.json({
        token: 'mock_token_for_development',
        roomName,
        participantName
      })
    }

    // Create access token using the correct constructor
    const AccessToken = twilio.jwt.AccessToken
    const VideoGrant = AccessToken.VideoGrant

    const token = new AccessToken(
      accountSid!,
      apiKey!,
      apiSecret!,
      { identity: participantName }
    )

    // Create video grant
    const videoGrant = new VideoGrant({
      room: roomName,
    })

    token.addGrant(videoGrant)

    return NextResponse.json({
      token: token.toJwt(),
      roomName,
      participantName
    })

  } catch (error) {
    console.error('Error generating Twilio token:', error)
    
    // Provide more specific error information
    let errorMessage = 'Failed to generate token'
    if (error instanceof Error) {
      errorMessage = error.message
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
} 