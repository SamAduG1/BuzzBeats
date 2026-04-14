import * as fs from 'fs';
import * as path from 'path';
import { Song } from '@shared/types/music';
import { EnrichedSong } from './itunesService';

// ---------------------------------------------------------------------------
// Lyric cache — persisted to disk so repeated games never re-fetch the same song
// ---------------------------------------------------------------------------

interface CacheEntry {
  lyric: string;       // 2-3 line display snippet
  cachedAt: string;    // ISO timestamp
}

type LyricCache = Record<string, CacheEntry>;  // songId → entry

const CACHE_PATH = path.join(__dirname, '../data/lyricCache.json');

function loadCache(): LyricCache {
  try {
    const raw = fs.readFileSync(CACHE_PATH, 'utf-8');
    return JSON.parse(raw) as LyricCache;
  } catch {
    return {};
  }
}

function saveCache(cache: LyricCache): void {
  try {
    fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Lyrics] Failed to write cache:', err);
  }
}

// Load once on module init — stays in memory, flushed to disk on each new entry
const lyricCache: LyricCache = loadCache();
console.log(`[Lyrics] Cache loaded — ${Object.keys(lyricCache).length} entries`);

// ---------------------------------------------------------------------------
// Snippet extraction — pick the most recognisable 2-3 lines
// ---------------------------------------------------------------------------

function extractSnippet(raw: string): string {
  const lines = raw
    .split('\n')
    .map((l) => l.trim())
    // Drop section headers like [Verse 1], [Chorus], timestamps, and blank lines
    .filter((l) => l.length > 2 && !/^\[.*\]$/.test(l) && !/^\d+:\d+/.test(l));

  if (lines.length === 0) return '';
  if (lines.length <= 3) return lines.join('\n');

  // Aim for the 35-55% region — usually lands in or near the chorus
  const start = Math.floor(lines.length * 0.35);
  const slice = lines.slice(start, start + 3);
  return slice.join('\n');
}

// ---------------------------------------------------------------------------
// Fetch from lyrics.ovh (free, no auth required)
// Falls back to Musixmatch if MUSIXMATCH_API_KEY is set in env.
// ---------------------------------------------------------------------------

async function fetchFromLyricsOvh(title: string, artist: string): Promise<string | null> {
  const url = `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const data = await res.json() as { lyrics?: string; error?: string };
    if (!data.lyrics || data.error) return null;
    return data.lyrics;
  } catch {
    return null;
  }
}

async function fetchFromMusixmatch(title: string, artist: string): Promise<string | null> {
  const apiKey = process.env.MUSIXMATCH_API_KEY;
  if (!apiKey) return null;

  const url = `https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?q_track=${encodeURIComponent(title)}&q_artist=${encodeURIComponent(artist)}&apikey=${apiKey}`;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const data = await res.json() as { message?: { body?: { lyrics?: { lyrics_body?: string } } } };
    return data.message?.body?.lyrics?.lyrics_body ?? null;
  } catch {
    return null;
  }
}

async function fetchLyricRaw(title: string, artist: string): Promise<string | null> {
  // Try lyrics.ovh first — free, no key needed
  const ovh = await fetchFromLyricsOvh(title, artist);
  if (ovh) return ovh;
  // Fall back to Musixmatch if a key is configured
  return fetchFromMusixmatch(title, artist);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function getLyricSnippet(song: Song): Promise<string | null> {
  // Cache hit
  if (lyricCache[song.id]) {
    return lyricCache[song.id].lyric;
  }

  console.log(`[Lyrics] Fetching: "${song.title}" by ${song.artist}`);
  const raw = await fetchLyricRaw(song.title, song.artist);
  if (!raw) {
    console.warn(`[Lyrics] Not found: "${song.title}" by ${song.artist}`);
    return null;
  }

  const snippet = extractSnippet(raw);
  if (!snippet) {
    console.warn(`[Lyrics] Empty snippet after extraction: "${song.title}"`);
    return null;
  }

  // Persist to cache
  lyricCache[song.id] = { lyric: snippet, cachedAt: new Date().toISOString() };
  saveCache(lyricCache);

  console.log(`[Lyrics] Cached: "${song.title}" — snippet: "${snippet.slice(0, 60)}..."`);
  return snippet;
}

const BATCH_SIZE = 3;  // smaller batches — lyrics.ovh can be slow

export async function fetchSongsWithLyrics(
  pool: Song[],
  count: number
): Promise<EnrichedSong[]> {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const result: EnrichedSong[] = [];
  let i = 0;

  while (result.length < count && i < shuffled.length) {
    const batch = shuffled.slice(i, i + BATCH_SIZE);
    i += BATCH_SIZE;

    const fetched = await Promise.all(
      batch.map(async (song) => {
        const lyric = await getLyricSnippet(song);
        if (!lyric) return null;
        return {
          ...song,
          previewUrl: '',    // no audio for this mode
          albumArtUrl: '',   // no album art at game start (shown on reveal via roundResult)
          lyric,
        } as EnrichedSong;
      })
    );

    for (const s of fetched) {
      if (s && result.length < count) result.push(s);
    }
  }

  if (result.length < count) {
    console.warn(`[Lyrics] Only found ${result.length}/${count} songs with lyrics`);
  }

  return result;
}
