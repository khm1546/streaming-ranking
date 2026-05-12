import { Card, CardContent, CardHeader, CardTitle } from '@streaming/ui';

export const metadata = { title: '곡별 순위 — 스밍 랭킹' };

export default function SongsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">곡별 순위</h1>
      <p className="text-text-muted">
        인증된 재생 횟수를 기준으로 곡별 순위가 표시됩니다. (기간 무관)
      </p>
      <Card>
        <CardHeader>
          <CardTitle>등록된 곡이 없습니다</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-text-muted">운영자가 곡을 등록하면 표시됩니다.</p>
        </CardContent>
      </Card>
    </div>
  );
}
