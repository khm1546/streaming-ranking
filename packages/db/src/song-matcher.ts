import type { Song } from '@prisma/client';

/** Normalize for matching — lowercase, strip whitespace and punctuation */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[\s\p{P}\p{S}]+/gu, '')
    .trim();
}

export type MatchResult = {
  song: Song;
  score: number; // 0..1, 1 = exact alias hit
  matchedOn: string;
};

/**
 * Match OCR text against the song catalog.
 * Strategy:
 *  1. Exact alias / title substring → score 1
 *  2. Title without artist → score 0.85
 *  3. Artist + title fuzzy contains → score 0.7
 * Returns best match or null.
 */
export function matchSongFromText(rawText: string, songs: Song[]): MatchResult | null {
  if (!rawText || songs.length === 0) return null;
  const norm = normalize(rawText);

  let best: MatchResult | null = null;

  for (const song of songs) {
    const candidates: Array<{ value: string; score: number; label: string }> = [
      ...song.aliases.map((a) => ({ value: a, score: 1.0, label: `alias:${a}` })),
      { value: song.title, score: 0.92, label: `title` },
      { value: `${song.artist}${song.title}`, score: 0.85, label: 'artist+title' },
      { value: `${song.title}${song.artist}`, score: 0.85, label: 'title+artist' },
    ];

    for (const c of candidates) {
      const candNorm = normalize(c.value);
      if (!candNorm) continue;
      if (norm.includes(candNorm)) {
        if (!best || c.score > best.score) {
          best = { song, score: c.score, matchedOn: c.label };
        }
      }
    }
  }

  return best;
}
