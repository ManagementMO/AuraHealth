import { Emotion } from "../data/emotion";
import { FacePrediction } from "../data/facePrediction";

export type AggregatedDataPoint = {
  timestamp: string;
  emotions: Emotion[];
  facePredictions: FacePrediction[];
};

export const logAggregatedData = (data: AggregatedDataPoint[]) => {
  console.log("=== Aggregated Data Summary ===");
  console.log(`Total data points: ${data.length}`);
  
  if (data.length > 0) {
    console.log("First data point:", data[0]);
    console.log("Last data point:", data[data.length - 1]);
    
    // Calculate average emotions across all data points
    const emotionTotals: { [key: string]: number } = {};
    const emotionCounts: { [key: string]: number } = {};
    
    data.forEach(point => {
      point.emotions.forEach(emotion => {
        if (!emotionTotals[emotion.name]) {
          emotionTotals[emotion.name] = 0;
          emotionCounts[emotion.name] = 0;
        }
        emotionTotals[emotion.name] += emotion.score;
        emotionCounts[emotion.name] += 1;
      });
    });
    
    console.log("Average emotion scores:");
    Object.keys(emotionTotals).forEach(emotionName => {
      const average = emotionTotals[emotionName] / emotionCounts[emotionName];
      console.log(`  ${emotionName}: ${average.toFixed(3)}`);
    });
  }
  
  console.log("===============================");
};

export const validateAggregatedData = (data: AggregatedDataPoint[]): boolean => {
  if (!Array.isArray(data)) {
    console.error("Aggregated data is not an array");
    return false;
  }
  
  for (let i = 0; i < data.length; i++) {
    const point = data[i];
    if (!point.timestamp || !Array.isArray(point.emotions) || !Array.isArray(point.facePredictions)) {
      console.error(`Invalid data point at index ${i}:`, point);
      return false;
    }
  }
  
  return true;
}; 