import Link from 'next/link';
import { prisma } from '@streaming/db';
import { SUPPORTED_PLATFORMS, PLATFORM_LABELS } from '@streaming/shared';
import { PageHeading, Sparkle, Divider, EmptyState } from '../../components/ornaments';

export const dynamic = 'force-dynamic';
export const metadata = { title: '스밍 방법 — Heavy Serenade' };

export default async function GuidePage() {
  const guides = await prisma.streamingGuide.findMany({
    where: { platform: { in: SUPPORTED_PLATFORMS as unknown as string[] as never } },
    orderBy: [{ platform: 'asc' }, { order: 'asc' }],
  });

  return (
    <div className="space-y-12">
      <PageHeading
        english="Guide"
        title="스밍 방법"
        description="멜론 인증 화면을 캡쳐하는 방법을 알려드려요."
      />

      <div className="glass-strong relative overflow-hidden rounded-3xl p-8 sm:p-10">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-rose-400/15 blur-3xl"
        />
        <div className="relative grid gap-6 sm:grid-cols-[2fr_1fr] sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-rose-200/80">
              <Sparkle size={12} />
              <span className="font-display text-xs italic tracking-[0.32em]">First Step</span>
            </div>
            <h2 className="mt-3 text-2xl font-medium text-white sm:text-3xl">
              인증 한 장 = <span className="font-display italic">한 송이</span>
            </h2>
            <p className="mt-2 text-sm text-lavender-200/85 sm:text-base">
              멜론 앱 ‘재생 횟수’ 또는 ‘최근 들은 곡’ 화면을 캡쳐 후 업로드하면, OCR이 자동으로 곡과
              횟수를 읽어냅니다.
            </p>
          </div>
          <div className="flex sm:justify-end">
            <Link
              href="/upload"
              className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm text-white hover:border-rose-300/40"
            >
              지금 인증하기
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>

      <Divider label={`${PLATFORM_LABELS.MELON} 가이드`} />

      {guides.length === 0 ? (
        <EmptyState
          english="No guides yet"
          title="가이드가 아직 등록되지 않았어요"
          description="운영자가 가이드를 작성하면 이곳에 표시됩니다."
        />
      ) : (
        <div className="space-y-6">
          {guides.map((g, i) => (
            <article
              key={g.id}
              style={{ animationDelay: `${i * 0.05}s` }}
              className="fade-up glass-card card-shine relative overflow-hidden rounded-2xl p-7 sm:p-9"
            >
              <div className="flex items-center gap-2 text-rose-200/80">
                <Sparkle size={12} />
                <span className="font-display text-xs italic tracking-[0.3em]">
                  {PLATFORM_LABELS[g.platform]}
                </span>
              </div>
              <h3 className="mt-3 text-2xl font-medium text-white sm:text-3xl">{g.title}</h3>
              <div
                className="prose prose-invert prose-sm mt-5 max-w-none text-lavender-100/90 prose-headings:text-white prose-strong:text-white prose-a:text-rose-200"
                dangerouslySetInnerHTML={{ __html: g.body }}
              />
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
