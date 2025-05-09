
import React from 'react';
import { Search } from 'lucide-react';
import { useMusic } from '@/components/MusicContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface MobileSearchButtonProps {
  onClick: () => void;
}

const MobileSearchButton: React.FC<MobileSearchButtonProps> = ({ onClick }) => {
  const { currentTheme } = useMusic();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Button
        onClick={onClick}
        variant="ghost"
        size="sm" 
        className={cn(
          "flex items-center justify-center gap-2 shadow-lg backdrop-blur-xl w-10 h-10 rounded-full overflow-hidden",
          "hover:scale-105 transition-transform duration-200",
          {
            "bg-midnight-secondary/60 text-midnight-accent border border-midnight-accent/20": currentTheme === 'midnight',
            "bg-ocean-secondary/60 text-ocean-accent border border-ocean-accent/20": currentTheme === 'ocean',
            "bg-sunset-secondary/60 text-sunset-accent border border-sunset-accent/20": currentTheme === 'sunset',
            "bg-forest-secondary/60 text-forest-accent border border-forest-accent/20": currentTheme === 'forest',
            "bg-candy-secondary/60 text-candy-accent border border-candy-accent/20": currentTheme === 'candy',
          }
        )}
      >
        <Search size={18} className="animate-pulse" />
      </Button>
    </motion.div>
  );
};

export default MobileSearchButton;
