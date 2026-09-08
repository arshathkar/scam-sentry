import { openDB, IDBPDatabase } from 'idb';
import type { ScanRecord } from '../engine/types';

const DB_NAME = 'scam-sentry-db';
const STORE_NAME = 'scam-patterns';
const SIMILARITY_THRESHOLD = 0.6;

interface PatternRecord {
  id?: number;
  signature: string[]; // array of 3-grams
  timestamp: number;
  scanRecord: ScanRecord;
}

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
          store.createIndex('timestamp', 'timestamp');
        }
      },
    });
  }
  return dbPromise;
}

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // remove punctuation
    .replace(/\d+/g, '')     // remove numbers
    .replace(/\s+/g, ' ')    // collapse whitespace
    .trim();
}

export function generateSignature(text: string): Set<string> {
  const words = text.split(' ').filter(w => w.length > 0);
  const ngrams = new Set<string>();
  
  for (let i = 0; i <= words.length - 3; i++) {
    ngrams.add(`${words[i]}_${words[i+1]}_${words[i+2]}`);
  }
  
  return ngrams;
}

export function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 1.0;
  if (a.size === 0 || b.size === 0) return 0.0;
  
  const intersection = new Set([...a].filter(x => b.has(x)));
  const union = new Set([...a, ...b]);
  
  return intersection.size / union.size;
}

export interface PatternCheckResult {
  isKnown: boolean;
  similarity: number;
  matchedRecord?: ScanRecord;
}

export async function checkPattern(text: string): Promise<PatternCheckResult> {
  const normText = normalizeText(text);
  const signature = generateSignature(normText);
  
  if (signature.size === 0) {
    return { isKnown: false, similarity: 0 };
  }

  const db = await getDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  const cursor = await store.openCursor(null, 'prev'); // newer first
  
  let bestMatch = { similarity: 0, record: null as ScanRecord | null };
  
  let currentCursor = cursor;
  while (currentCursor) {
    const record = currentCursor.value as PatternRecord;
    const storedSignature = new Set(record.signature);
    
    const similarity = jaccardSimilarity(signature, storedSignature);
    
    if (similarity > bestMatch.similarity) {
      bestMatch = { similarity, record: record.scanRecord };
      if (similarity > 0.9) break; // early exit on very strong match
    }
    
    currentCursor = await currentCursor.continue();
  }
  
  return {
    isKnown: bestMatch.similarity >= SIMILARITY_THRESHOLD,
    similarity: bestMatch.similarity,
    matchedRecord: bestMatch.record || undefined
  };
}

export async function storePattern(text: string, result: ScanRecord): Promise<void> {
  const normText = normalizeText(text);
  const signature = generateSignature(normText);
  
  if (signature.size === 0) return;

  const db = await getDB();
  const record: PatternRecord = {
    signature: Array.from(signature),
    timestamp: Date.now(),
    scanRecord: result
  };
  
  await db.add(STORE_NAME, record);
}

export async function getRecentScans(limit: number = 10): Promise<ScanRecord[]> {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const index = tx.objectStore(STORE_NAME).index('timestamp');
  
  let cursor = await index.openCursor(null, 'prev');
  const results: ScanRecord[] = [];
  
  while (cursor && results.length < limit) {
    results.push(cursor.value.scanRecord);
    cursor = await cursor.continue();
  }
  
  return results;
}

export async function deleteScan(scanId: string): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  let cursor = await store.openCursor();
  
  while (cursor) {
    const record = cursor.value as PatternRecord;
    if (record.scanRecord.id === scanId) {
      await cursor.delete();
      break;
    }
    cursor = await cursor.continue();
  }
  
  await tx.done;
}

export async function clearHistory(): Promise<void> {
  const db = await getDB();
  await db.clear(STORE_NAME);
}
