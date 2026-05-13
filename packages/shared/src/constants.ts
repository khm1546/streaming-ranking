export const PLATFORMS = [
  'MELON',
  'GENIE',
  'FLO',
  'BUGS',
  'YOUTUBE_MUSIC',
  'SPOTIFY',
  'APPLE_MUSIC',
  'VIBE',
  'OTHER',
] as const;

/** Currently supported platforms for user-facing UI (upload + guides). */
export const SUPPORTED_PLATFORMS = ['MELON'] as const;
export type SupportedPlatform = (typeof SUPPORTED_PLATFORMS)[number];

export const PLATFORM_LABELS: Record<(typeof PLATFORMS)[number], string> = {
  MELON: '멜론',
  GENIE: '지니',
  FLO: '플로',
  BUGS: '벅스',
  YOUTUBE_MUSIC: '유튜브뮤직',
  SPOTIFY: '스포티파이',
  APPLE_MUSIC: '애플뮤직',
  VIBE: '바이브',
  OTHER: '기타',
};

export const OCR_AUTO_APPROVE_THRESHOLD = 0.85;
export const MAX_PROOF_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
export const ALLOWED_PROOF_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp'] as const;
