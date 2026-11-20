import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertTriangle, ChevronRight, Music, SkipForward } from 'lucide-react';
import { soundFx } from '../utils/soundFx';

interface AnimatedOutroProps {
  muted: boolean;
  onComplete: () => void;
}

interface OutroSlide {
  id: string;
  imageUrl?: string;
  kicker: string;
  speaker?: string;
  caption: string;
  playsPiano?: boolean;
  fadeOutEvening?: boolean;
  sfx?: 'foghorn' | 'alarm' | 'tension';
  durationMs: number;
  panFrom: { scale: number; x: number; y: number };
  panTo: { scale: number; x: number; y: number };
  isCliffhangerCard?: boolean;
}

const OUTRO_SLIDES: OutroSlide[] = [
  {
    id: 'outro_piano_1',
    imageUrl: '/src/assets/images/outro_anya_piano_1795089043517.jpg',
    kicker: 'Tag 3 · Abend · Musiksalon',
    speaker: 'Anya Brooks',
    caption:
      '„Dieses Lied ist für meine Helden!“ — Unter warmem Bühnenlicht gleiten Anyas Finger über die Tasten des Konzertflügels. Für einen kostbaren Abend kehrt endlich Frieden auf die MS Aurora ein.',
    playsPiano: true,
    durationMs: 10500,
    panFrom: { scale: 1.0, x: 0, y: 0 },
    panTo: { scale: 1.09, x: -14, y: -6 },
  },
  {
    id: 'outro_piano_2',
    imageUrl: '/src/assets/images/outro_anya_piano_1795089043517.jpg',
    kicker: 'Tag 3 · Abend · Nachklang',
    speaker: 'Nate Sterling (Gedanke)',
    caption:
      '(Die Melodie klingt wunderschön… und trotzdem lässt mich dieser eine Gedanke nicht los: Wer hat Arthur diesen Brief untergeschoben – und was steht wohl morgen in seinen Bankunterlagen?)',
    playsPiano: true,
    durationMs: 9200,
    panFrom: { scale: 1.08, x: 10, y: -4 },
    panTo: { scale: 1.02, x: -6, y: 2 },
  },
  {
    id: 'outro_evening_fade',
    imageUrl: '/src/assets/images/outro_anya_piano_1795089043517.jpg',
    kicker: 'Tag 3 · Späte Nacht',
    caption:
      'Mit den letzten sanften Akkorden verklingt der Beifall im Musiksalon – ein langer, turbulenter Tag auf hoher See geht friedlich zu Ende…',
    playsPiano: true,
    fadeOutEvening: true,
    durationMs: 4600,
    panFrom: { scale: 1.02, x: -6, y: 2 },
    panTo: { scale: 1.0, x: 0, y: 0 },
  },
  {
    id: 'outro_crete_morning',
    imageUrl: '/src/assets/images/outro_crete_harbor_1795089043540.jpg',
    kicker: 'Tag 4 · Morgen · Ankunft vor Kreta',
    speaker: 'Maya & Nate',
    caption:
      'Am nächsten Morgen stehen Maya und Nate gut gelaunt an der Reling: Die weißen Häuser und die alte Hafenfestung von Kreta kommen in Sicht! „Endlich Urlaub!“ – doch plötzlich stockt der Landgang…',
    sfx: 'foghorn',
    durationMs: 7000,
    panFrom: { scale: 1.0, x: 0, y: 0 },
    panTo: { scale: 1.08, x: 14, y: -4 },
  },
  {
    id: 'outro_blocked',
    imageUrl: '/src/assets/images/outro_crete_harbor_1795089043540.jpg',
    kicker: 'Tag 4 · Morgen · Gangway gesperrt!',
    speaker: 'Maya',
    caption:
      'Plötzlich schrillen Pfiffe über das ganze Schiff! Alle Ausgänge und die Gangway werden abgeriegelt, und Sicherheitsleute stürmen unter Deck. Maya greift erschrocken nach Nates Ärmel: „Nate… was ist hier los?! Warum dürfen wir nicht von Bord?!“',
    sfx: 'tension',
    durationMs: 7400,
    panFrom: { scale: 1.07, x: -10, y: 0 },
    panTo: { scale: 1.14, x: 10, y: -6 },
  },
  {
    id: 'outro_cliffhanger',
    kicker: 'Ende von Fall 1 · Akte MS Aurora',
    caption: 'Fortsetzung folgt in Fall 2: Schatten über Kreta',
    sfx: 'alarm',
    durationMs: 5400,
    panFrom: { scale: 0.96, x: 0, y: 0 },
    panTo: { scale: 1.0, x: 0, y: 0 },
    isCliffhangerCard: true,
  },
];

