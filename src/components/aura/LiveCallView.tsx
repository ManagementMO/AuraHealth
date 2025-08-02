'use client';

import { useEffect, useState, useRef } from 'react';
import Video, { LocalVideoTrack, RemoteParticipant, Room } from 'twilio-video';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';

// (Participant component can remain the same as the previous version)
function Participant({ participant }: { participant: any }) { /* ... */ }

export function LiveCallView({ roomName, userIdentity }: { roomName: string, userIdentity: 'doctor' | 'patient' }) {
  const [room, setRoom] = useState<Room | null>(null);
  const [participants, setParticipants] = useState<RemoteParticipant[]>([]);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const socketRef = useRef<Socket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    // Connect to our custom Analysis Relay Server
    socketRef.current = io('http://localhost:3001');

    socketRef.current.on('connect', () => {
      console.log('Connected to analysis relay server.');
      socketRef.current?.emit('join-call-room', { roomName, userType: userIdentity });
    });

    // DOCTOR: Listen for analysis updates
    if (userIdentity === 'doctor') {
      socketRef.current.on('analysis-update-from-server', (data) => {
        setAnalysisData(data);
      });
    }

    // Connect to Twilio
    const connectToTwilio = async () => {
      // ... (Twilio token fetching logic remains the same)
      const response = await fetch('/api/twilio/token', { /* ... */ });
      const { token } = await response.json();
      const twilioRoom = await Video.connect(token, { /* ... */ });
      
      setRoom(twilioRoom);
      // ... (participant connection logic remains the same)

      // PATIENT: Start streaming media to our server
      if (userIdentity === 'patient') {
        const localVideoTrack = Array.from(twilioRoom.localParticipant.videoTracks.values())[0]?.track;
        if (localVideoTrack) {
          startStreamingPatientMedia(localVideoTrack);
        }
      }
    };

    connectToTwilio();

    return () => {
      room?.disconnect();
      socketRef.current?.disconnect();
      mediaRecorderRef.current?.stop();
    };
  }, [roomName, userIdentity]);

  // This function is ONLY for the patient
  const startStreamingPatientMedia = (videoTrack: LocalVideoTrack) => {
    // Create a new MediaStream from the Twilio video track
    const stream = new MediaStream([videoTrack.mediaStreamTrack]);
    mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp8' });

    mediaRecorderRef.current.ondataavailable = async (event) => {
      if (event.data.size > 0 && socketRef.current) {
        const reader = new FileReader();
        reader.readAsDataURL(event.data);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          // Send the raw base64 data (without the 'data:...' prefix)
          socketRef.current?.emit('stream-media-to-server', { 
            videoChunk: base64data.split(',')[1] 
          });
        };
      }
    };

    // Send a chunk of video data every 250ms for real-time analysis
    mediaRecorderRef.current.start(250);
    console.log("MediaRecorder started for patient streaming.");
  };

  return (
    <div className="flex h-screen bg-neutral-900 text-white">
      {/* Video Call Area (remains the same) */}
      <div className="flex-grow p-4"> {/* ... */} </div>

      {/* Doctor's Empathy Dashboard (UI to display analysisData) */}
      {userIdentity === 'doctor' && (
        <div className="w-80 bg-neutral-800 p-4">
          <h2 className="text-lg font-bold mb-4">Empathy Dashboard</h2>
          {analysisData?.face ? (
            <div className="space-y-4 text-sm">
              <h3 className="font-semibold">Facial Expression</h3>
              {analysisData.face.predictions[0].emotions
                .sort((a: any, b: any) => b.score - a.score)
                .slice(0, 5) // Show top 5 emotions
                .map((emo: any) => (
                  <p key={emo.name}>{emo.name}: {emo.score.toFixed(2)}</p>
                ))
              }
            </div>
          ) : (
            <p className="text-neutral-400">Awaiting patient analysis...</p>
          )}
        </div>
      )}
    </div>
  );
}