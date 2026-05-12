import type { Platform } from './platforms';

export type OcrResult = {
  text: string;
  confidence: number; // 0.0 - 1.0
  raw: unknown;
};

export type ParsedProof = {
  platform: Platform | null;
  songTitleCandidates: string[];
  artistCandidates: string[];
  playCount: number | null;
  rawText: string;
  confidence: number;
};

export type { Platform };
