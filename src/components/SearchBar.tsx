
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useMusic } from '@/components/MusicContext';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';

type SearchType = 'all' | 'title' | 'artist' | 'lyrics';

const SearchBar = () => {
  const { currentTheme, searchQuery, setSearchQuery } = useMusic();
  const isMobile = useIsMobile();
  const [showSearchOnMobile, setShowSearchOnMobile] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchTypeChange = (value: string) => {
    // Set search type through usePlaylist (handled via MusicContext)
    if (value === 'all' || value === 'title' || value === 'artist' || value === 'lyrics') {
      // Access the setSearchType from usePlaylist
      document.dispatchEvent(new CustomEvent('setSearchType', { detail: value }));
    }
  };

  // For mobile, show a collapsed version that expands on click
  if (isMobile && !showSearchOnMobile) {
    return (
      <Button
        onClick={() => setShowSearchOnMobile(true)}
        variant="ghost"
        size="sm" 
        className={cn(
          "flex items-center gap-2 shadow-md backdrop-blur-sm w-full max-w-[160px] mx-auto animate-fade-in",
          {
            "bg-midnight-secondary/30": currentTheme === 'midnight',
            "bg-ocean-secondary/30": currentTheme === 'ocean',
            "bg-sunset-secondary/30": currentTheme === 'sunset',
            "bg-forest-secondary/30": currentTheme === 'forest',
            "bg-candy-secondary/30": currentTheme === 'candy',
          }
        )}
      >
        <Search size={16} />
        <span className="text-sm">Search songs...</span>
      </Button>
    );
  }

  return (
    <div className={cn(
      "relative w-full max-w-md mx-auto animate-fade-in",
      isMobile ? "flex flex-col gap-2" : "flex"
    )}>
      <div className="relative flex-1">
        <Search 
          className={cn(
            "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform",
            {
              "text-midnight-text/50": currentTheme === 'midnight',
              "text-ocean-text/50": currentTheme === 'ocean',
              "text-sunset-text/50": currentTheme === 'sunset',
              "text-forest-text/50": currentTheme === 'forest',
              "text-candy-text/50": currentTheme === 'candy',
            }
          )}
        />
        <Input
          type="search"
          placeholder="Search songs..."
          value={searchQuery}
          onChange={handleSearchChange}
          className={cn(
            "w-full pl-10 pr-4 h-9 text-sm transition-colors bg-white/10 border-0 focus-visible:ring-1",
            !isMobile && "rounded-r-none",
            {
              "placeholder:text-midnight-text/50 focus-visible:ring-midnight-accent": currentTheme === 'midnight',
              "placeholder:text-ocean-text/50 focus-visible:ring-ocean-accent": currentTheme === 'ocean',
              "placeholder:text-sunset-text/50 focus-visible:ring-sunset-accent": currentTheme === 'sunset',
              "placeholder:text-forest-text/50 focus-visible:ring-forest-accent": currentTheme === 'forest',
              "placeholder:text-candy-text/50 focus-visible:ring-candy-accent": currentTheme === 'candy',
            }
          )}
        />
        
        {/* Close button for mobile */}
        {isMobile && showSearchOnMobile && (
          <button 
            onClick={() => setShowSearchOnMobile(false)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs rounded-full w-5 h-5 flex items-center justify-center bg-black/20"
          >
            ✕
          </button>
        )}
      </div>
      
      <Select onValueChange={handleSearchTypeChange} defaultValue="all">
        <SelectTrigger 
          className={cn(
            "h-9 transition-colors bg-white/10 border-0 focus-visible:ring-1",
            !isMobile ? "w-32 rounded-l-none" : "w-full",
            {
              "focus-visible:ring-midnight-accent": currentTheme === 'midnight',
              "focus-visible:ring-ocean-accent": currentTheme === 'ocean',
              "focus-visible:ring-sunset-accent": currentTheme === 'sunset',
              "focus-visible:ring-forest-accent": currentTheme === 'forest',
              "focus-visible:ring-candy-accent": currentTheme === 'candy',
            }
          )}
        >
          <SelectValue placeholder="Search by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="title">Title</SelectItem>
          <SelectItem value="artist">Artist</SelectItem>
          <SelectItem value="lyrics">Lyrics</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SearchBar;
