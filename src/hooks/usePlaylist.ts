import { useState, useEffect, useMemo } from 'react';
import { Song } from '@/types/music';
import { initSongs, getSongs } from '@/data/songs';
import Sanscript from '@indic-transliteration/sanscript';
import { partial_token_similarity_sort_ratio } from 'fuzzball';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from './useDebounce';

export const usePlaylist = () => {
  const [dbSongs, setDbSongs] = useState<Song[]>([]); // <-- all songs from DB
  const [defaultsong, setdefaultsong] = useState<Song[]>([]); // <-- random playlist
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams] = useSearchParams();
  const [searchType, setSearchType] = useState<'info' | 'artist' | 'lyrics' | 'all' | 'title'>('title');
  const [filterArtist, setFilterArtist] = useState<string | null>(null);
  const debouncedSearchQuery = useDebounce(searchQuery, 1000);

  function normalizeQuery(q: string) {
    return Sanscript.t(Sanscript.t(Sanscript.t(q.toLowerCase(), "optitrans", "devanagari"), "devanagari", "gujarati"), "gujarati", "optitrans").toLowerCase();
  }

  function transliteration(query: string) {
    if ((/[a-zA-Z]/).test(query)) {
      let xhr = new XMLHttpRequest();
      xhr.open("POST", 'https://inputtools.google.com/request?itc=gu-t-i0-und&num=1&cp=0&cs=1&ie=utf-8&oe=utf-8&app=demopage&text=' + query, false);
      xhr.send();
      return JSON.parse(xhr.responseText)[1][0][1][0]
    }
    return query
  }

  function searchSongs(db: Song[], query: string, type_of_search: 'all' | 'info' | 'artist' | 'lyrics' | 'title', google_transliteration: boolean) {
    if (type_of_search == "all" || type_of_search == "lyrics") {
      query = query.replace(/[^a-zA-Z0-9\u0900-\u097F\u0A80-\u0AFF ]/g, '');
      return db.map(song => { return { ...song, similarity: partial_token_similarity_sort_ratio((type_of_search === "lyrics" ? [song.lyrics.english] : [song.title, song.artist, song.yt_title, song.lyrics.english, song.description]).join(" ").trim().replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase(), normalizeQuery(google_transliteration ? transliteration(query) : query)) }; }).sort((a, b) => b.similarity - a.similarity).filter(song => song.similarity > 50).slice(0, 10);
    }
    else if (type_of_search == "artist" || type_of_search == "info" || type_of_search == "title") {
      return db.filter(song => (type_of_search === "artist" ? song.artist : type_of_search === "title" ? song.title : song.title + " " + song.yt_title + " " + song.description).toLowerCase().includes(query.toLowerCase())).slice(0, 30);
    }
    return [];
  }

  function getRandomSubset(arr:any[], n:number) {
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
    async function loadSongs() {
      await initSongs();
      const songsFromDB = await getSongs();
      setDbSongs(songsFromDB);
      const data_type = searchParams.get('type') as "search" | "artist" | "song_id" | null;
      const data_content = searchParams.get('data')?.trim() || '';
      let songs4load: Song[];
      if (data_type === "search" && data_content) {
        songs4load = searchSongs(songsFromDB, data_content, "all", true);
      }
      else if (data_type === "artist" && data_content) {
        songs4load = songsFromDB.filter((song => song.artist == data_content));
      }
      else if (data_type === "song_id" && data_content) {
        songs4load = songsFromDB.filter((song => song.id == data_content));
      }
      else {
        songs4load = getRandomSubset(songsFromDB, 15);
      }
      setdefaultsong(songs4load);
      setCurrentSong(songs4load[0] || null);
    }
    loadSongs();
  }, []);

  const filteredSongs = useMemo(() => {
    let query = debouncedSearchQuery.trim();
    return query ? searchSongs(dbSongs, query, searchType, true) : filterArtist ? dbSongs.filter(song => song.artist === filterArtist).slice(0, 30) : defaultsong;
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
  };
};
