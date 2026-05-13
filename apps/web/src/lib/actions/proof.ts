'use server';

import { createHash } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import {
  prisma,
  matchSongFromText,
  uploadProofImage,
  requireUser,
  type Platform,
  type ProofStatus,
} from '@streaming/db';
import { OCR_AUTO_APPROVE_THRESHOLD, ALLOWED_PROOF_MIME_TYPES, MAX_PROOF_IMAGE_SIZE_BYTES } from '@streaming/shared';

export type SubmitProofResult =
  | {
      ok: true;
      proofId: string;
      status: ProofStatus;
      matchedSongTitle: string | null;
      playCount: number;
    }
  | { ok: false; error: string };

export async function submitProof(formData: FormData): Promise<SubmitProofResult> {
  try {
    const user = await requireUser();

    const file = formData.get('file');
    if (!(file instanceof File)) {
      return { ok: false, error: '파일이 첨부되지 않았습니다.' };
    }
    if (!(ALLOWED_PROOF_MIME_TYPES as readonly string[]).includes(file.type)) {
      return { ok: false, error: 'PNG·JPG·WEBP 만 업로드 가능합니다.' };
    }
    if (file.size > MAX_PROOF_IMAGE_SIZE_BYTES) {
      return { ok: false, error: '이미지는 5MB 이하여야 합니다.' };
    }

    const ocrText = String(formData.get('ocrText') ?? '');
    const ocrConfidence = Number(formData.get('ocrConfidence') ?? 0);
    const parsedPlatform = (formData.get('parsedPlatform') as Platform | null) || 'MELON';
    const parsedPlayCount = Number(formData.get('parsedPlayCount') ?? 0);
    const userTitle = String(formData.get('userTitle') ?? '').trim();

    // Compute sha256 from buffer (server-trusted)
    const buf = Buffer.from(await file.arrayBuffer());
    const imageHash = createHash('sha256').update(buf).digest('hex');

    // Dedupe
    const existing = await prisma.streamingProof.findUnique({ where: { imageHash } });
    if (existing) {
      return { ok: false, error: '이미 업로드된 이미지입니다.' };
    }

    // Match song against catalog
    const songs = await prisma.song.findMany({ where: { isActive: true } });
    const haystack = userTitle ? `${userTitle}\n${ocrText}` : ocrText;
    const match = matchSongFromText(haystack, songs);

    // Upload to storage
    const ext = file.name.split('.').pop() ?? 'png';
    const upload = await uploadProofImage(buf, `${imageHash.slice(0, 12)}.${ext}`, file.type);

    // Decide status
    let status: ProofStatus;
    if (!match) {
      status = 'PENDING_REVIEW';
    } else if (ocrConfidence >= OCR_AUTO_APPROVE_THRESHOLD && parsedPlayCount > 0) {
      status = 'AUTO_APPROVED';
    } else {
      status = 'PENDING_REVIEW';
    }

    const proof = await prisma.streamingProof.create({
      data: {
        userId: user.id,
        songId: match?.song.id ?? null,
        imageUrl: upload.publicUrl,
        imageHash,
        platform: parsedPlatform,
        playCount: parsedPlayCount,
        ocrText,
        ocrConfidence,
        ocrRawJson: { match: match?.matchedOn ?? null, score: match?.score ?? null },
        status,
      },
    });

    revalidatePath('/songs');
    revalidatePath('/ranking');

    return {
      ok: true,
      proofId: proof.id,
      status,
      matchedSongTitle: match?.song.title ?? null,
      playCount: parsedPlayCount,
    };
  } catch (e) {
    console.error('[submitProof] failed', e);
    return { ok: false, error: e instanceof Error ? e.message : '업로드 실패' };
  }
}
