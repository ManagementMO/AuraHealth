interface EmotionPrediction {
  name: string;
  score: number;
}

interface HumeResponse {
  predictions: Array<{
    emotions: Array<{
      name: string;
      score: number;
    }>;
  }>;
}

interface SentimentAnalyzerConfig {
  frameRate: number; // Frames per second to capture
  canvasWidth: number;
  canvasHeight: number;
  maxEmotions: number; // Number of top emotions to display
  debugMode?: boolean; // Enable debug logging
}

class HumeSentimentAnalyzer {
  private ws: WebSocket | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private videoElement: HTMLVideoElement | null = null;
  private emotionDisplayElement: HTMLElement | null = null;
  private captureInterval: NodeJS.Timeout | null = null;
  private isConnected = false;
  private config: SentimentAnalyzerConfig;
  private accessToken: string | null = null;
  private frameCount = 0;
  private messageCount = 0;
  private lastFrameTime = 0;

  constructor(config: Partial<SentimentAnalyzerConfig> = {}) {
    this.config = {
      frameRate: 3, // 3 FPS by default
      canvasWidth: 640,
      canvasHeight: 480,
      maxEmotions: 3,
      debugMode: true, // Enable debug mode by default
      ...config,
    };
    
    this.log('HumeSentimentAnalyzer initialized with config:', this.config);
  }

  /**
   * Debug logging utility
   */
  private log(...args: any[]): void {
    if (this.config.debugMode) {
      console.log('[Hume Debug]', ...args);
    }
  }

  /**
   * Error logging utility
   */
  private logError(...args: any[]): void {
    if (this.config.debugMode) {
      console.error('[Hume Error]', ...args);
    }
  }

  /**
   * Initialize the sentiment analyzer
   */
  async initialize(
    videoElement: HTMLVideoElement,
    emotionDisplayElement: HTMLElement
  ): Promise<void> {
    this.log('Initializing sentiment analyzer...');
    this.videoElement = videoElement;
    this.emotionDisplayElement = emotionDisplayElement;

    this.log('Video element dimensions:', {
      width: videoElement.videoWidth,
      height: videoElement.videoHeight,
      readyState: videoElement.readyState
    });

    // Create canvas for video frame capture
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.config.canvasWidth;
    this.canvas.height = this.config.canvasHeight;
    this.ctx = this.canvas.getContext('2d');

    if (!this.ctx) {
      this.logError('Failed to get canvas context');
      throw new Error('Failed to get canvas context');
    }

    this.log('Canvas created with dimensions:', {
      width: this.canvas.width,
      height: this.canvas.height
    });

    // Get Hume access token
    this.log('Requesting Hume access token...');
    await this.getAccessToken();

    // Initialize WebSocket connection
    this.log('Initializing WebSocket connection...');
    await this.connectWebSocket();
    
    this.log('Sentiment analyzer initialization complete');
  }

  /**
   * Get Hume AI access token from the API
   */
  private async getAccessToken(): Promise<void> {
    try {
      this.log('Making request to /api/hume/token...');
      const response = await fetch('/api/hume/token');
      
      this.log('Token response status:', response.status);
      
      if (!response.ok) {
        this.logError('Failed to get Hume access token, status:', response.status);
        throw new Error('Failed to get Hume access token');
      }
      
      const data = await response.json();
      this.accessToken = data.accessToken;
      
      this.log('Access token received:', this.accessToken ?? 'No token');
      
      if (!this.accessToken) {
        this.logError('No access token received from Hume API');
        throw new Error('No access token received from Hume API');
      }
    } catch (error) {
      this.logError('Error getting Hume access token:', error);
      throw error;
    }
  }

