import React, { useState, useCallback, useEffect } from 'react';
import { useMusic } from '@/components/MusicContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { AnimatePresence } from 'framer-motion';
import { useDebounce } from '@/hooks/useDebounce';
import MobileSearchButton from './search/MobileSearchButton';
import MobileSearch from './search/MobileSearch';
import DesktopSearch from './search/DesktopSearch';

const SearchBar = () => {
  const { searchQuery, setSearchQuery } = useMusic();
  const isMobile = useIsMobile();
  const [showSearchOnMobile, setShowSearchOnMobile] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const debouncedQuery = useDebounce(localSearchQuery, 300);

  useEffect(() => {
    setSearchQuery(debouncedQuery);
  }, [debouncedQuery, setSearchQuery]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchQuery(e.target.value);
  }, []);

  return (
    <AnimatePresence>
      {(isMobile && showSearchOnMobile) ? (
        <MobileSearch
          searchQuery={localSearchQuery}
          onSearchChange={handleSearchChange}
          onClose={() => setShowSearchOnMobile(false)}
        />
      ) : isMobile ? (
        <MobileSearchButton onClick={() => setShowSearchOnMobile(true)} />
      ) : (
        <DesktopSearch
          searchQuery={localSearchQuery}
          onSearchChange={handleSearchChange}
        />
      )}
    </AnimatePresence>
  );
};

export default SearchBar;
