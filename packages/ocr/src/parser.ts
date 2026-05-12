import { PLATFORM_KEYWORDS, type Platform } from './platforms';
import type { OcrResult, ParsedProof } from './types';

export function detectPlatform(text: string): Platform | null {
  for (const [platform, keywords] of Object.entries(PLATFORM_KEYWORDS) as [Platform, string[]][]) {
    if (platform === 'OTHER') continue;
    if (keywords.some((kw) => text.includes(kw))) {
      return platform;
    }
  }
  return null;
}

const PLAY_COUNT_PATTERNS: RegExp[] = [
  /재생\s*횟수\s*[:\s]*([0-9,]+)/,
  /재생\s*([0-9,]+)\s*회/,
  /([0-9,]+)\s*회\s*재생/,
  /play\s*count\s*[:\s]*([0-9,]+)/i,
  /([0-9,]+)\s*plays/i,
];

export function extractPlayCount(text: string): number | null {
  for (const re of PLAY_COUNT_PATTERNS) {
    const m = text.match(re);
    if (m && m[1]) {
      const n = parseInt(m[1].replace(/,/g, ''), 10);
      if (!isNaN(n)) return n;
    }
  }
  return null;
}

export function parseStreamingProof(ocr: OcrResult): ParsedProof {
  const text = ocr.text;
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  return {
    platform: detectPlatform(text),
    songTitleCandidates: lines.slice(0, 5),
    artistCandidates: lines.slice(0, 5),
    playCount: extractPlayCount(text),
    rawText: text,
    confidence: ocr.confidence,
  };
}
