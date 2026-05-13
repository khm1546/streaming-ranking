'use client';

import { useState, useRef, useCallback, useTransition } from 'react';
import Link from 'next/link';
import { Button } from '@streaming/ui';
import {
  SUPPORTED_PLATFORMS,
  PLATFORM_LABELS,
  ALLOWED_PROOF_MIME_TYPES,
  MAX_PROOF_IMAGE_SIZE_BYTES,
  OCR_AUTO_APPROVE_THRESHOLD,
} from '@streaming/shared';
import { PageHeading, Sparkle, Divider, Numeral } from '../../components/ornaments';
import { submitProof, type SubmitProofResult } from '../../lib/actions/proof';

type OcrState =
  | { phase: 'idle' }
  | { phase: 'running' }
  | {
      phase: 'done';
      text: string;
      confidence: number;
      platform: 'MELON';
      playCount: number | null;
    };

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [userTitle, setUserTitle] = useState('');
  const [manualPlayCount, setManualPlayCount] = useState<string>('');
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ocr, setOcr] = useState<OcrState>({ phase: 'idle' });
  const [result, setResult] = useState<SubmitProofResult | null>(null);
  const [pending, start] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const runOcr = useCallback(async (f: File) => {
    setOcr({ phase: 'running' });
    try {
      const { runOcr, parseStreamingProof } = await import('@streaming/ocr');
      const ocrResult = await runOcr(f);
      const parsed = parseStreamingProof(ocrResult);
      setOcr({
        phase: 'done',
        text: ocrResult.text,
        confidence: ocrResult.confidence,
        platform: 'MELON',
        playCount: parsed.playCount,
      });
      // OCR이 잡은 값을 수동 입력 칸에 prefill — 사용자가 보고 수정 가능
      setManualPlayCount(parsed.playCount != null ? String(parsed.playCount) : '');
    } catch (e) {
      console.error('OCR failed', e);
      setOcr({ phase: 'idle' });
      setError('OCR 처리에 실패했습니다. 다시 시도해주세요.');
    }
  }, []);

  const handleFile = useCallback(
    (f: File | null) => {
      setError(null);
      setResult(null);
      setOcr({ phase: 'idle' });
      setManualPlayCount('');
      if (!f) {
        setFile(null);
        setPreviewUrl(null);
        return;
      }
      if (!(ALLOWED_PROOF_MIME_TYPES as readonly string[]).includes(f.type)) {
        setError('PNG·JPG·WEBP 만 업로드 가능합니다.');
        return;
      }
      if (f.size > MAX_PROOF_IMAGE_SIZE_BYTES) {
        setError('이미지는 5MB 이하여야 합니다.');
        return;
      }
      setFile(f);
      setPreviewUrl(URL.createObjectURL(f));
      void runOcr(f);
    },
    [runOcr],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      handleFile(e.dataTransfer.files?.[0] ?? null);
    },
    [handleFile],
  );

  // 수동 입력값이 있으면 그것을, 없으면 OCR 결과를 사용
  const finalPlayCount =
    manualPlayCount.trim() !== '' ? Number(manualPlayCount) : ocr.phase === 'done' ? ocr.playCount ?? 0 : 0;
  const canSubmit = !!file && ocr.phase === 'done' && finalPlayCount > 0 && !pending;

  function onSubmit() {
    if (!file || ocr.phase !== 'done') return;
    start(async () => {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('ocrText', ocr.text);
      fd.append('ocrConfidence', String(ocr.confidence));
      fd.append('parsedPlatform', ocr.platform);
      fd.append('parsedPlayCount', String(finalPlayCount));
      fd.append('userTitle', userTitle);
      const res = await submitProof(fd);
      setResult(res);
      if (res.ok) {
        setFile(null);
        setPreviewUrl(null);
        setOcr({ phase: 'idle' });
        setUserTitle('');
        setManualPlayCount('');
      }
    });
  }

  if (result?.ok) {
    return <SuccessView result={result} onAnother={() => setResult(null)} />;
  }

  return (
    <div className="space-y-12">
      <PageHeading
        english="Upload Proof"
        title="인증 업로드"
        description="멜론 스밍 스크린샷 한 장이면 충분합니다. 클라이언트 OCR이 곡과 재생 횟수를 자동으로 읽어드려요."
      />

      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        {/* DROP ZONE */}
        <div className="space-y-4">
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            className={`relative aspect-[4/3] cursor-pointer overflow-hidden rounded-3xl transition-all ${
              dragOver
                ? 'glass-strong border-rose-300/60 scale-[1.01]'
                : 'glass border-white/15 hover:border-rose-300/40'
            } border`}
          >
            <input
              ref={inputRef}
              type="file"
              accept={ALLOWED_PROOF_MIME_TYPES.join(',')}
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
              className="hidden"
            />

            {previewUrl ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="proof preview"
                  className="absolute inset-0 h-full w-full object-contain bg-night-950/40"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFile(null);
                  }}
                  className="absolute right-3 top-3 rounded-full bg-night-950/80 px-3 py-1 text-xs text-white hover:bg-night-950"
                >
                  제거 ✕
                </button>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="relative">
                  <div className="spin-slow absolute inset-0 rounded-full border border-dashed border-rose-300/30" />
                  <div className="float-slow flex h-20 w-20 items-center justify-center rounded-full border border-white/15 bg-white/5">
                    <Sparkle size={26} className="text-rose-300/90" />
                  </div>
                </div>
                <div>
                  <p className="font-display text-xs italic tracking-[0.32em] text-rose-200/80">
                    Drop a screenshot
                  </p>
                  <h3 className="mt-2 text-xl font-medium text-white">스크린샷을 끌어다 놓으세요</h3>
                  <p className="mt-1 text-sm text-lavender-200/70">
                    또는 클릭해서 파일 선택 · PNG·JPG·WEBP · 최대 5MB
                  </p>
                </div>
              </div>
            )}
          </div>

          {error ? (
            <div className="glass rounded-xl border-rose-400/30 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          ) : null}
          {result && !result.ok ? (
            <div className="glass rounded-xl border-rose-400/30 px-4 py-3 text-sm text-rose-200">
              {result.error}
            </div>
          ) : null}
        </div>

        {/* RIGHT PANEL */}
        <div className="space-y-6">
          <div className="glass-strong rounded-3xl p-7">
            <div className="flex items-center gap-2 text-rose-200/80">
              <Sparkle size={11} />
              <span className="font-display text-xs italic tracking-[0.32em]">OCR Result</span>
            </div>

            {ocr.phase === 'idle' ? (
              <div className="mt-4 space-y-3 text-sm text-lavender-200/70">
                <p>스크린샷을 업로드하면 자동으로 곡과 재생 횟수를 읽어내요.</p>
                <p className="text-xs text-lavender-300/60">
                  현재 지원: <span className="text-white">멜론</span>
                </p>
              </div>
            ) : ocr.phase === 'running' ? (
              <div className="mt-6 flex flex-col items-center gap-3 py-6">
                <div className="spin-slow h-10 w-10 rounded-full border-2 border-rose-300/40 border-t-rose-300" />
                <p className="text-sm text-lavender-200/80">OCR 분석 중...</p>
                <p className="text-xs text-lavender-300/60">최초 1회는 ~30초 정도 걸려요 (모델 로딩)</p>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {/* 메인: 사용자 수동 입력 (OCR 결과 prefill) */}
                <div>
                  <div className="flex items-baseline justify-between">
                    <label className="text-xs uppercase tracking-[0.2em] text-lavender-300/70">
                      내 스트리밍
                    </label>
                    {ocr.playCount != null && ocr.playCount > 0 ? (
                      <span className="text-[10px] text-lavender-300/50">
                        OCR 자동 {ocr.playCount.toLocaleString()} · 수정 가능
                      </span>
                    ) : (
                      <span className="text-[10px] text-rose-300/70">OCR 미인식 · 직접 입력</span>
                    )}
                  </div>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={manualPlayCount}
                    onChange={(e) => setManualPlayCount(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="예: 69"
                    className={`mt-1 w-full rounded-xl border border-white/15 bg-night-900/60 px-4 py-3 text-3xl tabular-nums outline-none transition-colors focus:border-rose-300/60 placeholder:text-lg placeholder:font-sans placeholder:not-italic placeholder:text-lavender-300/30 ${
                      manualPlayCount ? 'numeral' : 'text-white font-medium'
                    }`}
                  />
                </div>

                <div className="flex items-baseline justify-between">
                  <span className="text-xs uppercase tracking-[0.2em] text-lavender-300/60">
                    OCR 신뢰도
                  </span>
                  <span
                    className={`font-display text-lg italic ${
                      ocr.confidence >= OCR_AUTO_APPROVE_THRESHOLD
                        ? 'text-rose-200'
                        : 'text-aurora-300'
                    }`}
                  >
                    {Math.round(ocr.confidence * 100)}%
                  </span>
                </div>

                {finalPlayCount > 0 &&
                ocr.confidence >= OCR_AUTO_APPROVE_THRESHOLD &&
                manualPlayCount === String(ocr.playCount ?? 0) ? (
                  <div className="rounded-xl border border-rose-300/30 bg-rose-300/5 p-3 text-xs text-rose-100/90">
                    ✦ 자동 승인 예정
                  </div>
                ) : finalPlayCount > 0 ? (
                  <div className="rounded-xl border border-aurora-300/30 bg-aurora-300/5 p-3 text-xs text-aurora-200/90">
                    ⓘ 운영자 검수 후 반영
                  </div>
                ) : (
                  <div className="rounded-xl border border-rose-400/30 bg-rose-400/5 p-3 text-xs text-rose-200/90">
                    ⚠ 내 스트리밍 숫자를 입력해야 제출할 수 있어요.
                  </div>
                )}

                <details className="rounded-md border border-white/10 bg-night-950/40 px-3 py-2 text-xs text-lavender-200/70">
                  <summary className="cursor-pointer">인식된 텍스트 보기</summary>
                  <pre className="mt-2 max-h-32 overflow-auto whitespace-pre-wrap text-[11px]">
                    {ocr.text.slice(0, 400) || '(텍스트 인식 실패)'}
                  </pre>
                </details>

                <div>
                  <label className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-lavender-300/70">
                    곡명 직접 입력 (선택)
                  </label>
                  <input
                    value={userTitle}
                    onChange={(e) => setUserTitle(e.target.value)}
                    placeholder="OCR이 못 읽었다면 직접 적어주세요"
                    className="w-full rounded-xl border border-white/15 bg-night-900/60 px-4 py-2.5 text-sm text-white placeholder:text-lavender-300/40 outline-none focus:border-rose-300/60"
                  />
                </div>
              </div>
            )}
          </div>

          <Divider label="Submit" />

          <Button
            disabled={!canSubmit}
            onClick={onSubmit}
            className="w-full rounded-full bg-gradient-to-r from-rose-500 via-rose-400 to-lavender-400 text-night-950 shadow-[0_0_40px_rgba(243,168,194,0.3)] hover:from-rose-400 hover:via-rose-300 hover:to-lavender-300"
            size="lg"
          >
            {pending ? '업로드 중...' : '인증 업로드'}
          </Button>

          <p className="text-center text-xs text-lavender-300/60">
            플랫폼: 멜론 · 신뢰도 {Math.round(OCR_AUTO_APPROVE_THRESHOLD * 100)}% 이상 자동 승인
          </p>
        </div>
      </div>
    </div>
  );
}

function SuccessView({
  result,
  onAnother,
}: {
  result: Extract<SubmitProofResult, { ok: true }>;
  onAnother: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center">
      <div className="float-slow mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-rose-300/40 bg-rose-300/10">
        <Sparkle size={32} className="text-rose-200" />
      </div>
      <p className="font-display text-xs italic tracking-[0.32em] text-rose-200/80">Bloomed</p>
      <h1 className="mt-2 font-display text-4xl italic font-medium shimmer">A new petal</h1>
      <p className="mt-4 text-sm text-lavender-200/85">
        {result.matchedSongTitle ? (
          <>
            <span className="text-white">{result.matchedSongTitle}</span> 인증이{' '}
            {result.status === 'AUTO_APPROVED' ? '자동 승인' : '운영자 검수 대기'}
            로 등록됐어요.
          </>
        ) : (
          <>곡 매칭 실패 — 운영자 검수 대기로 등록됐어요.</>
        )}
      </p>
      <div className="mt-3 text-sm text-lavender-300/70">
        재생 횟수 <span className="font-display italic text-rose-200">{result.playCount.toLocaleString()}</span>
      </div>

      <div className="mt-8 flex gap-3">
        <Button
          onClick={onAnother}
          variant="secondary"
          className="rounded-full bg-white/5 text-white hover:bg-white/10"
        >
          한 장 더
        </Button>
        <Link
          href="/songs"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 via-rose-400 to-lavender-400 px-6 py-3 text-sm font-semibold text-night-950"
        >
          순위 보기 →
        </Link>
      </div>
    </div>
  );
}
