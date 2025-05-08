import { useState, useEffect, useMemo } from 'react';
import { Song } from '@/types/music';
import { initSongs, getSongs } from '@/data/songs';
import Sanscript from '@indic-transliteration/sanscript';
import { partial_token_similarity_sort_ratio } from 'fuzzball';
import { useSearchParams } from 'react-router-dom';

export const usePlaylist = () => {
  const [dbSongs, setDbSongs] = useState<Song[]>([]); // <-- all songs from DB
  const [defaultsong, setdefaultsong] = useState<Song[]>([]); // <-- random playlist
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams] = useSearchParams();
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [searchType, setSearchType] = useState<'title' | 'artist' | 'lyrics' | 'all'>('title');
  const [filterArtist, setFilterArtist] = useState<string | null>(null);
  function searchSongs(db: Song[], query: string, type_of_search: 'all' | 'title' | 'artist' | 'lyrics', google_transliteration: boolean) {
    function normalizeQuery(q: string) {
      return Sanscript.t(
        Sanscript.t(
          Sanscript.t(
            q.toLowerCase(),
            "optitrans", "devanagari"
          ),
          "devanagari", "gujarati"
        ),
        "gujarati", "optitrans"
      ).toLowerCase();
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
    if (type_of_search == "all" || type_of_search == "lyrics") {
      query = query.replace(/[^a-zA-Z0-9\u0900-\u097F\u0A80-\u0AFF ]/g, '');
      query = normalizeQuery(google_transliteration ? transliteration(query) : query);
      return db.map(song => {
        let search_data: string[];
        switch (type_of_search) {
          case 'lyrics':
            search_data = [song.lyrics.english]
          case 'all':
            search_data = [song.title, song.artist, song.yt_title, song.lyrics.english]
        }
        const similarity = partial_token_similarity_sort_ratio(search_data.join(" ").trim().replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase(), query);
        return { ...song, similarity };
      }).sort((a, b) => b.similarity - a.similarity).filter(song => song.similarity > 50).slice(0, 10);
    }
    else if (type_of_search == "artist" || type_of_search == "title") {
      return db.filter(song => {
        switch (type_of_search) {
          case "artist":
            return song.artist.toLowerCase().includes(query);
          case 'title':
            return ([song.title, song.yt_title].join(" ")).toLowerCase().includes(query);
        }
      }).slice(0, 30);
    }
  }

  useEffect(() => {
    const handleSearchTypeChange = (event: CustomEvent) => {
      setSearchType(event.detail as 'all' | 'title' | 'artist' | 'lyrics');
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
        songs4load = songsFromDB.sort(() => 0.5 - Math.random()).slice(0, 10);
      }
      setdefaultsong(songs4load);
      setCurrentSong(songs4load[0] || null);
    }
    loadSongs();
  }, []);

  useEffect(() => {
    let timeoutsec: number;
    if (searchType == "title" || searchType == "artist") {
      timeoutsec = 0.5;
    }
    else {
      timeoutsec = 3;
    }
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, timeoutsec * 1000);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchQuery,filterArtist]);

  const filteredSongs = useMemo(() => {
    let query = debouncedQuery.trim();
    if (!query) {
      if (filterArtist) {
        return dbSongs.filter(song=>song.artist == filterArtist).slice(0,30);
      }
      return defaultsong;
    }
    return searchSongs(dbSongs, query, searchType, true);
  }, [debouncedQuery, defaultsong, dbSongs,filterArtist]);

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
