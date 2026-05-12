import { Card, CardContent, CardHeader, CardTitle } from '@streaming/ui';

export const metadata = { title: '사용자 — Admin' };

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">사용자</h1>
      <Card>
        <CardHeader>
          <CardTitle>회원 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-text-muted">사용자 관리 UI 준비 중.</p>
        </CardContent>
      </Card>
    </div>
  );
}
