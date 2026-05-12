import { createWorker } from 'tesseract.js';
import type { OcrResult } from './types';

let workerPromise: ReturnType<typeof createWorker> | null = null;

async function getWorker() {
  if (!workerPromise) {
    workerPromise = createWorker(['kor', 'eng']);
  }
  return workerPromise;
}

export async function runOcr(image: File | Blob | string): Promise<OcrResult> {
  const worker = await getWorker();
  const { data } = await worker.recognize(image);
  return {
    text: data.text ?? '',
    confidence: typeof data.confidence === 'number' ? data.confidence / 100 : 0,
    raw: data,
  };
}

export async function terminateOcrWorker() {
  if (workerPromise) {
    const worker = await workerPromise;
    await worker.terminate();
    workerPromise = null;
  }
}
