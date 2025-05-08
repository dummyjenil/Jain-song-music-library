
import React from 'react';
import { useMusic } from '@/components/MusicContext';
import { Theme } from '@/types/music';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Palette } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ThemeSelector: React.FC = () => {
  const { currentTheme, setTheme } = useMusic();

  const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { 
      value: 'midnight', 
      label: 'Midnight', 
      icon: <div className="w-3 h-3 rounded-full bg-midnight-accent mr-2" />
    },
    { 
      value: 'ocean', 
      label: 'Ocean', 
      icon: <div className="w-3 h-3 rounded-full bg-ocean-accent mr-2" />
    },
    { 
      value: 'sunset', 
      label: 'Sunset', 
      icon: <div className="w-3 h-3 rounded-full bg-sunset-accent mr-2" />
    },
    { 
      value: 'forest', 
      label: 'Forest', 
      icon: <div className="w-3 h-3 rounded-full bg-forest-accent mr-2" />
    },
    { 
      value: 'candy', 
      label: 'Candy', 
      icon: <div className="w-3 h-3 rounded-full bg-candy-accent mr-2" />
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className={cn(
            "rounded-full w-10 h-10 transition-all duration-300 hover:scale-110",
            {
              "text-midnight-accent hover:bg-midnight-secondary/20": currentTheme === 'midnight',
              "text-ocean-accent hover:bg-ocean-secondary/20": currentTheme === 'ocean',
              "text-sunset-accent hover:bg-sunset-secondary/20": currentTheme === 'sunset',
              "text-forest-accent hover:bg-forest-secondary/20": currentTheme === 'forest',
              "text-candy-accent hover:bg-candy-secondary/20": currentTheme === 'candy',
            }
          )}
        >
          <Palette className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 animate-fade-in">
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.value}
            onClick={() => setTheme(theme.value)}
            className={cn(
              "cursor-pointer flex items-center transition-all duration-300 hover:scale-105",
              {
                "bg-midnight-accent/10 text-midnight-text font-medium": currentTheme === theme.value && theme.value === 'midnight',
                "bg-ocean-accent/10 text-ocean-text font-medium": currentTheme === theme.value && theme.value === 'ocean',
                "bg-sunset-accent/10 text-sunset-text font-medium": currentTheme === theme.value && theme.value === 'sunset',
                "bg-forest-accent/10 text-forest-text font-medium": currentTheme === theme.value && theme.value === 'forest',
                "bg-candy-accent/10 text-candy-text font-medium": currentTheme === theme.value && theme.value === 'candy',
              }
            )}
          >
            {theme.icon}
            {theme.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSelector;
