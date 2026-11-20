export type Emotion =
  | 'neutral'
  | 'confident'
  | 'shocked'
  | 'smug'
  | 'sweating'
  | 'thinking'
  | 'facepalm'
  | 'headshake';

export type PortraitAnimation =
  | 'facepalm'
  | 'headshake'
  | 'nod'
  | 'shock'
  | 'slam'
  | 'tremble';

export type ShoutType = 'EINSPRUCH!' | 'MOMENT MAL!' | 'VOLLTREFFER!' | 'NICHT SCHULDIG!';

export type SoundEffect =
  | 'blip'
  | 'gavel'
  | 'gavel_double'
  | 'objection'
  | 'deduction'
  | 'evidence_chime'
  | 'thought_pop'
  | 'penalty'
  | 'damage'
  | 'facepalm'
  | 'headshake'
  | 'page_turn'
  | 'bag_rummage'
  | 'door_lock'
  | 'victory'
  | 'alarm'
  | 'foghorn'
  | 'tension';

export interface Character {
  id: string;
  name: string;
  role: string;
  bio: string;
  accentColor: string;
  portraitUrl: string;
  portraits?: Partial<Record<Emotion, string>>;
  side?: 'left' | 'right' | 'center';
}

export interface EvidenceInspectRule {
  requiredFlag?: string;
  hideIfFlag?: string;
  lines: DialogLine[];
}

export interface EvidenceItem {
  id: string;
  name: string;
  category: 'evidence' | 'profile';
  iconName:
    | 'clock'
    | 'file'
    | 'receipt'
    | 'key'
    | 'trophy'
    | 'bolt'
    | 'user'
    | 'thermometer'
    | 'door'
    | 'wine'
    | 'search';
  summary: string;
  detail: string;
  updatedByFlag?: {
    flag: string;
    name?: string;
    summary?: string;
    detail: string;
  };
  inspectRules?: EvidenceInspectRule[];
}

export interface ThoughtNode {
  id: string;
  title: string;
  detail: string;
  kind: 'observation' | 'question' | 'deduction';
}

export interface LogicCombination {
  id: string;
  thoughtA: string;
  thoughtB: string;
  resultThoughtId: string;
  setsFlag?: string;
  unlocksLocationId?: string;
  requiresFlagForLocation?: string;
  feedbackLines: DialogLine[];
}

export interface DialogChoice {
  label: string;
  nextLines: DialogLine[];
}

export interface ChapterInfo {
  id: string;
  dayLabel: string;
  timeOfDay: 'abend' | 'tag';
  title: string;
  subtitle: string;
}

export interface ChapterTransition {
  completedChapterTitle: string;
  completedTimeLabel: string;
  summary: string;
  nextChapterId: string;
  nextLocationId: string;
  nextPhase: 'investigation' | 'court';
  nextButtonLabel?: string;
  nextTimeOfDay?: 'abend' | 'tag';
  unlocksLocations?: string[];
  locksLocations?: string[];
  nextIntroLines: DialogLine[];
}

export interface DialogLine {
  speakerId: string;
  emotion?: Emotion;
  animation?: PortraitAnimation;
  text: string;
  shout?: ShoutType;
  sfx?: SoundEffect;
  shake?: boolean;
  setsFlag?: string;
  unlocksEvidence?: string;
  removesEvidence?: string;
  unlocksThought?: string;
  unlocksLocation?: string;
  startsTestimonyId?: string;
  switchesLocationId?: string;
  setsPhase?: 'investigation' | 'court';
  completesChapter?: ChapterTransition;
  requiresFinalEvidencePrompt?: {
    question: string;
    correctEvidenceId: string;
    successLines: DialogLine[];
    wrongLines: DialogLine[];
  };
  choices?: DialogChoice[];
  triggersOutro?: boolean;
  winGame?: boolean;
}

export interface SceneHotspot {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  visibleIfFlag?: string;
  hideIfFlag?: string;
  lines: DialogLine[];
}

export interface TalkTopic {
  id: string;
  title: string;
  speakerId?: string;
  requiredFlag?: string;
  hideIfFlag?: string;
  lines: DialogLine[];
}

export interface PresentRule {
  evidenceId: string;
  targetCharacterId?: string;
  requiredFlag?: string;
  hideIfFlag?: string;
  lines: DialogLine[];
}

export interface SceneCharacterPresence {
  characterId: string;
  visibleIfFlag?: string;
  hideIfFlag?: string;
}

export interface LocationScene {
  id: string;
  name: string;
  subtitle: string;
  backgroundUrl: string;
  alternateBackground?: {
    flag: string;
    backgroundUrl: string;
  };
  characterId?: string;
  charactersPresent?: SceneCharacterPresence[];
  hotspots: SceneHotspot[];
  talkTopics: TalkTopic[];
  presentRules: PresentRule[];
  fallbackPresentLines: DialogLine[];
}

export interface TestimonyStatement {
  id: string;
  text: string;
  visibleIfFlag?: string;
  pressLines: DialogLine[];
  contradiction?: {
    requiredEvidenceId: string;
    alternativeEvidenceIds?: string[];
    successLines: DialogLine[];
  };
}

export interface Testimony {
  id: string;
  title: string;
  witnessId: string;
  introLines: DialogLine[];
  statements: TestimonyStatement[];
  wrongObjectionLines: DialogLine[];
}

export interface GameCase {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  initialChapterId?: string;
  chapters?: Record<string, ChapterInfo>;
  initialLocationId: string;
  initialUnlockedLocations: string[];
  initialEvidenceIds: string[];
  initialThoughtIds: string[];
  courtroomUnlockFlags?: string[];
  courtroomLocationId?: string;
  introLines: DialogLine[];
  characters: Record<string, Character>;
  evidence: Record<string, EvidenceItem>;
  thoughts: Record<string, ThoughtNode>;
  logicCombinations: LogicCombination[];
  locations: Record<string, LocationScene>;
  testimonies: Record<string, Testimony>;
}

export type GameCheckpointSnapshot = Omit<
  GameSaveState,
  'trialCheckpoint' | 'chapterCheckpoint'
>;

export interface CheckpointEntry {
  label: string;
  introLines?: DialogLine[];
  snapshot: GameCheckpointSnapshot;
}

export interface GameSaveState {
  screen:
    | 'TITLE_MENU'
    | 'INTRO_CUTSCENE'
    | 'PLAYING'
    | 'OUTRO_CUTSCENE'
    | 'VICTORY'
    | 'GAME_OVER';
  phase: 'investigation' | 'court';
  currentChapterId: string;
  pendingChapterTransition: ChapterTransition | null;
  credibility: number;
  maxCredibility: number;
  currentLocationId: string;
  unlockedLocations: string[];
  collectedEvidence: string[];
  unlockedThoughts: string[];
  solvedDeductions: string[];
  flags: Record<string, boolean>;
  visitedTopics: string[];
  inspectedHotspots: string[];
  activeTestimonyId: string | null;
  statementIndex: number;
  trialCheckpoint?: CheckpointEntry | null;
  chapterCheckpoint?: CheckpointEntry | null;
}
