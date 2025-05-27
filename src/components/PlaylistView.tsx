
import React from 'react';
import { useMusic } from '@/components/MusicContext';
import { cn } from '@/lib/utils';
import { Music, Play, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useLocation } from 'react-router-dom';
import { Song } from '@/types/music';

interface PlaylistViewProps {
  songs?: Song[];
}

const PlaylistView: React.FC<PlaylistViewProps> = ({ songs }) => {
  const { filteredSongs, currentSong, currentTheme, playSong, toggleLike, isLiked, showFavoritesOnly } = useMusic();
  const location = useLocation();
  const { toast } = useToast();
  const handleShareSong = (songId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.share({
      url: window.location.origin + location.pathname + "?type=song_id&data=" + songId
    }).then(
      () => {
        toast({
          title: "Share",
          description: "Sharing Successful",
        });
      }
    ).catch(err => {
      toast({
        title: "Share failed",
        description: "Share failed",
        variant: "destructive"
      });
    });
  };

  if (filteredSongs.length === 0 || songs?.length === 0) {
    return (
      <div className="py-8 text-center">
        <h3 
          className={cn(
            "text-xl font-bold mb-4 transition-colors",
            {
              "text-midnight-text": currentTheme === 'midnight',
              "text-ocean-text": currentTheme === 'ocean',
              "text-sunset-text": currentTheme === 'sunset',
              "text-forest-text": currentTheme === 'forest',
              "text-candy-text": currentTheme === 'candy',
            }
          )}
        >
          {showFavoritesOnly ? "Favorites" : "Playlist"}
        </h3>
        <p
          className={cn(
            "text-md transition-colors",
            {
              "text-midnight-text/70": currentTheme === 'midnight',
              "text-ocean-text/70": currentTheme === 'ocean',
              "text-sunset-text/70": currentTheme === 'sunset',
              "text-forest-text/70": currentTheme === 'forest',
              "text-candy-text/70": currentTheme === 'candy',
            }
          )}
        >
          {showFavoritesOnly 
            ? "No favorite songs yet. Click the heart icon on songs to add them to your favorites." 
            : "No songs match your search criteria."}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 animate-fade-in">
      <h3
        className={cn(
          "text-xl font-bold mb-4 transition-colors",
          {
            "text-midnight-text": currentTheme === 'midnight',
            "text-ocean-text": currentTheme === 'ocean',
            "text-sunset-text": currentTheme === 'sunset',
            "text-forest-text": currentTheme === 'forest',
            "text-candy-text": currentTheme === 'candy',
          }
        )}
      >
        {showFavoritesOnly ? "Favorites" : "Playlist"}
      </h3>
      <div
        className={cn(
          "flex flex-col gap-2 rounded-md overflow-hidden",
          {
            "divide-midnight-secondary": currentTheme === 'midnight',
            "divide-ocean-secondary": currentTheme === 'ocean',
            "divide-sunset-secondary": currentTheme === 'sunset',
            "divide-forest-secondary": currentTheme === 'forest',
            "divide-candy-secondary": currentTheme === 'candy',
          }
        )}
      >
        {((songs?songs:filteredSongs)).map((song) => (
          <div
            key={song.id}
            onClick={() => playSong(song.id)}
            className={cn(
              "flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors",
              {
                "bg-midnight-secondary/50 hover:bg-midnight-secondary": currentTheme === 'midnight',
                "bg-ocean-secondary/50 hover:bg-ocean-secondary": currentTheme === 'ocean',
                "bg-sunset-secondary/50 hover:bg-sunset-secondary": currentTheme === 'sunset',
                "bg-forest-secondary/50 hover:bg-forest-secondary": currentTheme === 'forest',
                "bg-candy-secondary/50 hover:bg-candy-secondary": currentTheme === 'candy',
                "ring-2": currentSong?.id === song.id,
                "ring-midnight-accent": currentSong?.id === song.id && currentTheme === 'midnight',
                "ring-ocean-accent": currentSong?.id === song.id && currentTheme === 'ocean',
                "ring-sunset-accent": currentSong?.id === song.id && currentTheme === 'sunset',
                "ring-forest-accent": currentSong?.id === song.id && currentTheme === 'forest',
                "ring-candy-accent": currentSong?.id === song.id && currentTheme === 'candy',
              }
            )}
          >
            <div className="w-10 h-10 flex-shrink-0 rounded overflow-hidden relative">
              {song.cover ? (
                <img
                  src={song.cover}
                  alt={song.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className={cn(
                    "w-full h-full flex items-center justify-center",
                    {
                      "bg-midnight-primary": currentTheme === 'midnight',
                      "bg-ocean-primary": currentTheme === 'ocean',
                      "bg-sunset-primary": currentTheme === 'sunset',
                      "bg-forest-primary": currentTheme === 'forest',
                      "bg-candy-primary": currentTheme === 'candy',
                    }
                  )}
                >
                  <Music size={16} className="text-white" />
                </div>
              )}
              {currentSong?.id === song.id && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <Play size={16} className="text-white" />
                </div>
              )}
            </div>
            <div className="flex-grow">
              <h4
                className={cn(
                  "font-medium text-sm",
                  {
                    "text-midnight-text": currentTheme === 'midnight',
                    "text-ocean-text": currentTheme === 'ocean',
                    "text-sunset-text": currentTheme === 'sunset',
                    "text-forest-text": currentTheme === 'forest',
                    "text-candy-text": currentTheme === 'candy',
                  }
                )}
              >
                {song.title}
              </h4>
              <p
                className={cn(
                  "text-xs opacity-70",
                  {
                    "text-midnight-text": currentTheme === 'midnight',
                    "text-ocean-text": currentTheme === 'ocean',
                    "text-sunset-text": currentTheme === 'sunset',
                    "text-forest-text": currentTheme === 'forest',
                    "text-candy-text": currentTheme === 'candy',
                  }
                )}
              >
                {song.artist}
              </p>
            </div>

            {/* Share button */}
            <div className="ml-auto">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={(e) => handleShareSong(song.id, e)}
                    className={cn(
                      "p-1.5 rounded-full transition-all duration-200 hover:bg-opacity-20",
                      {
                        "text-midnight-accent hover:bg-midnight-secondary": currentTheme === 'midnight',
                        "text-ocean-accent hover:bg-ocean-secondary": currentTheme === 'ocean',
                        "text-sunset-accent hover:bg-sunset-secondary": currentTheme === 'sunset',
                        "text-forest-accent hover:bg-forest-secondary": currentTheme === 'forest',
                        "text-candy-accent hover:bg-candy-secondary": currentTheme === 'candy',
                      }
                    )}
                    aria-label="Share song"
                  >
                    <Share2 size={16} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share this song</p>
                </TooltipContent>
              </Tooltip>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaylistView;
