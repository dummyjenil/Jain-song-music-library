
import React from 'react';
import { MusicProvider } from '@/components/MusicContext';
import MusicPlayer from '@/components/MusicPlayer';

const Index = () => {
  return (
    <MusicProvider>
      <MusicPlayer />
    </MusicProvider>
  );
};

export default Index;
