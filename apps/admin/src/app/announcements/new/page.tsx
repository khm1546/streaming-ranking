'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@streaming/ui';
import { announcementCreateSchema } from '@streaming/shared';
import { RichEditor } from '../../../components/rich-editor';

export default function NewAnnouncementPage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [pinned, setPinned] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = announcementCreateSchema.safeParse({ title, body, pinned });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? '입력값을 확인하세요.');
      return;
    }
    setSubmitting(true);
    try {
      // TODO: POST /api/admin/announcements
      console.log('create announcement', parsed.data);
      alert('저장 (TODO: API 연결)');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">새 공지사항</h1>
        <Link href="/announcements" className="text-sm text-text-muted hover:text-brand-600">
          ← 목록
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>공지 작성</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">제목</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
                maxLength={200}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">본문</label>
              <RichEditor value={body} onChange={setBody} placeholder="공지 내용을 작성하세요..." />
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
              <Button type="submit" disabled={submitting}>
                {submitting ? '저장 중...' : '저장'}
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
