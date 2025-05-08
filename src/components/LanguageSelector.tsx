
import React from 'react';
import { useMusic } from '@/components/MusicContext';
import { Language } from '@/types/music';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const LanguageSelector: React.FC = () => {
  const { setLanguage, currentLanguage, currentTheme } = useMusic();

  const languages: { code: Language; label: string }[] = [
    { code: 'gujarati', label: 'ગુજરાતી' },
    { code: 'hindi', label: 'हिन्दी' },
    { code: 'english', label: 'English' },
  ];

  return (
    <div className="mt-6 mb-4">
      <div 
        className={cn(
          "flex flex-wrap gap-2 rounded-lg p-2",
          {
            "bg-midnight-primary/30": currentTheme === 'midnight',
            "bg-ocean-primary/30": currentTheme === 'ocean',
            "bg-sunset-primary/30": currentTheme === 'sunset',
            "bg-forest-primary/30": currentTheme === 'forest',
            "bg-candy-primary/30": currentTheme === 'candy',
          }
        )}
      >
        {languages.map((lang) => (
          <Button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            variant={currentLanguage === lang.code ? "default" : "ghost"}
            className={cn(
              "flex-1 transition-all duration-300",
              {
                "bg-midnight-accent hover:bg-midnight-accent/90 text-midnight-text shadow-md hover:scale-105": 
                  currentLanguage === lang.code && currentTheme === 'midnight',
                "bg-ocean-accent hover:bg-ocean-accent/90 text-ocean-text shadow-md hover:scale-105": 
                  currentLanguage === lang.code && currentTheme === 'ocean',
                "bg-sunset-accent hover:bg-sunset-accent/90 text-sunset-text shadow-md hover:scale-105": 
                  currentLanguage === lang.code && currentTheme === 'sunset',
                "bg-forest-accent hover:bg-forest-accent/90 text-forest-text shadow-md hover:scale-105": 
                  currentLanguage === lang.code && currentTheme === 'forest',
                "bg-candy-accent hover:bg-candy-accent/90 text-candy-text shadow-md hover:scale-105": 
                  currentLanguage === lang.code && currentTheme === 'candy',
                "hover:scale-105": currentLanguage !== lang.code,
              }
            )}
          >
            {lang.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
