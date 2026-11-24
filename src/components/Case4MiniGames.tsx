import { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Eye,
  Flashlight,
  Search,
  Sparkles,
  Watch,
  X,
} from 'lucide-react';
import { resolveAssetPath } from '../utils/assetPath';
import { soundFx } from '../utils/soundFx';

// =============================================================================
// MINISPIEL 1 (FALL 4): BRIEF-FORENSIK (LUPE & UV-STREIFLICHT)
// =============================================================================

interface LetterSpot {
  id: string;
  label: string;
  x: number;
  y: number;
  r: number;
  findingTitle: string;
  findingDetail: string;
  recommendedTool: 'loupe' | 'uv';
}

const LETTER_SPOTS: LetterSpot[] = [
  {
    id: 'spot_wine',
    label: 'Rotweinfleck-Rand',
    x: 78,
    y: 60,
    r: 9,
    recommendedTool: 'uv',
    findingTitle: 'Doppelter Tinten- & Weinfleck-Verlauf',
    findingDetail:
      'Unter UV-Streiflicht fluoresziert der Rand seltsam: Jemand hat auf das bereits angetrocknete Weinring-Papier nachträglich frische Tinte gesetzt!',
  },
  {
    id: 'spot_ref',
    label: 'Konto-Ref „KRETA-77“',
    x: 31,
    y: 76,
    r: 12,
    recommendedTool: 'uv',
    findingTitle: 'Verblasste Tinte ohne Empfänger-Spur',
    findingDetail:
      'Die Zeile „Konto-Ref: KRETA-77“ leuchtet unter UV-Licht genauso alt und verblasst wie der Haupttext — ganz anders als die frische Nachbesserung rechts im Weinring!',
  },
  {
    id: 'spot_initials',
    label: 'Initialen „An: A. H.“',
    x: 74,
    y: 75,
    r: 10,
    recommendedTool: 'loupe',
    findingTitle: 'Nachträglich manipuliertes Monogramm!',
    findingDetail:
      'Bei 2,5-facher Vergrößerung zeigt sich direkt am „A. H.“ eine überkratzte Korrektur mit jüngerer Tinte! Das Dokument wurde nachträglich manipuliert – welches ursprüngliche Kürzel („A. W.“ oder „A. H.“) exakt gemeint war, lässt sich hier vor Ort noch nicht zweifelsfrei klären!',
  },
];

