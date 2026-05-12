import { Card, CardContent, CardHeader, CardTitle } from '@streaming/ui';
import { PLATFORM_LABELS, PLATFORMS } from '@streaming/shared';

export const metadata = { title: '스밍 방법 — 스밍 랭킹' };

export default function GuidePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">스밍 방법</h1>
      <p className="text-text-muted">플랫폼별 스밍 가이드를 확인하세요. (운영진이 작성한 가이드가 표시됩니다)</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PLATFORMS.filter((p) => p !== 'OTHER').map((p) => (
          <Card key={p}>
            <CardHeader>
              <CardTitle>{PLATFORM_LABELS[p]}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text-muted">가이드 준비 중입니다.</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
