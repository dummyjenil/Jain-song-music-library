import { useState, useRef, useEffect } from 'react';
import { Song } from '@/types/music';
import { useToast } from '@/hooks/use-toast';
import { blobCache } from '@/data/blobCache';

export const useAudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    audioRef.current = new Audio();

    const updateTime = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration);
      }
    };

    const handlePlayEvent = () => setIsPlaying(true);
    const handlePauseEvent = () => setIsPlaying(false);

    const audio = audioRef.current;

    if (audio) {
      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('play', handlePlayEvent);
      audio.addEventListener('pause', handlePauseEvent);
    }

    return () => {
      if (audio) {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('play', handlePlayEvent);
        audio.removeEventListener('pause', handlePauseEvent);
        audio.pause();
      }
    };
  }, []);

  const playPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => {
        console.error("Audio playback error:", error);
      });
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const fetchBlobURL = async (url: string): Promise<string> => {
    if (blobCache[url]) return blobCache[url];
    const res = await fetch(url);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    blobCache[url] = blobUrl;
    return blobUrl;
  };

  const updateAudioSource = async (song: Song | null, shouldPlay: boolean = false) => {
    if (!song || !audioRef.current) return;

    audioRef.current.pause();

    try {
      const blobUrl = await fetchBlobURL(song.audioUrl);
      audioRef.current.src = blobUrl;
      audioRef.current.load();

      if (shouldPlay) {
        const handleCanPlay = () => {
          audioRef.current?.play().catch(error => {
            console.error("Audio playback error:", error);
            toast({
              title: "Playback Error",
              description: "Could not play the audio file.",
              variant: "destructive",
            });
          });

          audioRef.current?.removeEventListener('canplaythrough', handleCanPlay);
        };

        audioRef.current.addEventListener('canplaythrough', handleCanPlay);
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
    } catch (error) {
      toast({
        title: "Load Error",
        description: "Failed to load the audio track.",
        variant: "destructive",
      });
    }
  };

  return {
    isPlaying,
    currentTime,
    duration,
    playPause,
    seek,
    updateAudioSource,
  };
};
