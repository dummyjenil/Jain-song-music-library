import React, { useState } from 'react';
import { useMusic } from '@/components/MusicContext';
import { cn } from '@/lib/utils';
import { Share2, Download, Music2, FileAudio } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import LikeButton from '@/components/LikeButton';

const AlbumCover: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    currentTheme,
    shareCurrentSong,
    downloadCurrentSong
  } = useMusic();
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<'mp3' | 'opus'>('mp3');
  if (!currentSong) return null;

  // Fallback to placeholder image if cover not available
  const coverSrc = currentSong.cover || 'default.jpeg';
  const handleDownload = (format: 'mp3' | 'opus') => {
    setDownloadFormat(format);
    downloadCurrentSong(format == "mp3");
  };

  return (
    <div className="w-full aspect-square overflow-hidden rounded-2xl relative group">
      <div
        className={cn(
          "w-full h-full transition-all duration-700",
          isPlaying ? "scale-105 rotate-3" : "scale-100 rotate-0",
          "group-hover:scale-105",
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
          className="w-full h-full object-cover rounded-2xl transform transition-all duration-700"
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
      </div>

      {/* Action buttons positioned vertically on the right side */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col items-center gap-6">
        {/* Like button */}
        {currentSong && (
          <Tooltip>
            <TooltipTrigger asChild>
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

            </TooltipTrigger>
            <TooltipContent>
              <p>Like</p>
            </TooltipContent>
          </Tooltip>
        )}

        {/* Download button */}
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
                <span className="text-sm font-medium">MP3 (Very Slow)</span>
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
                <span className="text-sm font-medium">OPUS (Very Fast)</span>
              </button>
            </div>
          </PopoverContent>
        </Popover>
        {/* Share button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={shareCurrentSong}
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
            <p>Share</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>

  );
};

export default AlbumCover;
