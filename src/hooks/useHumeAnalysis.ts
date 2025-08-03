import { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';

// The URL of the analysis server you built
const ANALYSIS_SERVER_URL = 'http://localhost:3003';

export function useHumeAnalysis() {
  const [isConnected, setIsConnected] = useState(false);
  const [analysisData, setAnalysisData] = useState<unknown>(null);
  const [isProcessing, setIsProcessing] = useState(false); // To prevent sending frames too fast
  const [roomJoined, setRoomJoined] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  // This effect runs once to set up the connection and listeners
  useEffect(() => {
    console.log('[Hume Hook] Attempting to connect to:', ANALYSIS_SERVER_URL);
    const socket = io(ANALYSIS_SERVER_URL, {
      transports: ['websocket', 'polling'], // Try both transports
      timeout: 20000, // 20 second timeout
      forceNew: true // Force a new connection
    });
    socketRef.current = socket;

    // --- Listeners for events FROM the server ---
    socket.on('connect', () => {
      console.log(`[Hume Hook] Connected to analysis server: ${socket.id}`);
      setIsConnected(true);
    });

    socket.on('connect_error', (error) => {
      console.error('[Hume Hook] Connection error:', error);
      console.error('[Hume Hook] Error type:', error.type);
      console.error('[Hume Hook] Error description:', error.description);
      toast.error(`Failed to connect to analysis server: ${error.message}`);
    });

    socket.on('disconnect', (reason) => {
      console.log('[Hume Hook] Disconnected from analysis server. Reason:', reason);
      setIsConnected(false);
    });

    socket.on('room-joined', (data) => {
      console.log(`[Hume Hook] Joined room: ${data.roomName}`);
      setRoomJoined(true);
    });

    socket.on('analysis-started', () => {
      toast.success('Analysis session started.');
    });

    socket.on('emotion-data', (data) => {
      console.log('[Hume Hook] Received emotion data:', data);
      setAnalysisData(data); // Update state with the new analysis
      setIsProcessing(false); // Mark processing as finished, ready for the next frame
    });

    socket.on('analysis-error', (error) => {
      console.error('[Hume Hook] Analysis Error:', error.message);
      toast.error('Analysis Error', { description: error.message });
      setIsProcessing(false); // Also unlock on error
    });

    socket.on('disconnect', () => {
      console.log('[Hume Hook] Disconnected from analysis server.');
      setIsConnected(false);
    });

    // --- Cleanup on unmount ---
    return () => {
      if (socket.connected) {
        socket.emit('stop-analysis');
      }
      socket.disconnect();
    };
  }, []);

  // --- Functions to send events TO the server ---
  const joinRoom = useCallback((roomName: string, userType: 'doctor' | 'patient') => {
    console.log('[Hume Hook] Attempting to join room:', { roomName, userType, connected: socketRef.current?.connected });
    if (socketRef.current?.connected) {
      socketRef.current.emit('join-room', { roomName, userType });
    } else {
      console.warn('[Hume Hook] Cannot join room - socket not connected');
    }
  }, []);

  const startAnalysis = useCallback(() => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('start-analysis');
    }
  }, []);

  const analyzeFrame = useCallback((imageData: string) => {
    // Only send a new frame if we are connected and not already waiting for a reply
    if (socketRef.current?.connected && !isProcessing) {
      console.log('[Hume Hook] Sending frame for analysis...');
      setIsProcessing(true); // Mark as busy
      socketRef.current.emit('analyze-frame', {
        type: 'image',
        imageData: imageData,
      });
    } else {
      console.log('[Hume Hook] Cannot send frame - connected:', socketRef.current?.connected, 'processing:', isProcessing);
    }
  }, [isProcessing]);

  return { isConnected, analysisData, roomJoined, joinRoom, startAnalysis, analyzeFrame };
}