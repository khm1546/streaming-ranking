'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@streaming/ui';
import { PLATFORMS, PLATFORM_LABELS } from '@streaming/shared';
import { RichEditor } from '../../../components/rich-editor';

export default function NewGuidePage() {
  const [platform, setPlatform] = useState<(typeof PLATFORMS)[number]>('MELON');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      // TODO: POST /api/admin/guides
      console.log('create guide', { platform, title, body });
      alert('저장 (TODO: API 연결)');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">새 스밍 가이드</h1>
        <Link href="/guides" className="text-sm text-text-muted hover:text-brand-600">
          ← 목록
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>가이드 작성</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">플랫폼</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as (typeof PLATFORMS)[number])}
                className="h-10 w-full rounded-md border border-surface-border bg-surface px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {PLATFORMS.filter((p) => p !== 'OTHER').map((p) => (
                  <option key={p} value={p}>
                    {PLATFORM_LABELS[p]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">제목</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예) 멜론 스밍 인증 가이드"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">본문</label>
              <RichEditor value={body} onChange={setBody} placeholder="가이드 내용을 작성하세요..." />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={submitting}>
                {submitting ? '저장 중...' : '저장'}
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
