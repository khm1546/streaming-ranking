'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma, requireAdmin } from '@streaming/db';
import { songCreateSchema, songUpdateSchema } from '@streaming/shared';

function parseAliases(raw: FormDataEntryValue | null): string[] {
  if (typeof raw !== 'string') return [];
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function createSong(formData: FormData) {
  await requireAdmin();
  const data = songCreateSchema.parse({
    title: formData.get('title'),
    artist: formData.get('artist'),
    albumCoverUrl: formData.get('albumCoverUrl') || null,
    releaseDate: formData.get('releaseDate') || null,
    isActive: formData.get('isActive') === 'on',
    aliases: parseAliases(formData.get('aliases')),
  });
  await prisma.song.create({ data });
  revalidatePath('/songs');
  redirect('/songs');
}

export async function updateSong(id: string, formData: FormData) {
  await requireAdmin();
  const data = songUpdateSchema.parse({
    title: formData.get('title'),
    artist: formData.get('artist'),
    albumCoverUrl: formData.get('albumCoverUrl') || null,
    releaseDate: formData.get('releaseDate') || null,
    isActive: formData.get('isActive') === 'on',
    aliases: parseAliases(formData.get('aliases')),
  });
  await prisma.song.update({ where: { id }, data });
  revalidatePath('/songs');
  revalidatePath(`/songs/${id}/edit`);
  redirect('/songs');
}

export async function deleteSong(id: string) {
  await requireAdmin();
  await prisma.song.delete({ where: { id } });
  revalidatePath('/songs');
}

export async function toggleSongActive(id: string, isActive: boolean) {
  await requireAdmin();
  await prisma.song.update({ where: { id }, data: { isActive } });
  revalidatePath('/songs');
}
