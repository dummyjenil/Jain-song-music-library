
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Share2, Download, Music2, FileAudio } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import LikeButton from '@/components/LikeButton';
import { Song, Theme } from '@/types/music';

interface AlbumCoverActionsProps {
  currentSong: Song;
  currentTheme: Theme;
  onDownload: (format: 'mp3' | 'opus') => void;
  onShare: () => void;
}

const AlbumCoverActions: React.FC<AlbumCoverActionsProps> = ({
  currentSong,
  currentTheme,
  onDownload,
  onShare
}) => {
  const [downloadFormat, setDownloadFormat] = useState<'mp3' | 'opus'>('mp3');

  const handleDownload = (format: 'mp3' | 'opus') => {
    setDownloadFormat(format);
    onDownload(format);
  };

  return (
    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col items-center gap-6">
      {/* Like button */}
      <div className="flex justify-center">
        <LikeButton 
          songId={currentSong.id} 
          size={26}
          className={cn(
            "bg-black/20 backdrop-blur-sm p-2 rounded-full transition-transform hover:scale-110",
            {
              "hover:bg-midnight-secondary/50": currentTheme === 'midnight',
              "hover:bg-ocean-secondary/50": currentTheme === 'ocean',
              "hover:bg-sunset-secondary/50": currentTheme === 'sunset',
              "hover:bg-forest-secondary/50": currentTheme === 'forest',
              "hover:bg-candy-secondary/50": currentTheme === 'candy',
            }
          )}
        />
      </div>
      
      {/* Download button with options */}
      <Popover>
        <PopoverTrigger asChild>
          <button
            className={cn(
              "flex items-center justify-center bg-black/20 backdrop-blur-sm p-2 rounded-full transition-transform hover:scale-110",
              {
                "text-midnight-text hover:bg-midnight-secondary/50": currentTheme === 'midnight',
                "text-ocean-text hover:bg-ocean-secondary/50": currentTheme === 'ocean',
                "text-sunset-text hover:bg-sunset-secondary/50": currentTheme === 'sunset',
                "text-forest-text hover:bg-forest-secondary/50": currentTheme === 'forest',
                "text-candy-text hover:bg-candy-secondary/50": currentTheme === 'candy',
              }
            )}
            aria-label="Download song"
          >
            <Download size={26} />
          </button>
        </PopoverTrigger>
        <PopoverContent 
          className={cn(
            "w-48 p-0 animate-scale-up backdrop-blur-lg border-none rounded-xl shadow-xl",
            {
              "bg-midnight-secondary/90": currentTheme === 'midnight',
              "bg-ocean-secondary/90": currentTheme === 'ocean',
              "bg-sunset-secondary/90": currentTheme === 'sunset',
              "bg-forest-secondary/90": currentTheme === 'forest',
              "bg-candy-secondary/90": currentTheme === 'candy',
            }
          )}
          sideOffset={10}
          align="center"
        >
          <div className="p-2 space-y-1">
            <h3 className={cn(
              "text-sm font-medium px-2 py-1.5",
              {
                "text-midnight-text": currentTheme === 'midnight',
                "text-ocean-text": currentTheme === 'ocean',
                "text-sunset-text": currentTheme === 'sunset',
                "text-forest-text": currentTheme === 'forest',
                "text-candy-text": currentTheme === 'candy',
              }
            )}>
              Download Format
            </h3>
            
            <button
              className={cn(
                "flex items-center w-full gap-2 px-2 py-2 rounded-lg transition-all duration-200",
                {
                  "hover:bg-midnight-accent/20 text-midnight-text": currentTheme === 'midnight',
                  "hover:bg-ocean-accent/20 text-ocean-text": currentTheme === 'ocean',
                  "hover:bg-sunset-accent/20 text-sunset-text": currentTheme === 'sunset',
                  "hover:bg-forest-accent/20 text-forest-text": currentTheme === 'forest',
                  "hover:bg-candy-accent/20 text-candy-text": currentTheme === 'candy',
                }
              )}
              onClick={() => handleDownload('mp3')}
            >
              <Music2 
                size={18} 
                className={cn({
                  "text-midnight-accent": currentTheme === 'midnight',
                  "text-ocean-accent": currentTheme === 'ocean',
                  "text-sunset-accent": currentTheme === 'sunset',
                  "text-forest-accent": currentTheme === 'forest',
                  "text-candy-accent": currentTheme === 'candy',
                })}
              />
              <span className="text-sm font-medium">MP3 Format</span>
            </button>
            
            <button
              className={cn(
                "flex items-center w-full gap-2 px-2 py-2 rounded-lg transition-all duration-200",
                {
                  "hover:bg-midnight-accent/20 text-midnight-text": currentTheme === 'midnight',
                  "hover:bg-ocean-accent/20 text-ocean-text": currentTheme === 'ocean',
                  "hover:bg-sunset-accent/20 text-sunset-text": currentTheme === 'sunset',
                  "hover:bg-forest-accent/20 text-forest-text": currentTheme === 'forest',
                  "hover:bg-candy-accent/20 text-candy-text": currentTheme === 'candy',
                }
              )}
              onClick={() => handleDownload('opus')}
            >
              <FileAudio 
                size={18} 
                className={cn({
                  "text-midnight-accent": currentTheme === 'midnight',
                  "text-ocean-accent": currentTheme === 'ocean',
                  "text-sunset-accent": currentTheme === 'sunset',
                  "text-forest-accent": currentTheme === 'forest',
                  "text-candy-accent": currentTheme === 'candy',
                })}
              />
              <span className="text-sm font-medium">OPUS Format</span>
            </button>
          </div>
        </PopoverContent>
      </Popover>
      
      {/* Share button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onShare}
            className={cn(
              "flex items-center justify-center bg-black/20 backdrop-blur-sm p-2 rounded-full transition-transform hover:scale-110",
              {
                "text-midnight-text hover:bg-midnight-secondary/50": currentTheme === 'midnight',
                "text-ocean-text hover:bg-ocean-secondary/50": currentTheme === 'ocean',
                "text-sunset-text hover:bg-sunset-secondary/50": currentTheme === 'sunset',
                "text-forest-text hover:bg-forest-secondary/50": currentTheme === 'forest',
                "text-candy-text hover:bg-candy-secondary/50": currentTheme === 'candy',
              }
            )}
            aria-label="Share song"
          >
            <Share2 size={26} />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Share this song</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default AlbumCoverActions;
