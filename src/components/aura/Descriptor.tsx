import { Emotion } from "@/lib/data/emotion";
import { None } from "@/lib/utilities/typeUtilities";
import { getEmotionDescriptor } from "@/lib/utilities/emotionUtilities";
import { useStableEmotions } from "@/hooks/stability";

type DescriptorProps = {
  className?: string;
  emotions: Emotion[];
};

export function Descriptor({ className, emotions }: DescriptorProps) {
  const emotionDistThreshold = 0.1;
  const embeddingDistThreshold = 0.2;
  const stableEmotions = useStableEmotions(emotions, embeddingDistThreshold);

  className = className || "";

  function createDescription(emotions: Emotion[]): string {
    emotions.sort((a, b) => (a.score < b.score ? 1 : -1));
    if (emotions.length < 2) return "";

    const primaryEmotion = emotions[0];
    let secondaryEmotion = emotions[1];
    let secondaryDescriptor = "";
    for (let i = 1; i < emotions.length; i++) {
      const emotion = emotions[i];
      const descriptor = getEmotionDescriptor(emotion.name);
      if (descriptor !== None) {
        secondaryDescriptor = descriptor;
        secondaryEmotion = emotion;
        break;
      }
    }
    if (
      Math.abs(primaryEmotion.score - secondaryEmotion.score) >
      emotionDistThreshold
    ) {
      return primaryEmotion.name;
    }
    return `${secondaryDescriptor} ${primaryEmotion.name}`;
  }

  return (
    <div className={`${className}`}>
      {emotions.length > 0 && (
        <div className="bg-gradient-to-r from-gray-700/40 to-gray-600/40 rounded-lg px-3 py-2 border border-gray-500/20 backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0"></div>
            <div className="text-sm font-medium text-gray-100 capitalize truncate">
              {createDescription(stableEmotions)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
