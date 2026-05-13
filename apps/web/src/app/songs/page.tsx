import { prisma } from '@streaming/db';
import { PageHeading, EmptyState, Numeral, Sparkle, Divider } from '../../components/ornaments';

export const dynamic = 'force-dynamic';
export const metadata = { title: '곡별 순위 — Heavy Serenade' };

type RankedSong = {
  id: string;
  title: string;
  artist: string;
  totalPlays: number;
  fanCount: number;
};

async function getRankedSongs(): Promise<RankedSong[]> {
  const songs = await prisma.song.findMany({
    where: { isActive: true },
    include: {
      proofs: {
        where: { status: { in: ['AUTO_APPROVED', 'APPROVED'] } },
        select: { playCount: true, userId: true },
      },
    },
  });
  return songs
    .map((s) => ({
      id: s.id,
      title: s.title,
      artist: s.artist,
      totalPlays: s.proofs.reduce((a, b) => a + b.playCount, 0),
      fanCount: new Set(s.proofs.map((p) => p.userId)).size,
    }))
    .sort((a, b) => b.totalPlays - a.totalPlays);
}

export default async function SongsPage() {
  const songs = await getRankedSongs();

  return (
    <div className="space-y-12">
      <PageHeading
        english="By Song"
        title="곡별 순위"
        description="인증된 재생 횟수를 기준으로 곡별 순위를 보여드려요. 기간은 따지지 않습니다."
      />

      {songs.length === 0 ? (
        <>
          <Divider label="Empty Garden" />
          <EmptyState
            english="No songs yet"
            title="곡이 아직 등록되지 않았어요"
            description="운영자가 곡을 등록하고 첫 인증이 들어오면, 이 정원에 가장 먼저 꽃이 핍니다."
          />
        </>
      ) : (
        <div className="space-y-3">
          {songs.map((s, idx) => (
            <SongRow key={s.id} rank={idx + 1} {...s} />
          ))}
        </div>
      )}
    </div>
  );
}

function SongRow({
  rank,
  title,
  artist,
  totalPlays,
  fanCount,
}: {
  rank: number;
  title: string;
  artist: string;
  totalPlays: number;
  fanCount: number;
}) {
  return (
    <div className="glass-card card-shine group flex items-center gap-6 rounded-2xl px-5 py-5 sm:px-7 sm:py-6">
      <div className="w-14 shrink-0 text-right sm:w-20">
        <Numeral value={rank.toString().padStart(2, '0')} size={rank === 1 ? 'xl' : 'lg'} />
      </div>

      <div className="hairline-vertical h-12 shrink-0" />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-lg font-medium text-white sm:text-xl">{title}</h3>
          {rank === 1 ? <Sparkle size={14} className="text-rose-300/80" /> : null}
        </div>
        <p className="mt-0.5 text-sm text-lavender-200/70">{artist}</p>
      </div>

      <div className="hidden items-center gap-8 text-right sm:flex">
        <div>
          <div className="font-display text-xl italic text-white">
            {totalPlays.toLocaleString()}
          </div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-lavender-300/60">plays</div>
        </div>
        <div>
          <div className="font-display text-xl italic text-rose-200/90">{fanCount}</div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-lavender-300/60">fans</div>
        </div>
      </div>
    </div>
  );
}
