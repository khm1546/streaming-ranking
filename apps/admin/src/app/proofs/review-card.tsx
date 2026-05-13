'use client';

import { useState, useTransition } from 'react';
import { Button, Card, CardContent } from '@streaming/ui';
import { approveProof, rejectProof } from '../../lib/actions/proof';

type Proof = {
  id: string;
  imageUrl: string;
  playCount: number;
  ocrText: string;
  ocrConfidence: number;
  platform: string;
  createdAt: string;
  userNickname: string;
  currentSongId: string | null;
  currentSongLabel: string;
};

type SongOption = { id: string; title: string; artist: string };

export function ProofReviewCard({ proof, songs }: { proof: Proof; songs: SongOption[] }) {
  const [songId, setSongId] = useState<string>(proof.currentSongId ?? '');
  const [playCount, setPlayCount] = useState<number>(proof.playCount);
  const [reason, setReason] = useState('');
  const [pending, start] = useTransition();
  const [done, setDone] = useState(false);

  if (done) return null;

  function handleApprove() {
    start(async () => {
      await approveProof({
        proofId: proof.id,
        songId: songId || undefined,
        playCount,
      });
      setDone(true);
    });
  }

  function handleReject() {
    if (!reason.trim()) {
      alert('반려 사유를 입력하세요.');
      return;
    }
    start(async () => {
      await rejectProof({ proofId: proof.id, reason });
      setDone(true);
    });
  }

  return (
    <Card>
      <CardContent className="grid gap-6 py-5 md:grid-cols-[260px_1fr]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={proof.imageUrl}
          alt="proof"
          className="h-64 w-full rounded-lg border border-surface-border object-contain bg-surface-muted"
        />

        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs text-text-muted">
                @{proof.userNickname} · {proof.platform} ·{' '}
                {new Date(proof.createdAt).toLocaleString('ko-KR')}
              </div>
              <div className="mt-1 text-sm">
                현재 매칭: <span className="font-medium">{proof.currentSongLabel}</span>
              </div>
            </div>
            <div className="text-right text-xs text-text-muted">
              OCR 신뢰도{' '}
              <span className="text-base font-semibold">
                {Math.round(proof.ocrConfidence * 100)}%
              </span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-medium text-text-muted">곡 선택</span>
              <select
                value={songId}
                onChange={(e) => setSongId(e.target.value)}
                className="h-10 w-full rounded-md border border-surface-border bg-surface px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">— 미매칭 (관리자 직접 선택) —</option>
                {songs.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} — {s.artist}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-medium text-text-muted">재생 횟수</span>
              <input
                type="number"
                value={playCount}
                onChange={(e) => setPlayCount(Number(e.target.value))}
                className="h-10 w-full rounded-md border border-surface-border bg-surface px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </label>
          </div>

          {proof.ocrText ? (
            <details className="rounded-md border border-surface-border bg-surface-muted/30 px-3 py-2 text-xs text-text-muted">
              <summary className="cursor-pointer font-medium">OCR 인식 텍스트</summary>
              <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap">
                {proof.ocrText}
              </pre>
            </details>
          ) : null}

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <Button onClick={handleApprove} disabled={pending}>
              {pending ? '처리중...' : '승인'}
            </Button>
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="반려 사유"
              className="h-10 flex-1 min-w-[160px] rounded-md border border-surface-border bg-surface px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <Button variant="destructive" onClick={handleReject} disabled={pending}>
              반려
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
