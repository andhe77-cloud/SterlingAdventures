import type { CheckpointEntry, DialogLine, GameCheckpointSnapshot } from '../types/game';
import { CRUISE_CASE } from './cruiseCase';
import { CRETE_ACT23_INTRO_LINES, CRETE_CASE } from './creteCase';
import { CASE3_SEETAG } from './case3Seetag';

export interface ChapterPhaseJump {
  label: string;
  subtitle: string;
  createCheckpoint: () => CheckpointEntry;
}

export interface ChapterJumpOption {
  id: string;
  chapterLabel: string;
  chapterTitle: string;
  investigation?: ChapterPhaseJump;
  trial?: ChapterPhaseJump;
}

export const KAP4_MORGEN_INTRO_LINES: DialogLine[] = [
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

const KAP2_MORGEN_INTRO_LINES: DialogLine[] = [
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
];

const KAP3_ABEND_INTRO_LINES: DialogLine[] = [
  {
    speakerId: 'maya',
    emotion: 'thinking',
    text: 'Tag 2, Abenddämmerung… Die ganze MS Aurora tuschelt über den Chronometer-Fund in Anyas Kabine 312.',
  },
  {
    speakerId: 'marston',
    emotion: 'neutral',
    text: 'Ich hab Kabine 312 erstmal abgesperrt und warte unten direkt im Zimmer auf dich, Nate. Offiziell darf niemand rein – aber für dich mach ich die Tür einen Spalt auf.',
  },
  {
    speakerId: 'nate',
    emotion: 'confident',
    text: 'Danke, Frank! Und sieh mal dort vorn an der Reling – Arthur Morgan grinst schon so selbstgefällig. Schauen wir uns erst Kabine 312 und den VIP-Salon genau an, bevor wir ihn stellen!',
  },
];

const CRETE_ACT22_TRIAL_INTRO_LINES: DialogLine[] = [
  {
    speakerId: 'pendelton',
    emotion: 'neutral',
    sfx: 'gavel_double',
    text: 'Ruhe im Großen Ballsaal! Auf dringenden Antrag von Kommissar Dimitri eröffne ich hiermit eine außerordentliche Mittags-Anhörung zu den Vorgängen der letzten Nacht.',
  },
  {
    speakerId: 'pendelton',
    emotion: 'neutral',
    text: 'Wir klären Punkt für Punkt, was in Zelle 08 wirklich geschehen ist. Als ersten Zeugen rufe ich in den Stand: Sicherheitsoffizier Lukas Brandt!',
    startsTestimonyId: 'testimony_c2_brandt_kurz',
  },
];

const CRETE_ACT23_TRIAL_INTRO_LINES: DialogLine[] = [
  {
    speakerId: 'cruisemanager',
    emotion: 'confident',
    sfx: 'alarm',
    text: 'BORDDURCHSAGE AN ALLE PASSAGIERE! Hier spricht Ihre Kreuzfahrtmanagerin Sabine Lindemann! Sichern Sie sich schnell einen guten Platz im Großen Ballsaal – unsere große Abend-Gerichtsshow mit Strafverteidiger Nate Sterling startet in genau fünf Minuten!!',
  },
  {
    speakerId: 'maya',
    emotion: 'confident',
    text: 'Das war unser Stichwort, Nate! Wir wissen endlich, dass der blaue Schal Andrews verschwundenes Exemplar ist, wir haben die geheime 15-Minuten-Stromlücke im MS-400 UND Dr. Vances Toxikologie-Gutachten!',
  },
  {
    speakerId: 'nate',
    emotion: 'confident',
    text: 'Na schön – lösen wir unser Versprechen gegenüber Frau Lindemann ein und beenden dieses Selbstmord-Märchen ein für alle Mal vor dem ganzen Schiff!',
    startsTestimonyId: 'testimony_c2_a3_vance',
  },
];

// =============================================================================
// FALL 1 CHECKPOINTS
// =============================================================================

export function createCruiseKap1Checkpoint(): CheckpointEntry {
  const snapshot: GameCheckpointSnapshot = {
    caseId: CRUISE_CASE.id,
    screen: 'PLAYING',
    phase: 'investigation',
    currentChapterId: 'kap1_tag1_abend',
    pendingChapterTransition: null,
    credibility: 5,
    maxCredibility: 5,
    currentLocationId: CRUISE_CASE.initialLocationId,
    unlockedLocations: [...CRUISE_CASE.initialUnlockedLocations],
    collectedEvidence: [...CRUISE_CASE.initialEvidenceIds],
    unlockedThoughts: [...CRUISE_CASE.initialThoughtIds],
    solvedDeductions: [],
    flags: {},
    visitedTopics: [],
    inspectedHotspots: [],
    activeTestimonyId: null,
    statementIndex: 0,
  };
  return {
    label: 'Kapitel 1 · Ermittlung (Tag 1 · Abend)',
    introLines: [...CRUISE_CASE.introLines],
    snapshot,
  };
}

export function createCruiseKap2TrialCheckpoint(): CheckpointEntry {
  const snapshot: GameCheckpointSnapshot = {
    caseId: CRUISE_CASE.id,
    screen: 'PLAYING',
    phase: 'court',
    currentChapterId: 'kap2_tag2_morgen',
    pendingChapterTransition: null,
    credibility: 5,
    maxCredibility: 5,
    currentLocationId: 'courtroom',
    unlockedLocations: ['deck', 'suite', 'brig', 'courtroom'],
    collectedEvidence: [
      'anwaltsausweis',
      'tatort_notiz',
      'vitrine_glocke',
      'weinglas_spur',
      'musik_alibi',
      'balkon_fluchtweg',
      'keycard_log',
    ],
    unlockedThoughts: [
      'thought_vitrine_inszeniert',
      'thought_anya_alibi',
      'thought_balkon_weg',
      'thought_keycard_log',
      'thought_zeit_manipuliert',
      'thought_flucht_und_luege',
    ],
    solvedDeductions: ['combo_1', 'combo_2'],
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
    },
    visitedTopics: [],
    inspectedHotspots: [],
    activeTestimonyId: null,
    statementIndex: 0,
  };
  return {
    label: 'Kapitel 2 · Verhandlung (Tag 2 · Morgen)',
    introLines: [...KAP2_MORGEN_INTRO_LINES],
    snapshot,
  };
}

