import { notFound } from 'next/navigation';
import { prisma } from '@streaming/db';
import { EditAnnouncementForm } from './form';

export const metadata = { title: '공지 수정 — Admin' };

export default async function EditAnnouncementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const announcement = await prisma.announcement.findUnique({ where: { id } });
  if (!announcement) notFound();

  return (
    <EditAnnouncementForm
      id={announcement.id}
      defaultTitle={announcement.title}
      defaultBody={announcement.body}
      defaultPinned={announcement.pinned}
    />
  );
}
