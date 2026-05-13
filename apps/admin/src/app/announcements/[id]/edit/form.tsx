'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@streaming/ui';
import { announcementUpdateSchema } from '@streaming/shared';
import { RichEditor } from '../../../../components/rich-editor';
import { updateAnnouncement } from '../../../../lib/actions/announcement';

export function EditAnnouncementForm({
  id,
  defaultTitle,
  defaultBody,
  defaultPinned,
}: {
  id: string;
  defaultTitle: string;
  defaultBody: string;
  defaultPinned: boolean;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(defaultTitle);
  const [body, setBody] = useState(defaultBody);
  const [pinned, setPinned] = useState(defaultPinned);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = announcementUpdateSchema.safeParse({ title, body, pinned });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? '입력값을 확인하세요.');
      return;
    }
    start(async () => {
      try {
        await updateAnnouncement(id, { title, body, pinned });
        router.push('/announcements');
      } catch (e) {
        setError(e instanceof Error ? e.message : '저장에 실패했습니다.');
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">공지 수정</h1>
        <Link href="/announcements" className="text-sm text-text-muted hover:text-brand-600">
          ← 목록
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{defaultTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">제목</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">본문</label>
              <RichEditor value={body} onChange={setBody} />
            </div>
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={pinned}
                onChange={(e) => setPinned(e.target.checked)}
              />
              상단 고정
            </label>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <div className="flex gap-2">
              <Button type="submit" disabled={pending}>
                {pending ? '저장 중...' : '저장'}
              </Button>
              <Link href="/announcements">
                <Button type="button" variant="secondary">
                  취소
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
