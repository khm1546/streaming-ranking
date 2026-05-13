import { notFound } from 'next/navigation';
import { prisma } from '@streaming/db';
import { EditGuideForm } from './form';

export const metadata = { title: '가이드 수정 — Admin' };

export default async function EditGuidePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const guide = await prisma.streamingGuide.findUnique({ where: { id } });
  if (!guide) notFound();

  return (
    <EditGuideForm
      id={guide.id}
      defaultPlatform={guide.platform}
      defaultTitle={guide.title}
      defaultBody={guide.body}
      defaultOrder={guide.order}
    />
  );
}
