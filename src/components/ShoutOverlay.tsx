import type { ShoutType } from '../types/game';

interface ShoutOverlayProps {
  shout: ShoutType | null;
}

export function ShoutOverlay({ shout }: ShoutOverlayProps) {
  if (!shout) return null;

  const styleMap: Record<ShoutType, string> = {
    'EINSPRUCH!':
      'bg-red-600/95 border-red-300 text-white shadow-[0_18px_45px_rgba(220,38,38,0.65)]',
    'MOMENT MAL!':
      'bg-blue-600/95 border-blue-200 text-white shadow-[0_18px_45px_rgba(37,99,235,0.65)]',
    'VOLLTREFFER!':
      'bg-amber-500/95 border-amber-100 text-slate-950 shadow-[0_18px_45px_rgba(245,158,11,0.65)]',
    'NICHT SCHULDIG!':
      'bg-emerald-600/95 border-emerald-200 text-white shadow-[0_18px_45px_rgba(5,150,105,0.65)]',
  };

  return (
    <div
      className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-slate-950/30"
      aria-live="assertive"
    >
      <div
        key={shout}
        className={`animate-shout-slam border-4 px-8 py-4 rounded-xl font-display text-3xl sm:text-5xl font-extrabold tracking-wider ${styleMap[shout]}`}
      >
        {shout}
      </div>
    </div>
  );
}
