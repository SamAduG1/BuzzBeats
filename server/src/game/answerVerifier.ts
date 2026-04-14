export interface VerifyResult {
  artistCorrect: boolean;
  titleCorrect: boolean;
  points: number;
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  return dp[m][n];
}

function normalize(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/^the\s+/, '')     // remove leading "the "
    .replace(/[^\w\s]/g, '')    // remove punctuation
    .replace(/\s+/g, ' ');      // collapse whitespace
}

function fuzzyMatch(submitted: string, actual: string): boolean {
  const a = normalize(submitted);
  const b = normalize(actual);

  if (!a) return false;

  // Exact match after normalization
  if (a === b) return true;

  // Check if submitted is a substantial substring of actual (e.g. "Kendrick" for "Kendrick Lamar")
  if (b.includes(a) && a.length >= 3) return true;

  // Levenshtein distance - allow more edits for longer strings
  const maxDistance = b.length <= 5 ? 1 : b.length <= 10 ? 2 : 3;
  if (levenshtein(a, b) <= maxDistance) return true;

  return false;
}

export function verifyAnswer(
  submitted: { artist: string; title: string },
  actual: { artist: string; title: string }
): VerifyResult {
  const artistCorrect = fuzzyMatch(submitted.artist, actual.artist);
  const titleCorrect = fuzzyMatch(submitted.title, actual.title);

  let points = 0;
  if (artistCorrect) points += 1;
  if (titleCorrect) points += 2;

  return { artistCorrect, titleCorrect, points };
}
