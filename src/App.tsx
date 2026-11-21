import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen,
  Brain,
  Gavel,
  GitBranch,
  RotateCcw,
  Scale,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { AnimatedIntro } from './components/AnimatedIntro';
import {
  AnimatedOutro,
  CRETE_ACT22_OUTRO_SLIDES,
  CRETE_ACT23_OUTRO_SLIDES,
} from './components/AnimatedOutro';
import { CaseBinder, type BinderTab } from './components/CaseBinder';
import { GameStage, type InvestigationMenu } from './components/GameStage';
import { CRUISE_CASE } from './data/cruiseCase';
import { CRETE_ACT23_INTRO_LINES, CRETE_CASE } from './data/creteCase';
import type {
  Character,
  CheckpointEntry,
  DialogLine,
  GameCase,
  GameCheckpointSnapshot,
  GameSaveState,
  MiniGameId,
  ShoutType,
} from './types/game';
import { soundFx } from './utils/soundFx';

const ALL_CASES: GameCase[] = [CRUISE_CASE, CRETE_CASE];
const CASE_MAP: Record<string, GameCase> = {
  [CRUISE_CASE.id]: CRUISE_CASE,
  [CRETE_CASE.id]: CRETE_CASE,
};

function getStorageKey(caseId: string): string {
  return caseId === CRUISE_CASE.id
    ? 'advokat_engine_save_v4'
    : `advokat_engine_save_v4_${caseId}`;
}

function extractCheckpointSnapshot(s: GameSaveState): GameCheckpointSnapshot {
  const { trialCheckpoint: _t, chapterCheckpoint: _c, ...rest } = s;
  return {
    ...rest,
    flags: { ...rest.flags },
    unlockedLocations: [...rest.unlockedLocations],
    collectedEvidence: [...rest.collectedEvidence],
    unlockedThoughts: [...rest.unlockedThoughts],
    solvedDeductions: [...rest.solvedDeductions],
    visitedTopics: [...rest.visitedTopics],
    inspectedHotspots: [...rest.inspectedHotspots],
  };
}

function createInitialState(caseDef: GameCase = CRUISE_CASE): GameSaveState {
  return {
    caseId: caseDef.id,
    screen: 'TITLE_MENU',
    phase: 'investigation',
    currentChapterId: caseDef.initialChapterId ?? 'kap1_tag1_abend',
    pendingChapterTransition: null,
    credibility: 5,
    maxCredibility: 5,
    currentLocationId: caseDef.initialLocationId,
    unlockedLocations: [...caseDef.initialUnlockedLocations],
    collectedEvidence: [...caseDef.initialEvidenceIds],
    unlockedThoughts: [...caseDef.initialThoughtIds],
    solvedDeductions: [],
    flags: {},
    visitedTopics: [],
    inspectedHotspots: [],
    activeTestimonyId: null,
    statementIndex: 0,
    trialCheckpoint: null,
    chapterCheckpoint: null,
  };
}

const KAP4_MORGEN_INTRO_LINES: DialogLine[] = [
  {
    speakerId: 'maya',
    emotion: 'confident',
    text: 'Tag 3, Morgen! Draußen am Horizont tauchen bereits die Umrisse von Kreta auf – und drinnen im Großen Ballsaal beginnt gleich das endgültige Hauptverfahren!',
  },
  {
    speakerId: 'pendelton',
    emotion: 'neutral',
    animation: 'slam',
    sfx: 'gavel_double',
    text: 'Ruhe im Ballsaal! Das endgültige Hauptverfahren um den gestohlenen Goldenen Chronometer und den Fund in Kabine 312 ist hiermit eröffnet!',
  },
  {
    speakerId: 'falk',
    emotion: 'smug',
    text: 'Heute gibt es keine Ausreden mehr, Sterling! Die Beute lag direkt unter dem Bett Ihrer Mandantin! Detective Marston, erklären Sie dem Gericht endlich, warum Sie Miss Brooks erneut verhaften mussten!',
    startsTestimonyId: 'testimony_kap4_marston',
  },
];

function createFinalTrialCheckpoint(): CheckpointEntry {
  const snapshot: GameCheckpointSnapshot = {
    caseId: CRUISE_CASE.id,
    screen: 'PLAYING',
    phase: 'court',
    currentChapterId: 'kap4_tag3_morgen',
    pendingChapterTransition: null,
    credibility: 5,
    maxCredibility: 5,
    currentLocationId: 'courtroom',
    unlockedLocations: ['suite', 'brig', 'deck', 'cabin_312', 'courtroom'],
    collectedEvidence: [
      'ausweis_nate',
      'tatort_bericht',
      'vitrine_glocke',
      'weinglas_spur',
      'musik_alibi',
      'balkon_fluchtweg',
      'keycard_log',
      'chronometer_kabine_fund',
      'kabinen_tuch',
      'kabine_312_log',
      'schuldschein_brief',
    ],
    unlockedThoughts: Object.keys(CRUISE_CASE.thoughts),
    solvedDeductions: CRUISE_CASE.logicCombinations.map((c) => c.id),
    flags: {
      flag_glocke_gefunden: true,
      flag_wein_gefunden: true,
      flag_weinglas_lupe_noetig: true,
      flag_lupe_erhalten: true,
      flag_weinglas_untersucht: true,
      flag_arthur_abgewehrt: true,
      flag_balkon_spur_aktiv: true,
      flag_balkon_untersucht: true,
      flag_marston_ueberzeugt: true,
      flag_zeit_geloest: true,
      flag_flucht_geloest: true,
      flag_kap2_freispruch: true,
      flag_kabinen_twist: true,
      flag_kap3_tuch_gefunden: true,
      flag_kap3_log_erhalten: true,
      flag_kap3_brief_gefunden: true,
      flag_kap3_arthur_log_gezeigt: true,
      flag_kap3_arthur_gestand: true,
      flag_kap3_arthur_abgetreten: true,
      flag_kap3_trick_geloest: true,
      flag_kap3_motiv_geloest: true,
    },
    visitedTopics: [],
    inspectedHotspots: [],
    activeTestimonyId: null,
    statementIndex: 0,
  };
  return {
    label: CRUISE_CASE.chapters?.kap4_tag3_morgen?.dayLabel ?? 'Tag 3 · Morgen',
    introLines: [...KAP4_MORGEN_INTRO_LINES],
    snapshot,
  };
}

function createCreteAct22Checkpoint(): CheckpointEntry {
  const introLines: DialogLine[] = [
    {
      speakerId: 'maya',
      emotion: 'thinking',
      text: 'Tag 4, Mittag! Kommissar Dimitri hat vorhin oben beim Kapitän tatsächlich ordentlich Druck gemacht.',
    },
    {
      speakerId: 'nate',
      emotion: 'thinking',
      text: 'Immerhin dürfen wir uns jetzt endlich offiziell umschauen, statt direkt von Falk vor die Tür gesetzt zu werden.',
    },
    {
      speakerId: 'maya',
      emotion: 'thinking',
      text: 'Genau! Neben dem Gang vor Arrestzelle 08 steht uns ab sofort auch die Krankenstation offen – und bis zur Mittagsanhörung bleibt nicht mehr allzu viel Zeit.',
    },
    {
      speakerId: 'nate',
      emotion: 'thinking',
      text: 'Gehen wir strukturiert vor: Schauen wir zuerst bei Dr. Vance in der Krankenstation vorbei und hören uns unvoreingenommen an, was die medizinischen Unterlagen zur Nacht sagen.',
    },
  ];
  const snapshot: GameCheckpointSnapshot = {
    caseId: CRETE_CASE.id,
    screen: 'PLAYING',
    phase: 'investigation',
    currentChapterId: 'c2_akt2_mittag',
    pendingChapterTransition: null,
    credibility: 5,
    maxCredibility: 5,
    currentLocationId: 'infirmary',
    unlockedLocations: [
      'promenade',
      'music_salon',
      'vip_salon',
      'brig_cell',
      'infirmary',
    ],
    collectedEvidence: ['ausweis_nate', 'higginson_notiz'],
    unlockedThoughts: ['thought_c2_blockade'],
    solvedDeductions: [],
    flags: {
      flag_c2_a1_promenade: true,
      flag_c2_a1_music: true,
      flag_c2_a1_vip: true,
      flag_c2_brig_freigeschaltet: true,
      flag_c2_a1_rauswurf: true,
      flag_c2_a1_angenommen: true,
    },
    visitedTopics: [],
    inspectedHotspots: [],
    activeTestimonyId: null,
    statementIndex: 0,
  };
  return {
    label: CRETE_CASE.chapters?.c2_akt2_mittag?.dayLabel ?? 'Tag 4 · Mittag (Akt 2.2)',
    introLines,
    snapshot,
  };
}

function createCreteAct23Checkpoint(): CheckpointEntry {
  const snapshot: GameCheckpointSnapshot = {
    caseId: CRETE_CASE.id,
    screen: 'PLAYING',
    phase: 'investigation',
    currentChapterId: 'c2_akt3_nachmittag',
    pendingChapterTransition: null,
    credibility: 5,
    maxCredibility: 5,
    currentLocationId: 'promenade',
    unlockedLocations: ['promenade', 'brig_cell'],
    collectedEvidence: ['ausweis_nate', 'zellen_klima_protokoll'],
    unlockedThoughts: ['thought_c2_kuehlung_9grad'],
    solvedDeductions: [],
    flags: {
      flag_c2_a1_promenade: true,
      flag_c2_a1_music: true,
      flag_c2_a1_vip: true,
      flag_c2_brig_freigeschaltet: true,
      flag_c2_a1_rauswurf: true,
      flag_c2_a1_angenommen: true,
      flag_c2_a2_rettungsdeck_offen: true,
      flag_c2_a2_vance_befragt: true,
      flag_c2_a2_21grad_notiz: true,
      flag_c2_a2_brandt_protokoll: true,
      flag_c2_a2_walkie_indiz: true,
      flag_c2_a2_brandt_widerspruch_geloest: true,
      flag_c2_a2_zelle_offen: true,
      flag_c2_a2_seil_gesehen: true,
      flag_c2_a2_schloss_gesehen: true,
      flag_c2_a2_klima_geloest: true,
      flag_c2_a2_vance_temp_gefragt: true,
      flag_c2_a2_bruecke_freigeschaltet: true,
      flag_c2_a2_brandt_deck_done: true,
      flag_c2_a2_bruecke_geloest: true,
      flag_c2_tatzeit_geloest: true,
      flag_c2_dimitri_weg: true,
    },
    visitedTopics: [],
    inspectedHotspots: [],
    activeTestimonyId: null,
    statementIndex: 0,
  };
  return {
    label: CRETE_CASE.chapters?.c2_akt3_nachmittag?.dayLabel ?? 'Tag 4 · Nachmittag (Akt 2.3)',
    introLines: [...CRETE_ACT23_INTRO_LINES],
    snapshot,
  };
}

