"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const DoctorVideoCall = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isInCall, setIsInCall] = useState(true);

  const toggleMute = () => setIsMuted(!isMuted);
  const toggleVideo = () => setIsVideoOn(!isVideoOn);
  const endCall = () => setIsInCall(false);

  if (!isInCall) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Call Ended</h2>
          <p className="text-gray-600 mb-6">
            The video call has been terminated.
          </p>
          <Button onClick={() => setIsInCall(true)}>Start New Call</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-800/50 backdrop-blur-sm">
        <div className="flex items-center space-x-4">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-white font-medium">Live Call</span>
          <span className="text-gray-400 text-sm">Patient: John Doe</span>
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
          {/* Patient Video (Main Screen) */}
          <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-12 h-12 text-white/60" />
              </div>
              <p className="text-lg font-medium">Patient Video</p>
              <p className="text-sm text-white/60 mt-1">Connecting...</p>
            </div>
          </div>

          {/* Connection Status */}
          <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
            <span className="text-white text-sm">HD</span>
          </div>

          {/* Call Duration */}
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
            <span className="text-white text-sm">12:34</span>
          </div>

          {/* Network Status */}
          <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-white text-sm">Good</span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex items-center justify-center p-6 bg-gray-800/50 backdrop-blur-sm">
        <div className="flex items-center space-x-4">
          {/* Mute Button */}
          <Button
            onClick={toggleMute}
            size="lg"
            variant={isMuted ? "destructive" : "secondary"}
            className={`rounded-full w-14 h-14 ${
              isMuted
                ? "bg-red-500 hover:bg-red-600"
                : "bg-white/20 hover:bg-white/30"
            }`}
          >
            {isMuted ? (
              <MicOff className="w-6 h-6 text-white" />
            ) : (
              <Mic className="w-6 h-6 text-white" />
            )}
          </Button>

          {/* Video Toggle Button */}
          <Button
            onClick={toggleVideo}
            size="lg"
            variant={!isVideoOn ? "destructive" : "secondary"}
            className={`rounded-full w-14 h-14 ${
              !isVideoOn
                ? "bg-red-500 hover:bg-red-600"
                : "bg-white/20 hover:bg-white/30"
            }`}
          >
            {isVideoOn ? (
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

export default DoctorVideoCall;
