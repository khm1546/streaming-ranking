import { z } from 'zod';

export const announcementCreateSchema = z.object({
  title: z.string().min(1).max(200),
  body: z.string().min(1).max(10000),
  pinned: z.boolean().default(false),
  publishedAt: z.coerce.date().optional(),
});

export const announcementUpdateSchema = announcementCreateSchema.partial();

export type AnnouncementCreateInput = z.infer<typeof announcementCreateSchema>;
export type AnnouncementUpdateInput = z.infer<typeof announcementUpdateSchema>;
