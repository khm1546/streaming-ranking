import { Card, CardContent, CardHeader, CardTitle } from '@streaming/ui';

export const metadata = { title: '공지사항 — 스밍 랭킹' };

export default function AnnouncementsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">공지사항</h1>
      <Card>
        <CardHeader>
          <CardTitle>공지가 아직 없어요</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-text-muted">
            운영자가 공지를 등록하면 이곳에 표시됩니다.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
