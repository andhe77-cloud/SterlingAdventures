import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronRight, Scale, SkipForward } from 'lucide-react';
import { soundFx } from '../utils/soundFx';

interface AnimatedIntroProps {
  caseTitle: string;
  onComplete: () => void;
}

interface IntroSlide {
  id: string;
  imageUrl?: string;
  kicker: string;
  caption: string;
  sfx?: 'foghorn' | 'alarm' | 'gavel';
  durationMs: number;
  panFrom: { scale: number; x: number; y: number };
  panTo: { scale: number; x: number; y: number };
  isTitleCard?: boolean;
}

const INTRO_SLIDES: IntroSlide[] = [
  {
    id: 'slide_ship',
    imageUrl: '/src/assets/images/intro_ship_sunset_1795043375929.jpg',
    kicker: 'Mittelmeer · 19:45 Uhr',
    caption:
      'Sieben Tage Sonne, Meeresluft und kein einziger Aktenordner. Für Strafverteidiger Nate Sterling und seine Assistentin Maya sollte dies ein ganz normaler Urlaub werden…',
    sfx: 'foghorn',
    durationMs: 5600,
    panFrom: { scale: 1.0, x: 0, y: 0 },
    panTo: { scale: 1.1, x: -18, y: -6 },
  },
  {
    id: 'slide_chronometer',
    imageUrl: '/src/assets/images/intro_chronometer_case_1795043376372.jpg',
    kicker: 'VIP-Salon · Erste Klasse',
    caption:
      'An Bord der MS Aurora wird an diesem Abend der Stolz der Reederei ausgestellt: der über hundert Jahre alte Goldene Schiffs-Chronometer.',
    durationMs: 5400,
    panFrom: { scale: 1.08, x: 16, y: 0 },
    panTo: { scale: 1.0, x: -10, y: 4 },
  },
  {
    id: 'slide_theft',
    imageUrl: '/src/assets/images/intro_shattered_alarm_1795043377081.jpg',
    kicker: '20:30 Uhr · Alarm an Bord!',
    caption:
      'Doch mitten während des Willkommens-Dinners zersplittert das Sicherheitsglas. Ein schriller Alarm zerreißt die ruhige Seeluft – und eine junge Bord-Pianistin gerät sofort unter Verdacht.',
    sfx: 'alarm',
    durationMs: 5800,
    panFrom: { scale: 1.02, x: -12, y: 4 },
    panTo: { scale: 1.12, x: 12, y: -6 },
  },
  {
    id: 'slide_title',
    kicker: 'Fall 1 · Akte MS Aurora',
    caption: 'Akt 1: Urlaub wider Willen',
    sfx: 'gavel',
    durationMs: 3600,
    panFrom: { scale: 0.96, x: 0, y: 0 },
    panTo: { scale: 1.0, x: 0, y: 0 },
    isTitleCard: true,
  },
];

export function AnimatedIntro({ caseTitle, onComplete }: AnimatedIntroProps) {
  const [index, setIndex] = useState(0);
  const current = INTRO_SLIDES[index];

  useEffect(() => {
    if (!current) return;
    if (current.sfx) {
      soundFx.play(current.sfx);
    }

    const timer = window.setTimeout(() => {
      if (index + 1 < INTRO_SLIDES.length) {
        setIndex((i) => i + 1);
      } else {
        onComplete();
      }
    }, current.durationMs);

    return () => window.clearTimeout(timer);
  }, [index, current, onComplete]);

  const handleNext = () => {
    if (index + 1 < INTRO_SLIDES.length) {
      setIndex((i) => i + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-8 select-none">
      <div className="max-w-5xl w-full space-y-4">
        {/* Top Skip & Progress Bar */}
        <div className="flex items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            {INTRO_SLIDES.map((s, idx) => (
              <span
                key={s.id}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === index
                    ? 'w-8 bg-amber-400'
                    : idx < index
                      ? 'w-4 bg-amber-600/60'
                      : 'w-4 bg-slate-800'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={onComplete}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <SkipForward className="w-3.5 h-3.5 shrink-0" />
            <span>Intro überspringen</span>
          </button>
        </div>

        {/* 16:9 Cinema Frame with Letterbox Bars */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              {current.isTitleCard ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 p-8 text-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-4 max-w-2xl"
                  >
                    <div className="mx-auto w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center">
                      <Scale className="w-7 h-7 text-amber-400" />
                    </div>
                    <div className="text-xs font-semibold tracking-wider text-amber-400">
                      {current.kicker}
                    </div>
                    <h1 className="font-display text-3xl sm:text-5xl font-bold text-slate-50 leading-tight text-balance">
                      {caseTitle}
                    </h1>
                    <p className="text-sm sm:text-base text-slate-300">
                      {current.caption}
                    </p>
                  </motion.div>
                </div>
              ) : (
                <>
                  {current.imageUrl && (
                    <motion.img
                      src={current.imageUrl}
                      alt={current.kicker}
                      referrerPolicy="no-referrer"
                      initial={{
                        scale: current.panFrom.scale,
                        x: current.panFrom.x,
                        y: current.panFrom.y,
                      }}
                      animate={{
                        scale: current.panTo.scale,
                        x: current.panTo.x,
                        y: current.panTo.y,
                      }}
                      transition={{
                        duration: current.durationMs / 1000,
                        ease: 'linear',
                      }}
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* Subtle dark vignette + bottom narration scrim */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-slate-950/30" />

                  {/* Letterbox Top & Bottom */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-8 sm:h-10 bg-slate-950/90" />

                  {/* Narration Subtitle Box */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="absolute inset-x-0 bottom-0 p-5 sm:p-8 space-y-2"
                  >
                    <div className="text-xs font-semibold text-amber-400">
                      {current.kicker}
                    </div>
                    <p className="text-sm sm:text-lg text-slate-100 leading-relaxed max-w-3xl">
                      {current.caption}
                    </p>
                  </motion.div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Manual Next Button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer"
          >
            <span>
              {index + 1 < INTRO_SLIDES.length ? 'Nächste Szene' : 'Akt 1 starten'}
            </span>
            <ChevronRight className="w-4 h-4 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
}