export function createCruiseKap3Checkpoint(): CheckpointEntry {
  const snapshot: GameCheckpointSnapshot = {
    caseId: CRUISE_CASE.id,
    screen: 'PLAYING',
    phase: 'investigation',
    currentChapterId: 'kap3_tag2_abend',
    pendingChapterTransition: null,
    credibility: 5,
    maxCredibility: 5,
    currentLocationId: 'deck',
    unlockedLocations: ['deck', 'suite', 'brig', 'cabin_312'],
    collectedEvidence: [
      'anwaltsausweis',
      'tatort_notiz',
      'vitrine_glocke',
      'weinglas_spur',
      'musik_alibi',
      'balkon_fluchtweg',
      'keycard_log',
      'chronometer_kabine_fund',
    ],
    unlockedThoughts: [
      'thought_vitrine_inszeniert',
      'thought_anya_alibi',
      'thought_balkon_weg',
      'thought_keycard_log',
      'thought_zeit_manipuliert',
      'thought_flucht_und_luege',
    ],
    solvedDeductions: ['combo_1', 'combo_2'],
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
    },
    visitedTopics: [],
    inspectedHotspots: [],
    activeTestimonyId: null,
    statementIndex: 0,
  };
  return {
    label: 'Kapitel 3 · Ermittlung (Tag 2 · Abend)',
    introLines: [...KAP3_ABEND_INTRO_LINES],
    snapshot,
  };
}

