# Real-Time Facial Sentiment Analysis

This feature adds real-time facial sentiment analysis to your Twilio video application using the Hume AI API. It captures video frames from the local participant's video stream and analyzes facial expressions to detect emotions in real-time.

## Features

- **Real-time Analysis**: Captures video frames at 2-4 FPS and sends them to Hume AI for analysis
- **WebSocket Connection**: Uses Hume AI's real-time expression measurement API via WebSocket
- **Live Emotion Display**: Shows the top 3 detected emotions with confidence scores
- **Automatic Integration**: Seamlessly integrates with your existing Twilio video call interface
- **Responsive Design**: Emotion display adapts to different screen sizes

## Setup

### 1. Environment Variables

Make sure you have the following environment variables set in your `.env.local` file:

```env
HUME_API_KEY=your_hume_api_key_here
HUME_CLIENT_SECRET=your_hume_client_secret_here
```

### 2. API Route

The feature uses the existing `/api/hume/token` route to get access tokens for Hume AI. This route is already implemented in your codebase.

### 3. Integration

The sentiment analyzer is automatically integrated into your video call page (`src/app/video-call/page.tsx`). It will:

- Initialize when a call starts
- Display emotion analysis results in the bottom-right corner of the video interface
- Automatically clean up when the call ends

## How It Works

### 1. Video Frame Capture

The system uses a hidden `<canvas>` element to capture frames from the local video stream:

```typescript
// Draw the current video frame to canvas
this.ctx.drawImage(
  this.videoElement,
  0,
  0,
  this.canvas.width,
  this.canvas.height
);

// Convert to base64 JPEG
const base64Image = this.canvas.toDataURL("image/jpeg", 0.8);
```

### 2. WebSocket Communication

Frames are sent to Hume AI via WebSocket connection:

```typescript
const message = {
  models: {
    facial_expression: {},
  },
  data: base64Data,
  mime_type: "image/jpeg",
};

this.ws.send(JSON.stringify(message));
```

### 3. Real-time Display

Emotion predictions are displayed in real-time with animated progress bars:

```typescript
const emotionHTML = topEmotions
  .map((emotion) => {
    const percentage = Math.round(emotion.score * 100);
    return `
      <div class="emotion-item">
        <span class="emotion-name">${this.formatEmotionName(
          emotion.name
        )}</span>
        <div class="emotion-bar">
          <div class="emotion-fill" style="width: ${percentage}%"></div>
        </div>
        <span class="emotion-score">${percentage}%</span>
      </div>
    `;
  })
  .join("");
```

## Configuration

You can customize the sentiment analyzer behavior by modifying the configuration:

```typescript
const analyzer = new HumeSentimentAnalyzer({
  frameRate: 3, // Frames per second (2-4 recommended)
  canvasWidth: 640, // Canvas width for frame capture
  canvasHeight: 480, // Canvas height for frame capture
  maxEmotions: 3, // Number of top emotions to display
});
```

## UI Components

### Emotion Display

The emotion display appears in the bottom-right corner of the video interface and shows:

- **Title**: "Facial Sentiment Analysis"
- **Emotion Names**: Formatted emotion labels (e.g., "Happy", "Surprised", "Neutral")
- **Progress Bars**: Animated bars showing confidence scores
- **Percentages**: Exact confidence scores for each emotion

### Styling

The emotion display uses Tailwind CSS classes and custom animations:

- Semi-transparent background with backdrop blur
- Gradient progress bars with pulse animation
- Responsive design for mobile devices
- Consistent with your existing video call interface

## Error Handling

The system includes comprehensive error handling:

- **Connection Failures**: Graceful fallback if Hume AI connection fails
- **Permission Issues**: Handles camera permission denials
- **Network Errors**: Automatic retry and user notification
- **Resource Cleanup**: Proper cleanup when calls end

## Performance Considerations

- **Frame Rate**: Limited to 2-4 FPS to balance accuracy and performance
- **Image Quality**: JPEG compression (0.8 quality) to reduce bandwidth
- **Canvas Size**: Optimized canvas dimensions for analysis accuracy
- **Memory Management**: Automatic cleanup of WebSocket connections and intervals

## Troubleshooting

### Common Issues

1. **"Sentiment analysis unavailable" error**

   - Check your Hume AI API credentials
   - Verify the `/api/hume/token` route is working
   - Ensure camera permissions are granted

2. **No emotion data displayed**

   - Check browser console for WebSocket errors
   - Verify Hume AI service is accessible
   - Ensure video stream is active

3. **Performance issues**
   - Reduce frame rate to 2 FPS
   - Lower canvas resolution
   - Check network connectivity to Hume AI

### Debug Mode

Enable debug logging by checking the browser console for messages like:

- "Connected to Hume AI WebSocket"
- "Sentiment analyzer initialized successfully"
- "Error capturing and sending frame"

## Security

- **API Keys**: Never expose Hume AI credentials in client-side code
- **Video Data**: Frames are sent directly to Hume AI, not stored locally
- **WebSocket**: Uses secure WebSocket connection (wss://)
- **Permissions**: Requires explicit camera permission from user

## Future Enhancements

Potential improvements for the sentiment analysis feature:

- **Emotion History**: Track emotion changes over time
- **Custom Thresholds**: Allow users to set sensitivity levels
- **Multiple Faces**: Support for analyzing multiple participants
- **Emotion Alerts**: Notifications for specific emotion states
- **Analytics Dashboard**: Historical emotion data visualization
