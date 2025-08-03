"use client";

import { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { toast } from "sonner";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

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
  source: "facial" | "vocal";
}

interface CheckinState {
  phase: "idle" | "recording" | "finished";
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
    phase: "idle",
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
          audio: true,
        });

        // If successful, set webcam as ready
        setCheckinState((prev) => ({
          ...prev,
          webcamReady: true,
          webcamError: null,
        }));

        // Stop the stream since react-webcam will handle it
        stream.getTracks().forEach((track) => track.stop());
      } catch (error) {
        console.error("Webcam access error:", error);

        let errorMessage = "Unable to access camera";
        let instructions =
          "Please check your camera permissions and try again.";

        if (error instanceof Error) {
          if (
            error.name === "NotAllowedError" ||
            error.name === "PermissionDeniedError"
          ) {
            errorMessage = "Camera access denied";
            instructions =
              "Please allow camera access in your browser settings and refresh the page.";
          } else if (
            error.name === "NotFoundError" ||
            error.name === "DevicesNotFoundError"
          ) {
            errorMessage = "No camera found";
            instructions =
              "Please connect a camera device and refresh the page.";
          } else if (
            error.name === "NotReadableError" ||
            error.name === "TrackStartError"
          ) {
            errorMessage = "Camera is already in use";
            instructions =
              "Please close other applications using the camera and try again.";
          }
        }

        setCheckinState((prev) => ({
          ...prev,
          webcamReady: false,
          webcamError: errorMessage,
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
    setCheckinState((prev) => ({
      ...prev,
      webcamReady: true,
      webcamError: null,
    }));
  };

  // Handle webcam errors
  const handleWebcamError = (error: string | DOMException) => {
    console.error("Webcam error:", error);

    let errorMessage = "Camera error occurred";
    let instructions = "Please refresh the page and try again.";

    if (typeof error === "string") {
      errorMessage = error;
    } else if (error instanceof DOMException) {
      if (error.name === "NotAllowedError") {
        errorMessage = "Camera access denied";
        instructions =
          "Please allow camera access in your browser settings and refresh the page.";
      } else if (error.name === "NotFoundError") {
        errorMessage = "No camera found";
        instructions = "Please connect a camera device and refresh the page.";
      }
    }

    setCheckinState((prev) => ({
      ...prev,
      webcamReady: false,
      webcamError: errorMessage,
    }));

    toast.error(errorMessage, {
      description: instructions,
      duration: 8000,
    });
  };

  // Start recording function
  const startRecording = () => {
    if (checkinState.phase !== "idle" || !checkinState.webcamReady) {
      return;
    }

    // Set recording phase and reset timer
    setCheckinState((prev) => ({
      ...prev,
      phase: "recording",
      timeRemaining: 60,
    }));

    // Start countdown timer
    timerRef.current = setInterval(() => {
      setCheckinState((prev) => {
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

    toast.success("Recording started", {
      description: "Please describe how you've been feeling.",
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
    setCheckinState((prev) => ({
      ...prev,
      phase: "finished",
      timeRemaining: 0,
    }));

    toast.success("Recording completed", {
      description: "Thank you for completing your check-in.",
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
      <CardHeader className="bg-gradient-to-r from-blue-50 to-teal-50 border-b border-slate-200">
        <CardTitle className="text-center text-slate-900 text-2xl font-bold">
          Emotional Wellness Assessment
        </CardTitle>
        <p className="text-center text-slate-600 mt-2">
          Share how you`&apos;`ve been feeling to help personalize your care
        </p>
      </CardHeader>
      <CardContent className="p-6 lg:p-8 space-y-8">
        {checkinState.phase === "idle" && (
          <>
            {/* Instructions */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-200 rounded-xl p-6 lg:p-8 max-w-2xl mx-auto">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-slate-900 text-xl font-semibold mb-3">
                  How This Helps Your Care
                </h3>
                <p className="text-slate-700 text-lg leading-relaxed mb-4">
                  Take 60 seconds to describe how you`&apos;`ve been feeling physically
                  and emotionally. Our AI will analyze your emotional state to
                  help your provider understand your well-being.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-sm text-slate-600 font-medium">
                      Personalized Care
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <svg
                        className="w-4 h-4 text-teal-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <p className="text-sm text-slate-600 font-medium">
                      AI Analysis
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <svg
                        className="w-4 h-4 text-emerald-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <p className="text-sm text-slate-600 font-medium">
                      Secure & Private
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Webcam Section */}
            <div className="flex flex-col items-center space-y-6">
              {checkinState.webcamError ? (
                // Error State
                <div className="w-full max-w-lg bg-red-50 border-2 border-red-200 rounded-xl p-6 lg:p-8 text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-red-800 font-semibold text-lg mb-2">
                    Camera Access Required
                  </h3>
                  <div className="text-red-700 font-medium mb-2">
                    {checkinState.webcamError}
                  </div>
                  <div className="text-red-600 text-sm mb-6 leading-relaxed">
                    {checkinState.webcamError.includes("denied") &&
                      'Please click the camera icon in your browser\'s address bar and select "Allow", then refresh this page.'}
                    {checkinState.webcamError.includes("found") &&
                      "Please connect a camera device and refresh the page to continue with your assessment."}
                    {!checkinState.webcamError.includes("denied") &&
                      !checkinState.webcamError.includes("found") &&
                      "Please check your camera permissions in browser settings and try again."}
                  </div>
                  <Button
                    onClick={() => window.location.reload()}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2"
                  >
                    Refresh Page
                  </Button>
                </div>
              ) : checkinState.webcamReady ? (
                // Webcam Feed
                <div className="w-full max-w-lg">
                  <div className="relative rounded-xl overflow-hidden bg-slate-100 border-2 border-slate-200 shadow-lg">
                    <Webcam
                      ref={webcamRef}
                      audio={true}
                      width="100%"
                      height="auto"
                      videoConstraints={{
                        width: 640,
                        height: 480,
                        facingMode: "user",
                      }}
                      onUserMedia={handleWebcamReady}
                      onUserMediaError={handleWebcamError}
                      className="w-full h-auto"
                    />
                    {/* Camera Ready Indicator */}
                    <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span>Ready</span>
                    </div>
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-slate-600 text-sm font-medium">
                      ✓ Camera is active and ready for your assessment
                    </p>
                  </div>
                </div>
              ) : (
                // Loading State
                <div className="w-full max-w-lg bg-slate-50 border-2 border-slate-200 rounded-xl p-8 lg:p-12 text-center">
                  <div className="animate-pulse">
                    <div className="bg-slate-200 rounded-xl h-48 lg:h-64 mb-6"></div>
                    <div className="space-y-2">
                      <div className="text-slate-600 font-medium">
                        Requesting camera access...
                      </div>
                      <div className="text-slate-500 text-sm">
                        Please allow camera permissions when prompted
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Start Button - only show when webcam is ready */}
              {checkinState.webcamReady && !checkinState.webcamError && (
                <div className="text-center space-y-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    onClick={startRecording}
                    disabled={checkinState.phase !== "idle"}
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Begin Wellness Assessment
                  </Button>
                  <p className="text-slate-500 text-sm">
                    This will record for 60 seconds • Speak naturally about how
                    you feel
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {checkinState.phase === "recording" && (
          <>
            {/* Recording State */}
            <div className="flex flex-col items-center space-y-8">
              {/* Webcam Feed during recording */}
              <div className="w-full max-w-lg">
                <div className="relative rounded-xl overflow-hidden bg-slate-100 border-4 border-red-500 shadow-xl">
                  <Webcam
                    ref={webcamRef}
                    audio={true}
                    width="100%"
                    height="auto"
                    videoConstraints={{
                      width: 640,
                      height: 480,
                      facingMode: "user",
                    }}
                    className="w-full h-auto"
                  />
                  {/* Recording indicator */}
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-2 shadow-lg">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    <span>RECORDING</span>
                  </div>
                  {/* Pulse animation overlay */}
                  <div className="absolute inset-0 border-4 border-red-400 rounded-xl animate-pulse opacity-50"></div>
                </div>
              </div>

              {/* Timer and Progress */}
              <div className="w-full max-w-lg space-y-6">
                <div className="text-center bg-white rounded-xl p-6 shadow-lg border border-slate-200">
                  <div className="text-5xl lg:text-6xl font-bold text-slate-900 mb-3 font-mono">
                    {Math.floor(checkinState.timeRemaining / 60)}:
                    {(checkinState.timeRemaining % 60)
                      .toString()
                      .padStart(2, "0")}
                  </div>
                  <p className="text-slate-600 text-lg font-medium">
                    Time remaining for your assessment
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-3">
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                    <Progress
                      value={((60 - checkinState.timeRemaining) / 60) * 100}
                      className="h-4"
                    />
                    <div className="flex justify-between text-sm text-slate-500 mt-2 font-medium">
                      <span>0:00</span>
                      <span className="text-slate-700">
                        Recording in progress...
                      </span>
                      <span>1:00</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions during recording */}
              <div className="text-center max-w-2xl bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-6 border border-blue-200">
                <h3 className="text-slate-900 font-semibold text-lg mb-3">
                  Share Your Experience
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
                  <div className="space-y-2">
                    <p className="font-medium text-slate-800">
                      Physical Health:
                    </p>
                    <ul className="space-y-1 text-left">
                      <li>• Any symptoms you`&apos;`re experiencing</li>
                      <li>• Changes in energy or sleep</li>
                      <li>• Pain or discomfort levels</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-slate-800">
                      Mental Wellness:
                    </p>
                    <ul className="space-y-1 text-left">
                      <li>• Your mood and emotions</li>
                      <li>• Stress or anxiety levels</li>
                      <li>• Overall well-being</li>
                    </ul>
                  </div>
                </div>
                <p className="text-slate-600 text-sm mt-4 italic">
                  Speak naturally - our AI will analyze your tone and
                  expressions to better understand your health status.
                </p>
              </div>
            </div>
          </>
        )}

        {checkinState.phase === "finished" && (
          <>
            {/* Completion State */}
            <div className="text-center space-y-8">
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl p-8 lg:p-12 max-w-2xl mx-auto">
                <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4">
                  Assessment Complete!
                </h3>
                <p className="text-slate-700 text-lg mb-6 leading-relaxed">
                  Thank you for sharing your wellness information. Your
                  healthcare provider now has valuable insights to personalize
                  your care.
                </p>

                {/* Next Steps */}
                <div className="bg-white rounded-lg p-6 border border-emerald-200 mb-6">
                  <h4 className="text-slate-900 font-semibold text-lg mb-4">
                    What Happens Next
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <span className="text-blue-600 font-bold">1</span>
                      </div>
                      <p className="font-medium text-slate-800">AI Analysis</p>
                      <p className="text-slate-600">
                        Processing your emotional and vocal patterns
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <span className="text-teal-600 font-bold">2</span>
                      </div>
                      <p className="font-medium text-slate-800">
                        Provider Review
                      </p>
                      <p className="text-slate-600">
                        Your doctor reviews the insights before your call
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <span className="text-emerald-600 font-bold">3</span>
                      </div>
                      <p className="font-medium text-slate-800">
                        Personalized Care
                      </p>
                      <p className="text-slate-600">
                        Receive tailored treatment recommendations
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-6 py-3 rounded-lg font-semibold"
                    onClick={() => (window.location.href = "/video-call")}
                  >
                    Join Video Consultation
                  </Button>
                  <Button
                    variant="outline"
                    className="border-slate-300 text-slate-700 hover:bg-slate-50 px-6 py-3 rounded-lg font-semibold"
                    onClick={() => (window.location.href = "/")}
                  >
                    Return to Dashboard
                  </Button>
                </div>
              </div>

              {/* Privacy Reassurance */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 max-w-2xl mx-auto">
                <div className="flex items-center justify-center space-x-2 text-slate-600 text-sm">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <span>
                    Your assessment data is encrypted and HIPAA-compliant
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Development Debug Info */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <details className="text-xs text-slate-400">
              <summary className="cursor-pointer hover:text-slate-600 font-medium mb-2">
                Development Debug Information
              </summary>
              <div className="bg-slate-50 rounded-lg p-4 space-y-1 font-mono">
                <p>
                  <span className="font-semibold">Phase:</span>{" "}
                  {checkinState.phase}
                </p>
                <p>
                  <span className="font-semibold">Webcam Ready:</span>{" "}
                  {checkinState.webcamReady ? "Yes" : "No"}
                </p>
                <p>
                  <span className="font-semibold">Time Remaining:</span>{" "}
                  {checkinState.timeRemaining}s
                </p>
                <p>
                  <span className="font-semibold">Error:</span>{" "}
                  {checkinState.webcamError || "None"}
                </p>
                <p>
                  <span className="font-semibold">Emotion Data Points:</span>{" "}
                  {checkinState.emotionData.length}
                </p>
              </div>
            </details>
          </div>
        )}
      </CardContent>
    </>
  );
}
