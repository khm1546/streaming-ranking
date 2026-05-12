export type Platform =
  | 'MELON'
  | 'GENIE'
  | 'FLO'
  | 'BUGS'
  | 'YOUTUBE_MUSIC'
  | 'SPOTIFY'
  | 'APPLE_MUSIC'
  | 'VIBE'
  | 'OTHER';

export const PLATFORM_KEYWORDS: Record<Platform, string[]> = {
  MELON: ['멜론', 'Melon', 'melon'],
  GENIE: ['지니', 'Genie', 'genie'],
  FLO: ['FLO', 'Flo', '플로'],
  BUGS: ['벅스', 'Bugs', 'bugs'],
  YOUTUBE_MUSIC: ['YouTube Music', '유튜브 뮤직', '유튜브뮤직'],
  SPOTIFY: ['Spotify', '스포티파이'],
  APPLE_MUSIC: ['Apple Music', '애플 뮤직', '애플뮤직'],
  VIBE: ['VIBE', 'Vibe', '바이브'],
  OTHER: [],
};
