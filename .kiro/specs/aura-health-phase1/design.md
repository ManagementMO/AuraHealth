# Design Document

## Overview

Aura Health Phase 1 is a comprehensive, production-ready Next.js application that provides a secure pre-consultation patient check-in experience. The system allows patients to record a 60-second video describing their health concerns while capturing real-time AI-powered emotional analysis using both Hume AI's Expression Measurement API (for facial emotion analysis) and Speech-to-Speech EVI API (for vocal emotion analysis and intelligent voice interaction). The architecture emphasizes security-first design, user experience, accessibility, and extensibility for future telehealth platform features including doctor dashboards and live call interfaces. The system processes real-time video and audio streams through Hume AI's APIs while maintaining secure backend processing and MongoDB data persistence.

## Architecture

### Technology Stack

- **Framework**: Next.js 14+ with App Router and API Routes
- **Language**: TypeScript for type safety and developer experience
- **Styling**: Tailwind CSS for utility-first styling
- **UI Components**: Shadcn/UI with "New York" style variant and neutral healthcare theme
- **Media Capture**: react-webcam for browser camera integration
- **AI Integration**: @humeai/voice SDK for Expression Measurement API
- **Database**: MongoDB with connection caching for serverless optimization
- **Security**: Environment-based API key management with secure token generation

### Application Structure

```
aura-health/
├── app/
│   ├── api/
│   │   ├── checkin/
│   │   │   └── route.ts    # POST endpoint for storing analysis data
│   │   └── hume/
│   │       └── token/
│   │           └── route.ts # GET endpoint for secure Hume token generation
│   ├── check-in/
│   │   └── page.tsx        # Check-in page
│   ├── layout.tsx          # Root layout with Inter font and Toaster
│   └── page.tsx            # Landing page
├── components/
│   ├── ui/                 # Shadcn/UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── progress.tsx
│   │   └── toast.tsx
│   └── aura/               # Custom application components
│       └── PatientCheckin.tsx
├── lib/
│   ├── mongodb.ts          # MongoDB connection utility with caching
│   ├── utils.ts            # Utility functions
│   └── hume.ts             # Hume AI client helpers (if needed)
├── .env.local.example      # Environment variable template
└── styles/
    └── globals.css         # Global styles and Tailwind imports
```

## API Endpoints

### Hume Token Endpoint (app/api/hume/token/route.ts)

```typescript
interface HumeTokenResponse {
  accessToken?: string;
  error?: string;
}

export async function GET(): Promise<Response> {
  // Securely generate short-lived Hume access token
  // Uses HUME_API_KEY and HUME_CLIENT_SECRET from environment
  // Returns token for WebSocket authentication
}
```

### Check-in Data Endpoint (app/api/checkin/route.ts)

```typescript
interface CheckinRequest {
  patientId?: string;
  transcript?: string;
  emotionTimeline: EmotionDataPoint[];
  createdAt: Date;
}

export async function POST(request: Request): Promise<Response> {
  // Stores completed check-in analysis data in MongoDB
  // Validates request data and handles database errors
}
```

## Components and Interfaces

### Root Layout (app/layout.tsx)

- Configures global HTML structure with healthcare-appropriate metadata
- Imports Tailwind CSS and sets up consistent typography using Inter font from next/font/google
- Includes Toaster component from Shadcn/UI for notification management
- Sets neutral background color and provides consistent layout structure for all pages

### Landing Page (app/page.tsx)

- Minimalist design focusing on trust and professionalism
- Clear value proposition explaining Aura Health's purpose
- Prominent call-to-action button using Shadcn/UI Button component
- Responsive design suitable for desktop and mobile devices

### Check-in Page (app/check-in/page.tsx)

- Hosts the PatientCheckin component
- Maintains consistent layout and styling
- Provides appropriate page metadata for healthcare context

### PatientCheckin Component (components/aura/PatientCheckin.tsx)
```typescript
interface PatientCheckinProps {
  // Future props for configuration
}

interface CheckinState {
  phase: 'idle' | 'recording' | 'finished';
  timeRemaining: number;
  webcamReady: boolean;
  emotionData: EmotionDataPoint[];
  humeWebSocket: WebSocket | null;
  eviWebSocket: WebSocket | null;
}

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
```

**Component States:**

1. **Idle State**: Shows instructions, webcam preview, and start button
2. **Recording State**: Active WebSocket connections to both Hume APIs, real-time emotion analysis, 60-second timer with progress bar
3. **Finished State**: Data submission to backend, thank you message and completion confirmation

**Key Features:**

