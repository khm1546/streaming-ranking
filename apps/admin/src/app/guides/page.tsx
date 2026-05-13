import Link from 'next/link';
import { Badge, Button, Card, CardContent } from '@streaming/ui';
import { prisma } from '@streaming/db';
import { PLATFORM_LABELS } from '@streaming/shared';
import { DeleteGuideButton } from './delete-button';

export const dynamic = 'force-dynamic';
export const metadata = { title: '스밍 방법 관리 — Admin' };

export default async function AdminGuidesPage() {
  const guides = await prisma.streamingGuide.findMany({
    orderBy: [{ platform: 'asc' }, { order: 'asc' }],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">스밍 방법 관리</h1>
          <p className="text-sm text-text-muted">현재 멜론만 지원 · 총 {guides.length}개</p>
        </div>
        <Link href="/guides/new">
          <Button>+ 새 가이드 작성</Button>
        </Link>
      </div>

      {guides.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-sm text-text-muted">아직 등록된 가이드가 없습니다.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {guides.map((g) => (
            <Card key={g.id}>
              <CardContent className="flex items-center justify-between gap-4 py-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge>{PLATFORM_LABELS[g.platform]}</Badge>
                    <span className="text-xs text-text-muted">order #{g.order}</span>
                  </div>
                  <h3 className="mt-1 truncate text-base font-medium">{g.title}</h3>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Link href={`/guides/${g.id}/edit`}>
                    <Button variant="secondary" size="sm">
                      수정
                    </Button>
                  </Link>
                  <DeleteGuideButton id={g.id} title={g.title} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
