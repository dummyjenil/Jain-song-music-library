// import { openDB } from 'idb';
// import { Song } from '@/types/music';

// // Constants
// const DB_NAME = 'tfidf-db';
// const STORE_NAME = 'songs';

// const WEIGHTS = {
//   artist: 3,
//   title: 2,
//   yt_title: 2,
//   description: 1,
// };

// // TF-IDF utilities
// function tokenize(text: string): string[] {
//   return text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(Boolean);
// }

// function termFreq(tokens: string[]): Record<string, number> {
//   const freq: Record<string, number> = {};
//   tokens.forEach(token => {
//     freq[token] = (freq[token] || 0) + 1;
//   });
//   return freq;
// }

// function computeTfIdfMatrix(docs: string[]) {
//   const tokenizedDocs = docs.map(tokenize);
//   const termFrequencies = tokenizedDocs.map(termFreq);
//   const termsSet = new Set(tokenizedDocs.flat());
//   const terms = Array.from(termsSet);

//   const idf: Record<string, number> = {};
//   terms.forEach(term => {
//     const df = tokenizedDocs.filter(tokens => tokens.includes(term)).length;
//     idf[term] = Math.log((1 + docs.length) / (1 + df)) + 1;
//   });

//   const matrix = termFrequencies.map(freqs =>
//     terms.map(term => (freqs[term] || 0) * idf[term])
//   );

//   return { matrix, terms };
// }

// function cosineSimilarity(vec1: number[], vec2: number[]): number {
//   const dot = vec1.reduce((sum, val, i) => sum + val * (vec2[i] || 0), 0);
//   const normA = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
//   const normB = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
//   return normA && normB ? dot / (normA * normB) : 0;
// }

// function normalRandom(mean = 0, stddev = 1): number {
//   let u = 0, v = 0;
//   while (u === 0) u = Math.random();
//   while (v === 0) v = Math.random();
//   return mean + stddev * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
// }

// // Open IndexedDB
// async function getDB() {
//   return openDB(DB_NAME, 1, {
//     upgrade(db) {
//       if (!db.objectStoreNames.contains(STORE_NAME)) {
//         db.createObjectStore(STORE_NAME, { keyPath: 'id' });
//       }
//     }
//   });
// }

// // TF-IDF Initialization (equivalent to vectorizer.fit_transform)
// export async function tf_idf_initialize(songs: Song[]): Promise<void> {
//   const db = await getDB();
//   const tx = db.transaction(STORE_NAME, 'readwrite');
//   const store = tx.store;

//   const combinedDocs = songs.map(song => ({
//     id: song.id,
//     combined: (song.artist + ' ').repeat(WEIGHTS.artist) +
//       (song.title + ' ').repeat(WEIGHTS.title) +
//       (song.yt_title + ' ').repeat(WEIGHTS.yt_title) +
//       (song.description + ' ').repeat(WEIGHTS.description)
//   }));

//   const docs = combinedDocs.map(d => d.combined);
//   const { matrix } = computeTfIdfMatrix(docs);

//   for (let i = 0; i < combinedDocs.length; i++) {
//     await store.put({
//       id: combinedDocs[i].id,
//       combined: combinedDocs[i].combined,
//       vector: matrix[i],
//     });
//   }

//   await tx.done;
// }

// // Equivalent of the full recommendation with randomness
// export async function getTopRecommendations(likedIds: number[], count = 5): Promise<{ id: number; score: number }[]> {
//   const db = await getDB();
//   const store = db.transaction(STORE_NAME, 'readonly').store;
//   const allSongs = await store.getAll() as { id: number; vector: number[] }[];

//   const idToVector = Object.fromEntries(allSongs.map(song => [song.id, song.vector]));
//   const likedVectors = likedIds.map(id => idToVector[id]).filter(Boolean);

//   if (likedVectors.length === 0) return [];

//   const avgSimilarities = allSongs.map(song => {
//     const sims = likedVectors.map(vec => cosineSimilarity(vec, song.vector));
//     const avgSim = sims.reduce((a, b) => a + b, 0) / sims.length;
//     const noise = normalRandom(0, 0.01); // add diversity
//     return {
//       id: song.id,
//       score: avgSim + noise,
//     };
//   });

