
import React from 'react';
import ThemeSelector from './ThemeSelector';
import SearchBar from './SearchBar';
import { useMusic } from '@/components/MusicContext';
import { cn } from '@/lib/utils';
import { Heart } from 'lucide-react';

const TopNav: React.FC = () => {
  const { currentTheme, toggleFavoritesView, showFavoritesOnly, resetToDefaultSong } = useMusic();
  const handleTitleClick = () => {
    resetToDefaultSong();
  };

  const handleFavoritesClick = () => {
    toggleFavoritesView();
  };

  return (
    <div
      className={cn(
        "w-full backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 z-20 fixed top-0 left-0 right-0 border-b transition-colors duration-300",
        {
          "border-midnight-secondary/30": currentTheme === 'midnight',
          "border-ocean-secondary/30": currentTheme === 'ocean',
          "border-sunset-secondary/30": currentTheme === 'sunset',
          "border-forest-secondary/30": currentTheme === 'forest',
          "border-candy-secondary/30": currentTheme === 'candy',
        }
      )}
    >
      <div className="container flex items-center justify-between h-16 max-w-screen-2xl mx-auto px-4">
        <div className="flex items-center gap-2">
          <div
            onClick={handleTitleClick}

            className={cn(
              "font-bold text-xl transition-colors",
              {
                "text-midnight-accent": currentTheme === 'midnight',
                "text-ocean-accent": currentTheme === 'ocean',
                "text-sunset-accent": currentTheme === 'sunset',
                "text-forest-accent": currentTheme === 'forest',
                "text-candy-accent": currentTheme === 'candy',
              }
            )}
          >
            Jain Song
          </div>
        </div>
        <div className="flex-1 mx-4">
          <SearchBar />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleFavoritesClick}
            className={cn(
              "p-2 rounded-full transition-colors duration-300 hover-scale flex items-center gap-1.5",
              {
                "bg-midnight-accent/20 text-midnight-accent": showFavoritesOnly && currentTheme === 'midnight',
                "bg-ocean-accent/20 text-ocean-accent": showFavoritesOnly && currentTheme === 'ocean',
                "bg-sunset-accent/20 text-sunset-accent": showFavoritesOnly && currentTheme === 'sunset',
                "bg-forest-accent/20 text-forest-accent": showFavoritesOnly && currentTheme === 'forest',
                "bg-candy-accent/20 text-candy-accent": showFavoritesOnly && currentTheme === 'candy',

                "hover:bg-midnight-secondary/30 text-midnight-accent": !showFavoritesOnly && currentTheme === 'midnight',
                "hover:bg-ocean-secondary/30 text-ocean-accent": !showFavoritesOnly && currentTheme === 'ocean',
                "hover:bg-sunset-secondary/30 text-sunset-accent": !showFavoritesOnly && currentTheme === 'sunset',
                "hover:bg-forest-secondary/30 text-forest-accent": !showFavoritesOnly && currentTheme === 'forest',
                "hover:bg-candy-secondary/30 text-candy-accent": !showFavoritesOnly && currentTheme === 'candy',
              }
            )}
          >
            <Heart
              size={20}
              className={cn(
                "transition-all",
                {
                  "fill-midnight-accent text-midnight-accent": showFavoritesOnly && currentTheme === 'midnight',
                  "fill-ocean-accent text-ocean-accent": showFavoritesOnly && currentTheme === 'ocean',
                  "fill-sunset-accent text-sunset-accent": showFavoritesOnly && currentTheme === 'sunset',
                  "fill-forest-accent text-forest-accent": showFavoritesOnly && currentTheme === 'forest',
                  "fill-candy-accent text-candy-accent": showFavoritesOnly && currentTheme === 'candy',
                }
              )}
            />
            <span className="hidden sm:inline text-sm font-medium">Favorites</span>
          </button>
          <ThemeSelector />
        </div>
      </div>
    </div>
  );
};

export default TopNav;