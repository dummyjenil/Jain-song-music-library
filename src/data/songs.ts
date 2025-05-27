import { Song } from '@/types/music';
import Sanscript from '@indic-transliteration/sanscript';
import { openDB } from 'idb';

const DB_NAME = 'JainSongsDB';
const STORE_NAME = 'songsStore';
const SONGS_URL = 'songs.json';

async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
}

async function fetchSongsFromInternet(): Promise<Song[]> {
  const response = await fetch(SONGS_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch songs');
  }
  const song_list = await response.json();
  let songs = [];
  let index = 0;

  for (let song of song_list) {
    index++;
    let [song_title, lyrics, yt_id, yt_title, yt_view, channel_name, channel_id, audio_available] = song;
    let guj = Sanscript.t(lyrics, "devanagari", "gujarati");
    songs.push({ "id": String(index), "yt_title": yt_title, "title": song_title, "artist": channel_name ? channel_name : "Saiyam The Real Life", "cover": yt_id ? `https://img.youtube.com/vi/${yt_id}/maxresdefault.jpg` : "default.jpeg", "audioUrl": audio_available ? `https://huggingface.co/shethjenil/Jain-Songs/resolve/main/${song_title}.opus` : "default.opus", "lyrics": { "english": Sanscript.t(guj, "gujarati", "optitrans"), "hindi": Sanscript.t(guj, "gujarati", "devanagari"), "gujarati": guj } });
  }
  return songs as Song[];
}

// Save songs into IndexedDB
async function saveSongsToDB(songs: Song[]) {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);

  for (const song of songs) {
    await store.put(song);
  }

  await tx.done;
}

// Public function to make sure songs exist
export async function initSongs() {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  const count = await store.count();
  await tx.done;

  if (count === 0) {
    console.log('No songs in DB, fetching from internet...');
    const songs = await fetchSongsFromInternet();
    await saveSongsToDB(songs);
  } else {
    console.log('Songs already exist in DB.');
  }
}

// Get all songs from local DB
export async function getSongs(): Promise<Song[]> {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  const allSongs = await store.getAll();
  await tx.done;
  return allSongs;
}
