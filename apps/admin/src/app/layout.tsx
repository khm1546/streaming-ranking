import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: '스밍 랭킹 — Admin',
  description: '운영자 페이지',
};

const NAV = [
  { href: '/songs', label: '곡 관리' },
  { href: '/announcements', label: '공지 관리' },
  { href: '/guides', label: '스밍 방법 관리' },
  { href: '/proofs', label: '인증 검수' },
  { href: '/users', label: '사용자' },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex">
        <aside className="hidden w-56 shrink-0 border-r border-surface-border bg-surface md:block">
          <div className="px-4 py-5 text-lg font-bold text-brand-600">스밍 Admin</div>
          <nav className="flex flex-col">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-text-muted hover:bg-surface-muted hover:text-brand-600"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 px-6 py-6">{children}</main>
      </body>
    </html>
  );
}