function createCreteAct24Checkpoint(): CheckpointEntry {
  const introLines: DialogLine[] = [
    {
      speakerId: 'pendelton',
      emotion: 'neutral',
      animation: 'slam',
      sfx: 'gavel_double',
      text: 'Ruhe im Ballsaal! Die Abendsitzung des Not-Tribunals wird eröffnet. Staatsanwalt von Falk – wen rufen Sie zu dem gefundenen Seidenschal in den Zeugenstand?',
    },
    {
      speakerId: 'falk',
      emotion: 'smug',
      text: 'Mit zweifelhaftem Vergnügen rufe ich die Eigentümerin des Tat-Hilfsmittels: Mrs. Eleonore Higginson!',
    },
    {
      speakerId: 'eleonore',
      emotion: 'shocked',
      animation: 'shock',
      sfx: 'evidence_chime',
      text: 'OH MEIN GOTT!! EIN ECHTER GERICHTSSAAL!! Andrew, mach schnell ein Foto – ich stehe genau an DEM Zeugenpult!! Hallo, Euer Ehren! Hallo, Herr Verteidiger!!',
      startsTestimonyId: 'testimony_c2_eleonore',
    },
  ];
  const snapshot: GameCheckpointSnapshot = {
    caseId: CRETE_CASE.id,
    screen: 'PLAYING',
    phase: 'court',
    currentChapterId: 'c2_akt4_abend',
    pendingChapterTransition: null,
    credibility: 5,
    maxCredibility: 5,
    currentLocationId: 'courtroom',
    unlockedLocations: [
      'promenade',
      'music_salon',
      'vip_salon',
      'brig_cell',
      'infirmary',
      'lifeboat_deck',
      'courtroom',
    ],
    collectedEvidence: [
      'ausweis_nate',
      'higginson_notiz',
      'obduktion_vorlaeufig',
      'brandt_wachbuch',
      'zellen_klima_protokoll',
      'lueftung_streich',
      'bruecken_log',
      'seidenschal_spur',
      'keycard_fragment',
      'beweis_brandt_luegt',
      'notiz_todeszeit_0210',
    ],
    unlockedThoughts: Object.keys(CRETE_CASE.thoughts).filter(
      (id) => id !== 'thought_c2_flashback_schacht'
    ),
    solvedDeductions: CRETE_CASE.logicCombinations.map((c) => c.id),
    flags: {
      flag_c2_a1_promenade: true,
      flag_c2_a1_music: true,
      flag_c2_a1_vip: true,
      flag_c2_brig_freigeschaltet: true,
      flag_c2_a1_rauswurf: true,
      flag_c2_a1_angenommen: true,
      flag_c2_a2_rettungsdeck_offen: true,
      flag_c2_a2_vance_befragt: true,
      flag_c2_a2_21grad_notiz: true,
      flag_c2_a2_brandt_protokoll: true,
      flag_c2_a2_walkie_indiz: true,
      flag_c2_a2_brandt_widerspruch_geloest: true,
      flag_c2_a2_zelle_offen: true,
      flag_c2_a2_seil_gesehen: true,
      flag_c2_a2_schloss_gesehen: true,
      flag_c2_a2_klima_geloest: true,
      flag_c2_a2_vance_temp_gefragt: true,
      flag_c2_a2_bruecke_freigeschaltet: true,
      flag_c2_a2_brandt_deck_done: true,
      flag_c2_a2_bruecke_geloest: true,
      flag_c2_tatzeit_geloest: true,
      flag_c2_dimitri_weg: true,
      flag_c2_a3_start: true,
      flag_c2_a3_rucksack_gesichtet: true,
      flag_c2_rucksack_gefunden: true,
      flag_c2_conrad_flucht: true,
      flag_c2_conrad_geloest: true,
      flag_c2_a3_bereit: true,
    },
    visitedTopics: [],
    inspectedHotspots: [],
    activeTestimonyId: null,
    statementIndex: 0,
  };
  return {
    label: CRETE_CASE.chapters?.c2_akt4_abend?.dayLabel ?? 'Tag 4 · Abend (Akt 2.4)',
    introLines,
    snapshot,
  };
}

