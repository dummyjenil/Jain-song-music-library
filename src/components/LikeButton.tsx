
import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useMusic } from '@/components/MusicContext';
import { cn } from '@/lib/utils';

interface LikeButtonProps {
  songId: string;
  size?: number;
  className?: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ songId, size = 20, className }) => {
  const { toggleLike, isLiked, currentTheme } = useMusic();
  const [isAnimating, setIsAnimating] = useState(false);
  
  const liked = isLiked(songId);
  
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAnimating(true);
    toggleLike(songId);
    
    // Reset animation after it completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };
  
  return (
    <button
      onClick={handleLike}
      className={cn(
        "relative transition-transform duration-200 outline-none",
        isAnimating ? "animate-scale-up" : "",
        className
      )}
      aria-label={liked ? "Unlike song" : "Like song"}
    >
      <Heart 
        size={size} 
        className={cn(
          "transition-all duration-300",
          {
            "fill-midnight-accent text-midnight-accent": liked && currentTheme === 'midnight',
            "fill-ocean-accent text-ocean-accent": liked && currentTheme === 'ocean',
            "fill-sunset-accent text-sunset-accent": liked && currentTheme === 'sunset',
            "fill-forest-accent text-forest-accent": liked && currentTheme === 'forest',
            "fill-candy-accent text-candy-accent": liked && currentTheme === 'candy',
            "text-midnight-text/70 hover:text-midnight-accent": !liked && currentTheme === 'midnight',
            "text-ocean-text/70 hover:text-ocean-accent": !liked && currentTheme === 'ocean',
            "text-sunset-text/70 hover:text-sunset-accent": !liked && currentTheme === 'sunset',
            "text-forest-text/70 hover:text-forest-accent": !liked && currentTheme === 'forest',
            "text-candy-text/70 hover:text-candy-accent": !liked && currentTheme === 'candy',
          }
        )}
      />
      
      {/* Animation elements */}
      {isAnimating && liked && (
        <>
          <span className="absolute inset-0 animate-ping opacity-75 rounded-full">
            <Heart 
              size={size} 
              className={cn(
                "transition-all duration-300",
                {
                  "text-midnight-accent": currentTheme === 'midnight',
                  "text-ocean-accent": currentTheme === 'ocean',
                  "text-sunset-accent": currentTheme === 'sunset',
                  "text-forest-accent": currentTheme === 'forest',
                  "text-candy-accent": currentTheme === 'candy',
                }
              )}
            />
          </span>
          <span className="absolute -top-1 -right-1 text-xs font-bold animate-fade-in" 
                style={{animationDuration: '0.3s'}}>
            <span className={cn(
              "inline-block animate-slide-up",
              {
                "text-midnight-accent": currentTheme === 'midnight',
                "text-ocean-accent": currentTheme === 'ocean',
                "text-sunset-accent": currentTheme === 'sunset',
                "text-forest-accent": currentTheme === 'forest',
                "text-candy-accent": currentTheme === 'candy',
              }
            )}>
              +1
            </span>
          </span>
        </>
      )}
    </button>
  );
};

export default LikeButton;