export function createFinalTrialCheckpoint(): CheckpointEntry {
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
      'anwaltsausweis',
      'tatort_notiz',
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
    label: 'Kapitel 4 · Verhandlung (Tag 3 · Morgen)',
    introLines: [...KAP4_MORGEN_INTRO_LINES],
    snapshot,
  };
}

// =============================================================================
// FALL 2 CHECKPOINTS
// =============================================================================

export function createCreteAct21Checkpoint(): CheckpointEntry {
  const snapshot: GameCheckpointSnapshot = {
    caseId: CRETE_CASE.id,
    screen: 'PLAYING',
    phase: 'investigation',
    currentChapterId: 'c2_akt1_morgen',
    pendingChapterTransition: null,
    credibility: 5,
    maxCredibility: 5,
    currentLocationId: CRETE_CASE.initialLocationId,
    unlockedLocations: [...CRETE_CASE.initialUnlockedLocations],
    collectedEvidence: [...CRETE_CASE.initialEvidenceIds],
    unlockedThoughts: [...CRETE_CASE.initialThoughtIds],
    solvedDeductions: [],
    flags: {},
    visitedTopics: [],
    inspectedHotspots: [],
    activeTestimonyId: null,
    statementIndex: 0,
  };
  return {
    label: 'Akt 2.1 · Ermittlung (Tag 4 · Morgen)',
    introLines: [...CRETE_CASE.introLines],
    snapshot,
  };
}

export function createCreteAct22Checkpoint(): CheckpointEntry {
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
    label: 'Akt 2.2 · Ermittlung (Tag 4 · Mittag)',
    introLines,
    snapshot,
  };
}

export function createCreteAct22TrialCheckpoint(): CheckpointEntry {
  const snapshot: GameCheckpointSnapshot = {
    caseId: CRETE_CASE.id,
    screen: 'PLAYING',
    phase: 'court',
    currentChapterId: 'c2_akt2_mittag',
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
      'conrads_rucksack',
      'lueftung_streich',
      'keycard_fragment',
      'beweis_brandt_luegt',
      'zellen_klima_protokoll',
      'notiz_todeszeit_0210',
      'bruecken_log',
    ],
    unlockedThoughts: [
      'thought_c2_blockade',
      'thought_c2_0730_hafen',
      'thought_c2_brandt_dienst',
      'thought_c2_0210_poltern',
      'thought_c2_zeit_unmoeglich',
      'thought_c2_brandt_luegt',
      'thought_c2_kuehlung_9grad',
      'thought_c2_wahre_tatzeit',
      'thought_c2_keycard_ecke',
    ],
    solvedDeductions: ['c2_logic_brandt_zeit', 'c2_logic_brandt_luege'],
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
      flag_c2_a2_kids_suche_gestartet: true,
      flag_c2_a2_brandt_widerspruch_geloest: true,
      flag_c2_a2_zelle_offen: true,
      flag_c2_a2_seil_gesehen: true,
      flag_c2_a2_schloss_gesehen: true,
      flag_c2_a2_klima_geloest: true,
      flag_c2_a2_vance_temp_gefragt: true,
      flag_c2_a2_bruecke_freigeschaltet: true,
      flag_c2_a2_brandt_deck_done: true,
      flag_c2_tatzeit_geloest: true,
      flag_c2_rucksack_gefunden: true,
      flag_c2_conrad_geloest: true,
      flag_c2_a2_bruecke_geloest: true,
    },
    visitedTopics: [],
    inspectedHotspots: [],
    activeTestimonyId: null,
    statementIndex: 0,
  };
  return {
    label: 'Akt 2.2 · Verhandlung (Mittags-Anhörung)',
    introLines: [...CRETE_ACT22_TRIAL_INTRO_LINES],
    snapshot,
  };
}

