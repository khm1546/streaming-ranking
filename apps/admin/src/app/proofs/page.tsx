import { Badge, Card, CardContent } from '@streaming/ui';
import { prisma } from '@streaming/db';
import { PLATFORM_LABELS } from '@streaming/shared';
import { ProofReviewCard } from './review-card';

export const dynamic = 'force-dynamic';
export const metadata = { title: '인증 검수 — Admin' };

export default async function AdminProofsPage() {
  const [pending, recent, songs] = await Promise.all([
    prisma.streamingProof.findMany({
      where: { status: 'PENDING_REVIEW' },
      orderBy: { createdAt: 'asc' },
      include: {
        user: { select: { nickname: true } },
        song: { select: { id: true, title: true, artist: true } },
      },
    }),
    prisma.streamingProof.findMany({
      where: { status: { in: ['APPROVED', 'REJECTED', 'AUTO_APPROVED'] } },
      orderBy: { reviewedAt: 'desc' },
      take: 10,
      include: {
        user: { select: { nickname: true } },
        song: { select: { title: true, artist: true } },
      },
    }),
    prisma.song.findMany({
      where: { isActive: true },
      orderBy: { title: 'asc' },
      select: { id: true, title: true, artist: true },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">인증 검수</h1>
        <p className="text-sm text-text-muted">
          OCR 신뢰도가 낮거나 곡 매칭 실패한 인증 — 검수 대기 {pending.length}건
        </p>
      </div>

      {pending.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-sm text-text-muted">검수 대기 중인 인증이 없습니다 ✨</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pending.map((p) => (
            <ProofReviewCard
              key={p.id}
              proof={{
                id: p.id,
                imageUrl: p.imageUrl,
                playCount: p.playCount,
                ocrText: p.ocrText ?? '',
                ocrConfidence: p.ocrConfidence ?? 0,
                platform: p.platform ? PLATFORM_LABELS[p.platform] : '—',
                createdAt: p.createdAt.toISOString(),
                userNickname: p.user.nickname,
                currentSongId: p.song?.id ?? null,
                currentSongLabel: p.song ? `${p.song.title} — ${p.song.artist}` : '미매칭',
              }}
              songs={songs}
            />
          ))}
        </div>
      )}

      <div>
        <h2 className="mb-3 text-lg font-semibold">최근 처리</h2>
        {recent.length === 0 ? (
          <Card>
            <CardContent className="py-6 text-center text-sm text-text-muted">
              처리 이력이 없습니다.
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-border bg-surface-muted/40">
                    <th className="px-4 py-2 text-left font-medium">사용자</th>
                    <th className="px-4 py-2 text-left font-medium">곡</th>
                    <th className="px-4 py-2 text-right font-medium">재생</th>
                    <th className="px-4 py-2 text-center font-medium">상태</th>
                    <th className="px-4 py-2 text-right font-medium">처리시각</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((p) => (
                    <tr key={p.id} className="border-b border-surface-border last:border-0">
                      <td className="px-4 py-2">@{p.user.nickname}</td>
                      <td className="px-4 py-2 text-text-muted">
                        {p.song ? `${p.song.title} — ${p.song.artist}` : '미매칭'}
                      </td>
                      <td className="px-4 py-2 text-right tabular-nums">
                        {p.playCount.toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-center">
                        {p.status === 'APPROVED' && <Badge variant="success">승인</Badge>}
                        {p.status === 'AUTO_APPROVED' && <Badge variant="default">자동승인</Badge>}
                        {p.status === 'REJECTED' && <Badge variant="danger">반려</Badge>}
                      </td>
                      <td className="px-4 py-2 text-right text-xs text-text-muted">
                        {p.reviewedAt
                          ? p.reviewedAt.toISOString().slice(0, 16).replace('T', ' ')
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
