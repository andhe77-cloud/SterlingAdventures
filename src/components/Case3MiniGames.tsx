import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Backpack,
  BookOpen,
  CheckCircle2,
  Compass,
  FileText,
  RotateCcw,
  Shirt,
  Sparkles,
  X,
} from 'lucide-react';
import { soundFx } from '../utils/soundFx';

// =============================================================================
// MINISPIEL 1 (FALL 3.1): ANZIEH- & SACHEN-SUCH-CHAOS BEI DEN HIGGINSON-JUNGS
// =============================================================================

type BoyId = 'leo' | 'rick' | 'conrad';
type DressCategory = 'shirt' | 'item' | 'trait';

interface DressOption {
  id: string;
  label: string;
  detail: string;
  category: DressCategory;
  correctBoy: BoyId | null; // null = distractor
  wrongHint: string;
}

const BOYS: { id: BoyId; name: string; subtitle: string; accent: string }[] = [
  {
    id: 'leo',
    name: 'Leo',
    subtitle: 'Ältester Bruder · Streich-Anführer',
    accent: 'border-emerald-500/60 bg-emerald-950/30 text-emerald-200',
  },
  {
    id: 'rick',
    name: 'Rick',
    subtitle: 'Zweiter Bruder · Streich-Komplize',
    accent: 'border-purple-500/60 bg-purple-950/30 text-purple-200',
  },
  {
    id: 'conrad',
    name: 'Conrad',
    subtitle: 'Jüngster Bruder · Wirbelwind',
    accent: 'border-amber-500/60 bg-amber-950/30 text-amber-200',
  },
];

