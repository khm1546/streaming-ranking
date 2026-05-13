import Link from 'next/link';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@streaming/ui';
import { prisma } from '@streaming/db';
import { DeleteSongButton } from './delete-button';

export const dynamic = 'force-dynamic';
export const metadata = { title: '곡 관리 — Admin' };

export default async function AdminSongsPage() {
  const songs = await prisma.song.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { proofs: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">곡 관리</h1>
          <p className="text-sm text-text-muted">총 {songs.length}곡</p>
        </div>
        <Link href="/songs/new">
          <Button>+ 새 곡 등록</Button>
        </Link>
      </div>

      {songs.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>아직 등록된 곡이 없습니다</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-muted">
              첫 곡을 등록하면 사용자 앱의 순위 페이지에 표시됩니다.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-border bg-surface-muted/40">
                  <th className="px-4 py-3 text-left font-medium">제목</th>
                  <th className="px-4 py-3 text-left font-medium">아티스트</th>
                  <th className="px-4 py-3 text-left font-medium">별칭</th>
                  <th className="px-4 py-3 text-right font-medium">인증</th>
                  <th className="px-4 py-3 text-center font-medium">상태</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {songs.map((song) => (
                  <tr key={song.id} className="border-b border-surface-border last:border-0">
                    <td className="px-4 py-3 font-medium">{song.title}</td>
                    <td className="px-4 py-3 text-text-muted">{song.artist}</td>
                    <td className="px-4 py-3 text-xs text-text-muted">
                      {song.aliases.length > 0 ? song.aliases.join(', ') : '—'}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {song._count.proofs.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {song.isActive ? (
                        <Badge variant="success">노출</Badge>
                      ) : (
                        <Badge variant="muted">숨김</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/songs/${song.id}/edit`}>
                          <Button variant="secondary" size="sm">
                            수정
                          </Button>
                        </Link>
                        <DeleteSongButton id={song.id} title={song.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
