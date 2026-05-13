import { createWorker } from 'tesseract.js';
import { preprocessForOcr } from './preprocess';
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
  let target: File | Blob | string = image;
  if (typeof image !== 'string') {
    try {
      target = await preprocessForOcr(image);
    } catch {
      // preprocessing 실패시 원본 그대로
    }
  }
  const { data } = await worker.recognize(target);
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
