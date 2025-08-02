"use client";

import { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { toast } from "sonner";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
// Note: Using manual WebSocket connections instead of @humeai/voice-react for more control

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
  humeToken: string | null;
  isConnecting: boolean;
  conversationTranscript: string[];
  connectionStatus: {
    facial: 'connecting' | 'connected' | 'error' | 'disconnected';
    vocal: 'connecting' | 'connected' | 'error' | 'disconnected';
  };
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
    humeToken: null,
    isConnecting: false,
    conversationTranscript: [],
    connectionStatus: {
      facial: 'disconnected',
      vocal: 'disconnected',
    },
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

  // Fetch Hume AI access token
  const fetchHumeToken = async (): Promise<string | null> => {
    try {
      const response = await fetch('/api/hume/token');
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 500 && errorData.error === 'Server configuration error') {
          console.warn('Hume AI credentials not configured - running in demo mode');
          toast.info('Demo Mode', {
            description: 'Emotion analysis is not configured. Recording will work without AI analysis.',
            duration: 5000,
          });
          return 'demo-mode';
        }
        
        throw new Error(`Token fetch failed: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (!data.accessToken) {
        throw new Error('No access token received');
      }
      
      return data.accessToken;
    } catch (error) {
      console.error('Error fetching Hume token:', error);
      toast.error('Authentication failed', {
        description: 'Unable to connect to emotion analysis service. Recording will work without AI analysis.',
        duration: 5000,
      });
      return null;
    }
  };

  // Initialize Hume AI WebSocket connections
  const initializeHumeConnections = async () => {
    if (checkinState.isConnecting || checkinState.humeToken) {
      return;
    }

    setCheckinState(prev => ({ 
      ...prev, 
      isConnecting: true,
      connectionStatus: {
        facial: 'connecting',
        vocal: 'connecting'
      }
    }));

    try {
      // Fetch secure access token
      const token = await fetchHumeToken();
      
      if (!token) {
        setCheckinState(prev => ({ ...prev, isConnecting: false }));
        return;
      }

      setCheckinState(prev => ({ ...prev, humeToken: token }));

      // If in demo mode, skip WebSocket connections
      if (token === 'demo-mode') {
        console.log('Running in demo mode - skipping Hume AI WebSocket connections');
        setCheckinState(prev => ({ 
          ...prev, 
          isConnecting: false,
          humeWebSocket: null,
          eviWebSocket: null,
          connectionStatus: {
            facial: 'disconnected',
            vocal: 'disconnected'
          }
        }));
        return;
      }

          // Initialize Expression Measurement API WebSocket for facial analysis
      const expressionWs = new WebSocket(
        `wss://api.hume.ai/v0/stream/models`
      );

      expressionWs.onopen = () => {
        console.log('Expression Measurement WebSocket connected');
        
        setCheckinState(prev => ({
          ...prev,
          connectionStatus: {
            ...prev.connectionStatus,
            facial: 'connected'
          }
        }));
        
        // Send authentication and configuration
        const authMessage = {
          models: {
            face: {}
          },
          stream_window_ms: 1000,
          reset_stream: true
        };
        
        expressionWs.send(JSON.stringify(authMessage));
      };

      expressionWs.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Handle facial expression predictions
          if (data.face && data.face.predictions && data.face.predictions.length > 0) {
            const prediction = data.face.predictions[0];
            
            if (prediction.emotions && prediction.emotions.length > 0) {
              // Convert Hume emotion array to our emotion object format
              const emotions = {
                joy: 0,
                sadness: 0,
                anger: 0,
                fear: 0,
                surprise: 0,
                disgust: 0,
                contempt: 0,
              };

              // Map Hume emotions to our format
              prediction.emotions.forEach((emotion: any) => {
                const emotionName = emotion.name.toLowerCase();
                if (emotionName in emotions) {
                  emotions[emotionName as keyof typeof emotions] = emotion.score;
                }
              });

              const emotionPoint: EmotionDataPoint = {
                timestamp: Date.now(),
                emotions,
                confidence: prediction.prob || 0.5,
                source: 'facial'
              };

              setCheckinState(prev => ({
                ...prev,
                emotionData: [...prev.emotionData, emotionPoint]
              }));
            }
          }
        } catch (error) {
          console.error('Error processing facial emotion data:', error);
        }
      };

      expressionWs.onerror = (error) => {
        console.error('Expression Measurement WebSocket error:', error);
        
        setCheckinState(prev => ({
          ...prev,
          connectionStatus: {
            ...prev.connectionStatus,
            facial: 'error'
          }
        }));
        
        toast.error('Facial analysis connection failed', {
          description: 'Unable to connect to facial emotion analysis.',
          duration: 5000,
        });
      };

      expressionWs.onclose = () => {
        console.log('Expression Measurement WebSocket closed');
        
        setCheckinState(prev => ({
          ...prev,
          connectionStatus: {
            ...prev.connectionStatus,
            facial: 'disconnected'
          }
        }));
      };

      // Initialize EVI API WebSocket for vocal analysis and intelligent conversation
      const eviWs = new WebSocket(
        `wss://api.hume.ai/v0/evi/chat`,
        [],
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-Hume-Api-Key': token
          }
        } as any
      );

      eviWs.onopen = () => {
        console.log('EVI WebSocket connected');
        
        setCheckinState(prev => ({
          ...prev,
          connectionStatus: {
            ...prev.connectionStatus,
            vocal: 'connected'
          }
        }));
        
        // Configure EVI session for healthcare conversation
        const sessionConfig = {
          type: 'session_settings',
          session_settings: {
            type: 'session_settings',
            system_prompt: "You are a compassionate healthcare assistant helping patients prepare for their appointment. Your role is to listen empathetically as they describe how they've been feeling and gently encourage them to share their health concerns. Keep responses brief and supportive. Ask follow-up questions to help them articulate their feelings and symptoms clearly. This is a rehearsal conversation to help them prepare for their actual doctor visit.",
            voice: {
              provider: "HUME_AI",
              name: "ITO"
            },
            language: "en",
            max_duration: 60000, // 60 seconds
            inactivity_timeout: 10000 // 10 seconds of silence
          }
        };
        
        eviWs.send(JSON.stringify(sessionConfig));
      };

      eviWs.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Handle different EVI message types
          switch (data.type) {
            case 'user_message':
              // Add user message to conversation transcript
              if (data.message && data.message.content) {
                setCheckinState(prev => ({
                  ...prev,
                  conversationTranscript: [...prev.conversationTranscript, `User: ${data.message.content}`]
                }));
              }

              // Process vocal prosody data from user speech
              if (data.models && data.models.prosody && data.models.prosody.scores) {
                const prosodyScores = data.models.prosody.scores;
                
                // Convert prosody scores to our emotion format
                const emotions = {
                  joy: 0,
                  sadness: 0,
                  anger: 0,
                  fear: 0,
                  surprise: 0,
                  disgust: 0,
                  contempt: 0,
                };

                // Map prosody emotions to our format
                Object.keys(prosodyScores).forEach(emotionName => {
                  const normalizedName = emotionName.toLowerCase();
                  if (normalizedName in emotions) {
                    emotions[normalizedName as keyof typeof emotions] = prosodyScores[emotionName];
                  }
                });

                const emotionPoint: EmotionDataPoint = {
                  timestamp: Date.now(),
                  emotions,
                  confidence: data.models.prosody.confidence || 0.7,
                  source: 'vocal'
                };

                setCheckinState(prev => ({
                  ...prev,
                  emotionData: [...prev.emotionData, emotionPoint]
                }));
              }
              break;

            case 'assistant_message':
              // Add assistant message to conversation transcript
              if (data.message && data.message.content) {
                setCheckinState(prev => ({
                  ...prev,
                  conversationTranscript: [...prev.conversationTranscript, `Assistant: ${data.message.content}`]
                }));
              }
              console.log('EVI Assistant response:', data.message?.content);
              break;

            case 'audio_output':
              // Handle audio responses from EVI (AI speaking back)
              if (data.data) {
                // Play audio response from EVI
                const audioBlob = new Blob([Uint8Array.from(atob(data.data), c => c.charCodeAt(0))], {
                  type: 'audio/wav'
                });
                const audioUrl = URL.createObjectURL(audioBlob);
                const audio = new Audio(audioUrl);
                audio.play().catch(error => {
                  console.error('Error playing EVI audio response:', error);
                });
              }
              break;

            case 'session_status':
              console.log('EVI Session status:', data.status);
              break;

            default:
              console.log('Unknown EVI message type:', data.type);
          }
        } catch (error) {
          console.error('Error processing EVI message:', error);
        }
      };

      eviWs.onerror = (error) => {
        console.error('EVI WebSocket error:', error);
        
        setCheckinState(prev => ({
          ...prev,
          connectionStatus: {
            ...prev.connectionStatus,
            vocal: 'error'
          }
        }));
        
        toast.error('Voice analysis connection failed', {
          description: 'Unable to connect to voice emotion analysis and conversation.',
          duration: 5000,
        });
      };

      eviWs.onclose = () => {
        console.log('EVI WebSocket closed');
        
        setCheckinState(prev => ({
          ...prev,
          connectionStatus: {
            ...prev.connectionStatus,
            vocal: 'disconnected'
          }
        }));
      };

      // Store WebSocket connections in state
      setCheckinState(prev => ({
        ...prev,
        humeWebSocket: expressionWs,
        eviWebSocket: eviWs,
        isConnecting: false,
      }));

    } catch (error) {
      console.error('Error initializing Hume connections:', error);
      setCheckinState(prev => ({ ...prev, isConnecting: false }));
      
      toast.error('Connection failed', {
        description: 'Unable to initialize emotion analysis services.',
        duration: 5000,
      });
    }
  };

  // Initialize Hume connections when component mounts
  useEffect(() => {
    initializeHumeConnections();
    
    // Cleanup WebSocket connections on unmount
    return () => {
      if (checkinState.humeWebSocket) {
        checkinState.humeWebSocket.close();
      }
      if (checkinState.eviWebSocket) {
        checkinState.eviWebSocket.close();
      }
    };
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
  const startRecording = async () => {
    if (checkinState.phase !== 'idle' || !checkinState.webcamReady) {
      return;
    }

    // Check if we have a token (either real or demo mode)
    if (!checkinState.humeToken) {
      toast.error('Connection not ready', {
        description: 'Please wait for services to initialize.',
        duration: 3000,
      });
      return;
    }

    const isDemoMode = checkinState.humeToken === 'demo-mode';

    // Set recording phase and reset timer
    setCheckinState(prev => ({
      ...prev,
      phase: 'recording',
      timeRemaining: 60,
      emotionData: [], // Reset emotion data for new recording
    }));

    // Start streaming video frames to Expression Measurement API (if not in demo mode)
    let videoStreamInterval: NodeJS.Timeout | null = null;
    
    if (!isDemoMode) {
      const streamVideoFrames = () => {
        if (webcamRef.current && checkinState.humeWebSocket && checkinState.phase === 'recording') {
          const canvas = document.createElement('canvas');
          const video = webcamRef.current.video;
          
          if (video && video.videoWidth > 0 && video.videoHeight > 0) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(video, 0, 0);
              
              // Convert canvas to base64 image (JPEG format for better performance)
              const imageData = canvas.toDataURL('image/jpeg', 0.7);
              const base64Data = imageData.split(',')[1];
              
              // Send frame to Expression Measurement API with proper format
              if (checkinState.humeWebSocket.readyState === WebSocket.OPEN) {
                const message = {
                  data: base64Data,
                  models: {
                    face: {}
                  },
                  stream_window_ms: 1000,
                  reset_stream: false
                };
                
                checkinState.humeWebSocket.send(JSON.stringify(message));
              }
            }
          }
        }
      };

      // Start video frame streaming (every 300ms for optimal performance vs accuracy balance)
      videoStreamInterval = setInterval(streamVideoFrames, 300);
    } else {
      // In demo mode, generate mock emotion data
      videoStreamInterval = setInterval(() => {
        if (checkinState.phase === 'recording') {
          const mockEmotionPoint: EmotionDataPoint = {
            timestamp: Date.now(),
            emotions: {
              joy: Math.random() * 0.3 + 0.1,
              sadness: Math.random() * 0.2,
              anger: Math.random() * 0.1,
              fear: Math.random() * 0.15,
              surprise: Math.random() * 0.2,
              disgust: Math.random() * 0.1,
              contempt: Math.random() * 0.05,
            },
            confidence: Math.random() * 0.3 + 0.7,
            source: 'facial'
          };

          setCheckinState(prev => ({
            ...prev,
            emotionData: [...prev.emotionData, mockEmotionPoint]
          }));
        }
      }, 500);
    }

    // Start audio capture for EVI (if not in demo mode)
    if (!isDemoMode) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            sampleRate: 16000,
            channelCount: 1,
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }, 
          video: false 
        });
        
        // Set up audio processing for EVI WebSocket with proper format
        const audioContext = new AudioContext({ sampleRate: 16000 });
        const source = audioContext.createMediaStreamSource(stream);
        
        // Use AudioWorklet for better performance if available, fallback to ScriptProcessor
        let processor: AudioNode;
        let isProcessing = false;
        
        if (audioContext.audioWorklet) {
          // Modern approach with AudioWorklet (better performance)
          try {
            await audioContext.audioWorklet.addModule('/audio-processor.js');
            processor = new AudioWorkletNode(audioContext, 'audio-processor');
            
            processor.port.onmessage = (event) => {
              if (checkinState.eviWebSocket && 
                  checkinState.eviWebSocket.readyState === WebSocket.OPEN && 
                  checkinState.phase === 'recording' && 
                  !isProcessing) {
                
                isProcessing = true;
                
                // Convert Float32Array to base64 encoded PCM data
                const audioData = event.data;
                const int16Array = new Int16Array(audioData.length);
                
                for (let i = 0; i < audioData.length; i++) {
                  int16Array[i] = Math.max(-32768, Math.min(32767, audioData[i] * 32768));
                }
                
                const base64Audio = btoa(String.fromCharCode(...new Uint8Array(int16Array.buffer)));
                
                const message = {
                  type: 'audio_input',
                  data: base64Audio,
                  encoding: 'linear16',
                  sample_rate: 16000
                };
                
                checkinState.eviWebSocket.send(JSON.stringify(message));
                
                setTimeout(() => { isProcessing = false; }, 50); // Throttle to ~20fps
              }
            };
          } catch (workletError) {
            console.warn('AudioWorklet not available, falling back to ScriptProcessor');
            // Fallback to ScriptProcessor
            processor = audioContext.createScriptProcessor(4096, 1, 1);
          }
        } else {
          // Fallback to ScriptProcessor for older browsers
          processor = audioContext.createScriptProcessor(4096, 1, 1);
        }
        
        // ScriptProcessor fallback implementation
        if (processor instanceof ScriptProcessorNode) {
          processor.onaudioprocess = (event) => {
            if (checkinState.eviWebSocket && 
                checkinState.eviWebSocket.readyState === WebSocket.OPEN && 
                checkinState.phase === 'recording' && 
                !isProcessing) {
              
              isProcessing = true;
              
              const inputBuffer = event.inputBuffer.getChannelData(0);
              
              // Convert to 16-bit PCM and then to base64
              const int16Array = new Int16Array(inputBuffer.length);
              for (let i = 0; i < inputBuffer.length; i++) {
                int16Array[i] = Math.max(-32768, Math.min(32767, inputBuffer[i] * 32768));
              }
              
              const base64Audio = btoa(String.fromCharCode(...new Uint8Array(int16Array.buffer)));
              
              const message = {
                type: 'audio_input',
                data: base64Audio,
                encoding: 'linear16',
                sample_rate: 16000
              };
              
              checkinState.eviWebSocket.send(JSON.stringify(message));
              
              setTimeout(() => { isProcessing = false; }, 50); // Throttle to ~20fps
            }
          };
        }
        
        source.connect(processor);
        if (processor instanceof ScriptProcessorNode) {
          processor.connect(audioContext.destination);
        }
        
        // Store cleanup functions
        const cleanup = () => {
          if (videoStreamInterval) clearInterval(videoStreamInterval);
          processor.disconnect();
          source.disconnect();
          stream.getTracks().forEach(track => track.stop());
          audioContext.close();
        };
        
        // Store cleanup function for later use
        (window as any).humeCleanup = cleanup;
        
      } catch (error) {
        console.error('Error setting up audio capture:', error);
        toast.error('Audio setup failed', {
          description: 'Unable to capture audio for voice analysis and conversation.',
          duration: 3000,
        });
      }
    } else {
      // In demo mode, generate mock vocal emotion data
      const vocalDataInterval = setInterval(() => {
        if (checkinState.phase === 'recording') {
          const mockVocalPoint: EmotionDataPoint = {
            timestamp: Date.now(),
            emotions: {
              joy: Math.random() * 0.4 + 0.2,
              sadness: Math.random() * 0.3,
              anger: Math.random() * 0.15,
              fear: Math.random() * 0.2,
              surprise: Math.random() * 0.25,
              disgust: Math.random() * 0.1,
              contempt: Math.random() * 0.05,
            },
            confidence: Math.random() * 0.2 + 0.8,
            source: 'vocal'
          };

          setCheckinState(prev => ({
            ...prev,
            emotionData: [...prev.emotionData, mockVocalPoint]
          }));
        }
      }, 800);
      
      // Store cleanup function for demo mode
      (window as any).humeCleanup = () => {
        if (videoStreamInterval) clearInterval(videoStreamInterval);
        clearInterval(vocalDataInterval);
      };
    }

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

  // Submit emotion data to backend
  const submitEmotionData = async (emotionData: EmotionDataPoint[], transcript: string[]) => {
    try {
      const response = await fetch('/api/checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId: `patient_${Date.now()}`, // Generate temporary patient ID
          transcript: transcript.join('\n'), // Join conversation transcript
          emotionTimeline: emotionData,
          createdAt: new Date(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit data: ${response.status}`);
      }

      const result = await response.json();
      console.log('Emotion data submitted successfully:', result);
      
      toast.success('Data saved', {
        description: 'Your check-in data has been securely stored.',
        duration: 3000,
      });
      
    } catch (error) {
      console.error('Error submitting emotion data:', error);
      toast.error('Save failed', {
        description: 'Unable to save your check-in data. Please try again.',
        duration: 5000,
      });
    }
  };

  // Stop recording function
  const stopRecording = async () => {
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Clean up audio processing
    if ((window as any).humeCleanup) {
      (window as any).humeCleanup();
      delete (window as any).humeCleanup;
    }

    // Submit collected emotion data and conversation transcript to backend
    if (checkinState.emotionData.length > 0 || checkinState.conversationTranscript.length > 0) {
      await submitEmotionData(checkinState.emotionData, checkinState.conversationTranscript);
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

  // Cleanup timer and WebSocket connections on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Clean up audio processing
      if ((window as any).humeCleanup) {
        (window as any).humeCleanup();
        delete (window as any).humeCleanup;
      }
      
      // Close WebSocket connections
      if (checkinState.humeWebSocket) {
        checkinState.humeWebSocket.close();
      }
      if (checkinState.eviWebSocket) {
        checkinState.eviWebSocket.close();
      }
    };
  }, [checkinState.humeWebSocket, checkinState.eviWebSocket]);

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

              {/* Connection Status */}
              {checkinState.webcamReady && !checkinState.webcamError && (
                <div className="text-center space-y-3">
                  {checkinState.isConnecting && (
                    <div className="text-neutral-600 text-sm">
                      <div className="animate-pulse">Connecting to emotion analysis services...</div>
                    </div>
                  )}
                  
                  {!checkinState.isConnecting && checkinState.humeToken && (
                    <div className="space-y-2">
                      {checkinState.humeToken === 'demo-mode' ? (
                        <div className="text-blue-600 text-sm flex items-center justify-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Demo mode ready (mock emotion data)</span>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="text-green-600 text-sm flex items-center justify-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Emotion analysis ready</span>
                          </div>
                          
                          {/* Individual service status */}
                          <div className="flex justify-center space-x-4 text-xs">
                            <div className={`flex items-center space-x-1 ${
                              checkinState.connectionStatus.facial === 'connected' ? 'text-green-600' :
                              checkinState.connectionStatus.facial === 'error' ? 'text-red-600' :
                              checkinState.connectionStatus.facial === 'connecting' ? 'text-yellow-600' :
                              'text-gray-500'
                            }`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${
                                checkinState.connectionStatus.facial === 'connected' ? 'bg-green-500' :
                                checkinState.connectionStatus.facial === 'error' ? 'bg-red-500' :
                                checkinState.connectionStatus.facial === 'connecting' ? 'bg-yellow-500' :
                                'bg-gray-400'
                              }`}></div>
                              <span>Facial</span>
                            </div>
                            
                            <div className={`flex items-center space-x-1 ${
                              checkinState.connectionStatus.vocal === 'connected' ? 'text-green-600' :
                              checkinState.connectionStatus.vocal === 'error' ? 'text-red-600' :
                              checkinState.connectionStatus.vocal === 'connecting' ? 'text-yellow-600' :
                              'text-gray-500'
                            }`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${
                                checkinState.connectionStatus.vocal === 'connected' ? 'bg-green-500' :
                                checkinState.connectionStatus.vocal === 'error' ? 'bg-red-500' :
                                checkinState.connectionStatus.vocal === 'connecting' ? 'bg-yellow-500' :
                                'bg-gray-400'
                              }`}></div>
                              <span>Voice AI</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {!checkinState.isConnecting && !checkinState.humeToken && (
                    <div className="text-red-600 text-sm flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>Connection failed - emotion analysis unavailable</span>
                    </div>
                  )}
                </div>
              )}

              {/* Start Button - only show when webcam is ready and connections are established */}
              {checkinState.webcamReady && !checkinState.webcamError && (
                <Button 
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg disabled:bg-neutral-400"
                  onClick={startRecording}
                  disabled={
                    checkinState.phase !== 'idle' || 
                    checkinState.isConnecting || 
                    !checkinState.humeToken
                  }
                >
                  {checkinState.isConnecting ? 'Connecting...' : 'Start 60-Second Check-in'}
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
                  <p className="text-neutral-600 mb-2">
                    Please describe how you've been feeling
                  </p>
                  {checkinState.humeToken !== 'demo-mode' && (
                    <p className="text-sm text-blue-600">
                      💬 AI assistant is listening and ready to help you practice
                    </p>
                  )}
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

                {/* Emotion Analysis Status */}
                {checkinState.emotionData.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="text-center">
                      <div className="text-sm text-green-700 font-medium mb-1">
                        Emotion Analysis Active
                      </div>
                      <div className="text-xs text-green-600">
                        {checkinState.emotionData.filter(d => d.source === 'facial').length} facial readings, {' '}
                        {checkinState.emotionData.filter(d => d.source === 'vocal').length} vocal readings
                      </div>
                    </div>
                  </div>
                )}
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
            <p>Debug: Hume Token: {checkinState.humeToken ? 'Available' : 'None'}</p>
            <p>Debug: Expression WS: {
              checkinState.humeToken === 'demo-mode' 
                ? 'Demo Mode' 
                : checkinState.humeWebSocket?.readyState === WebSocket.OPEN 
                  ? 'Connected' 
                  : 'Disconnected'
            }</p>
            <p>Debug: EVI WS: {
              checkinState.humeToken === 'demo-mode' 
                ? 'Demo Mode' 
                : checkinState.eviWebSocket?.readyState === WebSocket.OPEN 
                  ? 'Connected' 
                  : 'Disconnected'
            }</p>
            <p>Debug: Emotion Data Points: {checkinState.emotionData.length}</p>
            {checkinState.emotionData.length > 0 && (
              <div className="mt-2">
                <p>Latest Emotions:</p>
                {checkinState.emotionData.slice(-3).map((point, index) => (
                  <div key={index} className="ml-2 text-xs">
                    <span className="font-mono">
                      {point.source}: Joy:{point.emotions.joy.toFixed(2)} 
                      Sad:{point.emotions.sadness.toFixed(2)} 
                      Anger:{point.emotions.anger.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </>
  );
}