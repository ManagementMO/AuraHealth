import { Emotion, EmotionName } from "../../lib/data/emotion";

import { scaleEmotionsToRanges } from "@/lib/utilities/scalingUtilities";

type LoaderProps = {
  className?: string;
  emotions: Emotion[];
  emotionName: EmotionName;
  numLevels: number;
};

export function Loader({
  className,
  emotions,
  emotionName,
  numLevels,
}: LoaderProps) {
  className = className || "";

  if (emotions.length === 0) {
    return <></>;
  }

  function getLevel(scaledEmotions: Emotion[]): number {
    // Level ranges from 0 to numLevels *inclusive*
    const emotion = scaledEmotions.find((e) => e.name === emotionName);
    if (!emotion) {
      console.error(`Could not find emotion ${emotionName}`);
      return 0;
    }

    const score = emotion.score;
    for (let i = numLevels; i >= 0; i--) {
      const threshold = i / (numLevels + 1);
      if (score > threshold) {
        return i;
      }
    }

    return 0;
  }

  function getIndicators(level: number) {
    const indicators = new Array(numLevels).fill(false);
    for (let i = 0; i < numLevels; i++) {
      if (i < level) {
        indicators[i] = true;
      }
    }
    return indicators;
  }

  const scaledEmotions = scaleEmotionsToRanges(emotions);
  const level = getLevel(scaledEmotions);
  const indicators = getIndicators(level);
  const emotionDisplayName = emotionName.includes("Surprise")
    ? "Surprise"
    : emotionName;

  return (
    <div
      className={`flex items-center justify-between ${className} mb-1 min-w-0 max-w-full`}
    >
      <div className="text-xs text-gray-300 truncate flex-1 mr-2 lowercase min-w-0">
        <span className="block truncate">{emotionDisplayName}</span>
      </div>
      <div className="flex flex-shrink-0">
        {indicators.map((indicator, i) => {
          const color = indicator ? "bg-blue-500" : "bg-gray-600";
          return (
            <div
              key={i}
              className={`w-2 h-2 rounded-full mr-1 last:mr-0 ${color} border border-gray-500`}
            ></div>
          );
        })}
      </div>
    </div>
  );
}

Loader.defaultProps = {
  numLevels: 5,
};
