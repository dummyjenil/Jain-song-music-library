
import React from 'react';
import { useMusic } from '@/components/MusicContext';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

const LyricsDisplay: React.FC = () => {
  const { currentSong, currentLanguage, currentTheme } = useMusic();

  if (!currentSong) return null;

  const lyrics = currentSong.lyrics[currentLanguage];
  const lyricsArray = lyrics.split('\n');

  return (
    <div className="w-full mt-4">
      <h3 
        className={cn(
          "text-xl font-semibold mb-3",
          {
            "text-midnight-text": currentTheme === 'midnight',
            "text-ocean-text": currentTheme === 'ocean',
            "text-sunset-text": currentTheme === 'sunset',
            "text-forest-text": currentTheme === 'forest',
            "text-candy-text": currentTheme === 'candy',
          }
        )}
      >
        Lyrics
      </h3>
      <ScrollArea 
        className={cn(
          "h-[300px] rounded-md p-4",
          {
            "bg-midnight-secondary/50": currentTheme === 'midnight',
            "bg-ocean-secondary/50": currentTheme === 'ocean',
            "bg-sunset-secondary/50": currentTheme === 'sunset',
            "bg-forest-secondary/50": currentTheme === 'forest',
            "bg-candy-secondary/50": currentTheme === 'candy',
          }
        )}
      >
        <div className="space-y-2">
          {lyricsArray.map((line, index) => (
            <p 
              key={index} 
              className={cn(
                "transition-opacity",
                line.trim() === "" ? "h-4" : "", // Add spacing for empty lines
                {
                  "text-midnight-text/90 font-medium": currentTheme === 'midnight',
                  "text-ocean-text/90 font-medium": currentTheme === 'ocean',
                  "text-sunset-text/90 font-medium": currentTheme === 'sunset',
                  "text-forest-text/90 font-medium": currentTheme === 'forest',
                  "text-candy-text/90 font-medium": currentTheme === 'candy',
                },
                // Handle empty lines and section headers (like Chorus:, Verse:)
                {
                  "text-xs opacity-70": line.trim() === "",
                  "font-bold": line.includes("Chorus:") || line.includes("Verse:") || 
                               line.includes("Coro:") || line.includes("Verso:") ||
                               line.includes("Refrain:") || line.includes("Couplet:")
                }
              )}
            >
              {line}
            </p>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default LyricsDisplay;
