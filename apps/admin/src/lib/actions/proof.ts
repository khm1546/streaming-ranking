'use server';

import { revalidatePath } from 'next/cache';
import { prisma, requireAdmin } from '@streaming/db';

export async function approveProof(input: {
  proofId: string;
  songId?: string;
  playCount?: number;
  note?: string;
}) {
  const reviewer = await requireAdmin();
  await prisma.$transaction([
    prisma.streamingProof.update({
      where: { id: input.proofId },
      data: {
        status: 'APPROVED',
        reviewedAt: new Date(),
        ...(input.songId !== undefined ? { songId: input.songId } : {}),
        ...(input.playCount !== undefined ? { playCount: input.playCount } : {}),
        rejectionReason: null,
      },
    }),
    prisma.review.create({
      data: {
        proofId: input.proofId,
        reviewerId: reviewer.id,
        approved: true,
        note: input.note ?? null,
      },
    }),
  ]);
  revalidatePath('/proofs');
}

export async function rejectProof(input: { proofId: string; reason: string }) {
  const reviewer = await requireAdmin();
  await prisma.$transaction([
    prisma.streamingProof.update({
      where: { id: input.proofId },
      data: {
        status: 'REJECTED',
        reviewedAt: new Date(),
        rejectionReason: input.reason,
      },
    }),
    prisma.review.create({
      data: {
        proofId: input.proofId,
        reviewerId: reviewer.id,
        approved: false,
        note: input.reason,
      },
    }),
  ]);
  revalidatePath('/proofs');
}
