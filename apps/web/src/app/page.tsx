import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@streaming/ui';

const SECTIONS = [
  {
    href: '/guide',
    title: '스밍 방법',
    desc: '플랫폼별 인증 가이드와 꿀팁을 확인하세요.',
  },
  {
    href: '/announcements',
    title: '공지사항',
    desc: '운영진의 새 소식과 이벤트를 빠르게 확인하세요.',
  },
  {
    href: '/songs',
    title: '곡별 순위',
    desc: '인증된 재생 횟수로 곡별 순위를 비교해보세요.',
  },
  {
    href: '/ranking',
    title: '전체 순위',
    desc: '모든 곡을 합산한 종합 순위를 확인하세요.',
  },
];

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold">스밍 인증으로 응원해요</h1>
        <p className="mt-2 max-w-xl text-brand-50/90">
          내가 들은 스밍을 인증하고, 좋아하는 곡의 순위를 함께 만들어보세요.
        </p>
        <Link
          href="/upload"
          className="mt-6 inline-block rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-50"
        >
          인증 업로드하기
        </Link>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {SECTIONS.map((s) => (
          <Link key={s.href} href={s.href} className="group">
            <Card className="h-full transition-shadow group-hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-brand-700">{s.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-muted">{s.desc}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>
    </div>
  );
}
