"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  PhoneOff,
  Settings,
  MoreVertical,
  Users,
  MessageSquare,
  Share,
  Circle,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Twilio Video imports
import {
  connect,
  Room,
  LocalParticipant,
  RemoteParticipant,
  LocalTrack,
  RemoteTrack,
} from "twilio-video";

interface CallState {
  isConnecting: boolean;
  isConnected: boolean;
  isMuted: boolean;
  isVideoOn: boolean;
  audioPermission: "granted" | "denied" | "pending";
  videoPermission: "granted" | "denied" | "pending";
  room: Room | null;
  localParticipant: LocalParticipant | null;
  remoteParticipants: Map<string, RemoteParticipant>;
  callDuration: number;
  roomName: string;
  participantName: string;
  isJoining: boolean;
}

const VideoCallPage = () => {
  const searchParams = useSearchParams();
  const roomNameFromUrl = searchParams.get("room");

  const [callState, setCallState] = useState<CallState>({
    isConnecting: false,
    isConnected: false,
    isMuted: false,
    isVideoOn: true,
    audioPermission: "pending",
    videoPermission: "pending",
    room: null,
    localParticipant: null,
    remoteParticipants: new Map(),
    callDuration: 0,
    roomName: roomNameFromUrl || "",
    participantName: "",
    isJoining: false,
  });

  const [localRoomName, setLocalRoomName] = useState(roomNameFromUrl || "");
  const [participantName, setParticipantName] = useState("");

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Request permissions separately to avoid crashes
  const requestAudioPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setCallState((prev) => ({ ...prev, audioPermission: "granted" }));
      return true;
    } catch (error) {
      console.error("Audio permission denied:", error);
      setCallState((prev) => ({ ...prev, audioPermission: "denied" }));
      toast.error("Audio permission denied", {
        description: "Please allow microphone access to join the call.",
      });
      return false;
    }
  };

  const requestVideoPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((track) => track.stop());
      setCallState((prev) => ({ ...prev, videoPermission: "granted" }));
      return true;
    } catch (error) {
      console.error("Video permission denied:", error);
      setCallState((prev) => ({ ...prev, videoPermission: "denied" }));
      toast.error("Video permission denied", {
        description: "Please allow camera access to join the call.",
      });
      return false;
    }
  };

  // Get Twilio token from backend
  const getTwilioToken = async (
    roomName: string,
    participantName: string
  ): Promise<string> => {
    try {
      const response = await fetch("/api/twilio/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomName, participantName }),
      });

      if (!response.ok) {
        throw new Error("Failed to get token");
      }

      const data = await response.json();
      return data.token;
    } catch (error) {
      console.error("Error getting Twilio token:", error);
      throw new Error("Unable to get access token");
    }
  };

  // Connect to Twilio room
  const connectToRoom = async () => {
    // Allow connection even if one permission is denied
    if (
      callState.audioPermission === "denied" &&
      callState.videoPermission === "denied"
    ) {
      toast.error("Permissions required", {
        description:
          "Please grant at least audio or video permission to join the call.",
      });
      return;
    }

    setCallState((prev) => ({ ...prev, isConnecting: true }));

    try {
      const token = await getTwilioToken(
        callState.roomName,
        callState.participantName
      );

      const room = await connect(token, {
        name: callState.roomName,
        audio: callState.audioPermission === "granted",
        video: callState.videoPermission === "granted",
        bandwidthProfile: {
          video: {
            mode: "collaboration",
            dominantSpeakerPriority: "standard",
            renderDimensions: {
              high: { width: 1280, height: 720 },
              standard: { width: 640, height: 480 },
              low: { width: 320, height: 240 },
            },
          },
        },
      });

      setCallState((prev) => ({
        ...prev,
        room,
        localParticipant: room.localParticipant,
        isConnecting: false,
        isConnected: true,
      }));

      // Attach local tracks
      room.localParticipant.videoTracks.forEach((publication) => {
        if (publication.track && localVideoRef.current) {
          publication.track.attach(localVideoRef.current);
        }
      });

      // Handle remote participants
      room.on("participantConnected", (participant: RemoteParticipant) => {
        setCallState((prev) => ({
          ...prev,
          remoteParticipants: new Map(
            prev.remoteParticipants.set(participant.sid, participant)
          ),
        }));

        participant.on("trackSubscribed", (track: RemoteTrack) => {
          if (track.kind === "video" && remoteVideoRef.current) {
            track.attach(remoteVideoRef.current);
          }
        });
      });

      room.on("participantDisconnected", (participant: RemoteParticipant) => {
        setCallState((prev) => {
          const newParticipants = new Map(prev.remoteParticipants);
          newParticipants.delete(participant.sid);
          return { ...prev, remoteParticipants: newParticipants };
        });
      });

      toast.success("Connected to room", {
        description: `Joined ${callState.roomName} as ${callState.participantName}`,
      });
    } catch (error) {
      console.error("Failed to connect:", error);
      setCallState((prev) => ({
        ...prev,
        isConnecting: false,
        isJoining: false,
      }));

      // Check if it's a permission error
      if (error instanceof Error && error.message.includes("permission")) {
        toast.error("Permission error", {
          description: "Please check your microphone and camera permissions.",
        });
      } else {
        toast.error("Connection failed", {
          description: "Unable to join the video call. Please try again.",
        });
      }
    }
  };

  // Control functions
  const toggleMute = async () => {
    if (!callState.room) return;

    const audioTracks = Array.from(
      callState.room.localParticipant.audioTracks.values()
    );
    const isCurrentlyMuted = audioTracks.every(
      (track) => !track.track.isEnabled
    );

    audioTracks.forEach((publication) => {
      if (publication.track) {
        publication.track.enable(!isCurrentlyMuted);
      }
    });

    setCallState((prev) => ({ ...prev, isMuted: !isCurrentlyMuted }));
    toast(isCurrentlyMuted ? "Microphone unmuted" : "Microphone muted");
  };

  const toggleVideo = async () => {
    if (!callState.room) return;

    const videoTracks = Array.from(
      callState.room.localParticipant.videoTracks.values()
    );
    const isCurrentlyVideoOn = videoTracks.every(
      (track) => track.track.isEnabled
    );

    videoTracks.forEach((publication) => {
      if (publication.track) {
        publication.track.enable(!isCurrentlyVideoOn);
      }
    });

    setCallState((prev) => ({ ...prev, isVideoOn: !isCurrentlyVideoOn }));
    toast(isCurrentlyVideoOn ? "Camera turned off" : "Camera turned on");
  };

  const endCall = () => {
    if (callState.room) {
      callState.room.disconnect();
    }
    setCallState((prev) => ({
      ...prev,
      isConnected: false,
      room: null,
      localParticipant: null,
      remoteParticipants: new Map(),
      isJoining: false,
    }));
    toast.success("Call ended");
  };

  const copyRoomLink = () => {
    const link = `${
      window.location.origin
    }/video-call?room=${encodeURIComponent(callState.roomName)}`;
    navigator.clipboard.writeText(link);
    toast.success("Room link copied to clipboard");
  };

  const handleJoinCall = () => {
    if (!localRoomName.trim() || !participantName.trim()) {
      return;
    }
    setCallState((prev) => ({
      ...prev,
      roomName: localRoomName,
      participantName: participantName,
      isJoining: true,
    }));
  };

  const handleCreateCall = () => {
    const newRoomName = `room-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    setLocalRoomName(newRoomName);
  };

  // Start call duration timer
  useEffect(() => {
    if (callState.isConnected) {
      timerRef.current = setInterval(() => {
        setCallState((prev) => ({
          ...prev,
          callDuration: prev.callDuration + 1,
        }));
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [callState.isConnected]);

  // Request permissions when joining
  useEffect(() => {
    if (callState.isJoining) {
      const initializePermissions = async () => {
        await requestAudioPermission();
        await requestVideoPermission();
      };
      initializePermissions();

      // Add a timeout to prevent stuck states
      const timeout = setTimeout(() => {
        if (
          callState.isJoining &&
          !callState.isConnected &&
          !callState.isConnecting
        ) {
          setCallState((prev) => ({ ...prev, isJoining: false }));
          toast.error("Connection timeout", {
            description: "Please try joining the call again.",
          });
        }
      }, 10000); // 10 second timeout

      return () => clearTimeout(timeout);
    }
  }, [callState.isJoining]);

  // Auto-connect when at least one permission is granted
  useEffect(() => {
    if (
      callState.isJoining &&
      (callState.audioPermission === "granted" ||
        callState.videoPermission === "granted") &&
      !callState.isConnected &&
      !callState.isConnecting
    ) {
      connectToRoom();
    }
  }, [
    callState.audioPermission,
    callState.videoPermission,
    callState.isJoining,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (callState.room) {
        callState.room.disconnect();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [callState.room]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Show joining interface
  if (!callState.isJoining && !callState.isConnected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-8 bg-gray-50">
        <div className="w-full max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold">
                Join Video Call
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Room Name</label>
                <Input
                  value={localRoomName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setLocalRoomName(e.target.value)
                  }
                  placeholder="Enter room name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Your Name</label>
                <Input
                  value={participantName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setParticipantName(e.target.value)
                  }
                  placeholder="Enter your name"
                />
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={handleCreateCall}
                  variant="outline"
                  className="flex-1"
                >
                  Create New Room
                </Button>
                <Button
                  onClick={handleJoinCall}
                  disabled={!localRoomName.trim() || !participantName.trim()}
                  className="flex-1"
                >
                  Join Call
                </Button>
              </div>

              {localRoomName && (
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700 mb-2">Share this link:</p>
                  <p className="text-xs text-blue-600 break-all">
                    {typeof window !== "undefined"
                      ? `${
                          window.location.origin
                        }/video-call?room=${encodeURIComponent(localRoomName)}`
                      : ""}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show connecting state
  if (!callState.isConnected && callState.isConnecting) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Card className="p-8 text-center bg-gray-800 text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-xl font-bold mb-2">Connecting to call...</h2>
          <p className="text-gray-400">
            Please wait while we establish your connection
          </p>
        </Card>
      </div>
    );
  }

  // Show call ended state
  if (!callState.isConnected && !callState.isConnecting) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Card className="p-8 text-center bg-gray-800 text-white max-w-md">
          <h2 className="text-2xl font-bold mb-4">Call Ended</h2>
          <p className="text-gray-400 mb-6">
            The video call has been terminated.
          </p>
          <Button onClick={() => (window.location.href = "/video-call")}>
            Start New Call
          </Button>
        </Card>
      </div>
    );
  }

  // Show video call interface
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-800/50 backdrop-blur-sm">
        <div className="flex items-center space-x-4">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-white font-medium">Live Call</span>
          <span className="text-gray-400 text-sm">
            Room: {callState.roomName}
          </span>
          <span className="text-gray-400 text-sm">
            You: {callState.participantName}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-gray-700"
          >
            <Users className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-gray-700"
          >
            <MessageSquare className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-gray-700"
            onClick={copyRoomLink}
          >
            <Share className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-gray-700"
          >
            <Circle className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 flex items-center justify-center p-4 relative">
        <div className="relative w-full max-w-4xl aspect-video bg-gray-800 rounded-lg overflow-hidden">
          {/* Remote Video (Main Screen) */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />

          {/* Local Video (Picture-in-Picture) */}
          <div className="absolute top-4 right-4 w-48 h-36 bg-gray-700 rounded-lg overflow-hidden">
            {callState.videoPermission === "granted" ? (
              <>
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {!callState.isVideoOn && (
                  <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                    <VideoOff className="w-8 h-8 text-white/60" />
                  </div>
                )}
              </>
            ) : (
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                <VideoOff className="w-8 h-8 text-white/60" />
              </div>
            )}
          </div>

          {/* Connection Status */}
          <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
            <span className="text-white text-sm">HD</span>
          </div>

          {/* Call Duration */}
          <div className="absolute top-4 left-20 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
            <span className="text-white text-sm">
              {formatDuration(callState.callDuration)}
            </span>
          </div>

          {/* Network Status */}
          <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-white text-sm">Good</span>
            </div>
          </div>

          {/* Remote Participant Info */}
          {callState.remoteParticipants.size === 0 && (
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-12 h-12 text-white/60" />
                </div>
                <p className="text-lg font-medium">
                  Waiting for others to join...
                </p>
                <p className="text-sm text-white/60 mt-1">
                  Share the room link to invite participants
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex items-center justify-center p-6 bg-gray-800/50 backdrop-blur-sm">
        <div className="flex items-center space-x-4">
          {/* Mute Button */}
          <Button
            onClick={toggleMute}
            size="lg"
            variant={
              callState.isMuted || callState.audioPermission === "denied"
                ? "destructive"
                : "secondary"
            }
            className={`rounded-full w-14 h-14 ${
              callState.isMuted || callState.audioPermission === "denied"
                ? "bg-red-500 hover:bg-red-600"
                : "bg-white/20 hover:bg-white/30"
            }`}
            disabled={callState.audioPermission === "denied"}
          >
            {callState.isMuted || callState.audioPermission === "denied" ? (
              <MicOff className="w-6 h-6 text-white" />
            ) : (
              <Mic className="w-6 h-6 text-white" />
            )}
          </Button>

          {/* Video Toggle Button */}
          <Button
            onClick={toggleVideo}
            size="lg"
            variant={
              !callState.isVideoOn || callState.videoPermission === "denied"
                ? "destructive"
                : "secondary"
            }
            className={`rounded-full w-14 h-14 ${
              !callState.isVideoOn || callState.videoPermission === "denied"
                ? "bg-red-500 hover:bg-red-600"
                : "bg-white/20 hover:bg-white/30"
            }`}
            disabled={callState.videoPermission === "denied"}
          >
            {callState.isVideoOn && callState.videoPermission === "granted" ? (
              <Video className="w-6 h-6 text-white" />
            ) : (
              <VideoOff className="w-6 h-6 text-white" />
            )}
          </Button>

          {/* End Call Button */}
          <Button
            onClick={endCall}
            size="lg"
            variant="destructive"
            className="rounded-full w-16 h-16 bg-red-500 hover:bg-red-600"
          >
            <PhoneOff className="w-7 h-7 text-white" />
          </Button>

          {/* Settings Button */}
          <Button
            size="lg"
            variant="secondary"
            className="rounded-full w-14 h-14 bg-white/20 hover:bg-white/30"
          >
            <Settings className="w-6 h-6 text-white" />
          </Button>

          {/* More Options Button */}
          <Button
            size="lg"
            variant="secondary"
            className="rounded-full w-14 h-14 bg-white/20 hover:bg-white/30"
          >
            <MoreVertical className="w-6 h-6 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoCallPage;
