import { useState, useEffect, useMemo } from 'react';
import { Song } from '@/types/music';
import { initSongs, getSongs } from '@/data/songs';
import Sanscript from '@indic-transliteration/sanscript';
import { partial_token_similarity_sort_ratio } from 'fuzzball';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from './useDebounce';
import { getTopRecommendations } from '@/utils/tfidfRecommender';

export const usePlaylist = () => {
  const [dbSongs, setDbSongs] = useState<Song[]>([]); // <-- all songs from DB
  const [defaultsong, setdefaultsong] = useState<Song[]>([]); // <-- random playlist
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams] = useSearchParams();
  const [searchType, setSearchType] = useState<'info' | 'artist' | 'lyrics' | 'all' | 'title'>('title');
  const [filterArtist, setFilterArtist] = useState<string | null>(null);
  const [is_Loading, setIs_Loading] = useState<boolean>(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 1000);

  function normalizeQuery(q: string) {
    return Sanscript.t(Sanscript.t(Sanscript.t(q.toLowerCase(), "optitrans", "devanagari"), "devanagari", "gujarati"), "gujarati", "optitrans").toLowerCase();
  }

  async function transliteration(query: string): Promise<string> {
    setIs_Loading(true);

    if (/[a-zA-Z]/.test(query)) {
      const url = `https://inputtools.google.com/request?itc=gu-t-i0-und&num=1&cp=0&cs=1&ie=utf-8&oe=utf-8&app=demopage&text=${encodeURIComponent(query)}`;

      try {
        const response = await fetch(url, {
          method: "POST"
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setIs_Loading(false);
        return data[1][0][1][0];
      } catch (error) {
        console.error("Error fetching transliteration:", error);
        return query; // fallback in case of error
      }
    }
    return query;
  }

  async function searchSongs(
    db: Song[],
    query: string,
    type_of_search: 'all' | 'info' | 'artist' | 'lyrics' | 'title',
    google_transliteration: boolean
  ): Promise<Song[]> {
    if (type_of_search === "all" || type_of_search === "lyrics") {
      query = query.replace(/[^a-zA-Z0-9\u0900-\u097F\u0A80-\u0AFF ]/g, '');
      const normalizedQuery = normalizeQuery(
        google_transliteration ? await transliteration(query) : query
      );

      const songsWithSimilarity = await Promise.all(
        db.map(async (song) => {
          const textToCompare = (type_of_search === "lyrics"
            ? [song.lyrics.english]
            : [song.title, song.artist, song.yt_title, song.lyrics.english, song.description]
          )
            .join(" ")
            .trim()
            .replace(/[^a-zA-Z0-9 ]/g, '')
            .toLowerCase();
          const similarity = partial_token_similarity_sort_ratio(textToCompare, normalizedQuery);
          return { ...song, similarity };
        })
      );
      return songsWithSimilarity
        .filter(song => song.similarity > 50)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 10);
    }

    // Simple text-based search for artist/info/title
    else if (type_of_search === "artist" || type_of_search === "info" || type_of_search === "title") {
      const queryLower = query.toLowerCase();
      return db
        .filter(song => {
          const targetText =
            type_of_search === "artist"
              ? song.artist
              : type_of_search === "title"
                ? song.title
                : song.title + " " + song.yt_title + " " + song.description;
          return targetText.toLowerCase().includes(queryLower);
        })
        .slice(0, 30);
    }
    return [];
  }

  function getRandomSubset(arr: any[], n: number) {
    const shuffled = [...arr]; // copy array
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, n);
  }


  useEffect(() => {
    const handleSearchTypeChange = (event: CustomEvent) => {
      setSearchType(event.detail as 'all' | 'info' | 'artist' | 'lyrics' | 'title');
    };
    document.addEventListener('setSearchType', handleSearchTypeChange as EventListener);
    return () => {
      document.removeEventListener('setSearchType', handleSearchTypeChange as EventListener);
    };
  }, []);

  useEffect(() => {
    (async () => {
      setIs_Loading(true);
      await initSongs();
      const songsFromDB = await getSongs();
      setDbSongs(songsFromDB);
      const data_type = searchParams.get('type') as "search" | "artist" | "song_id" | null;
      const data_content = searchParams.get('data')?.trim() || '';
      let songs4load: Song[];
      if (data_type === "search" && data_content) {
        songs4load = await searchSongs(songsFromDB, data_content, "all", true);
      }
      else if (data_type === "artist" && data_content) {
        songs4load = songsFromDB.filter((song => song.artist == data_content));
      }
      else if (data_type === "song_id" && data_content) {
        songs4load = songsFromDB.filter((song => song.id == data_content));
      }

      else if (data_type === "song_id" && data_content) {
        songs4load = songsFromDB.filter((song => song.id == data_content));
      }
      else {
        const storedLikedSongs = localStorage.getItem('likedSongs');
        if (storedLikedSongs) {
          const liked_songs = JSON.parse(storedLikedSongs) as string[]
          if (liked_songs.length > 0) {
            const songMap = new Map(songsFromDB.map(song => [song.id, song]));
            songs4load = (await getTopRecommendations((liked_songs).map(str => parseInt(str, 10)), 15)).map(data => songMap.get(String(data.id))).filter(Boolean) as Song[];;
          }
          else {
            songs4load = getRandomSubset(songsFromDB, 15);
          }
        }
        else {
          songs4load = getRandomSubset(songsFromDB, 15);
        }
      }
      setIs_Loading(false);
      setdefaultsong(songs4load);
      setCurrentSong(songs4load[0] || null);
    })();
  }, []);

  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);

  useEffect(() => {
    let isCancelled = false;

    const fetchFilteredSongs = async () => {
      let query = debouncedSearchQuery.trim();

      if (query) {
        const result = await searchSongs(dbSongs, query, searchType, true);
        if (!isCancelled) setFilteredSongs(result);
      } else if (filterArtist) {
        const result = dbSongs
          .filter(song => song.artist === filterArtist)
          .sort((a, b) => Number(b.publish_date_seconds) - Number(a.publish_date_seconds))
          .slice(0, 30);
        if (!isCancelled) setFilteredSongs(result);
      } else {
        if (!isCancelled) setFilteredSongs(defaultsong);
      }
    };

    fetchFilteredSongs();
    return () => {
      isCancelled = true; // avoid setting state on unmounted component
    };
  }, [debouncedSearchQuery, searchType, dbSongs, filterArtist, defaultsong]);

  const nextSong = () => {
    if (!currentSong) return null;
    const activeSongs = (filterArtist || searchQuery) ? filteredSongs : defaultsong;
    if (activeSongs.length === 0) return null;
    const currentIndex = activeSongs.findIndex(song => song.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % activeSongs.length;
    const next = activeSongs[nextIndex];
    setCurrentSong(next);
    return next;
  };

  const prevSong = () => {
    if (!currentSong) return null;
    const activeSongs = (filterArtist || searchQuery) ? filteredSongs : defaultsong;
    if (activeSongs.length === 0) return null;
    const currentIndex = activeSongs.findIndex(song => song.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + activeSongs.length) % activeSongs.length;
    const prev = activeSongs[prevIndex];
    setCurrentSong(prev);
    return prev;
  };

  const playSong = (songId: string) => {
    let song = defaultsong.find(s => s.id === songId);
    if (!song) {
      song = dbSongs.find(s => s.id === songId);
    }
    if (song) {
      setCurrentSong(song);
      return song;
    }
    return null;
  };

  const filterSongsByArtist = (artist: string) => {
    setFilterArtist(artist);
  };

  const clearFilters = () => {
    setFilterArtist(null);
  };

  return {
    currentSong,
    searchQuery,
    searchType,
    setSearchQuery,
    setSearchType,
    filteredSongs,
    dbSongs,
    defaultsong,
    nextSong,
    prevSong,
    playSong,
    filterSongsByArtist,
    clearFilters,
    is_Loading
  };
};
