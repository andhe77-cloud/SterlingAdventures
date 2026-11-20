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
import { AnimatedOutro } from './components/AnimatedOutro';
import { CaseBinder, type BinderTab } from './components/CaseBinder';
import { GameStage, type InvestigationMenu } from './components/GameStage';
import { CRUISE_CASE } from './data/cruiseCase';
import type {
  Character,
  CheckpointEntry,
  DialogLine,
  GameCheckpointSnapshot,
  GameSaveState,
  ShoutType,
} from './types/game';
import { soundFx } from './utils/soundFx';

const ACTIVE_CASE = CRUISE_CASE;
const STORAGE_KEY = 'advokat_engine_save_v4';

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

function createInitialState(): GameSaveState {
  return {
    screen: 'TITLE_MENU',
    phase: 'investigation',
    currentChapterId: ACTIVE_CASE.initialChapterId ?? 'kap1_tag1_abend',
    pendingChapterTransition: null,
    credibility: 5,
    maxCredibility: 5,
    currentLocationId: ACTIVE_CASE.initialLocationId,
    unlockedLocations: [...ACTIVE_CASE.initialUnlockedLocations],
    collectedEvidence: [...ACTIVE_CASE.initialEvidenceIds],
    unlockedThoughts: [...ACTIVE_CASE.initialThoughtIds],
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
    unlockedThoughts: Object.keys(ACTIVE_CASE.thoughts),
    solvedDeductions: ACTIVE_CASE.logicCombinations.map((c) => c.id),
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
    label: ACTIVE_CASE.chapters?.kap4_tag3_morgen?.dayLabel ?? 'Tag 3 · Morgen',
    introLines: [...KAP4_MORGEN_INTRO_LINES],
    snapshot,
  };
}

