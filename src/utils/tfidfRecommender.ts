import { openDB } from 'idb';
import { Song } from '@/types/music';

// Constants
const DB_NAME = 'tfidf-db';
const STORE_NAME = 'songs';

const WEIGHTS = {
  artist: 3,
  title: 2,
  yt_title: 2,
  description: 1,
};

// TF-IDF utilities
function tokenize(text: string): string[] {
  return text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(Boolean);
}

function termFreq(tokens: string[]): Record<string, number> {
  const freq: Record<string, number> = {};
  tokens.forEach(token => {
    freq[token] = (freq[token] || 0) + 1;
  });
  return freq;
}

function computeTfIdfMatrix(docs: string[]) {
  const tokenizedDocs = docs.map(tokenize);
  const termFrequencies = tokenizedDocs.map(termFreq);
  const termsSet = new Set(tokenizedDocs.flat());
  const terms = Array.from(termsSet);

  const idf: Record<string, number> = {};
  terms.forEach(term => {
    const df = tokenizedDocs.filter(tokens => tokens.includes(term)).length;
    idf[term] = Math.log((1 + docs.length) / (1 + df)) + 1;
  });

  const matrix = termFrequencies.map(freqs =>
    terms.map(term => (freqs[term] || 0) * idf[term])
  );

  return { matrix, terms };
}

function cosineSimilarity(vec1: number[], vec2: number[]): number {
  const dot = vec1.reduce((sum, val, i) => sum + val * (vec2[i] || 0), 0);
  const normA = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
  const normB = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
  return normA && normB ? dot / (normA * normB) : 0;
}

function normalRandom(mean = 0, stddev = 1): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return mean + stddev * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

// Open IndexedDB
async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    }
  });
}

// TF-IDF Initialization (equivalent to vectorizer.fit_transform)
export async function tf_idf_initialize(songs: Song[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.store;

  const combinedDocs = songs.map(song => ({
    id: song.id,
    combined: (song.artist + ' ').repeat(WEIGHTS.artist) +
              (song.title + ' ').repeat(WEIGHTS.title) +
              (song.yt_title + ' ').repeat(WEIGHTS.yt_title) +
              (song.description + ' ').repeat(WEIGHTS.description)
  }));

  const docs = combinedDocs.map(d => d.combined);
  const { matrix } = computeTfIdfMatrix(docs);

  for (let i = 0; i < combinedDocs.length; i++) {
    await store.put({
      id: combinedDocs[i].id,
      combined: combinedDocs[i].combined,
      vector: matrix[i],
    });
  }

  await tx.done;
}

// Equivalent of the full recommendation with randomness
export async function getTopRecommendations(likedIds: number[], count = 5): Promise<{ id: number; score: number }[]> {
  const db = await getDB();
  const store = db.transaction(STORE_NAME, 'readonly').store;
  const allSongs = await store.getAll() as { id: number; vector: number[] }[];

  const idToVector = Object.fromEntries(allSongs.map(song => [song.id, song.vector]));
  const likedVectors = likedIds.map(id => idToVector[id]).filter(Boolean);

  if (likedVectors.length === 0) return [];

  const avgSimilarities = allSongs.map(song => {
    const sims = likedVectors.map(vec => cosineSimilarity(vec, song.vector));
    const avgSim = sims.reduce((a, b) => a + b, 0) / sims.length;
    const noise = normalRandom(0, 0.01); // add diversity
    return {
      id: song.id,
      score: avgSim + noise,
    };
  });

  const recommendations = avgSimilarities
    .filter(r => !likedIds.includes(r.id))
    .sort((a, b) => b.score - a.score);

  const topPool = recommendations.slice(0, 50);

  // Random sample from top pool
  const shuffled = topPool.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
