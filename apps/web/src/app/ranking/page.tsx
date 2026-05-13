import { prisma } from '@streaming/db';
import { PageHeading, EmptyState, Numeral, Sparkle, Divider } from '../../components/ornaments';

export const dynamic = 'force-dynamic';
export const metadata = { title: '전체 순위 — Heavy Serenade' };

type RankedUser = {
  rank: number;
  userId: string;
  nickname: string;
  plays: number;
  songs: number;
};

async function getRankedUsers(): Promise<RankedUser[]> {
  const grouped = await prisma.streamingProof.groupBy({
    by: ['userId'],
    where: { status: { in: ['AUTO_APPROVED', 'APPROVED'] } },
    _sum: { playCount: true },
    _count: { songId: true },
    orderBy: { _sum: { playCount: 'desc' } },
    take: 50,
  });
  if (grouped.length === 0) return [];
  const users = await prisma.user.findMany({
    where: { id: { in: grouped.map((g) => g.userId) } },
    select: { id: true, nickname: true },
  });
  const nameById = new Map(users.map((u) => [u.id, u.nickname]));
  return grouped.map((g, i) => ({
    rank: i + 1,
    userId: g.userId,
    nickname: nameById.get(g.userId) ?? '익명',
    plays: g._sum.playCount ?? 0,
    songs: g._count.songId,
  }));
}

export default async function RankingPage() {
  const users = await getRankedUsers();

  return (
    <div className="space-y-12">
      <PageHeading
        english="Overall"
        title="전체 순위"
        description="모든 곡에 대한 인증 재생 횟수를 합산해, 가장 빛나는 팬을 보여드립니다."
      />

      {users.length === 0 ? (
        <>
          <Divider label="The Stage Awaits" />
          <EmptyState
            english="No fans yet"
            title="첫 별이 떠오르길 기다리고 있어요"
            description="당신의 첫 인증이 무대를 밝혀줄 거예요."
          />
        </>
      ) : (
        <RankingChart users={users} />
      )}
    </div>
  );
}

function RankingChart({ users }: { users: RankedUser[] }) {
  const top3 = users.slice(0, 3);
  const rest = users.slice(3);
  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean);

  return (
    <div className="space-y-12">
      {top3.length > 0 ? (
        <div className="grid grid-cols-3 items-end gap-3 sm:gap-6">
          {podiumOrder.map((u, idx) => (
            <PodiumPillar
              key={u.userId}
              user={u}
              position={idx === 1 ? 'first' : idx === 0 ? 'second' : 'third'}
            />
          ))}
        </div>
      ) : null}

      {rest.length > 0 ? (
        <div>
          <Divider label="Continuing the Choir" />
          <div className="glass-card overflow-hidden rounded-2xl">
            {rest.map((u, i) => (
              <div
                key={u.userId}
                className={`flex items-center gap-5 px-5 py-4 sm:px-7 ${
                  i !== rest.length - 1 ? 'border-b border-white/5' : ''
                }`}
              >
                <div className="w-12 text-right">
                  <Numeral value={u.rank.toString().padStart(2, '0')} size="md" />
                </div>
                <div className="hairline-vertical h-8" />
                <div className="min-w-0 flex-1">
                  <div className="text-base font-medium text-white">@{u.nickname}</div>
                  <div className="text-xs text-lavender-300/60">{u.songs}곡 인증</div>
                </div>
                <div className="text-right">
                  <div className="font-display text-lg italic text-rose-200/90">
                    {u.plays.toLocaleString()}
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-lavender-300/60">
                    plays
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function PodiumPillar({
  user,
  position,
}: {
  user: RankedUser;
  position: 'first' | 'second' | 'third';
}) {
  const heights = {
    first: 'sm:h-72 h-56',
    second: 'sm:h-60 h-48',
    third: 'sm:h-52 h-40',
  };
  const accent = {
    first: 'from-rose-400/40 via-rose-300/20 to-transparent border-rose-300/40',
    second: 'from-lavender-400/30 via-lavender-300/15 to-transparent border-lavender-300/30',
    third: 'from-aurora-500/30 via-aurora-300/15 to-transparent border-aurora-300/25',
  };
  const numeralSize = position === 'first' ? 'xl' : 'lg';

  return (
    <div className="flex flex-col items-center gap-3">
      {position === 'first' ? (
        <div className="float-slow flex items-center gap-1.5">
          <Sparkle size={12} />
          <span className="font-display text-[10px] italic tracking-[0.3em] text-rose-200/80">
            CROWN
          </span>
          <Sparkle size={12} />
        </div>
      ) : (
        <div className="h-[18px]" />
      )}

      <div
        className={`glass-card relative flex w-full flex-col items-center justify-end rounded-t-2xl border bg-gradient-to-t p-4 sm:p-6 ${heights[position]} ${accent[position]}`}
      >
        <div className="flex-1 flex items-center justify-center">
          <Numeral value={user.rank} size={numeralSize} />
        </div>

        <div className="text-center">
          <div className="truncate text-sm font-medium text-white sm:text-base">
            @{user.nickname}
          </div>
          <div className="mt-1 font-display text-base italic text-rose-200/90 sm:text-lg">
            {user.plays.toLocaleString()}
          </div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-lavender-300/60">plays</div>
        </div>
      </div>
    </div>
  );
}
