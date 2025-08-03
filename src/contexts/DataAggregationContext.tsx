"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { Emotion } from "../lib/data/emotion";
import { FacePrediction } from "../lib/data/facePrediction";

type AggregatedDataPoint = {
  timestamp: string;
  emotions: Emotion[];
  facePredictions: FacePrediction[];
};

type DataAggregationState = {
  aggregatedData: AggregatedDataPoint[];
  isRecording: boolean;
  startTime: Date | null;
  addDataPoint: (
    emotions: Emotion[],
    facePredictions: FacePrediction[]
  ) => void;
  startRecording: () => void;
  stopRecording: () => void;
  clearData: () => void;
  getAggregatedData: () => AggregatedDataPoint[];
  getDataSummary: () => {
    totalPoints: number;
    duration: number;
    topEmotions: Array<{ name: string; averageScore: number }>;
  };
};

const DataAggregationContext = createContext<DataAggregationState | undefined>(
  undefined
);

type DataAggregationProviderProps = {
  children: ReactNode;
};

export function DataAggregationProvider({
  children,
}: DataAggregationProviderProps) {
  const [aggregatedData, setAggregatedData] = useState<AggregatedDataPoint[]>(
    []
  );
  const [isRecording, setIsRecording] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);

  const addDataPoint = useCallback(
    (emotions: Emotion[], facePredictions: FacePrediction[]) => {
      if (!isRecording) return;

      const now = new Date();
      const timeSinceStart = startTime
        ? now.getTime() - startTime.getTime()
        : 0;
      const timestamp = new Date(timeSinceStart).toISOString().substr(11, 8); // Format as HH:MM:SS

      const newDataPoint: AggregatedDataPoint = {
        timestamp,
        emotions,
        facePredictions,
      };

      console.log(
        `Adding data point at ${timestamp} with ${emotions.length} emotions`
      );

      // Log top 3 emotions for this data point
      const topEmotions = emotions
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map((e) => `${e.name}: ${e.score.toFixed(3)}`)
        .join(", ");
      console.log(`Top emotions: ${topEmotions}`);
      setAggregatedData((prev) => [...prev, newDataPoint]);
    },
    [isRecording, startTime]
  );

  const startRecording = useCallback(() => {
    setStartTime(new Date());
    setIsRecording(true);
    setAggregatedData([]);
    console.log("Data aggregation started");
  }, []);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    console.log(
      "Data aggregation stopped. Total data points:",
      aggregatedData.length
    );
  }, [aggregatedData.length]);

  const clearData = useCallback(() => {
    setAggregatedData([]);
    setStartTime(null);
    setIsRecording(false);
  }, []);

  const getAggregatedData = useCallback(() => {
    return aggregatedData;
  }, [aggregatedData]);

  const getDataSummary = useCallback(() => {
    if (aggregatedData.length === 0) {
      return { totalPoints: 0, duration: 0, topEmotions: [] };
    }

    const totalPoints = aggregatedData.length;
    const duration = startTime ? new Date().getTime() - startTime.getTime() : 0;

    // Calculate average emotion scores
    const emotionTotals: { [key: string]: number } = {};
    const emotionCounts: { [key: string]: number } = {};

    aggregatedData.forEach((point) => {
      point.emotions.forEach((emotion) => {
        if (!emotionTotals[emotion.name]) {
          emotionTotals[emotion.name] = 0;
          emotionCounts[emotion.name] = 0;
        }
        emotionTotals[emotion.name] += emotion.score;
        emotionCounts[emotion.name] += 1;
      });
    });

    const topEmotions = Object.keys(emotionTotals)
      .map((name) => ({
        name,
        averageScore: emotionTotals[name] / emotionCounts[name],
      }))
      .sort((a, b) => b.averageScore - a.averageScore)
      .slice(0, 5);

    return { totalPoints, duration, topEmotions };
  }, [aggregatedData, startTime]);

  const value: DataAggregationState = {
    aggregatedData,
    isRecording,
    startTime,
    addDataPoint,
    startRecording,
    stopRecording,
    clearData,
    getAggregatedData,
    getDataSummary,
  };

  return (
    <DataAggregationContext.Provider value={value}>
      {children}
    </DataAggregationContext.Provider>
  );
}

export function useDataAggregation() {
  const context = useContext(DataAggregationContext);
  if (context === undefined) {
    throw new Error(
      "useDataAggregation must be used within a DataAggregationProvider"
    );
  }
  return context;
}
