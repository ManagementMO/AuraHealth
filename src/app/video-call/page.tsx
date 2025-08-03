"use client";

import React, { useState, useEffect, useRef, RefObject } from "react";
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
  ArrowLeft,
  Heart,
  Shield,
  Play,
  UserCheck,
  ArrowRight,
  Brain,
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

// Face Analysis Widget
import { FaceWidgets } from "@/components/aura/FaceWidget";

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
    currentStep: roomNameFromUrl ? "setup" : "initial",
    isCreatingRoom: false,
  });

  const [localRoomName, setLocalRoomName] = useState(roomNameFromUrl || "");
  const [participantName, setParticipantName] = useState("");
  const [analysisVideoElement, setAnalysisVideoElement] = useState<HTMLVideoElement | null>(null);

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
          console.log("Local video track attached");
        }
      });

      // Handle local track publications
      room.localParticipant.on("trackPublished", (publication) => {
        console.log("Local track published:", publication.trackName);
        if (publication.track && publication.track.kind === "video" && localVideoRef.current) {
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
          return { ...prev, remoteParticipants: newParticipants };
        });

        // Clear the remote video when participant disconnects
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = null;
        }
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
    if (callState.currentStep === "setup") {
      // Toggle mute in setup mode
      setCallState((prev) => ({ ...prev, isMuted: !prev.isMuted }));
      toast(callState.isMuted ? "Microphone unmuted" : "Microphone muted");
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
    toast(isCurrentlyMuted ? "Microphone unmuted" : "Microphone muted");
  };

  const toggleVideo = async () => {
    if (callState.currentStep === "setup") {
      // Toggle video in setup mode
      setCallState((prev) => ({ ...prev, isVideoOn: !prev.isVideoOn }));
      toast(callState.isVideoOn ? "Camera turned off" : "Camera turned on");
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
    toast(isCurrentlyVideoOn ? "Camera turned off" : "Camera turned on");
  };

  const endCall = () => {
    // Clean up analysis video element
    setAnalysisVideoElement(null);

    if (callState.room) {
      callState.room.disconnect();
    }

    // Update URL to remove room parameter when call ends
    const newUrl = `${window.location.origin}/video-call`;
    window.history.pushState({}, "", newUrl);

    setCallState((prev) => ({
      ...prev,
      isConnected: false,
      room: null,
      localParticipant: null,
      remoteParticipants: new Map(),
      isJoining: false,
      currentStep: "initial",
      roomName: "",
      participantName: "",
      audioPermission: "pending",
      videoPermission: "pending",
    }));

    // Reset local state
    setLocalRoomName("");
    setParticipantName("");

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
      toast.error("Please enter your name");
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
          console.error("Error starting video preview:", error);
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



  // Show initial interface
  if (callState.currentStep === "initial") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Navigation Header */}
        <nav className="bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900">
                  AuraHealth
                </span>
              </div>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                <a href="/" className="flex items-center space-x-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Home</span>
                </a>
              </Button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              {/* Trust Badge */}
              <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
                <Shield className="w-4 h-4" />
                <span>Secure • HIPAA Compliant • End-to-End Encrypted</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Video Consultations
                <span className="block text-blue-600">Made Simple</span>
              </h1>

              <p className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                Connect with healthcare providers through our secure,
                high-quality video platform. Create a new room or join an
                existing consultation.
              </p>

              {/* Main Content */}
              <div className="w-full max-w-md mx-auto">
                <Card className="border-0 shadow-xl">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div className="text-center space-y-4">
                        <p className="text-slate-600">
                          Choose how you&apos;d like to join a video call
                        </p>
                      </div>

                      <div className="space-y-4">
                        <Button
                          onClick={handleCreateCall}
                          className="w-full py-6 text-lg bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                          size="lg"
                        >
                          <Play className="w-5 h-5 mr-2" />
                          Create New Room
                        </Button>

                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-slate-500">
                              Or
                            </span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Input
                            value={localRoomName}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => setLocalRoomName(e.target.value)}
                            placeholder="Enter room name to join"
                            className="h-12 text-base"
                          />
                          <Input
                            value={participantName}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => setParticipantName(e.target.value)}
                            placeholder="Enter your name"
                            className="h-12 text-base"
                          />
                          <Button
                            onClick={handleJoinCall}
                            disabled={
                              !localRoomName.trim() || !participantName.trim()
                            }
                            variant="outline"
                            className="w-full py-6 text-lg border-2 border-blue-200 text-blue-600 hover:bg-blue-50"
                            size="lg"
                          >
                            <UserCheck className="w-5 h-5 mr-2" />
                            Join Call
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Show setup interface (Google Meet-style)
  if (callState.currentStep === "setup") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Navigation Header */}
        <nav className="bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900">
                  AuraHealth
                </span>
              </div>
              <Button
                onClick={handleBackToInitial}
                variant="outline"
                size="sm"
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </div>
          </div>
        </nav>

        {/* Setup Section */}
        <section className="py-16 lg:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                {callState.isCreatingRoom
                  ? "Setup Your Room"
                  : "Join Room Setup"}
              </h1>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Configure your audio and video settings before joining the
                consultation
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Left Column - Video Preview & Controls */}
              <div className="space-y-8">
                {/* Video Preview */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-slate-900">
                    Video Preview
                  </h2>
                  <div className="relative w-full max-w-lg mx-auto">
                    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-200 aspect-video shadow-2xl">
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
                            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center">
                              <div className="text-center text-white">
                                <VideoOff className="w-16 h-16 text-white/60 mx-auto mb-4" />
                                <p className="text-lg font-medium">
                                  Camera is off
                                </p>
                                <p className="text-sm text-white/60">
                                  Click the camera button to turn it on
                                </p>
                              </div>
                            </div>
                          )}
                        </>
                      ) : callState.videoPermission === "denied" ? (
                        <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                          <div className="text-center text-white">
                            <VideoOff className="w-16 h-16 text-white/60 mx-auto mb-4" />
                            <p className="text-lg font-medium">
                              Camera access denied
                            </p>
                            <p className="text-sm text-white/60">
                              Please allow camera access in your browser
                              settings
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                          <div className="text-center text-white">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                            <p className="text-lg font-medium">
                              Requesting camera access...
                            </p>
                            <p className="text-sm text-white/60">
                              Please allow camera access when prompted
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Audio/Video Controls */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-slate-900">
                    Audio & Video Controls
                  </h2>
                  <div className="flex items-center justify-center space-x-6">
                    <Button
                      onClick={toggleMute}
                      size="lg"
                      variant={
                        callState.isMuted ||
                        callState.audioPermission === "denied"
                          ? "destructive"
                          : "secondary"
                      }
                      className={`rounded-full w-16 h-16 ${
                        callState.isMuted ||
                        callState.audioPermission === "denied"
                          ? "bg-red-500 hover:bg-red-600 shadow-lg"
                          : "bg-slate-200 hover:bg-slate-300 shadow-lg"
                      }`}
                      disabled={callState.audioPermission === "denied"}
                    >
                      {callState.isMuted ||
                      callState.audioPermission === "denied" ? (
                        <MicOff className="w-6 h-6" />
                      ) : (
                        <Mic className="w-6 h-6" />
                      )}
                    </Button>

                    <Button
                      onClick={toggleVideo}
                      size="lg"
                      variant={
                        !callState.isVideoOn ||
                        callState.videoPermission === "denied"
                          ? "destructive"
                          : "secondary"
                      }
                      className={`rounded-full w-16 h-16 ${
                        !callState.isVideoOn ||
                        callState.videoPermission === "denied"
                          ? "bg-red-500 hover:bg-red-600 shadow-lg"
                          : "bg-slate-200 hover:bg-slate-300 shadow-lg"
                      }`}
                      disabled={callState.videoPermission === "denied"}
                    >
                      {callState.isVideoOn &&
                      callState.videoPermission === "granted" ? (
                        <Video className="w-6 h-6" />
                      ) : (
                        <VideoOff className="w-6 h-6" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Permission Status */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-slate-900">
                    Device Status
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            callState.audioPermission === "granted"
                              ? "bg-green-500"
                              : callState.audioPermission === "denied"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                          }`}
                        ></div>
                        <span className="font-medium text-slate-900">
                          Microphone
                        </span>
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          callState.audioPermission === "granted"
                            ? "text-green-600"
                            : callState.audioPermission === "denied"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {callState.audioPermission}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            callState.videoPermission === "granted"
                              ? "bg-green-500"
                              : callState.videoPermission === "denied"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                          }`}
                        ></div>
                        <span className="font-medium text-slate-900">
                          Camera
                        </span>
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          callState.videoPermission === "granted"
                            ? "text-green-600"
                            : callState.videoPermission === "denied"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {callState.videoPermission}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Room Info & Settings */}
              <div className="space-y-8">
                {/* Room Information */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-slate-900">
                    Room Information
                  </h2>
                  <div className="bg-gradient-to-br from-blue-50 to-teal-50 border border-blue-200 rounded-2xl p-6">
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-blue-700 mb-1">
                          {callState.isCreatingRoom
                            ? "Room Name (Generated)"
                            : "Joining Room"}
                        </div>
                        <div className="font-bold text-blue-900 text-lg">
                          {callState.roomName}
                        </div>
                      </div>
                      {callState.isCreatingRoom && (
                        <div className="space-y-3">
                          <p className="text-sm text-blue-700">
                            Share this room name with others to invite them
                          </p>
                          <Button
                            onClick={copyRoomLink}
                            size="sm"
                            variant="outline"
                            className="w-full bg-white border-blue-300 text-blue-700 hover:bg-blue-50"
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Room Link
                          </Button>
                          <div className="bg-white rounded-lg p-3 border border-blue-200">
                            <p className="text-xs text-blue-600 font-mono break-all">
                              {window.location.href}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Participant Name */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-slate-900">
                    Your Information
                  </h2>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Display Name
                    </label>
                    <Input
                      value={callState.participantName || participantName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setParticipantName(e.target.value);
                        setCallState((prev) => ({
                          ...prev,
                          participantName: e.target.value,
                        }));
                      }}
                      placeholder="Enter your name"
                      className="h-12 text-base"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <Button
                    onClick={handleJoinFromSetup}
                    disabled={
                      !callState.participantName.trim() ||
                      (callState.audioPermission === "denied" &&
                        callState.videoPermission === "denied")
                    }
                    className="w-full py-4 text-lg bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    size="lg"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    {callState.isCreatingRoom
                      ? "Create & Join Room"
                      : "Join Room"}
                  </Button>

                  {/* Permission Warning */}
                  {callState.audioPermission === "denied" &&
                    callState.videoPermission === "denied" && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <div className="flex items-start space-x-3">
                          <Shield className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-red-700 font-medium">
                              Permissions Required
                            </p>
                            <p className="text-red-600 text-sm mt-1">
                              Please allow at least microphone or camera access
                              to join the call.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </section>
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/30 border-t-white"></div>
            </div>
            <div className="absolute inset-0 w-24 h-24 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full opacity-20 animate-ping"></div>
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <PhoneOff className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Call Ended</h2>
          <p className="text-blue-100 text-lg mb-8">
            The video consultation has been terminated. Thank you for using
            AuraHealth.
          </p>
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
              }));
              setLocalRoomName("");
              setParticipantName("");
            }}
            className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Play className="w-5 h-5 mr-2" />
            Start New Call
          </Button>
        </div>
      </div>
    );
  }

  // Show video call interface
  if (callState.currentStep === "call" && callState.isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-black/20 backdrop-blur-md border-b border-white/10">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg"></div>
              <span className="text-white font-semibold text-lg">
                Live Consultation
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-4 text-white/80">
              <span className="text-sm">
                Room:{" "}
                <span className="font-mono text-blue-300">
                  {callState.roomName}
                </span>
              </span>
              <span className="text-sm">
                You:{" "}
                <span className="font-medium text-blue-300">
                  {callState.participantName}
                </span>
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/80 hover:text-white hover:bg-white/10 rounded-full w-10 h-10"
              onClick={copyRoomLink}
            >
              <Share className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white/80 hover:text-white hover:bg-white/10 rounded-full w-10 h-10"
            >
              <Users className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white/80 hover:text-white hover:bg-white/10 rounded-full w-10 h-10"
            >
              <MessageSquare className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Main Video Area */}
        <div className="flex-1 flex items-center justify-center p-6 relative">
          <div className="relative w-full max-w-6xl aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10">
            {/* Remote Video (Main Screen) */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />

            {/* Local Video (Picture-in-Picture) */}
            <div className="absolute top-6 right-6 w-64 h-48 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl">
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
                    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center">
                      <div className="text-center text-white">
                        <VideoOff className="w-12 h-12 text-white/60 mx-auto mb-2" />
                        <p className="text-sm font-medium">Camera off</p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                  <div className="text-center text-white">
                    <VideoOff className="w-12 h-12 text-white/60 mx-auto mb-2" />
                    <p className="text-sm">No camera</p>
                  </div>
                </div>
              )}
            </div>

            {/* Connection Status */}
            <div className="absolute top-6 left-6 bg-black/40 backdrop-blur-md rounded-xl px-4 py-2 border border-white/10">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white text-sm font-medium">HD</span>
              </div>
            </div>

            {/* Call Duration */}
            <div className="absolute top-6 left-24 bg-black/40 backdrop-blur-md rounded-xl px-4 py-2 border border-white/10">
              <span className="text-white text-sm font-medium">
                {formatDuration(callState.callDuration)}
              </span>
            </div>

            {/* Network Status */}
            <div className="absolute bottom-6 left-6 bg-black/40 backdrop-blur-md rounded-xl px-4 py-2 border border-white/10">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-white text-sm font-medium">Good</span>
              </div>
            </div>

            {/* Face Analysis Widget - Only for Healthcare Provider analyzing patient */}
            {callState.isCreatingRoom && remoteVideoRef.current && remoteVideoRef.current.srcObject && (
              <div className="absolute bottom-6 right-6 max-w-sm">
                <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/10">
                  {remoteVideoRef &&remoteVideoRef.current && (
                    <FaceWidgets
                      customVideoElement={remoteVideoRef.current}
                    />
                  )}
                </div>
              </div>
            )}
            
            {/* Debug Info for Healthcare Provider */}
            {callState.isCreatingRoom && (
              <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md rounded-lg p-2 text-xs text-white">
                <div>Provider View (Analyzing Patient)</div>
                <div>Remote Video: {remoteVideoRef.current ? '✅' : '❌'}</div>
                <div>Stream: {(remoteVideoRef.current?.srcObject) ? '✅' : '❌'}</div>
                <div>Widget: {(callState.isCreatingRoom && remoteVideoRef.current?.srcObject) ? '✅' : '❌'}</div>
              </div>
            )}

            {/* Remote Participant Info */}
            {callState.remoteParticipants.size === 0 && (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-600/20 to-teal-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-white/10">
                    <Users className="w-16 h-16 text-white/60" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">
                    Waiting for provider...
                  </h3>
                  <p className="text-white/60 text-lg max-w-md mx-auto">
                    Your healthcare provider will join shortly. Please ensure
                    your audio and video are working properly.
                  </p>
                  <div className="mt-6 flex items-center justify-center space-x-2">
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
            )}
          </div>
        </div>

        {/* Control Bar */}
        <div className="flex items-center justify-center p-8 bg-black/20 backdrop-blur-md border-t border-white/10">
          <div className="flex items-center space-x-6">
            {/* Mute Button */}
            <Button
              onClick={toggleMute}
              size="lg"
              variant={
                callState.isMuted || callState.audioPermission === "denied"
                  ? "destructive"
                  : "secondary"
              }
              className={`rounded-full w-16 h-16 ${
                callState.isMuted || callState.audioPermission === "denied"
                  ? "bg-red-500 hover:bg-red-600 shadow-lg"
                  : "bg-white/20 hover:bg-white/30 shadow-lg"
              }`}
              disabled={callState.audioPermission === "denied"}
            >
              {callState.isMuted || callState.audioPermission === "denied" ? (
                <MicOff className="w-7 h-7 text-white" />
              ) : (
                <Mic className="w-7 h-7 text-white" />
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
              className={`rounded-full w-16 h-16 ${
                !callState.isVideoOn || callState.videoPermission === "denied"
                  ? "bg-red-500 hover:bg-red-600 shadow-lg"
                  : "bg-white/20 hover:bg-white/30 shadow-lg"
              }`}
              disabled={callState.videoPermission === "denied"}
            >
              {callState.isVideoOn &&
              callState.videoPermission === "granted" ? (
                <Video className="w-7 h-7 text-white" />
              ) : (
                <VideoOff className="w-7 h-7 text-white" />
              )}
            </Button>

            {/* End Call Button */}
            <Button
              onClick={endCall}
              size="lg"
              variant="destructive"
              className="rounded-full w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-xl hover:shadow-2xl transition-all duration-200"
            >
              <PhoneOff className="w-8 h-8 text-white" />
            </Button>

            {/* Settings Button */}
            <Button
              size="lg"
              variant="secondary"
              className="rounded-full w-16 h-16 bg-white/20 hover:bg-white/30 shadow-lg"
            >
              <Settings className="w-7 h-7 text-white" />
            </Button>

            {/* More Options Button */}
            <Button
              size="lg"
              variant="secondary"
              className="rounded-full w-16 h-16 bg-white/20 hover:bg-white/30 shadow-lg"
            >
              <MoreVertical className="w-7 h-7 text-white" />
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