function loadSavedState(): GameSaveState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GameSaveState;
    if (!parsed || !parsed.currentLocationId) return null;
    return parsed;
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
  const [state, setState] = useState<GameSaveState>(() => createInitialState());
  const [hasSave, setHasSave] = useState<boolean>(() => Boolean(loadSavedState()));
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

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  // Persist playing state automatically
  useEffect(() => {
    if (state.screen === 'PLAYING') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        setHasSave(true);
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
    if (!topLine) return;

    if (topLine.shout) {
      setActiveShout(topLine.shout);
      soundFx.playShout(topLine.shout);
      const t = window.setTimeout(() => setActiveShout(null), 1150);
      return () => window.clearTimeout(t);
    }
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
        const ev = ACTIVE_CASE.evidence[topLine.unlocksEvidence];
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
        const ev = ACTIVE_CASE.evidence[topLine.removesEvidence];
        if (ev) showToast(`Zurückgelegt: ${ev.name}`);
        if (!unlockAudio) unlockAudio = 'page_turn';
        changed = true;
      }

      if (
        topLine.unlocksThought &&
        !prev.unlockedThoughts.includes(topLine.unlocksThought)
      ) {
        next.unlockedThoughts = [...prev.unlockedThoughts, topLine.unlocksThought];
        const th = ACTIVE_CASE.thoughts[topLine.unlocksThought];
        if (th) showToast(`Notizbuch aktualisiert: ${th.title}`);
        if (!unlockAudio) unlockAudio = 'thought_pop';
        changed = true;
      }

      if (
        topLine.unlocksLocation &&
        !prev.unlockedLocations.includes(topLine.unlocksLocation)
      ) {
        next.unlockedLocations = [...prev.unlockedLocations, topLine.unlocksLocation];
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
  }, [topLine, showToast]);

  const startNewGame = () => {
    const fresh = createInitialState();
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
      const playingState: GameSaveState = { ...prev, screen: 'PLAYING' };
      const chapterCheckpoint: CheckpointEntry = {
        label:
          ACTIVE_CASE.chapters?.[playingState.currentChapterId]?.dayLabel ??
          'Tag 1 · Abend',
        introLines: [...ACTIVE_CASE.introLines],
        snapshot: extractCheckpointSnapshot(playingState),
      };
      return { ...playingState, chapterCheckpoint };
    });
    setDialogQueue([...ACTIVE_CASE.introLines]);
  }, []);

  const continueGame = () => {
    const saved = loadSavedState();
    if (!saved) {
      startNewGame();
      return;
    }
    saved.screen = 'PLAYING';
    if (
      saved.currentChapterId === 'kap3_tag2_abend' &&
      !saved.unlockedLocations.includes('cabin_312')
    ) {
      saved.unlockedLocations = [...saved.unlockedLocations, 'cabin_312'];
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

    if (finished.startsTestimonyId) {
      const testimonyId = finished.startsTestimonyId;
      const testimony = ACTIVE_CASE.testimonies[testimonyId];
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
        setDialogQueue([
          {
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

      let nextUnlocked = prev.unlockedLocations.filter((id) => !locks.has(id));
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
        pendingChapterTransition: null,
        activeTestimonyId:
          transition.nextPhase === 'court' ? prev.activeTestimonyId : null,
        statementIndex: transition.nextPhase === 'court' ? prev.statementIndex : 0,
      };

      const chapterLabel =
        ACTIVE_CASE.chapters?.[transition.nextChapterId]?.dayLabel ??
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

  const currentLocation =
    ACTIVE_CASE.locations[state.currentLocationId] ??
    ACTIVE_CASE.locations[ACTIVE_CASE.initialLocationId];

  const presentCharacters = useMemo<Character[]>(() => {
    if (currentLocation.charactersPresent && currentLocation.charactersPresent.length > 0) {
      return currentLocation.charactersPresent
        .filter(
          (entry) =>
            (!entry.visibleIfFlag || Boolean(state.flags[entry.visibleIfFlag])) &&
            (!entry.hideIfFlag || !state.flags[entry.hideIfFlag])
        )
        .map((entry) => ACTIVE_CASE.characters[entry.characterId])
        .filter((char): char is Character => Boolean(char));
    }
    if (currentLocation.characterId && ACTIVE_CASE.characters[currentLocation.characterId]) {
      return [ACTIVE_CASE.characters[currentLocation.characterId]];
    }
    return [];
  }, [currentLocation, state.flags]);

  const activeTestimony = state.activeTestimonyId
    ? ACTIVE_CASE.testimonies[state.activeTestimonyId]
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
    const target = ACTIVE_CASE.locations[locationId];
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
      if (evidenceId === prompt.correctEvidenceId) {
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
        showToast('Staatsanwalt Falk schlägt sich die Hand vor den Kopf – kein Motivbeweis!');
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
              ? ACTIVE_CASE.characters[rule.targetCharacterId]
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
    const item = ACTIVE_CASE.evidence[evidenceId];
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
    const match = ACTIVE_CASE.logicCombinations.find(
      (combo) =>
        !state.solvedDeductions.includes(combo.id) &&
        ((combo.thoughtA === thoughtA && combo.thoughtB === thoughtB) ||
          (combo.thoughtA === thoughtB && combo.thoughtB === thoughtA))
    );

    if (!match) {
      soundFx.play('penalty');
      showToast('Diese beiden Hinweise ergeben noch keine neue Schlussfolgerung.');
      return;
    }

    const nextFlags = match.setsFlag
      ? { ...state.flags, [match.setsFlag]: true }
      : state.flags;

    const shouldUnlockCourtroom =
      ACTIVE_CASE.courtroomLocationId &&
      ACTIVE_CASE.courtroomUnlockFlags &&
      ACTIVE_CASE.courtroomUnlockFlags.every((flag) => Boolean(nextFlags[flag])) &&
      !state.unlockedLocations.includes(ACTIVE_CASE.courtroomLocationId);

    const shouldFinishChapter3 =
      state.currentChapterId === 'kap3_tag2_abend' &&
      Boolean(nextFlags['flag_kap3_trick_geloest']) &&
      Boolean(nextFlags['flag_kap3_motiv_geloest']);

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
              text: 'Stimmt… morgen früh legen wir ihm vor Judge Pendelton endgültig das Handwerk. Und sobald das Urteil steht, schaut sich Frank seine Bankunterlagen an – irgendetwas Größeres steckt da noch dahinter.',
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
        : [];

    setState((prev) => {
      const unlockedLocs = [...prev.unlockedLocations];
      if (match.unlocksLocationId && !unlockedLocs.includes(match.unlocksLocationId)) {
        unlockedLocs.push(match.unlocksLocationId);
      }
      if (
        shouldUnlockCourtroom &&
        ACTIVE_CASE.courtroomLocationId &&
        !unlockedLocs.includes(ACTIVE_CASE.courtroomLocationId)
      ) {
        unlockedLocs.push(ACTIVE_CASE.courtroomLocationId);
      }

      return {
        ...prev,
        solvedDeductions: [...prev.solvedDeductions, match.id],
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
          <span className="font-display text-lg font-bold tracking-wide text-amber-400 whitespace-nowrap shrink-0">
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

        <main className="flex-1 flex items-center justify-center px-6 py-10">
          <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-xl p-8 sm:p-10 flex flex-col justify-between gap-8 shadow-2xl">
            <div className="space-y-4">
              <div className="text-xs font-medium text-amber-400">
                Kreuzfahrt-Fall · MS Aurora
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-50 leading-tight text-balance">
                {ACTIVE_CASE.title}
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {ACTIVE_CASE.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={startNewGame}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Neues Spiel starten
              </button>
              {hasSave && (
                <button
                  type="button"
                  onClick={continueGame}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm font-semibold rounded-lg border border-slate-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Spielstand fortsetzen
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ANIMATED INTRO CUTSCENE
  if (state.screen === 'INTRO_CUTSCENE') {
    return (
      <AnimatedIntro
        caseTitle={ACTIVE_CASE.title}
        onComplete={handleFinishIntro}
      />
    );
  }

  // ANIMATED OUTRO CUTSCENE (Piano Epilog & Crete Cliffhanger)
  if (state.screen === 'OUTRO_CUTSCENE') {
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
              {isWin ? 'FALL 1 ABGESCHLOSSEN!' : 'Verfahren vertagt'}
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              {isWin
                ? 'Anya Brooks wurde endgültig freigesprochen und Arthur Morgan verhaftet – doch als vor dem Hafen von Kreta plötzlich alle Ausgänge abgeriegelt werden, beginnt erst das wahre Rätsel… (Fortsetzung folgt in Fall 2!)'
                : 'Deine Glaubwürdigkeit vor Gericht ist aufgebraucht. Du kannst direkt ab dem letzten Checkpoint weitermachen – mit voller Glaubwürdigkeit!'}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 py-3 border-y border-slate-800 text-xs">
            <div>
              <div className="text-slate-400">Beweise</div>
              <div className="font-mono-num text-base font-bold text-slate-100 mt-0.5">
                {state.collectedEvidence.length}/{Object.keys(ACTIVE_CASE.evidence).length}
              </div>
            </div>
            <div>
              <div className="text-slate-400">Deduktionen</div>
              <div className="font-mono-num text-base font-bold text-slate-100 mt-0.5">
                {state.solvedDeductions.length}/{ACTIVE_CASE.logicCombinations.length}
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
                  onClick={startNewGame}
                  className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-medium rounded-lg border border-slate-800 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Neues Spiel
                </button>
                <button
                  type="button"
                  onClick={() => setState((prev) => ({ ...prev, screen: 'TITLE_MENU' }))}
                  className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-medium rounded-lg border border-slate-800 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Zum Hauptmenü
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {trialCp && (
                <button
                  type="button"
                  onClick={() => restoreCheckpoint(trialCp)}
                  className="w-full px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Letzte Verhandlung prüfen ({trialCp.label})
                </button>
              )}
              <div className="flex items-center justify-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={startNewGame}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold rounded-lg border border-slate-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Nochmal spielen
                </button>
                <button
                  type="button"
                  onClick={() => setState((prev) => ({ ...prev, screen: 'TITLE_MENU' }))}
                  className="px-5 py-2.5 bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-lg border border-slate-800 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Zum Hauptmenü
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
                {ACTIVE_CASE.chapters?.[state.currentChapterId]?.dayLabel ?? 'Tag 1 · Abend'}
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
          gameCase={ACTIVE_CASE}
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
        />
      </main>

      {/* Slide-Over Binder Drawer (Gerichtsakte / Notizbuch / Struktur) */}
      {activeBinderTab && (
        <CaseBinder
          gameCase={ACTIVE_CASE}
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
                <h3 className="font-display text-lg font-bold text-slate-100">
                  Neustart wählen
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Starte ab dem aktuellen Kapitelanfang, dem letzten Verhör oder beginne den kompletten Fall von vorn.
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

              <button
                type="button"
                onClick={startNewGame}
                className="w-full text-left px-4 py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                <div className="text-xs font-semibold">
                  Komplettes Spiel neu starten
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Zurück zum Intro & Tag 1 · Abend
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
