import Link from 'next/link';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@streaming/ui';
import { PLATFORM_LABELS, PLATFORMS } from '@streaming/shared';

export const metadata = { title: '스밍 방법 관리 — Admin' };

export default function AdminGuidesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">스밍 방법 관리</h1>
        <Link href="/guides/new">
          <Button>새 가이드 작성</Button>
        </Link>
      </div>
      <p className="text-text-muted">사용자에게 표시할 플랫폼별 스밍 가이드를 작성합니다.</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PLATFORMS.filter((p) => p !== 'OTHER').map((p) => (
          <Card key={p}>
            <CardHeader>
              <CardTitle>{PLATFORM_LABELS[p]}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text-muted">아직 가이드가 등록되지 않았습니다.</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
