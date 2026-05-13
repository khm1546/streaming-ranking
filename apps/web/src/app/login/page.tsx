'use client';

import Link from 'next/link';
import { Sparkle } from '../../components/ornaments';

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center">
      <div className="fade-up flex flex-col items-center gap-4">
        <div className="flex items-center gap-3 text-rose-200/80">
          <Sparkle size={12} />
          <span className="font-display text-xs italic tracking-[0.4em]">Welcome</span>
          <Sparkle size={12} />
        </div>
        <h1 className="font-display text-5xl italic font-medium shimmer leading-tight sm:text-6xl">
          to the
          <br />
          Serenade
        </h1>
        <p className="text-sm text-lavender-200/85">
          소셜 계정으로 1초 만에 시작하세요.
          <br />
          <span className="text-xs text-lavender-300/60">최초 로그인 시 닉네임을 설정합니다.</span>
        </p>
      </div>

      <div
        className="fade-up glass-strong mt-10 w-full overflow-hidden rounded-3xl p-8"
        style={{ animationDelay: '0.15s' }}
      >
        <div className="flex flex-col gap-3">
          <button
            onClick={() => alert('TODO: Kakao OAuth')}
            className="group relative flex h-12 items-center justify-center gap-2 overflow-hidden rounded-full bg-[#FEE500] text-sm font-semibold text-[#191919] transition-transform hover:scale-[1.01]"
          >
            <KakaoMark />
            <span>카카오로 시작하기</span>
            <span
              aria-hidden
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"
            />
          </button>

          <button
            onClick={() => alert('TODO: Google OAuth')}
            className="group flex h-12 items-center justify-center gap-3 rounded-full border border-white/15 bg-white/5 text-sm font-medium text-white transition-colors hover:border-rose-300/40 hover:bg-white/10"
          >
            <GoogleMark />
            <span>Google로 시작하기</span>
          </button>
        </div>

        <div className="my-7 flex items-center gap-3">
          <div className="hairline flex-1" />
          <span className="font-display text-[10px] italic tracking-[0.3em] text-lavender-300/60">
            or
          </span>
          <div className="hairline flex-1" />
        </div>

        <p className="text-xs text-lavender-300/70">
          가입 시{' '}
          <Link href="#" className="text-rose-200 underline-offset-2 hover:underline">
            서비스 약관
          </Link>{' '}
          및{' '}
          <Link href="#" className="text-rose-200 underline-offset-2 hover:underline">
            개인정보 처리방침
          </Link>
          에 동의하게 됩니다.
        </p>
      </div>

      <p className="fade-up font-display mt-8 text-sm italic text-lavender-300/70" style={{ animationDelay: '0.3s' }}>
        — Every play becomes a star.
      </p>
    </div>
  );
}

function KakaoMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 4C6.5 4 2 7.6 2 12c0 2.8 1.9 5.3 4.7 6.7l-1 3.6c-.1.4.3.7.7.5l4.3-2.8c.4 0 .8.1 1.3.1 5.5 0 10-3.6 10-8.1S17.5 4 12 4Z"
        fill="#191919"
      />
    </svg>
  );
}

function GoogleMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4c-.2 1.2-.9 2.3-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3Z" fill="#4285F4" />
      <path d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3v2.6C4.6 19.7 8 22 12 22Z" fill="#34A853" />
      <path d="M6.4 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.4H3C2.4 8.8 2 10.4 2 12s.4 3.2 1 4.6L6.4 14Z" fill="#FBBC05" />
      <path d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.8-2.8C17 3 14.7 2 12 2 8 2 4.6 4.3 3 7.4L6.4 10c.8-2.3 3-4.1 5.6-4.1Z" fill="#EA4335" />
    </svg>
  );
}
