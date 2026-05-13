'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma, requireAdmin } from '@streaming/db';
import { announcementCreateSchema, announcementUpdateSchema } from '@streaming/shared';

export async function createAnnouncement(input: {
  title: string;
  body: string;
  pinned: boolean;
}) {
  await requireAdmin();
  const data = announcementCreateSchema.parse(input);
  const created = await prisma.announcement.create({ data });
  revalidatePath('/announcements');
  return created;
}

export async function updateAnnouncement(
  id: string,
  input: { title: string; body: string; pinned: boolean },
) {
  await requireAdmin();
  const data = announcementUpdateSchema.parse(input);
  await prisma.announcement.update({ where: { id }, data });
  revalidatePath('/announcements');
  revalidatePath(`/announcements/${id}/edit`);
}

export async function deleteAnnouncement(id: string) {
  await requireAdmin();
  await prisma.announcement.delete({ where: { id } });
  revalidatePath('/announcements');
  redirect('/announcements');
}