//   const recommendations = avgSimilarities
//     .filter(r => !likedIds.includes(r.id))
//     .sort((a, b) => b.score - a.score);

//   const topPool = recommendations.slice(0, 50);

//   // Random sample from top pool
//   const shuffled = topPool.sort(() => Math.random() - 0.5);
//   return shuffled.slice(0, count);
// }









































// import { openDB } from 'idb';
// import { Song } from '@/types/music';

// const DB_NAME = 'tfidf-db';
// const STORE_NAME = 'songs';

// const WEIGHTS = { artist: 3, title: 2, yt_title: 2, description: 1 };
// const PROJECTION_DIM = 256; // reduce to 256 dimensions

// // --- Tokenization ---
// function tokenize(text: string): string[] {
//   return text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(Boolean);
// }

// function termFreq(tokens: string[]): Record<string, number> {
//   const freq: Record<string, number> = {};
//   tokens.forEach(token => { freq[token] = (freq[token] || 0) + 1; });
//   return freq;
// }

// // --- TF-IDF ---
// function computeTfIdf(docs: string[]) {
//   const tokenizedDocs = docs.map(tokenize);
//   const termFrequencies = tokenizedDocs.map(termFreq);
//   const vocab = Array.from(new Set(tokenizedDocs.flat()));

//   const idf: Record<string, number> = {};
//   vocab.forEach(term => {
//     const df = tokenizedDocs.filter(tokens => tokens.includes(term)).length;
//     idf[term] = Math.log((1 + docs.length) / (1 + df)) + 1;
//   });

//   // Sparse vectors: each document as {term: weight}
//   const sparseVectors = termFrequencies.map(freqs => {
//     const sparse: Record<string, number> = {};
//     for (const term in freqs) {
//       sparse[term] = freqs[term] * idf[term];
//     }
//     return sparse;
//   });

//   return { sparseVectors, vocab };
// }

// // --- Random Projection ---
// function createRandomProjectionMatrix(vocabSize: number, dim: number): number[][] {
//   return Array.from({ length: dim }, () =>
//     Array.from({ length: vocabSize }, () => (Math.random() - 0.5) / Math.sqrt(dim))
//   );
// }

// function projectSparseVector(
//   sparse: Record<string, number>,
//   vocab: string[],
//   projectionMatrix: number[][]
// ): Float32Array {
//   const vector = new Float32Array(projectionMatrix.length);
//   for (let i = 0; i < projectionMatrix.length; i++) {
//     let sum = 0;
//     for (const term in sparse) {
//       const termIndex = vocab.indexOf(term); // (optimize with term->index map)
//       if (termIndex >= 0) sum += sparse[term] * projectionMatrix[i][termIndex];
//     }
//     vector[i] = sum;
//   }
//   return vector;
// }

// // --- Cosine similarity ---
// function cosineSimilarity(vec1: Float32Array, vec2: Float32Array): number {
//   let dot = 0, normA = 0, normB = 0;
//   for (let i = 0; i < vec1.length; i++) {
//     dot += vec1[i] * vec2[i];
//     normA += vec1[i] * vec1[i];
//     normB += vec2[i] * vec2[i];
//   }
//   return normA && normB ? dot / (Math.sqrt(normA) * Math.sqrt(normB)) : 0;
// }

// // --- Random noise for diversity ---
// function normalRandom(mean = 0, stddev = 1): number {
//   let u = 0, v = 0;
//   while (u === 0) u = Math.random();
//   while (v === 0) v = Math.random();
//   return mean + stddev * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
// }

// // --- IndexedDB ---
// async function getDB() {
//   return openDB(DB_NAME, 1, {
//     upgrade(db) {
//       if (!db.objectStoreNames.contains(STORE_NAME)) {
//         db.createObjectStore(STORE_NAME, { keyPath: 'id' });
//       }
//     }
//   });
// }

