import { prisma } from '@streaming/db';
import { PageHeading, EmptyState, Sparkle, Divider } from '../../components/ornaments';

export const dynamic = 'force-dynamic';
export const metadata = { title: '공지사항 — Heavy Serenade' };

export default async function AnnouncementsPage() {
  const announcements = await prisma.announcement.findMany({
    orderBy: [{ pinned: 'desc' }, { publishedAt: 'desc' }],
  });

  return (
    <div className="space-y-12">
      <PageHeading
        english="Notices"
        title="공지사항"
        description="운영진의 새 소식과 이벤트를 전합니다."
      />

      {announcements.length === 0 ? (
        <>
          <Divider label="A Quiet Night" />
          <EmptyState
            english="Nothing to announce"
            title="오늘 밤은 조용해요"
            description="새 공지가 올라오면 가장 먼저 알려드릴게요."
          />
        </>
      ) : (
        <div className="space-y-6">
          {announcements.map((a) => (
            <NoticeCard
              key={a.id}
              date={a.publishedAt.toISOString().slice(0, 10).replaceAll('-', '.')}
              title={a.title}
              body={a.body}
              pinned={a.pinned}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function NoticeCard({
  date,
  title,
  body,
  pinned,
}: {
  date: string;
  title: string;
  body: string;
  pinned?: boolean;
}) {
  return (
    <article className="glass-card card-shine group rounded-2xl p-7 sm:p-9">
      <div className="flex flex-wrap items-center gap-3 text-xs">
        {pinned ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-300/40 bg-rose-300/10 px-3 py-1 font-display italic text-rose-200">
            <Sparkle size={10} />
            pinned
          </span>
        ) : null}
        <span className="font-display text-sm italic tracking-[0.25em] text-lavender-300/70">
          {date}
        </span>
      </div>

      <h2 className="mt-4 text-2xl font-medium text-white sm:text-3xl">{title}</h2>
      <div
        className="prose prose-invert prose-sm mt-4 max-w-none text-lavender-100/90 prose-headings:text-white prose-strong:text-white prose-a:text-rose-200"
        dangerouslySetInnerHTML={{ __html: body }}
      />
    </article>
  );
}
