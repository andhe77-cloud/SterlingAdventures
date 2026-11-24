import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  Clock,
  Compass,
  Hand,
  KeyRound,
  RotateCcw,
  RotateCw,
  Ship,
  Snowflake,
  Undo2,
  UserCheck,
  Users,
  X,
  Zap,
} from 'lucide-react';
import type { MiniGameId } from '../types/game';
import { soundFx } from '../utils/soundFx';
import {
  AlibiRouteMapMiniGame,
  DutyRosterPuzzleMiniGame,
  FundbueroLogMiniGame,
  KidsDressupMiniGame,
  KowalskiBooksHiddenMiniGame,
  ShipPlanMiniGame,
  VipPhotoSearchMiniGame,
  VipSokobanMiniGame,
} from './Case3MiniGames';
import {
  ChronometerCompareMiniGame,
  LetterForensicsMiniGame,
  LibraryBooksHiddenMiniGame,
} from './Case4MiniGames';

interface Case2MiniGameProps {
  miniGameId: MiniGameId;
  flags?: Record<string, boolean>;
  onComplete: (miniGameId: MiniGameId) => void;
  onCancel: () => void;
}

type PipeShape = 'source' | 'sink' | 'straight' | 'corner';
// Directions: 0 = North, 1 = East, 2 = South, 3 = West
interface PipeTile {
  row: number;
  col: number;
  shape: PipeShape;
  rot: number; // 0..3 clockwise 90deg steps
  locked?: boolean;
  isValve?: boolean;
}

const INITIAL_PIPE_GRID: PipeTile[] = [
  { row: 0, col: 0, shape: 'source', rot: 0, locked: true },
  { row: 0, col: 1, shape: 'straight', rot: 1 }, // solve: 0 or 2 (W-E)
  { row: 0, col: 2, shape: 'corner', rot: 3 }, // solve: 1 (W-S)
  { row: 0, col: 3, shape: 'corner', rot: 2 },

  { row: 1, col: 0, shape: 'corner', rot: 0 },
  { row: 1, col: 1, shape: 'corner', rot: 2 }, // solve: 0 (E-S)
  { row: 1, col: 2, shape: 'corner', rot: 0, isValve: true }, // solve: 2 (N-W)
  { row: 1, col: 3, shape: 'straight', rot: 0 },

  { row: 2, col: 0, shape: 'straight', rot: 1 },
  { row: 2, col: 1, shape: 'straight', rot: 0 }, // solve: 1 or 3 (N-S)
  { row: 2, col: 2, shape: 'corner', rot: 1 },
  { row: 2, col: 3, shape: 'corner', rot: 3 },

  { row: 3, col: 0, shape: 'corner', rot: 1 },
  { row: 3, col: 1, shape: 'corner', rot: 1 }, // solve: 3 (N-E)
  { row: 3, col: 2, shape: 'straight', rot: 1 }, // solve: 0 or 2 (W-E)
  { row: 3, col: 3, shape: 'sink', rot: 0, locked: true },
];

function getOpenings(shape: PipeShape, rot: number): number[] {
  const base: Record<PipeShape, number[]> = {
    source: [1], // East
    sink: [3], // West
    straight: [1, 3], // W-E at rot 0
    corner: [1, 2], // E-S at rot 0
  };
  return base[shape].map((d) => (d + rot) % 4);
}

function PipeTileSvg({
  shape,
  rot,
  powered,
  isValve,
}: {
  shape: PipeShape;
  rot: number;
  powered: boolean;
  isValve?: boolean;
}) {
  const openings = getOpenings(shape, rot);
  const strokeColor = powered ? '#38bdf8' : '#64748b';
  const glowColor = powered ? '#7dd3fc' : '#475569';

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {openings.includes(0) && (
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="0"
          stroke={strokeColor}
          strokeWidth="18"
          strokeLinecap="butt"
        />
      )}
      {openings.includes(1) && (
        <line
          x1="50"
          y1="50"
          x2="100"
          y2="50"
          stroke={strokeColor}
          strokeWidth="18"
          strokeLinecap="butt"
        />
      )}
      {openings.includes(2) && (
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="100"
          stroke={strokeColor}
          strokeWidth="18"
          strokeLinecap="butt"
        />
      )}
      {openings.includes(3) && (
        <line
          x1="50"
          y1="50"
          x2="0"
          y2="50"
          stroke={strokeColor}
          strokeWidth="18"
          strokeLinecap="butt"
        />
      )}
      <circle
        cx="50"
        cy="50"
        r={shape === 'source' || shape === 'sink' ? 22 : 12}
        fill={isValve ? (powered ? '#f59e0b' : '#b45309') : glowColor}
        stroke="#0f172a"
        strokeWidth="3"
      />
      {isValve && (
        <circle cx="50" cy="50" r="6" fill="#0f172a" />
      )}
    </svg>
  );
}

