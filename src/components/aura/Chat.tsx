"use client";

import { VoiceProvider, useVoice } from "@humeai/voice-react";
import Messages from "./Messages";
import Controls from "./Controls";
import StartCall from "./StartCall";
import { ComponentRef, useRef, useEffect } from "react";
import { toast } from "sonner";
import * as R from "remeda";

// Inner component that has access to useVoice hook
function ChatContent({
  onSessionEnd,
  onEmotionDataUpdate,
}: {
  onSessionEnd?: () => void;
  onEmotionDataUpdate?: (data: Record<string, number>) => void;
}) {
  const { messages } = useVoice();
  const timeout = useRef<number | null>(null);
  const ref = useRef<ComponentRef<typeof Messages> | null>(null);

  // Extract and aggregate emotion data from messages
  useEffect(() => {
    if (messages.length > 0 && onEmotionDataUpdate) {
      const aggregatedEmotions: Record<string, number[]> = {};
      
      messages.forEach((msg) => {
        if (
          (msg.type === "user_message" || msg.type === "assistant_message") &&
          msg.models?.prosody?.scores
        ) {
          const scores = msg.models.prosody.scores;
          Object.entries(scores).forEach(([emotion, score]) => {
            if (!aggregatedEmotions[emotion]) {
              aggregatedEmotions[emotion] = [];
            }
            aggregatedEmotions[emotion].push(score as number);
          });
        }
      });

      // Calculate averages for each emotion
      const averagedEmotions: Record<string, number> = {};
      Object.entries(aggregatedEmotions).forEach(([emotion, scores]) => {
        averagedEmotions[emotion] = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      });

      // Get top 3 emotions using same logic as Expressions component
      const top3 = R.pipe(
        averagedEmotions,
        R.entries(),
        R.sortBy(R.pathOr([1], 0)),
        R.reverse(),
        R.take(3)
      );

      const top3Object = Object.fromEntries(top3);
      onEmotionDataUpdate(top3Object);
    }
  }, [messages, onEmotionDataUpdate]);

  return (
    <>
      <Messages ref={ref} />
      <Controls onSessionEnd={onSessionEnd} />
    </>
  );
}

export default function ClientComponent({
  accessToken,
  onCallConnected,
  onSessionEnd,
  onEmotionDataUpdate,
}: {
  accessToken: string;
  onCallConnected?: () => void;
  onSessionEnd?: () => void;
  onEmotionDataUpdate?: (data: Record<string, number>) => void;
}) {
  const timeout = useRef<number | null>(null);
  const ref = useRef<ComponentRef<typeof Messages> | null>(null);

  // optional: use configId from environment variable
  const configId = process.env['NEXT_PUBLIC_HUME_CONFIG_ID'];
  
  return (
    <div
      className={
        "relative grow flex flex-col mx-auto w-full h-[0px]"
      }
    >
      <VoiceProvider
        onMessage={() => {
          if (timeout.current) {
            window.clearTimeout(timeout.current);
          }

          timeout.current = window.setTimeout(() => {
            if (ref.current) {
              const scrollHeight = ref.current.scrollHeight;

              ref.current.scrollTo({
                top: scrollHeight,
                behavior: "smooth",
              });
            }
          }, 200);
        }}
        onError={(error) => {
          toast.error(error.message);
        }}
        onOpen={() => {
          if (onCallConnected) {
            onCallConnected();
          }
        }}
      >
        <ChatContent onSessionEnd={onSessionEnd} onEmotionDataUpdate={onEmotionDataUpdate} />
        <StartCall configId={configId} accessToken={accessToken} />
      </VoiceProvider>
    </div>
  );
}
