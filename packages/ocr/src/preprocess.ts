/**
 * Browser-only: 다크 배경 이미지를 OCR 친화적으로 변환.
 * - 평균 밝기 < 100 → 반전 (다크 → 라이트)
 * - 2배 업스케일 → 작은 글씨 인식률 향상
 */
export async function preprocessForOcr(input: File | Blob): Promise<Blob> {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return input;
  }

  const url = URL.createObjectURL(input);
  const img = new Image();
  try {
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('image load failed'));
      img.src = url;
    });
  } finally {
    URL.revokeObjectURL(url);
  }

  const scale = 2;
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth * scale;
  canvas.height = img.naturalHeight * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) return input;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const px = data.data;

  // 평균 밝기 측정 (100픽셀당 1개 샘플)
  let total = 0;
  let count = 0;
  for (let i = 0; i < px.length; i += 4 * 100) {
    total += (px[i]! + px[i + 1]! + px[i + 2]!) / 3;
    count++;
  }
  const avgBrightness = count > 0 ? total / count : 128;

  if (avgBrightness < 100) {
    // 다크 배경 → 반전 + 약한 contrast boost
    for (let i = 0; i < px.length; i += 4) {
      px[i] = 255 - px[i]!;
      px[i + 1] = 255 - px[i + 1]!;
      px[i + 2] = 255 - px[i + 2]!;
    }
    ctx.putImageData(data, 0, 0);
  }

  return await new Promise<Blob>((resolve) => {
    canvas.toBlob((blob) => resolve(blob ?? input), 'image/png', 0.95);
  });
}
