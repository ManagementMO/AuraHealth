import { Emotion } from "../../lib/data/emotion";

type TopEmotionsProps = {
  className?: string;
  emotions: Emotion[];
  numEmotions: number;
};

export function TopEmotions({
  className,
  emotions,
  numEmotions,
}: TopEmotionsProps) {
  className = className || "";

  return (
    <div className={`${className} max-w-full overflow-hidden space-y-1`}>
      {emotions
        .sort((a: Emotion, b: Emotion) => b.score - a.score)
        .slice(0, numEmotions)
        .map((emotion, i) => {
          const percentage = Math.round(emotion.score * 100);
          const intensity = percentage > 70 ? 'high' : percentage > 40 ? 'medium' : 'low';
          const barColor = percentage > 70 ? 'bg-green-500' : percentage > 40 ? 'bg-yellow-500' : 'bg-blue-500';
          const bgColor = percentage > 70 ? 'bg-green-500/10' : percentage > 40 ? 'bg-yellow-500/10' : 'bg-blue-500/10';
          
          return (
            <div
              key={i}
              className={`relative overflow-hidden rounded-lg border border-gray-500/30 ${bgColor} backdrop-blur-sm`}
            >
              {/* Progress bar background */}
              <div className="absolute inset-0 flex">
                <div 
                  className={`${barColor} opacity-20 transition-all duration-300`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              
              {/* Content */}
              <div className="relative flex items-center justify-between px-2 py-1.5 min-h-[28px]">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <div className="flex-shrink-0 w-4 h-4 rounded-full bg-gray-700/50 flex items-center justify-center border border-gray-500/30">
                    <span className="text-xs font-bold text-gray-200">{i + 1}</span>
                  </div>
                  <span className="text-xs font-medium text-gray-200 lowercase truncate">
                    {emotion.name}
                  </span>
                </div>
                <div className="flex items-center space-x-1.5 flex-shrink-0">
                  <div className={`w-1.5 h-1.5 rounded-full ${barColor}`}></div>
                  <span className="text-xs font-bold text-gray-100 min-w-[28px] text-right">
                    {percentage}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}

TopEmotions.defaultProps = {
  numEmotions: 2, // Reduced for compact video call display
};
