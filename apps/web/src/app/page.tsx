import Link from 'next/link';
import { prisma } from '@streaming/db';
import { Sparkle, Numeral } from '../components/ornaments';

export const dynamic = 'force-dynamic';

async function getHomeStats() {
  const [songs, proofs, fans] = await Promise.all([
    prisma.song.count({ where: { isActive: true } }),
    prisma.streamingProof.count({ where: { status: { in: ['AUTO_APPROVED', 'APPROVED'] } } }),
    prisma.user
      .findMany({
        where: { proofs: { some: { status: { in: ['AUTO_APPROVED', 'APPROVED'] } } } },
        select: { id: true },
      })
      .then((u) => u.length),
  ]);
  return [
    { label: '등록된 곡', value: songs.toLocaleString(), en: 'Songs' },
    { label: '인증 완료', value: proofs.toLocaleString(), en: 'Verified' },
    { label: '참여 팬', value: fans.toLocaleString(), en: 'Fans' },
  ];
}

const FEATURES = [
  {
    href: '/songs',
    title: '곡별 순위',
    en: 'Songs',
    desc: '인증된 재생 횟수로 가장 사랑받은 곡을 만나보세요.',
    accent: 'from-rose-500/30 to-rose-300/0',
    span: 'sm:col-span-3 sm:row-span-2',
    big: true,
  },
  {
    href: '/ranking',
    title: '전체 순위',
    en: 'Ranks',
    desc: '팬덤 전체의 누적 인증 합계',
    accent: 'from-lavender-500/30 to-lavender-300/0',
    span: 'sm:col-span-3',
  },
  {
    href: '/announcements',
    title: '공지사항',
    en: 'Notices',
    desc: '새 소식과 이벤트',
    accent: 'from-aurora-500/30 to-aurora-300/0',
    span: 'sm:col-span-2',
  },
  {
    href: '/guide',
    title: '스밍 방법',
    en: 'Guide',
    desc: '플랫폼별 인증 가이드',
    accent: 'from-rose-400/30 to-rose-200/0',
    span: 'sm:col-span-1',
  },
];

export default async function Home() {
  const STATS = await getHomeStats();
  return (
    <div className="space-y-20">
      {/* ─── HERO ──────────────────────────── */}
      <section className="relative pt-12 pb-8 text-center sm:pt-20 sm:text-left">
        {/* Decorative orbit */}
        <div
          aria-hidden
          className="spin-slow pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-[420px] w-[420px] rounded-full border border-rose-300/15 sm:left-3/4 sm:h-[520px] sm:w-[520px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 h-[260px] w-[260px] rounded-full border border-lavender-300/10 sm:left-3/4"
        />

        <div className="fade-up relative mx-auto flex max-w-4xl flex-col items-center gap-8 sm:items-start">
          <div className="flex items-center gap-3 text-rose-200/70">
            <Sparkle size={12} />
            <span className="font-display text-sm italic tracking-[0.4em]">
              CRYSTAL SERENADE
            </span>
            <Sparkle size={12} />
          </div>

          <h1 className="leading-[0.95] tracking-tight">
            <span className="font-display block text-[3.5rem] italic font-medium shimmer sm:text-[6rem]">
              Heavy
            </span>
            <span className="font-display block text-[3.5rem] italic font-medium shimmer sm:text-[6rem]">
              Serenade
            </span>
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-lavender-200/85 sm:text-lg">
            내가 들은 스밍을 인증하면, 좋아하는 곡이 별이 됩니다.
            <span className="block mt-1 text-sm text-lavender-300/60">
              We turn every play into a constellation.
            </span>
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href="/upload"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-rose-500 via-rose-400 to-lavender-400 px-7 py-3.5 text-sm font-semibold text-night-950 shadow-[0_0_40px_rgba(243,168,194,0.35)] transition-transform hover:scale-[1.02]"
            >
              <span className="relative z-10">인증 업로드하기</span>
              <span aria-hidden className="relative z-10 transition-transform group-hover:translate-x-1">
                →
              </span>
              <span
                aria-hidden
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full"
              />
            </Link>
            <Link
              href="/songs"
              className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm text-white transition-colors hover:border-rose-300/40"
            >
              순위 둘러보기
              <span aria-hidden className="text-rose-300/60">→</span>
            </Link>
          </div>
        </div>

        {/* Stats strip */}
        <div className="fade-up mt-16 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/10 glass" style={{ animationDelay: '0.2s' }}>
          {STATS.map((s) => (
            <div key={s.label} className="px-4 py-6 text-center sm:px-6 sm:py-8">
              <Numeral value={s.value} size="lg" />
              <div className="mt-2 font-display text-[10px] italic tracking-[0.3em] text-rose-200/70 sm:text-xs">
                {s.en}
              </div>
              <div className="mt-1 text-xs text-lavender-200/70 sm:text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURE GRID (asymmetric) ──────── */}
      <section>
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="font-display text-xs italic tracking-[0.32em] text-rose-200/70">
              Sections
            </p>
            <h2 className="mt-1 text-2xl font-medium text-white sm:text-3xl">
              어디로 떠나볼까요?
            </h2>
          </div>
          <span className="font-display hidden text-sm italic text-lavender-300/60 sm:inline">
            — Pick your bouquet
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:auto-rows-[180px]">
          {FEATURES.map((f, i) => (
            <Link
              key={f.href}
              href={f.href}
              style={{ animationDelay: `${0.1 + i * 0.08}s` }}
              className={`fade-up glass-card card-shine group relative flex flex-col justify-between overflow-hidden rounded-2xl p-6 ${f.span ?? ''}`}
            >
              {/* Accent halo */}
              <div
                aria-hidden
                className={`pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-gradient-radial blur-2xl opacity-60 bg-gradient-to-br ${f.accent}`}
              />

              <div className="relative z-10">
                <p className="font-display text-xs italic tracking-[0.3em] text-rose-200/70">
                  {f.en}
                </p>
                <h3
                  className={`mt-2 font-medium text-white ${f.big ? 'text-3xl sm:text-5xl font-display italic glow-soft' : 'text-xl'
                    }`}
                >
                  {f.title}
                </h3>
              </div>

              <div className="relative z-10 flex items-end justify-between">
                <p className="text-sm text-lavender-200/75 max-w-[18ch]">{f.desc}</p>
                <span
                  aria-hidden
                  className="font-display text-2xl italic text-rose-200/70 transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── CTA stripe ─────────────────────── */}
      <section className="fade-up relative overflow-hidden rounded-3xl glass-strong p-8 sm:p-12">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-rose-400/15 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-lavender-500/15 blur-3xl"
        />

        <div className="relative grid gap-8 sm:grid-cols-[1.4fr_1fr] sm:items-center">
          <div className="space-y-3">
            <p className="font-display text-xs italic tracking-[0.32em] text-rose-200/80">
              First Petal
            </p>
            <h2 className="font-display text-3xl italic font-medium text-white sm:text-4xl">
              You are the bouquet.
            </h2>
            <p className="text-sm text-lavender-200/85 sm:text-base">
              한 장의 인증 스크린샷이 곡의 별자리를 만듭니다. 카카오·구글로 1초 로그인 후 시작해보세요.
            </p>
          </div>
          <div className="flex justify-end">
            <Link
              href="/login"
              className="glass inline-flex items-center gap-3 rounded-full border-rose-300/30 px-7 py-4 text-sm font-medium text-white transition-colors hover:border-rose-300/60 hover:bg-white/5"
            >
              <span>로그인하고 시작하기</span>
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