  /**
   * Connect to Hume AI WebSocket for real-time expression measurement
   */
  private async connectWebSocket(): Promise<void> {
    if (!this.accessToken) {
      this.logError('No access token available for WebSocket connection');
      throw new Error('No access token available');
    }
    console.log('Access token:', this.accessToken);
    this.log('Connecting to Hume WebSocket...');
    this.log('WebSocket URL: wss://api.hume.ai/v0/stream/models?api_key=' + (this.accessToken));

    return new Promise((resolve, reject) => {
      // Connect to Hume AI's real-time expression measurement WebSocket
      this.ws = new WebSocket('wss://api.hume.ai/v0/stream/models?api_key=' + this.accessToken);

      this.ws.onopen = () => {
        this.log('✅ WebSocket connection opened successfully');
        this.log('WebSocket ready state:', this.ws?.readyState);
        this.isConnected = true;
        this.startFrameCapture();
        resolve();
      };

      this.ws.onmessage = (event) => {
        this.messageCount++;
        this.log(`📨 WebSocket message received (${this.messageCount}):`, {
          dataLength: event.data.length,
          timestamp: new Date().toISOString()
        });
        this.handleWebSocketMessage(event);
      };

      this.ws.onerror = (error) => {
        this.logError('❌ WebSocket error occurred:', error);
        this.logError('WebSocket ready state:', this.ws?.readyState);
        reject(error);
      };

      this.ws.onclose = (event) => {
        this.log('🔌 WebSocket connection closed:', {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
          timestamp: new Date().toISOString()
        });
        this.isConnected = false;
        this.stopFrameCapture();
      };
    });
  }

  /**
   * Start capturing video frames at the specified frame rate
   */
  private startFrameCapture(): void {
    if (!this.videoElement || !this.canvas || !this.ctx || !this.isConnected) {
      this.logError('Cannot start frame capture - missing dependencies:', {
        hasVideoElement: !!this.videoElement,
        hasCanvas: !!this.canvas,
        hasContext: !!this.ctx,
        isConnected: this.isConnected
      });
      return;
    }

    const intervalMs = 1000 / this.config.frameRate;
    this.log(`🎬 Starting frame capture at ${this.config.frameRate} FPS (${intervalMs}ms intervals)`);
    
    this.captureInterval = setInterval(() => {
      this.captureAndSendFrame();
    }, intervalMs);
  }

  /**
   * Stop capturing video frames
   */
  private stopFrameCapture(): void {
    if (this.captureInterval) {
      this.log('⏹️ Stopping frame capture');
      clearInterval(this.captureInterval);
      this.captureInterval = null;
    } else {
      this.log('Frame capture already stopped');
    }
  }

  /**
   * Capture a frame from the video element and send it to Hume AI
   */
  private captureAndSendFrame(): void {
    if (!this.videoElement || !this.canvas || !this.ctx || !this.ws || !this.isConnected) {
      this.logError('Cannot capture frame - missing dependencies:', {
        hasVideoElement: !!this.videoElement,
        hasCanvas: !!this.canvas,
        hasContext: !!this.ctx,
        hasWebSocket: !!this.ws,
        isConnected: this.isConnected
      });
      return;
    }

    // Check if video is playing and has valid dimensions
    if (this.videoElement.videoWidth === 0 || this.videoElement.videoHeight === 0) {
      this.log('⚠️ Video element has no valid dimensions, skipping frame capture');
      return;
    }

    try {
      const startTime = performance.now();
      this.frameCount++;

      // Draw the current video frame to canvas
      this.ctx.drawImage(
        this.videoElement,
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );

      // Convert canvas to base64 JPEG
      const base64Image = this.canvas.toDataURL('image/jpeg', 0.8);
      
      // Remove the data URL prefix to get just the base64 string
      const base64Data = base64Image.split(',')[1];

      this.log(`📸 Frame ${this.frameCount} captured:`, {
        videoDimensions: `${this.videoElement.videoWidth}x${this.videoElement.videoHeight}`,
        canvasDimensions: `${this.canvas.width}x${this.canvas.height}`,
        base64Length: base64Data.length,
        captureTime: `${(performance.now() - startTime).toFixed(2)}ms`
      });

      // Prepare the message for Hume AI
      const message = {
        models: {
          facial_expression: {}
        },
        data: base64Data,
        mime_type: "image/jpeg"
      };

      // Send the frame to Hume AI
      this.ws.send(JSON.stringify(message));
      
      this.lastFrameTime = Date.now();
      this.log(`📤 Frame ${this.frameCount} sent to Hume AI`);
      
    } catch (error) {
      this.logError(`❌ Error capturing and sending frame ${this.frameCount}:`, error);
    }
  }

