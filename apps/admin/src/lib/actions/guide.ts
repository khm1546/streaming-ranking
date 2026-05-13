'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma, requireAdmin, type Platform } from '@streaming/db';

export async function createGuide(input: {
  platform: Platform;
  title: string;
  body: string;
  order?: number;
}) {
  await requireAdmin();
  const created = await prisma.streamingGuide.create({
    data: {
      platform: input.platform,
      title: input.title,
      body: input.body,
      order: input.order ?? 0,
    },
  });
  revalidatePath('/guides');
  return created;
}

export async function updateGuide(
  id: string,
  input: { platform: Platform; title: string; body: string; order?: number },
) {
  await requireAdmin();
  await prisma.streamingGuide.update({
    where: { id },
    data: input,
  });
  revalidatePath('/guides');
  revalidatePath(`/guides/${id}/edit`);
}

export async function deleteGuide(id: string) {
  await requireAdmin();
  await prisma.streamingGuide.delete({ where: { id } });
  revalidatePath('/guides');
  redirect('/guides');
}
