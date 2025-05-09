
import React from 'react';
import { Search } from 'lucide-react';
import { useMusic } from '@/components/MusicContext';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import SearchTypeSelector from './SearchTypeSelector';

interface DesktopSearchProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DesktopSearch: React.FC<DesktopSearchProps> = ({
  searchQuery,
  onSearchChange
}) => {
  const { currentTheme } = useMusic();

  return (
    <div className="relative w-full max-w-md mx-auto animate-fade-in flex">
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
          onChange={onSearchChange}
          className={cn(
            "w-full pl-10 pr-4 h-10 text-sm transition-colors backdrop-blur-xl border-[1px] rounded-l-xl",
            {
              "bg-midnight-secondary/50 placeholder:text-midnight-text/60 border-midnight-accent/40 focus-visible:ring-midnight-accent/50": currentTheme === 'midnight',
              "bg-ocean-secondary/50 placeholder:text-ocean-text/60 border-ocean-accent/40 focus-visible:ring-ocean-accent/50": currentTheme === 'ocean',
              "bg-sunset-secondary/50 placeholder:text-sunset-text/60 border-sunset-accent/40 focus-visible:ring-sunset-accent/50": currentTheme === 'sunset',
              "bg-forest-secondary/50 placeholder:text-forest-text/60 border-forest-accent/40 focus-visible:ring-forest-accent/50": currentTheme === 'forest',
              "bg-candy-secondary/50 placeholder:text-candy-text/60 border-candy-accent/40 focus-visible:ring-candy-accent/50": currentTheme === 'candy',
            }
          )}
        />
      </div>
      
      <SearchTypeSelector isDesktop />
    </div>
  );
};

export default DesktopSearch;
