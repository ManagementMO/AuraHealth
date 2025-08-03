"use client";

import { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { toast } from "sonner";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useVoice } from "@humeai/voice-react";
import { Phone } from "lucide-react";

// Internal component that uses the VoiceProvider context
export function PatientCheckinView({ accessToken }: { accessToken: string }) {
  // Initialization states
  const [webcamReady, setWebcamReady] = useState(false);
  const [webcamError, setWebcamError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Session states
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [conversationStartTime, setConversationStartTime] = useState<number | null>(null);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const webcamRef = useRef<Webcam>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Use the useVoice hook from @humeai/voice-react
  const { status, connect, disconnect, messages } = useVoice();

  // Optional: use configId from environment variable
  const configId = process.env['NEXT_PUBLIC_HUME_CONFIG_ID'];

  // Request webcam permissions when component loads
  useEffect(() => {
    const requestWebcamAccess = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        
        setWebcamReady(true);
        setWebcamError(null);
        
        // Stop the stream since react-webcam will handle it
        stream.getTracks().forEach(track => track.stop());
        
      } catch (error) {
        console.error('Webcam access error:', error);
        
        let errorMessage = 'Unable to access camera and microphone';
        let instructions = 'Please check your camera and microphone permissions and try again.';
        
        if (error instanceof Error) {
          if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
            errorMessage = 'Camera and microphone access denied';
            instructions = 'Please allow camera and microphone access in your browser settings and refresh the page.';
          } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
            errorMessage = 'No camera or microphone found';
            instructions = 'Please connect a camera and microphone device and refresh the page.';
          } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
            errorMessage = 'Camera or microphone is already in use';
            instructions = 'Please close other applications using the camera/microphone and try again.';
          }
        }
        
        setWebcamReady(false);
        setWebcamError(errorMessage);
        
        toast.error(errorMessage, {
          description: instructions,
          duration: 8000,
        });
      }
    };

    requestWebcamAccess();
  }, []);

  // Mark as initialized once webcam is ready
  useEffect(() => {
    if (webcamReady && !webcamError) {
      setIsInitialized(true);
    }
  }, [webcamReady, webcamError]);

  // Handle LLM connection status changes
  useEffect(() => {
    if (status.value === "connected" && !conversationStartTime && !sessionEnded) {
      // LLM connected - start the 60-second session
      setTimeRemaining(60);
      setConversationStartTime(Date.now());

      // Start countdown timer
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          
          if (newTime <= 0) {
            // Defer endConversation to avoid render-while-rendering
            setTimeout(() => endConversation(), 0);
            return 0;
          }
          
          return newTime;
        });
      }, 1000);

      toast.success('Conversation started', {
        description: 'The AI doctor is ready to chat with you. Speak naturally about how you\'ve been feeling.',
        duration: 4000,
      });
    }
  }, [status.value, conversationStartTime, sessionEnded]);

  // Handle disconnection
  useEffect(() => {
    if (status.value === "disconnected" && conversationStartTime && !showSummary) {
      // LLM disconnected - show analysis then summary
      setSessionEnded(true);
      
      // Calculate conversation duration
      const duration = Math.round((Date.now() - conversationStartTime) / 1000);

      toast.success('Conversation completed', {
        description: `Analyzing your ${duration}-second conversation with the AI doctor...`,
        duration: 3000,
      });

      // Show analysis, then summary after delay
      setTimeout(() => {
        setShowSummary(true);
      }, 2000);
    }
  }, [status.value, conversationStartTime, showSummary]);

  const handleWebcamReady = () => {
    setWebcamReady(true);
    setWebcamError(null);
  };

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
    
    setWebcamReady(false);
    setWebcamError(errorMessage);
    
    toast.error(errorMessage, {
      description: instructions,
      duration: 8000,
    });
  };

  const startConversation = () => {
    if (!isInitialized || !accessToken) {
      return;
    }

    connect({ 
      auth: { type: "accessToken", value: accessToken },
      configId, 
    })
      .then(() => {})
      .catch(() => {
        toast.error("Unable to start practice session");
      })
      .finally(() => {});
  };

  const endConversation = () => {
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Disconnect from voice service
    disconnect();
  };

  const restartConversation = () => {
    setTimeRemaining(60);
    setConversationStartTime(null);
    setSessionEnded(false);
    setShowSummary(false);
    // Disconnect if still connected
    if (status.value === "connected") {
      disconnect();
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <>
      <CardHeader>
        <CardTitle className="text-center text-neutral-900">
          AI Doctor Practice Session
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* INITIALIZATION PHASE */}
        {!isInitialized && (
          <>
            <div className="text-center mb-8 px-4">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 max-w-2xl mx-auto">
                <p className="text-neutral-800 text-lg leading-relaxed font-medium mb-2">
                  Practice your doctor consultation with our AI
                </p>
                <p className="text-neutral-600 text-sm mb-3">
                  Have a natural conversation with our AI doctor to prepare for your real appointment. The AI will respond to you just like a real doctor would.
                </p>
                <div className="bg-blue-100 rounded-lg p-3 text-xs text-blue-800">
                  <strong>What happens:</strong> You&apos;ll have a 60-second conversation with the AI doctor. After the session, you&apos;ll get emotional insights and tips to improve your real doctor visit.
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-4">
              {webcamError ? (
                <div className="w-full max-w-md bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                  <div className="text-red-600 font-medium mb-2">
                    {webcamError}
                  </div>
                  <div className="text-red-500 text-sm mb-4">
                    Both camera and microphone access are required for the practice session.
                  </div>
                  <Button 
                    onClick={() => window.location.reload()} 
                    variant="outline"
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    Refresh Page
                  </Button>
                </div>
              ) : (
                <div className="w-full max-w-md bg-neutral-50 border border-neutral-200 rounded-lg p-8 text-center">
                  <div className="animate-pulse">
                    <div className="bg-neutral-300 rounded-lg h-48 mb-4"></div>
                    <div className="text-neutral-600">
                      Setting up camera and microphone...
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* READY TO START */}
        {isInitialized && status.value !== "connecting" && status.value !== "connected" && !sessionEnded && (
          <>
            <div className="text-center mb-8 px-4">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 max-w-2xl mx-auto">
                <p className="text-neutral-800 text-lg leading-relaxed font-medium mb-2">
                  Ready to practice with our AI doctor
                </p>
                <p className="text-neutral-600 text-sm">
                  Your camera and microphone are set up. Click below to start your 60-second practice session.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-4">
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
                    Camera and microphone ready. You can see yourself just like in a video call with your doctor.
                  </p>
                </div>
              </div>

              <Button 
                size="lg"
                className="z-50 flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-full"
                onClick={startConversation}
              >
                <span>
                  <Phone
                    className={"size-4 opacity-50 fill-current"}
                    strokeWidth={0}
                  />
                </span>
                <span>Start Practice Session</span>
              </Button>
            </div>
          </>
        )}

        {/* SESSION PHASE - CONNECTING TO LLM */}
        {status.value === "connecting" && (
          <div className="text-center space-y-4">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-neutral-600">Connecting to AI doctor...</p>
          </div>
        )}

  

        {/* SESSION PHASE - DISCONNECTED (Analysis) */}
        {sessionEnded && !showSummary && (
          <div className="text-center space-y-4">
            <div className="animate-pulse">
              <div className="w-16 h-16 bg-blue-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900">Analyzing Your Session</h3>
            <p className="text-neutral-600">
              Processing your conversation and emotional patterns...
            </p>
          </div>
        )}

        {/* SESSION PHASE - SUMMARY */}
        {showSummary && (
          <div className="text-center space-y-6">
            <div className="bg-green-50 border border-green-100 rounded-lg p-8 max-w-md mx-auto">
              <div className="text-green-600 text-6xl mb-4">✓</div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                Session Complete!
              </h3>
              <p className="text-neutral-700 mb-4">
                Your practice session with the AI doctor has been analyzed.
              </p>
              <div className="bg-green-100 rounded-lg p-3 text-sm text-green-800">
                <div className="font-medium mb-1">Session Summary:</div>
                <div className="text-xs space-y-1">
                  <div>• Messages exchanged: {messages.length}</div>
                  <div>• Duration: {conversationStartTime ? Math.round((Date.now() - conversationStartTime) / 1000) : 60} seconds</div>
                </div>
              </div>
              <p className="text-neutral-600 text-sm mt-4">
                Below you&apos;ll find emotional insights and tips to improve your real doctor consultation.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 max-w-md mx-auto">
              <h4 className="font-semibold text-blue-900 mb-2">🎯 Tips for Your Real Doctor Visit</h4>
              <div className="text-sm text-blue-800 space-y-2">
                <p>• You communicated clearly and naturally</p>
                <p>• Consider maintaining this relaxed tone</p>
                <p>• Remember to ask questions if you&apos;re unsure</p>
              </div>
            </div>

            <Button 
              onClick={restartConversation}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Try Another Practice Session
            </Button>
          </div>
        )}

        {/* Development debug info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="text-xs text-neutral-400 border-t pt-4 mt-6">
            <p>Debug: Voice Status: {status.value}</p>
            <p>Debug: Initialized: {isInitialized ? 'Yes' : 'No'}</p>
            <p>Debug: Webcam Ready: {webcamReady ? 'Yes' : 'No'}</p>
            <p>Debug: Session Ended: {sessionEnded ? 'Yes' : 'No'}</p>
            <p>Debug: Show Summary: {showSummary ? 'Yes' : 'No'}</p>
            <p>Debug: Time Remaining: {timeRemaining}s</p>
            <p>Debug: Messages: {messages.length}</p>
          </div>
        )}
      </CardContent>
    </>
  );
}