- Secure token fetching from /api/hume/token endpoint
- Dual WebSocket connections to Hume Expression Measurement API (facial analysis) and EVI API (vocal analysis and chatting to the AI model that Hume as a "rehearsal" for the upcoming Doctor's Appointment)
- Audio and video stream processing with comprehensive emotion data collection
- Real-time emotional intelligence voice interaction capabilities through EVI (user data like facial and vocal emotion from this interaction should be stored and used in phase 3 for doctor to analyze before appointment)
- Automatic data submission to /api/checkin endpoint upon completion
- Toast notifications for success/error feedback

### MongoDB Connection Layer (lib/mongodb.ts)

```typescript
interface MongoConnection {
  client: MongoClient;
  db: Db;
}

// Cached connection for serverless optimization
let cachedConnection: MongoConnection | null = null;

export async function connectToDatabase(): Promise<MongoConnection> {
  // Returns cached connection or creates new one
  // Prevents connection overhead in serverless environments
  // Uses MONGODB_URI environment variable
}
```

### Database Collections

#### checkin_sessions Collection

```typescriptckinSession {
  _erface CheckinSession {
  _id: ObjectId;
  patientId?: string;;
  emotionTpt?: string;
  emotionTimeline: EmotionDataPoint[];
  createdAt: Date;;
  status: : number;
  status: 'completed' | 'failed';
}
```

## Data Models

### Environment Variables

```typescriptironmentConfig {
  HUMface EnvironmentConfig {
  HUME_API_KEY: string;
  HUME_CLIENT_SECRET: string;
  MONGODB_URI: string;
}
```

### Hume AI Integration

```typescript
interface HumeAccessToken {
  accessToken: string;
  expiresIn: number;
}

interface HumeWebSocketMessage {
  type: 'expression_measurement';
  timestamp: number;
  data: {
    face?: FacialExpressionData;
    prosody?: VocalProsodyData;
  };
}

interface FacialExpressionData {
  emotions: Record<string, number>;
  confidence: number;
}

interface VocalProsodyData {
  emotions: Record<string, number>;
  confidence: number;
}
```

### Recording Session

```typescript
interface RecordingSession {
  id: string;
  patientId?: string;
  startTime: Date;
  duration: number; // seconds
  status: 'recording' | 'completed' | 'failed';
  emotionTimeline: EmotionDataPoint[];
}
```

## Security Considerations

### API Key Management

- All sensitive credentials stored in environment variables only
- ShorPI keys exposed to client-side code
- Short-lived access tokens generated server-side for Hume AI access
en endpoint with proper error handling

### Data Privacy

- No video data stored locally beyond session duration
- Emotion analysis data encrypted in transit and at rest
- Clear privacy messaging about data usage
- Preparation for HIPAA compliance in future phases

### Browser Security

- Secure camera permission handling with graceful error states
- Content Security Policy configuration
- HTTPS enforcement for production deployment
- Input validation on all API endpoints

### Database Security

- MongoDB connection string stored securely in environment variables
- Connection caching to prevent connection leaks
- Proper error handling without exposing sensitive information
- Data validation before database insertion

## Error Handling

### Webcam Access Errors

- **Permission Denied**: Clear instructions for enabling camera access
- **Device Not Found**: Fallback message for devices without cameras
- **Technical Errors**: User-friendly error messages with support contact

### Recording Errors

- **Storage Issues**: Handle insufficient device storage
- **Network Issues**: Graceful degradation for connectivity problems
- **Browser Compatibility**: Feature detection and fallback messaging

### API Errors

- **Token Generation Failures**: Graceful handling of Hume API authentication issues
- **WebSocket Connection Errors**: Retry logic and user feedback for connection failures
- **Database Connection Issues**: Proper error logging and user-friendly messages
- **Data Submission Failures**: Retry mechanisms and clear error communication

### Error UI Patterns

- Use Shadcn/UI Toast components for consistent error presentation
- Maintain calming healthcare-appropriate styling even in error states
- Provide clear next steps for error resolution
- Log technical errors server-side while showing generic messages to users

## Testing Strategy

### Unit Testing

- Component rendering and state management
- Utility functions and helper methods
- Error handling scenarios
- Timer and progress bar functionality

### Integration Testing

- Webcam permission flow
- Recording start/stop lifecycle
- Navigation between pages
- Component interaction patterns
- API endpoint functionality
- Database connection and data persistence
- Hume AI token generation and WebSocket connections

## Performance Considerations

### Media Handling

- Efficient video stream processing
- Memory management for recording sessions
- Optimized component re-rendering during recording

### Bundle Optimization

- Code splitting for Hume AI integration
- Lazy loading of heavy components
- Optimized asset delivery

## Future Integration Points

### Hume AI Expression Measurement
- WebSocket connection management
- Real-time video frame streaming
- Emotion data processing and storage

### Hume AI EVI (Speech-to-Speech)
- Audio stream processing
- Conversational AI integration
- Speech emotion analysis (gets returned and saved somewhere for future analysis for the doctor)

### Data Persistence
- (MongoDB)

## Styling and Design System

### Color Palette (Healthcare Neutral Theme)

- Primary: Calming blues and teals
- Secondary: Soft grays and whites
- Accent: Subtle greens for positive actions
- Error: Muted reds for gentle error indication

### Typography

- Inter font family for readability
- Consistent heading hierarchy
- Appropriate line spacing for healthcare content

### Component Styling

- Shadcn/UI "New York" variant for modern, clean appearance
- Consistent spacing using Tailwind's spacing scale
- Rounded corners and subtle shadows for approachable design
- High contrast ratios for accessibility compliance