function loadSavedState(caseId: string): GameSaveState | null {
  try {
    const raw = localStorage.getItem(getStorageKey(caseId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GameSaveState;
    if (!parsed || !parsed.currentLocationId) return null;
    return { ...parsed, caseId: parsed.caseId ?? caseId };
  } catch {
    return null;
  }
}

function buildRepeatInspectLine(label: string, repeatCount: number): DialogLine[] {
  if (repeatCount <= 1) {
    return [
      {
        speakerId: 'maya',
        emotion: 'neutral',
        text:
          label.length % 2 === 0
            ? `„${label}“ haben wir uns doch eben erst angesehen, Nate. Schauen wir mal, was es sonst noch gibt!`
            : `Das („${label}“) hatten wir schon, Nate – hier steckt nichts Neues mehr.`,
      },
    ];
  }
  if (repeatCount === 2) {
    return [
      {
        speakerId: 'maya',
        emotion: 'thinking',
        text: `Ähm, Nate? „${label}“ wird vom zweiten Anklicken auch nicht geheimnisvoller… such doch mal woanders im Raum!`,
      },
    ];
  }
  if (repeatCount === 3) {
    return [
      {
        speakerId: 'maya',
        emotion: 'sweating',
        text: `Ernsthaft jetzt?! Zum dritten Mal „${label}“?! Machst du das gerade absichtlich, um mich zu ärgern?!`,
      },
    ];
  }

  const mod = repeatCount % 3;
  if (mod === 0) {
    return [
      {
        speakerId: 'maya',
        emotion: 'confident',
        text: `Noch ein einziger Klick auf „${label}“ und ich trage dich eigenhändig zurück aufs Sonnendeck!`,
      },
    ];
  }
  if (mod === 1) {
    return [
      {
        speakerId: 'maya',
        emotion: 'shocked',
        shake: true,
        text: `Ich sage ab sofort kein Wort mehr zu „${label}“! Such. Woanders!`,
      },
    ];
  }
  return [
    {
      speakerId: 'maya',
      emotion: 'sweating',
      text: `Ach je… Immer noch „${label}“, Nate! Mein armer Notizblock weint gleich.`,
    },
  ];
}

export default function App() {
  const [state, setState] = useState<GameSaveState>(() => createInitialState(CRUISE_CASE));
  const [savedCaseIds, setSavedCaseIds] = useState<Record<string, boolean>>(() => ({
    [CRUISE_CASE.id]: Boolean(loadSavedState(CRUISE_CASE.id)),
    [CRETE_CASE.id]: Boolean(loadSavedState(CRETE_CASE.id)),
  }));
  const [dialogQueue, setDialogQueue] = useState<DialogLine[]>([]);
  const [activeShout, setActiveShout] = useState<ShoutType | null>(null);
  const [stageShake, setStageShake] = useState(false);
  const [presentMode, setPresentMode] = useState(false);
  const [investigationMenu, setInvestigationMenu] =
    useState<InvestigationMenu>('none');
  const [activeBinderTab, setActiveBinderTab] = useState<BinderTab | null>(null);
  const [repeatInspectCounts, setRepeatInspectCounts] = useState<Record<string, number>>({});
  const justFoundHotspotRef = useRef(false);
  const [muted, setMuted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showRestartModal, setShowRestartModal] = useState(false);
  const [activeMiniGame, setActiveMiniGame] = useState<MiniGameId | null>(null);
  const [devShortcutsUnlocked, setDevShortcutsUnlocked] = useState(false);
  const devTapRef = useRef<{ count: number; lastAt: number }>({ count: 0, lastAt: 0 });

  const handleSecretDevTap = () => {
    const now = Date.now();
    const nextCount = now - devTapRef.current.lastAt < 1400 ? devTapRef.current.count + 1 : 1;
    devTapRef.current = { count: nextCount, lastAt: now };
    if (nextCount >= 5) {
      devTapRef.current.count = 0;
      setDevShortcutsUnlocked((prev) => !prev);
      soundFx.play('thought_pop');
    }
  };

  const activeCase = CASE_MAP[state.caseId ?? CRUISE_CASE.id] ?? CRUISE_CASE;

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  // Persist playing state automatically per case
  useEffect(() => {
    if (state.screen === 'PLAYING') {
      const cid = state.caseId ?? CRUISE_CASE.id;
      try {
        localStorage.setItem(getStorageKey(cid), JSON.stringify(state));
        setSavedCaseIds((prev) => (prev[cid] ? prev : { ...prev, [cid]: true }));
      } catch {
        // Ignore storage quota issues
      }
    }
  }, [state]);

  // Preload voiced courtroom shouts ("Einspruch!", "Moment mal!", etc.)
  useEffect(() => {
    soundFx.preloadShouts();
  }, []);

  // Trigger line effects whenever top of dialogQueue changes
  const topLine = dialogQueue[0] ?? null;

  useEffect(() => {
    if (!topLine || !topLine.shout) {
      setActiveShout(null);
      return;
    }

    setActiveShout(topLine.shout);
    soundFx.playShout(topLine.shout);
    const t = window.setTimeout(() => setActiveShout(null), 1150);
    return () => window.clearTimeout(t);
  }, [topLine]);

  useEffect(() => {
    if (!topLine) return;

    if (topLine.sfx && !topLine.shout) {
      soundFx.play(topLine.sfx);
    }

    if (topLine.shake) {
      setStageShake(true);
      const t = window.setTimeout(() => setStageShake(false), 380);
      return () => window.clearTimeout(t);
    }
  }, [topLine]);

  // Apply side-effects (flags, evidence, thoughts, testimony start) when a line is shown
  useEffect(() => {
    if (!topLine) return;

    // If this line asks for final evidence, enable present mode and open binder automatically
    if (topLine.requiresFinalEvidencePrompt) {
      setPresentMode(true);
      setActiveBinderTab('akte');
    }

    let unlockAudio: 'evidence_chime' | 'thought_pop' | 'door_lock' | 'page_turn' | null = null;

    setState((prev) => {
      let changed = false;
      const next: GameSaveState = { ...prev };

      if (topLine.setsFlag && !prev.flags[topLine.setsFlag]) {
        next.flags = { ...prev.flags, [topLine.setsFlag]: true };
        changed = true;
      }

      if (
        topLine.unlocksEvidence &&
        !prev.collectedEvidence.includes(topLine.unlocksEvidence)
      ) {
        next.collectedEvidence = [...prev.collectedEvidence, topLine.unlocksEvidence];
        const ev = activeCase.evidence[topLine.unlocksEvidence];
        if (ev) showToast(`Beweis erhalten: ${ev.name}`);
        unlockAudio = 'evidence_chime';
        changed = true;
      }

      if (
        topLine.removesEvidence &&
        prev.collectedEvidence.includes(topLine.removesEvidence)
      ) {
        const baseList = next.collectedEvidence ?? prev.collectedEvidence;
        next.collectedEvidence = baseList.filter(
          (id) => id !== topLine.removesEvidence
        );
        const ev = activeCase.evidence[topLine.removesEvidence];
        if (ev) showToast(`Zurückgelegt: ${ev.name}`);
        if (!unlockAudio) unlockAudio = 'page_turn';
        changed = true;
      }

      if (
        topLine.unlocksThought &&
        !prev.unlockedThoughts.includes(topLine.unlocksThought)
      ) {
        next.unlockedThoughts = [...prev.unlockedThoughts, topLine.unlocksThought];
        const th = activeCase.thoughts[topLine.unlocksThought];
        if (th) showToast(`Notizbuch aktualisiert: ${th.title}`);
        if (!unlockAudio) unlockAudio = 'thought_pop';
        changed = true;
      }

      if (
        topLine.unlocksLocation &&
        !prev.unlockedLocations.includes(topLine.unlocksLocation)
      ) {
        next.unlockedLocations = [...prev.unlockedLocations, topLine.unlocksLocation];
        const unlockedLoc = activeCase.locations[topLine.unlocksLocation];
        if (unlockedLoc) showToast(`Schauplatz freigeschaltet: ${unlockedLoc.name}`);
        if (!unlockAudio) unlockAudio = 'door_lock';
        changed = true;
      }

      if (
        topLine.switchesLocationId &&
        prev.currentLocationId !== topLine.switchesLocationId
      ) {
        next.currentLocationId = topLine.switchesLocationId;
        changed = true;
      }

      if (topLine.setsPhase && prev.phase !== topLine.setsPhase) {
        next.phase = topLine.setsPhase;
        if (topLine.setsPhase === 'investigation') {
          next.activeTestimonyId = null;
          next.statementIndex = 0;
        }
        changed = true;
      }

      return changed ? next : prev;
    });

    if (unlockAudio && !topLine.sfx && !topLine.shout) {
      soundFx.play(unlockAudio);
    }
  }, [topLine, showToast, activeCase]);

  // Progressive location unlocks (e.g., unlock Arrestzelle in Fall 2 once all upper decks were searched)
  useEffect(() => {
    if (state.screen !== 'PLAYING' || dialogQueue.length > 0) return;
    const unlocks = activeCase.progressiveLocationUnlocks;
    if (!unlocks || unlocks.length === 0) return;

    const match = unlocks.find(
      (u) =>
        u.requiredFlags.every((f) => Boolean(state.flags[f])) &&
        (!u.setsFlag || !state.flags[u.setsFlag]) &&
        !state.unlockedLocations.includes(u.unlockLocationId)
    );

    if (!match) return;

    setState((prev) => ({
      ...prev,
      unlockedLocations: prev.unlockedLocations.includes(match.unlockLocationId)
        ? prev.unlockedLocations
        : [...prev.unlockedLocations, match.unlockLocationId],
      flags: match.setsFlag ? { ...prev.flags, [match.setsFlag]: true } : prev.flags,
    }));
    soundFx.play('door_lock');
    if (match.toast) {
      showToast(match.toast);
    }
    if (match.lines && match.lines.length > 0) {
      setDialogQueue(match.lines);
    }
  }, [
    state.screen,
    state.flags,
    state.unlockedLocations,
    dialogQueue.length,
    activeCase,
    showToast,
  ]);

  // Andrew's farewell & Maya's return after finishing switchroom tasks in Akt 2.3
  useEffect(() => {
    if (
      state.screen !== 'PLAYING' ||
      dialogQueue.length > 0 ||
      activeCase.id !== CRETE_CASE.id ||
      state.currentChapterId !== 'c2_akt3_nachmittag' ||
      !state.flags.flag_c2_a3_strom_geprueft ||
      !state.flags.flag_c2_a3_kowalski_hinweis ||
      state.flags.flag_c2_a3_andrew_verabschiedet
    ) {
      return;
    }

    setDialogQueue([
      {
        speakerId: 'andrew',
        emotion: 'neutral',
        text: 'So, mein Lieber – jetzt stehen wir hier unten also mit exaktem Uhrzeit-Protokoll, Brücken-Bypass und allem Drum und Dran! Meine vereinbarte halbe Stunde Urlaubspause ist damit offiziell vorbei… auch wenn ich zugeben muss, dass diese Fehlersuche fast spannender war als Sandburgenbauen.',
      },
      {
        speakerId: 'nate',
        emotion: 'confident',
        text: 'Ganz ehrlich, Andrew: Ohne Ihren angeblichen „Nicht-Elektroniker“-Blick hätten wir dieses 15-Minuten-Fenster im Schloss niemals geknackt. Vielen Dank für Ihre Hilfe!',
      },
      {
        speakerId: 'andrew',
        emotion: 'grumpy',
        text: 'Na schön, aber wehe Sie erzählen meiner Frau da oben, dass mir das Spaß gemacht hat – sonst darf ich zu Hause wieder die kaputte Spülmaschine aufschrauben! Machen Sie’s gut, Nate, ich löse Miss Maya wieder bei der Kinderwache ab.',
      },
      {
        speakerId: 'maya',
        emotion: 'confident',
        setsFlag: 'flag_c2_a3_andrew_verabschiedet',
        unlocksLocation: 'infirmary',
        sfx: 'door_lock',
        text: 'NATE!! Da bist du ja!! Puuh… Leo und Conrad haben mich fast zu einem Piratenschiff-Wettrennen um drei Sonnendecks gezwungen, aber jetzt hat Eleonore die Jungs mit Riesen-Bechern Schokoladeneis wieder übernommen – und Andrew schnauft oben schon im Liegestuhl!',
      },
      {
        speakerId: 'nate',
        emotion: 'confident',
        text: 'Schön, dass du wieder an Bord meines Teams bist, Maya! Hör zu: Andrew und ich haben in der Schaltzentrale exakt zwischen 02:04 Uhr und 02:19 Uhr den heimlichen Strom-Absturz des Zellenschlosses gefunden – und eine noch wichtigere Überlegung gemacht.',
      },
      {
        speakerId: 'maya',
        emotion: 'thinking',
        text: 'Oh?! Was denn für eine Überlegung? Hat der Elektriker etwa jemanden im Flur gesehen?',
      },
      {
        speakerId: 'nate',
        emotion: 'thinking',
        text: 'Nein, der war hinten bei den Hauptgeneratoren. Aber wir haben überlegt, wer um zwei Uhr nachts überhaupt regulär Dienst hat und etwas bemerkt haben könnte – eigentlich bleibt da außer der Brücke nur die Krankenstation oben! Und wir müssen Dr. Vance ohnehin nach der ausstehenden Toxikologie fragen.',
      },
      {
        speakerId: 'maya',
        emotion: 'confident',
        text: 'Stimmt!! Die Krankenstation hat rund um die Uhr Bereitschaft! Gehen wir sofort hoch zu Dr. Vance!',
      },
    ]);
  }, [
    state.screen,
    state.currentChapterId,
    state.flags.flag_c2_a3_strom_geprueft,
    state.flags.flag_c2_a3_kowalski_hinweis,
    state.flags.flag_c2_a3_andrew_verabschiedet,
    dialogQueue.length,
    activeCase.id,
  ]);

  const startNewGame = (targetCaseId?: string) => {
    const caseDef = CASE_MAP[targetCaseId ?? activeCase.id] ?? CRUISE_CASE;
    const fresh = createInitialState(caseDef);
    fresh.screen = 'INTRO_CUTSCENE';
    setState(fresh);
    setDialogQueue([]);
    setInvestigationMenu('none');
    setPresentMode(false);
    setActiveBinderTab(null);
    setRepeatInspectCounts({});
    setShowRestartModal(false);
    justFoundHotspotRef.current = false;
  };

  const handleFinishIntro = useCallback(() => {
    setState((prev) => {
      const caseDef = CASE_MAP[prev.caseId ?? CRUISE_CASE.id] ?? CRUISE_CASE;
      const playingState: GameSaveState = { ...prev, screen: 'PLAYING' };
      const chapterCheckpoint: CheckpointEntry = {
        label:
          caseDef.chapters?.[playingState.currentChapterId]?.dayLabel ??
          'Tag 1 · Abend',
        introLines: [...caseDef.introLines],
        snapshot: extractCheckpointSnapshot(playingState),
      };
      return { ...playingState, chapterCheckpoint };
    });
    setDialogQueue([...activeCase.introLines]);
  }, [activeCase]);

  const continueGame = (targetCaseId?: string) => {
    const cid = targetCaseId ?? activeCase.id;
    const saved = loadSavedState(cid);
    if (!saved) {
      startNewGame(cid);
      return;
    }
    saved.screen = 'PLAYING';
    if (
      saved.currentChapterId === 'kap3_tag2_abend' &&
      !saved.unlockedLocations.includes('cabin_312')
    ) {
      saved.unlockedLocations = [...saved.unlockedLocations, 'cabin_312'];
    }
    if (
      (saved.caseId ?? cid) === CRETE_CASE.id &&
      saved.currentChapterId === 'c2_akt2_mittag' &&
      !saved.flags?.flag_c2_a2_rettungsdeck_offen
    ) {
      saved.unlockedLocations = saved.unlockedLocations.filter(
        (id) => id !== 'lifeboat_deck'
      );
    }
    if (
      (saved.caseId ?? cid) === CRETE_CASE.id &&
      saved.currentChapterId === 'c2_akt3_nachmittag' &&
      !saved.flags?.flag_c2_a3_andrew_verabschiedet
    ) {
      saved.unlockedLocations = saved.unlockedLocations.filter(
        (id) => id !== 'infirmary'
      );
    }
    setState(saved);
    setDialogQueue([]);
    setInvestigationMenu('none');
    setPresentMode(false);
    setActiveBinderTab(null);
    justFoundHotspotRef.current = false;
  };

  const restoreCheckpoint = (
    checkpoint: CheckpointEntry,
    setAsChapterCheckpoint = false
  ) => {
    const restoredSnapshot: GameCheckpointSnapshot = {
      ...checkpoint.snapshot,
      screen: 'PLAYING',
      credibility: checkpoint.snapshot.maxCredibility,
    };
    setState((prev) => ({
      ...restoredSnapshot,
      trialCheckpoint: setAsChapterCheckpoint ? null : (prev.trialCheckpoint ?? null),
      chapterCheckpoint: setAsChapterCheckpoint
        ? checkpoint
        : (prev.chapterCheckpoint ?? null),
    }));
    setPresentMode(false);
    setActiveBinderTab(null);
    setRepeatInspectCounts({});
    setShowRestartModal(false);
    setInvestigationMenu(restoredSnapshot.phase === 'court' ? 'talk' : 'none');
    justFoundHotspotRef.current = false;
    setDialogQueue(checkpoint.introLines ? [...checkpoint.introLines] : []);
    soundFx.play('page_turn');
    showToast(`Checkpoint geladen: ${checkpoint.label}`);
  };

  const enqueueLines = (lines: DialogLine[]) => {
    setDialogQueue(lines);
  };

  const handleAdvanceDialog = () => {
    if (dialogQueue.length === 0) return;
    const finished = dialogQueue[0];
    const remaining = dialogQueue.slice(1);

    if (finished.triggersOutro) {
      setDialogQueue([]);
      setPresentMode(false);
      setInvestigationMenu('none');
      setState((prev) => ({ ...prev, screen: 'OUTRO_CUTSCENE' }));
      return;
    }

    if (finished.winGame) {
      setDialogQueue([]);
      setPresentMode(false);
      setState((prev) => ({ ...prev, screen: 'VICTORY' }));
      return;
    }

    if (finished.completesChapter) {
      setDialogQueue([]);
      setPresentMode(false);
      setInvestigationMenu('none');
      setState((prev) => ({
        ...prev,
        pendingChapterTransition: finished.completesChapter ?? null,
      }));
      return;
    }

    if (finished.startsMiniGameId) {
      justFoundHotspotRef.current = false;
      setDialogQueue([]);
      setPresentMode(false);
      setInvestigationMenu('none');
      setActiveMiniGame(finished.startsMiniGameId);
      return;
    }

    if (finished.startsTestimonyId) {
      const testimonyId = finished.startsTestimonyId;
      const testimony = activeCase.testimonies[testimonyId];
      setState((prev) => {
        const nextState: GameSaveState = {
          ...prev,
          phase: 'court',
          activeTestimonyId: testimonyId,
          statementIndex: 0,
        };
        const trialCheckpoint: CheckpointEntry = {
          label: testimony?.title ?? 'Aktuelles Verhör',
          introLines: [...(testimony?.introLines ?? [])],
          snapshot: extractCheckpointSnapshot({
            ...nextState,
            screen: 'PLAYING',
            credibility: prev.maxCredibility,
          }),
        };
        return { ...nextState, trialCheckpoint };
      });
      setInvestigationMenu('none');
      setDialogQueue([...(testimony?.introLines ?? []), ...remaining]);
      return;
    }

    if (remaining.length === 0 && justFoundHotspotRef.current) {
      justFoundHotspotRef.current = false;
      const visibleHotspots = currentLocation.hotspots.filter(
        (hs) =>
          (!hs.visibleIfFlag || state.flags[hs.visibleIfFlag]) &&
          (!hs.hideIfFlag || !state.flags[hs.hideIfFlag])
      );
      const allFound =
        visibleHotspots.length > 0 &&
        visibleHotspots.every((hs) => state.inspectedHotspots.includes(hs.id));

      if (allFound) {
        setInvestigationMenu('none');
        const mayaAwayInCell =
          state.currentLocationId === 'brig_cell' &&
          Boolean(state.flags.flag_c2_a3_andrew_in_zelle) &&
          !Boolean(state.flags.flag_c2_a3_andrew_verabschiedet);
        setDialogQueue([
          mayaAwayInCell
            ? {
                speakerId: 'nate',
                emotion: 'confident',
                text: 'Hier in der Zelle habe ich mir damit erst einmal alles genau angesehen.',
              }
            : {
                speakerId: 'maya',
                emotion: 'confident',
                text: 'Ich denke, mehr gibt es hier gerade nicht zu finden, Nate!',
              },
        ]);
        return;
      }
    }

    setDialogQueue(remaining);
  };

  const handleConfirmChapterTransition = () => {
    const transition = state.pendingChapterTransition;
    if (!transition) return;

    setState((prev) => {
      const locks = new Set(transition.locksLocations ?? []);
      if (transition.nextChapterId === 'kap3_tag2_abend') {
        locks.add('courtroom');
      }

      const baseLocations = transition.resetLocations
        ? [...transition.resetLocations]
        : prev.unlockedLocations.filter((id) => !locks.has(id));

      let nextUnlocked = [...baseLocations];
      const toUnlock = [
        transition.nextLocationId,
        ...(transition.unlocksLocations ?? []),
        ...(transition.nextChapterId === 'kap3_tag2_abend' ? ['cabin_312'] : []),
      ];

      for (const locId of toUnlock) {
        if (!nextUnlocked.includes(locId)) {
          nextUnlocked = [...nextUnlocked, locId];
        }
      }

      const nextState: GameSaveState = {
        ...prev,
        currentChapterId: transition.nextChapterId,
        currentLocationId: transition.nextLocationId,
        phase: transition.nextPhase,
        credibility: prev.maxCredibility,
        unlockedLocations: nextUnlocked,
        collectedEvidence: transition.setEvidenceIds
          ? [...transition.setEvidenceIds]
          : prev.collectedEvidence,
        unlockedThoughts: transition.setThoughtIds
          ? [...transition.setThoughtIds]
          : prev.unlockedThoughts,
        solvedDeductions: transition.setSolvedDeductions
          ? [...transition.setSolvedDeductions]
          : prev.solvedDeductions,
        flags: transition.setsFlag
          ? { ...prev.flags, [transition.setsFlag]: true }
          : prev.flags,
        pendingChapterTransition: null,
        activeTestimonyId:
          transition.nextPhase === 'court' ? prev.activeTestimonyId : null,
        statementIndex: transition.nextPhase === 'court' ? prev.statementIndex : 0,
      };

      const chapterLabel =
        activeCase.chapters?.[transition.nextChapterId]?.dayLabel ??
        transition.completedChapterTitle;

      const chapterCheckpoint: CheckpointEntry = {
        label: chapterLabel,
        introLines: [...transition.nextIntroLines],
        snapshot: extractCheckpointSnapshot({ ...nextState, screen: 'PLAYING' }),
      };

      return {
        ...nextState,
        chapterCheckpoint,
        trialCheckpoint:
          transition.nextPhase === 'court'
            ? {
                label: `Prozess-Start (${chapterLabel})`,
                introLines: [...transition.nextIntroLines],
                snapshot: extractCheckpointSnapshot({ ...nextState, screen: 'PLAYING' }),
              }
            : prev.trialCheckpoint,
      };
    });
    setInvestigationMenu(transition.nextPhase === 'court' ? 'talk' : 'none');
    setPresentMode(false);
    setActiveBinderTab(null);
    justFoundHotspotRef.current = false;
    setDialogQueue([...transition.nextIntroLines]);
  };

  const handleSelectChoice = (choiceIndex: number) => {
    const current = dialogQueue[0];
    const choice = current?.choices?.[choiceIndex];
    if (!choice) return;
    setDialogQueue([...choice.nextLines, ...dialogQueue.slice(1)]);
  };

  const handleCompleteMiniGame = (miniGameId: MiniGameId) => {
    setActiveMiniGame(null);
    if (miniGameId === 'dimitri_pantomime') {
      enqueueLines([
        {
          speakerId: 'dimitri',
          emotion: 'shocked',
          shake: true,
          text: 'Αξιωματικέ Brandt!! Στις 02:10 ακούστηκε θόρυβος στο κελί κατά τη βάρδιά σας! Ανοίξτε τη σφραγισμένη πόρτα ΤΩΡΑ!!',
        },
        {
          speakerId: 'brandt',
          emotion: 'sweating',
          sfx: 'door_lock',
          setsFlag: 'flag_c2_a2_zelle_offen',
          text: 'Tch… verstanden, Kommissar! Wenn Sie darauf bestehen… bitte sehr, das elektronische Schloss von Zelle 08 ist entriegelt.',
        },
        {
          speakerId: 'brandt',
          emotion: 'neutral',
          text: 'Ich überlasse Ihnen und Mr. Sterling hier unten das Feld. Ich… gehe nach oben aufs Rettungsboot-Deck und sehe nach einer klemmenden Lüftungsklappe.',
        },
        {
          speakerId: 'maya',
          emotion: 'confident',
          text: 'YES!! Dein Pantomime-Griechisch hat wirklich gesessen, Nate!! Selbst ohne ein einziges gemeinsames Wort hat Dimitri dich auf Anhieb verstanden!',
        },
        {
          speakerId: 'nate',
          emotion: 'sweating',
          text: 'Puh… ich glaube, so viel geschauspielert habe ich seit meiner ersten Gerichtsverhandlung nicht mehr. Aber es hat geklappt: Die Tür zu Zelle 08 steht endlich offen!',
        },
        {
          speakerId: 'nate',
          emotion: 'thinking',
          text: 'Treten wir ein und sehen uns drinnen ganz in Ruhe jeden einzelnen Winkel an – vielleicht entdecken wir etwas, das im ersten Schnellbericht übersehen wurde.',
        },
      ]);
      return;
    }

    if (miniGameId === 'cooling_pipes') {
      enqueueLines([
        {
          speakerId: 'nate',
          emotion: 'confident',
          shout: 'VOLLTREFFER!',
          shake: true,
          sfx: 'deduction',
          text: 'Die Diagnose-Leitung steht, Maya! Der Sensor-Drucker springt an und spuckt die kompletten Klimawerte der letzten Nacht aus!',
        },
        {
          speakerId: 'nate',
          emotion: 'shocked',
          text: 'Moment… schau dir diese Linie auf dem Protokollstreifen genau an: Punkt 03:00 Uhr nachts hat jemand manuell am Regel-Ventil gedreht und die Temperatur in Zelle 08 massiv heruntergeregelt!',
        },
        {
          speakerId: 'maya',
          emotion: 'shocked',
          text: 'Mitten in der Nacht um 03:00 Uhr hat hier jemand absichtlich an der Kühlung gedreht?! Kein Wunder, dass einem hier drin fast der Atem gefriert… Aber warum sollte sich irgendjemand nachts an einer Arrestzelle zu schaffen machen?',
        },
        {
          speakerId: 'dimitri',
          emotion: 'thinking',
          text: 'Τι κάνετε εκεί με τους σωλήνες, κύριε Στέρλινγκ;; Κρυώνετε; Μην ανησυχείτε, σε λίγο θα ανάψω τη θέρμανση και θα πιούμε ένα ζεστό ελληνικό καφεδάκι – όλα καλά!!',
        },
        {
          speakerId: 'maya',
          emotion: 'sweating',
          text: 'Ähm… danke sehr, Kommissar… (Er hat wieder kein Wort verstanden und denkt offenbar bloß, wir frieren wegen einer kaputten Bordheizung und wollen einen heißen Kaffee…)',
        },
        {
          speakerId: 'nate',
          emotion: 'thinking',
          unlocksEvidence: 'zellen_klima_protokoll',
          unlocksThought: 'thought_c2_kuehlung_9grad',
          setsFlag: 'flag_c2_a2_klima_geloest',
          text: 'Kommissar Dimitri merkt zum Glück nicht einmal, wie brisant dieser Ausdruck sein könnte. Seltsam ist diese manuelle Temperaturänderung um 03:00 Uhr auf jeden Fall – legen wir das Protokoll erst einmal sauber zu unserer Akte.',
        },
      ]);
      return;
    }

    if (miniGameId === 'sea_chart') {
      enqueueLines([
        {
          speakerId: 'nate',
          emotion: 'confident',
          shout: 'VOLLTREFFER!',
          shake: true,
          unlocksEvidence: 'bruecken_log',
          setsFlag: 'flag_c2_a2_bruecke_geloest',
          text: 'JETZT fällt der Groschen, Maya!! Schau dir die Markierungen auf dem Navigations-Plotter und die Uhrzeiten dazu genau an!',
        },
        {
          speakerId: 'nate',
          emotion: 'confident',
          text: 'Um 07:30 Uhr und um 06:00 Uhr waren wir längst innerhalb der 12-Meilen-Grenze vor Heraklion. Aber um 02:10 Uhr nachts lag die MS Aurora noch rund 42 Seemeilen vor Kreta – draußen in internationalen Gewässern!!',
        },
        {
          speakerId: 'dimitri',
          emotion: 'shocked',
          text: 'Στις 02:10 στα 42 ναυτικά μίλια – διεθνή ύδατα?! Καπετάνιε, τι συμβαίνει εδώ;; Έκτακτη ακρόαση στη μεγάλη αίθουσα ΤΩΡΑ!!',
        },
        {
          speakerId: 'maya',
          emotion: 'confident',
          text: 'Volltreffer!! Kommissar Dimitri hat jede einzelne Zahl sofort verstanden – deshalb hat er eben so aufgeregt aufs Meer hinausgezeigt! Er trommelt sofort alle Beteiligten in den Großen Ballsaal zusammen!',
        },
        {
          speakerId: 'pendelton',
          emotion: 'neutral',
          sfx: 'gavel_double',
          unlocksLocation: 'courtroom',
          switchesLocationId: 'courtroom',
          setsPhase: 'court',
          text: 'Ruhe im Großen Ballsaal! Auf dringenden Antrag von Kommissar Dimitri eröffne ich hiermit eine außerordentliche Mittags-Anhörung zu den Vorgängen der letzten Nacht.',
        },
        {
          speakerId: 'pendelton',
          emotion: 'neutral',
          text: 'Wir klären Punkt für Punkt, was in Zelle 08 wirklich geschehen ist. Als ersten Zeugen rufe ich in den Stand: Sicherheitsoffizier Lukas Brandt!',
          startsTestimonyId: 'testimony_c2_brandt_kurz',
        },
      ]);
      return;
    }

    if (miniGameId === 'kids_sokoban') {
      enqueueLines([
        {
          speakerId: 'maya',
          emotion: 'confident',
          shout: 'VOLLTREFFER!',
          shake: true,
          sfx: 'victory',
          text: 'Puh!! Geschafft – Leo, Rick und Conrad sitzen alle drei brav mit einer Riesenportion Wassermelone und Piraten-Malbüchern oben in der Spielecke auf dem Promenadendeck!',
        },
        {
          speakerId: 'maya',
          emotion: 'confident',
          text: 'Ich bleibe hier oben und passe auf die wilde Bande auf, versprochen! Viel Erfolg da unten mit unserem „Nicht-Technik-Experten“, Nate!',
        },
        {
          speakerId: 'andrew',
          emotion: 'neutral',
          setsFlag: 'flag_c2_a3_andrew_in_zelle',
          text: 'Endlich… so leise war es in meiner Nähe seit dem Einschiffen vor vier Tagen nicht mehr. Also gut, Nate – jetzt stehe ich allein mit Ihnen hier unten in Arrestzelle 08.',
        },
        {
          speakerId: 'andrew',
          emotion: 'grumpy',
          text: 'Zeigen Sie mir einfach dieses blöde Elektronikschloss da drüben, aber versprechen Sie sich bloß keine Wunder von mir!',
        },
      ]);
      return;
    }

    if (miniGameId === 'lock_cables') {
      enqueueLines([
        {
          speakerId: 'andrew',
          emotion: 'shocked',
          shout: 'VOLLTREFFER!',
          shake: true,
          sfx: 'deduction',
          text: 'HALT DIE LUFT AN!! Schau auf meine Prüflampe, Nate!! Das glaub ich ja jetzt selber kaum – ES HAT TATSÄCHLICH GEKLAPPT!!',
        },
        {
          speakerId: 'nate',
          emotion: 'shocked',
          text: 'Andrew?! Der schwere Magnetbolzen der Zellentür ist gerade völlig lautlos zurückgesprungen – und was steht da auf dem Status-Display?!',
        },
        {
          speakerId: 'andrew',
          emotion: 'shocked',
          unlocksEvidence: 'magnet_crash_protokoll',
          unlocksThought: 'thought_c2_a3_15min_luecke',
          setsFlag: 'flag_c2_a3_lock_geknackt',
          text: 'NULL!! KEIN EINZIGER EINTRAG!! Durch diese gezielte Bus-Überlastung stürzt der MS-400-Controller komplett ab und legt die Tür für geschlagene 15 Minuten frei – bis er neu startet und ohne ein einziges Bit im Zugriffs-Log wieder einrastet!!',
        },
        {
          speakerId: 'nate',
          emotion: 'shocked',
          unlocksLocation: 'switchroom',
          text: 'FÜNFZEHN MINUTEN SPURLOS OFFEN?! Wahnsinn, Andrew!! Aber Moment – selbst wenn der Tür-Speicher nichts protokolliert: Ein solcher Strom-Einbruch müsste doch unten in der zentralen Energieverteilung des Schiffes aufgezeichnet worden sein!',
        },
        {
          speakerId: 'andrew',
          emotion: 'grumpy',
          text: 'Ich fass es nicht… jetzt steige ich auf meiner Urlaubsreise freiwillig auch noch in den Schiffs-Maschinenraum hinab! Kommen Sie, gehen wir in die Schaltzentrale & Bordtechnik zum Elektriker!',
        },
      ]);
    }
  };

  const currentLocation =
    activeCase.locations[state.currentLocationId] ??
    activeCase.locations[activeCase.initialLocationId];

  const presentCharacters = useMemo<Character[]>(() => {
    if (currentLocation.charactersPresent && currentLocation.charactersPresent.length > 0) {
      return currentLocation.charactersPresent
        .filter(
          (entry) =>
            (!entry.visibleIfFlag || Boolean(state.flags[entry.visibleIfFlag])) &&
            (!entry.hideIfFlag || !state.flags[entry.hideIfFlag])
        )
        .map((entry) => activeCase.characters[entry.characterId])
        .filter((char): char is Character => Boolean(char));
    }
    if (currentLocation.characterId && activeCase.characters[currentLocation.characterId]) {
      return [activeCase.characters[currentLocation.characterId]];
    }
    return [];
  }, [currentLocation, state.flags, activeCase]);

  const activeTestimony = state.activeTestimonyId
    ? activeCase.testimonies[state.activeTestimonyId]
    : null;

  const visibleStatements = useMemo(() => {
    if (!activeTestimony) return [];
    return activeTestimony.statements.filter(
      (s) => !s.visibleIfFlag || Boolean(state.flags[s.visibleIfFlag])
    );
  }, [activeTestimony, state.flags]);

  const handleInspectHotspot = (hotspotId: string) => {
    const hotspot = currentLocation.hotspots.find((h) => h.id === hotspotId);
    if (!hotspot) return;

    setInvestigationMenu('none');

    const alreadyVisited = state.inspectedHotspots.includes(hotspotId);
    if (alreadyVisited) {
      justFoundHotspotRef.current = false;
      const nextCount = (repeatInspectCounts[hotspotId] ?? 0) + 1;
      setRepeatInspectCounts((prev) => ({ ...prev, [hotspotId]: nextCount }));
      enqueueLines(buildRepeatInspectLine(hotspot.label, nextCount));
      return;
    }

    justFoundHotspotRef.current = true;
    setState((prev) => ({
      ...prev,
      inspectedHotspots: [...prev.inspectedHotspots, hotspotId],
    }));
    enqueueLines(hotspot.lines);
  };

  const handleInspectEmpty = () => {
    showToast('Hier fällt dir nichts Ungewöhnliches auf.');
  };

  const handleSelectTalkTopic = (topicId: string) => {
    const topic = currentLocation.talkTopics.find((t) => t.id === topicId);
    if (!topic) return;
    justFoundHotspotRef.current = false;
    setState((prev) => ({
      ...prev,
      visitedTopics: prev.visitedTopics.includes(topicId)
        ? prev.visitedTopics
        : [...prev.visitedTopics, topicId],
    }));
    setInvestigationMenu('none');
    enqueueLines(topic.lines);
  };

  const handleTravelTo = (locationId: string) => {
    const target = activeCase.locations[locationId];
    if (!target) return;
    justFoundHotspotRef.current = false;
    setState((prev) => ({
      ...prev,
      currentLocationId: locationId,
      phase: locationId === 'courtroom' ? 'court' : 'investigation',
    }));
    setInvestigationMenu(locationId === 'courtroom' ? 'talk' : 'none');
    setPresentMode(false);
  };

  const applyPenalty = (penaltyLines: DialogLine[]) => {
    soundFx.play('damage');
    setState((prev) => {
      const nextCred = prev.credibility - 1;
      if (nextCred <= 0) {
        return { ...prev, credibility: 0, screen: 'GAME_OVER' };
      }
      return { ...prev, credibility: nextCred };
    });
    enqueueLines(penaltyLines);
  };

  const handleSelectEvidenceToPresent = (evidenceId: string) => {
    // 1. Final Courtroom Evidence Prompt
    if (topLine?.requiresFinalEvidencePrompt) {
      const prompt = topLine.requiresFinalEvidencePrompt;
      const isMatch =
        evidenceId === prompt.correctEvidenceId ||
        Boolean(prompt.alternativeEvidenceIds?.includes(evidenceId));
      if (isMatch) {
        setPresentMode(false);
        setActiveBinderTab(null);
        enqueueLines(prompt.successLines);
      } else {
        setPresentMode(true);
        soundFx.play('facepalm');
        setState((prev) => {
          const nextCred = prev.credibility - 1;
          if (nextCred <= 0) {
            return { ...prev, credibility: 0, screen: 'GAME_OVER' };
          }
          return { ...prev, credibility: nextCred };
        });
        showToast('Staatsanwalt Falk schlägt sich die Hand vor den Kopf – falscher Beweis!');
      }
      return;
    }

    setPresentMode(false);
    setActiveBinderTab(null);

    // 2. Cross-Examination Objection!
    if (state.phase === 'court' && activeTestimony && visibleStatements.length > 0) {
      const stmt =
        visibleStatements[Math.min(state.statementIndex, visibleStatements.length - 1)];
      const matchesContradiction =
        stmt.contradiction &&
        (stmt.contradiction.requiredEvidenceId === evidenceId ||
          Boolean(stmt.contradiction.alternativeEvidenceIds?.includes(evidenceId)));
      if (matchesContradiction && stmt.contradiction) {
        enqueueLines(stmt.contradiction.successLines);
      } else {
        applyPenalty(activeTestimony.wrongObjectionLines);
      }
      return;
    }

    // 3. Investigation Present: automatically route to matching present character; only ask if multiple present characters meaningfully accept it
    const presentIds = new Set(presentCharacters.map((c) => c.id));
    const targetedMatches = currentLocation.presentRules.filter(
      (rule) =>
        rule.evidenceId === evidenceId &&
        (!rule.requiredFlag || state.flags[rule.requiredFlag]) &&
        (!rule.hideIfFlag || !state.flags[rule.hideIfFlag]) &&
        Boolean(rule.targetCharacterId && presentIds.has(rule.targetCharacterId))
    );

    if (targetedMatches.length > 1) {
      enqueueLines([
        {
          speakerId: 'nate',
          emotion: 'thinking',
          text: 'Wem möchte ich dieses Beweisstück hier im Raum zeigen?',
          choices: targetedMatches.map((rule) => {
            const targetChar = rule.targetCharacterId
              ? activeCase.characters[rule.targetCharacterId]
              : null;
            return {
              label: targetChar
                ? `${targetChar.name} zeigen`
                : 'Direkt ansprechen',
              nextLines: rule.lines,
            };
          }),
        },
      ]);
      return;
    }

    const match =
      targetedMatches[0] ??
      currentLocation.presentRules.find(
        (rule) =>
          rule.evidenceId === evidenceId &&
          !rule.targetCharacterId &&
          (!rule.requiredFlag || state.flags[rule.requiredFlag]) &&
          (!rule.hideIfFlag || !state.flags[rule.hideIfFlag])
      );

    if (match) {
      enqueueLines(match.lines);
    } else {
      enqueueLines(currentLocation.fallbackPresentLines);
    }
  };

  const handleInspectEvidence = (evidenceId: string) => {
    const item = activeCase.evidence[evidenceId];
    if (!item) return;

    setActiveBinderTab(null);
    if (presentMode && !topLine?.requiresFinalEvidencePrompt) {
      setPresentMode(false);
    }
    setInvestigationMenu('none');
    soundFx.play('page_turn');

    const matchingRule = item.inspectRules?.find(
      (rule) =>
        (!rule.requiredFlag || state.flags[rule.requiredFlag]) &&
        (!rule.hideIfFlag || !state.flags[rule.hideIfFlag])
    );

    if (matchingRule) {
      enqueueLines(matchingRule.lines);
      return;
    }

    const updated =
      item.updatedByFlag && state.flags[item.updatedByFlag.flag]
        ? item.updatedByFlag
        : null;
    const itemName = updated?.name ?? item.name;
    const itemDetail = updated?.detail ?? item.detail;

    enqueueLines([
      {
        speakerId: 'nate',
        emotion: 'thinking',
        text: `Ich sehe mir „${itemName}“ noch einmal genau an: ${itemDetail}`,
      },
    ]);
  };

  const handleTogglePresentMode = () => {
    setPresentMode((prev) => {
      const next = !prev;
      setActiveBinderTab(next ? 'akte' : null);
      return next;
    });
  };

  const handleNavigateStatement = (delta: number) => {
    if (visibleStatements.length === 0) return;
    setState((prev) => {
      const len = visibleStatements.length;
      const nextIdx = (prev.statementIndex + delta + len) % len;
      return { ...prev, statementIndex: nextIdx };
    });
  };

  const handlePressStatement = () => {
    if (visibleStatements.length === 0) return;
    const stmt =
      visibleStatements[Math.min(state.statementIndex, visibleStatements.length - 1)];
    enqueueLines(stmt.pressLines);
  };

  const handleCombineThoughts = (thoughtA: string, thoughtB: string) => {
    const match = activeCase.logicCombinations.find(
      (combo) =>
        !state.solvedDeductions.includes(combo.id) &&
        ((combo.thoughtA === thoughtA && combo.thoughtB === thoughtB) ||
          (combo.thoughtA === thoughtB && combo.thoughtB === thoughtA))
    );

    if (!match) {
      soundFx.play('penalty');
      const pair = [thoughtA, thoughtB];
      if (
        (pair.includes('thought_c2_0210_poltern') && pair.includes('thought_c2_brandt_dienst')) ||
        (pair.includes('thought_c2_0210_poltern') && pair.includes('thought_c2_0730_hafen'))
      ) {
        showToast(
          state.solvedDeductions.includes('c2_logic_brandt_zeit')
            ? 'Verbinde das 02:10-Uhr-Krachen direkt mit deiner Schlussfolgerung „06:00 Uhr gefunden vs. 07:30 Uhr tot?!“!'
            : 'Gute Spur! Vergleiche aber zuerst Brandts Wachprotokoll (06:00) mit dem Arztbericht (07:30)!'
        );
      } else if (pair.includes('thought_c2_0210_poltern') && pair.includes('thought_c2_kuehlung_9grad')) {
        showToast(
          'Diese zwei Hinweise gehören noch nicht zusammen – sprich zuerst mit Dr. Vance oder auf den Decks über deine Befunde.'
        );
      } else if (
        pair.includes('thought_c2_a3_15min_luecke') &&
        !state.unlockedThoughts.includes('thought_c2_a3_arthur_betaeubt')
      ) {
        showToast(
          'Dir fehlt noch ein wichtiger medizinischer oder technischer Baustein zu dieser Spur.'
        );
      } else {
        showToast('Diese beiden Hinweise ergeben noch keine neue Schlussfolgerung.');
      }
      return;
    }

    const nextFlags = match.setsFlag
      ? { ...state.flags, [match.setsFlag]: true }
      : state.flags;

    const shouldUnlockCourtroom =
      activeCase.courtroomLocationId &&
      activeCase.courtroomUnlockFlags &&
      activeCase.courtroomUnlockFlags.every((flag) => Boolean(nextFlags[flag])) &&
      !state.unlockedLocations.includes(activeCase.courtroomLocationId);

    const shouldFinishChapter3 =
      activeCase.id === CRUISE_CASE.id &&
      state.currentChapterId === 'kap3_tag2_abend' &&
      Boolean(nextFlags['flag_kap3_trick_geloest']) &&
      Boolean(nextFlags['flag_kap3_motiv_geloest']);

    const autoTransition = activeCase.autoChapterTransitions?.find(
      (t) =>
        t.chapterId === state.currentChapterId &&
        t.requiredFlags.every((f) => Boolean(nextFlags[f]))
    );

    const extraUnlockLine: DialogLine[] = shouldUnlockCourtroom
      ? [
          {
            speakerId: 'maya',
            emotion: 'confident',
            text: 'Wir haben beide Puzzleteile zusammen, Nate! Damit beweisen wir morgen früh vor dem Seegericht sofort, dass Anya unschuldig ist!',
          },
          {
            speakerId: 'nate',
            emotion: 'confident',
            text: 'Gute Arbeit, Maya! Packen wir für heute Abend zusammen – morgen um neun Uhr wartet der Große Ballsaal auf uns.',
            completesChapter: {
              completedChapterTitle: 'Kapitel 1 abgeschlossen',
              completedTimeLabel: 'Tag 1 · Abend beendet',
              summary:
                'Du hast den Tatort im VIP-Salon untersucht, Arthur Morgans Lücken aufgedeckt, Anyas Musiksalon-Alibi gesichert und Detective Marston das Schlüsselkarten-Log entlockt. Alle Indizien für Anyas Unschulds-Plädoyer liegen bereit.',
              nextChapterId: 'kap2_tag2_morgen',
              nextLocationId: 'courtroom',
              nextPhase: 'court',
              nextTimeOfDay: 'tag',
              nextButtonLabel: 'Weiter zu Tag 2 · Morgen (Schiffs-Tribunal)',
              nextIntroLines: [
                {
                  speakerId: 'maya',
                  emotion: 'confident',
                  text: 'Guten Morgen, Nate! Wow, schau dir diesen Großen Ballsaal an – kristallene Kronleuchter, Samtvorhänge… und ein echtes Richterpult mitten auf dem Schiff!',
                },
                {
                  speakerId: 'nate',
                  emotion: 'sweating',
                  text: 'Und genau vor diesem Richterpult stehe ich – im Urlaubs-Sakko mit Anwaltsabzeichen. Eigentlich wollte ich um diese Uhrzeit beim Frühstücksbuffet sitzen.',
                },
                {
                  speakerId: 'maya',
                  emotion: 'smug',
                  text: 'Nach dem Freispruch gibt’s doppeltes Rührei, versprochen! Pssst – es geht los, Judge Pendelton greift schon zum Hammer!',
                },
                {
                  speakerId: 'pendelton',
                  emotion: 'neutral',
                  animation: 'slam',
                  sfx: 'gavel_double',
                  text: 'Ruhe im Ballsaal! Das außerordentliche Schiffs-Tribunal der MS Aurora wird hiermit eröffnet. Verhandelt wird der gestrige Diebstahl des Goldenen Schiffs-Chronometers.',
                },
                {
                  speakerId: 'pendelton',
                  emotion: 'neutral',
                  text: 'Ist die Verteidigung bereit, Mr. Sterling?',
                },
                {
                  speakerId: 'nate',
                  emotion: 'confident',
                  animation: 'nod',
                  text: 'Die Verteidigung ist vollständig bereit, Euer Ehren!',
                },
                {
                  speakerId: 'pendelton',
                  emotion: 'confident',
                  animation: 'nod',
                  text: 'Sehr schön! Und die Anklage, Mr. von Falk?',
                },
                {
                  speakerId: 'falk',
                  emotion: 'smug',
                  text: 'Bereit ist gar kein Ausdruck, Euer Ehren. Dieser Fall wird mein kürzester Sieg auf hoher See – nicht zuletzt, weil mein Gegner offenbar sein Gehirn am Sonnendeck zurückgelassen hat.',
                },
                {
                  speakerId: 'nate',
                  emotion: 'sweating',
                  text: '(Er verliert wirklich keine Sekunde mit seinen Sticheleien…)',
                },
                {
                  speakerId: 'falk',
                  emotion: 'confident',
                  animation: 'slam',
                  text: 'Die Anklage behauptet: Die Bord-Pianistin Anya Brooks schlich sich um 20:30 Uhr in den VIP-Salon, schlug die Sicherheitsvitrine brutal ein und wollte mit der Beute fliehen.',
                },
                {
                  speakerId: 'falk',
                  emotion: 'smug',
                  text: 'Ich rufe nun meinen untadeligen Hauptzeugen in den Zeugenstand: Oberkellner Arthur Morgan!',
                  startsTestimonyId: 'testimony_arthur_1',
                },
              ],
            },
          },
        ]
      : shouldFinishChapter3
        ? [
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: 'Das war’s, Nate! Wir wissen jetzt exakt, wie Arthur Morgan die Uhr um 08:42 Uhr unter Anyas Bett geschmuggelt hat – und der 45.000-€-Brief gibt uns endlich das Beweisstück gegen ihn!',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Stimmt… morgen früh legen wir ihm vor Judge Pendelton endgültig das Handwerk.',
              completesChapter: {
                completedChapterTitle: 'Kapitel 3 abgeschlossen',
                completedTimeLabel: 'Tag 2 · Abend beendet',
                summary:
                  'Du hast das Rätsel um Kabine 312 geknackt: Arthur Morgan schleuste den Chronometer schon um 08:42 Uhr in einem Rotwein-Serviertuch ein. Mit dem geheimnisvollen 45.000-€-Brief an „A. M.“ sitzt er morgen im Hauptverfahren in der Falle.',
                nextChapterId: 'kap4_tag3_morgen',
                nextLocationId: 'courtroom',
                nextPhase: 'court',
                nextTimeOfDay: 'tag',
                unlocksLocations: ['courtroom'],
                nextButtonLabel: 'Weiter zu Tag 3 · Morgen (Großes Finale)',
                nextIntroLines: [...KAP4_MORGEN_INTRO_LINES],
              },
            },
          ]
        : autoTransition
          ? [...autoTransition.lines]
          : [];

    setState((prev) => {
      const unlockedLocs = [...prev.unlockedLocations];
      if (match.unlocksLocationId && !unlockedLocs.includes(match.unlocksLocationId)) {
        unlockedLocs.push(match.unlocksLocationId);
      }
      if (
        shouldUnlockCourtroom &&
        activeCase.courtroomLocationId &&
        !unlockedLocs.includes(activeCase.courtroomLocationId)
      ) {
        unlockedLocs.push(activeCase.courtroomLocationId);
      }
      const nextEvidence =
        match.unlocksEvidence && !prev.collectedEvidence.includes(match.unlocksEvidence)
          ? [...prev.collectedEvidence, match.unlocksEvidence]
          : prev.collectedEvidence;

      return {
        ...prev,
        solvedDeductions: [...prev.solvedDeductions, match.id],
        collectedEvidence: nextEvidence,
        unlockedThoughts: prev.unlockedThoughts.includes(match.resultThoughtId)
          ? prev.unlockedThoughts
          : [...prev.unlockedThoughts, match.resultThoughtId],
        unlockedLocations: unlockedLocs,
        flags: nextFlags,
      };
    });

    if (shouldUnlockCourtroom) {
      showToast('Seegericht im Ballsaal freigeschaltet!');
    } else if (shouldFinishChapter3) {
      showToast('Alle Beweise für das große Finale gesammelt!');
    } else if (match.unlocksEvidence) {
      const ev = activeCase.evidence[match.unlocksEvidence];
      if (ev) showToast(`Gerichtsakte aktualisiert: ${ev.name}`);
    } else if (autoTransition?.toast) {
      showToast(autoTransition.toast);
    }

    setActiveBinderTab(null);
    enqueueLines([...match.feedbackLines, ...extraUnlockLine]);
  };

  const toggleMute = () => {
    const next = !muted;
    soundFx.muted = next;
    if (next) {
      soundFx.stopPianoBallad();
    }
    setMuted(next);
  };

  // TITLE SCREEN
  if (state.screen === 'TITLE_MENU') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-slate-800/80 max-w-6xl w-full mx-auto">
          <span
            onClick={handleSecretDevTap}
            className="font-display text-lg font-bold tracking-wide text-amber-400 whitespace-nowrap shrink-0 select-none"
          >
            Advokat-Engine
          </span>
          <button
            type="button"
            onClick={toggleMute}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 whitespace-nowrap shrink-0 cursor-pointer"
          >
            {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{muted ? 'Ton aus' : 'Ton an'}</span>
          </button>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-6 py-10 gap-6">
          <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            {ALL_CASES.map((caseItem) => {
              const hasCaseSave = Boolean(savedCaseIds[caseItem.id]);
              return (
                <div
                  key={caseItem.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-7 sm:p-8 flex flex-col justify-between gap-7 shadow-2xl"
                >
                  <div className="space-y-3">
                    <div className="text-xs font-medium text-amber-400">
                      {caseItem.badgeLabel ?? caseItem.subtitle}
                    </div>
                    <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-50 leading-tight text-balance">
                      {caseItem.title}
                    </h1>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {caseItem.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => startNewGame(caseItem.id)}
                      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Neues Spiel starten
                    </button>
                    {hasCaseSave && (
                      <button
                        type="button"
                        onClick={() => continueGame(caseItem.id)}
                        className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs sm:text-sm font-semibold rounded-lg border border-slate-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        Fortsetzen
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {devShortcutsUnlocked && (
            <div className="max-w-5xl w-full bg-slate-900/90 border border-amber-500/30 rounded-xl px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-semibold text-amber-300">
                Kapitel-Direktsprung (Fall 2):
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => restoreCheckpoint(createCreteAct22Checkpoint(), true)}
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Akt 2.2 · Tag 4 Mittag
                </button>
                <button
                  type="button"
                  onClick={() => restoreCheckpoint(createCreteAct23Checkpoint(), true)}
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Akt 2.3 · Tag 4 Nachmittag
                </button>
                <button
                  type="button"
                  onClick={() => restoreCheckpoint(createCreteAct24Checkpoint(), true)}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Akt 2.4 · Eleonore
                </button>
                <button
                  type="button"
                  onClick={() => setDevShortcutsUnlocked(false)}
                  className="px-2.5 py-1.5 text-[11px] text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  Verbergen
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  // ANIMATED INTRO CUTSCENE
  if (state.screen === 'INTRO_CUTSCENE') {
    return (
      <AnimatedIntro
        caseTitle={activeCase.title}
        slides={activeCase.introSlides}
        onComplete={handleFinishIntro}
      />
    );
  }

  // ANIMATED OUTRO CUTSCENE
  if (state.screen === 'OUTRO_CUTSCENE') {
    if (activeCase.id === CRETE_CASE.id) {
      if (state.currentChapterId === 'c2_akt3_nachmittag') {
        return (
          <AnimatedOutro
            muted={muted}
            slides={CRETE_ACT23_OUTRO_SLIDES}
            cliffhangerTitle="Vorschau: Fall 3"
            finishButtonLabel="Fall 2 abschließen"
            onComplete={() =>
              setState((prev) => ({
                ...prev,
                screen: 'PLAYING',
                pendingChapterTransition: {
                  completedChapterTitle: 'Fall 2 abgeschlossen',
                  completedTimeLabel: 'Leinen los vor Kreta · Auf zu Fall 3',
                  summary:
                    'Gemeinsam mit Andrew Higginson hast du den lautlosen 15-Minuten-Absturz des Magnetschlosses und Dr. Vances Betäubungs-Gutachten bewiesen. Doch nach dem ersten Mord-Urteil bat Staatsanwalt von Falk um eine Pause – und ließ Andrew anhand von Überwachungskameras, gestandenen Schulden und dem „A. H.“-Brief verhaften, während die MS Aurora bereits von Kreta ablegt!',
                  nextChapterId: 'c2_akt4_abend',
                  nextLocationId: 'courtroom',
                  nextPhase: 'court',
                  nextTimeOfDay: 'abend',
                  isComingSoon: true,
                  nextButtonLabel: 'Demnächst: Fall 3 (Andrews Verteidigung auf hoher See)',
                  comingSoonNote:
                    'Fall 2 endet hier mit dem Ablegen von Kreta, Andrews Verhaftung und Frau Lindemanns Gerichts-LARP-Triumph! Die Fortsetzung folgt in Fall 3.',
                  nextIntroLines: [],
                },
              }))
            }
          />
        );
      }

      return (
        <AnimatedOutro
          muted={muted}
          slides={CRETE_ACT22_OUTRO_SLIDES}
          cliffhangerTitle="Vorschau: Akt 2.3"
          finishButtonLabel="Weiter zu Akt 2.3"
          onComplete={() =>
            setState((prev) => ({
              ...prev,
              screen: 'PLAYING',
              flags: { ...prev.flags, flag_c2_dimitri_weg: true },
              pendingChapterTransition: {
                completedChapterTitle: 'Akt 2.2 abgeschlossen',
                completedTimeLabel: 'Strand von Kreta · Cliffhanger',
                summary:
                  'Im kurzen Tribunal hast du Brandts Lüge, die gekühlte Zelle und Kapitän Brammers Versteckspiel um die 02:10-Uhr-Position auf hoher See aufgedeckt. Ohne Beweis gegen einen Selbstmord endete das Verfahren – bis Nate am Strand von Kreta Eleonore Higginsons Schal sieht und ihn plötzlich als das „Seil“ aus Zelle 08 wiedererkennt!',
                nextChapterId: 'c2_akt3_nachmittag',
                nextLocationId: 'promenade',
                nextPhase: 'investigation',
                nextTimeOfDay: 'tag',
                resetLocations: ['promenade', 'brig_cell'],
                setEvidenceIds: ['ausweis_nate', 'zellen_klima_protokoll'],
                setThoughtIds: ['thought_c2_kuehlung_9grad'],
                setSolvedDeductions: [],
                setsFlag: 'flag_c2_dimitri_weg',
                nextButtonLabel: 'Weiter zu Akt 2.3 (Der blaue Schal)',
                nextIntroLines: [...CRETE_ACT23_INTRO_LINES],
              },
            }))
          }
        />
      );
    }
    return (
      <AnimatedOutro
        muted={muted}
        onComplete={() => setState((prev) => ({ ...prev, screen: 'VICTORY' }))}
      />
    );
  }

  // VICTORY / GAME OVER MODAL SCREEN
  if (state.screen === 'VICTORY' || state.screen === 'GAME_OVER') {
    const isWin = state.screen === 'VICTORY';
    const trialCp = state.trialCheckpoint;
    const chapterCp = state.chapterCheckpoint;

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-xl p-8 text-center space-y-6">
          <div className="mx-auto w-14 h-14 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
            <Scale className={`w-7 h-7 ${isWin ? 'text-emerald-400' : 'text-red-400'}`} />
          </div>

          <div className="space-y-2">
            <h1 className="font-display text-3xl font-bold text-slate-50">
              {isWin ? (activeCase.victoryTitle ?? 'FALL 1 ABGESCHLOSSEN!') : 'Verfahren vertagt'}
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              {isWin
                ? (activeCase.victorySummary ??
                  'Anya Brooks wurde endgültig freigesprochen und Arthur Morgan verhaftet – doch als vor dem Hafen von Kreta plötzlich alle Ausgänge abgeriegelt werden, beginnt erst das wahre Rätsel… (Fortsetzung folgt in Fall 2!)')
                : 'Deine Glaubwürdigkeit vor Gericht ist aufgebraucht. Du kannst direkt ab dem letzten Checkpoint weitermachen – mit voller Glaubwürdigkeit!'}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 py-3 border-y border-slate-800 text-xs">
            <div>
              <div className="text-slate-400">Beweise</div>
              <div className="font-mono-num text-base font-bold text-slate-100 mt-0.5">
                {state.collectedEvidence.length}/{Object.keys(activeCase.evidence).length}
              </div>
            </div>
            <div>
              <div className="text-slate-400">Deduktionen</div>
              <div className="font-mono-num text-base font-bold text-slate-100 mt-0.5">
                {state.solvedDeductions.length}/{activeCase.logicCombinations.length}
              </div>
            </div>
            <div>
              <div className="text-slate-400">Glaubwürdigkeit</div>
              <div className="font-mono-num text-base font-bold text-slate-100 mt-0.5">
                {state.credibility}/{state.maxCredibility}
              </div>
            </div>
          </div>

          {!isWin ? (
            <div className="flex flex-col gap-2.5">
              {trialCp && (
                <button
                  type="button"
                  onClick={() => restoreCheckpoint(trialCp)}
                  className="w-full px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Ab Prozess-Checkpoint wiederholen ({trialCp.label})
                </button>
              )}
              {chapterCp && (
                <button
                  type="button"
                  onClick={() => restoreCheckpoint(chapterCp)}
                  className="w-full px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold rounded-lg border border-slate-700 transition-colors cursor-pointer"
                >
                  Ab Kapitel-Start wiederholen ({chapterCp.label})
                </button>
              )}
              <div className="flex items-center justify-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => startNewGame(activeCase.id)}
                  className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-medium rounded-lg border border-slate-800 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Neues Spiel
                </button>
                <button
                  type="button"
                  onClick={() => setState((prev) => ({ ...prev, screen: 'TITLE_MENU' }))}
                  className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-medium rounded-lg border border-slate-800 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Zur Fallauswahl
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {activeCase.id === CRUISE_CASE.id && (
                <button
                  type="button"
                  onClick={() => startNewGame(CRETE_CASE.id)}
                  className="w-full px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Weiter zu Fall 2: Schatten über Kreta
                </button>
              )}
              {trialCp && (
                <button
                  type="button"
                  onClick={() => restoreCheckpoint(trialCp)}
                  className="w-full px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold rounded-lg border border-slate-700 transition-colors cursor-pointer"
                >
                  Letzte Verhandlung prüfen ({trialCp.label})
                </button>
              )}
              <div className="flex items-center justify-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => startNewGame(activeCase.id)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold rounded-lg border border-slate-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Nochmal spielen
                </button>
                <button
                  type="button"
                  onClick={() => setState((prev) => ({ ...prev, screen: 'TITLE_MENU' }))}
                  className="px-5 py-2.5 bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-lg border border-slate-800 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Zur Fallauswahl
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // MAIN GAMEPLAY VIEW
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* 3-Zone Top HUD Bar with Binder Menu */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Zone 1: Wordmark + Day/Phase */}
          <div className="flex items-center gap-3 min-w-0">
            <span className="font-display text-base sm:text-lg font-bold tracking-wide text-amber-400 whitespace-nowrap shrink-0">
              Advokat-Engine
            </span>
            <div className="hidden xl:flex items-center gap-2.5 text-xs text-slate-300">
              <span className="text-slate-600">·</span>
              <span className="font-semibold text-amber-300 whitespace-nowrap">
                {activeCase.chapters?.[state.currentChapterId]?.dayLabel ?? 'Tag 1 · Abend'}
              </span>
              <span className="text-slate-600">·</span>
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <Scale className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="font-mono-num font-semibold">
                  {state.credibility}/{state.maxCredibility}
                </span>
              </div>
            </div>
          </div>

          {/* Zone 2: Binder Drawer Menu (Gerichtsakte / Notizbuch / Struktur) */}
          <div className="flex items-center gap-1.5 bg-slate-950/70 border border-slate-800 rounded-lg p-1">
            <button
              type="button"
              onClick={() => {
                soundFx.play('page_turn');
                setActiveBinderTab((cur) => (cur === 'akte' ? null : 'akte'));
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                activeBinderTab === 'akte'
                  ? 'bg-slate-800 text-amber-300'
                  : 'text-slate-200 hover:bg-slate-800/70'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Gerichtsakte</span>
              <span className="font-mono-num text-[11px] text-slate-400">
                ({state.collectedEvidence.length})
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundFx.play('page_turn');
                setActiveBinderTab((cur) => (cur === 'notizbuch' ? null : 'notizbuch'));
              }}
              disabled={presentMode}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer disabled:opacity-40 ${
                activeBinderTab === 'notizbuch'
                  ? 'bg-slate-800 text-amber-300'
                  : 'text-slate-200 hover:bg-slate-800/70'
              }`}
            >
              <Brain className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Notizbuch</span>
              <span className="font-mono-num text-[11px] text-slate-400">
                ({state.unlockedThoughts.length})
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundFx.play('page_turn');
                setActiveBinderTab((cur) => (cur === 'struktur' ? null : 'struktur'));
              }}
              disabled={presentMode}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer disabled:opacity-40 ${
                activeBinderTab === 'struktur'
                  ? 'bg-slate-800 text-amber-300'
                  : 'text-slate-200 hover:bg-slate-800/70'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="hidden sm:inline">Struktur</span>
            </button>
          </div>

          {/* Zone 3: Credibility (compact on smaller screens) + Utility actions */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex xl:hidden items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/70 text-xs">
              <Scale className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="font-mono-num font-semibold text-slate-100">
                {state.credibility}/{state.maxCredibility}
              </span>
            </div>
            <button
              type="button"
              onClick={toggleMute}
              aria-label={muted ? 'Ton einschalten' : 'Ton stummschalten'}
              className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 cursor-pointer"
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={() => setShowRestartModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Neustart</span>
            </button>
          </div>
        </div>
      </header>

      {/* Notification Toast for new Evidence / Thoughts */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 bg-slate-900 border border-amber-500/70 text-amber-200 text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xl"
        >
          {toastMessage}
        </div>
      )}

      {/* Full-Width Centered Game Stage */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center">
        <GameStage
          gameCase={activeCase}
          state={state}
          location={currentLocation}
          presentCharacters={presentCharacters}
          dialogQueue={dialogQueue}
          activeShout={activeShout}
          stageShake={stageShake}
          presentMode={presentMode}
          investigationMenu={investigationMenu}
          visibleStatements={visibleStatements}
          onAdvanceDialog={handleAdvanceDialog}
          onSelectChoice={handleSelectChoice}
          onSetInvestigationMenu={setInvestigationMenu}
          onInspectHotspot={handleInspectHotspot}
          onInspectEmpty={handleInspectEmpty}
          onSelectTalkTopic={handleSelectTalkTopic}
          onTravelTo={handleTravelTo}
          onTogglePresentMode={handleTogglePresentMode}
          onNavigateStatement={handleNavigateStatement}
          onPressStatement={handlePressStatement}
          onConfirmChapterTransition={handleConfirmChapterTransition}
          onReturnToTitleMenu={() =>
            setState((prev) => ({ ...prev, screen: 'TITLE_MENU' }))
          }
          activeMiniGameId={activeMiniGame}
          onCompleteMiniGame={handleCompleteMiniGame}
          onCancelMiniGame={() => {
            if (activeMiniGame === 'cooling_pipes') {
              setState((prev) => ({
                ...prev,
                inspectedHotspots: prev.inspectedHotspots.filter(
                  (id) => id !== 'c2_a2_klima_panel'
                ),
              }));
            }
            setActiveMiniGame(null);
          }}
        />
      </main>

      {/* Slide-Over Binder Drawer (Gerichtsakte / Notizbuch / Struktur) */}
      {activeBinderTab && (
        <CaseBinder
          gameCase={activeCase}
          state={state}
          activeTab={activeBinderTab}
          presentMode={presentMode}
          onChangeTab={setActiveBinderTab}
          onClose={() => {
            setActiveBinderTab(null);
            if (presentMode && !topLine?.requiresFinalEvidencePrompt) {
              setPresentMode(false);
            }
          }}
          onSelectEvidenceToPresent={handleSelectEvidenceToPresent}
          onInspectEvidence={handleInspectEvidence}
          onCombineThoughts={handleCombineThoughts}
        />
      )}

      {/* Restart Options Modal */}
      {showRestartModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Neustart wählen"
          onClick={() => setShowRestartModal(false)}
        >
          <div
            className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3
                  onClick={handleSecretDevTap}
                  className="font-display text-lg font-bold text-slate-100 select-none"
                >
                  Neustart wählen
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Starte ab dem aktuellen Kapitelanfang, dem letzten Verhör oder kehre zur Fallauswahl zurück.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowRestartModal(false)}
                aria-label="Schließen"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              {state.chapterCheckpoint && (
                <button
                  type="button"
                  onClick={() => restoreCheckpoint(state.chapterCheckpoint!)}
                  className="w-full text-left px-4 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg transition-colors cursor-pointer"
                >
                  <div className="text-xs font-bold">
                    Kapitelanfang neu starten
                  </div>
                  <div className="text-[11px] font-medium text-slate-900/80 mt-0.5">
                    {state.chapterCheckpoint.label} · mit voller Glaubwürdigkeit
                  </div>
                </button>
              )}

              {state.trialCheckpoint && (
                <button
                  type="button"
                  onClick={() => restoreCheckpoint(state.trialCheckpoint!)}
                  className="w-full text-left px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  <div className="text-xs font-semibold">
                    Prozess-Checkpoint laden
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                    {state.trialCheckpoint.label}
                  </div>
                </button>
              )}

              {activeCase.id === CRUISE_CASE.id ? (
                <button
                  type="button"
                  onClick={() => restoreCheckpoint(createFinalTrialCheckpoint(), true)}
                  className="w-full text-left px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  <div className="text-xs font-semibold">
                    Zur letzten Verhandlung springen (Tag 3 · Morgen)
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Direkt zum Hauptverfahren · ab Kommissar Marston
                  </div>
                </button>
              ) : devShortcutsUnlocked ? (
                <>
                  <button
                    type="button"
                    onClick={() => restoreCheckpoint(createCreteAct22Checkpoint(), true)}
                    className="w-full text-left px-4 py-2.5 bg-amber-950/50 hover:bg-amber-900/50 border border-amber-500/40 text-amber-200 rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="text-xs font-semibold">
                      Zu Akt 2.2 springen (Tag 4 · Mittag)
                    </div>
                    <div className="text-[11px] text-amber-300/75 mt-0.5">
                      Entwickler-Shortcut · ab Krankenstation / Tatzeit-Ermittlung
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => restoreCheckpoint(createCreteAct23Checkpoint(), true)}
                    className="w-full text-left px-4 py-2.5 bg-amber-950/50 hover:bg-amber-900/50 border border-amber-500/40 text-amber-200 rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="text-xs font-semibold">
                      Zu Akt 2.3 springen (Tag 4 · Nachmittag)
                    </div>
                    <div className="text-[11px] text-amber-300/75 mt-0.5">
                      Entwickler-Shortcut · blauer Schal, Kreuzfahrtmanagerin & Magnetschloss
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => restoreCheckpoint(createCreteAct24Checkpoint(), true)}
                    className="w-full text-left px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="text-xs font-semibold">
                      Zu Akt 2.4 springen (Eleonore im Zeugenstand)
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Direkt ab Tag 4 · Abend & danach Akt 2.5
                    </div>
                  </button>
                </>
              ) : null}

              <button
                type="button"
                onClick={() => startNewGame(activeCase.id)}
                className="w-full text-left px-4 py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                <div className="text-xs font-semibold">
                  Aktuellen Fall komplett neu starten
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Zurück zum Intro von {activeCase.title}
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowRestartModal(false);
                  setState((prev) => ({ ...prev, screen: 'TITLE_MENU' }));
                }}
                className="w-full text-left px-4 py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg transition-colors cursor-pointer"
              >
                <div className="text-xs font-semibold">
                  Zurück zur Fallauswahl
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Zwischen Fall 1 und Fall 2 wechseln
                </div>
              </button>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setShowRestartModal(false)}
                className="px-4 py-1.5 text-xs font-medium text-slate-300 hover:text-slate-100 cursor-pointer"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
