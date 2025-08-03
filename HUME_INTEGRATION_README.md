# Hume Sentiment Analysis Integration

## Overview

This implementation integrates Hume AI's real-time facial sentiment analysis into the Twilio video calling system. The integration provides live emotion detection from video streams using Hume's WebSocket API.

## Architecture

### Components

1. **useHumeSentimentAnalysis Hook** (`src/hooks/useHumeSentimentAnalysis.ts`)
   - Custom React hook that manages Hume WebSocket connection
   - Captures video frames from Twilio video element
   - Sends frames to Hume API for emotion analysis
   - Processes and returns emotion scores

2. **SentimentDisplay Component** (`src/components/aura/SentimentDisplay.tsx`)
   - React component for displaying emotion analysis results
   - Shows connection status, top emotions with progress bars
   - Displays primary emotion and real-time updates

3. **Enhanced LiveCallView** (`src/components/aura/LiveCallView.tsx`)
   - Integrated sentiment analysis into existing video call interface
   - Preserves existing custom analysis functionality
   - Shows both user's own analysis and (for doctors) patient analysis

## Features

- **Real-time Analysis**: 2 FPS frame capture to balance performance and API limits
- **Clean UI**: Modern emotion display with progress bars and status indicators
- **Dual Analysis**: Supports both Hume analysis and existing custom analysis system
- **Role-based Display**: Different views for doctors and patients
- **Error Handling**: Comprehensive error states and reconnection logic
- **Performance Optimized**: Efficient frame capture and WebSocket management

## Technical Implementation

### Authentication
- Uses existing Hume API token endpoint (`/api/hume/token`)
- WebSocket connection with API key authentication
- Automatic token refresh handling

### Frame Capture
- Canvas-based video frame extraction
- JPEG compression at 80% quality
- Base64 encoding for WebSocket transmission

### Data Processing
- Emotion scores sorted by confidence
- Configurable top-N emotion display
- Real-time timestamp tracking

### Integration Points
- Seamlessly integrates with Twilio video tracks
- Preserves existing socket.io analysis relay
- Non-intrusive addition to current video call flow

## Configuration

The hook accepts these options:
```typescript
{
  frameRate: number;    // Default: 2 FPS
  maxEmotions: number; // Default: 5
  enabled: boolean;    // Default: true
}
```

## Usage

The integration automatically activates when:
1. Video call is established
2. Local video track is available
3. Hume WebSocket connection is successful

Analysis results are displayed in the side panel alongside existing functionality.

## Benefits

1. **Minimal Impact**: No changes to core video calling functionality
2. **Modular Design**: Easy to enable/disable or modify
3. **Professional UI**: Consistent with existing design system
4. **Real-time Feedback**: Immediate emotion analysis during calls
5. **Scalable**: Can be extended for additional Hume features

## API Compliance

- Follows Hume WebSocket streaming documentation
- Respects API rate limits with 2 FPS capture
- Uses official emotion response format
- Handles connection timeouts and reconnection

This integration enhances the telepathy application with sophisticated emotion recognition while maintaining the existing architecture and user experience. 