
import React, { useEffect } from 'react';
import { useMusic } from '@/components/MusicContext';
import { usePlaylist } from '@/hooks/usePlaylist';

import AlbumCover from '@/components/AlbumCover';
import SongInfo from '@/components/SongInfo';
import PlayerControls from '@/components/PlayerControls';
import LyricsDisplay from '@/components/LyricsDisplay';
import LanguageSelector from '@/components/LanguageSelector';
import PlaylistView from '@/components/PlaylistView';
import TopNav from '@/components/TopNav';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';

interface MusicPlayerProps {
  showFavorites?: boolean;
}

const MusicPlayer: React.FC<MusicPlayerProps> = () => {
  const { currentTheme, filteredSongs, likedSongs, showFavoritesOnly, dbSongs, user } = useMusic();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  // Add smooth transition when theme changes
  useEffect(() => {
    document.body.classList.add('theme-transition');
    return () => {
      document.body.classList.remove('theme-transition');
    };
  }, []);

  useEffect(() => {
    toast({
      title: `Welcome ${user.displayName}`,
      description: `Sign in with ${user.email} email`,
    });
  }, []);

  const getBackgroundStyle = () => {
    switch (currentTheme) {
      case 'midnight':
        return "bg-gradient-to-br from-midnight-primary to-midnight-secondary";
      case 'ocean':
        return "bg-gradient-to-br from-ocean-primary to-ocean-secondary";
      case 'sunset':
        return "bg-gradient-to-br from-sunset-primary to-sunset-secondary";
      case 'forest':
        return "bg-gradient-to-br from-forest-primary to-forest-secondary";
      case 'candy':
        return "bg-gradient-to-br from-candy-primary to-candy-secondary";
    }
  };

  // Filter songs if showFavoritesOnly is true
  const displaySongs = showFavoritesOnly
    ? dbSongs.filter(song => likedSongs.includes(song.id))
    : filteredSongs;
  return (
    <div
      className={cn(
        "min-h-screen flex flex-col w-full animate-fade-in transition-all duration-700",
        isMobile ? "pt-20" : "pt-16", getBackgroundStyle()
      )}
    >
      <TopNav />
      <div className="container mx-auto max-w-screen-xl">
        <div className="flex flex-col md:flex-row w-full p-4 md:p-8 lg:p-12 gap-8">
          {/* Left column - Player controls */}
          <div className="w-full md:w-1/2 lg:w-2/5 p-4 flex flex-col items-center animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="max-w-xs w-full">
              <AlbumCover />
              <div className="mb-4">
                <SongInfo />
              </div>
              <PlayerControls />
              <div className="md:hidden mt-6">
                <LanguageSelector />
              </div>
            </div>
          </div>

          {/* Right column - Lyrics and settings */}
          <div className="w-full md:w-1/2 lg:w-3/5 p-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div
              className={cn(
                "rounded-xl p-6 shadow-xl backdrop-blur-sm transition-all duration-500",
                {
                  "bg-midnight-secondary/30": currentTheme === 'midnight',
                  "bg-ocean-secondary/30": currentTheme === 'ocean',
                  "bg-sunset-secondary/30": currentTheme === 'sunset',
                  "bg-forest-secondary/30": currentTheme === 'forest',
                  "bg-candy-secondary/30": currentTheme === 'candy',
                }
              )}
            >
              <LyricsDisplay />
              <div className="hidden md:block">
                <LanguageSelector />
              </div>
              <PlaylistView songs={displaySongs} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;