export function LetterForensicsMiniGame({
  onComplete,
  onCancel,
}: {
  onComplete: () => void;
  onCancel: () => void;
}) {
  const [tool, setTool] = useState<'loupe' | 'uv'>('loupe');
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);
  const [foundIds, setFoundIds] = useState<string[]>([]);
  const [step, setStep] = useState<'scan' | 'quiz' | 'solved'>('scan');
  const [wrongChoice, setWrongChoice] = useState<string | null>(null);
  const [feedback, setFeedback] = useState(
    'Bewege Lupe oder UV-Lampe über den weingetränkten 45.000-€-Brief und untersuche alle 3 verdächtigen Stellen.'
  );

  const stageRef = useRef<HTMLDivElement | null>(null);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (step !== 'solved') return;
    const t = window.setTimeout(() => {
      if (completedRef.current) return;
      completedRef.current = true;
      onCompleteRef.current();
    }, 1000);
    return () => window.clearTimeout(t);
  }, [step]);

  const finishNow = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    onCompleteRef.current();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) return;
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setPointer({ x, y });
  };

  const handleInspectSpot = (spot: LetterSpot) => {
    if (step !== 'scan') return;
    if (foundIds.includes(spot.id)) {
      setFeedback(`${spot.findingTitle}: ${spot.findingDetail}`);
      return;
    }
    soundFx.play('evidence_chime');
    const next = [...foundIds, spot.id];
    setFoundIds(next);
    if (next.length === LETTER_SPOTS.length) {
      soundFx.play('deduction');
      setStep('quiz');
      setFeedback(
        'Alle 3 Spuren gesichert! Ziehe jetzt die richtige forensische Schlussfolgerung aus deiner Prüfung.'
      );
    } else {
      setFeedback(`${spot.findingTitle} (${next.length}/3): ${spot.findingDetail}`);
    }
  };

  const handlePickConclusion = (choiceId: string) => {
    if (step !== 'quiz') return;
    if (choiceId === 'manipulated') {
      soundFx.play('deduction');
      setStep('solved');
      setFeedback(
        'VOLLTREFFER!! Der Brief wurde nachträglich manipuliert — weder „A. W.“, „A. M.“ noch „A. H.“ ist noch eindeutig lesbar!'
      );
    } else {
      soundFx.play('penalty');
      setWrongChoice(choiceId);
      setFeedback(
        'Schau genau auf deine Befunde unter Lupe & UV-Licht: Die Tinte bei den Initialen wurde nachträglich verändert!'
      );
    }
  };

  return (
    <div className="absolute inset-0 z-30 bg-slate-950/92 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="max-w-3xl w-full max-h-full overflow-y-auto bg-slate-900 border border-amber-500/40 rounded-xl p-4 sm:p-5 shadow-2xl space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
              <Search className="w-4 h-4 shrink-0" />
              <span>Asservaten-Prüfung · Der 45.000-€-Brief (Fall 1)</span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {step === 'scan'
                ? 'Wechsle zwischen Lupe und UV-Lampe und klicke die 3 verdächtigen Stellen auf dem Dokument an.'
                : 'Bestätige das Ergebnis für das Seegericht.'}
            </p>
          </div>
          <button
            type="button"
            onClick={step === 'solved' ? finishNow : onCancel}
            aria-label="Prüfung schließen"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tool Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                soundFx.play('blip');
                setTool('loupe');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors cursor-pointer ${
                tool === 'loupe'
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-slate-900 text-slate-200 border-slate-700 hover:bg-slate-800'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Lupe (2,5×)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                soundFx.play('blip');
                setTool('uv');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors cursor-pointer ${
                tool === 'uv'
                  ? 'bg-violet-500 text-white border-violet-400'
                  : 'bg-slate-900 text-slate-200 border-slate-700 hover:bg-slate-800'
              }`}
            >
              <Flashlight className="w-3.5 h-3.5" />
              <span>UV- & Streiflicht</span>
            </button>
          </div>
          <span className="font-mono-num text-xs font-bold text-amber-300">
            Spuren gesichert: {foundIds.length} / {LETTER_SPOTS.length}
          </span>
        </div>

        {step === 'scan' ? (
          <div
            ref={stageRef}
            onPointerMove={handlePointerMove}
            onPointerLeave={() => setPointer(null)}
            className="relative w-full aspect-[4/3] max-h-[54vh] mx-auto rounded-lg overflow-hidden border border-slate-700 bg-slate-950 select-none touch-none cursor-crosshair"
          >
            <img
              src={resolveAssetPath(
                '/src/assets/images/f4_letter_closeup_v2_1795450795066.jpg'
              )}
              alt="Weingetränkter 45.000-€-Brief"
              className={`w-full h-full object-cover transition-all duration-200 ${
                tool === 'uv' ? 'brightness-75 contrast-125 saturate-75' : ''
              }`}
            />

            {/* UV Tint Overlay */}
            {tool === 'uv' && (
              <div className="pointer-events-none absolute inset-0 bg-indigo-950/35 mix-blend-multiply" />
            )}

            {/* Dynamic Lens Cursor (Loupe Zoom or UV Reveal Beam) */}
            {pointer && tool === 'loupe' && (
              <div
                style={{
                  left: `${pointer.x}%`,
                  top: `${pointer.y}%`,
                  backgroundImage: `url(${resolveAssetPath(
                    '/src/assets/images/f4_letter_closeup_v2_1795450795066.jpg'
                  )})`,
                  backgroundSize: '230% 230%',
                  backgroundPosition: `${pointer.x}% ${pointer.y}%`,
                }}
                className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 w-28 h-28 sm:w-36 sm:h-36 rounded-full border-2 border-amber-400 shadow-[0_0_24px_rgba(245,158,11,0.55)] ring-4 ring-slate-950/60"
              />
            )}

            {pointer && tool === 'uv' && (
              <div
                style={{
                  left: `${pointer.x}%`,
                  top: `${pointer.y}%`,
                }}
                className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-violet-400/25 border border-violet-300/60 shadow-[0_0_40px_rgba(167,139,250,0.65)] backdrop-contrast-150"
              />
            )}

            {/* Interactive Forensic Zones */}
            {LETTER_SPOTS.map((spot) => {
              const isFound = foundIds.includes(spot.id);
              const nearPointer =
                pointer &&
                Math.hypot(pointer.x - spot.x, pointer.y - spot.y) <= spot.r + 6;
              return (
                <button
                  key={spot.id}
                  type="button"
                  aria-label={spot.label}
                  onClick={() => handleInspectSpot(spot)}
                  style={{
                    left: `${spot.x}%`,
                    top: `${spot.y}%`,
                    width: `${spot.r * 2}%`,
                    height: `${spot.r * 2}%`,
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-all cursor-pointer flex items-center justify-center ${
                    isFound
                      ? 'bg-emerald-500/20 border-2 border-emerald-400 shadow-[0_0_16px_rgba(16,185,129,0.5)]'
                      : nearPointer
                        ? tool === 'uv'
                          ? 'bg-violet-400/20 border-2 border-dashed border-violet-300 animate-pulse'
                          : 'bg-amber-400/15 border-2 border-dashed border-amber-300'
                        : 'bg-transparent border border-transparent hover:border-amber-300/50'
                  }`}
                >
                  {isFound && (
                    <span className="bg-emerald-500 text-slate-950 rounded-full p-1 shadow">
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {LETTER_SPOTS.map((spot) => (
                <div
                  key={spot.id}
                  className="bg-slate-950/90 border border-emerald-500/40 rounded-lg p-2.5 space-y-1"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{spot.label}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    {spot.findingDetail}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              {[
                {
                  id: 'andrew_real',
                  label: 'Das „A. H.“ ist eindeutig frisch und gehört ohne Zweifel Andrew Higginson.',
                },
                {
                  id: 'manipulated',
                  label:
                    'Der Brief wurde nachträglich manipuliert — man kann nicht mehr erkennen, ob „A. W.“, „A. M.“ oder „A. H.“ gemeint war!',
                },
                {
                  id: 'arthur_wine',
                  label: 'Der Rotwein hat das Papier bloß unabsichtlich beim Servieren gefärbt.',
                },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  disabled={step === 'solved'}
                  onClick={() => handlePickConclusion(opt.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-lg border text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                    step === 'solved' && opt.id === 'manipulated'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-100'
                      : wrongChoice === opt.id
                        ? 'bg-red-500/10 border-red-500/40 text-red-300'
                        : 'bg-slate-950/80 border-slate-700 hover:border-amber-400/70 text-slate-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div
          className={`text-xs rounded-lg px-3 py-2 border ${
            step === 'solved'
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200 font-semibold'
              : 'bg-slate-950/80 border-slate-800 text-slate-200'
          }`}
        >
          {feedback}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// MINISPIEL 2 (FALL 4): SCHIFFSBIBLIOTHEK — 8 BÜCHER FINDEN & CHRONIK WÄHLEN
// =============================================================================

interface LibraryBookSpot {
  id: string;
  title: string;
  subtitle: string;
  hint: string;
  x: number;
  y: number;
  w: number;
  h: number;
  isTarget?: boolean;
}

const LIBRARY_BOOKS: LibraryBookSpot[] = [
  {
    id: 'lib_red',
    title: 'Bord-Kombüse im Wandel (1960–2020)',
    subtitle: 'Galabuffet-Rezepte & Menükarten der Reederei',
    hint: 'Knallrotes Buch auf dem linken grünen Ledersessel',
    x: 21,
    y: 84,
    w: 11,
    h: 11,
  },
  {
    id: 'lib_green',
    title: 'Leuchttürme des Mittelmeers',
    subtitle: 'Seezeichen zwischen Gibraltar, Kreta & Malta',
    hint: 'Schräg herausgezogenes grünes Buch im linken oberen Regal',
    x: 15.5,
    y: 34.5,
    w: 7,
    h: 7,
  },
  {
    id: 'lib_blue',
    title: 'Passagier-Register 1984–1992',
    subtitle: 'Alte Kabinenlisten & Landgangs-Statistiken',
    hint: 'Königsblaues Buch direkt neben dem Globus',
    x: 34.5,
    y: 49.5,
    w: 6.5,
    h: 10,
  },
  {
    id: 'lib_teal',
    title: 'Bordfunk & Morse-Codes auf hoher See',
    subtitle: 'Technik-Anhang für ältere Funkoffiziere',
    hint: 'Türkises Buch auf der Stufe der Messing-Bibliotheksleiter',
    x: 42.5,
    y: 49.5,
    w: 6.5,
    h: 6,
  },
  {
    id: 'lib_chronik',
    title: 'Chronik der Aurora-Linie (1924): Flaggschiffe & Bord-Schätze',
    subtitle: 'Offizielle Reederei-Geschichte mit Werkskizzen des Goldenen Chronometers',
    hint: 'Aufgeschlagenes goldfarbenes Prachtbuch in der Mitte auf dem Eichentisch unter der grünen Lampe',
    x: 51.5,
    y: 58.5,
    w: 11,
    h: 8,
    isTarget: true,
  },
  {
    id: 'lib_purple',
    title: 'Segelschiffe & Takelage-Almanach',
    subtitle: 'Knoten, Masten und historische Dreimaster',
    hint: 'Violettes Buch rechts im Regal neben dem kleinen Segelschiff-Modell',
    x: 65,
    y: 44,
    w: 7,
    h: 11,
  },
  {
    id: 'lib_orange',
    title: 'Reederei-Jahresbilanz 2012',
    subtitle: 'Treibstoffkosten, Hafensteuern & Werftrechnungen',
    hint: 'Oranges Buch auf dem runden Beistelltisch rechts unten',
    x: 79.5,
    y: 74,
    w: 9,
    h: 7,
  },
  {
    id: 'lib_burgundy',
    title: 'Dampfkessel & Turbinen des Nordatlantiks',
    subtitle: 'Historische Maschinenbau-Skizzen vor 1950',
    hint: 'Bordeauxrotes Buch rechts am runden Messing-Bullauge',
    x: 85,
    y: 53,
    w: 7,
    h: 10,
  },
];

export function LibraryBooksHiddenMiniGame({
  onComplete,
  onCancel,
}: {
  onComplete: () => void;
  onCancel: () => void;
}) {
  const [foundIds, setFoundIds] = useState<string[]>([]);
  const [step, setStep] = useState<'hunt' | 'select' | 'solved'>('hunt');
  const [triedWrongIds, setTriedWrongIds] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState(
    'Durchsuche die Schiffsbibliothek und sammle alle 8 farblich markierten Bände zur Geschichte von Schiff & Flotte ein!'
  );

  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (step !== 'solved') return;
    const t = window.setTimeout(() => {
      if (completedRef.current) return;
      completedRef.current = true;
      onCompleteRef.current();
    }, 1100);
    return () => window.clearTimeout(t);
  }, [step]);

  const finishBooks = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    onCompleteRef.current();
  };

  const handleFindBook = (book: LibraryBookSpot) => {
    if (step !== 'hunt' || foundIds.includes(book.id)) return;
    soundFx.play('page_turn');
    const next = [...foundIds, book.id];
    setFoundIds(next);
    setShowHint(false);

    if (next.length === LIBRARY_BOOKS.length) {
      soundFx.play('evidence_chime');
      setStep('select');
      setFeedback(
        'Alle 8 Bände liegen auf dem Lesetisch! Welches Buch beschreibt exakt die Echtheitsmerkmale des originalen 1924er Chronometers?'
      );
    } else {
      setFeedback(`Gefunden (${next.length}/8): ${book.title}`);
    }
  };

  const handlePickBook = (book: LibraryBookSpot) => {
    if (step !== 'select') return;
    if (book.isTarget) {
      soundFx.play('deduction');
      setStep('solved');
      setFeedback(
        'TREFFER!! In der „Chronik der Aurora-Linie (1924)“ stehen exakt die 3 Echtheitsmerkmale: 1. Massives 18k-Vollgold, 2. Doppelte kardanische Aufhängung, 3. Stempel „Horloge Genève · Nr. 1924-A“!'
      );
    } else {
      soundFx.play('penalty');
      setTriedWrongIds((prev) => (prev.includes(book.id) ? prev : [...prev, book.id]));
      setFeedback(
        `In „${book.title}“ steht nichts über den historischen Chronometer — such genau nach der alten Flotten-Chronik von 1924!`
      );
    }
  };

  const nextMissing = LIBRARY_BOOKS.find((b) => !foundIds.includes(b.id));

  return (
    <div className="absolute inset-0 z-30 bg-slate-950/92 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="max-w-3xl w-full max-h-full overflow-y-auto bg-slate-900 border border-amber-500/40 rounded-xl p-4 sm:p-5 shadow-2xl space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>Schiffsbibliothek · Geschichte von Schiff & Flotte</span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {step === 'hunt'
                ? 'Klicke alle 8 verstreuten Geschichts- und Flottenbände im Bibliotheksbild an.'
                : 'Wähle aus den 8 gefundenen Büchern die maßgebliche Flotten-Chronik für den Chronometer-Vergleich!'}
            </p>
          </div>
          <button
            type="button"
            onClick={step === 'solved' ? finishBooks : onCancel}
            aria-label="Bibliotheks-Suche schließen"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {step === 'hunt' ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-1.5">
              <span className="font-mono-num font-bold text-amber-300">
                Gefunden: {foundIds.length} / {LIBRARY_BOOKS.length} Bücher
              </span>
              <button
                type="button"
                onClick={() => setShowHint((v) => !v)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-300 hover:text-sky-200 cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>{showHint ? 'Tipp verbergen' : 'Such-Tipp anzeigen'}</span>
              </button>
            </div>

            {showHint && nextMissing && (
              <div className="text-[11px] text-sky-200 bg-sky-500/10 border border-sky-500/30 rounded-lg px-3 py-1.5">
                Tipp für den nächsten Band: {nextMissing.hint}
              </div>
            )}

            <div className="relative w-full aspect-video max-h-[52vh] rounded-lg overflow-hidden border border-slate-700 bg-slate-950 select-none">
              <img
                src={resolveAssetPath(
                  '/src/assets/images/minigame_f4_library_books_scene_1795445497235.jpg'
                )}
                alt="Schiffsbibliothek der MS Aurora"
                className="w-full h-full object-cover"
              />
              {LIBRARY_BOOKS.map((book) => {
                const isFound = foundIds.includes(book.id);
                return (
                  <button
                    key={book.id}
                    type="button"
                    aria-label={book.title}
                    onClick={() => handleFindBook(book)}
                    style={{
                      left: `${book.x}%`,
                      top: `${book.y}%`,
                      width: `${book.w}%`,
                      height: `${book.h}%`,
                    }}
                    className={`group absolute -translate-x-1/2 -translate-y-1/2 rounded-md transition-all cursor-pointer flex items-center justify-center ${
                      isFound
                        ? 'bg-emerald-500/35 border-2 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.55)]'
                        : 'bg-transparent border border-transparent hover:bg-amber-400/20 hover:border-amber-300/80'
                    }`}
                  >
                    {isFound && (
                      <span className="bg-emerald-500 text-slate-950 rounded-full p-0.5 shadow">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {LIBRARY_BOOKS.map((book) => {
              const triedWrong = triedWrongIds.includes(book.id);
              const isWin = step === 'solved' && Boolean(book.isTarget);
              return (
                <button
                  key={book.id}
                  type="button"
                  disabled={step === 'solved'}
                  onClick={() => handlePickBook(book)}
                  className={`text-left rounded-lg px-3 py-2.5 border transition-colors cursor-pointer ${
                    isWin
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-100'
                      : triedWrong
                        ? 'bg-red-500/10 border-red-500/40 text-red-300'
                        : 'bg-slate-950/80 border-slate-700 hover:border-amber-400/70 text-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold leading-snug">{book.title}</span>
                    {isWin && <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{book.subtitle}</p>
                </button>
              );
            })}
          </div>
        )}

        <div
          className={`text-xs rounded-lg px-3 py-2 border ${
            step === 'solved'
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200 font-semibold'
              : 'bg-slate-950/80 border-slate-800 text-slate-200'
          }`}
        >
          {feedback}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// MINISPIEL 3 (FALL 4): CHRONOMETER-VERGLEICH (3 BUCH-MERKMALE GEGEN ASSERVAT)
// =============================================================================

interface ChronometerFlaw {
  id: 'gold' | 'gimbal' | 'stamp';
  bookFeatureTitle: string;
  bookRule: string;
  spotLabel: string;
  x: number;
  y: number;
  w: number;
  h: number;
  actualFinding: string;
  verdictBadge: string;
}

const CHRONOMETER_FLAWS: ChronometerFlaw[] = [
  {
    id: 'gold',
    bookFeatureTitle: '1. Material: 18-Karat-Vollgold',
    bookRule: 'Massives 18-Karat-Vollgoldgehäuse mit tiefer Punze (keine Beschichtung).',
    spotLabel: 'Gehäuserand prüfen',
    x: 26,
    y: 65,
    w: 18,
    h: 22,
    actualFinding:
      'Unter einem feinen Kratzer am Rand schimmert graues Zinn/Zink — das „Gold“ ist nur dünn aufgemalt!',
    verdictBadge: 'Gold nur aufgemalt!',
  },
  {
    id: 'gimbal',
    bookFeatureTitle: '2. Lagerung: Kardanische Aufhängung',
    bookRule: 'Doppelte bewegliche kardanische Aufhängung zum Ausgleich von Schiffs-Seegang.',
    spotLabel: 'Aufhängung oben prüfen',
    x: 76,
    y: 21,
    w: 22,
    h: 20,
    actualFinding:
      'Der Bügel ist starr mit zwei Schrauben am Gehäuse vernietet — nur eine starre Deko-Attrappe ohne kardanische Mechanik!',
    verdictBadge: 'Keine kardanische Aufhängung!',
  },
  {
    id: 'stamp',
    bookFeatureTitle: '3. Stempel: „Horloge Genève · 1924-A“',
    bookRule: 'Tiefgravierter Manufaktur-Stempel „Chronométrie Horloge Genève · Nr. 1924-A“.',
    spotLabel: 'Deckel-Stempel prüfen',
    x: 61,
    y: 67,
    w: 32,
    h: 22,
    actualFinding:
      'Auf der geöffneten Deckel-Innenseite prangt sauber eingraviert: „REPLIKA · VALLETTA M-09“!',
    verdictBadge: 'Stempel: REPLIKA · VALLETTA!',
  },
];

export function ChronometerCompareMiniGame({
  onComplete,
  onCancel,
}: {
  onComplete: () => void;
  onCancel: () => void;
}) {
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [selectedFlawId, setSelectedFlawId] = useState<string | null>(null);
  const [confirmedFake, setConfirmedFake] = useState(false);
  const [feedback, setFeedback] = useState(
    'Prüfe alle 3 Merkmale aus der Flotten-Chronik (1924) direkt am Asservaten-Chronometer in der Kammer!'
  );

  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!confirmedFake) return;
    const t = window.setTimeout(() => {
      if (completedRef.current) return;
      completedRef.current = true;
      onCompleteRef.current();
    }, 950);
    return () => window.clearTimeout(t);
  }, [confirmedFake]);

  const handleInspectSpot = (flaw: ChronometerFlaw) => {
    setSelectedFlawId(flaw.id);
    if (!checkedIds.includes(flaw.id)) {
      soundFx.play('deduction');
      const next = [...checkedIds, flaw.id];
      setCheckedIds(next);
      if (next.length === CHRONOMETER_FLAWS.length) {
        setFeedback(
          'ALLE DREI MERKMALE WIDERLEGT!! Aufgemaltes Gold, starre Schein-Aufhängung und der Valletta-Replika-Stempel — bestätige jetzt deinen Befund!'
        );
      } else {
        setFeedback(`${flaw.verdictBadge} (${next.length}/3): ${flaw.actualFinding}`);
      }
    } else {
      soundFx.play('blip');
      setFeedback(`${flaw.verdictBadge}: ${flaw.actualFinding}`);
    }
  };

  const handleConfirmFake = () => {
    if (checkedIds.length < CHRONOMETER_FLAWS.length || confirmedFake) return;
    soundFx.play('victory');
    setConfirmedFake(true);
    setFeedback('DAS HIER IST EINE FÄLSCHUNG!!');
  };

  return (
    <div className="absolute inset-0 z-30 bg-slate-950/92 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="max-w-4xl w-full max-h-full overflow-y-auto bg-slate-900 border border-amber-500/40 rounded-xl p-4 sm:p-5 shadow-2xl space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
              <Watch className="w-4 h-4 shrink-0" />
              <span>Asservaten-Vergleich · Chronik 1924 vs. Schiffs-Chronometer</span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Klicke die 3 Prüfstellen am geöffneten Chronometer an und vergleiche sie mit den Buch-Merkmalen.
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Vergleich schließen"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
          {/* Left: Interactive Chronometer Inspection */}
          <div className="md:col-span-7 relative w-full aspect-[4/3] rounded-lg overflow-hidden border border-slate-700 bg-slate-950 select-none">
            <img
              src={resolveAssetPath(
                '/src/assets/images/minigame_f4_fake_chronometer_1795445497378.jpg'
              )}
              alt="Asservaten-Chronometer Detailansicht"
              className="w-full h-full object-cover"
            />
            {CHRONOMETER_FLAWS.map((flaw) => {
              const isChecked = checkedIds.includes(flaw.id);
              const isSelected = selectedFlawId === flaw.id;
              return (
                <button
                  key={flaw.id}
                  type="button"
                  aria-label={flaw.spotLabel}
                  onClick={() => handleInspectSpot(flaw)}
                  style={{
                    left: `${flaw.x}%`,
                    top: `${flaw.y}%`,
                    width: `${flaw.w}%`,
                    height: `${flaw.h}%`,
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-lg transition-all cursor-pointer flex items-center justify-center ${
                    isChecked
                      ? 'bg-red-500/20 border-2 border-red-400 shadow-[0_0_16px_rgba(248,113,113,0.55)]'
                      : isSelected
                        ? 'bg-amber-400/25 border-2 border-amber-300'
                        : 'bg-amber-400/10 border-2 border-dashed border-amber-300/70 hover:bg-amber-400/25'
                  }`}
                >
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold shadow ${
                      isChecked
                        ? 'bg-red-600 text-white'
                        : 'bg-slate-950/90 text-amber-200 border border-amber-400/50'
                    }`}
                  >
                    {isChecked ? flaw.verdictBadge : flaw.spotLabel}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right: 3 Fleet Chronicle Specs Comparison */}
          <div className="md:col-span-5 space-y-2">
            {CHRONOMETER_FLAWS.map((flaw) => {
              const isChecked = checkedIds.includes(flaw.id);
              return (
                <div
                  key={flaw.id}
                  className={`rounded-lg border p-2.5 space-y-1 transition-colors ${
                    isChecked
                      ? 'bg-red-950/35 border-red-500/60'
                      : 'bg-slate-950/80 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-amber-300">
                      {flaw.bookFeatureTitle}
                    </span>
                    {isChecked ? (
                      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                    ) : (
                      <Eye className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Soll: {flaw.bookRule}
                  </p>
                  {isChecked && (
                    <p className="text-[11px] text-red-200 font-semibold leading-snug pt-1 border-t border-red-500/25">
                      Ist: {flaw.actualFinding}
                    </p>
                  )}
                </div>
              );
            })}

            <button
              type="button"
              disabled={checkedIds.length < CHRONOMETER_FLAWS.length || confirmedFake}
              onClick={handleConfirmFake}
              className="w-full mt-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>
                {checkedIds.length < CHRONOMETER_FLAWS.length
                  ? `Erst alle 3 Merkmale prüfen (${checkedIds.length}/3)`
                  : confirmedFake
                    ? 'Fälschung bestätigt!'
                    : 'Befund verkünden: Das ist eine Fälschung!'}
              </span>
            </button>
          </div>
        </div>

        <div
          className={`text-xs rounded-lg px-3 py-2 border ${
            confirmedFake
              ? 'bg-red-500/20 border-red-400 text-red-100 font-bold'
              : 'bg-slate-950/80 border-slate-800 text-slate-200'
          }`}
        >
          {feedback}
        </div>
      </div>
    </div>
  );
}