export function createCreteAct23Checkpoint(): CheckpointEntry {
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
      flag_c2_a2_kids_suche_gestartet: true,
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
    label: 'Akt 2.3 · Ermittlung (Tag 4 · Nachmittag)',
    introLines: [...CRETE_ACT23_INTRO_LINES],
    snapshot,
  };
}

export function createCreteAct23TrialCheckpoint(): CheckpointEntry {
  const snapshot: GameCheckpointSnapshot = {
    caseId: CRETE_CASE.id,
    screen: 'PLAYING',
    phase: 'court',
    currentChapterId: 'c2_akt3_nachmittag',
    pendingChapterTransition: null,
    credibility: 5,
    maxCredibility: 5,
    currentLocationId: 'courtroom',
    unlockedLocations: [
      'promenade',
      'brig_cell',
      'switchroom',
      'infirmary',
      'bridge',
      'courtroom',
    ],
    collectedEvidence: [
      'ausweis_nate',
      'zellen_klima_protokoll',
      'andrews_verlorener_schal',
      'schloss_logbuch',
      'magnet_crash_protokoll',
      'spannungseinbruch_log',
      'obduktion_betaeubung',
    ],
    unlockedThoughts: [
      'thought_c2_kuehlung_9grad',
      'thought_c2_a3_schal_zwilling',
      'thought_c2_a3_gerichts_larp',
      'thought_c2_a3_magnetschloss',
      'thought_c2_a3_log_luecke',
      'thought_c2_a3_15min_luecke',
      'thought_c2_a3_arthur_betaeubt',
      'thought_c2_a3_mord_bewiesen',
    ],
    solvedDeductions: ['c2_logic_a3_log_zweifel', 'c2_logic_a3_mord_beweis'],
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
      flag_c2_a2_kids_suche_gestartet: true,
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
      flag_c2_a3_abgewiesen: true,
      flag_c2_a3_pass_erlaubnis: true,
      flag_c2_a3_andrew_in_zelle: true,
      flag_c2_a3_andrew_will_beweis: true,
      flag_c2_a3_strom_geprueft: true,
      flag_c2_a3_kowalski_hinweis: true,
      flag_c2_a3_andrew_verabschiedet: true,
      flag_c2_a3_obduktion_da: true,
      flag_c2_a3_showtime: true,
    },
    visitedTopics: [],
    inspectedHotspots: [],
    activeTestimonyId: null,
    statementIndex: 0,
  };
  return {
    label: 'Akt 2.3 · Verhandlung (Abend-Gerichtsshow)',
    introLines: [...CRETE_ACT23_TRIAL_INTRO_LINES],
    snapshot,
  };
}

