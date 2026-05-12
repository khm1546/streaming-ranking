import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@streaming/ui';

const PANELS = [
  { href: '/songs', title: '곡 관리', desc: '순위에 표시할 곡을 등록·수정합니다.' },
  { href: '/announcements', title: '공지 관리', desc: '사용자에게 보일 공지를 작성합니다.' },
  { href: '/guides', title: '스밍 방법 관리', desc: '플랫폼별 스밍 가이드를 작성합니다.' },
  { href: '/proofs', title: '인증 검수', desc: 'OCR 신뢰도가 낮은 인증을 검토합니다.' },
  { href: '/users', title: '사용자', desc: '회원 목록과 권한을 관리합니다.' },
];

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">관리자 대시보드</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PANELS.map((p) => (
          <Link key={p.href} href={p.href}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle>{p.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-muted">{p.desc}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
