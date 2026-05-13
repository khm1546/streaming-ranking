export { runOcr, terminateOcrWorker } from './tesseract-client';
export { preprocessForOcr } from './preprocess';
export {
  parseStreamingProof,
  detectPlatform,
  extractPlayCount,
  extractSnapshotDate,
} from './parser';
export type { OcrResult, ParsedProof } from './types';
