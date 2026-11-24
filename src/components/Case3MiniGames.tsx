import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Backpack,
  BookOpen,
  Camera,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Compass,
  FileText,
  MapPin,
  RotateCcw,
  Route,
  Search,
  Shirt,
  Sparkles,
  Undo2,
  UtensilsCrossed,
  Wrench,
  X,
} from 'lucide-react';
import { resolveAssetPath } from '../utils/assetPath';
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
    eliminatesCount: 40,
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
    eliminatesCount: 8,
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
    eliminatesCount: 4,
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
    eliminatesCount: 4,
  },
  {
    id: 'ex_odd_911_915',
    label: 'Nummern 911, 913, 915',
    group: 'Kabinen-Nr.',
    shouldExclude: true,
    eliminatesCount: 3,
  },
  {
    id: 'ex_odd_single_end',
    label: 'Übrige ungerade Einzelkabine am Gangende',
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
  '8. Gerade Nummern (912–918) und 911–915 sind gesperrt bzw. Doppelkabinen — nur die übrige ungerade Einzelkabine bleibt!',
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

// =============================================================================
// MINISPIEL 3 (FALL 3.2 · AUFGABE 2): ELEONORES SOKOBAN IM VIP-SPEISESAAL (3 RUNDEN)
// =============================================================================

type CartId = 'w1' | 'w2' | 'w3';

interface VipPos {
  r: number;
  c: number;
}

interface VipSokobanSnapshot {
  player: VipPos;
  carts: Record<CartId, VipPos>;
}

interface VipSokobanLevel {
  title: string;
  board: string[];
  targets: VipPos[];
  initial: VipSokobanSnapshot;
  hint: string;
}

const VIP_SOKO_LEVELS: VipSokobanLevel[] = [
  {
    title: 'Runde 1 / 3 · Haupteingang freiräumen',
    board: [
      '########',
      '#..#...#',
      '#......#',
      '#..#...#',
      '#......#',
      '#......#',
      '########',
    ],
    targets: [
      { r: 2, c: 6 },
      { r: 3, c: 6 },
      { r: 4, c: 6 },
    ],
    initial: {
      player: { r: 5, c: 2 },
      carts: {
        w1: { r: 2, c: 2 },
        w2: { r: 4, c: 2 },
        w3: { r: 4, c: 4 },
      },
    },
    hint: 'Hilf Eleonore! Schiebe alle drei Servierwagen (W1–W3) in die drei Park-Nischen rechts.',
  },
  {
    title: 'Runde 2 / 3 · Säulengang vor der Anrichte',
    board: [
      '########',
      '#......#',
      '#.#.##.#',
      '#......#',
      '#.##...#',
      '#......#',
      '########',
    ],
    targets: [
      { r: 1, c: 6 },
      { r: 2, c: 6 },
      { r: 3, c: 6 },
    ],
    initial: {
      player: { r: 5, c: 1 },
      carts: {
        w1: { r: 3, c: 2 },
        w2: { r: 3, c: 4 },
        w3: { r: 4, c: 5 },
      },
    },
    hint: 'Achtung vor den Säulen in der Mitte — bring erst den vorderen Wagen nach rechts, bevor du den Gang blockierst!',
  },
  {
    title: 'Runde 3 / 3 · Großes Bankett-Labyrinth',
    board: [
      '#########',
      '#...#...#',
      '#...#...#',
      '#.......#',
      '###.#...#',
      '#.......#',
      '#########',
    ],
    targets: [
      { r: 1, c: 7 },
      { r: 2, c: 7 },
      { r: 3, c: 7 },
    ],
    initial: {
      player: { r: 1, c: 1 },
      carts: {
        w1: { r: 2, c: 2 },
        w2: { r: 3, c: 3 },
        w3: { r: 4, c: 5 },
      },
    },
    hint: 'Finale Runde! Nutze die untere Umfahrung geschickt, um erst die tiefste Nische ganz oben rechts zu füllen.',
  },
];

const CART_META: Record<CartId, { short: string; name: string; colorClass: string }> = {
  w1: {
    short: 'W1',
    name: 'Wein-Servierwagen',
    colorClass: 'bg-rose-500 border-rose-200 text-white',
  },
  w2: {
    short: 'W2',
    name: 'Geschirr-Wagen',
    colorClass: 'bg-amber-400 border-amber-100 text-slate-950',
  },
  w3: {
    short: 'W3',
    name: 'Wäsche-Wagen',
    colorClass: 'bg-sky-500 border-sky-200 text-slate-950',
  },
};

function cloneSokoSnapshot(snap: VipSokobanSnapshot): VipSokobanSnapshot {
  return {
    player: { ...snap.player },
    carts: {
      w1: { ...snap.carts.w1 },
      w2: { ...snap.carts.w2 },
      w3: { ...snap.carts.w3 },
    },
  };
}

export function VipSokobanMiniGame({
  onComplete,
  onCancel,
}: {
  onComplete: () => void;
  onCancel: () => void;
}) {
  const [levelIdx, setLevelIdx] = useState(0);
  const currentLevel = VIP_SOKO_LEVELS[levelIdx];

  const [boardState, setBoardState] = useState<VipSokobanSnapshot>(() =>
    cloneSokoSnapshot(VIP_SOKO_LEVELS[0].initial)
  );
  const [history, setHistory] = useState<VipSokobanSnapshot[]>([]);
  const [statusMsg, setStatusMsg] = useState(VIP_SOKO_LEVELS[0].hint);
  const [allSolved, setAllSolved] = useState(false);

  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const isWall = (r: number, c: number) => {
    if (r < 0 || r >= currentLevel.board.length || c < 0 || c >= currentLevel.board[0].length) {
      return true;
    }
    return currentLevel.board[r][c] === '#';
  };

  const isTarget = (r: number, c: number) =>
    currentLevel.targets.some((t) => t.r === r && t.c === c);

  const placedCount = (Object.keys(boardState.carts) as CartId[]).filter((id) => {
    const pos = boardState.carts[id];
    return isTarget(pos.r, pos.c);
  }).length;

  const roundSolved = placedCount === currentLevel.targets.length;

  const finishVipSoko = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    onCompleteRef.current();
  };

  useEffect(() => {
    if (!roundSolved || allSolved) return;

    if (levelIdx < VIP_SOKO_LEVELS.length - 1) {
      soundFx.play('evidence_chime');
      setStatusMsg(`Runde ${levelIdx + 1} geschafft! Weiter zum nächsten Bereich im Speisesaal…`);
      const t = window.setTimeout(() => {
        const nextIdx = levelIdx + 1;
        setLevelIdx(nextIdx);
        setHistory([]);
        setBoardState(cloneSokoSnapshot(VIP_SOKO_LEVELS[nextIdx].initial));
        setStatusMsg(VIP_SOKO_LEVELS[nextIdx].hint);
      }, 850);
      return () => window.clearTimeout(t);
    }

    setAllSolved(true);
    soundFx.play('deduction');
    const t = window.setTimeout(() => {
      if (completedRef.current) return;
      completedRef.current = true;
      onCompleteRef.current();
    }, 850);
    return () => window.clearTimeout(t);
  }, [roundSolved, levelIdx, allSolved]);

  const tryMove = (dr: number, dc: number) => {
    if (roundSolved || allSolved) return;
    const nr = boardState.player.r + dr;
    const nc = boardState.player.c + dc;
    if (isWall(nr, nc)) {
      soundFx.play('penalty');
      setStatusMsg('Dort steht ein gedeckter Mahagoni-Tisch im Weg!');
      return;
    }

    const cartIds = Object.keys(boardState.carts) as CartId[];
    const pushedCartId = cartIds.find(
      (id) => boardState.carts[id].r === nr && boardState.carts[id].c === nc
    );

    if (pushedCartId) {
      const br = nr + dr;
      const bc = nc + dc;
      const occupied = cartIds.some(
        (id) => boardState.carts[id].r === br && boardState.carts[id].c === bc
      );
      if (isWall(br, bc) || occupied) {
        soundFx.play('penalty');
        setStatusMsg('Kein Platz hinter dem Wagen — manövriere außen herum!');
        return;
      }

      soundFx.play('blip');
      setHistory((prev) => [...prev, cloneSokoSnapshot(boardState)]);
      setBoardState({
        player: { r: nr, c: nc },
        carts: {
          ...boardState.carts,
          [pushedCartId]: { r: br, c: bc },
        },
      });
      setStatusMsg(
        isTarget(br, bc)
          ? `Sauber geparkt! Der ${CART_META[pushedCartId].name} steht in der Nische!`
          : `Eleonore schiebt den ${CART_META[pushedCartId].name} weiter durch den Gang.`
      );
      return;
    }

    soundFx.play('blip');
    setHistory((prev) => [...prev, cloneSokoSnapshot(boardState)]);
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
    if (history.length === 0 || roundSolved || allSolved) return;
    const last = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setBoardState(last);
    soundFx.play('page_turn');
    setStatusMsg('Einen Schritt zurückgesetzt.');
  };

  const handleReset = () => {
    if (roundSolved || allSolved) return;
    setHistory([]);
    setBoardState(cloneSokoSnapshot(currentLevel.initial));
    soundFx.play('page_turn');
    setStatusMsg(`Runde ${levelIdx + 1} neu gestartet! Überlege dir die Reihenfolge genau.`);
  };

  const cols = currentLevel.board[0].length;

  return (
    <div className="absolute inset-0 z-30 bg-slate-950/92 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="max-w-lg w-full max-h-full overflow-y-auto bg-slate-900 border border-teal-500/40 rounded-xl p-4 sm:p-5 shadow-2xl space-y-3.5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-300">
              <UtensilsCrossed className="w-4 h-4" />
              <span>Eleonores Aufräum-Einsatz · {currentLevel.title}</span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Stell in allen drei Saal-Abschnitten sämtliche Servierwagen sauber an die Wand! Steuere
              Eleonore (E) mit den Pfeilen oder <strong>WASD</strong>.
            </p>
          </div>
          <button
            type="button"
            onClick={allSolved ? finishVipSoko : onCancel}
            aria-label="Minispiel schließen"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between gap-2 text-[11px] bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2">
          <span className="text-slate-200">{statusMsg}</span>
          <span className="font-mono-num font-bold text-emerald-300 whitespace-nowrap">
            {placedCount}/3 Wagen
          </span>
        </div>

        <div
          className={`bg-slate-950 p-2.5 sm:p-3 rounded-xl border border-slate-800 mx-auto ${
            cols === 9 ? 'max-w-[405px]' : 'max-w-[360px]'
          }`}
        >
          <div className={`grid gap-1 ${cols === 9 ? 'grid-cols-9' : 'grid-cols-8'}`}>
            {currentLevel.board.map((rowStr, r) =>
              rowStr.split('').map((cell, c) => {
                const wall = cell === '#';
                const target = isTarget(r, c);
                const isPlayer = boardState.player.r === r && boardState.player.c === c;
                const cartId = (Object.keys(boardState.carts) as CartId[]).find(
                  (id) => boardState.carts[id].r === r && boardState.carts[id].c === c
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
                        title="Eleonore"
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-teal-500 border-2 border-teal-200 text-slate-950 flex items-center justify-center text-[11px] font-black shadow"
                      >
                        E
                      </div>
                    )}
                    {!isPlayer && cartId && (
                      <div
                        title={CART_META[cartId].name}
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg border-2 flex items-center justify-center text-[10px] font-black shadow ${
                          CART_META[cartId].colorClass
                        } ${target ? 'ring-2 ring-emerald-300' : ''}`}
                      >
                        {CART_META[cartId].short}
                      </div>
                    )}
                    {!isPlayer && !cartId && target && (
                      <span className="text-[8px] sm:text-[9px] text-emerald-400/80 font-bold">
                        PARK
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {allSolved ? (
          <div className="bg-emerald-950/50 border border-emerald-500/50 rounded-lg p-3 text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>VOLLTREFFER! Alle 3 Saal-Bereiche blitzen – Herr von Berg rückt seine Fotos heraus!</span>
            </div>
            <button
              type="button"
              onClick={finishVipSoko}
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
                disabled={history.length === 0 || roundSolved}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs rounded-lg border border-slate-700 cursor-pointer"
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span>Zurück</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={roundSolved}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs rounded-lg border border-slate-700 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Neustart</span>
              </button>
            </div>

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

// =============================================================================
// MINISPIEL 4 (FALL 3.2 · AUFGABE 2): 10 BESCHWERDE-FOTOS DURCHSUCHEN
// =============================================================================

interface ComplaintPhoto {
  id: string;
  title: string;
  timestamp: string;
  imagePath: string;
  caption: string;
  missText: string;
  isTarget?: boolean;
}

const VIP_COMPLAINT_PHOTOS: ComplaintPhoto[] = [
  {
    id: 'photo_elevator_spill',
    title: 'Foto 1/10 · Aufzugshalle: Verschütteter Espresso',
    timestamp: 'Tag 1 · 15:14 Uhr',
    imagePath: '/src/assets/images/photo_berg_elevator_spill_1795426781408.jpg',
    caption: 'Einschiffungstag: Ein kleiner Kaffeefleck samt gelbem Warnschild auf dem Teppich.',
    missText: 'Nur eine zerbrochene Espressotasse auf dem Teppich. Blättere weiter!',
  },
  {
    id: 'photo_deck_loungers',
    title: 'Foto 2/10 · Promenadendeck: Schiefe Holzliegen',
    timestamp: 'Tag 2 · 11:38 Uhr',
    imagePath: '/src/assets/images/photo_berg_deck_loungers_1795426756922.jpg',
    caption: 'Herrn von Berg störte, dass drei Liegen im Sonnenschein nicht im rechten Winkel standen.',
    missText: 'Nichts als unordentliche weiße Badetücher auf Teakholz-Liegen.',
  },
  {
    id: 'photo_audio_cables',
    title: 'Foto 3/10 · Musiksalon: Kabel & Equipment-Cases',
    timestamp: 'Tag 2 · 17:05 Uhr',
    imagePath: '/src/assets/images/photo_berg_audio_cables_1795426757992.jpg',
    caption: 'Backstage-Beschwerde über unverstaute Tonkabel vor dem Konzertabend.',
    missText: 'Nur schwarze Audiokabel und Rollkoffer vor dem Konzert. Weiter!',
  },
  {
    id: 'photo_mop_bucket',
    title: 'Foto 4/10 · Haupt-Atrium: Vergessener Wischeimer',
    timestamp: 'Tag 3 · 09:42 Uhr',
    imagePath: '/src/assets/images/photo_berg_mop_bucket_1795426738711.jpg',
    caption: 'Ein gelber Reinigungswagen stand mitten auf dem spiegelnden Marmorboden.',
    missText: 'Ein ganz normaler gelber Wischeimer und Mopp. Nächstes Bild!',
  },
  {
    id: 'photo_buffet_mess',
    title: 'Foto 5/10 · Frühstücksbuffet: Rührei-Reste',
    timestamp: 'Tag 3 · 10:19 Uhr',
    imagePath: '/src/assets/images/photo_berg_buffet_mess_1795426738536.jpg',
    caption: 'Von Berg reklamierte unsaubere Vorlegezangen an den Warmhaltebehältern.',
    missText: 'Nur silberne Warmhalteplatten und ein paar verschüttete Eierflocken.',
  },
  {
    id: 'photo_pool_towels',
    title: 'Foto 6/10 · Pooldeck: Überfüllte Liegen am Morgen',
    timestamp: 'Tag 4 · 08:25 Uhr',
    imagePath: '/src/assets/images/photo_berg_pool_towels_1795426756595.jpg',
    caption: 'Beschwerde über frühmorgendliche „Liegenreservierer“ am Pool.',
    missText: 'Bunte Handtücher und Sonnenliegen am Pool — kein verdächtiger Fund.',
  },
  {
    id: 'photo_wine_spill',
    title: 'Foto 7/10 · Tisch 4: Verschütteter Merlot',
    timestamp: 'Tag 4 · 20:42 Uhr',
    imagePath: '/src/assets/images/photo_berg_wine_spill_1795426738872.jpg',
    caption: 'Abendaufnahme aus dem VIP-Speisesaal: Umgekipptes Rotweinglas auf weißem Tischtuch.',
    missText: 'Nur ein großer Rotweinfleck und zerknüllte Servietten. Schau weiter!',
  },
  {
    id: 'photo_ice_bucket',
    title: 'Foto 8/10 · Anrichte: Sektkühler & Silberbesteck',
    timestamp: 'Tag 4 · 20:47 Uhr',
    imagePath: '/src/assets/images/photo_berg_ice_bucket_1795426739303.jpg',
    caption: 'Nahaufnahme einer unabgeräumten Eiskübel-Station fünf Minuten später.',
    missText: 'Hier liegen nur nasse Stoffservietten, Eiswasser und Besteck.',
  },
  {
    id: 'photo_laundry_cart',
    title: 'Foto 9/10 · Schmutzwäsche-Wagen im Seitengang',
    timestamp: 'Tag 4 · 20:53 Uhr',
    imagePath: '/src/assets/images/photo_f3_vip_laundry_scarf_1795388140572.jpg',
    caption: 'Schnappschuss vom vollgestopften Servicewagen voller abgeräumter VIP-Handtücher.',
    missText: 'Lauter weiße VIP-Handtücher — schau doch einmal etwas genauer mitten in den Stapel!',
    isTarget: true,
  },
  {
    id: 'photo_coat_rack',
    title: 'Foto 10/10 · Ausgang: Schirm- & Kleiderständer',
    timestamp: 'Tag 4 · 20:59 Uhr',
    imagePath: '/src/assets/images/photo_berg_coat_rack_1795426781175.jpg',
    caption: 'Letzte Aufnahme neben der Flügeltür: Ein verlassener Regenschirm und eine Serviceweste.',
    missText: 'Nur ein schwarzer Regenschirm und eine Bordservice-Weste. Schau alle Fotos ruhig durch!',
  },
];

export function VipPhotoSearchMiniGame({
  onComplete,
  onCancel,
}: {
  onComplete: () => void;
  onCancel: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState(
    'Blättere auf gut Glück durch Herrn von Bergs zehn Beschwerdefotos von der gesamten Reise und tippe direkt ins Bild, wenn dir etwas auffällt!'
  );
  const [isSolved, setIsSolved] = useState(false);

  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const photo = VIP_COMPLAINT_PHOTOS[idx];

  const finishPhotoSearch = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    onCompleteRef.current();
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

  const handleMissClick = () => {
    if (isSolved) return;
    soundFx.play('blip');
    setFeedback(photo.missText);
  };

  const handleScarfSpotClick = () => {
    if (isSolved) return;
    soundFx.play('deduction');
    setIsSolved(true);
    setFeedback(
      'MOMENT MAL!! Da rechts zwischen den abgeräumten Handtüchern… DAS IST ANDREWS KÖNIGSBLAUER SEIDENSCHAL MIT GOLDBORTE!!'
    );
  };

  const selectIndex = (next: number) => {
    if (isSolved) return;
    soundFx.play('page_turn');
    setIdx(next);
    setFeedback(VIP_COMPLAINT_PHOTOS[next].caption);
  };

  return (
    <div className="absolute inset-0 z-30 bg-slate-950/92 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="max-w-2xl w-full max-h-full overflow-y-auto bg-slate-900 border border-amber-500/40 rounded-xl p-4 sm:p-5 shadow-2xl space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
              <Camera className="w-4 h-4" />
              <span>Kamera-Galerie · 10 Beschwerdefotos der Kreuzfahrt</span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Durchsuche die zehn Beschwerdefotos von der gesamten Reise und tippe direkt ins Bild,
              falls dir etwas auffällt.
            </p>
          </div>
          <button
            type="button"
            onClick={isSolved ? finishPhotoSearch : onCancel}
            aria-label="Galerie schließen"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Photo Header Navigation */}
        <div className="flex items-center justify-between gap-2 bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-xs">
          <button
            type="button"
            disabled={isSolved}
            onClick={() => selectIndex((idx - 1 + VIP_COMPLAINT_PHOTOS.length) % VIP_COMPLAINT_PHOTOS.length)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md cursor-pointer disabled:opacity-40"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Zurück</span>
          </button>
          <div className="text-center min-w-0">
            <div className="font-bold text-slate-100 truncate">{photo.title}</div>
            <div className="text-[11px] font-mono-num text-slate-400">{photo.timestamp}</div>
          </div>
          <button
            type="button"
            disabled={isSolved}
            onClick={() => selectIndex((idx + 1) % VIP_COMPLAINT_PHOTOS.length)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md cursor-pointer disabled:opacity-40"
          >
            <span>Weiter</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 1..10 Quick Index Strip */}
        <div className="grid grid-cols-10 gap-1">
          {VIP_COMPLAINT_PHOTOS.map((item, i) => (
            <button
              key={item.id}
              type="button"
              disabled={isSolved}
              onClick={() => selectIndex(i)}
              className={`py-1 rounded text-[11px] font-mono-num font-bold border transition-colors cursor-pointer ${
                i === idx
                  ? 'bg-amber-500 border-amber-300 text-slate-950'
                  : 'bg-slate-950/70 hover:bg-slate-800 border-slate-800 text-slate-300'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Interactive Photo Frame */}
        <div className="relative w-full aspect-[4/3] max-h-[300px] mx-auto rounded-xl overflow-hidden border border-slate-700 bg-slate-950 select-none">
          <div onClick={handleMissClick} className="relative w-full h-full cursor-zoom-in">
            <img
              src={resolveAssetPath(photo.imagePath)}
              alt={photo.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {photo.isTarget && (
              <button
                type="button"
                aria-label="Auffälliges blau-goldenes Tuch im Wäschestapel untersuchen"
                onClick={(e) => {
                  e.stopPropagation();
                  handleScarfSpotClick();
                }}
                style={{ left: '53%', top: '31%', width: '28%', height: '38%' }}
                className={`absolute rounded-lg cursor-zoom-in transition-all ${
                  isSolved
                    ? 'border-2 border-amber-400 bg-amber-400/20 shadow-[0_0_24px_rgba(251,191,36,0.5)]'
                    : 'bg-transparent border-0'
                }`}
              />
            )}
          </div>
        </div>

        <div
          className={`px-3 py-2 rounded-lg border text-xs leading-relaxed ${
            isSolved
              ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-200 font-semibold'
              : 'bg-slate-950/80 border-slate-800 text-slate-300'
          }`}
        >
          {feedback}
        </div>

        {isSolved && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={finishPhotoSearch}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Foto sichern &amp; weiter</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// MINISPIEL 5 (FALL 3.2 · AUFGABE 2): FUNDBÜRO-PROTOKOLL PRÜFEN
// =============================================================================

interface LostItemEntry {
  id: string;
  code: string;
  item: string;
  origin: string;
  loggedAt: string;
  status: string;
  isTarget?: boolean;
}

const FUNDBUERO_ENTRIES: LostItemEntry[] = [
  {
    id: 'f415',
    code: 'F-415',
    item: 'Schwarze Sonnenbrille (Marke Nautic)',
    origin: 'Promenadendeck · Liege 18',
    loggedAt: 'Tag 4 · 14:20',
    status: 'Abgeholt (Kabine 402)',
  },
  {
    id: 'f416',
    code: 'F-416',
    item: 'Silberner Regenschirm mit Holzgriff',
    origin: 'Musiksalon · Garderobe',
    loggedAt: 'Tag 4 · 19:05',
    status: 'Abgeholt (Kabine 714)',
  },
  {
    id: 'f417',
    code: 'F-417',
    item: 'Goldene Lesebrille im braunen Etui',
    origin: 'VIP-Salon · Sessel 3',
    loggedAt: 'Tag 4 · 20:15',
    status: 'Abgeholt (Kabine 1204)',
  },
  {
    id: 'f418',
    code: 'F-418',
    item: 'Königsblauer Seidenschal mit Goldborte (Kreta-Muster)',
    origin: 'Bord-Wäscherei (aus VIP-Handtuchwagen)',
    loggedAt: 'Tag 4 · 21:40',
    status: 'NICHT ABGEHOLT · Fach 19 (Unterdeck)',
    isTarget: true,
  },
  {
    id: 'f419',
    code: 'F-419',
    item: 'Kinder-Stoffmütze (blau-weiß gestreift)',
    origin: 'Kinderclub · Deck 6',
    loggedAt: 'Tag 5 · 08:10',
    status: 'Noch im Regal · Fach 22',
  },
];

export function FundbueroLogMiniGame({
  onComplete,
  onCancel,
}: {
  onComplete: () => void;
  onCancel: () => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState(
    'Prüfe die letzten Einträge im Fundbüro-Register und tippe auf den Vermerk zu Andrews Schal.'
  );
  const [isSolved, setIsSolved] = useState(false);

  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const finishLog = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    onCompleteRef.current();
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

  const handleSelectEntry = (entry: LostItemEntry) => {
    if (isSolved) return;
    setSelectedId(entry.id);
    if (entry.isTarget) {
      soundFx.play('deduction');
      setIsSolved(true);
      setFeedback(
        'BEWIESEN!! Eintrag F-418: Um 21:40 Uhr aus der Wäscherei eingelagert und NIE abgeholt — hier unten im Crew-Bereich verschwunden!'
      );
    } else {
      soundFx.play('penalty');
      setFeedback(
        `${entry.code} (${entry.item}) hat nichts mit unserem Seidenschal aus der Wäscherei zu tun.`
      );
    }
  };

  return (
    <div className="absolute inset-0 z-30 bg-slate-950/92 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="max-w-2xl w-full max-h-full overflow-y-auto bg-slate-900 border border-amber-500/40 rounded-xl p-4 sm:p-5 shadow-2xl space-y-3.5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
              <ClipboardList className="w-4 h-4" />
              <span>Fundbüro-Register · MS Aurora Unterdeck</span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Suche im offenen Protokollbuch nach dem Eintrag aus der Bord-Wäscherei und prüfe die
              Spalte „Abgeholt“.
            </p>
          </div>
          <button
            type="button"
            onClick={isSolved ? finishLog : onCancel}
            aria-label="Register schließen"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1.5">
          {FUNDBUERO_ENTRIES.map((entry) => {
            const active = selectedId === entry.id;
            return (
              <button
                key={entry.id}
                type="button"
                disabled={isSolved}
                onClick={() => handleSelectEntry(entry)}
                className={`w-full text-left p-2.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                  active && entry.isTarget
                    ? 'bg-emerald-950/50 border-emerald-400 text-emerald-100'
                    : active
                      ? 'bg-red-950/40 border-red-500/60 text-red-100'
                      : 'bg-slate-950/75 hover:bg-slate-800 border-slate-800 text-slate-200'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 font-semibold">
                    <span className="font-mono-num text-amber-300">{entry.code}</span>
                    <span>{entry.item}</span>
                  </div>
                  <span className="font-mono-num text-[11px] text-slate-400">{entry.loggedAt}</span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 mt-1">
                  <span>Fundort: {entry.origin}</span>
                  <span
                    className={
                      entry.isTarget && active
                        ? 'text-amber-300 font-bold'
                        : 'text-slate-300 font-medium'
                    }
                  >
                    {entry.status}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div
          className={`px-3 py-2 rounded-lg border text-xs leading-relaxed ${
            isSolved
              ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-200 font-semibold'
              : 'bg-slate-950/80 border-slate-800 text-slate-300'
          }`}
        >
          {feedback}
        </div>

        {isSolved && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={finishLog}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Protokoll-Befund sichern</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// MINISPIEL 6 (FALL 3.2 · AUFGABE 3): NACHT-DIENSTPLAN-RÄTSEL AUF DER BRÜCKE
// =============================================================================

type SailorId = 'kalle' | 'timo' | 'svenja';
type DeckDutyId = 'deck10' | 'deck5' | 'deck2';

const SAILOR_LIST: { id: SailorId; name: string; note: string }[] = [
  { id: 'kalle', name: 'Kalle Jensen', note: 'Decks-Matrose · trägt gern Retro-Kopfhörer' },
  { id: 'timo', name: 'Timo Berger', note: 'Kabinen-Steward · Nachtschicht-Springer' },
  { id: 'svenja', name: 'Svenja Holm', note: 'Unterdeck-Matrosin · streng innen eingesetzt' },
];

const DECK_OPTIONS: { id: DeckDutyId; label: string }[] = [
  { id: 'deck10', label: 'Deck 10 · Pool- & Spieldeck (02:10 Zitrus-Reinigung)' },
  { id: 'deck5', label: 'Deck 5 · Kabinenkorridor (Teppich- & Flurkontrolle)' },
  { id: 'deck2', label: 'Deck 2 · Maschinen- & Gangwache (Unterdeck)' },
];

export function DutyRosterPuzzleMiniGame({
  onComplete,
  onCancel,
}: {
  onComplete: () => void;
  onCancel: () => void;
}) {
  const [assignments, setAssignments] = useState<Record<SailorId, DeckDutyId | null>>({
    kalle: null,
    timo: null,
    svenja: null,
  });
  const [feedback, setFeedback] = useState(
    'Ordne anhand von Kapitän Brammers vier Wach-Regeln jedem Besatzungsmitglied das richtige Nachtdeck (00:00–04:00 Uhr) zu!'
  );
  const [isSolved, setIsSolved] = useState(false);

  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const allPicked = Boolean(assignments.kalle && assignments.timo && assignments.svenja);

  const finishRoster = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    onCompleteRef.current();
  };

  useEffect(() => {
    if (!isSolved) return;
    const t = window.setTimeout(() => {
      if (completedRef.current) return;
      completedRef.current = true;
      onCompleteRef.current();
    }, 900);
    return () => window.clearTimeout(t);
  }, [isSolved]);

  const handleAssign = (sailor: SailorId, deck: DeckDutyId) => {
    if (isSolved) return;
    soundFx.play('blip');
    setAssignments((prev) => {
      const next = { ...prev };
      (Object.keys(next) as SailorId[]).forEach((k) => {
        if (next[k] === deck) next[k] = null;
      });
      next[sailor] = prev[sailor] === deck ? null : deck;
      return next;
    });
  };

  const handleVerify = () => {
    if (
      assignments.svenja === 'deck2' &&
      assignments.timo === 'deck5' &&
      assignments.kalle === 'deck10'
    ) {
      soundFx.play('deduction');
      setIsSolved(true);
      setFeedback(
        'GENAU RICHTIG!! Matrose Kalle Jensen hatte um 02:10 Uhr Nachtdienst auf Deck 10 — und hält jetzt tagsüber am Pooldeck Wache!'
      );
    } else {
      soundFx.play('penalty');
      setFeedback(
        'Das stimmt noch nicht ganz mit Brammers Wach-Regeln überein: Prüfe genau, wer innen bleiben muss und wer auf Deck 5 saugt!'
      );
    }
  };

  return (
    <div className="absolute inset-0 z-30 bg-slate-950/92 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="max-w-2xl w-full max-h-full overflow-y-auto bg-slate-900 border border-sky-500/40 rounded-xl p-4 sm:p-5 shadow-2xl space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-300">
              <ClipboardList className="w-4 h-4" />
              <span>Nacht-Dienstplan rekonstruieren · Kommandobrücke</span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Kapitän Brammer rückt die Namen nicht einfach heraus — kombiniere seine vier
              Brücken-Regeln zum Schichtplan (00:00–04:00 Uhr):
            </p>
          </div>
          <button
            type="button"
            onClick={isSolved ? finishRoster : onCancel}
            aria-label="Dienstplan schließen"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-slate-950/75 border border-slate-800 rounded-lg p-3 text-[11px] text-slate-300 space-y-1">
          <div>1. Svenja Holm hat eine ärztliche Befreiung für alle Außendecks und darf nachts nur tief im Schiffsinneren eingesetzt werden.</div>
          <div>2. Timo Berger war für die Teppich- und Flurkontrolle auf dem Passagier-Korridor von Deck 5 eingeteilt.</div>
          <div>3. Genau um 02:10 Uhr nachts lief oben unter freiem Himmel auf Deck 10 die Zitrus-Deckspülung.</div>
          <div>4. Wer in der Nacht auf Deck 10 stand, übernimmt heute Nachmittag den Dienst an der Pool-Theke (Deck 10).</div>
        </div>

        <div className="space-y-2">
          {SAILOR_LIST.map((sailor) => {
            const current = assignments[sailor.id];
            return (
              <div
                key={sailor.id}
                className="bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 space-y-2"
              >
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-bold text-slate-100">{sailor.name}</span>
                  <span className="text-[11px] text-slate-400">{sailor.note}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                  {DECK_OPTIONS.map((deck) => {
                    const selected = current === deck.id;
                    return (
                      <button
                        key={deck.id}
                        type="button"
                        disabled={isSolved}
                        onClick={() => handleAssign(sailor.id, deck.id)}
                        className={`text-left px-2.5 py-2 rounded-md border text-[11px] transition-colors cursor-pointer ${
                          selected
                            ? 'bg-sky-500/25 border-sky-400 text-sky-100 font-semibold'
                            : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
                        }`}
                      >
                        {deck.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div
          className={`px-3 py-2 rounded-lg border text-xs leading-relaxed ${
            isSolved
              ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-200 font-semibold'
              : 'bg-slate-950/80 border-slate-800 text-slate-300'
          }`}
        >
          {feedback}
        </div>

        <div className="flex justify-end">
          {isSolved ? (
            <button
              type="button"
              onClick={finishRoster}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Hoch zum Pooldeck (Deck 10)!</span>
            </button>
          ) : (
            <button
              type="button"
              disabled={!allPicked}
              onClick={handleVerify}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 text-xs font-bold rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              Dienstplan prüfen
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// MINISPIEL 7 (FALL 3.2 · AUFGABE 3): KARTEN- & LAUFWEG-BEWEIS (ALIBI 01:58–02:23)
// =============================================================================

type DeckZoneId = 'deck10' | 'deck5' | 'deck2';
type PinType = 'camera' | 'witness' | 'murder';
type RouteNodeId = 'cam_start' | 'witness_pool' | 'cam_end' | 'murder_cell';

const PIN_META: { id: PinType; label: string; time: string; correctDeck: DeckZoneId }[] = [
  {
    id: 'camera',
    label: 'Überwachungskamera (Andrew geht & kehrt zurück)',
    time: '01:58 & 02:23 Uhr',
    correctDeck: 'deck5',
  },
  {
    id: 'witness',
    label: 'Zeuge Kalle Jensen (trifft Andrew suchend)',
    time: '02:12 Uhr',
    correctDeck: 'deck10',
  },
  {
    id: 'murder',
    label: 'Mordfall / Stuhlkrach in Zelle 08',
    time: '02:04–02:19 Uhr',
    correctDeck: 'deck2',
  },
];

const ROUTE_NODES: Record<
  RouteNodeId,
  { id: RouteNodeId; shortTitle: string; time: string; x: number; y: number; deck: DeckZoneId }
> = {
  cam_start: {
    id: 'cam_start',
    shortTitle: 'Kamera-Aufbruch',
    time: '01:58 Uhr',
    x: 20,
    y: 50,
    deck: 'deck5',
  },
  witness_pool: {
    id: 'witness_pool',
    shortTitle: 'Zeuge Kalle',
    time: '02:12 Uhr',
    x: 50,
    y: 18,
    deck: 'deck10',
  },
  cam_end: {
    id: 'cam_end',
    shortTitle: 'Kamera-Rückkehr',
    time: '02:23 Uhr',
    x: 80,
    y: 50,
    deck: 'deck5',
  },
  murder_cell: {
    id: 'murder_cell',
    shortTitle: 'Zelle 08',
    time: '02:04–02:19',
    x: 50,
    y: 82,
    deck: 'deck2',
  },
};

const ROUTE_STEP_SEQUENCE: { nodeId: RouteNodeId; label: string }[] = [
  { nodeId: 'cam_start', label: '01:58 Uhr · Kamera Deck 5 (Start)' },
  { nodeId: 'witness_pool', label: '02:12 Uhr · Zeuge Kalle Deck 10' },
  { nodeId: 'cam_end', label: '02:23 Uhr · Kamera Deck 5 (Rückkehr)' },
];

const DECK_BANDS: { id: DeckZoneId; title: string; badge: string; topPct: number }[] = [
  {
    id: 'deck10',
    title: 'Deck 10 · Pool- & Kinder-Oberdeck',
    badge: 'Freiluftdeck oben',
    topPct: 4,
  },
  {
    id: 'deck5',
    title: 'Deck 5 · Kabinenkorridor (Suite 518)',
    badge: 'Mitteldeck',
    topPct: 36,
  },
  {
    id: 'deck2',
    title: 'Deck 2 · Zellentrakt (Zelle 08)',
    badge: 'Unterdeck',
    topPct: 68,
  },
];

export function AlibiRouteMapMiniGame({
  onComplete,
  onCancel,
}: {
  onComplete: () => void;
  onCancel: () => void;
}) {
  const [phase, setPhase] = useState<'place_pins' | 'draw_route' | 'solved'>('place_pins');
  const [activePin, setActivePin] = useState<PinType>('camera');
  const [placedPins, setPlacedPins] = useState<Record<PinType, DeckZoneId | null>>({
    camera: null,
    witness: null,
    murder: null,
  });
  const [routeNodes, setRouteNodes] = useState<RouteNodeId[]>([]);
  const [dragOrigin, setDragOrigin] = useState<RouteNodeId | null>(null);
  const [dragCursor, setDragCursor] = useState<{ x: number; y: number } | null>(null);
  const [feedback, setFeedback] = useState(
    'Schritt 1: Wähle einen Marker unten aus und klicke dann auf das passende Schiffsdeck auf der Karte.'
  );

  const mapBoxRef = useRef<HTMLDivElement | null>(null);
  const dragOriginRef = useRef<RouteNodeId | null>(null);
  const dragStartClientRef = useRef<{ x: number; y: number } | null>(null);
  const hasDraggedRef = useRef(false);
  const suppressClickRef = useRef(false);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const finishMap = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    onCompleteRef.current();
  };

  const handleClickDeck = (deckId: DeckZoneId) => {
    if (phase !== 'place_pins') return;
    soundFx.play('blip');
    const nextPlaced: Record<PinType, DeckZoneId | null> = { ...placedPins };
    (Object.keys(nextPlaced) as PinType[]).forEach((p) => {
      if (nextPlaced[p] === deckId) nextPlaced[p] = null;
    });
    nextPlaced[activePin] = deckId;
    setPlacedPins(nextPlaced);

    const nextUnplaced = PIN_META.find((p) => !nextPlaced[p.id]);
    if (nextUnplaced) setActivePin(nextUnplaced.id);
  };

  const handleRouteNodeSelect = (nodeId: RouteNodeId) => {
    if (phase !== 'draw_route') return;

    const expected = ROUTE_STEP_SEQUENCE[routeNodes.length];
    if (!expected) return;

    if (nodeId === expected.nodeId) {
      soundFx.play('evidence_chime');
      const nextRoute = [...routeNodes, nodeId];
      setRouteNodes(nextRoute);
      if (nextRoute.length === ROUTE_STEP_SEQUENCE.length) {
        soundFx.play('deduction');
        setPhase('solved');
        setFeedback(
          'BEWIESEN!! 01:58 Deck 5 ➔ 02:12 Deck 10 ➔ 02:23 Deck 5 = 25 Minuten Suchweg oben an Deck! Unmöglich um 02:04–02:19 Uhr unten in Zelle 08 gewesen zu sein!'
        );
      } else {
        const upcoming = ROUTE_STEP_SEQUENCE[nextRoute.length];
        setFeedback(
          nextRoute.length === 1
            ? `Startpunkt gesetzt! Verbinde oder klicke als Nächstes: ${upcoming.label}`
            : `Linie gezeichnet! Verbinde oder klicke als Nächstes: ${upcoming.label}`
        );
      }
      return;
    }

    if (routeNodes.includes(nodeId)) {
      soundFx.play('blip');
      setFeedback(`Diesen Punkt hast du bereits verbunden! Nächster Schritt: ${expected.label}`);
      return;
    }

    soundFx.play('penalty');
    setFeedback(
      nodeId === 'murder_cell'
        ? 'Halt! Auf Deck 2 (Zelle 08) wurde Andrew überhaupt nicht gesehen — verbinde seinen ECHTEN Weg (01:58 ➔ 02:12 ➔ 02:23 Uhr)!'
        : `Falsche Reihenfolge! Nächster chronologischer Punkt: ${expected.label}`
    );
  };

  // Drag-to-draw line support alongside single-click selection
  useEffect(() => {
    if (phase !== 'draw_route') return;

    const getPctPos = (clientX: number, clientY: number) => {
      const box = mapBoxRef.current?.getBoundingClientRect();
      if (!box || box.width === 0 || box.height === 0) return null;
      const x = Math.max(2, Math.min(98, ((clientX - box.left) / box.width) * 100));
      const y = Math.max(2, Math.min(98, ((clientY - box.top) / box.height) * 100));
      return { x, y };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragOriginRef.current || !dragStartClientRef.current) return;
      const dx = e.clientX - dragStartClientRef.current.x;
      const dy = e.clientY - dragStartClientRef.current.y;
      if (Math.hypot(dx, dy) > 8) {
        hasDraggedRef.current = true;
        const pos = getPctPos(e.clientX, e.clientY);
        if (pos) setDragCursor(pos);
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!dragOriginRef.current) return;
      const origin = dragOriginRef.current;
      const dragged = hasDraggedRef.current;

      dragOriginRef.current = null;
      dragStartClientRef.current = null;
      hasDraggedRef.current = false;
      setDragOrigin(null);
      setDragCursor(null);

      // Suppress synthetic click if pointerDown already started the route or user dragged
      if (dragged || suppressClickRef.current) {
        suppressClickRef.current = true;
        window.setTimeout(() => {
          suppressClickRef.current = false;
        }, 60);
      }

      if (!dragged) return;

      const els = document.elementsFromPoint(e.clientX, e.clientY);
      const hitBtn = els.find((el) => el.hasAttribute('data-route-node')) as HTMLElement | undefined;
      const targetId = hitBtn?.getAttribute('data-route-node') as RouteNodeId | null;
      if (targetId && targetId !== origin) {
        handleRouteNodeSelect(targetId);
      }
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  });

  const handleNodePointerDown = (nodeId: RouteNodeId, e: React.PointerEvent) => {
    if (phase !== 'draw_route') return;
    const lastConnected = routeNodes[routeNodes.length - 1];
    // Allow dragging from the current path tip, OR starting directly from cam_start
    if (routeNodes.length === 0 && nodeId === 'cam_start') {
      soundFx.play('evidence_chime');
      setRouteNodes(['cam_start']);
      setFeedback('Startpunkt 01:58 Uhr gewählt — ziehe oder klicke weiter nach Deck 10 (02:12 Uhr)!');
      dragOriginRef.current = 'cam_start';
      dragStartClientRef.current = { x: e.clientX, y: e.clientY };
      hasDraggedRef.current = false;
      setDragOrigin('cam_start');
      suppressClickRef.current = true;
    } else if (lastConnected === nodeId) {
      dragOriginRef.current = nodeId;
      dragStartClientRef.current = { x: e.clientX, y: e.clientY };
      hasDraggedRef.current = false;
      setDragOrigin(nodeId);
    }
  };

  const handleConfirmPins = () => {
    const allCorrect = PIN_META.every((p) => placedPins[p.id] === p.correctDeck);
    if (allCorrect) {
      soundFx.play('evidence_chime');
      setPhase('draw_route');
      setRouteNodes([]);
      setFeedback(
        'Schritt 2: Alle 3 Marker sitzen! Klicke der Reihe nach (oder ziehe eine Linie): 01:58 Uhr Deck 5 ➔ 02:12 Uhr Deck 10 ➔ 02:23 Uhr Deck 5!'
      );
    } else {
      soundFx.play('penalty');
      setFeedback(
        'Mindestens ein Marker sitzt noch auf dem falschen Deck: Kamera vor Kabine 518 = Deck 5, Kalle am Pooldeck = Deck 10, Zelle 08 = Deck 2!'
      );
    }
  };

  const deckPinLabel = (deckId: DeckZoneId) => {
    const pinEntry = PIN_META.find((p) => placedPins[p.id] === deckId);
    return pinEntry ? `${pinEntry.label.split(' (')[0]} (${pinEntry.time})` : 'Klicken zum Markieren';
  };

  return (
    <div className="absolute inset-0 z-30 bg-slate-950/92 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="max-w-2xl w-full max-h-full overflow-y-auto bg-slate-900 border border-sky-500/40 rounded-xl p-4 sm:p-5 shadow-2xl space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-300">
              <Route className="w-4 h-4" />
              <span>Schiffskarte &amp; Laufweg-Rekonstruktion · 01:58–02:23 Uhr</span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {phase === 'place_pins'
                ? '1. Trage alle drei Ereignis-Marker auf den richtigen Schiffsdecks ein.'
                : '2. Verbinde Andrews tatsächlichen Laufweg (01:58 ➔ 02:12 ➔ 02:23 Uhr) per Klick oder Linie ziehen.'}
            </p>
          </div>
          <button
            type="button"
            onClick={phase === 'solved' ? finishMap : onCancel}
            aria-label="Karte schließen"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Interactive Ship Cross-Section Map */}
        <div
          ref={mapBoxRef}
          className="relative w-full h-[270px] sm:h-[300px] bg-slate-950 border border-slate-800 rounded-xl overflow-hidden select-none touch-none"
        >
          {/* Ship Cross-Section Deck Tiers */}
          {DECK_BANDS.map((zone) => {
            const hasPin = Object.values(placedPins).includes(zone.id);
            const commonClasses = `absolute left-[2.5%] right-[2.5%] h-[28%] rounded-lg border px-3 py-2 flex items-center justify-between gap-2 transition-all`;

            if (phase === 'place_pins') {
              return (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => handleClickDeck(zone.id)}
                  style={{ top: `${zone.topPct}%` }}
                  className={`${commonClasses} z-10 text-left cursor-pointer ${
                    hasPin
                      ? 'bg-sky-950/55 border-sky-400/80 text-sky-100'
                      : 'bg-slate-900/75 hover:bg-slate-800/90 border-slate-700 text-slate-200'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">{zone.title}</span>
                    </div>
                    <div className="text-[11px] text-slate-300 mt-0.5 truncate">
                      {deckPinLabel(zone.id)}
                    </div>
                  </div>
                  <span className="text-[10px] font-medium text-slate-400 shrink-0">
                    {zone.badge}
                  </span>
                </button>
              );
            }

            return (
              <div
                key={zone.id}
                style={{ top: `${zone.topPct}%` }}
                className={`${commonClasses} z-10 pointer-events-none bg-slate-900/55 border-slate-800/90 text-slate-400`}
              >
                <span className="text-[11px] font-semibold tracking-wide opacity-80">
                  {zone.title}
                </span>
                <span className="text-[10px] opacity-60">{zone.badge}</span>
              </div>
            );
          })}

          {/* Phase 2 & Solved: SVG Route Lines Rendered CLEARLY ON TOP of Deck Bands (z-20) */}
          {phase !== 'place_pins' && (
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-0 w-full h-full z-20"
            >
              {/* Confirmed Segment 1: Deck 5 Start -> Deck 10 Witness */}
              {routeNodes.length >= 2 && (
                <line
                  x1={ROUTE_NODES.cam_start.x}
                  y1={ROUTE_NODES.cam_start.y}
                  x2={ROUTE_NODES.witness_pool.x}
                  y2={ROUTE_NODES.witness_pool.y}
                  stroke="#34d399"
                  strokeWidth="4"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              )}

              {/* Confirmed Segment 2: Deck 10 Witness -> Deck 5 End */}
              {routeNodes.length >= 3 && (
                <line
                  x1={ROUTE_NODES.witness_pool.x}
                  y1={ROUTE_NODES.witness_pool.y}
                  x2={ROUTE_NODES.cam_end.x}
                  y2={ROUTE_NODES.cam_end.y}
                  stroke="#34d399"
                  strokeWidth="4"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              )}

              {/* Live rubberband line while dragging */}
              {dragOrigin && dragCursor && (
                <line
                  x1={ROUTE_NODES[dragOrigin].x}
                  y1={ROUTE_NODES[dragOrigin].y}
                  x2={dragCursor.x}
                  y2={dragCursor.y}
                  stroke="#fbbf24"
                  strokeWidth="3"
                  strokeDasharray="6 5"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              )}

              {/* Solved comparison: Falk's impossible Deck 5 <-> Deck 2 descent */}
              {phase === 'solved' && (
                <line
                  x1={50}
                  y1={50}
                  x2={ROUTE_NODES.murder_cell.x}
                  y2={ROUTE_NODES.murder_cell.y}
                  stroke="#ef4444"
                  strokeWidth="2.5"
                  strokeDasharray="6 6"
                  vectorEffect="non-scaling-stroke"
                />
              )}
            </svg>
          )}

          {/* Phase 2 & Solved: Waypoint Nodes Rendered ABOVE SVG lines (z-30) */}
          {phase !== 'place_pins' &&
            (Object.values(ROUTE_NODES) as (typeof ROUTE_NODES)[RouteNodeId][]).map((node) => {
              const stepIdx = routeNodes.indexOf(node.id);
              const isConnected = stepIdx !== -1;
              const isMurderNode = node.id === 'murder_cell';

              return (
                <button
                  key={node.id}
                  type="button"
                  data-route-node={node.id}
                  disabled={phase === 'solved'}
                  onPointerDown={(e) => handleNodePointerDown(node.id, e)}
                  onClick={() => {
                    if (suppressClickRef.current) return;
                    handleRouteNodeSelect(node.id);
                  }}
                  style={{
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className={`absolute z-30 px-2.5 py-1.5 rounded-lg border text-center transition-all shadow-lg cursor-pointer ${
                    isConnected
                      ? 'bg-emerald-600 border-emerald-200 text-slate-950 font-bold ring-2 ring-emerald-300/60'
                      : isMurderNode && phase === 'solved'
                        ? 'bg-red-950/90 border-red-400 text-red-200'
                        : 'bg-slate-800/95 hover:bg-slate-700 border-slate-500 text-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1 text-[11px] font-bold whitespace-nowrap">
                    {isConnected && (
                      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-slate-950 text-emerald-300 text-[10px]">
                        {stepIdx + 1}
                      </span>
                    )}
                    <span>{node.shortTitle}</span>
                  </div>
                  <div
                    className={`font-mono-num text-[10px] leading-tight ${
                      isConnected ? 'text-slate-900 font-semibold' : 'text-slate-300'
                    }`}
                  >
                    {isMurderNode && phase === 'solved' ? '✗ Kein Aufenthalt' : node.time}
                  </div>
                </button>
              );
            })}
        </div>

        {/* Pin Selector Buttons in Phase 1 */}
        {phase === 'place_pins' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
            {PIN_META.map((pin) => {
              const isSelected = activePin === pin.id;
              const isPlaced = Boolean(placedPins[pin.id]);
              return (
                <button
                  key={pin.id}
                  type="button"
                  onClick={() => setActivePin(pin.id)}
                  className={`text-left p-2 rounded-lg border text-[11px] transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-400 text-amber-100'
                      : isPlaced
                        ? 'bg-slate-950/90 border-emerald-500/40 text-emerald-200'
                        : 'bg-slate-950/70 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="font-bold truncate">{pin.label}</div>
                  <div className="font-mono-num text-[10px] text-slate-400 mt-0.5">{pin.time}</div>
                </button>
              );
            })}
          </div>
        )}

        <div
          className={`px-3 py-2 rounded-lg border text-xs leading-relaxed ${
            phase === 'solved'
              ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-200 font-semibold'
              : 'bg-slate-950/80 border-slate-800 text-slate-300'
          }`}
        >
          {feedback}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          {phase === 'draw_route' ? (
            <button
              type="button"
              onClick={() => {
                soundFx.play('page_turn');
                setRouteNodes([]);
                setFeedback(
                  'Laufweg zurückgesetzt! Beginne bei „Kamera-Aufbruch (01:58 Uhr)“ auf Deck 5.'
                );
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Linie neu ziehen</span>
            </button>
          ) : (
            <div />
          )}

          {phase === 'place_pins' && (
            <button
              type="button"
              disabled={!PIN_META.every((p) => Boolean(placedPins[p.id]))}
              onClick={handleConfirmPins}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 text-xs font-bold rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              Marker prüfen &amp; Laufweg zeichnen
            </button>
          )}
          {phase === 'solved' && (
            <button
              type="button"
              onClick={finishMap}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Nacht-Alibi sichern</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// MINISPIEL 8 (FALL 3.2 · AUFGABE 1): 10 HANDBÜCHER BEI KOWALSKI + AUSWAHL
// =============================================================================

interface WorkshopBook {
  id: string;
  code: string;
  title: string;
  hint: string;
  x: number;
  y: number;
  w: number;
  h: number;
  isTarget?: boolean;
}

const KOWALSKI_BOOKS: WorkshopBook[] = [
  {
    id: 'bk_ka100',
    code: 'KA-100',
    title: 'KA-100 · Kabinen-Klimaanlagen & Lüfter',
    hint: 'Links an der grauen Metallwand auf der kleinen Schaltbox',
    x: 6.7,
    y: 34.5,
    w: 4.8,
    h: 9.5,
  },
  {
    id: 'bk_wd09',
    code: 'WD-09',
    title: 'WD-09 · Bord-Wäscherei Dampf-Trockner',
    hint: 'Links im aufgeklappten roten Werkzeugkoffer',
    x: 11.2,
    y: 76.5,
    w: 8.5,
    h: 9.5,
  },
  {
    id: 'bk_rp204',
    code: 'RP-204',
    title: 'RP-204 · Pooldeck Umwälzpumpe',
    hint: 'Ganz unten links auf den dicken Kupferkabeln',
    x: 7.4,
    y: 88.5,
    w: 11.0,
    h: 12.0,
  },
  {
    id: 'bk_br500',
    code: 'BR-500',
    title: 'BR-500 · Brücken-Radar & Echolot',
    hint: 'Im mittleren Regal hochkant zwischen den Metallkästen (gelber Ordner)',
    x: 30.8,
    y: 40.5,
    w: 3.8,
    h: 12.0,
  },
  {
    id: 'bk_th880',
    code: 'TH-880',
    title: 'TH-880 · Kühl-Thermostat (Zellenbereich)',
    hint: 'Oben im braunen Pappkarton direkt rechts neben dem grauen Lüfter',
    x: 55.3,
    y: 22.8,
    w: 5.8,
    h: 11.5,
  },
  {
    id: 'bk_kg310',
    code: 'KG-310',
    title: 'KG-310 · Kombüsen-Ofen & Friteuse',
    hint: 'Im Regal direkt aus dem kleinen Pappkarton bei den Schrauben-Boxen (oranges Heft)',
    x: 44.8,
    y: 53.8,
    w: 6.8,
    h: 10.5,
  },
  {
    id: 'bk_lt12',
    code: 'LT-12',
    title: 'LT-12 · Rettungsboot-Winden & Seilzug',
    hint: 'Auf der Werkbank direkt links hinter dem grünen Oszilloskop',
    x: 56.4,
    y: 60.8,
    w: 8.5,
    h: 7.5,
  },
  {
    id: 'bk_ms400',
    code: 'MS-400',
    title: 'MS-400 · Magnetschloss-System',
    hint: 'Flach auf der vorderen Holz-Werkbank direkt unter dem großen Bildschirm',
    x: 59.6,
    y: 69.2,
    w: 10.5,
    h: 8.0,
    isTarget: true,
  },
  {
    id: 'bk_av70',
    code: 'AV-70',
    title: 'AV-70 · Ballsaal Licht- & Tonmischpult',
    hint: 'Rechts an der Lochwand über dem Tisch neben der gelben Lampe',
    x: 89.4,
    y: 37.8,
    w: 6.8,
    h: 15.0,
  },
  {
    id: 'bk_fk99',
    code: 'FK-99',
    title: 'FK-99 · Schiffs-Kurzwellen-Funkgerät',
    hint: 'Rechts unten im geöffneten roten Werkzeugkoffer',
    x: 92.2,
    y: 66.8,
    w: 11.5,
    h: 11.5,
  },
];

export function KowalskiBooksHiddenMiniGame({
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
    'Durchsuche Kowalskis chaotische Werkstatt und klicke auf alle 10 verlegten Wartungs-Handbücher im Bild!'
  );

  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const finishBooks = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    onCompleteRef.current();
  };

  useEffect(() => {
    if (step !== 'solved') return;
    const t = window.setTimeout(() => {
      if (completedRef.current) return;
      completedRef.current = true;
      onCompleteRef.current();
    }, 1050);
    return () => window.clearTimeout(t);
  }, [step]);

  const handleFindBook = (book: WorkshopBook) => {
    if (step !== 'hunt' || foundIds.includes(book.id)) return;
    soundFx.play('page_turn');
    const next = [...foundIds, book.id];
    setFoundIds(next);
    setShowHint(false);

    if (next.length === KOWALSKI_BOOKS.length) {
      soundFx.play('evidence_chime');
      setStep('select');
      setFeedback(
        'Alle 10 Handbücher liegen auf dem Tisch! Welches davon gehört genau zu unserem gesicherten Zellenschloss aus Fall 2?'
      );
    } else {
      setFeedback(`Gefunden (${next.length}/10): ${book.title}`);
    }
  };

  const handlePickManual = (book: WorkshopBook) => {
    if (step !== 'select') return;
    if (book.isTarget) {
      soundFx.play('deduction');
      setStep('solved');
      setFeedback(
        'TREFFER!! Im MS-400-Handbuch schlagen wir genau das Kapitel „Bekannte Fehler“ auf — DIE KOMPLETTE SEITE WURDE HERAUSGERISSEN!!'
      );
    } else {
      soundFx.play('penalty');
      setTriedWrongIds((prev) => (prev.includes(book.id) ? prev : [...prev, book.id]));
      setFeedback(
        `${book.code} hilft uns beim Zellenschloss leider nicht weiter — wir suchen genau die Baureihe des Magnetschlosses von Zelle 08!`
      );
    }
  };

  const nextMissing = KOWALSKI_BOOKS.find((b) => !foundIds.includes(b.id));

  return (
    <div className="absolute inset-0 z-30 bg-slate-950/92 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="max-w-3xl w-full max-h-full overflow-y-auto bg-slate-900 border border-amber-500/40 rounded-xl p-4 sm:p-5 shadow-2xl space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
              <Wrench className="w-4 h-4" />
              <span>Kowalskis Werkstatt · 10 Wartungshandbücher</span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {step === 'hunt'
                ? 'Entdecke alle 10 versteckten Handbücher direkt zwischen Kabelrollen, Regalen und Werkzeugkästen.'
                : 'Wähle aus den 10 gefundenen Handbüchern genau das Schloss-Handbuch aus!'}
            </p>
          </div>
          <button
            type="button"
            onClick={step === 'solved' ? finishBooks : onCancel}
            aria-label="Werkstatt-Suche schließen"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {step === 'hunt' ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-1.5">
              <span className="font-mono-num font-bold text-amber-300">
                Gefunden: {foundIds.length} / {KOWALSKI_BOOKS.length} Handbücher
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
              <div className="px-3 py-1.5 rounded-lg bg-sky-950/40 border border-sky-500/40 text-[11px] text-sky-200">
                Tipp für ein fehlendes Buch: {nextMissing.hint}
              </div>
            )}

            <div className="relative w-full aspect-video max-w-[600px] mx-auto rounded-xl overflow-hidden border border-slate-700 bg-slate-950 select-none">
              <img
                src={resolveAssetPath('/src/assets/images/kowalski_books_clean_1795426739394.jpg')}
                alt="Kowalskis unordentliche Elektriker-Werkstatt mit zehn versteckten Handbüchern"
                referrerPolicy="no-referrer"
                onClick={() => {
                  soundFx.play('blip');
                  setFeedback('Hier liegen nur Werkzeuge und Kabel — schau genau in den Kästen, Regalen und auf dem Tisch nach den bunten Handbüchern!');
                }}
                className="w-full h-full object-fill cursor-zoom-in"
              />
              {KOWALSKI_BOOKS.map((book) => {
                const found = foundIds.includes(book.id);
                return (
                  <button
                    key={book.id}
                    type="button"
                    aria-label={found ? `Bereits gefunden: ${book.code}` : `Handbuch finden (${book.code})`}
                    disabled={found}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFindBook(book);
                    }}
                    style={{
                      left: `${book.x}%`,
                      top: `${book.y}%`,
                      width: `${book.w}%`,
                      height: `${book.h}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    className={`absolute rounded-md flex items-center justify-center transition-all focus:outline-none ${
                      found
                        ? 'border-2 border-emerald-400/90 bg-emerald-500/20 cursor-default'
                        : 'bg-transparent border-0 hover:bg-amber-300/15 cursor-pointer'
                    }`}
                  >
                    {found && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-300 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {KOWALSKI_BOOKS.map((book) => {
              const wrong = triedWrongIds.includes(book.id);
              const pickedTarget = step === 'solved' && book.isTarget;
              return (
                <button
                  key={book.id}
                  type="button"
                  disabled={step === 'solved' || wrong}
                  onClick={() => handlePickManual(book)}
                  className={`text-left px-3 py-2 rounded-lg border text-xs transition-colors cursor-pointer ${
                    pickedTarget
                      ? 'bg-emerald-950/60 border-emerald-400 text-emerald-100 font-bold'
                      : wrong
                        ? 'bg-slate-950/50 border-slate-800 text-slate-500 line-through cursor-not-allowed'
                        : 'bg-slate-950/80 hover:bg-slate-800 border-slate-700 text-slate-100'
                  }`}
                >
                  {book.title}
                </button>
              );
            })}
          </div>
        )}

        <div
          className={`px-3 py-2 rounded-lg border text-xs leading-relaxed ${
            step === 'solved'
              ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-200 font-semibold'
              : 'bg-slate-950/80 border-slate-800 text-slate-300'
          }`}
        >
          {feedback}
        </div>

        {step === 'solved' && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={finishBooks}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Herausgerissene Seite dokumentieren</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

