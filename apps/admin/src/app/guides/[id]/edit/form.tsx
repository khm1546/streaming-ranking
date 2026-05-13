'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@streaming/ui';
import { SUPPORTED_PLATFORMS, PLATFORM_LABELS } from '@streaming/shared';
import type { Platform } from '@streaming/db';
import { RichEditor } from '../../../../components/rich-editor';
import { updateGuide } from '../../../../lib/actions/guide';

export function EditGuideForm({
  id,
  defaultPlatform,
  defaultTitle,
  defaultBody,
  defaultOrder,
}: {
  id: string;
  defaultPlatform: Platform;
  defaultTitle: string;
  defaultBody: string;
  defaultOrder: number;
}) {
  const router = useRouter();
  const [platform, setPlatform] = useState<Platform>(defaultPlatform);
  const [title, setTitle] = useState(defaultTitle);
  const [body, setBody] = useState(defaultBody);
  const [order, setOrder] = useState(defaultOrder);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!title.trim() || !body.trim()) {
      setError('제목과 본문을 입력하세요.');
      return;
    }
    start(async () => {
      try {
        await updateGuide(id, { platform, title, body, order });
        router.push('/guides');
      } catch (e) {
        setError(e instanceof Error ? e.message : '저장에 실패했습니다.');
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">가이드 수정</h1>
        <Link href="/guides" className="text-sm text-text-muted hover:text-brand-600">
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
              <label className="mb-1 block text-sm font-medium">플랫폼</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as Platform)}
                className="h-10 w-full rounded-md border border-surface-border bg-surface px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {SUPPORTED_PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {PLATFORM_LABELS[p]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">제목</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">본문</label>
              <RichEditor value={body} onChange={setBody} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">정렬 순서</label>
              <Input
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="w-32"
              />
            </div>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <div className="flex gap-2">
              <Button type="submit" disabled={pending}>
                {pending ? '저장 중...' : '저장'}
              </Button>
              <Link href="/guides">
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