const DRESS_OPTIONS: DressOption[] = [
  // Shirts (3 correct + 2 distractors)
  {
    id: 'shirt_leo_pirate',
    label: 'Schwarzes Piraten-T-Shirt',
    detail: 'Dunkles Shirt mit Totenkopf & gelbem Strohhut-Wappen',
    category: 'shirt',
    correctBoy: 'leo',
    wrongHint: 'Wer trug das dunkle Piraten-Shirt? Schau gedanklich auf den ältesten Streich-Planer!',
  },
  {
    id: 'shirt_rick_white',
    label: 'Schlichtes weißes T-Shirt',
    detail: 'Einfarbiger weißer Baumwoll-Klassiker ohne Aufdruck',
    category: 'shirt',
    correctBoy: 'rick',
    wrongHint: 'Das schlichte weiße T-Shirt gehört dem mittleren Bruder, der sonst gern über die Schulter schaut!',
  },
  {
    id: 'shirt_conrad_marathon',
    label: 'Neongelbes Kids-Marathon-Shirt',
    detail: 'Gelb-hellblaues Laufshirt mit roter Marathon-Schrift',
    category: 'shirt',
    correctBoy: 'conrad',
    wrongHint: 'Wer war nochmal der sportliche Marathon-Läufer mit dem knallgelben Shirt?',
  },
  {
    id: 'shirt_dist_eleonore',
    label: 'Türkis-weiß gestreiftes Shirt',
    detail: 'Maritimes Ringelshirt aus dem großen Koffer',
    category: 'shirt',
    correctBoy: null,
    wrongHint: 'Halt! Das grün-türkise Ringelshirt gehört Eleonore selbst, nicht den Jungs!',
  },
  {
    id: 'shirt_dist_andrew',
    label: 'Graues Polo mit orangem Kragen',
    detail: 'Ordentlich gefaltetes Erwachsenen-Poloshirt',
    category: 'shirt',
    correctBoy: null,
    wrongHint: 'Das ist doch viel zu groß — das graue Polohemd mit orangem Rand gehört Andrew!',
  },

  // Personal items (3 correct + 1 distractor)
  {
    id: 'item_leo_watch',
    label: 'Leuchtende Armbanduhr & Piraten-Malbuch',
    detail: 'Zeigte nachts um 02:10 Uhr die exakte Uhrzeit',
    category: 'item',
    correctBoy: 'leo',
    wrongHint: 'Überleg mal: Welcher der Brüder las um 02:10 Uhr am Lüftungsschacht seine leuchtende Uhr ab?',
  },
  {
    id: 'item_rick_bet',
    label: 'Wett-Zettel & Streich-Klebeband',
    detail: 'Zettel: „Wer zuerst Polizei sieht, wählt den Nachtisch!“',
    category: 'item',
    correctBoy: 'rick',
    wrongHint: 'Wer hat mit Leo gewettet, wer zuerst Polizisten entdeckt, um den Nachtisch auszusuchen?',
  },
  {
    id: 'item_conrad_medal',
    label: 'Blaue Lauf-Medaille & blauer Rucksack',
    detail: 'Mit dem stolzen Junior-Detektiv-Abzeichen daran',
    category: 'item',
    correctBoy: 'conrad',
    wrongHint: 'An dem blauen Kinderrucksack hing das Abzeichen — und wer trägt stolz die blaue Medaille um den Hals?',
  },
  {
    id: 'item_dist_scarf',
    label: 'Königsblauer Kreta-Seidenschal',
    detail: 'Feines Tuch mit goldener Borte',
    category: 'item',
    correctBoy: null,
    wrongHint: 'Finger weg vom Seidenschal! Den braucht Eleonore wegen der Klimaanlage selbst — und der andere liegt bei der Spurensicherung!',
  },

  // 3rd category: subtle objects hinted in earlier Station 3.1 dialogs (3 correct + 2 distractors)
  {
    id: 'trait_leo_spyglass',
    label: 'Kleines Messing-Fernrohr',
    detail: 'Ausziehbares Kinder-Fernrohr zum Möwen-Zählen',
    category: 'trait',
    correctBoy: 'leo',
    wrongHint: 'Erinnere dich an Kapitän Brammers Beschwerde auf der Brücke: Wer wollte damit unbedingt Möwen zählen?',
  },
  {
    id: 'trait_rick_stopwatch',
    label: 'Silberne Sport-Stoppuhr',
    detail: 'Kleine Stoppuhr an einer blauen Kordel',
    category: 'trait',
    correctBoy: 'rick',
    wrongHint: 'Frau Lindemann erwähnte doch vorhin bei Kabine 518, wer mit einer Stoppuhr im Türrahmen gewartet hat!',
  },
  {
    id: 'trait_conrad_dino',
    label: 'Kleiner grüner Spielzeug-Dino',
    detail: 'Kunststoff-Dinosaurier mit ein paar Salzcracker-Krümeln',
    category: 'trait',
    correctBoy: 'conrad',
    wrongHint: 'Wer hatte sich laut Frau Lindemann mit diesem Dino im Kinderclub unter dem Basteltisch versteckt?',
  },
  {
    id: 'trait_dist_remote',
    label: 'Schwarzer Bord-Kofferschlüssel',
    detail: 'Kleiner Metallschlüssel vom Kabinen-Tresor',
    category: 'trait',
    correctBoy: null,
    wrongHint: 'Den Tresorschlüssel sollten die Kinder bestimmt nicht als Spielzeug mitnehmen!',
  },
  {
    id: 'trait_dist_badge',
    label: 'Glitzer-Anstecker vom Show-Abend',
    detail: 'Bunter Bühnen-Pin mit kleinem Mikrofon',
    category: 'trait',
    correctBoy: null,
    wrongHint: 'Der Glitzer-Pin gehört wahrscheinlich zur Bühnendeko von Frau Lindemann, nicht einem der Jungs!',
  },
];

