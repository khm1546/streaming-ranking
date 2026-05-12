import { Card, CardContent, CardHeader, CardTitle } from '@streaming/ui';

export const metadata = { title: '곡 관리 — Admin' };

export default function AdminSongsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">곡 관리</h1>
      <Card>
        <CardHeader>
          <CardTitle>등록된 곡</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-text-muted">곡 등록 UI 준비 중.</p>
        </CardContent>
      </Card>
    </div>
  );
}
