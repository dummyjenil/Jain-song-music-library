
import React from 'react';
import { useMusic } from '@/components/MusicContext';
import { cn } from '@/lib/utils';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchTypeSelectorProps {
  isDesktop?: boolean;
}

const SearchTypeSelector: React.FC<SearchTypeSelectorProps> = ({ isDesktop = false }) => {
  const { currentTheme } = useMusic();

  const handleSearchTypeChange = (value: string) => {
    if (value === 'all' || value === 'title' || value === 'artist' || value === 'lyrics') {
      document.dispatchEvent(new CustomEvent('setSearchType', { detail: value }));
    }
  };

  return (
    <Select onValueChange={handleSearchTypeChange} defaultValue="all">
      <SelectTrigger 
        className={cn(
          "transition-colors backdrop-blur-xl border-[1.5px] shadow-lg",
          isDesktop ? 
            "h-10 w-32 rounded-l-none rounded-r-xl border-[1px]" : 
            "h-12 rounded-xl",
          {
            "bg-midnight-secondary/50 border-midnight-accent/30 focus-visible:ring-midnight-accent/50 text-midnight-text": currentTheme === 'midnight',
            "bg-ocean-secondary/50 border-ocean-accent/30 focus-visible:ring-ocean-accent/50 text-ocean-text": currentTheme === 'ocean',
            "bg-sunset-secondary/50 border-sunset-accent/30 focus-visible:ring-sunset-accent/50 text-sunset-text": currentTheme === 'sunset',
            "bg-forest-secondary/50 border-forest-accent/30 focus-visible:ring-forest-accent/50 text-forest-text": currentTheme === 'forest',
            "bg-candy-secondary/50 border-candy-accent/30 focus-visible:ring-candy-accent/50 text-candy-text": currentTheme === 'candy',
          }
        )}
      >
        <SelectValue placeholder="Search by" />
      </SelectTrigger>
      <SelectContent className={cn(
        "backdrop-blur-xl border-[1.5px]",
        {
          "bg-midnight-secondary/80 border-midnight-accent/30": currentTheme === 'midnight',
          "bg-ocean-secondary/80 border-ocean-accent/30": currentTheme === 'ocean',
          "bg-sunset-secondary/80 border-sunset-accent/30": currentTheme === 'sunset',
          "bg-forest-secondary/80 border-forest-accent/30": currentTheme === 'forest',
          "bg-candy-secondary/80 border-candy-accent/30": currentTheme === 'candy',
        }
      )}>
        <SelectItem value="all">All</SelectItem>
        <SelectItem value="title">Title</SelectItem>
        <SelectItem value="artist">Artist</SelectItem>
        <SelectItem value="lyrics">Lyrics</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default SearchTypeSelector;