export function createCreteAct24Checkpoint(): CheckpointEntry {
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
      flag_c2_a2_kids_suche_gestartet: true,
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
      flag_c2_rucksack_gefunden: true,
      flag_c2_conrad_geloest: true,
      flag_c2_dimitri_weg: true,
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

export function getChapterJumpOptions(caseId: string): ChapterJumpOption[] {
  if (caseId === CRUISE_CASE.id) {
    return [
      {
        id: 'kap1_tag1_abend',
        chapterLabel: 'Kapitel 1 · Tag 1 (Abend)',
        chapterTitle: 'Urlaub wider Willen & Spurensuche',
        investigation: {
          label: 'Anfang der Ermittlung',
          subtitle: 'Promenadendeck · erster Tatort',
          createCheckpoint: createCruiseKap1Checkpoint,
        },
      },
      {
        id: 'kap2_tag2_morgen',
        chapterLabel: 'Kapitel 2 · Tag 2 (Morgen)',
        chapterTitle: 'Der schnelle Freispruch',
        trial: {
          label: 'Anfang der Verhandlung',
          subtitle: 'Großer Ballsaal · erstes Tribunal',
          createCheckpoint: createCruiseKap2TrialCheckpoint,
        },
      },
      {
        id: 'kap3_tag2_abend',
        chapterLabel: 'Kapitel 3 · Tag 2 (Abend)',
        chapterTitle: 'Das falsche Spiel',
        investigation: {
          label: 'Anfang der Ermittlung',
          subtitle: 'Kabine 312 & Promenadendeck',
          createCheckpoint: createCruiseKap3Checkpoint,
        },
      },
      {
        id: 'kap4_tag3_morgen',
        chapterLabel: 'Kapitel 4 · Tag 3 (Morgen)',
        chapterTitle: 'Das große Finale',
        trial: {
          label: 'Anfang der Verhandlung',
          subtitle: 'Hauptverfahren · ab Kommissar Marston',
          createCheckpoint: createFinalTrialCheckpoint,
        },
      },
    ];
  }

  if (caseId === CASE3_SEETAG.id) {
    return [
      {
        id: 'f3_st1_suche_andrew',
        chapterLabel: 'Station 3.1 · Tag 5 (Seetag)',
        chapterTitle: 'Suche nach Andrew',
        investigation: {
          label: 'Anfang der Ermittlung',
          subtitle: 'Promenadendeck · Familienkabine & Rezeption',
          createCheckpoint: createCase3St1Checkpoint,
        },
      },
    ];
  }

  return [
    {
      id: 'c2_akt1_morgen',
      chapterLabel: 'Akt 2.1 · Tag 4 (Morgen)',
      chapterTitle: 'Ausgangssperre vor Kreta',
      investigation: {
        label: 'Anfang der Ermittlung',
        subtitle: 'Promenadendeck · Hafenblockade',
        createCheckpoint: createCreteAct21Checkpoint,
      },
    },
    {
      id: 'c2_akt2_mittag',
      chapterLabel: 'Akt 2.2 · Tag 4 (Mittag)',
      chapterTitle: 'Die letzte Seemeile',
      investigation: {
        label: 'Anfang der Ermittlung',
        subtitle: 'Krankenstation & Unterdeck',
        createCheckpoint: createCreteAct22Checkpoint,
      },
      trial: {
        label: 'Anfang der Verhandlung',
        subtitle: 'Großer Ballsaal · Mittags-Anhörung',
        createCheckpoint: createCreteAct22TrialCheckpoint,
      },
    },
    {
      id: 'c2_akt3_nachmittag',
      chapterLabel: 'Akt 2.3 · Tag 4 (Nachmittag)',
      chapterTitle: 'Der blaue Schal & das Magnetschloss',
      investigation: {
        label: 'Anfang der Ermittlung',
        subtitle: 'Strand-Rückblick & Schaltzentrale',
        createCheckpoint: createCreteAct23Checkpoint,
      },
      trial: {
        label: 'Anfang der Verhandlung',
        subtitle: 'Großer Ballsaal · Abend-Gerichtsshow',
        createCheckpoint: createCreteAct23TrialCheckpoint,
      },
    },
  ];
}

export function createCase3St1Checkpoint(): CheckpointEntry {
  const snapshot: GameCheckpointSnapshot = {
    caseId: CASE3_SEETAG.id,
    screen: 'PLAYING',
    phase: 'investigation',
    currentChapterId: 'f3_st1_suche_andrew',
    pendingChapterTransition: null,
    credibility: 5,
    maxCredibility: 5,
    currentLocationId: CASE3_SEETAG.initialLocationId,
    unlockedLocations: [...CASE3_SEETAG.initialUnlockedLocations],
    collectedEvidence: [...CASE3_SEETAG.initialEvidenceIds],
    unlockedThoughts: [...CASE3_SEETAG.initialThoughtIds],
    solvedDeductions: [],
    flags: {},
    visitedTopics: [],
    inspectedHotspots: [],
    activeTestimonyId: null,
    statementIndex: 0,
  };
  return {
    label: 'Station 3.1 · Suche nach Andrew (Tag 5 · Seetag)',
    introLines: [...CASE3_SEETAG.introLines],
    snapshot,
  };
}
