import { z } from 'zod';
import { PLATFORMS, ALLOWED_PROOF_MIME_TYPES, MAX_PROOF_IMAGE_SIZE_BYTES } from '../constants';

export const platformSchema = z.enum(PLATFORMS);

export const proofUploadSchema = z.object({
  songId: z.string().cuid().optional(),
  platform: platformSchema.optional(),
});

export const proofImageMetaSchema = z.object({
  size: z.number().max(MAX_PROOF_IMAGE_SIZE_BYTES, '이미지는 5MB 이하여야 합니다.'),
  mimeType: z.enum(ALLOWED_PROOF_MIME_TYPES),
});

export const proofReviewSchema = z.object({
  proofId: z.string().cuid(),
  approved: z.boolean(),
  songId: z.string().cuid().optional(),
  playCount: z.number().int().nonnegative().optional(),
  note: z.string().max(500).optional(),
});

export type ProofUploadInput = z.infer<typeof proofUploadSchema>;
export type ProofReviewInput = z.infer<typeof proofReviewSchema>;
