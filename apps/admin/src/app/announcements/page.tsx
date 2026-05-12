import Link from 'next/link';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@streaming/ui';

export const metadata = { title: '공지 관리 — Admin' };

export default function AdminAnnouncementsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">공지 관리</h1>
        <Link href="/announcements/new">
          <Button>새 공지 작성</Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>공지 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-text-muted">아직 등록된 공지가 없습니다.</p>
        </CardContent>
      </Card>
    </div>
  );
}