export function KidsDressupMiniGame({
  onComplete,
  onCancel,
}: {
  onComplete: () => void;
  onCancel: () => void;
}) {
  const [selectedBoy, setSelectedBoy] = useState<BoyId>('leo');
  const [picks, setPicks] = useState<
    Record<BoyId, { shirt: string | null; item: string | null; trait: string | null }>
  >({
    leo: { shirt: null, item: null, trait: null },
    rick: { shirt: null, item: null, trait: null },
    conrad: { shirt: null, item: null, trait: null },
  });
  const [feedback, setFeedback] = useState<string | null>(
    'Wähle einen der drei Brüder aus und ordne ihm Shirt, persönliches Teil und Lieblingsteil aus den Gesprächen zu.'
  );
  const [isSolved, setIsSolved] = useState(false);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const assignedElsewhere = useMemo(() => {
    const map = new Map<string, BoyId>();
    for (const boy of BOYS) {
      const p = picks[boy.id];
      if (p.shirt) map.set(p.shirt, boy.id);
      if (p.item) map.set(p.item, boy.id);
      if (p.trait) map.set(p.trait, boy.id);
    }
    return map;
  }, [picks]);

  const allSlotsFilled = BOYS.every(
    (b) => picks[b.id].shirt && picks[b.id].item && picks[b.id].trait
  );

  const handleAssignOption = (option: DressOption) => {
    if (isSolved) return;
    soundFx.play('blip');
    setPicks((prev) => {
      const next = {
        leo: { ...prev.leo },
        rick: { ...prev.rick },
        conrad: { ...prev.conrad },
      };
      // Remove option if previously assigned to any boy
      for (const b of BOYS) {
        if (next[b.id][option.category] === option.id) {
          next[b.id][option.category] = null;
        }
      }
      // Assign to currently selected boy (toggle off if re-clicked on same boy)
      if (prev[selectedBoy][option.category] === option.id) {
        next[selectedBoy][option.category] = null;
      } else {
        next[selectedBoy][option.category] = option.id;
      }
      return next;
    });
  };

  const handleVerify = () => {
    for (const boy of BOYS) {
      const boyPicks = picks[boy.id];
      const ids = [boyPicks.shirt, boyPicks.item, boyPicks.trait];
      for (const id of ids) {
        const opt = DRESS_OPTIONS.find((o) => o.id === id);
        if (!opt || opt.correctBoy !== boy.id) {
          soundFx.play('penalty');
          setSelectedBoy(boy.id);
          setFeedback(
            opt
              ? `Bei ${boy.name} stimmt etwas noch nicht: ${opt.wrongHint}`
              : `Bei ${boy.name} fehlt noch ein Teil.`
          );
          return;
        }
      }
    }

    soundFx.play('deduction');
    setIsSolved(true);
    setFeedback(
      'Perfekt!! Alle drei Jungs sind komplett angezogen, ausgerüstet und ablenkungsbereit!'
    );
  };

  useEffect(() => {
    if (!isSolved) return;
    const t = window.setTimeout(() => {
      if (completedRef.current) return;
      completedRef.current = true;
      onCompleteRef.current();
    }, 950);
    return () => window.clearTimeout(t);
  }, [isSolved]);

  const finishNow = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    onCompleteRef.current();
  };

  const renderCategorySection = (category: DressCategory, title: string) => {
    const opts = DRESS_OPTIONS.filter((o) => o.category === category);
    return (
      <div className="space-y-1.5">
        <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
          {title}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {opts.map((opt) => {
            const owner = assignedElsewhere.get(opt.id);
            const isMine = owner === selectedBoy;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={isSolved}
                onClick={() => handleAssignOption(opt)}
                className={`text-left px-2.5 py-2 rounded-lg border text-xs transition-all cursor-pointer ${
                  isMine
                    ? 'bg-amber-500/20 border-amber-400 text-amber-100'
                    : owner
                      ? 'bg-slate-950/90 border-slate-700 text-slate-400 opacity-75'
                      : 'bg-slate-950/70 hover:bg-slate-800 border-slate-800 text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold leading-snug">{opt.label}</span>
                  {owner && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                        isMine
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {BOYS.find((b) => b.id === owner)?.name}
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                  {opt.detail}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="absolute inset-0 z-30 bg-slate-950/92 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="max-w-3xl w-full max-h-full overflow-y-auto bg-slate-900 border border-amber-500/40 rounded-xl p-4 sm:p-5 shadow-2xl space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
              <Shirt className="w-4 h-4" />
              <span>Anzieh- & Rucksack-Chaos · Kabine 518</span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Hilf Maya vor dem Aufbruch: Erinnerst du dich noch an die{' '}
              <strong>T-Shirt-Farben</strong> aus den Portraits der Jungs und an ihre Eigenheiten
              aus den letzten Gesprächen?
            </p>
          </div>
          <button
            type="button"
            onClick={isSolved ? finishNow : onCancel}
            aria-label="Minispiel schließen"
            className="p-1.5 text-slate-400 hover:text-slate-100 rounded-lg cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Boy Selector Tabs */}
        <div className="grid grid-cols-3 gap-2">
          {BOYS.map((boy) => {
            const p = picks[boy.id];
            const count = [p.shirt, p.item, p.trait].filter(Boolean).length;
            const active = selectedBoy === boy.id;
            return (
              <button
                key={boy.id}
                type="button"
                disabled={isSolved}
                onClick={() => setSelectedBoy(boy.id)}
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                  active
                    ? `${boy.accent} ring-1 ring-amber-400`
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs sm:text-sm font-bold">{boy.name}</span>
                  <span className="text-[10px] font-mono-num px-1.5 py-0.5 rounded bg-slate-900/90 border border-slate-700">
                    {count}/3
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 truncate">{boy.subtitle}</div>
              </button>
            );
          })}
        </div>

        {/* Active Boy Selection Pools */}
        <div className="space-y-3 bg-slate-950/40 border border-slate-800/80 rounded-lg p-3">
          {renderCategorySection('shirt', `1. T-Shirt für ${BOYS.find((b) => b.id === selectedBoy)?.name}`)}
          {renderCategorySection('item', '2. Persönliches Teil / Ausrüstung')}
          {renderCategorySection('trait', '3. Lieblingsteil / Fundstück')}
        </div>

        {feedback && (
          <div
            className={`px-3 py-2 rounded-lg border text-xs leading-relaxed ${
              isSolved
                ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-200 font-semibold'
                : 'bg-slate-950/80 border-slate-800 text-slate-300'
            }`}
          >
            {feedback}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <button
            type="button"
            disabled={isSolved}
            onClick={() => {
              setPicks({
                leo: { shirt: null, item: null, trait: null },
                rick: { shirt: null, item: null, trait: null },
                conrad: { shirt: null, item: null, trait: null },
              });
              setFeedback('Alles zurückgelegt — sortiere die Sachen neu!');
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700 cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Neu sortieren</span>
          </button>

          {isSolved ? (
            <button
              type="button"
              onClick={finishNow}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Weiter</span>
            </button>
          ) : (
            <button
              type="button"
              disabled={!allSlotsFilled}
              onClick={handleVerify}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 text-xs font-bold rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <Backpack className="w-3.5 h-3.5" />
              <span>Anziehen prüfen!</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// MINISPIEL 2 (FALL 3.1): SCHIFFSPLAN-AUSSCHLUSSVERFAHREN (8 ANGABEN)
// =============================================================================

const SHIP_PLAN_STORAGE_KEY = 'advokat_f3_ship_plan_excluded_v1';

interface ExclusionRule {
  id: string;
  label: string;
  group: 'Decks' | 'Kategorie' | 'Lage & Seite' | 'Kabinen-Nr.';
  shouldExclude: boolean; // true = one of the 8 real exclusions from Receptionist Miriam
  eliminatesCount: number;
}

const EXCLUSION_RULES: ExclusionRule[] = [
  // Group: Decks
  {
    id: 'ex_vip_decks',
    label: 'Decks 12–14 (VIP- & Panoramasuiten)',
    group: 'Decks',
    shouldExclude: true,
    eliminatesCount: 90,
  },
  {
    id: 'ex_party_decks',
    label: 'Decks 10–11 (Pool, Theater & Showdeck)',
    group: 'Decks',
    shouldExclude: true,
    eliminatesCount: 80,
  },
  {
    id: 'ex_quiet_deck9',
    label: 'Deck 9 (Mitteldeck)',
    group: 'Decks',
    shouldExclude: false,
    eliminatesCount: 0,
  },
  {
    id: 'ex_restaurant_decks',
    label: 'Decks 7–8 (Steakhaus & Hauptbuffet)',
    group: 'Decks',
    shouldExclude: true,
    eliminatesCount: 110,
  },
  {
    id: 'ex_family_deck6',
    label: 'Deck 6 (Familienbereich)',
    group: 'Decks',
    shouldExclude: true,
    eliminatesCount: 70,
  },
  {
    id: 'ex_engine_decks',
    label: 'Decks 4–5 (Unterdecks)',
    group: 'Decks',
    shouldExclude: true,
    eliminatesCount: 70,
  },

  // Group: Kategorie
  {
    id: 'ex_outer_balcony',
    label: 'Außen- & Balkonkabinen',
    group: 'Kategorie',
    shouldExclude: true,
    eliminatesCount: 44,
  },
  {
    id: 'ex_inner_cabins',
    label: 'Innenkabinen',
    group: 'Kategorie',
    shouldExclude: false,
    eliminatesCount: 0,
  },

  // Group: Lage & Seite
  {
    id: 'ex_bow_stern',
    label: 'Bug (vorne) & Heck (achtern)',
    group: 'Lage & Seite',
    shouldExclude: true,
    eliminatesCount: 10,
  },
  {
    id: 'ex_midship',
    label: 'Mittschiffs (Schiffsmitte)',
    group: 'Lage & Seite',
    shouldExclude: false,
    eliminatesCount: 0,
  },
  {
    id: 'ex_starboard',
    label: 'Steuerbord-Korridor (rechts)',
    group: 'Lage & Seite',
    shouldExclude: true,
    eliminatesCount: 2,
  },
  {
    id: 'ex_portside',
    label: 'Backbord-Korridor (links)',
    group: 'Lage & Seite',
    shouldExclude: false,
    eliminatesCount: 0,
  },

  // Group: Kabinen-Nr.
  {
    id: 'ex_even_912_918',
    label: 'Gerade Kabinennummern (912, 914, 916, 918)',
    group: 'Kabinen-Nr.',
    shouldExclude: true,
    eliminatesCount: 2,
  },
  {
    id: 'ex_odd_911_915',
    label: 'Nummern 911, 913, 915',
    group: 'Kabinen-Nr.',
    shouldExclude: true,
    eliminatesCount: 1,
  },
  {
    id: 'ex_odd_917',
    label: 'Nummer 917',
    group: 'Kabinen-Nr.',
    shouldExclude: false,
    eliminatesCount: 0,
  },
];

const REQUIRED_EXCLUSION_IDS = EXCLUSION_RULES.filter((r) => r.shouldExclude).map((r) => r.id);

const ELEONORE_NOTES: string[] = [
  '1. VIP-Gäste wohnen auf den Decks 12–14 — Marston steht nicht auf der VIP-Liste (wegstreichen!).',
  '2. Sparsam gebucht: kein Meerblick/Balkon — Außen- & Balkonkabinen abwählen (nur Innenkabine!).',
  '3. Er wollte Ruhe: nicht die lauten Unterdecks 4–5 und nicht Pool/Show auf Deck 10–11.',
  '4. Kein Essensgeruch: Restaurant-Decks 7 und 8 ebenfalls ausschließen.',
  '5. Kein Familienchaos: Deck 6 hat nur Mehrbett-Familienkabinen — Deck 6 wegstreichen (bleibt Deck 9!).',
  '6. Weder Schiffsbug vorne noch Wellness-Schacht am Heck — nur Mittschiffs bleibt!',
  '7. Auf Steuerbord (rechts) sind auf Deck 9 Crew-Wäschelager — Steuerbord abwählen (bleibt Backbord!).',
  '8. Gerade Nummern (912–918) und 911–915 sind gesperrt bzw. Doppelkabinen — übrig bleibt nur 917!',
];

export function ShipPlanMiniGame({
  flags,
  onComplete,
  onCancel,
}: {
  flags?: Record<string, boolean>;
  onComplete: () => void;
  onCancel: () => void;
}) {
  const [excluded, setExcluded] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(SHIP_PLAN_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });
  const [wrongTries, setWrongTries] = useState(0);
  const [showEleonoreNotes, setShowEleonoreNotes] = useState(() =>
    Boolean(flags?.flag_f3_eleonore_notizhilfe)
  );
  const [feedback, setFeedback] = useState<string | null>(
    Boolean(flags?.flag_f3_eleonore_notizhilfe)
      ? 'Eleonore wird ganz rot: „Entschuldige, Nate — ich wusste nicht, dass man als Assistentin mitschreiben muss! Jetzt habe ich alle 8 Punkte notiert!“'
      : 'Wähle auf dem Schiffsplan alle Bereiche AB, die laut Rezeptionistin Miriam ausgeschlossen sind. Du kannst jederzeit abbrechen, Miriam erneut befragen und hier genau weitermachen!'
  );
  const [isSolved, setIsSolved] = useState(false);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const hasEleonoreHelp = Boolean(flags?.flag_f3_eleonore_notizhilfe) || wrongTries >= 2;

  useEffect(() => {
    try {
      localStorage.setItem(SHIP_PLAN_STORAGE_KEY, JSON.stringify(excluded));
    } catch {
      // ignore
    }
  }, [excluded]);

  const toggleRule = (id: string) => {
    if (isSolved) return;
    soundFx.play('blip');
    setExcluded((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Compute remaining candidate cabins count & whether any trap was excluded
  const trapsExcluded = EXCLUSION_RULES.filter(
    (r) => !r.shouldExclude && excluded.includes(r.id)
  );
  const correctExcludedCount = REQUIRED_EXCLUSION_IDS.filter((id) =>
    excluded.includes(id)
  ).length;
  const eliminatedValidCabins = EXCLUSION_RULES.filter(
    (r) => r.shouldExclude && excluded.includes(r.id)
  ).reduce((sum, r) => sum + r.eliminatesCount, 0);

  const remainingCabins =
    trapsExcluded.length > 0 ? 0 : Math.max(1, 480 - eliminatedValidCabins);

  const isExactSolution =
    trapsExcluded.length === 0 && correctExcludedCount === REQUIRED_EXCLUSION_IDS.length;

  const handleConfirmPlan = () => {
    if (trapsExcluded.length > 0) {
      soundFx.play('penalty');
      const nextWrong = wrongTries + 1;
      setWrongTries(nextWrong);
      if (nextWrong >= 2) {
        setShowEleonoreNotes(true);
        setFeedback(
          'Eleonore wird rot: „Es tut mir so leid, Nate! Ich wusste nicht, dass ich als Assistentin alles mitschreiben muss — hier sind alle 8 Punkte aus dem Gespräch!“ (Achtung: Du hast einen Bereich gestrichen, der eigentlich zutrifft!)'
        );
      } else {
        setFeedback(
          'Vorsicht! Mit dieser Auswahl bleiben 0 Kabinen übrig — du hast mindestens eine Kategorie gestrichen, die eigentlich zutrifft!'
        );
      }
      return;
    }
    if (!isExactSolution) {
      soundFx.play('penalty');
      const nextWrong = wrongTries + 1;
      setWrongTries(nextWrong);
      if (nextWrong >= 2) {
        setShowEleonoreNotes(true);
        setFeedback(
          `Es bleiben noch ca. ${remainingCabins} Kabinen übrig! Eleonore wird rot: „Tut mir leid, Nate — als neue Assistentin hätte ich direkt mitschreiben sollen! Hier oben sind meine 8 Notizen!“`
        );
      } else {
        setFeedback(
          `Noch bleiben rechnerisch ca. ${remainingCabins} Kabinen übrig — einige von Miriams Ausschluss-Kriterien fehlen noch. Im Zweifel kurz abbrechen und nochmal nachfragen!`
        );
      }
      return;
    }

    soundFx.play('deduction');
    setIsSolved(true);
    setFeedback(
      'VOLLTREFFER!! Alle 8 Angaben greifen ineinander — übrig bleibt exakt EINE Kabine: Deck 9 · Innenkabine · Mittschiffs · Backbord · Kabine 917!'
    );
    try {
      localStorage.removeItem(SHIP_PLAN_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (!isSolved) return;
    const t = window.setTimeout(() => {
      if (completedRef.current) return;
      completedRef.current = true;
      onCompleteRef.current();
    }, 1050);
    return () => window.clearTimeout(t);
  }, [isSolved]);

  const finishNow = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    onCompleteRef.current();
  };

  const groups: ExclusionRule['group'][] = [
    'Decks',
    'Kategorie',
    'Lage & Seite',
    'Kabinen-Nr.',
  ];

  return (
    <div className="absolute inset-0 z-30 bg-slate-950/92 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="max-w-3xl w-full max-h-full overflow-y-auto bg-slate-900 border border-sky-500/40 rounded-xl p-4 sm:p-5 shadow-2xl space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-300">
              <Compass className="w-4 h-4" />
              <span>Deck- & Kabinenplan · MS Aurora</span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Streiche per Klick alle Kabinenbereiche <strong>durch (abwählen)</strong>, in denen
              Detective Marston laut Rezeption nicht wohnt, bis genau eine Kabine übrig bleibt.
            </p>
          </div>
          <button
            type="button"
            onClick={isSolved ? finishNow : onCancel}
            aria-label="Schiffsplan schließen"
            className="p-1.5 text-slate-400 hover:text-slate-100 rounded-lg cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
          <div className="px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Verbleibend:</span>
            <span
              className={`font-mono-num font-bold ${
                remainingCabins === 0
                  ? 'text-red-400'
                  : remainingCabins === 1
                    ? 'text-emerald-400'
                    : 'text-amber-300'
              }`}
            >
              {isSolved
                ? 'Kabine 917!'
                : remainingCabins === 1
                  ? '1 Kabine übrig'
                  : `${remainingCabins} Kabinen`}
            </span>
          </div>
          <div className="px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Abgewählt:</span>
            <span className="font-mono-num font-bold text-sky-300">
              {excluded.length} Punkte
            </span>
          </div>
          {hasEleonoreHelp ? (
            <button
              type="button"
              onClick={() => setShowEleonoreNotes((v) => !v)}
              className="col-span-2 sm:col-span-1 px-3 py-2 rounded-lg bg-teal-950/60 hover:bg-teal-900/60 border border-teal-400/50 text-teal-200 font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 shrink-0" />
              <span>{showEleonoreNotes ? 'Notizen verbergen' : 'Eleonores 8 Notizen'}</span>
            </button>
          ) : (
            <div className="col-span-2 sm:col-span-1 px-3 py-2 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>Alles im Kopf behalten!</span>
            </div>
          )}
        </div>

        {/* Eleonore's 3rd Attempt Shorthand Notes */}
        {hasEleonoreHelp && showEleonoreNotes && (
          <div className="bg-teal-950/35 border border-teal-500/40 rounded-lg p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-teal-300 uppercase tracking-wide">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Eleonores mitgeschriebene Notizen aus dem Rezeptions-Gespräch:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-teal-100/90 leading-snug pt-1">
              {ELEONORE_NOTES.map((note) => (
                <div key={note}>{note}</div>
              ))}
            </div>
          </div>
        )}

        {/* Interactive Exclusion Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {groups.map((group) => {
            const items = EXCLUSION_RULES.filter((r) => r.group === group);
            return (
              <div
                key={group}
                className="bg-slate-950/55 border border-slate-800 rounded-lg p-2.5 space-y-1.5"
              >
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {group}
                </div>
                <div className="space-y-1.5">
                  {items.map((rule) => {
                    const isExcluded = excluded.includes(rule.id);
                    return (
                      <button
                        key={rule.id}
                        type="button"
                        disabled={isSolved}
                        onClick={() => toggleRule(rule.id)}
                        className={`w-full text-left px-2.5 py-2 rounded-md border text-xs flex items-center justify-between gap-2 transition-all cursor-pointer ${
                          isExcluded
                            ? 'bg-red-950/35 border-red-500/40 text-slate-400 line-through'
                            : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-100'
                        }`}
                      >
                        <span className="leading-snug">{rule.label}</span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 no-underline ${
                            isExcluded
                              ? 'bg-red-500/20 text-red-300'
                              : 'bg-emerald-500/15 text-emerald-300'
                          }`}
                        >
                          {isExcluded ? 'Aus' : 'Aktiv'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {feedback && (
          <div
            className={`px-3 py-2 rounded-lg border text-xs leading-relaxed ${
              isSolved
                ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-200 font-semibold'
                : trapsExcluded.length > 0
                  ? 'bg-red-950/40 border-red-500/50 text-red-200'
                  : 'bg-slate-950/80 border-slate-800 text-slate-300'
            }`}
          >
            {feedback}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isSolved}
              onClick={() => setExcluded([])}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700 cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Alle zurücksetzen</span>
            </button>
            {!isSolved && (
              <button
                type="button"
                onClick={onCancel}
                className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs rounded-lg border border-slate-700 cursor-pointer"
              >
                Abbrechen &amp; nochmal fragen
              </button>
            )}
          </div>

          {isSolved ? (
            <button
              type="button"
              onClick={finishNow}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Zu Kabine 917!</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleConfirmPlan}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Kabine bestätigen
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
