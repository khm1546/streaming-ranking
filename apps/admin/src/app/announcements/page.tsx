import Link from 'next/link';
import { Badge, Button, Card, CardContent } from '@streaming/ui';
import { prisma } from '@streaming/db';
import { DeleteAnnouncementButton } from './delete-button';

export const dynamic = 'force-dynamic';
export const metadata = { title: '공지 관리 — Admin' };

export default async function AdminAnnouncementsPage() {
  const announcements = await prisma.announcement.findMany({
    orderBy: [{ pinned: 'desc' }, { publishedAt: 'desc' }],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">공지 관리</h1>
          <p className="text-sm text-text-muted">총 {announcements.length}개</p>
        </div>
        <Link href="/announcements/new">
          <Button>+ 새 공지 작성</Button>
        </Link>
      </div>

      {announcements.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-sm text-text-muted">아직 등록된 공지가 없습니다.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {announcements.map((a) => (
            <Card key={a.id}>
              <CardContent className="flex items-center justify-between gap-4 py-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {a.pinned ? <Badge variant="warning">상단 고정</Badge> : null}
                    <span className="text-xs text-text-muted">
                      {a.publishedAt.toISOString().slice(0, 10)}
                    </span>
                  </div>
                  <h3 className="mt-1 truncate text-base font-medium">{a.title}</h3>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Link href={`/announcements/${a.id}/edit`}>
                    <Button variant="secondary" size="sm">
                      수정
                    </Button>
                  </Link>
                  <DeleteAnnouncementButton id={a.id} title={a.title} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