// // --- Initialization ---
// export async function tf_idf_initialize(songs: Song[]): Promise<void> {
//   const db = await getDB();
//   const tx = db.transaction(STORE_NAME, 'readwrite');
//   const store = tx.store;

//   const combinedDocs = songs.map(song => ({
//     id: song.id,
//     combined: (song.artist + ' ').repeat(WEIGHTS.artist) +
//       (song.title + ' ').repeat(WEIGHTS.title) +
//       (song.yt_title + ' ').repeat(WEIGHTS.yt_title) +
//       (song.description + ' ').repeat(WEIGHTS.description)
//   }));

//   const docs = combinedDocs.map(d => d.combined);
//   const { sparseVectors, vocab } = computeTfIdf(docs);

//   // Precompute projection matrix once
//   const projectionMatrix = createRandomProjectionMatrix(vocab.length, PROJECTION_DIM);

//   for (let i = 0; i < combinedDocs.length; i++) {
//     const projected = projectSparseVector(sparseVectors[i], vocab, projectionMatrix);
//     await store.put({
//       id: combinedDocs[i].id,
//       vector: projected.buffer, // Store as ArrayBuffer for space efficiency
//     });
//   }

//   await tx.done;
// }

// // --- Recommendations ---
// export async function getTopRecommendations(
//   likedIds: number[],
//   count = 5
// ): Promise<{ id: number; score: number }[]> {
//   const db = await getDB();
//   const store = db.transaction(STORE_NAME, 'readonly').store;
//   const allSongs = await store.getAll() as { id: number; vector: ArrayBuffer }[];

//   const idToVector = Object.fromEntries(
//     allSongs.map(song => [song.id, new Float32Array(song.vector)])
//   );
//   const likedVectors = likedIds.map(id => idToVector[id]).filter(Boolean);

//   if (likedVectors.length === 0) return [];

//   const avgSimilarities = allSongs.map(song => {
//     const songVec = new Float32Array(song.vector);
//     const sims = likedVectors.map(vec => cosineSimilarity(vec, songVec));
//     const avgSim = sims.reduce((a, b) => a + b, 0) / sims.length;
//     const noise = normalRandom(0, 0.01);
//     return { id: song.id, score: avgSim + noise };
//   });

//   const recommendations = avgSimilarities
//     .filter(r => !likedIds.includes(r.id))
//     .sort((a, b) => b.score - a.score);

//   const topPool = recommendations.slice(0, 100);
//   const shuffled = topPool.sort(() => Math.random() - 0.5);
//   return shuffled.slice(0, count);
// }











import { openDB } from 'idb';
import { Song } from '@/types/music';

const DB_NAME = 'tfidf-db';
const STORE_NAME = 'songs';
const WEIGHTS = { artist: 3, title: 2, yt_title: 2, description: 1 };
const PROJECTION_DIM = 256;

// --- Tokenization ---
function tokenize(text: string): string[] {
  return text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(Boolean);
}

function termFreq(tokens: string[]): Record<string, number> {
  const freq: Record<string, number> = {};
  for (const token of tokens) {
    freq[token] = (freq[token] || 0) + 1;
  }
  return freq;
}

// --- TF-IDF (optimized DF computation) ---
function computeTfIdf(docs: string[]) {
  const tokenizedDocs = docs.map(tokenize);
  const termFrequencies = tokenizedDocs.map(termFreq);

  const df: Record<string, number> = {};
  for (const tokens of tokenizedDocs) {
    const unique = new Set(tokens);
    for (const token of unique) {
      df[token] = (df[token] || 0) + 1;
    }
  }

  const vocab = Object.keys(df);
  const idf: Record<string, number> = {};
  const N = docs.length;
  for (const term of vocab) {
    idf[term] = Math.log((1 + N) / (1 + df[term])) + 1;
  }

  const sparseVectors = termFrequencies.map(freqs => {
    const sparse: Record<string, number> = {};
    for (const term in freqs) {
      sparse[term] = freqs[term] * idf[term];
    }
    return sparse;
  });

  return { sparseVectors, vocab };
}

