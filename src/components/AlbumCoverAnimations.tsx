
import React from 'react';
import { cn } from '@/lib/utils';
import { Theme } from '@/types/music';

interface AlbumCoverAnimationsProps {
  showLikeAnimation: boolean;
  showShareAnimation: boolean;
  isLiked: boolean;
  currentTheme: Theme;
}

const AlbumCoverAnimations: React.FC<AlbumCoverAnimationsProps> = ({
  showLikeAnimation,
  showShareAnimation,
  isLiked,
  currentTheme
}) => {
  return (
    <>
      <style>
        {`
          @keyframes likeAnimation {
            0% {
              transform: scale(0.5);
              opacity: 0;
            }
            50% {
              transform: scale(1.2);
              opacity: 1;
            }
            100% {
              transform: scale(1);
              opacity: 0;
            }
          }
          
          @keyframes shareAnimation {
            0% {
              transform: scale(0.5) translateY(0);
              opacity: 0;
            }
            50% {
              transform: scale(1.1) translateY(-10px);
              opacity: 1;
            }
            100% {
              transform: scale(1) translateY(-20px);
              opacity: 0;
            }
          }
          
          .like-animation {
            animation: likeAnimation 0.6s ease-out forwards;
          }
          
          .share-animation {
            animation: shareAnimation 0.6s ease-out forwards;
          }
        `}
      </style>
      
      {/* Like Animation Overlay */}
      {showLikeAnimation && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div 
            className={cn(
              "text-6xl like-animation",
              {
                "text-midnight-accent": currentTheme === 'midnight',
                "text-ocean-accent": currentTheme === 'ocean',
                "text-sunset-accent": currentTheme === 'sunset',
                "text-forest-accent": currentTheme === 'forest',
                "text-candy-accent": currentTheme === 'candy',
              }
            )}
          >
            {isLiked ? '💖' : '💔'}
          </div>
        </div>
      )}

      {/* Share Animation Overlay */}
      {showShareAnimation && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div 
            className={cn(
              "text-4xl share-animation",
              {
                "text-midnight-accent": currentTheme === 'midnight',
                "text-ocean-accent": currentTheme === 'ocean',
                "text-sunset-accent": currentTheme === 'sunset',
                "text-forest-accent": currentTheme === 'forest',
                "text-candy-accent": currentTheme === 'candy',
              }
            )}
          >
            📤
          </div>
        </div>
      )}
    </>
  );
};

export default AlbumCoverAnimations;
