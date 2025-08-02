"use client";

import { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { toast } from "sonner";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { VoiceProvider, useVoice } from "@humeai/voice-react";

// TypeScript interfaces for component state and data
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

interface CheckinState {
  phase: 'idle' | 'recording' | 'finished';
  timeRemaining: number;
  webcamReady: boolean;
  webcamError: string | null;
  emotionData: EmotionDataPoint[];
  humeWebSocket: WebSocket | null;
  eviWebSocket: WebSocket | null;
}

interface PatientCheckinProps {
  // Future props for configuration
  className?: string;
}

export function PatientCheckin({}: PatientCheckinProps) {
  // Component state management for idle/recording/finished phases
  const [checkinState, setCheckinState] = useState<CheckinState>({
    phase: 'idle',
    timeRemaining: 60, // 60-second timer
    webcamReady: false,
    webcamError: null,
    emotionData: [],
    humeWebSocket: null,
    eviWebSocket: null,
  });

  const webcamRef = useRef<Webcam>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Request webcam permissions when component loads
  useEffect(() => {
    const requestWebcamAccess = async () => {
      try {
        // Request camera permissions
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        
        // If successful, set webcam as ready
        setCheckinState(prev => ({ 
          ...prev, 
          webcamReady: true, 
          webcamError: null 
        }));
        
        // Stop the stream since react-webcam will handle it
        stream.getTracks().forEach(track => track.stop());
        
      } catch (error) {
        console.error('Webcam access error:', error);
        
        let errorMessage = 'Unable to access camera';
        let instructions = 'Please check your camera permissions and try again.';
        
        if (error instanceof Error) {
          if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
            errorMessage = 'Camera access denied';
            instructions = 'Please allow camera access in your browser settings and refresh the page.';
          } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
            errorMessage = 'No camera found';
            instructions = 'Please connect a camera device and refresh the page.';
          } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
            errorMessage = 'Camera is already in use';
            instructions = 'Please close other applications using the camera and try again.';
          }
        }
        
        setCheckinState(prev => ({ 
          ...prev, 
          webcamReady: false, 
          webcamError: errorMessage 
        }));
        
        // Show toast notification with error and instructions
        toast.error(errorMessage, {
          description: instructions,
          duration: 8000,
        });
      }
    };

    requestWebcamAccess();
  }, []);

  // Handle webcam ready state
  const handleWebcamReady = () => {
    setCheckinState(prev => ({ 
      ...prev, 
      webcamReady: true, 
      webcamError: null 
    }));
  };

  // Handle webcam errors
  const handleWebcamError = (error: string | DOMException) => {
    console.error('Webcam error:', error);
    
    let errorMessage = 'Camera error occurred';
    let instructions = 'Please refresh the page and try again.';
    
    if (typeof error === 'string') {
      errorMessage = error;
    } else if (error instanceof DOMException) {
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Camera access denied';
        instructions = 'Please allow camera access in your browser settings and refresh the page.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No camera found';
        instructions = 'Please connect a camera device and refresh the page.';
      }
    }
    
    setCheckinState(prev => ({ 
      ...prev, 
      webcamReady: false, 
      webcamError: errorMessage 
    }));
    
    toast.error(errorMessage, {
      description: instructions,
      duration: 8000,
    });
  };

  // Start recording function
  const startRecording = () => {
    if (checkinState.phase !== 'idle' || !checkinState.webcamReady) {
      return;
    }

    // Set recording phase and reset timer
    setCheckinState(prev => ({
      ...prev,
      phase: 'recording',
      timeRemaining: 60,
    }));

    // Start countdown timer
    timerRef.current = setInterval(() => {
      setCheckinState(prev => {
        const newTimeRemaining = prev.timeRemaining - 1;
        
        // If timer reaches 0, stop recording
        if (newTimeRemaining <= 0) {
          stopRecording();
          return {
            ...prev,
            timeRemaining: 0,
          };
        }
        
        return {
          ...prev,
          timeRemaining: newTimeRemaining,
        };
      });
    }, 1000);

    toast.success('Recording started', {
      description: 'Please describe how you\'ve been feeling.',
      duration: 3000,
    });
  };

  // Stop recording function
  const stopRecording = () => {
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Set finished phase
    setCheckinState(prev => ({
      ...prev,
      phase: 'finished',
      timeRemaining: 0,
    }));

    toast.success('Recording completed', {
      description: 'Thank you for completing your check-in.',
      duration: 3000,
    });
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Render component based on current phase
  return (
    <>
      <CardHeader>
        <CardTitle className="text-center text-neutral-900">
          Patient Check-in
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {checkinState.phase === 'idle' && (
          <>
            {/* Instructions */}
            <div className="text-center mb-8 px-4">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 max-w-2xl mx-auto">
                <p className="text-neutral-800 text-lg leading-relaxed font-medium mb-2">
                  To prepare for your appointment, please take 60 seconds to describe how you&apos;ve been feeling.
                </p>
                <p className="text-neutral-600 text-sm">
                  This helps your healthcare provider better understand your current state and provide more personalized care.
                </p>
              </div>
            </div>

            {/* Webcam Section */}
            <div className="flex flex-col items-center space-y-4">
              {checkinState.webcamError ? (
                // Error State
                <div className="w-full max-w-md bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                  <div className="text-red-600 font-medium mb-2">
                    {checkinState.webcamError}
                  </div>
                  <div className="text-red-500 text-sm mb-4">
                    {checkinState.webcamError.includes('denied') && 
                      'Please allow camera access in your browser settings and refresh the page.'
                    }
                    {checkinState.webcamError.includes('found') && 
                      'Please connect a camera device and refresh the page.'
                    }
                    {!checkinState.webcamError.includes('denied') && 
                     !checkinState.webcamError.includes('found') && 
                      'Please check your camera permissions and try again.'
                    }
                  </div>
                  <Button 
                    onClick={() => window.location.reload()} 
                    variant="outline"
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    Refresh Page
                  </Button>
                </div>
              ) : checkinState.webcamReady ? (
                // Webcam Feed
                <div className="w-full max-w-md">
                  <div className="relative rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200">
                    <Webcam
                      ref={webcamRef}
                      audio={true}
                      width="100%"
                      height="auto"
                      videoConstraints={{
                        width: 640,
                        height: 480,
                        facingMode: "user"
                      }}
                      onUserMedia={handleWebcamReady}
                      onUserMediaError={handleWebcamError}
                      className="w-full h-auto"
                    />
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-neutral-600 text-sm">
                      Camera is ready. You can see yourself in the preview above.
                    </p>
                  </div>
                </div>
              ) : (
                // Loading State
                <div className="w-full max-w-md bg-neutral-50 border border-neutral-200 rounded-lg p-8 text-center">
                  <div className="animate-pulse">
                    <div className="bg-neutral-300 rounded-lg h-48 mb-4"></div>
                    <div className="text-neutral-600">
                      Requesting camera access...
                    </div>
                  </div>
                </div>
              )}

              {/* Start Button - only show when webcam is ready */}
              {checkinState.webcamReady && !checkinState.webcamError && (
                <Button 
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                  onClick={startRecording}
                  disabled={checkinState.phase !== 'idle'}
                >
                  Start 60-Second Check-in
                </Button>
              )}
            </div>
          </>
        )}

        {checkinState.phase === 'recording' && (
          <>
            {/* Recording State */}
            <div className="flex flex-col items-center space-y-6">
              {/* Webcam Feed during recording */}
              <div className="w-full max-w-md">
                <div className="relative rounded-lg overflow-hidden bg-neutral-100 border-2 border-red-500">
                  <Webcam
                    ref={webcamRef}
                    audio={true}
                    width="100%"
                    height="auto"
                    videoConstraints={{
                      width: 640,
                      height: 480,
                      facingMode: "user"
                    }}
                    className="w-full h-auto"
                  />
                  {/* Recording indicator */}
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span>Recording</span>
                  </div>
                </div>
              </div>

              {/* Timer and Progress */}
              <div className="w-full max-w-md space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-neutral-900 mb-2">
                    {Math.floor(checkinState.timeRemaining / 60)}:{(checkinState.timeRemaining % 60).toString().padStart(2, '0')}
                  </div>
                  <p className="text-neutral-600">
                    Please describe how you've been feeling
                  </p>
                </div>
                
                {/* Progress Bar */}
                <div className="space-y-2">
                  <Progress 
                    value={((60 - checkinState.timeRemaining) / 60) * 100} 
                    className="h-3"
                  />
                  <div className="flex justify-between text-sm text-neutral-500">
                    <span>0:00</span>
                    <span>1:00</span>
                  </div>
                </div>
              </div>

              {/* Instructions during recording */}
              <div className="text-center max-w-md">
                <p className="text-neutral-600 text-sm">
                  Speak naturally and describe your current health concerns, symptoms, or how you&apos;ve been feeling recently.
                </p>
              </div>
            </div>
          </>
        )}

        {checkinState.phase === 'finished' && (
          <>
            {/* Completion State */}
            <div className="text-center space-y-6">
              <div className="bg-green-50 border border-green-100 rounded-lg p-8 max-w-md mx-auto">
                <div className="text-green-600 text-6xl mb-4">✓</div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                  Thank You!
                </h3>
                <p className="text-neutral-700 mb-4">
                  Your check-in has been completed successfully.
                </p>
                <p className="text-neutral-600 text-sm">
                  Your healthcare provider will review this information before your appointment.
                </p>
              </div>
            </div>
          </>
        )}

        {/* Debug info - will be removed in future tasks */}
        {process.env.NODE_ENV === 'development' && (
          <div className="text-xs text-neutral-400 border-t pt-4 mt-6">
            <p>Debug: Phase: {checkinState.phase}</p>
            <p>Debug: Webcam Ready: {checkinState.webcamReady ? 'Yes' : 'No'}</p>
            <p>Debug: Time Remaining: {checkinState.timeRemaining}s</p>
            <p>Debug: Error: {checkinState.webcamError || 'None'}</p>
          </div>
        )}
      </CardContent>
    </>
  );
}