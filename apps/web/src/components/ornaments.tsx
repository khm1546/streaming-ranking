import { cn } from '@streaming/ui';

/* ─── Sparkle ─────────────────────────────── */
export function Sparkle({ className, size = 14 }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      width={size}
      height={size}
      className={cn('inline-block text-rose-300/80', className)}
      aria-hidden
    >
      <path
        d="M12 2 L13.5 9.5 L21 11 L13.5 12.5 L12 21 L10.5 12.5 L3 11 L10.5 9.5 Z"
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
  );
}

/* ─── PageHeading: Korean primary + italic English subtitle ──── */
export function PageHeading({
  title,
  english,
  description,
}: {
  title: string;
  english: string;
  description?: string;
}) {
  return (
    <header className="fade-up flex flex-col items-center gap-3 text-center sm:items-start sm:text-left">
      <div className="flex items-center gap-3">
        <Sparkle className="text-rose-300/70" />
        <span className="font-display text-sm italic tracking-[0.2em] text-rose-200/80">
          {english}
        </span>
        <Sparkle className="text-rose-300/70" />
      </div>
      <h1 className="text-4xl font-semibold tracking-tight text-white glow-soft sm:text-5xl">
        {title}
      </h1>
      {description ? (
        <p className="max-w-2xl text-sm text-lavender-200/80 sm:text-base">{description}</p>
      ) : null}
    </header>
  );
}

/* ─── Decorative divider with center sparkle ─── */
export function Divider({ label }: { label?: string }) {
  return (
    <div className="my-8 flex items-center gap-4">
      <div className="hairline flex-1" />
      {label ? (
        <span className="font-display text-xs italic tracking-[0.3em] text-lavender-300/70">
          {label}
        </span>
      ) : (
        <Sparkle size={12} className="text-lavender-300/50" />
      )}
      <div className="hairline flex-1" />
    </div>
  );
}

/* ─── EmptyState ─────────────────────────────── */
export function EmptyState({
  title,
  english,
  description,
  icon,
}: {
  title: string;
  english: string;
  description?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="glass-card card-shine relative rounded-2xl p-12 text-center">
      <div className="float-slow mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-rose-300/30 bg-rose-300/5">
        {icon ?? <Sparkle size={26} className="text-rose-300/80" />}
      </div>
      <p className="font-display mb-1 text-xs italic tracking-[0.32em] text-rose-200/70">
        {english}
      </p>
      <h3 className="mb-2 text-lg font-medium text-white">{title}</h3>
      {description ? (
        <p className="mx-auto max-w-md text-sm text-lavender-200/70">{description}</p>
      ) : null}
    </div>
  );
}

/* ─── Numeral: jewelry-sized rank/count ────── */
export function Numeral({
  value,
  size = 'md',
  className,
}: {
  value: string | number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) {
  const sizes = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
    xl: 'text-8xl',
  };
  return <span className={cn('numeral', sizes[size], className)}>{value}</span>;
}
