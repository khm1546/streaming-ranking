import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: '스밍 랭킹 — Heavy Serenade',
  description: '스밍 인증으로 곡별 순위를 매기는 팬덤 플랫폼',
};

const NAV = [
  { href: '/guide', label: '스밍 방법', en: 'Guide' },
  { href: '/announcements', label: '공지사항', en: 'Notices' },
  { href: '/songs', label: '곡별 순위', en: 'Songs' },
  { href: '/ranking', label: '전체 순위', en: 'Ranks' },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full flex flex-col text-text">
        {/* ─── Header ─────────────────────────── */}
        <header className="sticky top-0 z-50">
          <div className="glass-soft border-b border-white/[0.08]">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
              <Link href="/" className="group flex items-baseline gap-3">
                <span className="font-display text-2xl italic text-rose-200 glow-soft tracking-tight">
                  Serenade
                </span>
                <span className="hidden text-[11px] uppercase tracking-[0.32em] text-lavender-300/60 sm:inline">
                  스밍 랭킹
                </span>
              </Link>

              <nav className="hidden items-center gap-1 sm:flex">
                {NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group relative px-4 py-2 text-sm text-lavender-200/80 transition-colors hover:text-white"
                  >
                    <span className="relative z-10">{item.label}</span>
                    <span
                      aria-hidden
                      className="absolute inset-x-3 bottom-1 h-px scale-x-0 bg-gradient-to-r from-transparent via-rose-300/70 to-transparent transition-transform duration-500 group-hover:scale-x-100"
                    />
                  </Link>
                ))}
              </nav>

              <Link
                href="/login"
                className="glass group relative inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm text-white transition-all hover:border-rose-300/40"
              >
                <span>로그인</span>
                <span aria-hidden className="text-rose-300/60 transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
            </div>
          </div>
        </header>

        {/* ─── Main ───────────────────────────── */}
        <main className="relative mx-auto w-full max-w-6xl flex-1 px-6 py-10">
          {children}
        </main>

        {/* ─── Footer ─────────────────────────── */}
        <footer className="relative mt-24 pb-12">
          <div className="mx-auto max-w-6xl px-6">
            <div className="hairline mb-8" />
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex items-center gap-3 text-lavender-300/60">
                <span aria-hidden>✦</span>
                <span className="font-display italic text-base text-rose-200/80">
                  Heavy Serenade
                </span>
                <span aria-hidden>✦</span>
              </div>
              <p className="text-xs tracking-[0.2em] text-lavender-300/50">
                © {new Date().getFullYear()} STREAMING RANKING · MADE FOR FANS
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
