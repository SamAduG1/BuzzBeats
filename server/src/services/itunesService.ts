import { Song } from '@shared/types/music';

export interface EnrichedSong extends Song {
  previewUrl: string;
  albumArtUrl: string;
  lyric?: string;  // populated for Name That Lyric mode only
}

interface ITunesResult {
  trackName: string;
  artistName: string;
  collectionName: string;
  previewUrl: string;
  artworkUrl100: string;
  trackId: number;
}

interface ITunesResponse {
  resultCount: number;
  results: ITunesResult[];
}

async function fetchSongPreview(
  title: string,
  artist: string
): Promise<{ previewUrl: string; albumArtUrl: string } | null> {
  const query = encodeURIComponent(`${title} ${artist}`);
  const url = `https://itunes.apple.com/search?term=${query}&media=music&limit=3`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) return null;

    const data = (await response.json()) as ITunesResponse;
    if (data.resultCount === 0) return null;

    const match =
      data.results.find(
        (r) => r.artistName.toLowerCase() === artist.toLowerCase()
      ) || data.results[0];

    if (!match.previewUrl) return null;

    const albumArtUrl = match.artworkUrl100.replace('100x100', '600x600');
    return { previewUrl: match.previewUrl, albumArtUrl };
  } catch (error) {
    console.error(`[iTunes] Failed to fetch preview for "${title}" by ${artist}:`, error);
    return null;
  }
}

const BATCH_SIZE = 5;

export async function fetchSongsForGame(
  songPool: Song[],
  count: number
): Promise<EnrichedSong[]> {
  const shuffled = [...songPool].sort(() => Math.random() - 0.5);
  const enriched: EnrichedSong[] = [];
  let i = 0;

  // Fetch in parallel batches until we have enough songs
  while (enriched.length < count && i < shuffled.length) {
    const batch = shuffled.slice(i, i + BATCH_SIZE);
    i += BATCH_SIZE;

    const results = await Promise.all(
      batch.map(async (song) => {
        const result = await fetchSongPreview(song.title, song.artist);
        if (result) {
          console.log(`[iTunes] Fetched: "${song.title}" by ${song.artist}`);
          return { ...song, ...result } as EnrichedSong;
        }
        console.warn(`[iTunes] Skipping: "${song.title}" by ${song.artist} (no preview)`);
        return null;
      })
    );

    for (const r of results) {
      if (r && enriched.length < count) enriched.push(r);
    }
  }

  if (enriched.length < count) {
    console.warn(`[iTunes] Only found ${enriched.length}/${count} songs with previews`);
  }

  return enriched;
}
