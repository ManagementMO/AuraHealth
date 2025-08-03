"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Chat from "./Chat";
import { 
  Play, 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  Heart, 
  Brain,
  Target,
  Award,
  RefreshCw,
  BarChart3
} from "lucide-react";
import { toast } from "sonner";

type SessionState = 'initial' | 'waiting-for-connection' | 'in-progress' | 'processing' | 'completed';

interface SentimentReport {
  overallSentiment: string;
  emotionalTone: string;
  confidenceLevel: number;
  keyInsights: string[];
  improvementTips: string[];
  praisedAspects: string[];
  emotionBreakdown: {
    [emotion: string]: number;
  };
}

export default function PracticeSession({ accessToken }: { accessToken: string }) {
  const [sessionState, setSessionState] = useState<SessionState>('initial');
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [report, setReport] = useState<SentimentReport | null>(null);
  const [generatingReport, setGeneratingReport] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const sessionStartTime = useRef<Date | null>(null);

  // Timer effect for practice session
  useEffect(() => {
    if (sessionState === 'in-progress') {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setSessionState('processing');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [sessionState]);

  // Generate report when session ends
  useEffect(() => {
    if (sessionState === 'processing') {
      generateReport();
    }
  }, [sessionState]);

  const startPracticeSession = () => {
    setSessionState('waiting-for-connection');
    toast.success("Click 'Start Call' to begin your 60-second practice session!");
  };

  const onCallConnected = () => {
    setSessionState('in-progress');
    setTimeRemaining(60);
    sessionStartTime.current = new Date();
    toast.success("Practice session started! You have 60 seconds.");
  };

  const onSessionEnd = () => {
    // Clear the timer if it's running
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Transition to processing state to generate report
    setSessionState('processing');
    toast.info("Session ended. Generating your practice report...");
  };

  const generateReport = async () => {
    setGeneratingReport(true);
    try {
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionStart: sessionStartTime.current,
          sessionEnd: new Date(),
          accessToken,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const reportData = await response.json();
      setReport(reportData);
      setSessionState('completed');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error("Failed to generate report. Please try again.");
      // Fallback to mock report for demo purposes
      setReport(getMockReport());
      setSessionState('completed');
    } finally {
      setGeneratingReport(false);
    }
  };

  const getMockReport = (): SentimentReport => ({
    overallSentiment: "Positive and Engaged",
    emotionalTone: "Calm with slight nervousness",
    confidenceLevel: 78,
    keyInsights: [
      "You maintained good eye contact throughout the session",
      "Your voice remained steady and clear",
      "You asked thoughtful questions about your health"
    ],
    improvementTips: [
      "Try to speak a bit slower to convey more confidence",
      "Practice deep breathing before important conversations",
      "Consider preparing key questions in advance"
    ],
    praisedAspects: [
      "Excellent communication clarity",
      "Good emotional regulation",
      "Active listening demonstrated"
    ],
    emotionBreakdown: {
      "Calm": 45,
      "Confident": 25,
      "Nervous": 15,
      "Engaged": 15
    }
  });

  const restartSession = () => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setSessionState('initial');
    setTimeRemaining(60);
    setReport(null);
    setGeneratingReport(false);
    sessionStartTime.current = null;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (sessionState === 'initial') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900 mb-3">
              Practice Session with Aura
            </CardTitle>
            <p className="text-lg text-gray-600 leading-relaxed">
              Prepare for your upcoming appointment with a 60-second practice conversation. 
              Aura will help you feel more confident and provide personalized feedback.
            </p>
          </CardHeader>
          <CardContent className="space-y-6 pt-0">
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">60 Seconds</h3>
                <p className="text-sm text-gray-600">Practice time</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <Brain className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">AI Analysis</h3>
                <p className="text-sm text-gray-600">Real-time feedback</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">Personalized Tips</h3>
                <p className="text-sm text-gray-600">Improvement suggestions</p>
              </div>
            </div>

            <Button
              onClick={startPracticeSession}
              size="lg"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Play className="w-6 h-6 mr-3" />
              Start Practice Session
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (sessionState === 'waiting-for-connection') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 relative">
        {/* Instruction Overlay */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
          <Card className="shadow-lg border-0 bg-blue-600 text-white">
            <CardContent className="px-6 py-4">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 animate-pulse" />
                                 <span className="font-semibold">
                   Click "Start Call" below to begin your 60-second practice!
                 </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Component */}
        <div className="pt-20">
          <Chat accessToken={accessToken} onCallConnected={onCallConnected} />
        </div>
      </div>
    );
  }

  if (sessionState === 'in-progress') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 relative">
        {/* Timer Overlay */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="px-4 py-2">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1.5">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="font-mono text-lg font-bold text-gray-900">
                    {formatTime(timeRemaining)}
                  </span>
                </div>
                <div className="w-24">
                  <Progress 
                    value={(timeRemaining / 60) * 100} 
                    className="h-1.5"
                  />
                </div>
                <span className="text-xs text-gray-600 font-medium">
                  Practice Active
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Component */}
        <div className="flex flex-col min-h-screen pt-30">
          <Chat accessToken={accessToken} onCallConnected={onCallConnected} onSessionEnd={onSessionEnd} />
        </div>
      </div>
    );
  }

  if (sessionState === 'processing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <RefreshCw className="w-10 h-10 text-white animate-spin" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Analyzing Your Session
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Aura is processing your conversation to provide personalized insights and recommendations.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>✓ Voice tone analysis</p>
              <p>✓ Emotional assessment</p>
              <p>✓ Communication patterns</p>
              <p className="animate-pulse">⏳ Generating recommendations...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (sessionState === 'completed' && report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                Practice Session Complete!
              </CardTitle>
              <p className="text-lg text-gray-600">
                Here's your personalized feedback and recommendations
              </p>
            </CardHeader>
          </Card>

          {/* Report Content */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Overall Analysis */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                  <span>Overall Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Overall Sentiment</label>
                  <p className="text-lg font-semibold text-gray-900">{report.overallSentiment}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Emotional Tone</label>
                  <p className="text-lg font-semibold text-gray-900">{report.emotionalTone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Confidence Level</label>
                  <div className="flex items-center space-x-3">
                    <Progress value={report.confidenceLevel} className="flex-1" />
                    <span className="font-semibold text-gray-900">{report.confidenceLevel}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emotion Breakdown */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="w-6 h-6 text-purple-600" />
                  <span>Emotion Breakdown</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(report.emotionBreakdown).map(([emotion, percentage]) => (
                  <div key={emotion}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">{emotion}</span>
                      <span className="text-sm font-semibold text-gray-900">{percentage}%</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Improvement Tips */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                  <span>Areas for Improvement</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {report.improvementTips.map((tip, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm font-bold text-orange-600">{index + 1}</span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{tip}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Praised Aspects */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-6 h-6 text-green-600" />
                  <span>What You Did Well</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {report.praisedAspects.map((praise, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="text-gray-700 leading-relaxed">{praise}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Key Insights */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-6 h-6 text-indigo-600" />
                <span>Key Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {report.keyInsights.map((insight, index) => (
                  <div key={index} className="p-4 bg-indigo-50 rounded-xl">
                    <p className="text-gray-700 text-center leading-relaxed">{insight}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={restartSession}
              variant="outline"
              size="lg"
              className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50 px-8 py-4"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Practice Again
            </Button>
            <Button
              size="lg"
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4"
              onClick={() => {
                toast.success("You're ready for your appointment!");
                // Could navigate to appointment or main page
              }}
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Ready for Appointment
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
} 