function CoolingPipesMiniGame({
  onComplete,
  onCancel,
}: {
  onComplete: () => void;
  onCancel: () => void;
}) {
  const [tiles, setTiles] = useState<PipeTile[]>(() =>
    INITIAL_PIPE_GRID.map((t) => ({ ...t }))
  );
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const { poweredSet, isSolved } = useMemo(() => {
    const map = new Map<string, PipeTile>();
    for (const t of tiles) {
      map.set(`${t.row},${t.col}`, t);
    }

    const visited = new Set<string>(['0,0']);
    const queue: [number, number][] = [[0, 0]];
    const dr = [-1, 0, 1, 0];
    const dc = [0, 1, 0, -1];
    const opp = [2, 3, 0, 1];

    while (queue.length > 0) {
      const [r, c] = queue.shift()!;
      const cur = map.get(`${r},${c}`);
      if (!cur) continue;
      const curOpen = getOpenings(cur.shape, cur.rot);

      for (const dir of curOpen) {
        const nr = r + dr[dir];
        const nc = c + dc[dir];
        const key = `${nr},${nc}`;
        if (visited.has(key)) continue;
        const nb = map.get(key);
        if (!nb) continue;
        const nbOpen = getOpenings(nb.shape, nb.rot);
        if (nbOpen.includes(opp[dir])) {
          visited.add(key);
          queue.push([nr, nc]);
        }
      }
    }

    const solved = visited.has('3,3') && visited.has('1,2');
    return { poweredSet: visited, isSolved: solved };
  }, [tiles]);

  const finishPipes = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    onCompleteRef.current();
  };

  useEffect(() => {
    if (!isSolved) return;
    soundFx.play('deduction');
    const timer = window.setTimeout(() => {
      if (completedRef.current) return;
      completedRef.current = true;
      onCompleteRef.current();
    }, 700);
    return () => window.clearTimeout(timer);
  }, [isSolved]);

  const handleRotateTile = (index: number) => {
    const target = tiles[index];
    if (!target || target.locked || isSolved) return;
    soundFx.play('blip');
    setTiles((prev) =>
      prev.map((tile, i) =>
        i === index ? { ...tile, rot: (tile.rot + 1) % 4 } : tile
      )
    );
  };

  const valveReached = poweredSet.has('1,2');
  const sensorReached = poweredSet.has('3,3');

  return (
    <div className="absolute inset-0 z-30 bg-slate-950/92 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-slate-900 border border-sky-500/40 rounded-xl p-5 shadow-2xl space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-300">
              <Snowflake className="w-4 h-4" />
              <span>Kühlrohr-Diagnose · Zelle 08</span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Drehe die Rohrstücke per Klick, um das <strong>Kühl-Aggregat</strong> über das{' '}
              <span className="text-amber-300 font-semibold">Regel-Ventil</span> bis zum{' '}
              <strong>Zellen-Sensor</strong> durchzuleiten und das Protokoll auszulesen.
            </p>
          </div>
          <button
            type="button"
            onClick={isSolved ? finishPipes : onCancel}
            aria-label="Diagnose schließen"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div
            className={`px-3 py-1.5 rounded-lg border flex items-center justify-between ${
              valveReached
                ? 'bg-amber-950/40 border-amber-400/50 text-amber-200'
                : 'bg-slate-950/70 border-slate-800 text-slate-400'
            }`}
          >
            <span>Regel-Ventil</span>
            <span className="font-bold">{valveReached ? 'Verbunden' : 'Offen'}</span>
          </div>
          <div
            className={`px-3 py-1.5 rounded-lg border flex items-center justify-between ${
              sensorReached
                ? 'bg-sky-950/50 border-sky-400/60 text-sky-200'
                : 'bg-slate-950/70 border-slate-800 text-slate-400'
            }`}
          >
            <span>Sensor Zelle 08</span>
            <span className="font-bold">{sensorReached ? 'Verbunden' : 'Offen'}</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 max-w-[300px] mx-auto bg-slate-950 p-3 rounded-xl border border-slate-800">
          {tiles.map((tile, idx) => {
            const key = `${tile.row},${tile.col}`;
            const powered = poweredSet.has(key);
            return (
              <button
                key={key}
                type="button"
                disabled={tile.locked || isSolved}
                onClick={() => handleRotateTile(idx)}
                title={
                  tile.shape === 'source'
                    ? 'Haupt-Kühler'
                    : tile.shape === 'sink'
                      ? 'Zelle 08 Sensor'
                      : tile.isValve
                        ? 'Manipuliertes Regel-Ventil (klicken zum Drehen)'
                        : 'Rohr drehen'
                }
                className={`relative aspect-square rounded-lg border transition-all flex items-center justify-center ${
                  tile.locked
                    ? 'bg-slate-900 border-sky-500/50 cursor-default'
                    : isSolved
                      ? 'bg-slate-900 border-sky-400/60 cursor-default'
                      : 'bg-slate-900/90 hover:bg-slate-800 border-slate-700 hover:border-sky-400 cursor-pointer'
                }`}
              >
                <PipeTileSvg
                  shape={tile.shape}
                  rot={tile.rot}
                  powered={powered}
                  isValve={tile.isValve}
                />
                {tile.shape === 'source' && (
                  <span className="absolute bottom-0.5 left-1 text-[9px] font-bold text-sky-300">
                    KÜHL
                  </span>
                )}
                {tile.shape === 'sink' && (
                  <span className="absolute bottom-0.5 right-1 text-[9px] font-bold text-sky-300">
                    Z08
                  </span>
                )}
                {tile.isValve && (
                  <span className="absolute top-0.5 left-1 text-[8px] font-bold text-amber-300">
                    REGLER
                  </span>
                )}
                {!tile.locked && !isSolved && (
                  <RotateCw className="w-2.5 h-2.5 text-slate-500 absolute bottom-1 right-1 pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>

        {isSolved ? (
          <div className="bg-emerald-950/50 border border-emerald-500/50 rounded-lg p-3 text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>VOLLTREFFER! Temperatur-Protokoll Zelle 08 ausgelesen!</span>
            </div>
            <button
              type="button"
              onClick={finishPipes}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Weiter
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <button
              type="button"
              onClick={() => setTiles(INITIAL_PIPE_GRID.map((t) => ({ ...t })))}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Zurücksetzen</span>
            </button>
            <span>Tipp: Leite den Fluss oben über das gelbe Ventil!</span>
          </div>
        )}
      </div>
    </div>
  );
}

interface PositionQuizOption {
  id: string;
  label: string;
  correct?: boolean;
  feedback?: string;
}

interface PositionQuizStep {
  id: 'pos_0730' | 'pos_0600' | 'pos_0210' | 'whats_different' | 'conclusion';
  badge: string;
  question: string;
  greekPrompt: string;
  mayaPrompt: string;
  greekSuccess: string;
  mayaSuccess: string;
  options: PositionQuizOption[];
}

const POSITION_QUIZ_STEPS: PositionQuizStep[] = [
  {
    id: 'pos_0730',
    badge: '1. 07:30 Uhr',
    question: 'Wo war die MS Aurora um 07:30 Uhr (Dr. Vances offizieller Todeszeitpunkt)?',
    greekPrompt:
      '«07:30 Uhr… Ο γιατρός έγραψε 07:30! Πού ήταν το πλοίο μας στις 07:30 το πρωί;;»',
    mayaPrompt:
      'Dimitri deutet auf Dr. Vances Bericht. Wo befand sich die MS Aurora um 07:30 Uhr morgens?',
    greekSuccess: '«Σωστά! Στις 07:30 ήμασταν ήδη έξω από το λιμάνι του Ηρακλείου!»',
    mayaSuccess: 'Treffer! Um 07:30 Uhr waren wir schon direkt vor dem Hafen von Heraklion!',
    options: [
      {
        id: 'p0730_pir',
        label: 'Noch im Ausgangshafen von Piräus bei Athen',
        feedback: 'Aus Piräus ist die MS Aurora schon gestern ausgelaufen!',
      },
      {
        id: 'p0730_heraklion',
        label: 'In unmittelbarer Küstennähe vor der Hafeneinfahrt von Heraklion (ca. 2 sm vor Kreta)',
        correct: true,
      },
      {
        id: 'p0730_highsea',
        label: 'Mitten auf hoher See in internationalen Gewässern (über 40 sm entfernt)',
        feedback: 'Nein! Um 08:15 Uhr haben wir schon angelegt – um 07:30 Uhr war die Küste direkt voraus.',
      },
      {
        id: 'p0730_rhodes',
        label: 'Auf halber Strecke vor der Ostküste von Rhodos',
        feedback: 'Unser Kurs führte direkt nach Kreta, nicht nach Rhodos!',
      },
    ],
  },
  {
    id: 'pos_0600',
    badge: '2. 06:00 Uhr',
    question: 'Wo war die MS Aurora um 06:00 Uhr (Officer Brandts Schichtende & Fund)?',
    greekPrompt:
      '«Καλά, στις 07:30 φτάναμε! Και στις 06:00, όταν τελείωσε η βάρδια του Brandt;;»',
    mayaPrompt:
      'Jetzt fragt er nach 06:00 Uhr morgens: Wo lag das Schiff bei Officer Brandts Kontrollgang?',
    greekSuccess: '«Ναι! Στις 06:00 είχαμε ήδη περάσει το όριο των 12 μιλίων της Κρήτης!»',
    mayaSuccess: 'Richtig! Um 06:00 Uhr lag das Schiff schon innerhalb der griechischen 12-Meilen-Zone!',
    options: [
      {
        id: 'p0600_far',
        label: 'Noch über 50 Seemeilen weit draußen in internationalen Gewässern',
        feedback: 'Zu weit weg! Knapp zwei Stunden später lag das Schiff bereits fest am Kai von Heraklion.',
      },
      {
        id: 'p0600_docked',
        label: 'Bereits fest vertäut am Passagier-Kai von Heraklion',
        feedback: 'Angelegt hat die MS Aurora erst um 08:15 Uhr – um 06:00 Uhr fuhr sie noch auf Kreta zu.',
      },
      {
        id: 'p0600_12nm',
        label: 'Bereits innerhalb der griechischen 12-Meilen-Zone vor Kreta (ca. 10 sm)',
        correct: true,
      },
      {
        id: 'p0600_cyprus',
        label: 'Vor der Westküste von Zypern',
        feedback: 'Falscher Kurs – wir liefen von Norden auf Heraklion zu.',
      },
    ],
  },
  {
    id: 'pos_0210',
    badge: '3. 02:10 Uhr',
    question: 'Und wo war die MS Aurora um 02:10 Uhr nachts (wahrer Todeszeitpunkt)?',
    greekPrompt:
      '«Ωραία… και στις 02:10 τη νύχτα;; Πού βρισκόταν το πλοίο στις 02:10;;»',
    mayaPrompt:
      'Jetzt zum entscheidenden Zeitpunkt: Wo befand sich die MS Aurora mitten in der Nacht um 02:10 Uhr?',
    greekSuccess: '«ΤΙ;; 42 ναυτικά μίλια έξω από την Κρήτη;; Πέρα από τα 12 μίλια!!»',
    mayaSuccess: 'Genau! Um 02:10 Uhr lag das Schiff rund 42 Seemeilen vor Kreta auf offener See!',
    options: [
      {
        id: 'p0210_highsea',
        label: 'Weit draußen auf offener See (ca. 42 sm vor Kreta · außerhalb der 12-Meilen-Grenze)',
        correct: true,
      },
      {
        id: 'p0210_pilot',
        label: 'Direkt an der Lotsenstation vor Heraklion (ca. 3 sm vor Kreta)',
        feedback: 'Unmöglich – bis zur Ankunft am Morgen lagen noch sechs Stunden Fahrtzeit dazwischen!',
      },
      {
        id: 'p0210_inside',
        label: 'Bereits sicher innerhalb griechischer Hoheitsgewässer',
        feedback: 'Nein! In die 12-Meilen-Zone vor Kreta ist das Schiff erst kurz vor 06:00 Uhr eingefahren.',
      },
      {
        id: 'p0210_harbor',
        label: 'Schon am Anleger im Hafen von Heraklion',
        feedback: 'Mitten in der Nacht um 02:10 Uhr waren wir noch lange nicht im Hafen!',
      },
    ],
  },
  {
    id: 'whats_different',
    badge: '4. Was ist anders?',
    question: 'Was ist bei 02:10 Uhr im Vergleich zu 06:00 & 07:30 Uhr entscheidend anders?',
    greekPrompt:
      '«ΠΕΡΙΜΕΝΕ!! 07:30 Κρήτη… 06:00 Κρήτη… Μα στις 02:10;; Τι είναι διαφορετικό;;»',
    mayaPrompt:
      'Dimitri vergleicht die Uhrzeiten! Was ist um 02:10 Uhr gegenüber 06:00 und 07:30 Uhr anders?',
    greekSuccess: '«ΑΑΑ!! Στις 02:10 ΔΕΝ ήμασταν στην Ελλάδα – ήμασταν σε διεθνή ύδατα!!»',
    mayaSuccess: 'Er hat es begriffen! Um 02:10 Uhr waren es internationale Gewässer, ab 06:00 Uhr griechische!',
    options: [
      {
        id: 'diff_closer',
        label: 'Um 02:10 Uhr lag das Schiff näher am Hafen als um 07:30 Uhr',
        feedback: 'Umgekehrt! Im Laufe der Nacht hat sich das Schiff der Küste genähert.',
      },
      {
        id: 'diff_anchored',
        label: 'Zwischen 02:10 Uhr und 06:00 Uhr stand das Schiff komplett still auf dem Wasser',
        feedback: 'Dann hätten wir morgens niemals rechtzeitig Kreta erreicht.',
      },
      {
        id: 'diff_police',
        label: 'Um 02:10 Uhr war die Hafenpolizei von Heraklion bereits offiziell an Bord',
        feedback: 'Die Hafenpolizei kam erst beim Einlaufen in Heraklion an Bord!',
      },
      {
        id: 'diff_intl',
        label: 'Um 02:10 Uhr lag das Schiff noch in INTERNATIONALEN GEWÄSSERN statt in griechischen Hoheitsgewässern!',
        correct: true,
      },
    ],
  },
  {
    id: 'conclusion',
    badge: '5. Schlussfolgerung',
    question: 'Welche Schlussfolgerung ziehen Dimitri und du aus diesem Unterschied?',
    greekPrompt:
      '«ΔΙΕΘΝΗ ΥΔΑΤΑ στις 02:10!! Γιατί το έκρυψαν αυτό;; Ποιο είναι το συμπέρασμα;;»',
    mayaPrompt:
      'Letzter Schritt! Welche Schlussfolgerung ergibt sich jetzt für euch beide?',
    greekSuccess: '«ΚΑΤΑΛΑΒΑ ΤΑ ΠΑΝΤΑ!! Δεν μένει έτσι αυτό!!»',
    mayaSuccess: 'VOLLTREFFER!! Jetzt hat Kommissar Dimitri endlich begriffen, worum es geht!',
    options: [
      {
        id: 'conc_irrelevant',
        label: 'Der Todesort auf See spielt keine Rolle, Hauptsache das Schiff hat angelegt',
        feedback: 'Wenn es egal wäre, warum wurden dann Uhrzeit und Kühlung heimlich manipuliert?',
      },
      {
        id: 'conc_coverup',
        label: 'Der wahre Todeszeitpunkt lag in internationalen Gewässern – jemand hat ein starkes Interesse daran, dass der Tod erst vor Kreta stattfand!',
        correct: true,
      },
      {
        id: 'conc_brandt_mistake',
        label: 'Officer Brandt hat nur zufällig seine Uhr um fünf Stunden falsch abgelesen',
        feedback: 'Wachprotokoll, Kühl-Manipulation und Arztbericht passen für einen Zufall viel zu genau zusammen!',
      },
      {
        id: 'conc_return',
        label: 'Die MS Aurora muss ohne Befragung sofort alle Gäste von Bord lassen',
        feedback: 'Im Gegenteil – solange diese Verschleierung nicht geklärt ist, greift Dimitri erst recht durch!',
      },
    ],
  },
];

function SeaChartMiniGame({
  onComplete,
  onCancel,
}: {
  onComplete: () => void;
  onCancel: () => void;
}) {
  const [stepIdx, setStepIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    greek: string;
    maya: string;
    isError?: boolean;
  }>({
    greek: POSITION_QUIZ_STEPS[0].greekPrompt,
    maya: POSITION_QUIZ_STEPS[0].mayaPrompt,
  });

  const isDone = stepIdx >= POSITION_QUIZ_STEPS.length;
  const currentStep = POSITION_QUIZ_STEPS[Math.min(stepIdx, POSITION_QUIZ_STEPS.length - 1)];

  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const finishQuiz = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    onCompleteRef.current();
  };

  useEffect(() => {
    if (!isDone) return;
    soundFx.play('deduction');
    const timer = window.setTimeout(() => {
      if (completedRef.current) return;
      completedRef.current = true;
      onCompleteRef.current();
    }, 700);
    return () => window.clearTimeout(timer);
  }, [isDone]);

  const handleSelectOption = (option: PositionQuizOption) => {
    if (isDone) return;
    setSelectedOptionId(option.id);

    if (option.correct) {
      const nextIdx = stepIdx + 1;
      if (nextIdx >= POSITION_QUIZ_STEPS.length) {
        setFeedback({
          greek: currentStep.greekSuccess,
          maya: currentStep.mayaSuccess,
        });
        setStepIdx(nextIdx);
      } else {
        soundFx.play('evidence_chime');
        const nextStep = POSITION_QUIZ_STEPS[nextIdx];
        setStepIdx(nextIdx);
        setSelectedOptionId(null);
        setFeedback({
          greek: nextStep.greekPrompt,
          maya: `${currentStep.mayaSuccess} ${nextStep.mayaPrompt}`,
        });
      }
    } else {
      soundFx.play('penalty');
      setFeedback({
        greek: '«Όχι, όχι! Σκεφτείτε ξανά τις ώρες και τη θέση του πλοίου, κύριε Στέρλινγκ!»',
        maya:
          option.feedback ??
          'Das passt nicht zu den Uhrzeiten und Fahrtdaten aus unserem Fall.',
        isError: true,
      });
    }
  };

  return (
    <div className="absolute inset-0 z-30 bg-slate-950/92 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="max-w-xl w-full max-h-full overflow-y-auto bg-slate-900 border border-sky-500/40 rounded-xl p-4 sm:p-5 shadow-2xl space-y-3.5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-300">
              <Compass className="w-4 h-4" />
              <span>Positions-Abgleich mit Kommissar Dimitri</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {isDone
                ? 'Alle fünf Punkte geklärt!'
                : `Schritt ${stepIdx + 1}/${POSITION_QUIZ_STEPS.length} · Multiple-Choice-Deduction`}
            </p>
          </div>
          <button
            type="button"
            onClick={isDone ? finishQuiz : onCancel}
            aria-label="Abgleich schließen"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress Strip */}
        <div className="grid grid-cols-5 gap-1.5 text-[10px]">
          {POSITION_QUIZ_STEPS.map((s, idx) => {
            const done = idx < stepIdx || isDone;
            const active = idx === stepIdx && !isDone;
            return (
              <div
                key={s.id}
                className={`px-2 py-1.5 rounded-md border text-center font-semibold truncate ${
                  done
                    ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200'
                    : active
                      ? 'bg-sky-950/60 border-sky-400 text-sky-200'
                      : 'bg-slate-950/70 border-slate-800 text-slate-500'
                }`}
              >
                {s.badge}
              </div>
            );
          })}
        </div>

        {/* Dimitri & Maya Live Feedback Box */}
        <div
          className={`rounded-lg border p-3 space-y-1 text-xs ${
            feedback.isError
              ? 'bg-red-950/40 border-red-700/50'
              : 'bg-slate-950/80 border-slate-800'
          }`}
        >
          <div className="font-semibold text-sky-300">{feedback.greek}</div>
          <div className="text-[11px] text-amber-200/90">
            <span className="font-bold">Maya:</span> {feedback.maya}
          </div>
        </div>

        {!isDone ? (
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
              <Ship className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{currentStep.question}</span>
            </div>
            <div className="space-y-2">
              {currentStep.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectOption(opt)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                      isSelected && feedback.isError
                        ? 'bg-red-950/50 border-red-500 text-red-100'
                        : 'bg-slate-950/60 border-slate-800 hover:border-amber-400/70 hover:bg-slate-950 text-slate-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3 bg-emerald-950/60 border border-emerald-500/60 rounded-lg px-3.5 py-2.5 text-xs text-emerald-200">
            <div className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                VOLLTREFFER! Positions-Abgleich (07:30 · 06:00 · 02:10 Uhr) &amp; Schlussfolgerung bestätigt!
              </span>
            </div>
            <button
              type="button"
              onClick={finishQuiz}
              className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-md whitespace-nowrap cursor-pointer"
            >
              Weiter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const PANTOMIME_TIMES = [
  { id: '00:00', label: '00:00 Uhr', hint: 'Beginn der Nachtwache' },
  { id: '01:30', label: '01:30 Uhr', hint: 'Letzter Rundgang im Speisesaal' },
  { id: '02:10', label: '02:10 Uhr', hint: 'Lautes Geräusch im Lüftungsschacht' },
  { id: '03:15', label: '03:15 Uhr', hint: 'Kontrollgang auf dem Brückendeck' },
  { id: '05:45', label: '05:45 Uhr', hint: 'Kurswechsel vor der Küste' },
  { id: '06:00', label: '06:00 Uhr', hint: 'Schichtende & Meldung im Trakt' },
  { id: '07:30', label: '07:30 Uhr', hint: 'Eintrag im medizinischen Bogen' },
];

const TARGET_PEOPLE = [
  { id: 'dimitri', label: 'Auf Kommissar Dimitri zeigen' },
  { id: 'brandt', label: 'Auf Officer Brandt zeigen' },
  { id: 'maya', label: 'Auf Maya zeigen' },
  { id: 'vance', label: 'Richtung Krankenstation (Dr. Vance) deuten' },
  { id: 'captain', label: 'Nach oben zum Kapitän deuten' },
  { id: 'cell_door', label: 'Auf die Zellentür zeigen' },
];

const GESTURE_OPTIONS = [
  {
    id: 'sleep_mask',
    label: 'Die Hände ans Ohr legen und so tun, als hätte jemand tief und fest geschlafen',
  },
  {
    id: 'lie_crash',
    label:
      'Auf die Uhr tippen, einen stürzenden Stuhl nachahmen & mit dem Finger vor dem Mund signalisieren: „Er lügt!“',
  },
  {
    id: 'stethoscope',
    label: 'Ein imaginäres Stethoskop ansetzen und auf ein Dokument schreiben',
  },
  {
    id: 'salute',
    label: 'Stramm salutieren und grinsend deinen Anwaltsausweis hochhalten',
  },
  {
    id: 'radio_call',
    label: 'Ans Ohr fassen und einen eiligen Funkspruch an die Brücke nachspielen',
  },
  {
    id: 'coffee',
    label: 'Eine imaginäre Kaffeetasse heben und entspannt Richtung Hafen winken',
  },
];

const FINAL_COMMANDS = [
  {
    id: 'upstairs',
    label: 'Die Arme verschränken und nach oben Richtung Promenadendeck zeigen',
  },
  {
    id: 'arrest_brandt',
    label: 'Imaginäre Handschellen klicken lassen und Brandt in die Nachbarzelle winken',
  },
  {
    id: 'unlock_cell',
    label:
      'Energisch auf das Zellenschloss zeigen, einen unsichtbaren Schlüssel umdrehen & mit der Lupe ins Innere deuten!',
  },
  {
    id: 'fetch_doctor',
    label: 'Mit beiden Händen ein rotes Kreuz in die Luft zeichnen und zur Krankenstation rennen',
  },
  {
    id: 'seal_door',
    label: 'Breites Absperrband vor das Gitter kleben und die Tür extra fest verriegeln',
  },
  {
    id: 'espresso',
    label: 'Müde gähnen und eine kleine Espresso-Pause vorschlagen',
  },
];

function DimitriPantomimeMiniGame({
  onComplete,
  onCancel,
}: {
  onComplete: () => void;
  onCancel: () => void;
}) {
  const [step, setStep] = useState<'times' | 'person_gesture' | 'command' | 'done'>('times');
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [selectedGesture, setSelectedGesture] = useState<string | null>(null);
  const [selectedCommand, setSelectedCommand] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    greek: string;
    maya: string;
    isError?: boolean;
  }>({
    greek: '«Κύριε Στέρλινγκ! Δε μιλάω γερμανικά – δείξτε μου με το χέρι ποιες ώρες δεν ταιριάζουν!»',
    maya: 'Dimitri versteht kein Deutsch! Tippe exakt auf die drei Uhrzeiten aus deinen Ermittlungen, die sich gegenseitig entlarven.',
  });

  const toggleTime = (id: string) => {
    soundFx.play('blip');
    setSelectedTimes((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleConfirmTimes = () => {
    const hasAllThree =
      selectedTimes.length === 3 &&
      selectedTimes.includes('02:10') &&
      selectedTimes.includes('06:00') &&
      selectedTimes.includes('07:30');

    if (hasAllThree) {
      soundFx.play('evidence_chime');
      setStep('person_gesture');
      setFeedback({
        greek: '«Χμμ… 02:10, 06:00 και 07:30?! Και ποιος ακριβώς μας κρύβει την αλήθεια εδώ κάτω;;»',
        maya: 'Er hat die drei Uhrzeiten kapiert! Jetzt zeig ihm, WER sich darin verstrickt hat – und mach genau die passende Geste dazu!',
      });
    } else {
      soundFx.play('penalty');
      setFeedback({
        greek: '«Όχι, όχι! Αυτές οι ώρες δε μου λένε τίποτα! Κοιτάξτε ξανά τα χαρτιά σας!»',
        maya:
          selectedTimes.length !== 3
            ? 'Wähle genau drei Uhrzeiten aus – eine aus dem Arzt-Bericht, eine vom Schichtwechsel und eine von ganz oben!'
            : 'Diese Kombination passt noch nicht zusammen. Prüfe deine Notizen über die Gerichtsakte und das Nacht-Geräusch!',
        isError: true,
      });
    }
  };

  const handleConfirmPersonGesture = () => {
    if (!selectedPerson || !selectedGesture) {
      soundFx.play('penalty');
      setFeedback({
        greek: '«Δείξτε μου και το πρόσωπο ΚΑΙ τι συνέβη, κύριε Στέρλινγκ!»',
        maya: 'Wähle sowohl ein Ziel als auch eine Geste aus!',
        isError: true,
      });
      return;
    }

    if (selectedPerson === 'brandt' && selectedGesture === 'lie_crash') {
      soundFx.play('evidence_chime');
      setStep('command');
      setFeedback({
        greek: '«ΤΙ?! Ο αξιωματικός Brandt έλεγε ψέματα για τη νύχτα, ενώ ακούστηκε θόρυβος στις 02:10?! Τι θέλετε να διατάξω τώρα;;»',
        maya: 'Volltreffer! Dimitri blitzt Officer Brandt ganz schön finster an – welche Abschluss-Geste gibst du ihm als Befehl?',
      });
    } else {
      soundFx.play('penalty');
      setFeedback({
        greek:
          selectedPerson !== 'brandt'
            ? '«Αυτός; Όχι, ποιος κρατούσε τη βάρδια εδώ κάτω όλη τη νύχτα;;»'
            : '«Δεν καταλαβαίνω! Δείξτε μου ξεκάθαρα τι συνέβη με την καρέκλα και τα ψέματα!»',
        maya:
          selectedPerson !== 'brandt'
            ? 'Er versteht nicht, wen du meinst – wer hier im Raum steht für den Widerspruch in der Nachtwache gerade?'
            : 'Diese Geste trifft den Punkt noch nicht ganz. Wie zeigst du ohne Worte einen Stuhlkrach und eine Lüge?',
        isError: true,
      });
    }
  };

  const handleConfirmCommand = (commandId: string) => {
    setSelectedCommand(commandId);
    if (commandId === 'unlock_cell') {
      soundFx.play('deduction');
      setStep('done');
      setFeedback({
        greek: '«ΑΑΑ!! ΚΑΤΑΛΑΒΑ ΤΕΛΕΙΑ!! ΑΞΙΩΜΑΤΙΚΕ BRANDT – ΑΝΟΙΞΤΕ ΤΟ ΚΕΛΙ 08 ΑΜΕΣΩΣ!!»',
        maya: 'Geschafft!! Auch ohne ein einziges deutsches Wort hat Dimitri jedes Detail verstanden!',
      });
    } else {
      soundFx.play('penalty');
      const hintByCmd: Record<string, string> = {
        espresso: 'Dimitri ist zwar Grieche, aber für eine Kaffeepause ist jetzt wirklich der falsche Moment!',
        upstairs: 'Warum hoch aufs Deck? Unser Ziel liegt hier unten!',
        arrest_brandt: 'Für eine Festnahme ohne Beweis aus dem Inneren geht Dimitri nicht so weit!',
        fetch_doctor: 'Die Ärztin war heute früh schon hier – zuerst müssen wir selbst etwas überprüfen!',
        seal_door: 'Nein! Wenn die Tür noch fester zu ist, kommen wir gar nicht erst weiter!',
      };
      setFeedback({
        greek: '«Όχι, όχι! Γιατί να το κάνω αυτό;; Τι χρειάζεται να ελέγξουμε τώρα;;»',
        maya: hintByCmd[commandId] ?? 'Das missversteht er – was genau soll Dimitri Brandt sofort befehlen?',
        isError: true,
      });
    }
  };

  return (
    <div className="absolute inset-0 z-30 bg-slate-950/92 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="max-w-xl w-full max-h-full overflow-y-auto bg-slate-900 border border-sky-500/40 rounded-xl p-4 sm:p-5 shadow-2xl space-y-3.5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-300">
              <Hand className="w-4 h-4" />
              <span>Pantomime mit Kommissar Dimitri · Zelle 08</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {step === 'times'
                ? 'Schritt 1/3 · Uhrzeiten antippen'
                : step === 'person_gesture'
                  ? 'Schritt 2/3 · Person zeigen & Geste wählen'
                  : step === 'command'
                    ? 'Schritt 3/3 · Befehl ohne Worte geben'
                    : 'Verständigung geglückt!'}
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Pantomime schließen"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dimitri & Maya Live Feedback Box */}
        <div
          className={`rounded-lg border p-3 space-y-1 text-xs ${
            feedback.isError
              ? 'bg-red-950/40 border-red-700/50'
              : 'bg-slate-950/80 border-slate-800'
          }`}
        >
          <div className="font-semibold text-sky-300">{feedback.greek}</div>
          <div className="text-[11px] text-amber-200/90">
            <span className="font-bold">Maya:</span> {feedback.maya}
          </div>
        </div>

        {step === 'times' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PANTOMIME_TIMES.map((item) => {
                const active = selectedTimes.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleTime(item.id)}
                    className={`text-left p-2.5 rounded-lg border transition-colors cursor-pointer ${
                      active
                        ? 'bg-sky-950/70 border-sky-400 text-slate-50'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-600 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 font-mono-num text-xs font-bold text-amber-300">
                        <Clock className="w-3.5 h-3.5" />
                        {item.label}
                      </span>
                      {active && <CheckCircle2 className="w-3.5 h-3.5 text-sky-300 shrink-0" />}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">{item.hint}</div>
                  </button>
                );
              })}
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleConfirmTimes}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Auf diese Uhrzeiten zeigen ({selectedTimes.length}/3)
              </button>
            </div>
          </div>
        )}

        {step === 'person_gesture' && (
          <div className="space-y-3">
            <div>
              <div className="text-[11px] font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-sky-400" />
                <span>1. Auf wen zeigst du mit dem Finger?</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {TARGET_PEOPLE.map((person) => {
                  const active = selectedPerson === person.id;
                  return (
                    <button
                      key={person.id}
                      type="button"
                      onClick={() => {
                        soundFx.play('blip');
                        setSelectedPerson(person.id);
                      }}
                      className={`px-2.5 py-2 rounded-lg border text-[11px] font-semibold transition-colors cursor-pointer ${
                        active
                          ? 'bg-sky-950/70 border-sky-400 text-sky-100'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-600 text-slate-300'
                      }`}
                    >
                      {person.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Hand className="w-3.5 h-3.5 text-amber-400" />
                <span>2. Welche Geste machst du dazu?</span>
              </div>
              <div className="space-y-1.5">
                {GESTURE_OPTIONS.map((gesture) => {
                  const active = selectedGesture === gesture.id;
                  return (
                    <button
                      key={gesture.id}
                      type="button"
                      onClick={() => {
                        soundFx.play('blip');
                        setSelectedGesture(gesture.id);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg border text-xs transition-colors cursor-pointer ${
                        active
                          ? 'bg-amber-950/50 border-amber-400 text-amber-100'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-600 text-slate-300'
                      }`}
                    >
                      {gesture.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleConfirmPersonGesture}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Pantomime vorführen!
              </button>
            </div>
          </div>
        )}

        {step === 'command' && (
          <div className="space-y-2">
            <div className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Welche Abschluss-Geste gibst du Kommissar Dimitri?</span>
            </div>
            {FINAL_COMMANDS.map((cmd) => (
              <button
                key={cmd.id}
                type="button"
                onClick={() => handleConfirmCommand(cmd.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                  selectedCommand === cmd.id
                    ? 'bg-amber-950/50 border-amber-400 text-amber-100'
                    : 'bg-slate-950/60 border-slate-800 hover:border-amber-400/70 text-slate-200'
                }`}
              >
                {cmd.label}
              </button>
            ))}
          </div>
        )}

        {step === 'done' && (
          <div className="flex items-center justify-between bg-emerald-950/40 border border-emerald-500/40 rounded-lg p-3 gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Dimitri befiehlt Brandt auf der Stelle, Zelle 08 aufzuschließen!</span>
            </div>
            <button
              type="button"
              onClick={onComplete}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              Zelle öffnen lassen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

type KidTokenId = 'leo' | 'rick' | 'conrad';

interface SokobanPos {
  r: number;
  c: number;
}

interface SokobanSnapshot {
  player: SokobanPos;
  kids: Record<KidTokenId, SokobanPos>;
}

const SOKOBAN_ROWS = 7;
const SOKOBAN_COLS = 8;

// '#' = obstacle/railing, '.' = walk/play floor
const SOKOBAN_BOARD = [
  '########',
  '#...#..#',
  '#......#',
  '#..#...#',
  '#......#',
  '#......#',
  '########',
];

const SOKOBAN_TARGETS: SokobanPos[] = [
  { r: 2, c: 6 },
  { r: 3, c: 6 },
  { r: 4, c: 6 },
];

const INITIAL_SOKOBAN: SokobanSnapshot = {
  player: { r: 4, c: 2 },
  kids: {
    leo: { r: 2, c: 2 },
    rick: { r: 3, c: 4 },
    conrad: { r: 4, c: 4 },
  },
};

const KID_META: Record<
  KidTokenId,
  { short: string; name: string; colorClass: string }
> = {
  leo: {
    short: 'L',
    name: 'Leo',
    colorClass: 'bg-sky-500 border-sky-200 text-slate-950',
  },
  rick: {
    short: 'R',
    name: 'Rick',
    colorClass: 'bg-emerald-500 border-emerald-200 text-slate-950',
  },
  conrad: {
    short: 'C',
    name: 'Conrad',
    colorClass: 'bg-amber-400 border-amber-100 text-slate-950',
  },
};

function isSokobanWall(r: number, c: number): boolean {
  if (r < 0 || r >= SOKOBAN_ROWS || c < 0 || c >= SOKOBAN_COLS) return true;
  return SOKOBAN_BOARD[r][c] === '#';
}

function isTargetCell(r: number, c: number): boolean {
  return SOKOBAN_TARGETS.some((t) => t.r === r && t.c === c);
}

function KidsSokobanMiniGame({
  onComplete,
  onCancel,
}: {
  onComplete: () => void;
  onCancel: () => void;
}) {
  const [boardState, setBoardState] = useState<SokobanSnapshot>(() => ({
    player: { ...INITIAL_SOKOBAN.player },
    kids: {
      leo: { ...INITIAL_SOKOBAN.kids.leo },
      rick: { ...INITIAL_SOKOBAN.kids.rick },
      conrad: { ...INITIAL_SOKOBAN.kids.conrad },
    },
  }));
  const [history, setHistory] = useState<SokobanSnapshot[]>([]);
  const [statusMsg, setStatusMsg] = useState(
    'Hilf Maya! Schiebe Leo (L), Rick (R) und Conrad (C) in die drei grünen Spiel-Ecken rechts.'
  );

  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const kidsPlacedCount = (Object.keys(boardState.kids) as KidTokenId[]).filter((id) => {
    const pos = boardState.kids[id];
    return isTargetCell(pos.r, pos.c);
  }).length;

  const isSolved = kidsPlacedCount === SOKOBAN_TARGETS.length;

  const finishSokoban = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    onCompleteRef.current();
  };

  useEffect(() => {
    if (!isSolved) return;
    soundFx.play('deduction');
    const timer = window.setTimeout(() => {
      if (completedRef.current) return;
      completedRef.current = true;
      onCompleteRef.current();
    }, 700);
    return () => window.clearTimeout(timer);
  }, [isSolved]);

  const tryMove = (dr: number, dc: number) => {
    if (isSolved) return;
    const nr = boardState.player.r + dr;
    const nc = boardState.player.c + dc;
    if (isSokobanWall(nr, nc)) {
      soundFx.play('penalty');
      setStatusMsg('Da steht eine Liege oder Reling im Weg!');
      return;
    }

    const kidIds = Object.keys(boardState.kids) as KidTokenId[];
    const pushedKidId = kidIds.find(
      (id) => boardState.kids[id].r === nr && boardState.kids[id].c === nc
    );

    if (pushedKidId) {
      const br = nr + dr;
      const bc = nc + dc;
      const occupiedByOtherKid = kidIds.some(
        (id) => boardState.kids[id].r === br && boardState.kids[id].c === bc
      );
      if (isSokobanWall(br, bc) || occupiedByOtherKid) {
        soundFx.play('penalty');
        setStatusMsg(
          `${KID_META[pushedKidId].name} weicht aus – da hinter ist kein Platz zum Schieben!`
        );
        return;
      }

      soundFx.play('blip');
      setHistory((prev) => [
        ...prev,
        {
          player: { ...boardState.player },
          kids: {
            leo: { ...boardState.kids.leo },
            rick: { ...boardState.kids.rick },
            conrad: { ...boardState.kids.conrad },
          },
        },
      ]);
      setBoardState({
        player: { r: nr, c: nc },
        kids: {
          ...boardState.kids,
          [pushedKidId]: { r: br, c: bc },
        },
      });
      setStatusMsg(
        isTargetCell(br, bc)
          ? `Klasse! ${KID_META[pushedKidId].name} sitzt in seiner Spiel-Ecke!`
          : `Maya schiebt ${KID_META[pushedKidId].name} weiter Richtung Spielecke.`
      );
      return;
    }

    soundFx.play('blip');
    setHistory((prev) => [
      ...prev,
      {
        player: { ...boardState.player },
        kids: {
          leo: { ...boardState.kids.leo },
          rick: { ...boardState.kids.rick },
          conrad: { ...boardState.kids.conrad },
        },
      },
    ]);
    setBoardState((prev) => ({
      ...prev,
      player: { r: nr, c: nc },
    }));
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        tryMove(-1, 0);
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        tryMove(1, 0);
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        tryMove(0, -1);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        tryMove(0, 1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const handleUndo = () => {
    if (history.length === 0 || isSolved) return;
    const last = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setBoardState(last);
    soundFx.play('page_turn');
    setStatusMsg('Einen Schritt zurückgesetzt.');
  };

  const handleReset = () => {
    if (isSolved) return;
    setHistory([]);
    setBoardState({
      player: { ...INITIAL_SOKOBAN.player },
      kids: {
        leo: { ...INITIAL_SOKOBAN.kids.leo },
        rick: { ...INITIAL_SOKOBAN.kids.rick },
        conrad: { ...INITIAL_SOKOBAN.kids.conrad },
      },
    });
    soundFx.play('page_turn');
    setStatusMsg('Neuer Versuch! Denk dran: zuerst den unteren Gang frei machen.');
  };

  return (
    <div className="absolute inset-0 z-30 bg-slate-950/92 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="max-w-lg w-full max-h-full overflow-y-auto bg-slate-900 border border-amber-500/40 rounded-xl p-4 sm:p-5 shadow-2xl space-y-3.5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
              <Users className="w-4 h-4" />
              <span>Kinder-Einfangen (Sokoban) · Promenadendeck</span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Maya muss die drei Higginson-Jungs einsammeln, damit Andrew mit nach unten kommen
              kann! Steuere mit den Pfeilen oder <strong>WASD</strong>.
            </p>
          </div>
          <button
            type="button"
            onClick={isSolved ? finishSokoban : onCancel}
            aria-label="Minispiel schließen"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between gap-2 text-[11px] bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2">
          <span className="text-slate-200">{statusMsg}</span>
          <span className="font-mono-num font-bold text-emerald-300 whitespace-nowrap">
            {kidsPlacedCount}/3 Kids
          </span>
        </div>

        {/* 8x7 Sokoban Board */}
        <div className="bg-slate-950 p-2.5 sm:p-3 rounded-xl border border-slate-800 max-w-[360px] mx-auto">
          <div className="grid grid-cols-8 gap-1">
            {SOKOBAN_BOARD.map((rowStr, r) =>
              rowStr.split('').map((cell, c) => {
                const wall = cell === '#';
                const target = isTargetCell(r, c);
                const isPlayer = boardState.player.r === r && boardState.player.c === c;
                const kidId = (Object.keys(boardState.kids) as KidTokenId[]).find(
                  (id) => boardState.kids[id].r === r && boardState.kids[id].c === c
                );

                return (
                  <div
                    key={`${r}-${c}`}
                    className={`aspect-square rounded-md flex items-center justify-center text-xs font-bold select-none transition-colors ${
                      wall
                        ? 'bg-slate-800 border border-slate-700/80'
                        : target
                          ? 'bg-emerald-950/60 border border-dashed border-emerald-400/70'
                          : 'bg-slate-900/70 border border-slate-800/50'
                    }`}
                  >
                    {isPlayer && (
                      <div
                        title="Maya"
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-fuchsia-500 border-2 border-fuchsia-200 text-white flex items-center justify-center text-[11px] font-black shadow"
                      >
                        M
                      </div>
                    )}
                    {!isPlayer && kidId && (
                      <div
                        title={KID_META[kidId].name}
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg border-2 flex items-center justify-center text-[11px] font-black shadow ${
                          KID_META[kidId].colorClass
                        } ${target ? 'ring-2 ring-emerald-300' : ''}`}
                      >
                        {KID_META[kidId].short}
                      </div>
                    )}
                    {!isPlayer && !kidId && target && (
                      <span className="text-[9px] text-emerald-400/80 font-bold">ZIEL</span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {isSolved ? (
          <div className="bg-emerald-950/50 border border-emerald-500/50 rounded-lg p-3 text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>VOLLTREFFER! Alle drei Jungs sind beschäftigt – Maya holt Andrew!</span>
            </div>
            <button
              type="button"
              onClick={finishSokoban}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Weiter
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleUndo}
                disabled={history.length === 0}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs rounded-lg border border-slate-700 cursor-pointer"
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span>Zurück</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Neustart</span>
              </button>
            </div>

            {/* Compact D-Pad */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => tryMove(0, -1)}
                aria-label="Nach links"
                className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-100 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => tryMove(-1, 0)}
                  aria-label="Nach oben"
                  className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-100 cursor-pointer"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => tryMove(1, 0)}
                  aria-label="Nach unten"
                  className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-100 cursor-pointer"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => tryMove(0, 1)}
                aria-label="Nach rechts"
                className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-100 cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Circuit routing puzzle to intentionally crash the MS-400 magnetic lock controller
const INITIAL_CABLE_GRID: PipeTile[] = [
  { row: 0, col: 0, shape: 'source', rot: 0, locked: true }, // East [1]
  { row: 0, col: 1, shape: 'corner', rot: 3 }, // solve: 1 (S-W)
  { row: 0, col: 2, shape: 'straight', rot: 1 },
  { row: 0, col: 3, shape: 'corner', rot: 2 },

  { row: 1, col: 0, shape: 'corner', rot: 0 },
  { row: 1, col: 1, shape: 'straight', rot: 0 }, // solve: 1 or 3 (N-S)
  { row: 1, col: 2, shape: 'corner', rot: 1 },
  { row: 1, col: 3, shape: 'straight', rot: 0 },

  { row: 2, col: 0, shape: 'straight', rot: 1 },
  { row: 2, col: 1, shape: 'corner', rot: 1, isValve: true }, // solve: 3 (N-E)
  { row: 2, col: 2, shape: 'corner', rot: 2 }, // solve: 1 (S-W)
  { row: 2, col: 3, shape: 'corner', rot: 0 },

  { row: 3, col: 0, shape: 'corner', rot: 1 },
  { row: 3, col: 1, shape: 'straight', rot: 0 },
  { row: 3, col: 2, shape: 'corner', rot: 0 }, // solve: 3 (N-E)
  { row: 3, col: 3, shape: 'sink', rot: 0, locked: true }, // West [3]
];

function CableTileSvg({
  shape,
  rot,
  powered,
  isValve,
}: {
  shape: PipeShape;
  rot: number;
  powered: boolean;
  isValve?: boolean;
}) {
  const openings = getOpenings(shape, rot);
  const strokeColor = powered ? '#f59e0b' : '#64748b';
  const glowColor = powered ? '#fde68a' : '#475569';

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {openings.includes(0) && (
        <line x1="50" y1="50" x2="50" y2="0" stroke={strokeColor} strokeWidth="14" strokeLinecap="butt" />
      )}
      {openings.includes(1) && (
        <line x1="50" y1="50" x2="100" y2="50" stroke={strokeColor} strokeWidth="14" strokeLinecap="butt" />
      )}
      {openings.includes(2) && (
        <line x1="50" y1="50" x2="50" y2="100" stroke={strokeColor} strokeWidth="14" strokeLinecap="butt" />
      )}
      {openings.includes(3) && (
        <line x1="50" y1="50" x2="0" y2="50" stroke={strokeColor} strokeWidth="14" strokeLinecap="butt" />
      )}
      <circle
        cx="50"
        cy="50"
        r={shape === 'source' || shape === 'sink' ? 22 : 11}
        fill={isValve ? (powered ? '#ef4444' : '#991b1b') : glowColor}
        stroke="#0f172a"
        strokeWidth="3"
      />
      {isValve && <circle cx="50" cy="50" r="5" fill="#fef2f2" />}
    </svg>
  );
}

function LockCablesMiniGame({
  onComplete,
  onCancel,
}: {
  onComplete: () => void;
  onCancel: () => void;
}) {
  const [tiles, setTiles] = useState<PipeTile[]>(() =>
    INITIAL_CABLE_GRID.map((t) => ({ ...t }))
  );
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const { poweredSet, isSolved } = useMemo(() => {
    const map = new Map<string, PipeTile>();
    for (const t of tiles) {
      map.set(`${t.row},${t.col}`, t);
    }

    const visited = new Set<string>(['0,0']);
    const queue: [number, number][] = [[0, 0]];
    const dr = [-1, 0, 1, 0];
    const dc = [0, 1, 0, -1];
    const opp = [2, 3, 0, 1];

    while (queue.length > 0) {
      const [r, c] = queue.shift()!;
      const cur = map.get(`${r},${c}`);
      if (!cur) continue;
      const curOpen = getOpenings(cur.shape, cur.rot);

      for (const dir of curOpen) {
        const nr = r + dr[dir];
        const nc = c + dc[dir];
        const key = `${nr},${nc}`;
        if (visited.has(key)) continue;
        const nb = map.get(key);
        if (!nb) continue;
        const nbOpen = getOpenings(nb.shape, nb.rot);
        if (nbOpen.includes(opp[dir])) {
          visited.add(key);
          queue.push([nr, nc]);
        }
      }
    }

    const solved = visited.has('3,3') && visited.has('2,1');
    return { poweredSet: visited, isSolved: solved };
  }, [tiles]);

  const finishCables = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    onCompleteRef.current();
  };

  useEffect(() => {
    if (!isSolved) return;
    soundFx.play('deduction');
    const timer = window.setTimeout(() => {
      if (completedRef.current) return;
      completedRef.current = true;
      onCompleteRef.current();
    }, 700);
    return () => window.clearTimeout(timer);
  }, [isSolved]);

  const handleRotateTile = (index: number) => {
    const target = tiles[index];
    if (!target || target.locked || isSolved) return;
    soundFx.play('blip');
    setTiles((prev) =>
      prev.map((tile, i) =>
        i === index ? { ...tile, rot: (tile.rot + 1) % 4 } : tile
      )
    );
  };

  const capacitorReached = poweredSet.has('2,1');
  const lockReached = poweredSet.has('3,3');

  return (
    <div className="absolute inset-0 z-30 bg-slate-950/92 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-slate-900 border border-amber-500/40 rounded-xl p-5 shadow-2xl space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
              <Zap className="w-4 h-4" />
              <span>Schloss-Überbrückung · MS-400 Controller</span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Hilf Andrew (der ja angeblich „keine Ahnung hat“) beim Test: Verbinde die{' '}
              <strong>Bus-Platine</strong> über den{' '}
              <span className="text-red-300 font-semibold">Überlast-Puffer</span> mit dem{' '}
              <strong>Magnetschloss</strong>!
            </p>
          </div>
          <button
            type="button"
            onClick={isSolved ? finishCables : onCancel}
            aria-label="Schaltkreis schließen"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div
            className={`px-3 py-1.5 rounded-lg border flex items-center justify-between ${
              capacitorReached
                ? 'bg-red-950/40 border-red-400/50 text-red-200'
                : 'bg-slate-950/70 border-slate-800 text-slate-400'
            }`}
          >
            <span>Überlast-Puffer</span>
            <span className="font-bold">{capacitorReached ? 'Aktiv' : 'Offen'}</span>
          </div>
          <div
            className={`px-3 py-1.5 rounded-lg border flex items-center justify-between ${
              lockReached
                ? 'bg-amber-950/50 border-amber-400/60 text-amber-200'
                : 'bg-slate-950/70 border-slate-800 text-slate-400'
            }`}
          >
            <span>Magnetschloss MS-400</span>
            <span className="font-bold">{lockReached ? 'Abgestürzt!' : 'Gesichert'}</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 max-w-[300px] mx-auto bg-slate-950 p-3 rounded-xl border border-slate-800">
          {tiles.map((tile, idx) => {
            const key = `${tile.row},${tile.col}`;
            const powered = poweredSet.has(key);
            return (
              <button
                key={key}
                type="button"
                disabled={tile.locked || isSolved}
                onClick={() => handleRotateTile(idx)}
                className={`relative aspect-square rounded-lg border transition-all flex items-center justify-center ${
                  tile.locked
                    ? 'bg-slate-900 border-amber-500/50 cursor-default'
                    : isSolved
                      ? 'bg-slate-900 border-emerald-400/60 cursor-default'
                      : 'bg-slate-900/90 hover:bg-slate-800 border-slate-700 hover:border-amber-400 cursor-pointer'
                }`}
              >
                <CableTileSvg
                  shape={tile.shape}
                  rot={tile.rot}
                  powered={powered}
                  isValve={tile.isValve}
                />
                {tile.shape === 'source' && (
                  <span className="absolute bottom-0.5 left-1 text-[9px] font-bold text-amber-300">
                    BUS
                  </span>
                )}
                {tile.shape === 'sink' && (
                  <span className="absolute bottom-0.5 right-1 text-[9px] font-bold text-amber-300">
                    LOCK
                  </span>
                )}
                {tile.isValve && (
                  <span className="absolute top-0.5 left-1 text-[8px] font-bold text-red-300">
                    CRASH
                  </span>
                )}
                {!tile.locked && !isSolved && (
                  <RotateCw className="w-2.5 h-2.5 text-slate-500 absolute bottom-1 right-1 pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>

        {isSolved ? (
          <div className="bg-emerald-950/50 border border-emerald-500/50 rounded-lg p-3 text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>VOLLTREFFER! Controller stürzt ab – 15 Minuten ohne Tür-Log!!</span>
            </div>
            <button
              type="button"
              onClick={finishCables}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Weiter
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <button
              type="button"
              onClick={() => setTiles(INITIAL_CABLE_GRID.map((t) => ({ ...t })))}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Zurücksetzen</span>
            </button>
            <span>Tipp: Leite den Strom links über den roten CRASH-Knoten!</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function Case2MiniGame({
  miniGameId,
  flags,
  onComplete,
  onCancel,
}: Case2MiniGameProps) {
  if (miniGameId === 'dimitri_pantomime') {
    return (
      <DimitriPantomimeMiniGame
        onComplete={() => onComplete('dimitri_pantomime')}
        onCancel={onCancel}
      />
    );
  }
  if (miniGameId === 'cooling_pipes') {
    return (
      <CoolingPipesMiniGame
        onComplete={() => onComplete('cooling_pipes')}
        onCancel={onCancel}
      />
    );
  }
  if (miniGameId === 'kids_sokoban') {
    return (
      <KidsSokobanMiniGame
        onComplete={() => onComplete('kids_sokoban')}
        onCancel={onCancel}
      />
    );
  }
  if (miniGameId === 'lock_cables') {
    return (
      <LockCablesMiniGame
        onComplete={() => onComplete('lock_cables')}
        onCancel={onCancel}
      />
    );
  }
  if (miniGameId === 'kids_dressup') {
    return (
      <KidsDressupMiniGame
        onComplete={() => onComplete('kids_dressup')}
        onCancel={onCancel}
      />
    );
  }
  if (miniGameId === 'ship_plan') {
    return (
      <ShipPlanMiniGame
        flags={flags}
        onComplete={() => onComplete('ship_plan')}
        onCancel={onCancel}
      />
    );
  }
  if (miniGameId === 'vip_sokoban') {
    return (
      <VipSokobanMiniGame
        onComplete={() => onComplete('vip_sokoban')}
        onCancel={onCancel}
      />
    );
  }
  if (miniGameId === 'vip_photo_search') {
    return (
      <VipPhotoSearchMiniGame
        onComplete={() => onComplete('vip_photo_search')}
        onCancel={onCancel}
      />
    );
  }
  if (miniGameId === 'fundbuero_log') {
    return (
      <FundbueroLogMiniGame
        onComplete={() => onComplete('fundbuero_log')}
        onCancel={onCancel}
      />
    );
  }
  if (miniGameId === 'duty_roster_puzzle') {
    return (
      <DutyRosterPuzzleMiniGame
        onComplete={() => onComplete('duty_roster_puzzle')}
        onCancel={onCancel}
      />
    );
  }
  if (miniGameId === 'alibi_route_map') {
    return (
      <AlibiRouteMapMiniGame
        onComplete={() => onComplete('alibi_route_map')}
        onCancel={onCancel}
      />
    );
  }
  if (miniGameId === 'kowalski_books_hidden') {
    return (
      <KowalskiBooksHiddenMiniGame
        onComplete={() => onComplete('kowalski_books_hidden')}
        onCancel={onCancel}
      />
    );
  }
  if (miniGameId === 'letter_forensics') {
    return (
      <LetterForensicsMiniGame
        onComplete={() => onComplete('letter_forensics')}
        onCancel={onCancel}
      />
    );
  }
  if (miniGameId === 'library_books_hidden') {
    return (
      <LibraryBooksHiddenMiniGame
        onComplete={() => onComplete('library_books_hidden')}
        onCancel={onCancel}
      />
    );
  }
  if (miniGameId === 'chronometer_compare') {
    return (
      <ChronometerCompareMiniGame
        onComplete={() => onComplete('chronometer_compare')}
        onCancel={onCancel}
      />
    );
  }
  return (
    <SeaChartMiniGame
      onComplete={() => onComplete('sea_chart')}
      onCancel={onCancel}
    />
  );
}
