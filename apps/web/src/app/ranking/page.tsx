import { Card, CardContent, CardHeader, CardTitle } from '@streaming/ui';

export const metadata = { title: '전체 순위 — 스밍 랭킹' };

export default function RankingPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">전체 순위</h1>
      <p className="text-text-muted">사용자별 인증 재생 횟수 합계를 기준으로 한 종합 순위입니다.</p>
      <Card>
        <CardHeader>
          <CardTitle>아직 데이터가 없어요</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-text-muted">첫 인증을 올려보세요!</p>
        </CardContent>
      </Card>
    </div>
  );
}