const FLOATING_NOTES = [
  { id: 1, left: '62%', top: '58%', delay: 0 },
  { id: 2, left: '70%', top: '48%', delay: 0.8 },
  { id: 3, left: '66%', top: '38%', delay: 1.6 },
  { id: 4, left: '75%', top: '54%', delay: 2.3 },
];

export function AnimatedOutro({ muted, onComplete }: AnimatedOutroProps) {
  const [index, setIndex] = useState(0);
  const current = OUTRO_SLIDES[index];

  useEffect(() => {
    if (!current) return;

    if (current.fadeOutEvening) {
      soundFx.fadeOutPianoBallad(Math.max(1500, current.durationMs - 400));
    } else if (current.playsPiano && !muted) {
      soundFx.startPianoBallad();
    } else {
      soundFx.stopPianoBallad();
    }

    if (current.sfx) {
      soundFx.play(current.sfx);
    }

    const timer = window.setTimeout(() => {
      if (index + 1 < OUTRO_SLIDES.length) {
        setIndex((i) => i + 1);
      } else {
        soundFx.stopPianoBallad();
        onComplete();
      }
    }, current.durationMs);

    return () => {
      window.clearTimeout(timer);
    };
  }, [index, current, muted, onComplete]);

  useEffect(() => {
    return () => {
      soundFx.stopPianoBallad();
    };
  }, []);

  const handleNext = () => {
    if (index + 1 < OUTRO_SLIDES.length) {
      setIndex((i) => i + 1);
    } else {
      soundFx.stopPianoBallad();
      onComplete();
    }
  };

  const handleSkip = () => {
    soundFx.stopPianoBallad();
    onComplete();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-8 select-none">
      <div className="max-w-5xl w-full space-y-4">
        {/* Progress & Skip */}
        <div className="flex items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            {OUTRO_SLIDES.map((s, idx) => (
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
            onClick={handleSkip}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <SkipForward className="w-3.5 h-3.5 shrink-0" />
            <span>Outro abschließen</span>
          </button>
        </div>

        {/* 16:9 Cinema Frame */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              {current.isCliffhangerCard ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-red-950/35 via-slate-950 to-slate-950 p-8 text-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-4 max-w-2xl"
                  >
                    <div className="mx-auto w-14 h-14 rounded-full bg-red-500/15 border border-red-500/50 flex items-center justify-center">
                      <AlertTriangle className="w-7 h-7 text-red-400" />
                    </div>
                    <div className="text-xs font-semibold tracking-wider text-red-400 uppercase">
                      {current.kicker}
                    </div>
                    <h1 className="font-display text-3xl sm:text-5xl font-bold text-slate-50 leading-tight text-balance">
                      Was ist unter Deck geschehen?
                    </h1>
                    <p className="text-sm sm:text-base text-amber-300 font-medium">
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

                  {current.fadeOutEvening && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.92 }}
                      transition={{
                        duration: current.durationMs / 1000,
                        ease: 'easeInOut',
                      }}
                      className="pointer-events-none absolute inset-0 bg-slate-950"
                    />
                  )}

                  {/* Floating musical notes during Anya's piano performance */}
                  {current.playsPiano && (
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                      {FLOATING_NOTES.map((note) => (
                        <motion.div
                          key={note.id}
                          style={{ left: note.left, top: note.top }}
                          initial={{ opacity: 0, y: 12, scale: 0.7 }}
                          animate={{
                            opacity: [0, 0.85, 0],
                            y: -65,
                            x: [0, 10, -8],
                            scale: [0.8, 1.1, 0.9],
                          }}
                          transition={{
                            duration: 3.4,
                            repeat: Infinity,
                            delay: note.delay,
                            ease: 'easeInOut',
                          }}
                          className="absolute text-amber-300/90 drop-shadow-[0_0_8px_rgba(251,191,36,0.55)]"
                        >
                          <Music className="w-5 h-5" />
                        </motion.div>
                      ))}
                    </div>
                  )}

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-slate-950/25" />
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-8 sm:h-10 bg-slate-950/85" />

                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="absolute inset-x-0 bottom-0 p-5 sm:p-8 space-y-1.5"
                  >
                    <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                      {current.playsPiano && <Music className="w-3.5 h-3.5 shrink-0" />}
                      <span>{current.kicker}</span>
                      {current.speaker && (
                        <>
                          <span className="text-slate-600">·</span>
                          <span className="text-slate-200">{current.speaker}</span>
                        </>
                      )}
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

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer"
          >
            <span>
              {index + 1 < OUTRO_SLIDES.length ? 'Nächste Szene' : 'Fall 1 abschließen'}
            </span>
            <ChevronRight className="w-4 h-4 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
}
