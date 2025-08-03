import React from 'react';
import { EmotionScore, SentimentAnalysisResult } from '@/hooks/useHumeSentimentAnalysis';

interface SentimentDisplayProps {
  result: SentimentAnalysisResult | null;
  isConnected: boolean;
  isAnalyzing: boolean;
  error: string | null;
}

const formatEmotionName = (name: string): string => {
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const getEmotionColor = (score: number): string => {
  if (score > 0.6) return 'bg-green-500';
  if (score > 0.3) return 'bg-yellow-500';
  return 'bg-blue-500';
};

export function SentimentDisplay({ result, isConnected, isAnalyzing, error }: SentimentDisplayProps) {
  return (
    <div className="bg-neutral-800 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Facial Sentiment Analysis</h3>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-xs text-neutral-400">
            {isConnected ? (isAnalyzing ? 'Analyzing' : 'Connected') : 'Disconnected'}
          </span>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-3">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {!isConnected && !error && (
        <div className="text-center py-8">
          <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2" />
          <p className="text-neutral-400 text-sm">Connecting to Hume AI...</p>
        </div>
      )}

      {isConnected && !result && !error && (
        <div className="text-center py-8">
          <p className="text-neutral-400 text-sm">Waiting for video analysis...</p>
        </div>
      )}

      {result && result.emotions.length > 0 && (
        <div className="space-y-3">
          <div className="text-xs text-neutral-400">
            Last updated: {new Date(result.timestamp).toLocaleTimeString()}
          </div>
          
          {result.emotions.map((emotion: EmotionScore, index: number) => {
            const percentage = Math.round(emotion.score * 100);
            return (
              <div key={`${emotion.name}-${index}`} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-white">
                    {formatEmotionName(emotion.name)}
                  </span>
                  <span className="text-sm text-neutral-300">{percentage}%</span>
                </div>
                
                <div className="w-full bg-neutral-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getEmotionColor(emotion.score)}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}

          {result.emotions.length > 0 && (
            <div className="mt-4 p-3 bg-neutral-700 rounded-lg">
              <div className="text-sm text-neutral-300">
                <span className="font-medium">Primary Emotion: </span>
                <span className="text-white">
                  {formatEmotionName(result.emotions[0].name)} 
                  ({Math.round(result.emotions[0].score * 100)}%)
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 