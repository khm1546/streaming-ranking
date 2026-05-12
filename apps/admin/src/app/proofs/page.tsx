import { Card, CardContent, CardHeader, CardTitle } from '@streaming/ui';

export const metadata = { title: '인증 검수 — Admin' };

export default function AdminProofsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">인증 검수</h1>
      <Card>
        <CardHeader>
          <CardTitle>OCR 신뢰도 낮은 인증</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-text-muted">검수 큐 UI 준비 중.</p>
        </CardContent>
      </Card>
    </div>
  );
}
