
import React from 'react';
import ThemeSelector from './ThemeSelector';
import SearchBar from './SearchBar';
import { useMusic } from '@/components/MusicContext';
import { cn } from '@/lib/utils';
import { Heart, LogOut } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { deleteAllData } from '@/data/songs';

const TopNav: React.FC = () => {
  const { currentTheme, toggleFavoritesView, showFavoritesOnly, resetToDefaultSong, logout } = useMusic();
  const isMobile = useIsMobile();

  const handleFavoritesClick = () => {
    toggleFavoritesView();
  };

  const handleTitleClick = (e: React.MouseEvent) => {
    // Reset to default song instead of preventing navigation
    resetToDefaultSong();
  };

  // Placeholder logout function - will be replaced when authentication is implemented
  const handleLogout = async () => {
    await deleteAllData();
    logout();
  };

  return (
    <div
      className={cn(
        "w-full backdrop-blur-xl supports-[backdrop-filter]:bg-background/20 z-20 fixed top-0 left-0 right-0 border-b transition-colors duration-300",
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
              "font-bold text-xl transition-colors cursor-default",
              {
                "text-midnight-accent": currentTheme === 'midnight',
                "text-ocean-accent": currentTheme === 'ocean',
                "text-sunset-accent": currentTheme === 'sunset',
                "text-forest-accent": currentTheme === 'forest',
                "text-candy-accent": currentTheme === 'candy',
              }
            )}
          >
            JainMelo
          </div>
        </div>

        <div className={cn(
          "flex-1 mx-4",
          isMobile && "flex justify-center"
        )}>
          <SearchBar />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleFavoritesClick}
            className={cn(
              "p-2 rounded-full transition-colors duration-300 hover-scale flex items-center gap-1.5 shadow-lg backdrop-blur-xl",
              {
                "bg-midnight-accent/30 text-midnight-accent": showFavoritesOnly && currentTheme === 'midnight',
                "bg-ocean-accent/30 text-ocean-accent": showFavoritesOnly && currentTheme === 'ocean',
                "bg-sunset-accent/30 text-sunset-accent": showFavoritesOnly && currentTheme === 'sunset',
                "bg-forest-accent/30 text-forest-accent": showFavoritesOnly && currentTheme === 'forest',
                "bg-candy-accent/30 text-candy-accent": showFavoritesOnly && currentTheme === 'candy',

                "bg-midnight-secondary/20 hover:bg-midnight-secondary/40 text-midnight-accent": !showFavoritesOnly && currentTheme === 'midnight',
                "bg-ocean-secondary/20 hover:bg-ocean-secondary/40 text-ocean-accent": !showFavoritesOnly && currentTheme === 'ocean',
                "bg-sunset-secondary/20 hover:bg-sunset-secondary/40 text-sunset-accent": !showFavoritesOnly && currentTheme === 'sunset',
                "bg-forest-secondary/20 hover:bg-forest-secondary/40 text-forest-accent": !showFavoritesOnly && currentTheme === 'forest',
                "bg-candy-secondary/20 hover:bg-candy-secondary/40 text-candy-accent": !showFavoritesOnly && currentTheme === 'candy',
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

          {/* Logout Button - will be shown when authentication is implemented */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleLogout}
                className={cn(
                  "p-2 rounded-full transition-all duration-300 hover-scale shadow-lg backdrop-blur-xl",
                  {
                    "bg-midnight-secondary/20 hover:bg-midnight-secondary/40 text-midnight-accent hover:text-midnight-text": currentTheme === 'midnight',
                    "bg-ocean-secondary/20 hover:bg-ocean-secondary/40 text-ocean-accent hover:text-ocean-text": currentTheme === 'ocean',
                    "bg-sunset-secondary/20 hover:bg-sunset-secondary/40 text-sunset-accent hover:text-sunset-text": currentTheme === 'sunset',
                    "bg-forest-secondary/20 hover:bg-forest-secondary/40 text-forest-accent hover:text-forest-text": currentTheme === 'forest',
                    "bg-candy-secondary/20 hover:bg-candy-secondary/40 text-candy-accent hover:text-candy-text": currentTheme === 'candy',
                  }
                )}
              >
                <LogOut size={20} />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Logout</p>
            </TooltipContent>
          </Tooltip>

          <ThemeSelector />
        </div>
      </div>
    </div>
  );
};

export default TopNav;