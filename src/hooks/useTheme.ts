
import { useState } from 'react';
import { Theme, Language } from '@/types/music';
import { useToast } from '@/hooks/use-toast';

export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState<Theme>('candy');
  const [currentLanguage, setCurrentLanguage] = useState<Language>('gujarati');
  const { toast } = useToast();

  const setTheme = (theme: Theme) => {
    setCurrentTheme(theme);
  };

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
    toast({
      title: "Language Changed",
      description: `Lyrics now displayed in ${language.charAt(0).toUpperCase() + language.slice(1)}`,
    });
  };

  return {
    currentTheme,
    currentLanguage,
    setTheme,
    setLanguage,
  };
};
