
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Song, Theme, Language } from '@/types/music';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { usePlaylist } from '@/hooks/usePlaylist';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from '@/hooks/use-toast';
import * as lame from '@breezystack/lamejs';
import { blobCache } from '@/data/blobCache';
import { useLocation } from 'react-router-dom';
import DownloadProgress from '@/components/DownloadProgress';
let download_cancel = true;

interface MusicContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  currentTheme: Theme;
  currentLanguage: Language;
  songs: Song[];
  searchQuery: string;
  filteredSongs: Song[];
  likedSongs: string[];
  showFavoritesOnly: boolean;
  dbSongs:Song[],
  setSearchQuery: (query: string) => void;
  playPause: () => void;
  nextSong: () => void;
  prevSong: () => void;
  seek: (time: number) => void;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  playSong: (songId: string) => void;
  toggleLike: (songId: string) => void;
  isLiked: (songId: string) => boolean;
  playSongsByArtist: (artist: string) => void;
  toggleFavoritesView: () => void;
  downloadCurrentSong: (is_mp3: boolean) => void;
  shareCurrentSong: () => void;
  resetToDefaultSong: () => void;

}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    isPlaying,
    currentTime,
    duration,
    playPause,
    seek,
    updateAudioSource
  } = useAudioPlayer();

  const {
    currentSong,
    searchQuery,
    setSearchQuery,
    filteredSongs,
    nextSong,
    prevSong,
    playSong: selectSong,
    filterSongsByArtist,
    defaultsong,
    dbSongs
  } = usePlaylist();

  const {
    currentTheme,
    currentLanguage,
    setTheme,
    setLanguage,
  } = useTheme();
  const { toast } = useToast();

  const [likedSongs, setLikedSongs] = useState<string[]>([]);
  // State for showing favorites only
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadStartTime, setDownloadStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState<number>(0);
  const [downloadFileName, setDownloadFileName] = useState<string>('');
  const location = useLocation();

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isDownloading) {
      interval = setInterval(() => {
        const elapsed = (Date.now() - downloadStartTime) / 1000;
        setElapsedTime(elapsed);

        // Calculate ETA based on current progress and elapsed time
        if (downloadProgress > 0) {
          const estimatedTotal = elapsed / (downloadProgress / 100);
          const remaining = estimatedTotal - elapsed;
          setEstimatedTimeRemaining(remaining >= 0 ? remaining : 0);
        }
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isDownloading, downloadStartTime, downloadProgress]);

  // Load liked songs from localStorage on mount
  useEffect(() => {
    const storedLikedSongs = localStorage.getItem('likedSongs');
    if (storedLikedSongs) {
      setLikedSongs(JSON.parse(storedLikedSongs));
    }
  }, []);

  // Save liked songs to localStorage when changed
  useEffect(() => {
    localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
  }, [likedSongs]);

  // Toggle like status for a song
  const toggleLike = (songId: string) => {
    setLikedSongs(prev => {
      if (prev.includes(songId)) {
        return prev.filter(id => id !== songId);
      } else {
        return [...prev, songId];
      }
    });
  };

  // Check if a song is liked
  const isLiked = (songId: string) => {
    return likedSongs.includes(songId);
  };

  // Toggle favorites view
  const toggleFavoritesView = () => {
    setShowFavoritesOnly(prev => !prev);
  };
  // Cancel download
  const cancelDownload = () => {
    setIsDownloading(false);
    setDownloadProgress(0);
    setDownloadStartTime(0);
    setElapsedTime(0);
    setEstimatedTimeRemaining(0);
    download_cancel = true;
    toast({
      title: "Download cancelled",
      description: "The download has been cancelled",
    });
  };

  async function ProcessOpus(opusUrl: string, is_mp3: boolean): Promise<Blob> {
    const response = await fetch(opusUrl);
    const opusBlob = await response.blob();
    if (!is_mp3) return opusBlob;
    const arrayBuffer = await opusBlob.arrayBuffer();
    const audioContext = new AudioContext();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    const numChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const samples = audioBuffer.length;
    const left = audioBuffer.getChannelData(0);
    const right = numChannels > 1 ? audioBuffer.getChannelData(1) : left;
    const convertToInt16 = (float32Array: Float32Array): Int16Array => {
      const int16Array = new Int16Array(float32Array.length);
      for (let i = 0; i < float32Array.length; i++) {
        int16Array[i] = Math.max(-32768, Math.min(32767, Math.round(float32Array[i] * 32767)));
      }
      return int16Array;
    };
    const mp3encoder = new lame.Mp3Encoder(numChannels, sampleRate, 128);
    const mp3Data: Uint8Array[] = [];
    const blockSize = 1152;
    let lastLoggedPercent = -1;
    for (let i = 0; i < samples; i += blockSize) {
      const leftChunk = convertToInt16(left.subarray(i, i + blockSize));
      const rightChunk = numChannels > 1 ? convertToInt16(right.subarray(i, i + blockSize)) : leftChunk;
      const mp3buf = mp3encoder.encodeBuffer(leftChunk, rightChunk);
      if (mp3buf.length > 0) mp3Data.push(mp3buf);
      if (i % (blockSize * 100) === 0) {
        if (download_cancel) {
          throw new Error("Canceled");
        }
        const percent = Math.floor((i / samples) * 100);
        if (percent !== lastLoggedPercent) {
          setDownloadProgress(percent);
          lastLoggedPercent = percent;
        }
      }
      await new Promise(r => setTimeout(r, 0));
    }

    // Flush remaining MP3 data
    const mp3buf = mp3encoder.flush();
    if (mp3buf.length > 0) mp3Data.push(mp3buf);

    // Create a Blob from the MP3 data
    const mp3Blob = new Blob(mp3Data, { type: 'audio/mp3' });
    return mp3Blob;
  }

  const downloadCurrentSong = (is_mp3: boolean) => {
    if (!currentSong || !currentSong.audioUrl) {
      toast({
        title: "Download error",
        description: "No song available for download",
        variant: "destructive"
      });
      return;
    }
    setIsDownloading(true);
    setDownloadProgress(0);
    setDownloadStartTime(Date.now());
    setDownloadFileName(`${currentSong.title} - ${currentSong.artist}.mp3`);
    download_cancel = false;
    ProcessOpus(blobCache[currentSong.audioUrl], is_mp3)
      .then(mp3Blob => {
        const url = URL.createObjectURL(mp3Blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${currentSong.title} - ${currentSong.artist}.${is_mp3 ? "mp3" : "opus"}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => {
          setIsDownloading(false);
          toast({ title: "Download complete", description: `${currentSong.title} by ${currentSong.artist} has been downloaded` });
        }, 1000);
      }).catch((e) => {
        toast({
          title: "Download error",
          description: e.message,
          variant: "destructive"
        });
      });

    toast({
      title: "Download started",
      description: `Downloading ${currentSong.title} by ${currentSong.artist}`,
    });
  };

  // Share current song using Web Share API or fallback
  const shareCurrentSong = async () => {
    if (!currentSong) return;

    // Create the share URL with song_id parameter
    const baseUrl = window.location.origin + location.pathname;
    const shareUrl = `${baseUrl}?type=song_id&data=${currentSong.id}`;
    const shareTitle = `${currentSong.title} by ${currentSong.artist}`;
    const shareText = `Check out this song: ${currentSong.title} by ${currentSong.artist}\n\nLyrics:-\n${currentSong.lyrics[currentLanguage]}\n`;

    // Try to use the Web Share API
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });

        toast({
          title: "Shared successfully",
          description: "Song shared successfully",
        });
      } catch (error) {
        console.error('Share failed:', error);
        navigator.clipboard.writeText(shareUrl).then(
          () => {
            toast({
              title: "Link copied!",
              description: "Share URL has been copied to clipboard",
            });
          },
          () => {
            toast({
              title: "Copy failed",
              description: "Failed to copy the URL to clipboard",
              variant: "destructive"
            });
          }
        );
      }
    } else {
      // Fallback to clipboard if Web Share API is not available
      navigator.clipboard.writeText(shareUrl).then(
        () => {
          toast({
            title: "Link copied!",
            description: "Share URL has been copied to clipboard",
          });
        },
        () => {
          toast({
            title: "Copy failed",
            description: "Failed to copy the URL to clipboard",
            variant: "destructive"
          });
        }
      );
    }
  };

  // Handle song changes and playback
  const handleNextSong = () => {
    const next = nextSong();
    updateAudioSource(next, isPlaying);
  };

  const handlePrevSong = () => {
    const prev = prevSong();
    updateAudioSource(prev, isPlaying);
  };

  const handlePlaySong = (songId: string) => {
    const song = selectSong(songId);
    if (song) {
      updateAudioSource(song, true);
    }
  };
  const playSongsByArtist = (artist: string) => {
    if (artist) {
      filterSongsByArtist(artist);
    }
  };
  const resetToDefaultSong = () => {
    // const defaultSong = defaultsong[0];
    // if (defaultSong) {
    //   selectSong(defaultSong.id);
    //   updateAudioSource(defaultSong, true);
    // }
    filterSongsByArtist('');
    setSearchQuery('');
    setShowFavoritesOnly(false);
  };


  // Update audio source when current song changes
  useEffect(() => {
    updateAudioSource(currentSong);
  }, [currentSong]);

  const contextValue = {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    currentTheme,
    currentLanguage,
    songs: filteredSongs,
    searchQuery,
    filteredSongs,
    likedSongs,
    showFavoritesOnly,
    dbSongs,
    setSearchQuery,
    playPause,
    nextSong: handleNextSong,
    prevSong: handlePrevSong,
    seek,
    setTheme,
    setLanguage,
    playSong: handlePlaySong,
    toggleLike,
    isLiked,
    playSongsByArtist,
    toggleFavoritesView,
    downloadCurrentSong,
    shareCurrentSong,
    resetToDefaultSong,
  };

  return (
    <MusicContext.Provider value={contextValue}>
      {children}
      {isDownloading && (
        <DownloadProgress
          progress={downloadProgress}
          fileName={downloadFileName}
          elapsedTime={elapsedTime}
          estimatedTimeRemaining={estimatedTimeRemaining}
          theme={currentTheme}
          onCancel={cancelDownload}
        />
      )}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
