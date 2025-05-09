
import React, { useState } from 'react';
import { useMusic } from '@/components/MusicContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { AnimatePresence } from 'framer-motion';
import MobileSearchButton from './search/MobileSearchButton';
import MobileSearch from './search/MobileSearch';
import DesktopSearch from './search/DesktopSearch';

const SearchBar = () => {
  const { searchQuery, setSearchQuery } = useMusic();
  const isMobile = useIsMobile();
  const [showSearchOnMobile, setShowSearchOnMobile] = useState(false);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <AnimatePresence>
      {(isMobile && showSearchOnMobile) ? (
        <MobileSearch 
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onClose={() => setShowSearchOnMobile(false)}
        />
      ) : isMobile ? (
        <MobileSearchButton onClick={() => setShowSearchOnMobile(true)} />
      ) : (
        <DesktopSearch 
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />
      )}
    </AnimatePresence>
  );
};

export default SearchBar;
