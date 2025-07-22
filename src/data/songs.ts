import { Song, Song_DATA_CSV } from '@/types/music';
import { tf_idf_initialize } from '@/utils/tfidfRecommender';
import Sanscript from '@indic-transliteration/sanscript';
import { openDB } from 'idb';
import Papa from 'papaparse';

const DB_NAME = 'JainSongsDB';
const STORE_NAME = 'songsStore';
const SONGS_URL = 'data.csv';

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
  const song_list = Papa.parse(await response.text(), {header: true,skipEmptyLines: true,}).data as Song_DATA_CSV[];
  let songs: Song[] = [];
  let index = 0;

  for (let song of song_list) {
    index++;
    let guj = Sanscript.t(song.lyrics, "devanagari", "gujarati");
    songs.push({ "id": String(index), "yt_title": song.title, "title": song.song_name, "artist": song.author ? song.author : "Jain Melody", "cover": song.id ? `https://img.youtube.com/vi/${song.id}/maxresdefault.jpg` : null, "audioUrl": song.audio ? `https://huggingface.co/shethjenil/Jain-Songs/resolve/main/${song.song_name}.opus` : null, "lyrics": { "english": Sanscript.t(guj, "gujarati", "optitrans"), "hindi": Sanscript.t(guj, "gujarati", "devanagari"), "gujarati": guj }, "description": song.description + "\n" + song.tags.split(",").join(" "), "publish_date_seconds": new Date(song.publishdate).getTime() / 1000 });
  }
  return songs;
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
    await tf_idf_initialize(songs);
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

export async function deleteAllData() {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  await store.clear(); // This deletes all records
  await tx.done;
  console.log('All data deleted');
}
