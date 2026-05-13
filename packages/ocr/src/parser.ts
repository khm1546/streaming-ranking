import { PLATFORM_KEYWORDS, type Platform } from './platforms';
import type { OcrResult, ParsedProof } from './types';

export function detectPlatform(text: string): Platform | null {
  // Melon Trend cards 명시 키워드 우선
  if (/Melon\s*Trend|멜론\s*트렌드/i.test(text)) return 'MELON';

  for (const [platform, keywords] of Object.entries(PLATFORM_KEYWORDS) as [Platform, string[]][]) {
    if (platform === 'OTHER') continue;
    if (keywords.some((kw) => text.includes(kw))) {
      return platform;
    }
  }
  return null;
}

/**
 * "내 스트리밍" 패턴 — Melon Trend 공유 카드의 사용자 개인 재생 수.
 * "전체 스트리밍 / 전체 감상자"는 의도적으로 제외 (글로벌 통계라 인증 가치 없음).
 * 폴백으로 일반 멜론 인앱 스크린샷의 "재생 횟수" 패턴도 지원.
 */
const MY_PLAY_COUNT_PATTERNS: RegExp[] = [
  // Melon Trend: "내 스트리밍\n69" 또는 "내 스트리밍 1.2K"
  /내\s*스트리밍\s*[:\s\n]*([0-9,]+(?:\.[0-9]+)?)\s*([KkMm]?)\b/,
  // Melon 인앱 등 일반
  /재생\s*횟수\s*[:\s]*([0-9,]+)/,
  /재생\s*([0-9,]+)\s*회/,
  /([0-9,]+)\s*회\s*재생/,
  /play\s*count\s*[:\s]*([0-9,]+)/i,
  /([0-9,]+)\s*plays/i,
];

function parseNumber(raw: string, suffix?: string): number {
  const cleaned = raw.replace(/,/g, '');
  const num = parseFloat(cleaned);
  if (isNaN(num)) return 0;
  const s = suffix?.toLowerCase();
  const mult = s === 'k' ? 1000 : s === 'm' ? 1000000 : 1;
  return Math.round(num * mult);
}

export function extractPlayCount(text: string): number | null {
  for (const re of MY_PLAY_COUNT_PATTERNS) {
    const m = text.match(re);
    if (m && m[1]) {
      const num = parseNumber(m[1], m[2]);
      if (num > 0) return num;
    }
  }
  return null;
}

/** Melon Trend 카드 날짜: "2026.05.12" 형식 */
const SNAPSHOT_DATE_PATTERN = /(20\d{2})[.\-/](\d{1,2})[.\-/](\d{1,2})/;

export function extractSnapshotDate(text: string): string | null {
  const m = text.match(SNAPSHOT_DATE_PATTERN);
  if (!m) return null;
  const [, y, mo, d] = m;
  return `${y}-${mo!.padStart(2, '0')}-${d!.padStart(2, '0')}`;
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
