
import React, { useState } from 'react';
import { useMusic } from '@/components/MusicContext';
import { cn } from '@/lib/utils';
import AlbumCoverAnimations from '@/components/AlbumCoverAnimations';
import AlbumCoverActions from '@/components/AlbumCoverActions';
import AlbumCoverInteractions from '@/components/AlbumCoverInteractions';
import default_img from '../default.jpeg'
const AlbumCover: React.FC = () => {
  const { 
    currentSong, 
    isPlaying, 
    currentTheme,
    shareCurrentSong,
    downloadCurrentSong,
    toggleLike,
    isLiked
  } = useMusic();

  // States for interaction feedback
  const [isDoubleClicking, setIsDoubleClicking] = useState(false);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const [showShareAnimation, setShowShareAnimation] = useState(false);

  if (!currentSong) return null;

  // Fallback to placeholder image if cover not available
  const coverSrc = currentSong.cover || default_img;

  const handleDownload = (format: 'mp3' | 'opus') => {
    downloadCurrentSong(format);
  };

  const handleDoubleClick = () => {
    setIsDoubleClicking(true);
    setShowLikeAnimation(true);
    
    setTimeout(() => {
      setIsDoubleClicking(false);
      setShowLikeAnimation(false);
    }, 600);
  };

  const handleLongPress = () => {
    setIsLongPressing(true);
    setShowShareAnimation(true);
    
    setTimeout(() => {
      setIsLongPressing(false);
      setShowShareAnimation(false);
    }, 600);
  };

  return (
    <div className="w-full aspect-square overflow-hidden rounded-2xl relative group">
      <AlbumCoverInteractions
        songId={currentSong.id}
        onToggleLike={toggleLike}
        onShare={shareCurrentSong}
        onDoubleClick={handleDoubleClick}
        onLongPress={handleLongPress}
      >
        <div
          className={cn(
            "w-full h-full transition-all duration-700 cursor-pointer select-none",
            isPlaying ? "scale-105 rotate-3" : "scale-100 rotate-0",
            "group-hover:scale-105",
            isDoubleClicking && "animate-pulse",
            isLongPressing && "scale-95",
            {
              "shadow-xl shadow-midnight-accent/30": currentTheme === 'midnight',
              "shadow-xl shadow-ocean-accent/30": currentTheme === 'ocean',
              "shadow-xl shadow-sunset-accent/30": currentTheme === 'sunset',
              "shadow-xl shadow-forest-accent/30": currentTheme === 'forest',
              "shadow-xl shadow-candy-accent/30": currentTheme === 'candy',
            }
          )}
        >
          <img
            src={coverSrc}
            alt={`${currentSong.title} by ${currentSong.artist}`}
            className="w-full h-full object-cover rounded-2xl transform transition-all duration-700 pointer-events-none"
            draggable={false}
          />
          
          {/* Animated overlay when playing */}
          {isPlaying && (
            <div 
              className={cn(
                "absolute inset-0 opacity-40 rounded-2xl",
                {
                  "bg-gradient-to-br from-midnight-accent/20 to-transparent": currentTheme === 'midnight',
                  "bg-gradient-to-br from-ocean-accent/20 to-transparent": currentTheme === 'ocean',
                  "bg-gradient-to-br from-sunset-accent/20 to-transparent": currentTheme === 'sunset',
                  "bg-gradient-to-br from-forest-accent/20 to-transparent": currentTheme === 'forest',
                  "bg-gradient-to-br from-candy-accent/20 to-transparent": currentTheme === 'candy',
                }
              )}
            />
          )}
          
          {/* Playing indicator */}
          {isPlaying && (
            <div 
              className={cn(
                "absolute top-3 right-3 w-3 h-3 rounded-full animate-pulse",
                {
                  "bg-midnight-accent": currentTheme === 'midnight',
                  "bg-ocean-accent": currentTheme === 'ocean',
                  "bg-sunset-accent": currentTheme === 'sunset',
                  "bg-forest-accent": currentTheme === 'forest',
                  "bg-candy-accent": currentTheme === 'candy',
                }
              )}
            />
          )}

          <AlbumCoverAnimations
            showLikeAnimation={showLikeAnimation}
            showShareAnimation={showShareAnimation}
            isLiked={isLiked(currentSong.id)}
            currentTheme={currentTheme}
          />

          {/* Interaction Hints */}
          <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className={cn(
              "text-xs text-center py-1 px-2 rounded-lg backdrop-blur-sm",
              {
                "bg-midnight-secondary/80 text-midnight-text": currentTheme === 'midnight',
                "bg-ocean-secondary/80 text-ocean-text": currentTheme === 'ocean',
                "bg-sunset-secondary/80 text-sunset-text": currentTheme === 'sunset',
                "bg-forest-secondary/80 text-forest-text": currentTheme === 'forest',
                "bg-candy-secondary/80 text-candy-text": currentTheme === 'candy',
              }
            )}>
              Double-tap to like • Long press to share
            </div>
          </div>
        </div>
      </AlbumCoverInteractions>
      
      <AlbumCoverActions
        currentSong={currentSong}
        currentTheme={currentTheme}
        onDownload={handleDownload}
        onShare={shareCurrentSong}
      />
    </div>
  );
};

export default AlbumCover;
