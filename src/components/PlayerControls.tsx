
import React, { useState, useEffect } from 'react';
import { useMusic } from '@/components/MusicContext';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { Play, Pause, SkipBack, SkipForward, Music2 } from 'lucide-react';

const PlayerControls: React.FC = () => {
  const { 
    isPlaying, 
    playPause, 
    nextSong, 
    prevSong, 
    currentTime, 
    duration, 
    seek,
    currentTheme
  } = useMusic();
  
  const [seekHover, setSeekHover] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [buttonPress, setButtonPress] = useState('');

  // Animation for progress transitions
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsChanging(false);
    }, 600);
    
    return () => clearTimeout(timer);
  }, [currentTime]);

  // Button press animation
  useEffect(() => {
    if (buttonPress) {
      const timer = setTimeout(() => {
        setButtonPress('');
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [buttonPress]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  const handleControlClick = (action: 'prev' | 'play' | 'next') => {
    setButtonPress(action);
    if (action === 'prev') prevSong();
    if (action === 'play') playPause();
    if (action === 'next') nextSong();
  };

  return (
    <div className="w-full py-4 transition-all duration-300">
      {/* Progress bar with enhanced styling and animations */}
      <div 
        className="mb-6 relative" 
        onMouseEnter={() => setSeekHover(true)}
        onMouseLeave={() => setSeekHover(false)}
      >
        <div className="relative">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={0.1}
            onValueChange={(values) => {
              seek(values[0]);
              setIsChanging(true);
            }}
            className={cn(
              "h-3 cursor-pointer z-10 transition-all duration-300",
              seekHover ? "scale-y-[1.2]" : "",
              {
                "[&_.SliderTrack]:bg-midnight-secondary/40 [&_.SliderRange]:bg-midnight-accent [&_.SliderThumb]:border-midnight-accent [&_.SliderThumb]:bg-midnight-text": currentTheme === 'midnight',
                "[&_.SliderTrack]:bg-ocean-secondary/40 [&_.SliderRange]:bg-ocean-accent [&_.SliderThumb]:border-ocean-accent [&_.SliderThumb]:bg-ocean-text": currentTheme === 'ocean',
                "[&_.SliderTrack]:bg-sunset-secondary/40 [&_.SliderRange]:bg-sunset-accent [&_.SliderThumb]:border-sunset-accent [&_.SliderThumb]:bg-sunset-text": currentTheme === 'sunset',
                "[&_.SliderTrack]:bg-forest-secondary/40 [&_.SliderRange]:bg-forest-accent [&_.SliderThumb]:border-forest-accent [&_.SliderThumb]:bg-forest-text": currentTheme === 'forest',
                "[&_.SliderTrack]:bg-candy-secondary/40 [&_.SliderRange]:bg-candy-accent [&_.SliderThumb]:border-candy-accent [&_.SliderThumb]:bg-candy-text": currentTheme === 'candy',
              }
            )}
          />
          
          {/* Enhanced glow effect on slider track */}
          <div 
            className={cn(
              "absolute bottom-0 h-1 opacity-70 blur-[3px] rounded-full transition-all duration-500 ease-out",
              {
                "bg-midnight-accent": currentTheme === 'midnight',
                "bg-ocean-accent": currentTheme === 'ocean',
                "bg-sunset-accent": currentTheme === 'sunset',
                "bg-forest-accent": currentTheme === 'forest',
                "bg-candy-accent": currentTheme === 'candy',
              }
            )} 
            style={{ 
              width: `${progressPercentage}%`,
              opacity: seekHover ? 0.9 : 0.5,
              height: seekHover ? '8px' : '4px',
              transform: `translateY(${seekHover ? '-2px' : '0px'})`,
            }}
          />
        </div>
        
        <div className={cn(
          "flex justify-between text-sm mt-2 font-medium transition-all duration-300",
          isChanging ? "animate-fade-in" : ""
        )}>
          <span className={cn(
            "transition-all duration-300",
            {
              "text-midnight-text": currentTheme === 'midnight',
              "text-ocean-text": currentTheme === 'ocean',
              "text-sunset-text": currentTheme === 'sunset',
              "text-forest-text": currentTheme === 'forest',
              "text-candy-text": currentTheme === 'candy',
            }
          )}>{formatTime(currentTime)}</span>
          <span className={cn(
            "transition-all duration-300",
            {
              "text-midnight-text/70": currentTheme === 'midnight',
              "text-ocean-text/70": currentTheme === 'ocean',
              "text-sunset-text/70": currentTheme === 'sunset',
              "text-forest-text/70": currentTheme === 'forest',
              "text-candy-text/70": currentTheme === 'candy',
            }
          )}>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Enhanced Controls with new animations */}
      <div className="flex items-center justify-center gap-8 mb-4 relative">
        <button
          onClick={() => handleControlClick('prev')}
          className={cn(
            "p-3 rounded-full transition-all duration-200",
            buttonPress === 'prev' ? "scale-90" : "hover:scale-110",
            {
              "text-midnight-text hover:bg-midnight-secondary/30": currentTheme === 'midnight',
              "text-ocean-text hover:bg-ocean-secondary/30": currentTheme === 'ocean',
              "text-sunset-text hover:bg-sunset-secondary/30": currentTheme === 'sunset',
              "text-forest-text hover:bg-forest-secondary/30": currentTheme === 'forest',
              "text-candy-text hover:bg-candy-secondary/30": currentTheme === 'candy',
            }
          )}
          aria-label="Previous song"
        >
          <SkipBack size={28} className="transition-transform duration-200" />
        </button>
        
        <button
          onClick={() => handleControlClick('play')}
          className={cn(
            "p-5 rounded-full transition-all duration-200 shadow-lg flex items-center justify-center relative",
            buttonPress === 'play' ? "scale-90" : "hover:scale-105",
            {
              "bg-midnight-accent text-midnight-text hover:bg-midnight-accent/90": currentTheme === 'midnight',
              "bg-ocean-accent text-ocean-text hover:bg-ocean-accent/90": currentTheme === 'ocean',
              "bg-sunset-accent text-sunset-text hover:bg-sunset-accent/90": currentTheme === 'sunset',
              "bg-forest-accent text-forest-text hover:bg-forest-accent/90": currentTheme === 'forest',
              "bg-candy-accent text-candy-text hover:bg-candy-accent/90": currentTheme === 'candy',
            }
          )}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? 
            <Pause size={32} className="animate-fade-in transition-transform duration-200" /> : 
            <Play size={32} className="ml-1 animate-fade-in transition-transform duration-200" />
          }

          {/* Enhanced pulsing animation ring */}
          {isPlaying && (
            <div 
              className={cn(
                "absolute inset-0 rounded-full animate-ping opacity-30",
                {
                  "bg-midnight-accent": currentTheme === 'midnight',
                  "bg-ocean-accent": currentTheme === 'ocean',
                  "bg-sunset-accent": currentTheme === 'sunset',
                  "bg-forest-accent": currentTheme === 'forest',
                  "bg-candy-accent": currentTheme === 'candy',
                }
              )}
              style={{ animationDuration: '2s' }}
            />
          )}
        </button>
        
        <button
          onClick={() => handleControlClick('next')}
          className={cn(
            "p-3 rounded-full transition-all duration-200",
            buttonPress === 'next' ? "scale-90" : "hover:scale-110",
            {
              "text-midnight-text hover:bg-midnight-secondary/30": currentTheme === 'midnight',
              "text-ocean-text hover:bg-ocean-secondary/30": currentTheme === 'ocean',
              "text-sunset-text hover:bg-sunset-secondary/30": currentTheme === 'sunset',
              "text-forest-text hover:bg-forest-secondary/30": currentTheme === 'forest',
              "text-candy-text hover:bg-candy-secondary/30": currentTheme === 'candy',
            }
          )}
          aria-label="Next song"
        >
          <SkipForward size={28} className="transition-transform duration-200" />
        </button>
      </div>
      
      {/* Enhanced music wave animation when playing */}
      {isPlaying && (
        <div className="flex justify-center mt-1 opacity-70">
          <Music2 
            size={20} 
            className={cn(
              "animate-bounce",
              {
                "text-midnight-accent": currentTheme === 'midnight',
                "text-ocean-accent": currentTheme === 'ocean',
                "text-sunset-accent": currentTheme === 'sunset',
                "text-forest-accent": currentTheme === 'forest',
                "text-candy-accent": currentTheme === 'candy',
              }
            )} 
            style={{ animationDuration: '2s' }} 
          />
        </div>
      )}
    </div>
  );
};

export default PlayerControls;
