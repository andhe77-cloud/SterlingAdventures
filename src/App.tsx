import { Component, type ErrorInfo, type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen,
  Brain,
  Gavel,
  GitBranch,
  Maximize2,
  Minimize2,
  RotateCcw,
  Scale,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { AnimatedIntro } from './components/AnimatedIntro';
import {
  AnimatedOutro,
  CASE3_ST2_OUTRO_SLIDES,
  CASE4_EPILOG_OUTRO_SLIDES,
  CASE4_FINALE_OUTRO_SLIDES,
  CASE4_PART1_OUTRO_SLIDES,
  CRETE_ACT22_OUTRO_SLIDES,
  CRETE_ACT23_OUTRO_SLIDES,
} from './components/AnimatedOutro';
import { HorizontalCredits } from './components/HorizontalCredits';
import { CaseBinder, type BinderTab } from './components/CaseBinder';
import { GameStage, type InvestigationMenu } from './components/GameStage';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PWAInstallButton } from './components/PWAInstallButton';
import { useFullscreen } from './hooks/useFullscreen';
import { CRUISE_CASE } from './data/cruiseCase';
import { CRETE_ACT23_INTRO_LINES, CRETE_CASE } from './data/creteCase';
import { CASE3_SEETAG, F3_ST2_TRIAL_INTRO_LINES } from './data/case3Seetag';
import { CASE4_MALTA, F4_EPILOG_INTRO_LINES, F4_FINALE_INTRO_LINES } from './data/case4Malta';
import {
  KAP4_MORGEN_INTRO_LINES,
  createCreteAct22Checkpoint,
  createCreteAct23Checkpoint,
  createCreteAct24Checkpoint,
  getChapterJumpOptions,
} from './data/chapterCheckpoints';
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

class GameErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Advokat-Engine Fehler abgefangen:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl p-6 text-center space-y-4">
            <h2 className="font-display text-xl font-bold text-amber-400">
              Kleiner technischer Aussetzer
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Dein Spielfortschritt ist sicher im Browser gespeichert. Du kannst jetzt problemlos fortfahren.
            </p>
            <button
              type="button"
              onClick={() => this.setState({ hasError: false })}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-bold rounded-lg cursor-pointer"
            >
              Szene wiederherstellen
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const ALL_CASES: GameCase[] = [CRUISE_CASE, CRETE_CASE, CASE3_SEETAG, CASE4_MALTA];
const CASE_MAP: Record<string, GameCase> = {
  [CRUISE_CASE.id]: CRUISE_CASE,
  [CRETE_CASE.id]: CRETE_CASE,
  [CASE3_SEETAG.id]: CASE3_SEETAG,
  [CASE4_MALTA.id]: CASE4_MALTA,
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

function buildRepeatInspectLine(
  label: string,
  repeatCount: number,
  assistantId: 'maya' | 'eleonore' = 'maya'
): DialogLine[] {
  if (assistantId === 'eleonore') {
    if (repeatCount <= 1) {
      return [
        {
          speakerId: 'eleonore',
          emotion: 'neutral',
          text: `„${label}“ habe ich doch eben schon in meinem Block abgehakt, Nate. Schauen wir lieber weiter!`,
        },
      ];
    }
    if (repeatCount === 2) {
      return [
        {
          speakerId: 'eleonore',
          emotion: 'thinking',
          text: `Ähm, Nate? „${label}“ verrät uns beim zweiten Draufschauen leider auch nicht mehr als vorhin…`,
        },
      ];
    }
    return [
      {
        speakerId: 'eleonore',
        emotion: 'sweating',
        text: `Also wirklich, Nate! Drei Kinder zu Hause reichen mir schon mit Wiederholungen — suchen wir bitte an einer neuen Stelle statt bei „${label}“!`,
      },
    ];
  }

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

function AdvokatEngineApp() {
  const [state, setState] = useState<GameSaveState>(() => createInitialState(CRUISE_CASE));
  const [savedCaseIds, setSavedCaseIds] = useState<Record<string, boolean>>(() => ({
    [CRUISE_CASE.id]: Boolean(loadSavedState(CRUISE_CASE.id)),
    [CRETE_CASE.id]: Boolean(loadSavedState(CRETE_CASE.id)),
    [CASE3_SEETAG.id]: Boolean(loadSavedState(CASE3_SEETAG.id)),
    [CASE4_MALTA.id]: Boolean(loadSavedState(CASE4_MALTA.id)),
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
  const {
    isFullscreen,
    isSupported: isFullscreenSupported,
    toggleFullscreen,
  } = useFullscreen();

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
        text: 'Schön, dass du wieder an Bord meines Teams bist, Maya! Hör zu: Andrew und ich haben in der Schaltzentrale exakt zwischen 02:04 Uhr und 02:19 Uhr den heimlichen Strom-Absturz des Zellenschlosses gefunden – genau das Zeitfenster, in dem der Hocker umfiel.',
      },
      {
        speakerId: 'maya',
        emotion: 'thinking',
        text: 'Oh?! Und hat der Elektriker um zwei Uhr nachts vielleicht jemanden durch die Gänge schleichen sehen?',
      },
      {
        speakerId: 'nate',
        emotion: 'thinking',
        text: 'Nein, der stand hinten bei den lauten Hauptgeneratoren. Aber wir haben überlegt, wer um zwei Uhr morgens im Passagierbereich überhaupt regulär Dienst hat und etwas bemerkt haben könnte: Eigentlich bleibt da außer der Brücke nur noch die Krankenstation!',
      },
      {
        speakerId: 'maya',
        emotion: 'confident',
        text: 'Stimmt!! Die Krankenstation hat ja rund um die Uhr Bereitschaft! Gehen wir sofort hoch zu Dr. Vance und fragen sie, ob ihr heute Nacht gegen zwei Uhr etwas aufgefallen ist!',
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

  // Station 3.2 milestone celebration once Aufgaben 1, 2, and 3 are all cleared (Aufgabe 4 pending)
  useEffect(() => {
    if (
      state.screen !== 'PLAYING' ||
      dialogQueue.length > 0 ||
      activeMiniGame !== null ||
      activeCase.id !== CASE3_SEETAG.id ||
      state.currentChapterId !== 'f3_st2_spurensuche' ||
      !state.flags.flag_f3_aufgabe1_erledigt ||
      !state.flags.flag_f3_aufgabe2_erledigt ||
      !state.flags.flag_f3_aufgabe3_erledigt ||
      state.flags.flag_f3_aufgaben123_jubel
    ) {
      return;
    }

    setDialogQueue([
      {
        speakerId: 'eleonore',
        emotion: 'confident',
        shout: 'VOLLTREFFER!',
        shake: true,
        sfx: 'victory',
        setsFlag: 'flag_f3_aufgaben123_jubel',
        text: 'NATE!! Hast du eben auf unsere Aufgabenliste geschaut?! DREI VON VIER ANKLAGEPUNKTEN SIND IN EINEM ZUG ZERLEGT!!',
      },
      {
        speakerId: 'nate',
        emotion: 'confident',
        text: 'Tatsächlich, Eleonore! Drei massive Säulen von Falks Anklage liegen am Boden: Punkt 1 – im MS-400-Handbuch fehlt genau die Seite „Bekannte Fehler“.',
      },
      {
        speakerId: 'nate',
        emotion: 'confident',
        text: 'Punkt 2 – Andrews verlorener blauer Schal landete über die VIP-Schmutzwäsche als nicht abgeholtes Fundstück F-418 im Fundbüro. Und Punkt 3 – Kalle Jensens Dienstplan-Zeugnis und unsere Laufweg-Analyse beweisen, dass Andrew um 02:12 Uhr oben auf Deck 10 stand!',
      },
      {
        speakerId: 'eleonore',
        emotion: 'thinking',
        text: 'Jetzt hängt über unserem ganzen Fall nur noch Aufgabe 4 – dieser verflixte 45.000-€-Brief an „A. H.“ und Andrews angebliches Motiv. Und wenn wir ganz ehrlich sind…',
      },
      {
        speakerId: 'nate',
        emotion: 'thinking',
        text: 'Für Aufgabe 4 reichen unsere Spuren von heute auf See nicht aus. Um herauszufinden, was es mit diesem weingetränkten Brief wirklich auf sich hat, müssen wir uns die Original-Beweise aus Fall 1 noch einmal ganz genau vorknöpfen.',
      },
      {
        speakerId: 'eleonore',
        emotion: 'confident',
        text: 'Hoffen wir, dass diese drei zertrümmerten Indizien für heute Abend reichen, um den Richter umzustimmen! Und weißt du was, Nate? Mir ist beim Ermitteln tatsächlich mein ganzer Magenkrampf vergangen… fast macht mir diese Detektivarbeit unheimlich Spaß!',
      },
      {
        speakerId: 'eleonore',
        emotion: 'confident',
        setsFlag: 'flag_f3_eleonore_zurueck',
        text: 'Aber jetzt muss ich schnell zurück zu meinen drei Räubern und die arme Maya erlösen – die ist mit den Jungs bestimmt längst am Rand der Verzweiflung! Wir sehen uns direkt vor dem Ballsaal, Nate! Viel Glück da drinnen!',
      },
      {
        speakerId: 'maya_chaos',
        emotion: 'sweating',
        animation: 'shock',
        shake: true,
        sfx: 'damage',
        text: 'NATE!! *keuch* ICH LEBE NOCH!! KNAPP!!',
      },
      {
        speakerId: 'nate',
        emotion: 'smug',
        text: 'Na, Maya… hast du dich oben in der Spielecke gemütlich auf dem Sofa ausgeruht? Du siehst aus, als wärst du mit einer Piratengaleere kollidiert.',
      },
      {
        speakerId: 'maya_chaos',
        emotion: 'sweating',
        animation: 'headshake',
        text: '„AUSGERUHT“?! Leo hat mich als Schiedsrichterin für ein blindes Liegestuhl-Hindernisrennen durch Kabine 642 engagiert, während Conrad mir alle dreißig Sekunden mit einer Schaumstoff-Torpedonudel in die Kniekehlen gerammt ist!',
      },
      {
        speakerId: 'maya_chaos',
        emotion: 'sweating',
        text: 'Und DANN kam Rick auf die glorreiche Idee eines wissenschaftlichen Experiments mit Stoppuhr: Wie schnell können drei Jungs sechs Päckchen Multivitaminsaft durch verknotete Knick-Strohhalme leeren?! Exakt drei Sekunden, bevor Conrad mitten im Zug nieste — direkt auf meine Bluse!!',
      },
      {
        speakerId: 'maya_chaos',
        emotion: 'grumpy',
        text: 'Das Schokoladeneis als Friedensangebot habe ich nur überlebt, weil ich mir anschließend noch fünfundvierzig Minuten lang Dino-Sticker auf den Kragen kleben lassen musste – guck nicht so auf den grünen T-Rex, der klebt wie Sekundenkleber! Und meine Handtasche blubbert immer noch verdächtig.',
      },
      {
        speakerId: 'nate',
        emotion: 'confident',
        text: 'Dann verdienst du jetzt offiziell das höchste Tapferkeits-Abzeichen der Seefahrt, Partnerin! Hier, nimm ein frisches Tuch und wirf dir schnell deine Reserve-Bluse über — denn gerade schlägt die Schiffsglocke zur Abendverhandlung. Im Großen Ballsaal wartet schon Staatsanwalt von Falk höchstpersönlich auf uns!',
      },
      ...F3_ST2_TRIAL_INTRO_LINES,
    ]);
  }, [
    state.screen,
    state.currentChapterId,
    state.flags.flag_f3_aufgabe1_erledigt,
    state.flags.flag_f3_aufgabe2_erledigt,
    state.flags.flag_f3_aufgabe3_erledigt,
    state.flags.flag_f3_aufgaben123_jubel,
    dialogQueue.length,
    activeMiniGame,
    activeCase.id,
  ]);

  const startNewGame = (targetCaseId?: string) => {
    const caseDef = CASE_MAP[targetCaseId ?? activeCase.id] ?? CRUISE_CASE;
    if (caseDef.id === CASE3_SEETAG.id) {
      try {
        localStorage.removeItem('advokat_f3_ship_plan_excluded_v1');
      } catch {
        // ignore
      }
    }
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
    if (
      checkpoint.snapshot.caseId === CASE3_SEETAG.id &&
      !checkpoint.snapshot.flags.flag_f3_marston_kabine_offen
    ) {
      try {
        localStorage.removeItem('advokat_f3_ship_plan_excluded_v1');
      } catch {
        // ignore
      }
    }
    const restoredSnapshot: GameCheckpointSnapshot = {
      ...checkpoint.snapshot,
      flags: { ...checkpoint.snapshot.flags },
      unlockedLocations: [...checkpoint.snapshot.unlockedLocations],
      collectedEvidence: [...checkpoint.snapshot.collectedEvidence],
      unlockedThoughts: [...checkpoint.snapshot.unlockedThoughts],
      solvedDeductions: [...checkpoint.snapshot.solvedDeductions],
      visitedTopics: [...checkpoint.snapshot.visitedTopics],
      inspectedHotspots: [...checkpoint.snapshot.inspectedHotspots],
      screen: 'PLAYING',
      credibility: checkpoint.snapshot.maxCredibility,
    };
    setState((prev) => ({
      ...restoredSnapshot,
      trialCheckpoint: setAsChapterCheckpoint
        ? restoredSnapshot.phase === 'court'
          ? checkpoint
          : null
        : (prev.trialCheckpoint ?? null),
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
        const eleonoreAssistantActive =
          activeCase.id === CASE3_SEETAG.id &&
          Boolean(state.flags.flag_f3_maya_bei_kindern);
        setDialogQueue([
          mayaAwayInCell
            ? {
                speakerId: 'nate',
                emotion: 'confident',
                text: 'Hier in der Zelle habe ich mir damit erst einmal alles genau angesehen.',
              }
            : eleonoreAssistantActive
              ? {
                  speakerId: 'eleonore',
                  emotion: 'confident',
                  text: 'Ich glaube, hier haben wir uns jeden Winkel genau angesehen und notiert, Nate!',
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

    if (transition.nextChapterId === CASE3_SEETAG.id) {
      startNewGame(CASE3_SEETAG.id);
      return;
    }

    if (transition.nextChapterId === CASE4_MALTA.id) {
      startNewGame(CASE4_MALTA.id);
      return;
    }

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
    setDialogQueue((prevQueue) => {
      const current = prevQueue[0];
      const choice = current?.choices?.[choiceIndex];
      if (!choice) return prevQueue;
      const rest = prevQueue.slice(1);
      if (current.choicePool && !choice.exitsChoicePool && current.choices) {
        const remainingChoices = current.choices.filter((_, idx) => idx !== choiceIndex);
        if (remainingChoices.length > 0) {
          const repeatNode: DialogLine = {
            ...current,
            choices: remainingChoices,
          };
          return [...choice.nextLines, repeatNode, ...rest];
        }
      }
      return [...choice.nextLines, ...rest];
    });
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
      return;
    }

    if (miniGameId === 'kids_dressup') {
      enqueueLines([
        {
          speakerId: 'maya',
          emotion: 'confident',
          shout: 'VOLLTREFFER!',
          shake: true,
          sfx: 'victory',
          text: 'Geschafft!! Leo hat sein schwarzes Piraten-Shirt, die leuchtende Uhr und sein Messing-Fernrohr, Rick steckt im schlichten weißen Shirt samt Nachtisch-Wette und der silbernen Stoppuhr, und Conrad trägt stolz sein neongelbes Marathon-Shirt mit Medaille und seinem grünen Spielzeug-Dino!',
        },
        {
          speakerId: 'maya',
          emotion: 'confident',
          setsFlag: 'flag_f3_maya_bei_kindern',
          text: 'So, Ihr zwei: Ich schnapp mir die drei Wirbelwinde jetzt für den Rest des Tages und belagere die Spielecke mit Piraten-Malbüchern! Und wehe einer verrät dem kleinen Schoko-Fan hier vor dem Mittagessen das Eis-Versprechen…',
        },
        {
          speakerId: 'eleonore',
          emotion: 'confident',
          unlocksThought: 'thought_f3_assistentin_eleonore',
          unlocksLocation: 'brig_cell',
          setsFlag: 'flag_f3_brig_offen',
          text: 'Danke, Maya — du bist ein echter Engel!! Dann bin ich bis zum nächsten Gerichtstermin offiziell Ihre neue Assistentin, Nate! Schauen wir sofort hinunter in den Arrestbereich zu Andrew!',
        },
        {
          speakerId: 'nate',
          emotion: 'confident',
          switchesLocationId: 'brig_cell',
          text: 'Auf in den Zellentrakt, Assistentin Eleonore — machen wir uns sofort auf den Weg zu Zelle 08!',
        },
      ]);
      return;
    }

    if (miniGameId === 'ship_plan') {
      enqueueLines([
        {
          speakerId: 'nate',
          emotion: 'confident',
          shout: 'VOLLTREFFER!',
          shake: true,
          sfx: 'deduction',
          text: 'JETZT passt jedes einzelne Puzzleteil!! Alle VIP-Decks, Außenkabinen, lauten Decks, Restaurant-Decks, Familienbereiche, Bug, Heck, Steuerbord und Wartungsnummern sind gestrichen…',
        },
        {
          speakerId: 'eleonore',
          emotion: 'shocked',
          unlocksEvidence: 'notiz_kabine_917',
          unlocksThought: 'thought_f3_kabine_917',
          unlocksLocation: 'marston_cabin',
          setsFlag: 'flag_f3_marston_kabine_offen',
          text: 'Übrig bleibt ganz allein… Deck 9, Innenkabine, Mittschiffs, Backbord — Kabine 917!!',
        },
        {
          speakerId: 'miriam',
          emotion: 'smug',
          text: 'Oh, wirklich? Kabine 917? Na sowas… Welch erstaunliche Kombinationsgabe! Ich habe selbstverständlich überhaupt nichts gesagt und wünsche einen schönen Spaziergang auf Deck 9!',
        },
        {
          speakerId: 'nate',
          emotion: 'confident',
          switchesLocationId: 'marston_cabin',
          text: 'Kommen Sie, Eleonore — gehen wir hoch zu Deck 9 und klopfen direkt an Kabine 917!',
        },
      ]);
      return;
    }

    if (miniGameId === 'vip_sokoban') {
      enqueueLines([
        {
          speakerId: 'eleonore',
          emotion: 'confident',
          shout: 'VOLLTREFFER!',
          shake: true,
          sfx: 'victory',
          setsFlag: 'flag_f3_vip_aufgeraeumt',
          text: 'So!! Alle drei Servierwagen stehen wie mit dem Lineal gezogen an der Wand — nicht einmal ein Krümel liegt mehr quer!',
        },
        {
          speakerId: 'vip_guest',
          emotion: 'neutral',
          text: 'Hmpf… na gut, meine Dame, wenigstens versteht noch jemand auf diesem Kahn etwas von Zucht und Ordnung! Meinetwegen schauen Sie auf meinem Tablet auf gut Glück kurz durch meine zehn Beschwerdefotos von der gesamten Reise.',
          choices: [
            {
              label: 'Die Beschwerde-Fotos gleich auf gut Glück ansehen!',
              nextLines: [
                {
                  speakerId: 'nate',
                  emotion: 'thinking',
                  text: 'Danke, Herr von Berg — mal sehen, ob auf diesen Fotos irgendetwas Bemerkenswertes zu erkennen ist.',
                  startsMiniGameId: 'vip_photo_search',
                },
              ],
            },
            {
              label: 'Tablet später über den Schauplatz ansehen',
              nextLines: [
                {
                  speakerId: 'eleonore',
                  emotion: 'confident',
                  text: 'Wir schauen gleich auf das Tablet drüben auf dem Tisch!',
                },
              ],
            },
          ],
        },
      ]);
      return;
    }

    if (miniGameId === 'vip_photo_search') {
      enqueueLines([
        {
          speakerId: 'eleonore',
          emotion: 'shocked',
          shout: 'MOMENT MAL!',
          shake: true,
          sfx: 'deduction',
          text: 'NATE!! HALTEN SIE DAS BILD AN!! Schauen Sie rechts zwischen diese zerknüllten weißen VIP-Handtücher!! Das da — dieses königsblaue Seidentuch mit dem kleinen Goldrand!!',
        },
        {
          speakerId: 'nate',
          emotion: 'shocked',
          unlocksEvidence: 'beweis_vip_waeschefoto',
          unlocksLocation: 'laundry',
          setsFlag: 'flag_f3_vip_foto_gefunden',
          text: 'UNFASSBAR!! Das ist exakt Andrews Kreta-Seidenschal!! Er hat ihn gestern gar nicht in seine Jacke gesteckt, sondern beim späten Aufräumen versehentlich mit den feuchten Handtüchern im VIP-Wagen mit abgeräumt!',
        },
        {
          speakerId: 'vip_guest',
          emotion: 'neutral',
          setsFlag: 'flag_f3_waescherei_offen',
          text: 'Äh… mein Schal-Ding da interessiert mich herzlich wenig! Diese junge Kraft aus der Wäscherei — eine gewisse Elara — hat jedenfalls genau diesen Handtuch-Wagen noch am Abend nach unten in die Bord-Wäscherei geschoben!',
        },
        {
          speakerId: 'eleonore',
          emotion: 'confident',
          text: 'Das ist unsere goldene Spur!! Ab hinunter in die Bord-Wäscherei und Elara genau dieses Foto zeigen!',
        },
      ]);
      return;
    }

    if (miniGameId === 'fundbuero_log') {
      enqueueLines([
        {
          speakerId: 'nate',
          emotion: 'confident',
          shout: 'VOLLTREFFER!',
          shake: true,
          sfx: 'deduction',
          unlocksEvidence: 'beweis_fundbuero_protokoll',
          unlocksThought: 'thought_f3_schal_crew_verdacht',
          setsFlag: 'flag_f3_aufgabe2_erledigt',
          text: 'SCHWARZ AUF WEISS!! Eintrag F-418: „Königsblauer Kreta-Seidenschal mit goldener Borte, eingeliefert aus VIP-Wäscherei — Status: NICHT ABGEHOLT“!',
        },
        {
          speakerId: 'eleonore',
          emotion: 'confident',
          unlocksThought: 'thought_f3_erledigt_2_schal',
          text: 'Damit bricht Staatsanwalt von Falks ganze Schal-Lüge zusammen! Andrew hat kein Tatwerkzeug versteckt — sein Schal landete völlig harmlos in der Wäsche und danach im Fundbüro!',
        },
        {
          speakerId: 'nate',
          emotion: 'thinking',
          text: 'Und noch viel brisanter, Eleonore: Wenn der Schal hier im verschlossenen Fundbüro nie regulär abgeholt wurde, dann hat ihn danach jemand an sich genommen, der freien Zugang zum Personal- & Fundbereich hatte… Jemand aus der Crew!! Aufgabe 2 ist damit komplett geklärt!',
        },
      ]);
      return;
    }

    if (miniGameId === 'duty_roster_puzzle') {
      enqueueLines([
        {
          speakerId: 'eleonore',
          emotion: 'confident',
          shout: 'VOLLTREFFER!',
          shake: true,
          sfx: 'deduction',
          unlocksEvidence: 'notiz_nachtdienstplan',
          unlocksLocation: 'pool_deck',
          setsFlag: 'flag_f3_pooldeck_offen',
          text: 'Kombination perfekt aufgelöst!! Timo war unten auf Deck 5, Svenja im Korridor von Deck 2 — aber genau zwischen 01:55 und 02:35 Uhr hatte Matrose KALLE JENSEN mit dem Zitrusreiniger Schicht oben auf Deck 10, dem Pool- & Spieldeck!!',
        },
        {
          speakerId: 'captain',
          emotion: 'neutral',
          text: 'Na bitte — geht doch, wenn man selbst liest! Kalle dreht gerade wieder oben auf dem Pooldeck seine Runden. Fragen Sie ihn meinetwegen direkt selbst aus!',
        },
      ]);
      return;
    }

    if (miniGameId === 'alibi_route_map') {
      enqueueLines([
        {
          speakerId: 'nate',
          emotion: 'confident',
          shout: 'VOLLTREFFER!',
          shake: true,
          sfx: 'deduction',
          unlocksEvidence: 'beweis_alibi_laufweg',
          unlocksThought: 'thought_f3_erledigt_3_alibi',
          setsFlag: 'flag_f3_aufgabe3_erledigt',
          text: 'UND DA STEHT ES SCHWARZ AUF WEISS!! 01:58 Uhr auf der Deck-5-Kamera beim Auszug — 02:12 Uhr von Matrose Kalle auf Deck 10 gesehen — und 02:23 Uhr wieder auf Deck 5 zurück!!',
        },
        {
          speakerId: 'eleonore',
          emotion: 'confident',
          text: 'Das bedeutet klipp und klar: Zwischen 02:04 und 02:19 Uhr konnte Andrew niemals unten in Zelle 08 auf Deck 2 gewesen sein!! Falks drittes Indiz — die Nachtaufnahmen — ist damit restlos vom Tisch! Aufgabe 3 erledigt!',
        },
      ]);
      return;
    }

    if (miniGameId === 'kowalski_books_hidden') {
      enqueueLines([
        {
          speakerId: 'eleonore',
          emotion: 'shocked',
          shout: 'MOMENT MAL!',
          shake: true,
          sfx: 'deduction',
          unlocksEvidence: 'beweis_ms400_handbuch_luecke',
          unlocksThought: 'thought_f3_erledigt_1_wissen',
          setsFlag: 'flag_f3_aufgabe1_erledigt',
          text: 'NATE!! SCHAUEN SIE IN DIESES SCHLOSS-HANDBUCH (MS-400 · BORDCODE MS-400)!! Genau bei der Seite „Bekannte Fehler“ klafft eine saubere Risskante — SIE WURDE KOMPLETT HERAUSGERISSEN!!',
        },
        {
          speakerId: 'nate',
          emotion: 'confident',
          text: 'GENIALER FUND!! Irgendjemand hat genau diese Wartungs-Seite vor der Tat heimlich aus Kowalskis Werkstatt-Handbuch entfernt, damit sich niemand an die Sicherheitslücke erinnert — außer dem Täter selbst!! Damit ist Falks „Täterwissen“-Argument in Aufgabe 1 komplett entkräftet!',
        },
      ]);
      return;
    }

    if (miniGameId === 'letter_forensics') {
      enqueueLines([
        {
          speakerId: 'nate',
          emotion: 'confident',
          shout: 'VOLLTREFFER!',
          shake: true,
          sfx: 'deduction',
          unlocksEvidence: 'beweis_brief_manipuliert',
          unlocksThought: 'thought_f4_brief_gefaelscht',
          setsFlag: 'flag_f4_brief_geprueft',
          text: 'EINSPRUCH GEGEN DIESES MOTIV-INDIZ!! Unter Lupe und UV-Streiflicht ist es glasklar: Dieser Brief wurde nachträglich über den angetrockneten Weinrand mit einer zweiten Tinte manipuliert!',
        },
        {
          speakerId: 'maya',
          emotion: 'confident',
          text: 'Und schau dir die Initialen unten rechts an! Die Federstriche sind so mehrfach überschrieben worden, dass kein Mensch mehr sagen kann, ob da ursprünglich „A. W.“, „A. M.“ oder „A. H.“ stand!!',
        },
        {
          speakerId: 'marston',
          emotion: 'neutral',
          text: 'Verflucht… damit hat von Falk überhaupt keine Kontoverbindung mehr UND einen offensichtlich verfälschten Brief! Als Beweis vor Pendelton taugt das Ding heute Abend keine Sekunde mehr.',
        },
        {
          speakerId: 'nate',
          emotion: 'confident',
          text: 'Für heute Abend reicht das völlig aus, Maya! Damit fällt auch der letzte Rest von Punkt 4 in sich zusammen!',
        },
        {
          speakerId: 'marston',
          emotion: 'sweating',
          text: 'So, ihr beiden — meine zehn Minuten sind um! Eleonore, Andrew und die drei Wildfänge warten unten an der Gangway. Wir sehen uns nach dem Landgang! Und ihr zwei könnt jetzt endlich guten Gewissens auf Malta an Land gehen!',
        },
        {
          speakerId: 'nate',
          emotion: 'thinking',
          sfx: 'thought_pop',
          unlocksThought: 'thought_f4_chronometer_billig',
          unlocksLocation: 'malta_harbor',
          setsFlag: 'flag_f4_malta_offen',
          text: '(Moment… Frank schließt gerade die Kammer ab. Während wir rausgehen, fällt mein Blick noch einmal kurz auf den Goldenen Chronometer in der Vitrine… Sagt mal: Ich verstehe die ganze Aufregung um das Teil gar nicht — aus der Nähe sieht es irgendwie seltsam billig aus?)',
        },
        {
          speakerId: 'maya',
          emotion: 'confident',
          text: 'Ach, bestimmt nur das grelle Neonlicht hier drinnen, Nate! Jetzt legen wir kurz die Akten zur Seite — ab nach Valletta ins maltesische Sonnenlicht!',
        },
      ]);
      return;
    }

    if (miniGameId === 'library_books_hidden') {
      enqueueLines([
        {
          speakerId: 'maya',
          emotion: 'confident',
          shout: 'VOLLTREFFER!',
          shake: true,
          sfx: 'deduction',
          unlocksEvidence: 'beweis_flottenbuch_merkmale',
          unlocksThought: 'thought_f4_drei_merkmale',
          setsFlag: 'flag_f4_buecher_gefunden',
          text: 'TREFFER!! In der „Chronik der Aurora-Linie (1924)“ stehen exakt die drei Echtheitsmerkmale des originalen Schiffs-Chronometers!!',
        },
        {
          speakerId: 'nate',
          emotion: 'confident',
          text: 'Lies vor, Maya: Erstens massives 18-Karat-Vollgold, zweitens eine bewegliche doppelte kardanische Aufhängung, und drittens der tiefe Manufaktur-Stempel „Chronométrie Horloge Genève · Nr. 1924-A“!',
        },
        {
          speakerId: 'maya',
          emotion: 'confident',
          switchesLocationId: 'security_room',
          text: 'Nichts wie zurück in die Sicherheits- & Asservatenkammer zu Detective Marston! Halten wir genau diese drei Punkte gegen unseren Chronometer!!',
        },
      ]);
      return;
    }

    if (miniGameId === 'chronometer_compare') {
      enqueueLines([
        {
          speakerId: 'nate',
          emotion: 'confident',
          shout: 'EINSPRUCH!',
          shake: true,
          sfx: 'deduction',
          unlocksEvidence: 'beweis_chronometer_faelschung',
          setsFlag: 'flag_f4_faelschung_bewiesen',
          text: 'ES IST OFFIZIELL BEWIESEN: DAS HIER IST EINE FÄLSCHUNG!!',
        },
        {
          speakerId: 'maya',
          emotion: 'shocked',
          text: 'Schau dir diese drei Befunde an: Das angebliche 18-Karat-Gold blättert als dünne Farbe über grauem Zinn ab — die kardanische Aufhängung ist starr verschraubt — und im Innendeckel prangt sauber eingraviert: „REPLIKA · VALLETTA M-09“!!',
        },
        {
          speakerId: 'marston',
          emotion: 'shocked',
          animation: 'shock',
          sfx: 'tension',
          text: 'Beim Klabautermann… der echte Schiffs-Chronometer aus Fall 1 liegt gar nicht in dieser Vitrine?! Jemand hat ein ganzes Schiff mit einer Replik aus Malta getäuscht — und ein echter Kapitän hat sie bestellt!!',
        },
        {
          speakerId: 'cruisemanager',
          emotion: 'confident',
          sfx: 'alarm',
          text: 'DURCHSAGE AN ALLE BETEILIGTEN! Hier spricht Sabine Lindemann! Es ist Abend geworden, alle Passagiere sitzen bereits auf ihren Plätzen — im Großen Ballsaal beginnt in wenigen Minuten DIE LETZTE VERHANDLUNG!!',
        },
        {
          speakerId: 'pendelton',
          emotion: 'neutral',
          sfx: 'gavel_double',
          text: 'Verteidiger Sterling, Detective Marston — bringen Sie unverzüglich jede neue Erkenntnis in den Großen Ballsaal! Heute Abend werden alle Geheimnisse von Fall 1 bis Malta restlos aufgeklärt!',
        },
        {
          speakerId: 'nate',
          emotion: 'confident',
          triggersOutro: true,
          text: 'Komm, Maya! Pack die Chronometer-Fälschung und alle Akten ein — vor dem ganzen Schiff beginnt jetzt die letzte Verhandlung!!',
        },
      ]);
      return;
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
      const assistantId =
        activeCase.id === CASE3_SEETAG.id && Boolean(state.flags.flag_f3_maya_bei_kindern)
          ? 'eleonore'
          : 'maya';
      enqueueLines(buildRepeatInspectLine(hotspot.label, nextCount, assistantId));
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
      soundFx.stopGreekBouzouki();
      soundFx.stopDramaticTheme();
      soundFx.stopMaltaShowTheme();
    }
    setMuted(next);
  };

  const handleToggleFullscreen = async () => {
    const ok = await toggleFullscreen();
    if (!ok) {
      showToast(
        'Vollbild ist in diesem Browser-Fenster blockiert — öffne die App direkt im Tab oder installiere sie als App.'
      );
    }
  };

  // TITLE SCREEN
  if (state.screen === 'TITLE_MENU') {
    return (
      <div className="min-h-screen min-h-dvh bg-slate-950 text-slate-100 flex flex-col">
        <header className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-slate-800/80 max-w-6xl w-full mx-auto">
          <span
            onClick={handleSecretDevTap}
            className="font-display text-lg font-bold tracking-wide text-amber-400 whitespace-nowrap shrink-0 select-none"
          >
            Advokat-Engine
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <PWAInstallButton />
            {isFullscreenSupported && (
              <button
                type="button"
                onClick={() => void handleToggleFullscreen()}
                aria-label={isFullscreen ? 'Vollbild beenden' : 'Vollbild aktivieren'}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 whitespace-nowrap shrink-0 cursor-pointer"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                ) : (
                  <Maximize2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                )}
                <span>{isFullscreen ? 'Vollbild aus' : 'Vollbild'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={toggleMute}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 whitespace-nowrap shrink-0 cursor-pointer"
            >
              {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{muted ? 'Ton aus' : 'Ton an'}</span>
            </button>
          </div>
        </header>

        {toastMessage && (
          <div
            role="status"
            className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 bg-slate-900 border border-amber-500/70 text-amber-200 text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xl max-w-md text-center"
          >
            {toastMessage}
          </div>
        )}

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
    if (activeCase.id === CASE4_MALTA.id) {
      if (
        state.currentChapterId === 'f4_epilog_athen' ||
        Boolean(state.flags.flag_f4_epilog_fertig)
      ) {
        return (
          <AnimatedOutro
            muted={muted}
            slides={CASE4_EPILOG_OUTRO_SLIDES}
            cliffhangerTitle="ENDE"
            finishButtonLabel="Abspann ansehen"
            accentVariant="ending"
            onComplete={() =>
              setState((prev) => ({
                ...prev,
                screen: 'CREDITS',
              }))
            }
          />
        );
      }

      if (
        state.currentChapterId === 'f4_finale_verhandlung' ||
        Boolean(state.flags.flag_f4_kapitaen_gestanden)
      ) {
        return (
          <AnimatedOutro
            muted={muted}
            slides={CASE4_FINALE_OUTRO_SLIDES}
            cliffhangerTitle="Übergang zum Epilog: Heimathafen Athen"
            finishButtonLabel="Weiter zum Epilog"
            accentVariant="ending"
            onComplete={() =>
              setState((prev) => ({
                ...prev,
                screen: 'PLAYING',
                pendingChapterTransition: {
                  completedChapterTitle: 'Fall 4 abgeschlossen',
                  completedTimeLabel: 'Die Wahrheit an Bord · Einlaufen in Athen',
                  summary:
                    'Vor dem ganzen Ballsaal hast du Beweis 4 (den zu „A. H.“ manipulierten Brief an „A. W.“) und die Chronometer-Fälschung aus Malta entlarvt und über die vier Bereichs-Zeugen bewiesen, dass nur ein einziger General-Schlüssel alle fünf Tatorte verband. Hinter der Bühne gestand Kapitän Albert Werner Brammer den Tausch und die Verzweiflungstat an Arthur Morgan — und heute Morgen läuft die MS Aurora endlich in ihren Heimathafen Athen ein.',
                  nextChapterId: 'f4_epilog_athen',
                  nextLocationId: 'athens_harbor',
                  nextPhase: 'investigation',
                  nextTimeOfDay: 'tag',
                  resetLocations: ['athens_harbor'],
                  isComingSoon: false,
                  nextButtonLabel: 'Weiter zum Epilog: Ausschiffung in Athen',
                  nextIntroLines: [...F4_EPILOG_INTRO_LINES],
                },
              }))
            }
          />
        );
      }

      return (
        <AnimatedOutro
          muted={muted}
          slides={CASE4_PART1_OUTRO_SLIDES}
          cliffhangerTitle="Übergang in die letzte Verhandlung!"
          finishButtonLabel="Teil 1 von Fall 4 abschließen"
          onComplete={() =>
            setState((prev) => ({
              ...prev,
              screen: 'PLAYING',
              pendingChapterTransition: {
                completedChapterTitle: 'Fall 4 (Teil 1) abgeschlossen',
                completedTimeLabel: 'Valletta beendet · Die letzte Verhandlung wartet',
                summary:
                  'Im Sicherheitsraum hast du bewiesen, dass der 45.000-€-Brief nachträglich manipuliert wurde („A. W.“ oder „A. H.“) und keinerlei Kontoverbindung existiert. Auf Malta führte ein berühmter Repliken-Händler dich auf die Spur einer maßgefertigten Chronometer-Kopie für einen echten Kapitän — und der Abgleich mit der 1924er Flotten-Chronik entlarvte den Goldenen Schiffs-Chronometer als Fälschung!',
                nextChapterId: 'f4_finale_verhandlung',
                nextLocationId: 'courtroom',
                nextPhase: 'court',
                nextTimeOfDay: 'abend',
                unlocksLocations: ['courtroom'],
                isComingSoon: false,
                nextButtonLabel: 'Weiter: Die letzte Verhandlung (Großer Ballsaal)',
                nextIntroLines: [...F4_FINALE_INTRO_LINES],
              },
            }))
          }
        />
      );
    }

    if (activeCase.id === CASE3_SEETAG.id) {
      return (
        <AnimatedOutro
          muted={muted}
          slides={CASE3_ST2_OUTRO_SLIDES}
          cliffhangerTitle="Fortsetzung in Fall 4: Die Spur nach Malta!"
          finishButtonLabel="Fall 3 abschließen"
          onComplete={() =>
            setState((prev) => ({
              ...prev,
              screen: 'PLAYING',
              pendingChapterTransition: {
                completedChapterTitle: 'Fall 3 abgeschlossen',
                completedTimeLabel: 'Kurs auf Malta · Verhandlung vertagt',
                summary:
                  'Im Großen Ballsaal hast du drei von vier Pfeilern von Falks Anklage zerlegt: das manipulierte MS-400-Handbuch, Andrews im Fundbüro F-418 gelandeten Schal und Kalle Jensens Alibi-Sichtung um 02:12 Uhr auf Deck 10. Wegen des noch offenen 45.000-€-Briefs (Aufgabe 4) hat Richter Pendelton die Verhandlung bis morgen vertagt und Andrew unter Detective Marstons persönlicher Bürgschaft vorläufig freigelassen. Morgen legt die MS Aurora in Malta an!',
                nextChapterId: CASE4_MALTA.id,
                nextLocationId: 'promenade',
                nextPhase: 'investigation',
                nextTimeOfDay: 'tag',
                isComingSoon: false,
                nextButtonLabel: 'Weiter zu Fall 4: Die Spur nach Malta',
                nextIntroLines: [],
              },
            }))
          }
        />
      );
    }

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
                  nextChapterId: CASE3_SEETAG.id,
                  nextLocationId: 'promenade',
                  nextPhase: 'investigation',
                  nextTimeOfDay: 'tag',
                  isComingSoon: false,
                  nextButtonLabel: 'Weiter zu Fall 3: Unschuldig auf hoher See',
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

  // HORIZONTAL SCROLLING END CREDITS
  if (state.screen === 'CREDITS') {
    return (
      <HorizontalCredits
        muted={muted}
        onFinish={() => setState((prev) => ({ ...prev, screen: 'VICTORY' }))}
        onReturnToMenu={() => setState((prev) => ({ ...prev, screen: 'TITLE_MENU' }))}
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
              {activeCase.id === CASE4_MALTA.id && (
                <button
                  type="button"
                  onClick={() => setState((prev) => ({ ...prev, screen: 'CREDITS' }))}
                  className="w-full px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Abspann erneut ansehen
                </button>
              )}
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
    <div className="min-h-screen min-h-dvh bg-slate-950 text-slate-100 flex flex-col">
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
            <PWAInstallButton compact />
            {isFullscreenSupported && (
              <button
                type="button"
                onClick={() => void handleToggleFullscreen()}
                aria-label={isFullscreen ? 'Vollbild beenden' : 'Vollbild aktivieren'}
                title={isFullscreen ? 'Vollbild beenden' : 'Vollbild (wie Videoplayer)'}
                className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 cursor-pointer"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4 text-amber-400" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>
            )}
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
            const canceledGame = activeMiniGame;
            setActiveMiniGame(null);
            const hotspotResetMap: Partial<Record<MiniGameId, string>> = {
              cooling_pipes: 'c2_a2_klima_panel',
              ship_plan: 'hs_f3_schiffsplan',
              kowalski_books_hidden: 'hs_f3_kowalski_werkbank',
              vip_sokoban: 'hs_f3_vip_servierwagen',
              vip_photo_search: 'hs_f3_vip_tablet',
              fundbuero_log: 'hs_f3_fundbuero_buch',
              duty_roster_puzzle: 'hs_f3_bridge_dienstplan',
              alibi_route_map: 'hs_f3_pooldeck_karte',
              letter_forensics: 'hs_f4_brief_tisch',
              library_books_hidden: 'hs_f4_bibliothek_regal',
              chronometer_compare: 'hs_f4_vitrine_hinweis',
            };
            const resetHotspotId = canceledGame ? hotspotResetMap[canceledGame] : undefined;
            if (resetHotspotId && canceledGame !== 'ship_plan') {
              setState((prev) => ({
                ...prev,
                inspectedHotspots: prev.inspectedHotspots.filter(
                  (id) => id !== resetHotspotId
                ),
              }));
            }
            if (canceledGame === 'ship_plan') {
              const firstAbortDone = Boolean(state.flags.flag_f3_plan_abbruch_1);
              const secondAbortDone = Boolean(state.flags.flag_f3_plan_abbruch_2);
              setState((prev) => ({
                ...prev,
                inspectedHotspots: prev.inspectedHotspots.filter(
                  (id) => id !== 'hs_f3_schiffsplan'
                ),
                flags: {
                  ...prev.flags,
                  flag_f3_plan_abbruch_1: true,
                  ...(firstAbortDone
                    ? {
                        flag_f3_plan_abbruch_2: true,
                        flag_f3_eleonore_notizhilfe: true,
                      }
                    : {}),
                },
              }));
              if (firstAbortDone && !secondAbortDone) {
                enqueueLines([
                  {
                    speakerId: 'eleonore',
                    emotion: 'blushing',
                    sfx: 'thought_pop',
                    text: 'Oh je, Nate… es tut mir ja so schrecklich leid! Ich wusste überhaupt nicht, dass man sich als Assistentin bei so vielen Angaben direkt Notizen machen muss!',
                  },
                  {
                    speakerId: 'eleonore',
                    emotion: 'confident',
                    text: 'Aber eben beim Zuhören hab ich mir blitzschnell alle acht Ausschluss-Punkte von Miriam komplett in meinen kleinen Spiralblock gekritzelt! Beim nächsten Blick auf den Schiffsplan können Sie oben rechts einfach meine „8 Notizen“ aufklappen — und Ihre bisherige Auswahl bleibt natürlich gespeichert!',
                  },
                ]);
              } else {
                enqueueLines([
                  {
                    speakerId: 'nate',
                    emotion: 'thinking',
                    text: 'Keine Eile — unsere Markierungen am Schiffsplan bleiben gespeichert. Fragen wir Miriam einfach nochmal nach den Details, die uns noch fehlen!',
                  },
                ]);
              }
            }
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

      {/* Restart Options & Chapter Selection Modal */}
      {showRestartModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Neustart und Kapitelauswahl"
          onClick={() => setShowRestartModal(false)}
        >
          <div
            className="w-full max-w-lg max-h-[90vh] flex flex-col bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-slate-800 shrink-0">
              <div>
                <h3
                  onClick={handleSecretDevTap}
                  className="font-display text-lg font-bold text-slate-100 select-none"
                >
                  Neustart & Kapitelauswahl
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Starte ab dem aktuellen Stand oder springe direkt an den Anfang einer Ermittlung bzw. Verhandlung.
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

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {(state.chapterCheckpoint || state.trialCheckpoint) && (
                <div className="flex flex-col gap-2">
                  {state.chapterCheckpoint && (
                    <button
                      type="button"
                      onClick={() => restoreCheckpoint(state.chapterCheckpoint!)}
                      className="w-full text-left px-4 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg transition-colors cursor-pointer"
                    >
                      <div className="text-xs font-bold">
                        Aktuellen Abschnitt neu starten
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
                        Letztes Verhör wiederholen
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                        {state.trialCheckpoint.label}
                      </div>
                    </button>
                  )}
                </div>
              )}

              <div className="space-y-2.5">
                <div className="text-[11px] font-semibold tracking-wide text-slate-400">
                  Kapitelauswahl ({activeCase.badgeLabel ?? activeCase.title})
                </div>

                <div className="space-y-2">
                  {getChapterJumpOptions(activeCase.id).map((chapter) => {
                    const isCurrent = state.currentChapterId === chapter.id;
                    return (
                      <div
                        key={chapter.id}
                        className={`rounded-lg border p-3 space-y-2 ${
                          isCurrent
                            ? 'bg-slate-800/80 border-amber-500/40'
                            : 'bg-slate-950/60 border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <div className="text-xs font-bold text-slate-100">
                              {chapter.chapterLabel}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {chapter.chapterTitle}
                            </div>
                          </div>
                          {isCurrent && (
                            <span className="text-[10px] font-semibold text-amber-400 shrink-0">
                              Aktuell
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {chapter.investigation && (
                            <button
                              type="button"
                              onClick={() =>
                                restoreCheckpoint(
                                  chapter.investigation!.createCheckpoint(),
                                  true
                                )
                              }
                              className="text-left px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 rounded-md transition-colors cursor-pointer"
                            >
                              <div className="text-xs font-semibold text-amber-300">
                                {chapter.investigation.label}
                              </div>
                              <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                                {chapter.investigation.subtitle}
                              </div>
                            </button>
                          )}
                          {chapter.trial && (
                            <button
                              type="button"
                              onClick={() =>
                                restoreCheckpoint(
                                  chapter.trial!.createCheckpoint(),
                                  true
                                )
                              }
                              className="text-left px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 rounded-md transition-colors cursor-pointer"
                            >
                              <div className="text-xs font-semibold text-sky-300">
                                {chapter.trial.label}
                              </div>
                              <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                                {chapter.trial.subtitle}
                              </div>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {activeCase.id === CRETE_CASE.id && devShortcutsUnlocked && (
                    <button
                      type="button"
                      onClick={() => restoreCheckpoint(createCreteAct24Checkpoint(), true)}
                      className="w-full text-left px-3.5 py-2.5 bg-amber-950/40 hover:bg-amber-900/40 border border-amber-500/30 text-amber-200 rounded-lg transition-colors cursor-pointer"
                    >
                      <div className="text-xs font-semibold">
                        Zu Akt 2.4 springen (Eleonore im Zeugenstand)
                      </div>
                      <div className="text-[10px] text-amber-300/75 mt-0.5">
                        Zusatz-Szene · ab Tag 4 Abend
                      </div>
                    </button>
                  )}
                </div>
              </div>

              <div className="pt-1 flex flex-col gap-2">
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
                    Zwischen allen Fällen wechseln
                  </div>
                </button>
              </div>
            </div>

            <div className="flex justify-end px-6 py-3 border-t border-slate-800 bg-slate-900 shrink-0">
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

export default function App() {
  return (
    <GameErrorBoundary>
      <AdvokatEngineApp />
      <OfflineIndicator />
    </GameErrorBoundary>
  );
}
