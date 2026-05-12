import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: '스밍 랭킹',
  description: '스밍 인증으로 곡별 순위를 매기는 팬덤 플랫폼',
};

const NAV = [
  { href: '/', label: '홈' },
  { href: '/guide', label: '스밍 방법' },
  { href: '/announcements', label: '공지사항' },
  { href: '/songs', label: '곡별 순위' },
  { href: '/ranking', label: '전체 순위' },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <header className="sticky top-0 z-40 border-b border-surface-border bg-surface/80 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
            <Link href="/" className="text-lg font-bold text-brand-600">
              스밍 랭킹
            </Link>
            <nav className="hidden gap-6 sm:flex">
              {NAV.slice(1).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-text-muted hover:text-brand-600"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <Link
              href="/login"
              className="rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
            >
              로그인
            </Link>
          </div>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
        <footer className="border-t border-surface-border py-6 text-center text-xs text-text-muted">
          © {new Date().getFullYear()} 스밍 랭킹
        </footer>
      </body>
    </html>
  );
}
