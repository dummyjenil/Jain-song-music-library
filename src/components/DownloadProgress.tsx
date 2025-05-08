
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Clock, Timer } from 'lucide-react';

interface DownloadProgressProps {
  progress: number;
  fileName: string;
  elapsedTime: number;
  estimatedTimeRemaining: number;
  theme: string;
  onCancel: () => void;
}

const DownloadProgress: React.FC<DownloadProgressProps> = ({
  progress,
  fileName,
  elapsedTime,
  estimatedTimeRemaining,
  theme,
  onCancel
}) => {
  const formatTime = (seconds: number): string => {
    if (seconds === Infinity || isNaN(seconds)) return '--:--';
    
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div 
      className={cn(
        "fixed bottom-8 right-8 z-50 p-4 rounded-xl shadow-lg w-80 backdrop-blur-lg animate-slide-up",
        {
          "bg-midnight-secondary/90 border border-midnight-accent/30": theme === 'midnight',
          "bg-ocean-secondary/90 border border-ocean-accent/30": theme === 'ocean',
          "bg-sunset-secondary/90 border border-sunset-accent/30": theme === 'sunset',
          "bg-forest-secondary/90 border border-forest-accent/30": theme === 'forest',
          "bg-candy-secondary/90 border border-candy-accent/30": theme === 'candy',
        }
      )}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 
          className={cn(
            "font-medium truncate flex-1 mr-2",
            {
              "text-midnight-text": theme === 'midnight',
              "text-ocean-text": theme === 'ocean',
              "text-sunset-text": theme === 'sunset',
              "text-forest-text": theme === 'forest',
              "text-candy-text": theme === 'candy',
            }
          )}
        >
          {fileName}
        </h3>
        <button 
          onClick={onCancel}
          className={cn(
            "text-xs px-2 py-1 rounded-md hover:opacity-80 transition-opacity",
            {
              "bg-midnight-accent/20 text-midnight-text": theme === 'midnight',
              "bg-ocean-accent/20 text-ocean-text": theme === 'ocean',
              "bg-sunset-accent/20 text-sunset-text": theme === 'sunset',
              "bg-forest-accent/20 text-forest-text": theme === 'forest',
              "bg-candy-accent/20 text-candy-text": theme === 'candy',
            }
          )}
        >
          Cancel
        </button>
      </div>

      <div className="mb-3 relative">
        <Progress
          value={progress}
          className={cn(
            "h-3 transition-all duration-300",
            {
              "[&_.SliderRange]:bg-midnight-accent": theme === 'midnight',
              "[&_.SliderRange]:bg-ocean-accent": theme === 'ocean',
              "[&_.SliderRange]:bg-sunset-accent": theme === 'sunset',
              "[&_.SliderRange]:bg-forest-accent": theme === 'forest',
              "[&_.SliderRange]:bg-candy-accent": theme === 'candy',
            }
          )}
        />
      </div>

      <div 
        className={cn(
          "flex justify-between text-xs",
          {
            "text-midnight-text/70": theme === 'midnight',
            "text-ocean-text/70": theme === 'ocean',
            "text-sunset-text/70": theme === 'sunset',
            "text-forest-text/70": theme === 'forest',
            "text-candy-text/70": theme === 'candy',
          }
        )}
      >
        <div className="flex items-center gap-1">
          <Clock size={12} className="animate-pulse" style={{ animationDuration: '2s' }} />
          <span>Elapsed: {formatTime(elapsedTime)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Timer size={12} className="animate-pulse" style={{ animationDuration: '2s' }} />
          <span>ETA: {formatTime(estimatedTimeRemaining)}</span>
        </div>
      </div>
    </div>
  );
};

export default DownloadProgress;