  /**
   * Handle incoming messages from Hume AI WebSocket
   */
  private handleWebSocketMessage(event: MessageEvent): void {
    try {
      const data: HumeResponse = JSON.parse(event.data);
      
      this.log('📊 Parsed Hume response:', {
        hasPredictions: !!data.predictions,
        predictionCount: data.predictions?.length || 0
      });
      
      if (data.predictions && data.predictions.length > 0) {
        const emotions = data.predictions[0].emotions || [];
        this.log('😊 Emotions detected:', emotions.length);
        
        if (emotions.length > 0) {
          const topEmotion = emotions[0];
          this.log('🏆 Top emotion:', {
            name: topEmotion.name,
            score: topEmotion.score,
            percentage: `${(topEmotion.score * 100).toFixed(1)}%`
          });
        }
        
        this.updateEmotionDisplay(emotions);
      } else {
        this.log('⚠️ No predictions found in Hume response');
      }
    } catch (error) {
      this.logError('❌ Error parsing Hume WebSocket message:', error);
      this.logError('Raw message data:', event.data);
    }
  }

  /**
   * Update the emotion display with the latest predictions
   */
  private updateEmotionDisplay(emotions: Array<{ name: string; score: number }>): void {
    if (!this.emotionDisplayElement) {
      this.logError('No emotion display element available');
      return;
    }

    // Sort emotions by score (highest first) and take top N
    const topEmotions = emotions
      .sort((a, b) => b.score - a.score)
      .slice(0, this.config.maxEmotions);

    this.log('🎨 Updating emotion display with:', topEmotions.length, 'emotions');

    // Create HTML for emotion display
    const emotionHTML = topEmotions
      .map(emotion => {
        const percentage = Math.round(emotion.score * 100);
        return `
          <div class="emotion-item">
            <span class="emotion-name">${this.formatEmotionName(emotion.name)}</span>
            <div class="emotion-bar">
              <div class="emotion-fill" style="width: ${percentage}%"></div>
            </div>
            <span class="emotion-score">${percentage}%</span>
          </div>
        `;
      })
      .join('');

    this.emotionDisplayElement.innerHTML = `
      <div class="emotion-container">
        <h3 class="emotion-title">Facial Sentiment Analysis</h3>
        ${emotionHTML}
      </div>
    `;
  }

  /**
   * Format emotion names for better display
   */
  private formatEmotionName(name: string): string {
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Start the sentiment analysis
   */
  start(): void {
    this.log('🚀 Starting sentiment analysis...');
    if (this.isConnected) {
      this.startFrameCapture();
    } else {
      this.logError('Cannot start - WebSocket not connected');
    }
  }

  /**
   * Stop the sentiment analysis
   */
  stop(): void {
    this.log('⏹️ Stopping sentiment analysis...');
    this.stopFrameCapture();
  }

  /**
   * Get current status information
   */
  getStatus(): object {
    return {
      isConnected: this.isConnected,
      isRunning: this.isRunning(),
      frameCount: this.frameCount,
      messageCount: this.messageCount,
      lastFrameTime: this.lastFrameTime,
      config: this.config,
      hasVideoElement: !!this.videoElement,
      hasCanvas: !!this.canvas,
      hasContext: !!this.ctx,
      hasWebSocket: !!this.ws,
      hasEmotionDisplay: !!this.emotionDisplayElement
    };
  }

  /**
   * Clean up resources and close connections
   */
  destroy(): void {
    this.log('🗑️ Destroying sentiment analyzer...');
    this.stopFrameCapture();
    
    if (this.ws) {
      this.log('Closing WebSocket connection...');
      this.ws.close();
      this.ws = null;
    }
    
    this.isConnected = false;
    this.videoElement = null;
    this.emotionDisplayElement = null;
    this.canvas = null;
    this.ctx = null;
    
    this.log('✅ Sentiment analyzer destroyed');
  }

  /**
   * Check if the analyzer is currently running
   */
  isRunning(): boolean {
    return this.isConnected && this.captureInterval !== null;
  }
}

export default HumeSentimentAnalyzer; 