import { useEffect, useMemo, useRef, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Compass,
  Hand,
  KeyRound,
  RotateCcw,
  RotateCw,
  Ship,
  Snowflake,
  UserCheck,
  X,
} from 'lucide-react';
import type { MiniGameId } from '../types/game';
import { soundFx } from '../utils/soundFx';

interface Case2MiniGameProps {
  miniGameId: MiniGameId;
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

interface RadarWaypoint {
  time: string;
  distanceNm: number;
  zoneLabel: string;
  isGreekWaters: boolean;
  xPct: number;
  note: string;
}

const WAYPOINTS: RadarWaypoint[] = [
  {
    time: '01:00 Uhr',
    distanceNm: 55,
    zoneLabel: 'Internationale Gewässer',
    isGreekWaters: false,
    xPct: 12,
    note: 'Offene Ägäis · weit außerhalb jeder Küstenhoheit',
  },
  {
    time: '02:15 Uhr',
    distanceNm: 42,
    zoneLabel: 'Internationale Gewässer',
    isGreekWaters: false,
    xPct: 30,
    note: '42 Seemeilen vor Kreta · noch auf hoher See',
  },
  {
    time: '04:00 Uhr',
    distanceNm: 25,
    zoneLabel: 'Internationale Gewässer',
    isGreekWaters: false,
    xPct: 49,
    note: 'Annäherung an Nord-Kreta · noch außerhalb der 12-sm-Zone',
  },
  {
    time: '05:45 Uhr',
    distanceNm: 12,
    zoneLabel: '12-Meilen-Grenze · Kreta',
    isGreekWaters: true,
    xPct: 68,
    note: 'Exakter Eintritt in griechische Hoheitsgewässer!',
  },
  {
    time: '07:30 Uhr',
    distanceNm: 2,
    zoneLabel: 'Griechisches Hafengebiet',
    isGreekWaters: true,
    xPct: 83,
    note: 'Küstennähe vor Heraklion (Dr. Vances geschätzte Uhrzeit)',
  },
  {
    time: '08:15 Uhr',
    distanceNm: 0,
    zoneLabel: 'Hafen von Heraklion (Kai)',
    isGreekWaters: true,
    xPct: 92,
    note: 'MS Aurora fest vertäut · Hafenpolizei geht an Bord',
  },
];

function SeaChartMiniGame({
  onComplete,
  onCancel,
}: {
  onComplete: () => void;
  onCancel: () => void;
}) {
  const [selectedIdx, setSelectedIdx] = useState(5);
  const [step, setStep] = useState<'find_border' | 'check_0215' | 'done'>('find_border');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const wp = WAYPOINTS[selectedIdx];

  const handleConfirm = () => {
    setErrorMsg(null);
    if (step === 'find_border') {
      if (wp.time === '05:45 Uhr') {
        soundFx.play('evidence_chime');
        setStep('check_0215');
      } else {
        soundFx.play('penalty');
        setErrorMsg(
          `Bei ${wp.time} betrug der Abstand ${wp.distanceNm} sm. Suche exakt die 12-Seemeilen-Grenze!`
        );
      }
      return;
    }

    if (step === 'check_0215') {
      if (wp.time === '02:15 Uhr') {
        soundFx.play('deduction');
        setStep('done');
      } else {
        soundFx.play('penalty');
        setErrorMsg(
          'Wähle jetzt zum Abgleich die Position um 02:15 Uhr auf dem Radar-Kurs aus!'
        );
      }
    }
  };

  return (
    <div className="absolute inset-0 z-30 bg-slate-950/92 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-slate-900 border border-amber-500/40 rounded-xl p-5 shadow-2xl space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
              <Compass className="w-4 h-4" />
              <span>Brücken-Seekarte · Hoheitsgrenze vor Kreta</span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {step === 'find_border'
                ? 'Schritt 1/2: Bewege den Schiffskurs auf die exakte Uhrzeit, zu der die MS Aurora die griechische 12-Meilen-Grenze erreicht hat.'
                : step === 'check_0215'
                  ? 'Schritt 2/2: Prüfe jetzt zum Vergleich die Schiffsposition um 02:15 Uhr nachts!'
                  : 'Kursabgleich vollständig! Beide Zeitpunkte sind im Brücken-Logbuch markiert.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Seekarte schließen"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Radar / Sea Chart Canvas */}
        <div className="relative h-44 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden px-4 py-3">
          {/* Sea vs Greek Zone shading */}
          <div className="absolute inset-y-0 left-0 w-[68%] bg-blue-950/25" />
          <div className="absolute inset-y-0 right-0 w-[32%] bg-emerald-950/30 border-l-2 border-dashed border-amber-400/70" />

          <div className="relative z-10 flex justify-between text-[10px] font-semibold uppercase tracking-wider">
            <span className="text-sky-300">Internationale Gewässer (&gt; 12 sm)</span>
            <span className="text-emerald-300">12-sm-Zone · Kreta</span>
          </div>

          {/* Course Track */}
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-slate-700" />

          {/* Waypoint dots */}
          {WAYPOINTS.map((point, idx) => (
            <button
              key={point.time}
              type="button"
              onClick={() => {
                soundFx.play('blip');
                setSelectedIdx(idx);
                setErrorMsg(null);
              }}
              style={{ left: `${point.xPct}%` }}
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer"
            >
              <span
                className={`w-4 h-4 rounded-full border-2 transition-transform ${
                  selectedIdx === idx
                    ? 'bg-amber-400 border-slate-950 scale-125 shadow-lg shadow-amber-500/40'
                    : 'bg-slate-800 border-slate-400 group-hover:border-amber-300'
                }`}
              />
              <span
                className={`mt-2 text-[10px] font-mono-num whitespace-nowrap ${
                  selectedIdx === idx ? 'text-amber-300 font-bold' : 'text-slate-400'
                }`}
              >
                {point.time.replace(' Uhr', '')}
              </span>
            </button>
          ))}

          {/* Moving Ship Indicator */}
          <div
            style={{ left: `${wp.xPct}%` }}
            className="absolute top-9 -translate-x-1/2 transition-all duration-200 pointer-events-none"
          >
            <div className="px-2 py-1 rounded-md bg-amber-500 text-slate-950 flex items-center gap-1 shadow-md">
              <Ship className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold">{wp.distanceNm} sm</span>
            </div>
          </div>
        </div>

        {/* Live Telemetry Readout */}
        <div className="grid grid-cols-3 gap-2 bg-slate-950/70 border border-slate-800 rounded-lg p-3 text-xs">
          <div>
            <div className="text-slate-400 text-[11px]">Radar-Zeit</div>
            <div className="font-bold text-slate-100 mt-0.5">{wp.time}</div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px]">Abstand zu Kreta</div>
            <div className="font-mono-num font-bold text-amber-300 mt-0.5">
              {wp.distanceNm} Seemeilen
            </div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px]">Hoheitsgebiet</div>
            <div
              className={`font-semibold mt-0.5 ${
                wp.isGreekWaters ? 'text-emerald-300' : 'text-sky-300'
              }`}
            >
              {wp.zoneLabel}
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="text-xs text-red-300 bg-red-950/40 border border-red-700/50 rounded-lg px-3 py-2">
            {errorMsg}
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] text-slate-400">{wp.note}</span>
          {step === 'done' ? (
            <button
              type="button"
              onClick={onComplete}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              Brücken-Log sichern
            </button>
          ) : (
            <button
              type="button"
              onClick={handleConfirm}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              {step === 'find_border' ? 'Grenze bestätigen' : '02:15-Position prüfen'}
            </button>
          )}
        </div>
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

export function Case2MiniGame({
  miniGameId,
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
  return (
    <SeaChartMiniGame
      onComplete={() => onComplete('sea_chart')}
      onCancel={onCancel}
    />
  );
}