// --- Sparse Random Projection ---
function createSparseRandomProjectionMatrix(vocabSize: number, dim: number): number[][] {
  const matrix: number[][] = Array.from({ length: dim }, () => new Array(vocabSize));
  for (let i = 0; i < dim; i++) {
    for (let j = 0; j < vocabSize; j++) {
      // Achlioptas: -1, 0, +1 with 90% sparsity
      const r = Math.random();
      matrix[i][j] = r < 0.1 ? (Math.random() < 0.5 ? 1 : -1) : 0;
    }
  }
  return matrix;
}

// --- Project Sparse Vector ---
function projectSparseVector(
  sparse: Record<string, number>,
  vocabIndex: Record<string, number>,
  projectionMatrix: number[][]
): Float32Array {
  const vector = new Float32Array(projectionMatrix.length);
  for (let i = 0; i < projectionMatrix.length; i++) {
    let sum = 0;
    for (const term in sparse) {
      const idx = vocabIndex[term];
      if (idx !== undefined) sum += sparse[term] * projectionMatrix[i][idx];
    }
    vector[i] = sum;
  }
  return vector;
}

// --- Cosine similarity ---
function cosineSimilarity(vec1: Float32Array, vec2: Float32Array): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < vec1.length; i++) {
    dot += vec1[i] * vec2[i];
    normA += vec1[i] * vec1[i];
    normB += vec2[i] * vec2[i];
  }
  return normA && normB ? dot / (Math.sqrt(normA) * Math.sqrt(normB)) : 0;
}

// --- Random noise ---
function normalRandom(mean = 0, stddev = 1): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return mean + stddev * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

// --- IndexedDB ---
async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    }
  });
}

// --- Initialization (optimized) ---
export async function tf_idf_initialize(songs: Song[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.store;

  const combinedDocs = songs.map(song => ({
    id: song.id,
    combined: [
      ...Array(WEIGHTS.artist).fill(song.artist),
      ...Array(WEIGHTS.title).fill(song.title),
      ...Array(WEIGHTS.yt_title).fill(song.yt_title),
      ...Array(WEIGHTS.description).fill(song.description),
    ].join(' ')
  }));

  const docs = combinedDocs.map(d => d.combined);
  const { sparseVectors, vocab } = computeTfIdf(docs);

  // Build fast lookup for vocab
  const vocabIndex: Record<string, number> = {};
  vocab.forEach((term, idx) => vocabIndex[term] = idx);

  // Precompute projection matrix once
  const projectionMatrix = createSparseRandomProjectionMatrix(vocab.length, PROJECTION_DIM);

  // Precompute projected vectors
  const projectedVectors = sparseVectors.map(sparse =>
    projectSparseVector(sparse, vocabIndex, projectionMatrix)
  );

  // Batch save (parallel, no await in loop)
  await Promise.all(combinedDocs.map((doc, i) =>
    store.put({
      id: doc.id,
      vector: projectedVectors[i].buffer, // store as ArrayBuffer
    })
  ));

  await tx.done;
}

// --- Recommendations ---
export async function getTopRecommendations(
  likedIds: number[],
  count = 5
): Promise<{ id: number; score: number }[]> {
  const db = await getDB();
  const store = db.transaction(STORE_NAME, 'readonly').store;
  const allSongs = await store.getAll() as { id: number; vector: ArrayBuffer }[];

  const idToVector = Object.fromEntries(
    allSongs.map(song => [song.id, new Float32Array(song.vector)])
  );
  const likedVectors = likedIds.map(id => idToVector[id]).filter(Boolean);

  if (likedVectors.length === 0) return [];

  const avgSimilarities = allSongs.map(song => {
    const songVec = new Float32Array(song.vector);
    const sims = likedVectors.map(vec => cosineSimilarity(vec, songVec));
    const avgSim = sims.reduce((a, b) => a + b, 0) / sims.length;
    const noise = normalRandom(0, 0.01);
    return { id: song.id, score: avgSim + noise };
  });

  const recommendations = avgSimilarities
    .filter(r => !likedIds.includes(r.id))
    .sort((a, b) => b.score - a.score);

  const topPool = recommendations.slice(0, 50);
  const shuffled = topPool.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
