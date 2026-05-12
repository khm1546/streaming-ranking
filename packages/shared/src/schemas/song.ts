import { z } from 'zod';

export const songCreateSchema = z.object({
  title: z.string().min(1).max(200),
  artist: z.string().min(1).max(200),
  albumCoverUrl: z.string().url().optional().nullable(),
  releaseDate: z.coerce.date().optional().nullable(),
  isActive: z.boolean().default(true),
  aliases: z.array(z.string().min(1).max(200)).default([]),
});

export const songUpdateSchema = songCreateSchema.partial();

export type SongCreateInput = z.infer<typeof songCreateSchema>;
export type SongUpdateInput = z.infer<typeof songUpdateSchema>;
