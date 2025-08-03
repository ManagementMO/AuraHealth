"use client";

import React, { useState, useEffect, useRef, RefObject } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
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
  ArrowLeft,
  Shield,
  Play,
  UserCheck,
  ArrowRight,
  Brain,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Twilio Video imports
import {
  connect,
  Room,
  LocalParticipant,
  RemoteParticipant,
  LocalTrack,
  RemoteTrack,
} from "twilio-video";

// Face Analysis Widget
import { FaceWidgets } from "@/components/aura/FaceWidget";
import { useDataAggregation } from "@/contexts/DataAggregationContext";

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
  currentStep: "initial" | "setup" | "call";
  isCreatingRoom: boolean;
}

const VideoCallPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const roomNameFromUrl = searchParams.get("room");
  const { startRecording, stopRecording, isRecording, getDataSummary } =
    useDataAggregation();

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
    currentStep: roomNameFromUrl ? "setup" : "initial",
    isCreatingRoom: false,
  });

  const [localRoomName, setLocalRoomName] = useState(roomNameFromUrl || "");
  const [participantName, setParticipantName] = useState("");
  const [analysisVideoElement, setAnalysisVideoElement] =
    useState<HTMLVideoElement | null>(null);

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
      console.log("Audio permission denied:", error);
      setCallState((prev) => ({ ...prev, audioPermission: "denied" }));
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
      console.log("Video permission denied:", error);
      setCallState((prev) => ({ ...prev, videoPermission: "denied" }));
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
      console.log("Error getting Twilio token:", error);
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
          console.log("Local video track attached");
        }
      });

      // Handle local track publications
      room.localParticipant.on("trackPublished", (publication) => {
        console.log("Local track published:", publication.trackName);
        if (
          publication.track &&
          publication.track.kind === "video" &&
          localVideoRef.current
        ) {
          publication.track.attach(localVideoRef.current);
        }
      });

      room.localParticipant.on("trackUnpublished", (publication) => {
        console.log("Local track unpublished:", publication.trackName);
      });

      // Handle existing participants in the room
      room.participants.forEach((participant: RemoteParticipant) => {
        console.log("Existing participant found:", participant.identity);
        setCallState((prev) => ({
          ...prev,
          remoteParticipants: new Map(
            prev.remoteParticipants.set(participant.sid, participant)
          ),
        }));

        // Subscribe to existing tracks
        participant.tracks.forEach((publication) => {
          if (publication.isSubscribed) {
            const track = publication.track;
            if (track && track.kind === "video" && remoteVideoRef.current) {
              track.attach(remoteVideoRef.current);
            }
          }
        });

        // Subscribe to new tracks
        participant.on("trackSubscribed", (track: RemoteTrack) => {
          console.log(
            "Track subscribed from existing participant:",
            track.kind,
            track.name
          );
          if (track.kind === "video" && remoteVideoRef.current) {
            track.attach(remoteVideoRef.current);
          }
        });

        participant.on("trackUnsubscribed", (track: RemoteTrack) => {
          console.log(
            "Track unsubscribed from existing participant:",
            track.kind,
            track.name
          );
          if (track.kind === "video" && remoteVideoRef.current) {
            track.detach(remoteVideoRef.current);
          }
        });
      });

      // Handle remote participants
      room.on("participantConnected", (participant: RemoteParticipant) => {
        console.log("Participant connected:", participant.identity);
        setCallState((prev) => ({
          ...prev,
          remoteParticipants: new Map(
            prev.remoteParticipants.set(participant.sid, participant)
          ),
        }));

        // Subscribe to existing tracks
        participant.tracks.forEach((publication) => {
          if (publication.isSubscribed) {
            const track = publication.track;
            if (track && track.kind === "video" && remoteVideoRef.current) {
              track.attach(remoteVideoRef.current);
            }
          }
        });

        // Subscribe to new tracks
        participant.on("trackSubscribed", (track: RemoteTrack) => {
          console.log("Track subscribed:", track.kind, track.name);
          if (track.kind === "video" && remoteVideoRef.current) {
            track.attach(remoteVideoRef.current);
          }
        });

        participant.on("trackUnsubscribed", (track: RemoteTrack) => {
          console.log("Track unsubscribed:", track.kind, track.name);
          if (track.kind === "video" && remoteVideoRef.current) {
            track.detach(remoteVideoRef.current);
          }
        });
      });

      room.on("participantDisconnected", (participant: RemoteParticipant) => {
        console.log("Participant disconnected:", participant.identity);
        setCallState((prev) => {
          const newParticipants = new Map(prev.remoteParticipants);
          newParticipants.delete(participant.sid);

          // If no more remote participants, show call ended state
          if (newParticipants.size === 0) {
            // Keep connected as false to show call ended state
            return {
              ...prev,
              remoteParticipants: newParticipants,
              isConnected: false,
            };
          }

          return { ...prev, remoteParticipants: newParticipants };
        });

        // Clear the remote video when participant disconnects
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = null;
        }
      });

      // Start data aggregation when call connects
      startRecording();
    } catch (error) {
      console.log("Failed to connect:", error);
      setCallState((prev) => ({
        ...prev,
        isConnecting: false,
        isJoining: false,
      }));

      // Check if it's a permission error
      if (error instanceof Error && error.message.includes("permission")) {
        console.log(
          "Permission error - please check microphone and camera permissions"
        );
      } else {
        console.log("Connection failed - unable to join the video call");
      }
    }
  };

  // Control functions
  const toggleMute = async () => {
    if (callState.currentStep === "setup") {
      // Toggle mute in setup mode
      setCallState((prev) => ({ ...prev, isMuted: !prev.isMuted }));
      return;
    }

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
  };

  const toggleVideo = async () => {
    if (callState.currentStep === "setup") {
      // Toggle video in setup mode
      setCallState((prev) => ({ ...prev, isVideoOn: !prev.isVideoOn }));
      return;
    }

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
  };

  const endCall = () => {
    // Stop data aggregation
    stopRecording();

    // Get data summary before stopping
    const dataSummary = getDataSummary();
    console.log("Call ended. Data summary:", dataSummary);

    if (dataSummary.totalPoints > 0) {
      console.log(
        `Call ended. Collected ${
          dataSummary.totalPoints
        } data points over ${Math.round(dataSummary.duration / 1000)}s`
      );
      
      // Log top emotions for immediate feedback
      if (dataSummary.topEmotions.length > 0) {
        console.log("Top patient emotions during consultation:");
        dataSummary.topEmotions.forEach((emotion, index) => {
          console.log(`${index + 1}. ${emotion.name}: ${Math.round(emotion.averageScore * 100)}%`);
        });
      }
    } else {
      console.warn("No sentiment data was collected during the consultation");
    }

    // Clean up analysis video element
    setAnalysisVideoElement(null);

    if (callState.room) {
      callState.room.disconnect();
    }

    // Always show call ended screen first, regardless of user type
    setCallState((prev) => ({
      ...prev,
      isConnected: false,
      room: null,
      localParticipant: null,
      remoteParticipants: new Map(),
      isJoining: false,
      // Keep currentStep as "call" to show call ended state
      // Keep other properties like isCreatingRoom to differentiate UI
    }));

    console.log("Call ended");
  };

  const copyRoomLink = () => {
    const link = `${
      window.location.origin
    }/video-call?room=${encodeURIComponent(callState.roomName)}`;
    navigator.clipboard.writeText(link);
    console.log("Room link copied to clipboard");
  };

  const handleJoinCall = () => {
    if (!localRoomName.trim() || !participantName.trim()) {
      return;
    }
    // Update URL to match the room
    const newUrl = `${
      window.location.origin
    }/video-call?room=${encodeURIComponent(localRoomName)}`;
    window.history.pushState({}, "", newUrl);

    setCallState((prev) => ({
      ...prev,
      roomName: localRoomName,
      participantName: participantName,
      currentStep: "setup",
      isCreatingRoom: false,
    }));
  };

  const handleCreateCall = () => {
    const newRoomName = `room-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    setLocalRoomName(newRoomName);

    // Update URL to match the room
    const newUrl = `${
      window.location.origin
    }/video-call?room=${encodeURIComponent(newRoomName)}`;
    window.history.pushState({}, "", newUrl);

    setCallState((prev) => ({
      ...prev,
      roomName: newRoomName,
      currentStep: "setup",
      isCreatingRoom: true,
    }));
  };

  const handleBackToInitial = () => {
    // Clean up video preview stream if active
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      localVideoRef.current.srcObject = null;
    }

    // Clear URL parameters when going back to initial
    const newUrl = `${window.location.origin}/video-call`;
    window.history.pushState({}, "", newUrl);

    setCallState((prev) => ({
      ...prev,
      currentStep: "initial",
      isCreatingRoom: false,
      audioPermission: "pending",
      videoPermission: "pending",
      roomName: "",
      participantName: "",
    }));

    // Reset local state as well
    setLocalRoomName("");
    setParticipantName("");
  };

  const handleJoinFromSetup = () => {
    if (!callState.participantName.trim()) {
      return;
    }
    setCallState((prev) => ({
      ...prev,
      isJoining: true,
      currentStep: "call",
    }));
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

  // Request permissions when in setup step
  useEffect(() => {
    if (callState.currentStep === "setup") {
      const initializePermissions = async () => {
        await requestAudioPermission();
        await requestVideoPermission();
      };
      initializePermissions();
    }
  }, [callState.currentStep]);

  // Handle video preview in setup step
  useEffect(() => {
    if (
      callState.currentStep === "setup" &&
      callState.videoPermission === "granted"
    ) {
      const startVideoPreview = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.log("Error starting video preview:", error);
        }
      };
      startVideoPreview();

      // Cleanup function
      return () => {
        if (localVideoRef.current && localVideoRef.current.srcObject) {
          const stream = localVideoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach((track) => track.stop());
          localVideoRef.current.srcObject = null;
        }
      };
    }
  }, [callState.currentStep, callState.videoPermission]);

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
          console.log(
            "Connection timeout - please try joining the call again"
          );
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

  // Show initial interface
  if (callState.currentStep === "initial") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        {/* Navigation Header */}
        <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-gradient-to-br from-rose-100 to-pink-100 border border-rose-200/50 rounded-xl flex items-center justify-center shadow-sm">
                  <Image src="/favicon.ico" alt="SentimentMD" width={20} height={20} className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xl font-bold text-slate-900">
                    SentimentMD
                  </span>
                  <div className="text-xs text-slate-500 -mt-0.5">
                    Video Consultation
                  </div>
                </div>
              </div>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <a href="/" className="flex items-center space-x-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Dashboard</span>
                </a>
              </Button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-2xl">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-slate-900 mb-4">
                Start Your Consultation
              </h1>
              <p className="text-xl text-slate-600 max-w-lg mx-auto leading-relaxed">
                Connect securely with healthcare providers or join an existing
                consultation room
              </p>
            </div>

            {/* Action Cards */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Create New Room Card */}
              <Card
                className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-teal-50 hover:shadow-2xl transition-all duration-300 group cursor-pointer"
                onClick={handleCreateCall}
              >
                <CardContent className="p-8">
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-600 rounded-xl mb-2 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Play className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">
                      Start New Room
                    </h3>
                    <p className="text-slate-600">
                      Create a new consultation room and invite participants
                    </p>
                    <div className="pt-2">
                      <div className="inline-flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
                        <span>Create Room</span>
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Join Existing Room Card */}
              <Card className="border-0 shadow-xl bg-white hover:shadow-2xl transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl mb-2 shadow-lg">
                        <UserCheck className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">
                        Join Room
                      </h3>
                      <p className="text-slate-600 text-sm">
                        Enter room details to join an existing consultation
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 block">
                          Room Name
                        </label>
                        <Input
                          value={localRoomName}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setLocalRoomName(e.target.value)
                          }
                          placeholder="room-abc123..."
                          className="h-11 text-base border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 block">
                          Your Name
                        </label>
                        <Input
                          value={participantName}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setParticipantName(e.target.value)
                          }
                          placeholder="Dr. Smith / John Doe"
                          className="h-11 text-base border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                        />
                      </div>

                      <Button
                        onClick={handleJoinCall}
                        disabled={
                          !localRoomName.trim() || !participantName.trim()
                        }
                        className="w-full h-11 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <UserCheck className="w-4 h-4 mr-2" />
                        Join Consultation
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show setup interface (Google Meet-style)
  if (callState.currentStep === "setup") {
    return (
      <div className="h-screen bg-slate-900 flex flex-col overflow-hidden">
        {/* Simple Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-700 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-rose-200/20 to-pink-200/20 border border-rose-300/30 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <Image src="/favicon.ico" alt="SentimentMD" width={16} height={16} className="w-4 h-4" />
            </div>
            <span className="text-white font-medium">SentimentMD</span>
          </div>
          <Button
            onClick={handleBackToInitial}
            variant="ghost"
            size="sm"
            className="text-slate-300 hover:text-white hover:bg-slate-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-4 py-4 min-h-0">
          <div className="w-full max-w-5xl h-full max-h-full">
            <div className="grid lg:grid-cols-2 gap-6 items-center h-full">
              {/* Left Side - Video Preview */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative inline-block mb-4">
                  <div className="relative rounded-3xl overflow-hidden bg-slate-800 border border-slate-700 shadow-2xl w-full max-w-md aspect-video">
                    {callState.videoPermission === "granted" ? (
                      <>
                        <video
                          ref={localVideoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover"
                          style={{ transform: "scaleX(-1)" }}
                        />
                        {!callState.isVideoOn && (
                          <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                            <div className="text-center text-white">
                              <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3">
                                <VideoOff className="w-8 h-8 text-slate-400" />
                              </div>
                              <p className="text-base font-medium text-slate-300">
                                Camera is off
                              </p>
                            </div>
                          </div>
                        )}
                      </>
                    ) : callState.videoPermission === "denied" ? (
                      <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3">
                            <VideoOff className="w-8 h-8 text-slate-400" />
                          </div>
                          <p className="text-base font-medium text-slate-300">
                            Camera blocked
                          </p>
                          <p className="text-sm text-slate-400 mt-1">
                            Allow camera access to continue
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="animate-spin rounded-full h-6 w-6 border-2 border-slate-600 border-t-blue-500 mx-auto mb-3"></div>
                          <p className="text-base font-medium text-slate-300">
                            Getting ready...
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Controls overlay at bottom of video */}
                  <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex items-center space-x-3">
                    <Button
                      onClick={toggleMute}
                      size="sm"
                      variant="ghost"
                      className={`rounded-full w-10 h-10 ${
                        callState.isMuted ||
                        callState.audioPermission === "denied"
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "bg-slate-700 hover:bg-slate-600 text-white"
                      }`}
                      disabled={callState.audioPermission === "denied"}
                    >
                      {callState.isMuted ||
                      callState.audioPermission === "denied" ? (
                        <MicOff className="w-4 h-4" />
                      ) : (
                        <Mic className="w-4 h-4" />
                      )}
                    </Button>

                    <Button
                      onClick={toggleVideo}
                      size="sm"
                      variant="ghost"
                      className={`rounded-full w-10 h-10 ${
                        !callState.isVideoOn ||
                        callState.videoPermission === "denied"
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "bg-slate-700 hover:bg-slate-600 text-white"
                      }`}
                      disabled={callState.videoPermission === "denied"}
                    >
                      {callState.isVideoOn &&
                      callState.videoPermission === "granted" ? (
                        <Video className="w-4 h-4" />
                      ) : (
                        <VideoOff className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Device Status */}
                <div className="flex items-center justify-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        callState.audioPermission === "granted"
                          ? "bg-green-500"
                          : callState.audioPermission === "denied"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                    ></div>
                    <span className="text-slate-300">
                      {callState.audioPermission === "granted"
                        ? "Mic ready"
                        : callState.audioPermission === "denied"
                        ? "Mic blocked"
                        : "Getting mic..."}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        callState.videoPermission === "granted"
                          ? "bg-green-500"
                          : callState.videoPermission === "denied"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                    ></div>
                    <span className="text-slate-300">
                      {callState.videoPermission === "granted"
                        ? "Camera ready"
                        : callState.videoPermission === "denied"
                        ? "Camera blocked"
                        : "Getting camera..."}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side - Ready to Join */}
              <div className="bg-white rounded-2xl p-6 shadow-2xl flex flex-col justify-center">
                <div className="space-y-6">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">
                      Ready to join?
                    </h1>
                    <p className="text-slate-600 text-base">
                      {callState.isCreatingRoom
                        ? "You're about to create and join a new meeting"
                        : "You're about to join this meeting"}
                    </p>
                  </div>

                  {/* Name Input */}
                  <div>
                    <Input
                      value={callState.participantName || participantName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setParticipantName(e.target.value);
                        setCallState((prev) => ({
                          ...prev,
                          participantName: e.target.value,
                        }));
                      }}
                      placeholder="Your name"
                      className="h-12 text-base border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
                    />
                  </div>

                  {/* Room Info for Created Rooms */}
                  {callState.isCreatingRoom && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-xs text-blue-700 mb-1">Room ID</p>
                          <p className="font-mono text-sm text-blue-900 truncate">
                            {callState.roomName}
                          </p>
                        </div>
                        <Button
                          onClick={copyRoomLink}
                          size="sm"
                          variant="ghost"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-100 flex-shrink-0 ml-2"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Join Button */}
                  <Button
                    onClick={handleJoinFromSetup}
                    disabled={
                      !callState.participantName.trim() ||
                      (callState.audioPermission === "denied" &&
                        callState.videoPermission === "denied")
                    }
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {callState.isCreatingRoom ? "Create & Join" : "Join now"}
                  </Button>

                  {/* Permission Warning */}
                  {callState.audioPermission === "denied" &&
                    callState.videoPermission === "denied" && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <Shield className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-red-700 text-sm font-medium">
                              Camera and microphone blocked
                            </p>
                            <p className="text-red-600 text-xs mt-1">
                              Please allow access to join the meeting
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show connecting state
  if (
    callState.currentStep === "call" &&
    !callState.isConnected &&
    callState.isConnecting
  ) {
    return (
      <div className="h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/30 border-t-white"></div>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Connecting to call...
          </h2>
          <p className="text-blue-100 text-lg max-w-md mx-auto">
            Please wait while we establish your secure connection to the
            consultation room
          </p>
          <div className="mt-8 flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  // Show call ended state
  if (
    callState.currentStep === "call" &&
    !callState.isConnected &&
    !callState.isConnecting &&
    !callState.isJoining
  ) {
    return (
      <div className="h-screen bg-gray-900 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-white font-medium text-sm">Call Ended</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-rose-200/20 to-pink-200/20 border border-rose-300/30 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <Image src="/favicon.ico" alt="SentimentMD" width={16} height={16} className="w-4 h-4" />
            </div>
            <span className="text-white font-medium text-sm">SentimentMD</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center bg-gray-900 p-6">
          <div className="text-center max-w-lg mx-auto">
            {/* Call Ended Icon */}
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                <PhoneOff className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* Title and Description */}
            <h2 className="text-3xl font-bold text-white mb-4">
              {callState.isCreatingRoom
                ? "Consultation Complete"
                : "Call Ended"}
            </h2>

            <p className="text-gray-300 text-lg mb-2">
              {callState.isCreatingRoom
                ? "The patient consultation has ended successfully."
                : "The video consultation has been terminated."}
            </p>

            <p className="text-gray-400 text-base mb-8">
              {callState.isCreatingRoom
                ? "Patient data has been analyzed and is ready for review."
                : "Thank you for using SentimentMD for your consultation."}
            </p>

            {/* Call Statistics */}
            <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    {formatDuration(callState.callDuration)}
                  </div>
                  <div className="text-gray-400 text-sm">Call Duration</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">
                    {callState.remoteParticipants.size + 1}
                  </div>
                  <div className="text-gray-400 text-sm">Participants</div>
                </div>
              </div>

              {callState.isCreatingRoom && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  {(() => {
                    const dataSummary = getDataSummary();
                    if (dataSummary.totalPoints > 0) {
                      return (
                        <div className="space-y-3">
                          <div className="flex items-center justify-center space-x-2 text-green-400">
                            <Brain className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              Patient Sentiment Analysis Complete
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-center">
                            <div>
                              <div className="text-lg font-bold text-purple-400">
                                {dataSummary.totalPoints}
                              </div>
                              <div className="text-gray-400 text-xs">Data Points</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-orange-400">
                                {dataSummary.topEmotions[0]?.name || 'N/A'}
                              </div>
                              <div className="text-gray-400 text-xs">Primary Emotion</div>
                            </div>
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div className="flex items-center justify-center space-x-2 text-yellow-400">
                          <Brain className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            Limited sentiment data collected
                          </span>
                        </div>
                      );
                    }
                  })()}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {callState.isCreatingRoom ? (
                // Doctor/Healthcare Provider Options
                <div className="space-y-3">
                  <Button
                    onClick={() => {
                      console.log("Redirecting to patient report...");
                      setTimeout(() => {
                        router.push("/report");
                      }, 1000);
                    }}
                    className="w-full h-14 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-semibold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Brain className="w-5 h-5 mr-3" />
                    View Patient Report
                  </Button>

                  <Button
                    onClick={() => {
                      // Reset to initial state and clear URL
                      const newUrl = `${window.location.origin}/video-call`;
                      window.history.pushState({}, "", newUrl);
                      setCallState((prev) => ({
                        ...prev,
                        currentStep: "initial",
                        roomName: "",
                        participantName: "",
                        audioPermission: "pending",
                        videoPermission: "pending",
                        isCreatingRoom: false,
                        callDuration: 0,
                      }));
                      setLocalRoomName("");
                      setParticipantName("");
                    }}
                    variant="outline"
                    className="w-full h-12 border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700 hover:border-gray-500 font-medium rounded-lg transition-all duration-200"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start New Consultation
                  </Button>
                </div>
              ) : (
                // Patient Options
                <div className="space-y-3">
                  <Button
                    onClick={() => {
                      // Reset to initial state and clear URL
                      const newUrl = `${window.location.origin}/video-call`;
                      window.history.pushState({}, "", newUrl);
                      setCallState((prev) => ({
                        ...prev,
                        currentStep: "initial",
                        roomName: "",
                        participantName: "",
                        audioPermission: "pending",
                        videoPermission: "pending",
                        isCreatingRoom: false,
                        callDuration: 0,
                      }));
                      setLocalRoomName("");
                      setParticipantName("");
                    }}
                    className="w-full h-14 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-semibold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <ArrowLeft className="w-5 h-5 mr-3" />
                    Return to Home
                  </Button>

                  <Button
                    onClick={() => {
                      window.location.href = "/";
                    }}
                    variant="outline"
                    className="w-full h-12 border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700 hover:border-gray-500 font-medium rounded-lg transition-all duration-200"
                  >
                    <Image src="/favicon.ico" alt="SentimentMD" width={16} height={16} className="w-4 h-4 mr-2 brightness-0 invert" />
                    Back to Dashboard
                  </Button>
                </div>
              )}
            </div>

            {/* Footer Message */}
            <div className="mt-8 text-center">
              <p className="text-gray-500 text-sm">
                {callState.isCreatingRoom
                  ? "Patient consultation data has been securely processed and stored."
                  : "Your consultation session has ended. We hope SentimentMD was helpful."}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show video call interface
  if (callState.currentStep === "call" && callState.isConnected) {
    return (
      <div className="h-screen bg-gray-900 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700 flex-shrink-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-white font-medium text-sm">
                SentimentMD Meeting
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-4 text-gray-300 text-xs">
              <span>
                Meeting ID:{" "}
                <span className="font-mono text-gray-200">
                  {callState.roomName}
                </span>
              </span>
              <span>
                Duration:{" "}
                <span className="text-green-400">
                  {formatDuration(callState.callDuration)}
                </span>
              </span>
              {isRecording && (
                <div className="flex items-center space-x-1 text-red-400">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                  <span className="text-xs font-medium">REC</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white hover:bg-gray-700 h-7 w-7 p-0"
              onClick={copyRoomLink}
            >
              <Share className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white hover:bg-gray-700 h-7 w-7 p-0"
            >
              <Users className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white hover:bg-gray-700 h-7 w-7 p-0"
            >
              <MessageSquare className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Main Video Area */}
        <div className="flex-1 bg-gray-900 p-3 min-h-0">
          <div className="h-full relative">
            {/* Main Video Container */}
            <div className="relative w-full h-full bg-black rounded-lg overflow-hidden shadow-2xl">
              {/* Remote Video (Main Screen) */}
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />

              {/* Participant Name Overlay */}
              <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-sm font-medium">
                {callState.remoteParticipants.size > 0
                  ? Array.from(callState.remoteParticipants.values())[0]
                      ?.identity || "Participant"
                  : "Waiting for participant..."}
              </div>

              {/* Face Analysis Widget - Only for Healthcare Provider analyzing patient */}
              {callState.isCreatingRoom &&
                remoteVideoRef.current &&
                remoteVideoRef.current.srcObject && (
                  <div className="absolute bottom-3 right-3 max-w-xs">
                    <div className="bg-black/80 backdrop-blur-sm rounded-lg p-2 border border-gray-600">
                      <div className="text-white text-xs mb-1 font-medium">
                        Patient Analysis
                      </div>
                      {remoteVideoRef && remoteVideoRef.current && (
                        <FaceWidgets
                          customVideoElement={remoteVideoRef.current}
                        />
                      )}
                    </div>
                  </div>
                )}

              {/* Waiting State */}
              {callState.remoteParticipants.size === 0 && (
                <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      Waiting for others to join
                    </h3>
                    <p className="text-gray-400 max-w-sm mx-auto text-sm">
                      Your meeting is ready. Share the meeting ID with
                      participants.
                    </p>
                    <div className="mt-3 flex items-center justify-center space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div
                        className="w-2 h-2 bg-blue-500 rounded-full"
                        style={{ animationDelay: "0.3s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-blue-500 rounded-full"
                        style={{ animationDelay: "0.6s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Control Bar */}
        <div className="bg-gray-800 px-4 py-3 border-t border-gray-700 flex-shrink-0">
          <div className="flex items-center justify-center space-x-3">
            {/* Mute Button */}
            <Button
              onClick={toggleMute}
              size="sm"
              className={`rounded-full w-10 h-10 transition-all duration-200 ${
                callState.isMuted || callState.audioPermission === "denied"
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-gray-600 hover:bg-gray-500 text-white"
              }`}
              disabled={callState.audioPermission === "denied"}
            >
              {callState.isMuted || callState.audioPermission === "denied" ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </Button>

            {/* Video Toggle Button */}
            <Button
              onClick={toggleVideo}
              size="sm"
              className={`rounded-full w-10 h-10 transition-all duration-200 ${
                !callState.isVideoOn || callState.videoPermission === "denied"
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-gray-600 hover:bg-gray-500 text-white"
              }`}
              disabled={callState.videoPermission === "denied"}
            >
              {callState.isVideoOn &&
              callState.videoPermission === "granted" ? (
                <Video className="w-4 h-4" />
              ) : (
                <VideoOff className="w-4 h-4" />
              )}
            </Button>

            {/* Share Screen Button */}
            <Button
              size="sm"
              className="rounded-full w-10 h-10 bg-gray-600 hover:bg-gray-500 text-white transition-all duration-200"
            >
              <Share className="w-4 h-4" />
            </Button>

            {/* Participants Button */}
            <Button
              size="sm"
              className="rounded-full w-10 h-10 bg-gray-600 hover:bg-gray-500 text-white transition-all duration-200"
            >
              <Users className="w-4 h-4" />
            </Button>

            {/* Chat Button */}
            <Button
              size="sm"
              className="rounded-full w-10 h-10 bg-gray-600 hover:bg-gray-500 text-white transition-all duration-200"
            >
              <MessageSquare className="w-4 h-4" />
            </Button>

            {/* Settings Button */}
            <Button
              size="sm"
              className="rounded-full w-10 h-10 bg-gray-600 hover:bg-gray-500 text-white transition-all duration-200"
            >
              <Settings className="w-4 h-4" />
            </Button>

            {/* End Call Button */}
            <Button
              onClick={endCall}
              size="sm"
              className="rounded-full w-12 h-10 bg-red-600 hover:bg-red-700 text-white transition-all duration-200 ml-2"
            >
              <PhoneOff className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // If none of the above conditions match, return to initial step
  return null;
};

export default VideoCallPage;
